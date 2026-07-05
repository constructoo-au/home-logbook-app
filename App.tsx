import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AppIcon,
  Card,
  CTAButton,
  ChatBubble,
  FolderCard,
  IconName,
  PathChips,
  Pill,
  ProgressStep,
  PropertyScopeChip,
  ReminderCard,
  Screen,
  SourceFilePreviewCard,
  StatusPill,
  SummaryCard,
  UploadSheet,
} from './src/components';
import {
  aiProcessingSteps,
  allRecords,
  completenessRows,
  daikinSummary,
  homeAddress,
  logbookViewFolders,
  FileStatus,
  LogbookViewName,
  propertyScopeOptions,
  PropertyScope,
  recentRecords,
  Reminder,
  reminders,
  smartScanSteps,
  SummaryRecord,
} from './src/mockData';
import { colors, fontFamily, radius, softShadow, spacing, warmShadow } from './src/theme';

type Stage = 'splash' | 'login' | 'main' | 'scan' | 'uploadFile' | 'uploadProcessing' | 'processing' | 'summary';
type Tab = 'Home' | 'Logbook' | 'Chat' | 'Profile';
type LogbookView = LogbookViewName;

const tabs: Tab[] = ['Home', 'Logbook', 'Chat', 'Profile'];
const defaultLogbookViews: LogbookView[] = ['WBS', 'Scope', 'Status', 'Document Type', 'Trade / System', 'Fixture / Asset', 'Room / Location', 'Evidence'];
const fileStatusOptions: FileStatus[] = ['Current', 'Superseded', 'Historical', 'Pending Review', 'Duplicate / Alternative Version'];
const logbookSearchSuggestions = ['waterproofing', 'Daikin', 'hot water', 'insurance', 'Granny Flat', 'invoice', 'warranty', 'Current', 'Duplicate'];
const constructooLogo = require('./assets/constructoo-logo-colour.png');
const recordById = Object.fromEntries(allRecords.map((record) => [record.id, record])) as Record<string, SummaryRecord>;
const tabIcons: Record<Tab, IconName> = { Home: 'home', Logbook: 'logbook', Chat: 'chat', Profile: 'profile' };
const viewIcons: Record<LogbookView, IconName> = {
  WBS: 'wbs',
  Scope: 'home',
  Status: 'certificate',
  'Document Type': 'documentType',
  'Trade / System': 'trade',
  'Fixture / Asset': 'fixture',
  'Room / Location': 'room',
  Evidence: 'evidence',
};

export default function App() {
  const [stage, setStage] = useState<Stage>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);
  const [summaryConfirmed, setSummaryConfirmed] = useState(false);
  const [pathSummary, setPathSummary] = useState<SummaryRecord | null>(null);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStage('login'), 1800);
    return () => clearTimeout(timer);
  }, []);

  const beginSmartScan = () => {
    setUploadSheetVisible(false);
    setTimeout(() => setStage('scan'), 220);
  };

  const beginUploadFile = () => {
    setUploadSheetVisible(false);
    setTimeout(() => setStage('uploadFile'), 220);
  };

  const openMainTab = (tab: Tab) => {
    setActiveTab(tab);
    setStage('main');
  };

  if (stage === 'splash') {
    return <SplashScreen />;
  }

  if (stage === 'login') {
    return <LoginScreen onLogin={() => setStage('main')} />;
  }

  if (stage === 'scan') {
    return <SmartScanScreen onBack={() => setStage('main')} onConfirm={() => setStage('processing')} />;
  }

  if (stage === 'uploadFile') {
    return <UploadFileScreen onBack={() => setStage('main')} onStartUpload={() => setStage('uploadProcessing')} />;
  }

  if (stage === 'uploadProcessing') {
    return <UploadProcessingScreen onDone={() => setStage('summary')} />;
  }

  if (stage === 'processing') {
    return <AIProcessingScreen onDone={() => setStage('summary')} />;
  }

  if (stage === 'summary') {
    return (
      <>
        <SummaryConfirmationScreen
          confirmed={summaryConfirmed}
          onConfirm={() => setSummaryConfirmed(true)}
          onOpenLogbook={() => openMainTab('Logbook')}
          onOpenChat={() => openMainTab('Chat')}
          onBack={() => setStage('main')}
          onPathPress={setPathSummary}
        />
        <PathDetailModal summary={pathSummary} onClose={() => setPathSummary(null)} />
      </>
    );
  }

  if (accountSettingsOpen) {
    return (
      <SafeAreaView style={styles.safeRoot}>
        <StatusBar style="dark" />
        <AccountSettingsScreen onBack={() => setAccountSettingsOpen(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <View style={styles.tabContent}>
          {activeTab === 'Home' ? (
            <DashboardScreen onOpenUpload={() => setUploadSheetVisible(true)} onPathPress={setPathSummary} />
          ) : null}
          {activeTab === 'Logbook' ? <LogbookScreen onPathPress={setPathSummary} onSummaryPress={setPathSummary} /> : null}
          {activeTab === 'Chat' ? (
            <ChatScreen onOpenSummary={setPathSummary} onOpenAccount={() => setAccountSettingsOpen(true)} />
          ) : null}
          {activeTab === 'Profile' ? <ProfileScreen onOpenAccount={() => setAccountSettingsOpen(true)} /> : null}
        </View>
        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} onUpload={() => setUploadSheetVisible(true)} />
      </View>
      <UploadSheet
        visible={uploadSheetVisible}
        onClose={() => setUploadSheetVisible(false)}
        onSmartScan={beginSmartScan}
        onUploadFile={beginUploadFile}
      />
      <PathDetailModal summary={pathSummary} onClose={() => setPathSummary(null)} />
    </SafeAreaView>
  );
}

function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, scale]);

  return (
    <SafeAreaView style={styles.splash}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.splashLogoWrap, { opacity: fade, transform: [{ scale }] }]}>
        <Image source={constructooLogo} style={styles.splashLogo} resizeMode="contain" />
      </Animated.View>
      <Text style={styles.splashLine}>Home records, warranties and maintenance made searchable.</Text>
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const slide = useRef(new Animated.Value(36)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 620,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen scroll={false} contentStyle={styles.loginContent}>
        <Animated.View style={[styles.loginPanel, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={styles.loginBrand}>
            <Image source={constructooLogo} style={styles.loginLogo} resizeMode="contain" />
            <View style={styles.welcomeTitleGroup}>
              <Text style={styles.welcomeTitle}>Home Logbook by Constructoo</Text>
              <Text style={styles.welcomeSubtitle}>
                AI-powered records for home documents, warranties, fixtures and maintenance.
              </Text>
            </View>
          </View>

          <Card style={styles.loginCard}>
            <View style={styles.loginFieldGroup}>
              <Text style={styles.loginFieldLabel}>Email</Text>
              <TextInput
                editable={false}
                value="demo@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.loginInput}
              />
            </View>
            <View style={styles.loginFieldGroup}>
              <Text style={styles.loginFieldLabel}>Password</Text>
              <TextInput editable={false} secureTextEntry value="password" style={styles.loginInput} />
            </View>
            <View style={styles.loginActions}>
              <CTAButton onPress={onLogin}>Log in</CTAButton>
              <CTAButton variant="secondary" onPress={onLogin}>Sign up</CTAButton>
            </View>
            <Pressable onPress={onLogin} style={({ pressed }) => [styles.forgotLink, pressed && styles.pressed]}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </Card>
        </Animated.View>
      </Screen>
    </SafeAreaView>
  );
}

function WelcomePoint({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.welcomePoint}>
      <View style={styles.pointMarker} />
      <View style={styles.pointCopy}>
        <Text style={styles.pointTitle}>{title}</Text>
        <Text style={styles.pointText}>{text}</Text>
      </View>
    </View>
  );
}

function DashboardScreen({
  onOpenUpload,
  onPathPress,
}: {
  onOpenUpload: () => void;
  onPathPress: (summary: SummaryRecord) => void;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [score, setScore] = useState(0);
  const [homeSwitcherVisible, setHomeSwitcherVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [resolvedReminderIds, setResolvedReminderIds] = useState<string[]>([]);

  useEffect(() => {
    const listener = progress.addListener(({ value }) => setScore(Math.round(value * 100)));
    Animated.timing(progress, {
      toValue: 0.68,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => progress.removeListener(listener);
  }, [progress]);

  const strongestRows = completenessRows.slice(0, 3);
  const improvementRows = completenessRows.slice(3, 6);
  const selectedRecord = selectedReminder ? recordById[selectedReminder.linkedRecordId] : undefined;
  const resolveReminder = (reminderId: string) => {
    setResolvedReminderIds((current) => (current.includes(reminderId) ? current : [...current, reminderId]));
  };

  return (
    <>
      <Screen contentStyle={styles.dashboardContent}>
        <View style={styles.homeHeader}>
          <Text style={styles.productName}>Home Logbook</Text>
          <Pressable onPress={() => setHomeSwitcherVisible(true)} style={({ pressed }) => [styles.myHomeBar, pressed && styles.pressed]}>
            <AppIcon name="home" size={42} active />
            <View style={styles.myHomeBarCopy}>
              <Text style={styles.homeSelectorLabel}>My Home</Text>
              <Text style={styles.homeSelectorAddress}>{homeAddress}</Text>
            </View>
            <View style={styles.switchInlinePill}>
              <Text style={styles.switchInlineText}>Switch</Text>
            </View>
          </Pressable>
        </View>

        <Card style={styles.uploadHero}>
          <View style={styles.uploadHeroTop}>
            <View style={styles.uploadHeroCopy}>
              <Text style={styles.sectionEyebrow}>Add record</Text>
              <Text style={styles.uploadTitle}>Upload once. AI organises it.</Text>
            </View>
          </View>
          <View style={styles.uploadActions}>
            <Pressable onPress={onOpenUpload} style={({ pressed }) => [styles.uploadActionPrimary, pressed && styles.pressed]}>
              <AppIcon name="scan" primary />
              <View style={styles.uploadActionCopy}>
                <Text style={styles.uploadActionTitle}>Smart Scan</Text>
                <Text style={styles.uploadActionText}>Paper invoice, certificate or warranty</Text>
              </View>
            </Pressable>
            <Pressable onPress={onOpenUpload} style={({ pressed }) => [styles.uploadActionSecondary, pressed && styles.pressed]}>
              <AppIcon name="filePlus" active />
              <View style={styles.uploadActionCopy}>
                <Text style={styles.uploadActionTitle}>Upload file</Text>
                <Text style={styles.uploadActionText}>PDF, photo, manual or report</Text>
              </View>
            </Pressable>
          </View>
        </Card>

        <SectionHeader title="Reminders" action="Next 60 days" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              resolved={resolvedReminderIds.includes(reminder.id)}
              onPress={() => setSelectedReminder(reminder)}
            />
          ))}
        </ScrollView>

        <SectionHeader title="Recents" action="Generated records" />
        <View style={styles.recentList}>
          {recentRecords.map((record) => (
            <Pressable key={record.id} onPress={() => onPathPress(record)} style={({ pressed }) => [styles.recentRow, pressed && styles.pressed]}>
              <AppIcon name="source" size={42} active />
              <View style={styles.recentCopy}>
                <Text style={styles.recentTitle}>{record.title}</Text>
                <Text style={styles.recentMeta}>
                  {record.documentType} / {record.supplier ?? 'Issuer pending'} / {record.uploadedDate}
                </Text>
              </View>
              <Text style={styles.recentPathLink}>Path</Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.completenessCard}>
          <View style={styles.completenessHeader}>
            <View style={styles.completenessCopy}>
              <Text style={styles.sectionEyebrow}>Home Protection Completeness</Text>
              <Text style={styles.completenessText}>
                Current records count most toward your protection score. Pending or duplicate files are not fully counted until confirmed.
              </Text>
            </View>
            <DonutScore score={score} />
          </View>
          <Card style={styles.recommendationCard}>
            <View style={styles.recommendationTitleRow}>
              <AISuggestionStarIcon />
              <Text style={styles.recommendationTitle}>Next target: reach 80%+</Text>
            </View>
            <Text style={styles.recommendationItem}>
              Add missing certificates, warranties and service records to improve your protection score.
            </Text>
          </Card>
          <View style={styles.protectionGroups}>
            <ProtectionGroup title="Top 3 strongest" rows={strongestRows} />
            <ProtectionGroup title="Top 3 areas to improve" rows={improvementRows} needsAction />
          </View>
        </Card>
      </Screen>

      <HomeSwitchSheet visible={homeSwitcherVisible} onClose={() => setHomeSwitcherVisible(false)} />
      <ReminderDetailModal
        reminder={selectedReminder}
        record={selectedRecord}
        resolved={selectedReminder ? resolvedReminderIds.includes(selectedReminder.id) : false}
        onClose={() => setSelectedReminder(null)}
        onPathPress={onPathPress}
        onResolve={(reminderId) => {
          resolveReminder(reminderId);
          setSelectedReminder(null);
        }}
        onMockUpdate={(reminderId) => resolveReminder(reminderId)}
      />
    </>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function HomeSwitchSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <Animated.View style={[styles.homeSwitchPanel, { transform: [{ translateY }] }]}>
          <View style={styles.pathPanelHeader}>
            <View style={styles.pathPanelTitleGroup}>
              <Text style={styles.pathPanelTitle}>Switch home</Text>
              <Text style={styles.pathPanelSubtitle}>Switch between property addresses. A granny flat is added under this home, not as a separate dashboard view.</Text>
            </View>
            <CTAButton variant="quiet" small onPress={onClose}>
              Close
            </CTAButton>
          </View>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.homeOption, pressed && styles.pressed]}>
            <View style={[styles.homeOptionDot, styles.homeOptionDotActive]} />
            <View style={styles.homeOptionCopy}>
              <Text style={styles.homeOptionTitle}>{homeAddress}</Text>
              <Text style={styles.homeOptionMeta}>Current home / 24 records / Protection score 68%</Text>
            </View>
            <Pill tone="success">Active</Pill>
          </Pressable>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.homeOption, pressed && styles.pressed]}>
            <AppIcon name="home" size={36} muted />
            <View style={styles.homeOptionCopy}>
              <Text style={styles.homeOptionTitle}>Add other home</Text>
              <Text style={styles.homeOptionMeta}>Create a separate Logbook for another Australian property.</Text>
            </View>
          </Pressable>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.homeOption, pressed && styles.pressed]}>
            <AppIcon name="filePlus" size={36} muted />
            <View style={styles.homeOptionCopy}>
              <Text style={styles.homeOptionTitle}>Add Granny Flat to this property</Text>
              <Text style={styles.homeOptionMeta}>Add a secondary dwelling structure under 17 Martin St.</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function ReminderDetailModal({
  reminder,
  record,
  resolved,
  onClose,
  onPathPress,
  onResolve,
  onMockUpdate,
}: {
  reminder: Reminder | null;
  record?: SummaryRecord;
  resolved: boolean;
  onClose: () => void;
  onPathPress: (summary: SummaryRecord) => void;
  onResolve: (reminderId: string) => void;
  onMockUpdate: (reminderId: string) => void;
}) {
  const dueDate = reminder ? formatReminderDueDate(reminder) : '';

  return (
    <Modal transparent visible={Boolean(reminder)} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={[styles.pathPanel, styles.reminderDetailPanel]}>
          {reminder && record ? (
            <>
              <View style={styles.pathPanelHeader}>
                <View style={styles.pathPanelTitleGroup}>
                  <Text style={styles.pathPanelTitle}>{reminder.title}</Text>
                  <Text style={styles.pathPanelSubtitle}>{dueDate} / {reminder.dueDetail}</Text>
                </View>
                <CTAButton variant="quiet" small onPress={onClose}>
                  Close
                </CTAButton>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.reminderDetailContent}>
                <Card style={reminder.tone === 'condition' ? styles.conditionCard : styles.detailInfoCard}>
                  <View style={styles.conditionRail} />
                  <View style={styles.conditionCopy}>
                    <Text style={styles.conditionTitle}>{resolved ? 'Record updated' : 'Reminder detail'}</Text>
                    <Text style={styles.conditionText}>{resolved ? 'This item is marked as handled in the prototype.' : reminder.detail}</Text>
                    {reminder.actionHint ? <Text style={styles.conditionText}>{reminder.actionHint}</Text> : null}
                  </View>
                </Card>

                <View style={styles.linkedSectionHeader}>
                  <AppIcon name="source" size={36} active />
                  <View style={styles.linkedSectionCopy}>
                    <Text style={styles.linkedSectionTitle}>Linked source file</Text>
                    <Text style={styles.linkedSectionText}>{record.fileName ?? record.title}</Text>
                  </View>
                </View>

                <SummaryCard summary={record} onPathPress={onPathPress} showPathChips={false} />

                <SourceFilePreviewCard
                  summary={record}
                  onOpenSource={() => onPathPress(record)}
                  showAction={false}
                />

                <View style={styles.modalActionGrid}>
                  <CTAButton onPress={() => onMockUpdate(reminder.id)} style={styles.modalAction}>
                    Upload new file to update
                  </CTAButton>
                  <CTAButton variant="ghost" onPress={() => onResolve(reminder.id)} style={styles.modalAction}>
                    Archive
                  </CTAButton>
                </View>
              </ScrollView>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function DonutScore({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const progressAngle = clampedScore * 3.6;
  const remainingAngle = 360 - progressAngle;
  const greyStart = 42;
  const capSize = 11;
  const ringSize = 116;
  const ringInset = 5;
  const capRadius = ringSize / 2 - capSize / 2;
  const center = ringSize / 2;
  const capPosition = (cssAngle: number) => {
    const radians = ((cssAngle - 90) * Math.PI) / 180;

    return {
      left: ringInset + center + capRadius * Math.cos(radians) - capSize / 2,
      top: ringInset + center + capRadius * Math.sin(radians) - capSize / 2,
    };
  };
  const ringStyle = {
    backgroundImage: `conic-gradient(from ${greyStart}deg, #E4E4E4 0deg, #E4E4E4 ${remainingAngle}deg, ${colors.coral} ${remainingAngle}deg, ${colors.coral} 360deg)`,
  } as any;
  const orangeStartCapStyle = capPosition(greyStart + remainingAngle);
  const orangeEndCapStyle = capPosition(greyStart + 360);

  return (
    <View style={styles.progressDonut}>
      <View style={[styles.progressRing, ringStyle]} />
      {clampedScore > 0 ? (
        <>
          <View style={[styles.progressRingCap, orangeStartCapStyle]} />
          <View style={[styles.progressRingCap, orangeEndCapStyle]} />
        </>
      ) : null}
      <View style={styles.progressDonutCenter}>
        <Text style={styles.completenessScore}>{score}%</Text>
        <Text style={styles.progressDonutLabel}>protected</Text>
      </View>
    </View>
  );
}

function AISuggestionStarIcon() {
  return (
    <View style={styles.aiStar}>
      <View style={styles.aiStarDiamond} />
      <View style={styles.aiStarNorth} />
      <View style={styles.aiStarSouth} />
      <View style={styles.aiStarEast} />
      <View style={styles.aiStarWest} />
    </View>
  );
}

function ProtectionGroup({
  title,
  rows,
  needsAction = false,
}: {
  title: string;
  rows: { label: string; value: number; weight: 'critical' | 'high' | 'standard' }[];
  needsAction?: boolean;
}) {
  return (
    <View style={styles.protectionGroup}>
      <Text style={styles.protectionGroupTitle}>{title}</Text>
      {rows.map((row, index) => (
        <View key={row.label} style={styles.protectionRow}>
          <Text style={styles.protectionRank}>{index + 1}</Text>
          <View style={styles.protectionRowCopy}>
            <View style={styles.weightTop}>
              <Text style={styles.weightLabel}>{row.label}</Text>
              <Text style={styles.weightValue}>{row.value}%</Text>
            </View>
            <View style={styles.weightTrack}>
              <View style={[styles.weightFill, needsAction && styles.weightFillNeeds, { width: `${row.value}%` }]} />
            </View>
          </View>
          {needsAction ? (
            <CTAButton variant="ghost" small style={styles.improveButton}>
              Add record
            </CTAButton>
          ) : (
            <Text style={styles.strongText}>Strong</Text>
          )}
        </View>
      ))}
    </View>
  );
}

function FileMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fileMetaItem}>
      <Text style={styles.fileMetaLabel}>{label}</Text>
      <Text style={styles.fileMetaValue}>{value}</Text>
    </View>
  );
}

function formatReminderDueDate(reminder: Reminder) {
  if (typeof reminder.days !== 'number') {
    return 'Action needed now';
  }

  const dueDate = new Date('2026-06-24T00:00:00+10:00');
  dueDate.setDate(dueDate.getDate() + reminder.days);
  return dueDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CompletenessRow({ label, value, weight }: { label: string; value: number; weight: 'critical' | 'high' | 'standard' }) {
  const tone = weight === 'critical' ? 'coral' : weight === 'high' ? 'navy' : 'neutral';

  return (
    <View style={styles.weightRow}>
      <View style={styles.weightTop}>
        <Text style={styles.weightLabel}>{label}</Text>
        <Text style={styles.weightValue}>{value}%</Text>
      </View>
      <View style={styles.weightTrack}>
        <View style={[styles.weightFill, { width: `${value}%` }, weight === 'standard' && styles.weightFillStandard]} />
      </View>
      <Pill tone={tone} style={styles.weightPill}>{weight === 'critical' ? 'Critical weight' : weight === 'high' ? 'High weight' : 'Standard weight'}</Pill>
    </View>
  );
}

function SmartScanScreen({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const scan = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scan, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    );
    scanLoop.start();
    const stepTimer = setInterval(() => {
      setStepIndex((current) => (current + 1) % smartScanSteps.length);
    }, 820);

    return () => {
      scanLoop.stop();
      clearInterval(stepTimer);
    };
  }, [scan]);

  const translateY = scan.interpolate({ inputRange: [0, 1], outputRange: [18, 218] });

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen contentStyle={styles.scanContent}>
        <TopBar title="Smart Scan" onBack={onBack} />
        <View style={styles.cameraFrame}>
          <View style={styles.documentPreview}>
            <Text style={styles.invoiceSupplier}>AirPro Mechanical Services</Text>
            <Text style={styles.invoiceTitle}>Tax Invoice</Text>
            <View style={styles.invoiceLine} />
            <View style={[styles.invoiceLine, styles.invoiceLineShort]} />
            <View style={styles.invoiceGrid}>
              <View style={styles.invoiceBox} />
              <View style={styles.invoiceBox} />
            </View>
            <Text style={styles.invoiceTotal}>Daikin ducted AC installation / AUD 8,240.00</Text>
          </View>
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <Card style={styles.scanStepsCard}>
          <Text style={styles.scanStepsTitle}>Preparing a clean upload</Text>
          <View style={styles.stepsList}>
            {smartScanSteps.map((step, index) => (
              <ProgressStep
                key={step}
                label={step}
                index={index}
                active={index === stepIndex}
                completed={index < stepIndex}
              />
            ))}
          </View>
        </Card>

        <View style={styles.scanActions}>
          <CTAButton variant="secondary" onPress={() => setStepIndex(0)} style={styles.scanActionButton}>
            Retake
          </CTAButton>
          <CTAButton onPress={onConfirm} style={styles.scanActionButton}>
            Confirm Upload
          </CTAButton>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

function UploadFileScreen({ onBack, onStartUpload }: { onBack: () => void; onStartUpload: () => void }) {
  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen contentStyle={styles.uploadFileContent}>
        <TopBar title="Upload file" onBack={onBack} />
        <Card style={styles.uploadFileCard}>
          <View style={styles.fileDropZone}>
            <AppIcon name="filePlus" size={52} active />
            <Text style={styles.fileDropTitle}>File selected</Text>
            <Text style={styles.fileDropText}>Daikin AC Service Invoice v1.pdf</Text>
          </View>
          <View style={styles.fileMetaGrid}>
            <FileMeta label="File type" value="PDF" />
            <FileMeta label="File size" value="1.2 MB" />
            <FileMeta label="Suggested source" value="Upload file" />
            <FileMeta label="Mock status" value="Ready to upload" />
          </View>
          <CTAButton onPress={onStartUpload}>Start upload</CTAButton>
        </Card>
      </Screen>
    </SafeAreaView>
  );
}

function UploadProcessingScreen({ onDone }: { onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    'Uploading file...',
    'Reading document...',
    'Extracting key details...',
    'Checking existing records...',
    'Suggesting smart filing path...',
    'Creating Summary Card...',
  ];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const stepTimer = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, 540);
    const doneTimer = setTimeout(onDone, 3600);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone, progress, steps.length]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen scroll={false} contentStyle={styles.processingContent}>
        <View style={styles.processingCopy}>
          <Text style={styles.processingTitle}>Uploading and reading file</Text>
          <Text style={styles.processingText}>Daikin AC Service Invoice v1.pdf / PDF / 1.2 MB</Text>
        </View>
        <Card style={styles.pipelineCard}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <View style={styles.stepsList}>
            {steps.map((step, index) => (
              <ProgressStep
                key={step}
                label={step}
                index={index}
                active={index === stepIndex}
                completed={index < stepIndex}
              />
            ))}
          </View>
        </Card>
      </Screen>
    </SafeAreaView>
  );
}

function AIProcessingScreen({ onDone }: { onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const progressListener = progress.addListener(({ value }) => setPercent(Math.round(value * 100)));
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 760, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 760, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const stepTimer = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, aiProcessingSteps.length - 1));
    }, 560);
    const doneTimer = setTimeout(onDone, 3200);

    return () => {
      progress.removeListener(progressListener);
      pulseLoop.stop();
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone, progress, pulse]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.55] });

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen scroll={false} contentStyle={styles.processingContent}>
        <View style={styles.processingHero}>
          <Animated.View style={[styles.aiRingPulse, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
          <View style={styles.aiRing}>
            <Text style={styles.aiRingLabel}>AI</Text>
            <Text style={styles.aiRingPercent}>{percent}%</Text>
          </View>
        </View>
        <View style={styles.processingCopy}>
          <Text style={styles.processingTitle}>Creating a home-ready Summary Card</Text>
          <Text style={styles.processingText}>
            Reading the uploaded invoice, extracting warranty signals and mapping it to your Home Logbook WBS.
          </Text>
        </View>
        <Card style={styles.pipelineCard}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <View style={styles.stepsList}>
            {aiProcessingSteps.map((step, index) => (
              <ProgressStep
                key={step}
                label={step}
                index={index}
                active={index === stepIndex}
                completed={index < stepIndex}
              />
            ))}
          </View>
        </Card>
      </Screen>
    </SafeAreaView>
  );
}

function SummaryConfirmationScreen({
  confirmed,
  onConfirm,
  onOpenLogbook,
  onOpenChat,
  onBack,
  onPathPress,
}: {
  confirmed: boolean;
  onConfirm: () => void;
  onOpenLogbook: () => void;
  onOpenChat: () => void;
  onBack: () => void;
  onPathPress: (summary: SummaryRecord) => void;
}) {
  const slide = useRef(new Animated.Value(42)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const [detectedScope, setDetectedScope] = useState<PropertyScope>(daikinSummary.propertyScope);
  const [scopeSelectorVisible, setScopeSelectorVisible] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  const summaryForScope: SummaryRecord = {
    ...daikinSummary,
    propertyScope: detectedScope,
    path: daikinSummary.path
      .split(' / ')
      .map((segment, index) => (index === 1 ? detectedScope : segment))
      .join(' / '),
  };

  return (
    <SafeAreaView style={styles.safeRoot}>
      <StatusBar style="dark" />
      <Screen contentStyle={styles.summaryScreenContent}>
        <TopBar title="AI Summary Card" onBack={onBack} />
        <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], gap: spacing.lg }}>
          <Card style={styles.smartFilingCard}>
            <Text style={styles.sourceLabel}>AI suggested smart filing path</Text>
            <View style={styles.scopeConfirmTopRow}>
              <PropertyScopeChip scope={detectedScope} compact />
              <CTAButton variant="secondary" small onPress={() => setScopeSelectorVisible(true)}>
                Change
              </CTAButton>
            </View>
            <PathChips path={summaryForScope.path} onPress={() => onPathPress(summaryForScope)} />
            <View style={styles.fileMetaGrid}>
              <FileMeta label="Status" value={summaryForScope.fileStatus} />
              <FileMeta label="AI confidence" value={summaryForScope.confidence ?? '0.91'} />
            </View>
          </Card>

          <SummaryCard
            summary={summaryForScope}
            variant="full"
            confirmed={confirmed}
            onConfirm={onConfirm}
            onEdit={() => onPathPress(summaryForScope)}
            onMove={() => onPathPress(summaryForScope)}
            onPathPress={onPathPress}
          />

          <Card style={styles.conditionCard}>
            <View style={styles.conditionRail} />
            <View style={styles.conditionCopy}>
              <Text style={styles.conditionTitle}>Warranty condition needs attention</Text>
              <Text style={styles.conditionText}>
                Annual servicing by a licensed technician may be required to keep warranty valid.
              </Text>
            </View>
          </Card>

          {confirmed ? (
            <Card style={styles.successCard}>
              <Pill tone="success">Confirmed</Pill>
              <Text style={styles.successTitle}>Added to My Home Knowledge Base</Text>
              <Text style={styles.successText}>
                This record can now answer chat questions, appear in fixture views and trigger future reminders.
              </Text>
              <View style={styles.successActions}>
                <CTAButton onPress={onOpenLogbook} style={styles.successButton}>
                  Open Logbook
                </CTAButton>
                <CTAButton variant="secondary" onPress={onOpenChat} style={styles.successButton}>
                  Ask Chat
                </CTAButton>
              </View>
            </Card>
          ) : null}
        </Animated.View>
      </Screen>
      <ScopeSelectorModal
        visible={scopeSelectorVisible}
        activeScope={detectedScope}
        onSelect={(scope) => {
          setDetectedScope(scope);
          setScopeSelectorVisible(false);
        }}
        onClose={() => setScopeSelectorVisible(false)}
      />
    </SafeAreaView>
  );
}

function ScopeSelectorModal({
  visible,
  activeScope,
  onSelect,
  onClose,
}: {
  visible: boolean;
  activeScope: PropertyScope;
  onSelect: (scope: PropertyScope) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={styles.scopeSelectorPanel}>
          <View style={styles.pathPanelHeader}>
            <View style={styles.pathPanelTitleGroup}>
              <Text style={styles.pathPanelTitle}>Change Scope</Text>
              <Text style={styles.pathPanelSubtitle}>Scope is the structure coordinate inside this property address.</Text>
            </View>
            <CTAButton variant="quiet" small onPress={onClose}>Close</CTAButton>
          </View>
          {propertyScopeOptions.map((scope) => (
            <Pressable
              key={scope}
              onPress={() => onSelect(scope)}
              style={({ pressed }) => [styles.scopeSelectorOption, activeScope === scope && styles.scopeSelectorOptionActive, pressed && styles.pressed]}
            >
              <Text style={styles.scopeSelectorTitle}>{scope}</Text>
              {activeScope === scope ? <Pill tone="success">Selected</Pill> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function LogbookScreen({
  onPathPress,
  onSummaryPress,
}: {
  onPathPress: (summary: SummaryRecord) => void;
  onSummaryPress: (summary: SummaryRecord) => void;
}) {
  const [viewOrder, setViewOrder] = useState<LogbookView[]>(defaultLogbookViews);
  const [hiddenViews, setHiddenViews] = useState<LogbookView[]>([]);
  const visibleViews = viewOrder.filter((view) => !hiddenViews.includes(view));
  const [activeView, setActiveView] = useState<LogbookView>('WBS');
  const [expandedFolder, setExpandedFolder] = useState(logbookViewFolders.WBS[0]?.id ?? '');
  const [manageViewsVisible, setManageViewsVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const folders = logbookViewFolders[activeView];
  const moveView = (view: LogbookView, direction: -1 | 1) => {
    setViewOrder((current) => {
      const index = current.indexOf(view);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };
  const toggleView = (view: LogbookView) => {
    setHiddenViews((current) => {
      const next = current.includes(view) ? current.filter((item) => item !== view) : [...current, view];
      if (activeView === view && !current.includes(view)) {
        const fallback = viewOrder.find((item) => item !== view && !next.includes(item)) ?? 'WBS';
        setActiveView(fallback);
        setExpandedFolder(logbookViewFolders[fallback][0]?.id ?? '');
      }
      return next;
    });
  };

  return (
    <Screen contentStyle={styles.logbookContent}>
      <View style={styles.logbookHeaderRow}>
        <View style={[styles.screenHeader, styles.logbookHeaderCopy]}>
          <Text style={styles.productName}>Logbook</Text>
          <Text style={styles.screenSubtitle}>View your uploaded files and photos from different angles.</Text>
        </View>
        <LogbookSearchButton onPress={() => setSearchVisible(true)} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmented}>
        {visibleViews.map((view) => {
          const selected = activeView === view;
          return (
            <Pressable
              key={view}
              onPress={() => {
                setActiveView(view);
                setExpandedFolder(logbookViewFolders[view][0]?.id ?? '');
              }}
              style={({ pressed }) => [styles.segment, selected && styles.segmentActive, pressed && styles.pressed]}
            >
              <AppIcon name={viewIcons[view]} size={30} active={selected} muted={!selected} />
              <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>{view}</Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Manage Logbook Views"
          onPress={() => setManageViewsVisible(true)}
          style={({ pressed }) => [styles.viewSettingsButton, pressed && styles.pressed]}
        >
          <SettingsGearIcon />
        </Pressable>
      </ScrollView>

      <View style={styles.folderList}>
        {folders.map((folder, index) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            expanded={expandedFolder === folder.id}
            dimmed={Boolean(expandedFolder && expandedFolder !== folder.id)}
            index={index}
            iconName={viewIcons[activeView]}
            onToggle={() => setExpandedFolder((current) => (current === folder.id ? '' : folder.id))}
            onPathPress={onPathPress}
            onSummaryPress={onSummaryPress}
          />
        ))}
      </View>
      <ManageLogbookViewsSheet
        visible={manageViewsVisible}
        viewOrder={viewOrder}
        hiddenViews={hiddenViews}
        onToggle={toggleView}
        onMove={moveView}
        onReset={() => {
          setViewOrder(defaultLogbookViews);
          setHiddenViews([]);
          setActiveView('WBS');
          setExpandedFolder(logbookViewFolders.WBS[0]?.id ?? '');
        }}
        onClose={() => setManageViewsVisible(false)}
      />
      <LogbookSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onOpenRecord={(record) => {
          setSearchVisible(false);
          setTimeout(() => onSummaryPress(record), 80);
        }}
      />
    </Screen>
  );
}

function LogbookSearchButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Search Logbook"
      onPress={onPress}
      style={({ pressed }) => [styles.logbookSearchButton, pressed && styles.logbookSearchButtonPressed]}
    >
      <SearchGlyph />
    </Pressable>
  );
}

function SearchGlyph() {
  return (
    <View style={styles.searchGlyph}>
      <View style={styles.searchGlyphCircle} />
      <View style={styles.searchGlyphHandle} />
    </View>
  );
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function searchableTextForRecord(record: SummaryRecord) {
  const aliases = [
    record.recordGroup.includes('Daikin') || record.title.includes('Daikin') ? 'aircon air conditioner air conditioning ac hvac' : '',
    record.recordGroup.toLowerCase().includes('hot water') || record.title.toLowerCase().includes('hot water') ? 'water heater plumbing' : '',
    record.propertyScope === 'Granny Flat' ? 'granny secondary dwelling' : '',
    record.fileStatus === 'Duplicate / Alternative Version' ? 'duplicate alternative version copy repeated scan' : '',
  ];

  return normalizeSearchText(
    [
      record.title,
      record.fileName,
      record.documentType,
      record.supplier,
      record.propertyScope,
      record.wbsCode,
      record.wbsName,
      record.recordGroup,
      record.asset,
      record.path,
      record.tags.join(' '),
      record.fileStatus,
      record.status,
      record.amount,
      aliases.join(' '),
    ]
      .filter(Boolean)
      .join(' ')
  );
}

function LogbookSearchModal({
  visible,
  onClose,
  onOpenRecord,
}: {
  visible: boolean;
  onClose: () => void;
  onOpenRecord: (record: SummaryRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchScrollRef = useRef<ScrollView | null>(null);
  const normalizedDraftQuery = normalizeSearchText(query);
  const submittedTerms = normalizeSearchText(submittedQuery).split(' ').filter(Boolean);
  const results = useMemo(() => {
    if (!submittedTerms.length) return [];
    return allRecords.filter((record) => {
      const searchableText = searchableTextForRecord(record);
      return submittedTerms.every((term) => searchableText.includes(term));
    });
  }, [submittedTerms]);
  const hasDraftQuery = normalizedDraftQuery.length > 0;
  const hasSearched = !searching && submittedTerms.length > 0;
  const readyToSearch = hasDraftQuery && !searching && normalizeSearchText(submittedQuery) !== normalizedDraftQuery;
  const showEmpty = hasSearched && results.length === 0;

  const clearSearchTimer = () => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
  };

  const handleQueryChange = (value: string) => {
    clearSearchTimer();
    setQuery(value);
    setSearching(false);
    setSubmittedQuery('');
  };

  const runSearch = (value = query) => {
    const trimmedValue = value.trim();
    if (!normalizeSearchText(trimmedValue) || searching) return;
    clearSearchTimer();
    setQuery(trimmedValue);
    setSubmittedQuery('');
    setSearching(true);
    setShowScrollTop(false);
    searchScrollRef.current?.scrollTo({ y: 0, animated: true });
    searchTimer.current = setTimeout(() => {
      setSubmittedQuery(trimmedValue);
      setSearching(false);
      searchTimer.current = null;
    }, 3000);
  };

  useEffect(() => {
    if (!visible) {
      clearSearchTimer();
      setQuery('');
      setSubmittedQuery('');
      setSearching(false);
      setShowScrollTop(false);
    }
    return clearSearchTimer;
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.searchModalRoot}>
        <StatusBar style="dark" />
        <View style={styles.searchPanel}>
          <View style={styles.searchHeader}>
            <CTAButton variant="quiet" small onPress={onClose}>Back</CTAButton>
            <View style={styles.searchHeaderTitleGroup}>
              <Text style={styles.pathPanelTitle}>Search Logbook</Text>
            </View>
            <View style={styles.searchHeaderSpacer} />
          </View>

          <View style={styles.searchInputWrap}>
            <SearchGlyph />
            <TextInput
              value={query}
              onChangeText={handleQueryChange}
              placeholder="Search Summary Cards, file names and generated records."
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => runSearch()}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Run Logbook Search"
              disabled={!hasDraftQuery || searching}
              onPress={() => runSearch()}
              style={({ pressed }) => [
                styles.searchSubmitButton,
                (!hasDraftQuery || searching) && styles.searchSubmitButtonDisabled,
                pressed && hasDraftQuery && !searching && styles.pressed,
              ]}
            >
              <Text style={[styles.searchSubmitText, (!hasDraftQuery || searching) && styles.searchSubmitTextDisabled]}>
                Search
              </Text>
            </Pressable>
          </View>

          {!hasDraftQuery ? (
            <ScrollView
              horizontal
              style={styles.searchSuggestionScroller}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.searchSuggestionRow}
            >
              {logbookSearchSuggestions.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => {
                    setQuery(suggestion);
                    runSearch(suggestion);
                  }}
                  style={({ pressed }) => [styles.searchSuggestionChip, pressed && styles.pressed]}
                >
                  <Text style={styles.searchSuggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          <ScrollView
            ref={searchScrollRef}
            style={styles.searchResultsScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.searchResultsList}
            scrollEventThrottle={16}
            onScroll={(event) => setShowScrollTop(event.nativeEvent.contentOffset.y > 180)}
          >
            {!hasDraftQuery && !searching && !hasSearched ? (
              <Card style={styles.searchStartCard}>
                <Text style={styles.searchEmptyTitle}>Search your Home Logbook</Text>
                <Text style={styles.searchEmptyText}>Try supplier names, room names, fixture names, document types or status terms.</Text>
              </Card>
            ) : null}

            {readyToSearch ? (
              <Card style={styles.searchStartCard}>
                <Text style={styles.searchEmptyTitle}>Ready to search</Text>
                <Text style={styles.searchEmptyText}>Tap Search to scan your Summary Cards, file names and generated records.</Text>
              </Card>
            ) : null}

            {searching ? <SearchLoadingState query={query} /> : null}

            {hasSearched && results.length ? (
              <Text style={styles.searchResultsSummary}>
                Showing {results.length} {results.length === 1 ? 'result' : 'results'} for "{submittedQuery}"
              </Text>
            ) : null}

            {hasSearched ? results.map((record) => (
              <SearchResultCard key={record.id} record={record} onOpen={() => onOpenRecord(record)} />
            )) : null}

            {showEmpty ? (
              <View style={styles.searchEmptyState}>
                <Text style={styles.searchEmptyTitle}>No matching records found</Text>
                <Text style={styles.searchEmptyText}>Try searching by file name, supplier, room, fixture, trade or document type.</Text>
              </View>
            ) : null}
          </ScrollView>

          <ScrollTopButton
            visible={showScrollTop}
            onPress={() => searchScrollRef.current?.scrollTo({ y: 0, animated: true })}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function SearchLoadingState({ query }: { query: string }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Card style={styles.searchLoadingCard}>
      <Animated.View style={[styles.searchLoadingSpinner, { transform: [{ rotate }] }]} />
      <View style={styles.searchLoadingCopy}>
        <Text style={styles.searchEmptyTitle}>Searching "{query}"</Text>
        <Text style={styles.searchEmptyText}>Checking Summary Cards, file names and home record paths.</Text>
      </View>
    </Card>
  );
}

function ScrollTopButton({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  if (!visible) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Return to top"
      onPress={onPress}
      style={({ pressed }) => [styles.scrollTopButton, pressed && styles.pressed]}
    >
      <View style={styles.scrollTopGlyph}>
        <View style={styles.scrollTopStem} />
        <View style={styles.scrollTopWingLeft} />
        <View style={styles.scrollTopWingRight} />
      </View>
    </Pressable>
  );
}

function SearchResultCard({ record, onOpen }: { record: SummaryRecord; onOpen: () => void }) {
  const tagPreview = record.tags.slice(0, 4);

  return (
    <Card style={styles.searchResultCard}>
      <View style={styles.searchResultHeader}>
        <View style={styles.searchResultTitleGroup}>
          <Text style={styles.searchResultTitle}>{record.title}</Text>
          <Text style={styles.searchResultMeta}>
            {record.documentType}{record.supplier ? ` / ${record.supplier}` : ''}
          </Text>
        </View>
        <StatusPill status={record.fileStatus} />
      </View>

      <PropertyScopeChip scope={record.propertyScope} compact />
      <Text style={styles.searchPathPreview} numberOfLines={2}>{record.path}</Text>

      <View style={styles.searchTagRow}>
        {tagPreview.map((tag) => (
          <Pill key={tag} tone={tag.toLowerCase().includes('duplicate') ? 'neutral' : 'cream'}>{tag}</Pill>
        ))}
      </View>

      <View style={styles.searchResultFooter}>
        <Text style={styles.searchResultDate}>Updated {record.uploadedDate}</Text>
        <CTAButton small onPress={onOpen}>Open</CTAButton>
      </View>
    </Card>
  );
}

function ManageLogbookViewsSheet({
  visible,
  viewOrder,
  hiddenViews,
  onToggle,
  onMove,
  onReset,
  onClose,
}: {
  visible: boolean;
  viewOrder: LogbookView[];
  hiddenViews: LogbookView[];
  onToggle: (view: LogbookView) => void;
  onMove: (view: LogbookView, direction: -1 | 1) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={styles.manageViewsPanel}>
          <View style={styles.pathPanelHeader}>
            <View style={styles.pathPanelTitleGroup}>
              <Text style={styles.pathPanelTitle}>Manage Logbook Views</Text>
              <Text style={styles.pathPanelSubtitle}>Show, hide and reorder the mocked Logbook view tabs.</Text>
            </View>
            <CTAButton variant="quiet" small onPress={onClose}>Done</CTAButton>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.manageViewsList}>
            {viewOrder.map((view, index) => {
              const enabled = !hiddenViews.includes(view);
              return (
                <View key={view} style={styles.manageViewRow}>
                  <DragHandleIcon />
                  <View style={styles.manageViewCopy}>
                    <Text style={styles.manageViewTitle}>{view}</Text>
                    <Text style={styles.manageViewMeta}>{enabled ? 'Visible in Logbook tabs' : 'Hidden from Logbook tabs'}</Text>
                  </View>
                  <View style={styles.reorderButtons}>
                    <CTAButton variant="quiet" small onPress={() => onMove(view, -1)} disabled={index === 0}>Up</CTAButton>
                    <CTAButton variant="quiet" small onPress={() => onMove(view, 1)} disabled={index === viewOrder.length - 1}>Down</CTAButton>
                  </View>
                  <Pressable onPress={() => onToggle(view)} style={({ pressed }) => [styles.iosSwitch, enabled && styles.iosSwitchActive, pressed && styles.pressed]}>
                    <View style={[styles.iosSwitchKnob, enabled && styles.iosSwitchKnobActive]} />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>

          <CTAButton variant="secondary" onPress={onReset}>Reset to default</CTAButton>
        </View>
      </View>
    </Modal>
  );
}

function SettingsGearIcon() {
  return (
    <View style={styles.settingsGear}>
      <View style={styles.settingsGearCircle} />
      <View style={[styles.settingsGearTooth, styles.settingsGearToothA]} />
      <View style={[styles.settingsGearTooth, styles.settingsGearToothB]} />
      <View style={[styles.settingsGearTooth, styles.settingsGearToothC]} />
    </View>
  );
}

function DragHandleIcon() {
  return (
    <View style={styles.dragHandleIcon}>
      <View style={styles.dragHandleLine} />
      <View style={styles.dragHandleLine} />
      <View style={styles.dragHandleLine} />
    </View>
  );
}

const chatSuggestions = ['Show expiring warranties', 'Find my hot water invoice', 'What needs attention?', 'Show HVAC records'];
const chatHistoryItems = [
  { id: 'home-mvp', title: 'Home Logbook MVP', starred: true },
  { id: 'daikin-status', title: 'Daikin warranty status' },
  { id: 'waterproofing', title: 'Bathroom waterproofing certificate', starred: true },
  { id: 'kitchen-reno', title: 'Kitchen renovation records' },
  { id: 'roof-history', title: 'Roof repair history' },
  { id: 'insurance-renewal', title: 'Building insurance renewal' },
];

function ChatScreen({
  onOpenSummary,
  onOpenAccount,
}: {
  onOpenSummary: (summary: SummaryRecord) => void;
  onOpenAccount: () => void;
}) {
  const daikinCurrent = recordById['daikin-service-current'];
  const daikinPending = recordById['daikin-invoice'];
  const daikinSuperseded = recordById['daikin-service-superseded'];
  const daikinHistorical = recordById['daikin-service-historical'];
  const daikinDuplicate = recordById['dakin-aircon-duplicate'];
  const daikinRecords = [daikinCurrent, daikinPending, daikinSuperseded, daikinHistorical, daikinDuplicate].filter(Boolean);
  const fullAnswer =
    'Your latest confirmed Daikin Ducted AC service record is Daikin AC Service Invoice v2.pdf. Its Status is Current, so I use it before older, pending, superseded or duplicate files when answering last-serviced questions.';
  const words = useMemo(() => fullAnswer.split(' '), [fullAnswer]);
  const [streamCount, setStreamCount] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [attachmentSheetVisible, setAttachmentSheetVisible] = useState(false);
  const [filePickerVisible, setFilePickerVisible] = useState(false);
  const [attachedFile, setAttachedFile] = useState<SummaryRecord | null>(null);
  const [activeConversation, setActiveConversation] = useState(chatHistoryItems[0]);
  const [actionConversation, setActionConversation] = useState<(typeof chatHistoryItems)[number] | null>(null);
  const [voicePressed, setVoicePressed] = useState(false);

  useEffect(() => {
    setStreamCount(0);
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setStreamCount((current) => {
          if (current >= words.length) {
            clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, 70);
    }, 420);

    return () => clearTimeout(startDelay);
  }, [words]);

  const streamedAnswer = words.slice(0, streamCount).join(' ');
  const showSource = streamCount > 12;

  return (
    <Screen scroll={false} contentStyle={styles.chatAppContent}>
      <View style={styles.chatTopBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open chat history"
          onPress={() => setDrawerVisible(true)}
          style={({ pressed }) => [styles.chatIconButton, pressed && styles.chatIconButtonPressed]}
        >
          <MenuGlyph />
        </Pressable>
        <View style={styles.chatTitleGroup}>
          <Text style={styles.chatTitle}>Home Logbook</Text>
          <Text style={styles.chatSubTitle}>{activeConversation.title}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open account settings"
          onPress={onOpenAccount}
          style={({ pressed }) => [styles.assistantAvatar, pressed && styles.chatIconButtonPressed]}
        >
          <Text style={styles.assistantAvatarText}>HL</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.chatMessageList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatMessages}
      >
        <View style={styles.chatHeroMark}>
          <AISuggestionStarIcon />
        </View>

        <ChatBubble sender="user">When was my Daikin AC last serviced?</ChatBubble>
        <ChatBubble sender="assistant" style={styles.assistantAnswer}>
          {streamCount === 0 ? <TypingIndicator /> : <Text style={styles.assistantText}>{streamedAnswer}</Text>}
        </ChatBubble>

        {showSource && daikinCurrent ? (
          <ChatSourceCard summary={daikinCurrent} buttonLabel="View Current record" onPress={() => onOpenSummary(daikinCurrent)} />
        ) : null}

        <ChatBubble sender="user">Show all Daikin AC service records.</ChatBubble>
        <ChatBubble sender="assistant" style={styles.assistantAnswer}>
          <Text style={styles.assistantText}>
            I found Current, Pending Review, Superseded, Historical and Duplicate / Alternative Version Daikin AC records. Current is the source of truth; the others are kept for review, audit history or version comparison.
          </Text>
        </ChatBubble>
        {daikinRecords.slice(0, 4).map((record) => (
          <ChatSourceCard key={record.id} summary={record} buttonLabel="View Summary Card" onPress={() => onOpenSummary(record)} />
        ))}

        <ChatBubble sender="user">Do I have duplicate Daikin AC files?</ChatBubble>
        <ChatBubble sender="assistant" style={styles.assistantAnswer}>
          <Text style={styles.assistantText}>
            Yes. I found Dakin Aircon service record 01.pdf with Status: Duplicate / Alternative Version. It is kept in the Logbook, but it does not double-count in Home Protection or become the default source unless you ask for all versions.
          </Text>
        </ChatBubble>
        {daikinDuplicate ? (
          <ChatSourceCard summary={daikinDuplicate} buttonLabel="View duplicate file" onPress={() => onOpenSummary(daikinDuplicate)} />
        ) : null}
      </ScrollView>

      <View style={styles.chatInputDock}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionChips}>
          {chatSuggestions.map((suggestion) => (
            <Pill key={suggestion} tone={suggestion === 'What needs attention?' ? 'cream' : 'neutral'}>
              {suggestion}
            </Pill>
          ))}
        </ScrollView>

        {attachedFile ? (
          <View style={styles.attachedFileChip}>
            <AppIcon name="source" size={28} active />
            <Text style={styles.attachedFileText}>Attached: {attachedFile.title}</Text>
            <Pressable onPress={() => setAttachedFile(null)} style={styles.attachedFileRemove}>
              <Text style={styles.attachedFileRemoveText}>x</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.chatComposer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add to chat"
            onPress={() => setAttachmentSheetVisible(true)}
            style={({ pressed }) => [styles.attachButton, pressed && styles.chatIconButtonPressed]}
          >
            <View style={styles.attachPlusVertical} />
            <View style={styles.attachPlusHorizontal} />
          </Pressable>
          <TextInput
            editable={false}
            value=""
            placeholder="Ask about your home records..."
            placeholderTextColor={colors.muted}
            style={styles.chatInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voice input"
            onPressIn={() => setVoicePressed(true)}
            onPressOut={() => setVoicePressed(false)}
            style={({ pressed }) => [styles.voiceButton, (pressed || voicePressed) && styles.voiceButtonActive]}
          >
            <MicGlyph active={voicePressed} />
          </Pressable>
        </View>
      </View>

      <ChatHistoryDrawer
        visible={drawerVisible}
        activeId={activeConversation.id}
        actionConversation={actionConversation}
        onClose={() => setDrawerVisible(false)}
        onSelect={(item) => {
          setActiveConversation(item);
          setDrawerVisible(false);
        }}
        onLongPress={setActionConversation}
        onCloseActions={() => setActionConversation(null)}
      />

      <ChatAttachmentSheet
        visible={attachmentSheetVisible}
        onClose={() => setAttachmentSheetVisible(false)}
        onAttachLogbook={() => {
          setAttachmentSheetVisible(false);
          setFilePickerVisible(true);
        }}
      />

      <LogbookFilePicker
        visible={filePickerVisible}
        onClose={() => setFilePickerVisible(false)}
        onAttach={(record) => {
          setAttachedFile(record);
          setFilePickerVisible(false);
        }}
      />
    </Screen>
  );
}

function ChatSourceCard({
  summary,
  buttonLabel,
  onPress,
}: {
  summary: SummaryRecord;
  buttonLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chatSourceCard, pressed && styles.pressed]}>
      <View style={styles.chatSourceHeader}>
        <AppIcon name="source" size={34} active />
        <View style={styles.sourceTitleGroup}>
          <Text style={styles.sourceLabel}>Source</Text>
          <Text style={styles.sourceTitle}>{summary.title}</Text>
          {summary.amount ? <Text style={styles.sourceAmount}>{summary.amount}</Text> : null}
        </View>
        <StatusPill status={summary.fileStatus} />
      </View>
      <View style={styles.chatSourceMetaRow}>
        <PropertyScopeChip scope={summary.propertyScope} compact />
        <Text style={styles.chatSourceVersion}>{summary.version} / {summary.latest ? 'Latest version' : 'Older version'}</Text>
      </View>
      <PathChips path={summary.path} onPress={onPress} />
      <CTAButton variant="secondary" small onPress={onPress} style={styles.sourceButton}>
        {buttonLabel}
      </CTAButton>
    </Pressable>
  );
}

function ChatHistoryDrawer({
  visible,
  activeId,
  actionConversation,
  onClose,
  onSelect,
  onLongPress,
  onCloseActions,
}: {
  visible: boolean;
  activeId: string;
  actionConversation: (typeof chatHistoryItems)[number] | null;
  onClose: () => void;
  onSelect: (item: (typeof chatHistoryItems)[number]) => void;
  onLongPress: (item: (typeof chatHistoryItems)[number]) => void;
  onCloseActions: () => void;
}) {
  const slide = useRef(new Animated.Value(-320)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -320,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.drawerRoot}>
        <Pressable style={styles.drawerBackdrop} onPress={onClose} />
        <Animated.View style={[styles.chatDrawer, { transform: [{ translateX: slide }] }]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Home Logbook</Text>
            <Pressable onPress={onClose} style={styles.drawerCloseButton}>
              <CloseGlyph />
            </Pressable>
          </View>

          <View style={styles.drawerNav}>
            <DrawerNavRow icon="chat" label="Chats" active />
            <DrawerNavRow icon="files" label="Projects" />
            <DrawerNavRow icon="star" label="Starred" />
          </View>

          <Text style={styles.drawerSectionTitle}>Recents</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerRecentList}>
            {chatHistoryItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onSelect(item)}
                onLongPress={() => onLongPress(item)}
                style={({ pressed }) => [
                  styles.drawerRecentItem,
                  activeId === item.id && styles.drawerRecentItemActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.drawerRecentText} numberOfLines={1}>{item.title}</Text>
                {item.starred ? <SmallStar /> : null}
              </Pressable>
            ))}
          </ScrollView>

          <Pressable onPress={() => onSelect(chatHistoryItems[0])} style={({ pressed }) => [styles.newChatButton, pressed && styles.pressed]}>
            <Text style={styles.newChatPlus}>+</Text>
            <Text style={styles.newChatText}>New chat</Text>
          </Pressable>
        </Animated.View>

        {actionConversation ? (
          <Pressable style={styles.chatActionOverlay} onPress={onCloseActions}>
            <View style={styles.chatActionMenu}>
              <Text style={styles.chatActionTitle}>{actionConversation.title}</Text>
              {['Rename', 'Star', 'Delete'].map((action) => (
                <Pressable key={action} onPress={onCloseActions} style={({ pressed }) => [styles.chatActionRow, pressed && styles.pressed]}>
                  <Text style={[styles.chatActionText, action === 'Delete' && styles.chatActionDelete]}>{action}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        ) : null}
      </View>
    </Modal>
  );
}

function ChatAttachmentSheet({
  visible,
  onClose,
  onAttachLogbook,
}: {
  visible: boolean;
  onClose: () => void;
  onAttachLogbook: () => void;
}) {
  const slide = useRef(new Animated.Value(360)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : 360,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <Animated.View style={[styles.chatAttachSheet, { transform: [{ translateY: slide }] }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.chatAttachHeader}>
            <Pressable onPress={onClose} style={styles.chatAttachClose}>
              <CloseGlyph />
            </Pressable>
            <Text style={styles.chatAttachTitle}>Add to chat</Text>
            <View style={styles.chatAttachHeaderSpacer} />
          </View>

          <View style={styles.chatAttachTiles}>
            <AttachmentTile label="Camera" icon="camera" />
            <AttachmentTile label="Photos" icon="photos" />
            <AttachmentTile label="Files" icon="files" />
          </View>

          <View style={styles.chatAttachRows}>
            <Pressable onPress={onAttachLogbook} style={({ pressed }) => [styles.chatAttachRow, pressed && styles.pressed]}>
              <AppIcon name="logbook" size={34} muted />
              <Text style={styles.chatAttachRowText}>Attach Logbook file</Text>
              <Text style={styles.chatAttachChevron}>Open</Text>
            </Pressable>
            <View style={styles.chatAttachRow}>
              <GlobeGlyph />
              <Text style={styles.chatAttachRowText}>Web search</Text>
              <View style={styles.mockToggle}>
                <View style={styles.mockToggleKnob} />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function LogbookFilePicker({
  visible,
  onClose,
  onAttach,
}: {
  visible: boolean;
  onClose: () => void;
  onAttach: (record: SummaryRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const lowerQuery = query.trim().toLowerCase();
  const results = allRecords.filter((record) => {
    if (!lowerQuery) return true;
    return [record.title, record.documentType, record.supplier, record.path].some((value) =>
      value?.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={styles.filePickerPanel}>
          <View style={styles.pathPanelHeader}>
            <View style={styles.pathPanelTitleGroup}>
              <Text style={styles.pathPanelTitle}>Attach Logbook file</Text>
              <Text style={styles.pathPanelSubtitle}>Choose source evidence for the next question.</Text>
            </View>
            <CTAButton variant="quiet" small onPress={onClose}>
              Close
            </CTAButton>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Home Logbook files..."
            placeholderTextColor={colors.muted}
            style={styles.filePickerSearch}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filePickerResults}>
            {results.map((record) => (
              <View key={record.id} style={styles.filePickerResult}>
                <AppIcon name="source" size={36} active />
                <View style={styles.filePickerCopy}>
                  <Text style={styles.filePickerTitle}>{record.title}</Text>
                  <Text style={styles.filePickerMeta}>{record.documentType} / {record.supplier ?? 'Issuer pending'}</Text>
                  <Text style={styles.filePickerPath} numberOfLines={2}>{record.path}</Text>
                </View>
                <CTAButton small onPress={() => onAttach(record)} style={styles.filePickerAttach}>
                  Attach
                </CTAButton>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function DrawerNavRow({ icon, label, active = false }: { icon: 'chat' | 'files' | 'star'; label: string; active?: boolean }) {
  return (
    <View style={[styles.drawerNavRow, active && styles.drawerNavRowActive]}>
      {icon === 'chat' ? <AppIcon name="chat" size={30} active={active} muted={!active} /> : null}
      {icon === 'files' ? <AppIcon name="logbook" size={30} active={active} muted={!active} /> : null}
      {icon === 'star' ? <SmallStar muted={!active} /> : null}
      <Text style={[styles.drawerNavText, active && styles.drawerNavTextActive]}>{label}</Text>
    </View>
  );
}

function AttachmentTile({ label, icon }: { label: string; icon: 'camera' | 'photos' | 'files' }) {
  return (
    <Pressable style={({ pressed }) => [styles.attachmentTile, pressed && styles.pressed]}>
      <View style={styles.attachmentTileIcon}>
        {icon === 'camera' ? <CameraGlyph /> : null}
        {icon === 'photos' ? <PhotoGlyph /> : null}
        {icon === 'files' ? <UploadFileGlyph /> : null}
      </View>
      <Text style={styles.attachmentTileText}>{label}</Text>
    </Pressable>
  );
}

function MenuGlyph() {
  return (
    <View style={styles.menuGlyph}>
      <View style={styles.menuLine} />
      <View style={[styles.menuLine, styles.menuLineShort]} />
      <View style={styles.menuLine} />
    </View>
  );
}

function CloseGlyph() {
  return (
    <View style={styles.closeGlyph}>
      <View style={styles.closeLineA} />
      <View style={styles.closeLineB} />
    </View>
  );
}

function MicGlyph({ active = false }: { active?: boolean }) {
  return (
    <View style={styles.micGlyph}>
      <View style={[styles.micBody, active && styles.micActiveLine]} />
      <View style={[styles.micStem, active && styles.micActiveFill]} />
      <View style={[styles.micBase, active && styles.micActiveFill]} />
    </View>
  );
}

function SmallStar({ muted = false }: { muted?: boolean }) {
  return (
    <View style={styles.smallStar}>
      <View style={[styles.smallStarCore, muted && styles.smallStarMuted]} />
      <View style={[styles.smallStarRayV, muted && styles.smallStarMutedFill]} />
      <View style={[styles.smallStarRayH, muted && styles.smallStarMutedFill]} />
    </View>
  );
}

function CameraGlyph() {
  return (
    <View style={styles.cameraGlyph}>
      <View style={styles.cameraTop} />
      <View style={styles.cameraLens} />
    </View>
  );
}

function PhotoGlyph() {
  return (
    <View style={styles.photoGlyph}>
      <View style={styles.photoSun} />
      <View style={styles.photoMountainA} />
      <View style={styles.photoMountainB} />
    </View>
  );
}

function UploadFileGlyph() {
  return (
    <View style={styles.uploadFileGlyph}>
      <View style={styles.uploadFileFold} />
      <View style={styles.uploadArrowStem} />
      <View style={styles.uploadArrowHeadA} />
      <View style={styles.uploadArrowHeadB} />
    </View>
  );
}

function GlobeGlyph() {
  return (
    <View style={styles.globeGlyph}>
      <View style={styles.globeMeridian} />
      <View style={styles.globeEquator} />
    </View>
  );
}

function TypingIndicator() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  return (
    <View style={styles.typingRow}>
      {[0, 1, 2].map((dot) => (
        <Animated.View key={dot} style={[styles.typingDot, { opacity }]} />
      ))}
      <Text style={styles.typingText}>Reading home records</Text>
    </View>
  );
}

type ProfileView = 'main' | 'homeEdit' | 'history' | 'subscription' | 'switchAccount';
type PropertySectionId = 'whole' | 'main' | 'granny' | 'fixtures' | 'services';

type PropertySummaryItem = {
  title: string;
  meta?: string;
  fields: [string, string][];
};

type PropertySummarySection = {
  id: PropertySectionId;
  title: string;
  summary: string;
  pill?: string;
  fields?: [string, string][];
  items?: PropertySummaryItem[];
  editFields?: [string, string][];
  editActions?: string[];
};

const homeEditFields = [
  ['Address', homeAddress],
  ['Property type', 'Detached house'],
  ['Ownership type', 'Owner occupier'],
  ['Floor area', '186 m2'],
  ['Land size', '520 m2'],
  ['Number of bedrooms', '4'],
  ['Number of bathrooms', '2'],
  ['Number of car spaces', '2'],
  ['Number of storeys', '2'],
  ['Year built', '2018'],
  ['Construction type', 'Brick veneer'],
  ['Roof type', 'Colorbond metal roof'],
  ['Main external wall material', 'Brick / rendered finish'],
  ['Notes', 'Family home with HVAC, waterproofing and high-value fixture records tracked in Home Logbook.'],
];

const accountEditFields = [
  ['Account name', 'Demo Homeowner'],
  ['My name / display name', 'Charlie'],
  ['Mobile number', '+61 400 000 000'],
  ['Email address', 'demo@gmail.com'],
  ['Password', '••••••••••'],
  ['Preferred language', 'English'],
  ['Notification email', 'demo@gmail.com'],
  ['Timezone', 'Australia/Sydney'],
];

const historyItems = [
  ['22 Jun 2026, 10:42 AM', 'Uploaded Bathroom Waterproofing Certificate', 'AI Summary Card generated'],
  ['22 Jun 2026, 10:44 AM', 'AI classified file under Waterproofing / Bathroom Waterproofing / Certificate', 'Added to My Home Knowledge Base'],
  ['22 Jun 2026, 10:48 AM', 'Reminder created for waterproofing warranty', 'Warranty reminder active'],
  ['23 Jun 2026, 9:12 AM', 'Uploaded Daikin Ducted AC Installation Invoice', 'Fixture evidence created'],
  ['23 Jun 2026, 9:15 AM', 'AI suggested annual service reminder', 'Pending confirmation'],
  ['24 Jun 2026, 2:30 PM', 'Kitchen Cabinetry Quote updated to version v2', 'Latest version'],
];

const hasGrannyFlat = true;

const propertySummarySections: PropertySummarySection[] = [
  {
    id: 'whole',
    title: 'Whole Property',
    summary: 'Council, zoning, rates and shared site records',
    pill: 'Site level',
    fields: [
      ['Property address', homeAddress],
      ['Council', 'Cumberland City Council'],
      ['Ownership start date', '12 Mar 2021'],
      ['Zoning', 'R2 Low Density Residential'],
      ['Land size', '520 m2'],
      ['Council rates', 'AUD 1,680 / year'],
      ['Building insurance', 'Harbour Mutual Insurance'],
      ['Shared driveway', 'Yes'],
      ['Shared drainage', 'Yes'],
    ],
    editFields: [
      ['Council', 'Cumberland City Council'],
      ['Ownership start date', '12 Mar 2021'],
      ['Lot / plan information', 'Lot 42 / DP 1182047'],
      ['Zoning', 'R2 Low Density Residential'],
      ['Land size', '520 m2'],
      ['Council rates', 'AUD 1,680 / year'],
      ['Strata / body corporate', 'Not applicable'],
      ['Shared systems', 'Shared driveway, drainage and external access'],
      ['Notes', 'Whole-property records support insurance, council, site access and shared services context.'],
    ],
  },
  {
    id: 'main',
    title: 'Main Dwelling',
    summary: 'Primary dwelling structure and protection snapshot',
    pill: '68% protected',
    fields: [
      ['Structure name', 'Main Dwelling'],
      ['Structure type', 'Primary dwelling'],
      ['Year built', '1985'],
      ['Floor area', '186 m2'],
      ['Bedrooms', '4'],
      ['Bathrooms', '2'],
      ['Car spaces', '2'],
      ['Storeys', '2'],
      ['Construction type', 'Brick veneer'],
      ['Roof type', 'Colorbond metal roof'],
      ['External wall material', 'Brick / rendered finish'],
      ['Protection completeness', '68%'],
    ],
    editFields: [
      ['Structure name', 'Main Dwelling'],
      ['Year built', '1985'],
      ['Floor area', '186 m2'],
      ['Bedrooms', '4'],
      ['Bathrooms', '2'],
      ['Car spaces', '2'],
      ['Storeys', '2'],
      ['Construction type', 'Brick veneer'],
      ['Roof type', 'Colorbond metal roof'],
      ['External wall material', 'Brick / rendered finish'],
      ['Notes', 'Primary home record used for maintenance, warranty and fixture summaries.'],
    ],
  },
  {
    id: 'granny',
    title: 'Granny Flat',
    summary: 'Secondary dwelling under the same property',
    pill: '54% protected',
    fields: hasGrannyFlat
      ? [
          ['Structure name', 'Granny Flat'],
          ['Structure type', 'Secondary dwelling'],
          ['Year built', '2022'],
          ['Floor area', '60 m2'],
          ['Bedrooms', '2'],
          ['Bathrooms', '1'],
          ['Kitchen', 'Yes'],
          ['Laundry', 'Yes'],
          ['Separate hot water system', 'Yes'],
          ['Separate electrical meter', 'No'],
          ['Tenanted', 'Yes'],
          ['Protection completeness', '54%'],
        ]
      : [],
    editFields: [
      ['Structure name', 'Granny Flat'],
      ['Year built', '2022'],
      ['Floor area', '60 m2'],
      ['Bedrooms', '2'],
      ['Bathrooms', '1'],
      ['Kitchen', 'Yes'],
      ['Laundry', 'Yes'],
      ['Separate hot water system', 'Yes'],
      ['Separate electrical meter', 'No'],
      ['Tenanted', 'Yes'],
      ['Notes', 'Separate structure under the same property, not a room of the main dwelling.'],
    ],
  },
  {
    id: 'fixtures',
    title: 'Registered Fixtures',
    summary: '4 important fixtures recorded',
    pill: '4 assets',
    items: [
      {
        title: 'Daikin Ducted AC',
        meta: 'HVAC / Main Dwelling',
        fields: [
          ['Type', 'HVAC'],
          ['Scope', 'Main Dwelling'],
          ['Installed', '2023'],
          ['Warranty', 'Current'],
          ['Last service', '22 Jun 2026'],
        ],
      },
      {
        title: 'Rheem Hot Water System',
        meta: 'Hot Water System / Main Dwelling',
        fields: [
          ['Type', 'Hot Water System'],
          ['Scope', 'Main Dwelling'],
          ['Installed', '2021'],
          ['Warranty', 'Current'],
        ],
      },
      {
        title: 'Rinnai Hot Water System',
        meta: 'Hot Water System / Granny Flat',
        fields: [
          ['Type', 'Hot Water System'],
          ['Scope', 'Granny Flat'],
          ['Installed', '2022'],
          ['Warranty', 'Current'],
        ],
      },
      {
        title: 'Kitchen Cabinetry',
        meta: 'Joinery / Main Dwelling',
        fields: [
          ['Type', 'Joinery'],
          ['Scope', 'Main Dwelling'],
          ['Installed', '2024'],
          ['Evidence', 'Invoice attached'],
        ],
      },
    ],
    editActions: ['Add fixture', 'Edit fixture', 'Remove fixture', 'Link source file', 'Link warranty', 'Link service record'],
  },
  {
    id: 'services',
    title: 'My Services',
    summary: '4 recurring service relationships found',
    pill: '4 services',
    items: [
      {
        title: 'HVAC service provider',
        fields: [
          ['Provider', 'AirPro Mechanical Services'],
          ['Linked asset', 'Daikin Ducted AC'],
          ['Next due', '22 Jun 2027'],
        ],
      },
      {
        title: 'Hot water service provider',
        fields: [
          ['Provider', 'Sydney Plumbing Care'],
          ['Linked asset', 'Rheem Hot Water System'],
          ['Next due', '15 Sep 2026'],
        ],
      },
      {
        title: 'Water filter service provider',
        fields: [
          ['Provider', 'PureFlow Water'],
          ['Next due', '03 Nov 2026'],
        ],
      },
      {
        title: 'Termite protection service',
        fields: [
          ['Provider', 'SafePest Australia'],
          ['Next due', '18 Jan 2027'],
        ],
      },
    ],
    editActions: ['Add service provider', 'Edit service provider', 'Link to fixture', 'Set next service due date', 'Link reminder', 'Remove service provider'],
  },
];

const dataExportOptions = [
  'Export all Home Logbook data',
  'Export Summary Cards',
  'Export source file list',
  'Export activity history',
  'Export AI-generated reports',
];

const aiReportSummaries = [
  ['Home Protection Completeness Report', '05 Jul 2026', 'Status-weighted view of current, pending and duplicate evidence.'],
  ['Warranty & Reminder Summary', '02 Jul 2026', 'Upcoming warranty expiries and service reminders across the home.'],
  ['Registered Fixtures Summary', '28 Jun 2026', 'AI-generated fixture register for important fixed assets.'],
  ['Maintenance History Summary', '28 Jun 2026', 'Timeline of service records, invoices and historical maintenance.'],
  ['Insurance Evidence Summary', '25 Jun 2026', 'Evidence pack for policies, certificates and repair invoices.'],
  ['Granny Flat Records Summary', '24 Jun 2026', 'Secondary dwelling record summary under the same property.'],
];

function ProfileScreen({ onOpenAccount }: { onOpenAccount: () => void }) {
  const [view, setView] = useState<ProfileView>('main');

  if (view === 'homeEdit') {
    return <MyHomeEditScreen onBack={() => setView('main')} />;
  }

  if (view === 'history') {
    return <HistoryScreen onBack={() => setView('main')} />;
  }

  if (view === 'subscription') {
    return <SubscriptionScreen onBack={() => setView('main')} />;
  }

  if (view === 'switchAccount') {
    return <SwitchAccountScreen onBack={() => setView('main')} />;
  }

  return (
    <Screen contentStyle={styles.profileContent}>
      <Card pressable onPress={onOpenAccount} style={styles.profileHeaderCard}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>CH</Text>
          </View>
          <View style={styles.profileHeaderCopy}>
            <Text style={styles.profileName}>Charlie</Text>
            <Text style={styles.profileEmail}>demo@gmail.com</Text>
          </View>
          <Pill tone="cream">Plus</Pill>
          <Text style={styles.profileHeaderChevron}>Open</Text>
        </View>
      </Card>

      <PropertySummaryPanel />

      <View style={styles.settingsList}>
        <ProfileMenuItem title="Account" detail="Demo Homeowner / Charlie" onPress={onOpenAccount} />
        <ProfileMenuItem title="History" detail="Uploads, AI actions and file state changes" onPress={() => setView('history')} />
        <ProfileMenuItem title="Subscription" detail="Plus / AUD 5 per month" onPress={() => setView('subscription')} />
        <ProfileMenuItem title="Notification Settings" detail="Email reminders enabled" />
        <ProfileMenuItem title="Switch account" detail="Change user or log out" onPress={() => setView('switchAccount')} />
      </View>
    </Screen>
  );
}

function PropertySummaryPanel() {
  const [expandedSections, setExpandedSections] = useState<Record<PropertySectionId, boolean>>({
    whole: false,
    main: false,
    granny: false,
    fixtures: false,
    services: false,
  });
  const [editingSection, setEditingSection] = useState<PropertySummarySection | null>(null);
  const visibleSections = propertySummarySections.filter((section) => {
    const hasFields = Boolean(section.fields?.length);
    const hasItems = Boolean(section.items?.length);
    return hasFields || hasItems;
  });

  return (
    <Card style={styles.propertySummaryPanel}>
      <View style={styles.profileCardHeader}>
        <View style={styles.propertyTitleGroup}>
          <Pill tone="navy">My Home</Pill>
          <Text style={styles.propertySummaryTitle}>Property Summary</Text>
        </View>
        <Pill tone="cream">AI summary</Pill>
      </View>

      <Text style={styles.profileAddress}>{homeAddress}</Text>
      <View style={styles.profileStats}>
        <ProfileStat label="Protection completeness" value="68%" />
        <ProfileStat label="Records" value="24" />
        <ProfileStat label="Fixtures" value="4" />
        <ProfileStat label="Structures" value={hasGrannyFlat ? '2' : '1'} />
      </View>

      <View style={styles.aiSummaryNotice}>
        <AISuggestionStarIcon />
        <Text style={styles.aiSummaryNoticeText}>AI summarised from your uploaded records. You can edit any section.</Text>
      </View>

      <View style={styles.propertySectionList}>
        {visibleSections.map((section) => (
          <CollapsiblePropertySection
            key={section.id}
            section={section}
            expanded={Boolean(expandedSections[section.id])}
            onToggle={() =>
              setExpandedSections((current) => ({
                ...current,
                [section.id]: !current[section.id],
              }))
            }
            onEdit={() => setEditingSection(section)}
          />
        ))}
      </View>

      <SectionEditModal section={editingSection} onClose={() => setEditingSection(null)} />
    </Card>
  );
}

function CollapsiblePropertySection({
  section,
  expanded,
  onToggle,
  onEdit,
}: {
  section: PropertySummarySection;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <View style={styles.propertySectionCard}>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.propertySectionHeader, pressed && styles.pressed]}>
        <View style={styles.propertySectionHeaderCopy}>
          <Text style={styles.propertySectionTitle}>{section.title}</Text>
          <Text style={styles.propertySectionSummary}>{section.summary}</Text>
        </View>
        {section.pill ? <Pill tone={section.id === 'main' || section.id === 'granny' ? 'cream' : 'neutral'}>{section.pill}</Pill> : null}
        <Text style={styles.propertySectionToggle}>{expanded ? 'Collapse' : 'Expand'}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.propertySectionBody}>
          {section.fields?.length ? <PropertyFieldGrid fields={section.fields} /> : null}
          {section.items?.length ? (
            <View style={styles.propertyItemList}>
              {section.items.map((item) => (
                <View key={item.title} style={styles.propertyItemCard}>
                  <View style={styles.propertyItemHeader}>
                    <Text style={styles.propertyItemTitle}>{item.title}</Text>
                    {item.meta ? <Text style={styles.propertyItemMeta}>{item.meta}</Text> : null}
                  </View>
                  <PropertyFieldGrid fields={item.fields} compact />
                </View>
              ))}
            </View>
          ) : null}
          <CTAButton variant="secondary" small onPress={onEdit} style={styles.propertySectionEditButton}>
            Edit
          </CTAButton>
        </View>
      ) : null}
    </View>
  );
}

function PropertyFieldGrid({ fields, compact = false }: { fields: [string, string][]; compact?: boolean }) {
  return (
    <View style={[styles.propertyFieldGrid, compact && styles.propertyFieldGridCompact]}>
      {fields.map(([label, value]) => (
        <View key={`${label}-${value}`} style={[styles.propertyField, compact && styles.propertyFieldCompact]}>
          <Text style={styles.propertyFieldLabel}>{label}</Text>
          <Text style={styles.propertyFieldValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionEditModal({ section, onClose }: { section: PropertySummarySection | null; onClose: () => void }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [section?.id]);

  return (
    <Modal transparent visible={Boolean(section)} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={styles.sectionEditPanel}>
          {section ? (
            <>
              <View style={styles.pathPanelHeader}>
                <View style={styles.pathPanelTitleGroup}>
                  <Text style={styles.pathPanelTitle}>Edit {section.title}</Text>
                  <Text style={styles.pathPanelSubtitle}>Mock edit controls for this property summary section.</Text>
                </View>
                <CTAButton variant="quiet" small onPress={onClose}>Close</CTAButton>
              </View>

              {saved ? (
                <Card style={styles.saveNotice}>
                  <Text style={styles.saveNoticeTitle}>Section saved</Text>
                  <Text style={styles.saveNoticeText}>This prototype keeps {section.title} changes as mocked data.</Text>
                </Card>
              ) : null}

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionEditContent}>
                {section.editFields?.length ? (
                  <Card style={styles.editFormCard}>
                    {section.editFields.map(([label, value]) => (
                      <MockEditField key={label} label={label} value={value} multiline={label === 'Notes'} />
                    ))}
                  </Card>
                ) : null}

                {section.editActions?.length ? (
                  <Card style={styles.editFormCard}>
                    <Text style={styles.historyIntroTitle}>Mock actions</Text>
                    <View style={styles.sectionActionGrid}>
                      {section.editActions.map((action) => (
                        <CTAButton key={action} variant="secondary" small style={styles.sectionActionButton}>
                          {action}
                        </CTAButton>
                      ))}
                    </View>
                  </Card>
                ) : null}
              </ScrollView>

              <View style={styles.editActionRow}>
                <CTAButton onPress={() => setSaved(true)} style={styles.editActionButton}>Save changes</CTAButton>
                <CTAButton variant="secondary" onPress={onClose} style={styles.editActionButton}>Cancel</CTAButton>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function ProfileMenuItem({ title, detail, onPress }: { title: string; detail: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.settingsRow, pressed && onPress && styles.pressed]}>
      <View style={styles.settingsCopy}>
        <Text style={styles.settingsText}>{title}</Text>
        <Text style={styles.settingsDetail}>{detail}</Text>
      </View>
      <Text style={styles.settingsArrow}>{onPress ? 'Open' : 'Soon'}</Text>
    </Pressable>
  );
}

function MyHomeEditScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="Edit My Home" onBack={onBack} />
      {saved ? (
        <Card style={styles.saveNotice}>
          <Text style={styles.saveNoticeTitle}>Changes saved</Text>
          <Text style={styles.saveNoticeText}>This prototype keeps the edited home profile as mocked data.</Text>
        </Card>
      ) : null}
      <Card style={styles.editFormCard}>
        {homeEditFields.map(([label, value]) => (
          <MockEditField key={label} label={label} value={value} multiline={label === 'Notes'} />
        ))}
      </Card>
      <View style={styles.editActionRow}>
        <CTAButton onPress={() => setSaved(true)} style={styles.editActionButton}>Save changes</CTAButton>
        <CTAButton variant="secondary" onPress={onBack} style={styles.editActionButton}>Cancel</CTAButton>
      </View>
    </Screen>
  );
}

function AccountSettingsScreen({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'settings' | 'myData'>('settings');
  const [saved, setSaved] = useState(false);

  if (view === 'myData') {
    return <MyDataScreen onBack={() => setView('settings')} />;
  }

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="Account Settings" onBack={onBack} />
      <Card style={styles.accountCard}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>CH</Text>
          </View>
          <View style={styles.profileHeaderCopy}>
            <Text style={styles.profileName}>Demo Homeowner</Text>
            <Text style={styles.profileEmail}>Charlie / demo@gmail.com / +61 400 000 000</Text>
          </View>
        </View>
      </Card>
      {saved ? (
        <Card style={styles.saveNotice}>
          <Text style={styles.saveNoticeTitle}>Account updated</Text>
          <Text style={styles.saveNoticeText}>Settings are mocked for the prototype.</Text>
        </Card>
      ) : null}
      <Card style={styles.editFormCard}>
        <MockEditField label="Avatar" value="CH avatar" />
        {accountEditFields.map(([label, value]) => (
          <MockEditField key={label} label={label} value={value} />
        ))}
      </Card>
      <View style={styles.settingsList}>
        <ProfileMenuItem
          title="My Data"
          detail="Export data, view AI-generated reports and manage account deletion"
          onPress={() => setView('myData')}
        />
      </View>
      <View style={styles.editActionRow}>
        <CTAButton onPress={() => setSaved(true)} style={styles.editActionButton}>Save changes</CTAButton>
        <CTAButton variant="secondary" onPress={onBack} style={styles.editActionButton}>Cancel</CTAButton>
      </View>
    </Screen>
  );
}

function MyDataScreen({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState('');

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="My Data" onBack={onBack} />
      <Card style={styles.historyIntroCard}>
        <Text style={styles.historyIntroTitle}>Home Logbook data controls</Text>
        <Text style={styles.historyIntroText}>Export mocked datasets, review AI-generated reports and manage deeper data settings.</Text>
      </Card>

      {message ? (
        <Card style={styles.saveNotice}>
          <Text style={styles.saveNoticeTitle}>{message}</Text>
          <Text style={styles.saveNoticeText}>Mock action complete. No backend data was changed.</Text>
        </Card>
      ) : null}

      <Card style={styles.dataSectionCard}>
        <Text style={styles.dataSectionTitle}>Data export</Text>
        <View style={styles.dataExportList}>
          {dataExportOptions.map((option) => (
            <DataExportCard key={option} title={option} onPress={() => setMessage(`${option} ready`)} />
          ))}
        </View>
      </Card>

      <Card style={styles.dataSectionCard}>
        <Text style={styles.dataSectionTitle}>AI-generated reports and summaries</Text>
        <View style={styles.aiReportList}>
          {aiReportSummaries.map(([title, date, description]) => (
            <AIReportCard key={title} title={title} date={date} description={description} onView={() => setMessage(`${title} opened`)} />
          ))}
        </View>
      </Card>

      <DeleteAccountDangerZone onPress={() => setMessage('Delete account requested')} />
    </Screen>
  );
}

function DataExportCard({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.dataExportRow, pressed && styles.pressed]}>
      <View style={styles.dataExportIcon}>
        <AppIcon name="source" size={28} active />
      </View>
      <Text style={styles.dataExportTitle}>{title}</Text>
      <Text style={styles.settingsArrow}>Export</Text>
    </Pressable>
  );
}

function AIReportCard({
  title,
  date,
  description,
  onView,
}: {
  title: string;
  date: string;
  description: string;
  onView: () => void;
}) {
  return (
    <View style={styles.aiReportCard}>
      <View style={styles.aiReportCopy}>
        <Text style={styles.aiReportTitle}>{title}</Text>
        <Text style={styles.aiReportDate}>{date}</Text>
        <Text style={styles.aiReportDescription}>{description}</Text>
      </View>
      <CTAButton variant="secondary" small onPress={onView}>
        View
      </CTAButton>
    </View>
  );
}

function DeleteAccountDangerZone({ onPress }: { onPress: () => void }) {
  return (
    <Card style={styles.dangerCard}>
      <Text style={styles.dangerTitle}>Delete account</Text>
      <Text style={styles.dangerText}>Permanently delete your account and Home Logbook data.</Text>
      <CTAButton variant="ghost" small onPress={onPress} style={styles.dangerButton}>
        Delete account
      </CTAButton>
    </Card>
  );
}

function HistoryScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="History" onBack={onBack} />
      <Card style={styles.historyIntroCard}>
        <Text style={styles.historyIntroTitle}>Activity Log</Text>
        <Text style={styles.historyIntroText}>Uploads, AI classifications, reminder creation and version changes are tracked over time.</Text>
      </Card>
      <View style={styles.timeline}>
        {historyItems.map(([time, title, status], index) => (
          <Pressable key={`${time}-${title}`} onPress={() => setSelected(title)} style={({ pressed }) => [styles.timelineItem, pressed && styles.pressed]}>
            <View style={styles.timelineRail}>
              <View style={styles.timelineDot} />
              {index < historyItems.length - 1 ? <View style={styles.timelineLine} /> : null}
            </View>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTime}>{time}</Text>
              <Text style={styles.timelineTitle}>{title}</Text>
              <Pill tone={status.includes('Pending') ? 'cream' : 'navy'}>{status}</Pill>
            </View>
          </Pressable>
        ))}
      </View>
      {selected ? (
        <Modal transparent visible animationType="fade" onRequestClose={() => setSelected(null)}>
          <View style={styles.pathModalRoot}>
            <Pressable style={styles.pathBackdrop} onPress={() => setSelected(null)} />
            <Card style={styles.historyDetailPanel}>
              <Text style={styles.pathPanelTitle}>{selected}</Text>
              <Text style={styles.historyIntroText}>Mock detail: this event updated the Home Logbook knowledge base and can be audited later.</Text>
              <CTAButton variant="secondary" onPress={() => setSelected(null)}>Close</CTAButton>
            </Card>
          </View>
        </Modal>
      ) : null}
    </Screen>
  );
}

function SubscriptionScreen({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState('');

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="Subscription" onBack={onBack} />
      <Card style={styles.subscriptionHeroCard}>
        <Pill tone="cream">Active</Pill>
        <Text style={styles.subscriptionPlan}>Plus</Text>
        <Text style={styles.subscriptionPrice}>AUD 5 / month</Text>
      </Card>
      <Card style={styles.editFormCard}>
        <UsageProgressBar label="Files used" value="24 / 200" progress={12} />
        <UsageProgressBar label="Storage used" value="1.8 GB / 10 GB" progress={18} />
        <UsageProgressBar label="AI summaries" value="24 generated" progress={24} />
        <ProfileStat label="Reminders" value="8 active" />
        <ProfileStat label="Homes" value="1 / 1" />
      </Card>
      {message ? (
        <Card style={styles.saveNotice}>
          <Text style={styles.saveNoticeTitle}>{message}</Text>
          <Text style={styles.saveNoticeText}>This is a mocked subscription action.</Text>
        </Card>
      ) : null}
      <View style={styles.settingsList}>
        {['Manage plan', 'Upgrade to Pro', 'Update payment method', 'View billing history', 'Cancel subscription'].map((action) => (
          <ProfileMenuItem key={action} title={action} detail="Mock interaction" onPress={() => setMessage(action)} />
        ))}
      </View>
      <Card style={styles.planCompareCard}>
        <Text style={styles.historyIntroTitle}>Plan comparison</Text>
        {['Free / AUD 0', 'Plus / AUD 5 per month', 'Pro / AUD 10 per month'].map((plan) => (
          <Text key={plan} style={styles.planCompareRow}>{plan}</Text>
        ))}
      </Card>
    </Screen>
  );
}

function SwitchAccountScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState('Current account');

  return (
    <Screen contentStyle={styles.profileContent}>
      <TopBar title="Switch account" onBack={onBack} />
      <Card style={styles.accountCard}>
        <Text style={styles.sourceLabel}>Current account</Text>
        <Text style={styles.profileName}>demo@gmail.com</Text>
        <Pill tone="success">Current</Pill>
      </Card>
      <View style={styles.settingsList}>
        {['Switch to another account', 'Add account', 'Log out'].map((action) => (
          <ProfileMenuItem key={action} title={action} detail={selected === action ? 'Selected' : 'Mock option'} onPress={() => setSelected(action)} />
        ))}
      </View>
      <Card style={styles.saveNotice}>
        <Text style={styles.saveNoticeTitle}>{selected}</Text>
        <Text style={styles.saveNoticeText}>No real authentication changes are made in this prototype.</Text>
      </Card>
    </Screen>
  );
}

function MockEditField({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View style={styles.mockField}>
      <Text style={styles.mockFieldLabel}>{label}</Text>
      <TextInput
        editable={false}
        value={value}
        multiline={multiline}
        style={[styles.mockFieldInput, multiline && styles.mockFieldInputLarge]}
      />
    </View>
  );
}

function UsageProgressBar({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <View style={styles.usageRow}>
      <View style={styles.weightTop}>
        <Text style={styles.weightLabel}>{label}</Text>
        <Text style={styles.weightValue}>{value}</Text>
      </View>
      <View style={styles.weightTrack}>
        <View style={[styles.weightFill, { width: `${Math.max(0, Math.min(100, progress))}%` }]} />
      </View>
    </View>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileStat}>
      <Text style={styles.profileStatLabel}>{label}</Text>
      <Text style={styles.profileStatValue}>{value}</Text>
    </View>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <CTAButton variant="quiet" small onPress={onBack}>
        Back
      </CTAButton>
      <Text style={styles.topBarTitle}>{title}</Text>
      <View style={styles.topBarSpacer} />
    </View>
  );
}

function BottomTabs({
  activeTab,
  onTabChange,
  onUpload,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onUpload: () => void;
}) {
  return (
    <View style={styles.tabBarWrap}>
      {activeTab !== 'Chat' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add record"
          onPress={onUpload}
          style={({ pressed }) => [styles.floatingUpload, pressed && styles.floatingUploadPressed]}
        >
          <View style={styles.floatingPlusVertical} />
          <View style={styles.floatingPlusHorizontal} />
        </Pressable>
      ) : null}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const selected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(tab)}
              style={({ pressed }) => [styles.tabItem, selected && styles.tabItemActive, pressed && styles.pressed]}
            >
              <View style={[styles.tabMark, selected && styles.tabMarkActive]} />
              <AppIcon name={tabIcons[tab]} size={28} active={selected} muted={!selected} />
              <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function buildSummaryNarrative(summary: SummaryRecord) {
  if (summary.id === 'waterproofing-certificate') {
    return 'AI summary: This Bathroom Waterproofing Certificate was issued by BlueSeal Waterproofing. It covers polyurethane waterproofing works for wet areas and records a 5 year warranty linked to the bathroom waterproofing evidence path.';
  }

  if (summary.id === 'kitchen-cabinetry-quote') {
    return 'AI summary: This quote from Northside Joinery Studio captures the kitchen cabinetry scope and quoted amount of AUD 18,750.00. It is filed under the joinery fixture path for renovation evidence and future comparison.';
  }

  if (summary.id === 'daikin-invoice') {
    return 'AI summary: This invoice records the Daikin ducted AC installation by AirPro Mechanical Services. It is linked to the HVAC fixture record and supports warranty, servicing and future maintenance reminders.';
  }

  return `AI summary: This ${summary.documentType.toLowerCase()} is stored in the Home Logbook with supplier, date, version and source evidence attached for future maintenance, warranty and home protection questions.`;
}

function PathDetailModal({ summary, onClose }: { summary: SummaryRecord | null; onClose: () => void }) {
  const [sourcePreviewVisible, setSourcePreviewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    if (!summary) {
      setSourcePreviewVisible(false);
      setEditVisible(false);
    }
  }, [summary]);

  return (
    <Modal transparent visible={Boolean(summary)} animationType="fade" onRequestClose={onClose}>
      <View style={styles.pathModalRoot}>
        <Pressable style={styles.pathBackdrop} onPress={onClose} />
        <View style={styles.pathPanel}>
          {summary ? (
            <>
              <View style={styles.pathPanelHeader}>
                <View style={styles.pathPanelTitleGroup}>
                  <Text style={styles.pathPanelTitle}>Summary Card detail</Text>
                  <Text style={styles.pathPanelSubtitle}>{summary.title}</Text>
                </View>
                <CTAButton variant="quiet" small onPress={onClose}>
                  Close
                </CTAButton>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.summaryDetailContent}>
                <SummaryCard
                  summary={summary}
                  variant="full"
                  onPathPress={() => setSourcePreviewVisible(true)}
                  showActions={false}
                />

                <Card style={styles.aiSummaryCard}>
                  <Text style={styles.sourceLabel}>AI-generated summary</Text>
                  <Text style={styles.aiSummaryText}>{buildSummaryNarrative(summary)}</Text>
                </Card>

                <Card style={styles.extractedInfoCard}>
                  <Text style={styles.sourceLabel}>Key extracted information</Text>
                  <View style={styles.fileMetaGrid}>
                    <FileMeta label="Issued by" value={summary.supplier ?? 'Not captured'} />
                    <FileMeta label="Amount" value={summary.amount ?? 'N/A'} />
                    <FileMeta label="Uploaded" value={summary.uploadedDate} />
                    <FileMeta label="Version" value={`${summary.version} / ${summary.latest ? 'Latest version' : 'Older version'}`} />
                  </View>
                </Card>

                <Card style={styles.pathMetadata}>
                  <Text style={styles.sourceLabel}>Generated file path</Text>
                  <PathChips path={summary.path} onPress={() => setSourcePreviewVisible(true)} />
                </Card>

                <SourceFilePreviewCard
                  summary={summary}
                  onOpenSource={() => setSourcePreviewVisible(true)}
                />
              </ScrollView>

              <View style={styles.summaryDetailFooter}>
                <CTAButton onPress={() => setEditVisible(true)}>Edit</CTAButton>
              </View>

              {sourcePreviewVisible ? (
                <SourcePreviewPanel summary={summary} onClose={() => setSourcePreviewVisible(false)} />
              ) : null}

              {editVisible ? (
                <SummaryCardEditPanel summary={summary} onClose={() => setEditVisible(false)} />
              ) : null}
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function SummaryCardEditPanel({ summary, onClose }: { summary: SummaryRecord; onClose: () => void }) {
  const [selectedScope, setSelectedScope] = useState<PropertyScope>(summary.propertyScope);
  const [selectedStatus, setSelectedStatus] = useState<FileStatus>(summary.fileStatus);
  const editableRows = [
    ['WBS path', `${summary.wbsCode} ${summary.wbsName}`],
    ['Record group / asset', `${summary.recordGroup} / ${summary.asset ?? 'Not captured'}`],
    ['File name', summary.fileName ?? `${summary.title}.pdf`],
    ['Document type', summary.documentType],
    ['Tags', summary.tags.join(', ')],
    ['Extracted fields', summary.details?.map((detail) => `${detail.label}: ${detail.value}`).join(' / ') ?? 'No extracted fields'],
    ['Notes', summary.aiSummary],
  ];

  return (
    <View style={styles.summaryEditOverlay}>
      <View style={styles.summaryEditPanel}>
        <View style={styles.pathPanelHeader}>
          <View style={styles.pathPanelTitleGroup}>
            <Text style={styles.pathPanelTitle}>Edit Summary Card</Text>
            <Text style={styles.pathPanelSubtitle}>Mock edit fields for scope, status and extracted record metadata.</Text>
          </View>
          <CTAButton variant="quiet" small onPress={onClose}>Cancel</CTAButton>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.summaryEditContent}>
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Scope</Text>
            <View style={styles.editOptionWrap}>
              {propertyScopeOptions.map((scope) => (
                <Pressable
                  key={scope}
                  onPress={() => setSelectedScope(scope)}
                  style={({ pressed }) => [styles.editOption, selectedScope === scope && styles.editOptionActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.editOptionText, selectedScope === scope && styles.editOptionTextActive]} numberOfLines={1}>Scope: {scope}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Status</Text>
            <View style={styles.editOptionWrap}>
              {fileStatusOptions.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={({ pressed }) => [styles.editOption, selectedStatus === status && styles.editOptionActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.editOptionText, selectedStatus === status && styles.editOptionTextActive]} numberOfLines={1}>{status}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.editFieldList}>
            {editableRows.map(([label, value]) => (
              <View key={label} style={styles.editFieldRow}>
                <Text style={styles.editFieldLabel}>{label}</Text>
                <Text style={styles.editFieldValue}>{value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.summaryEditActions}>
          <CTAButton variant="secondary" onPress={onClose} style={styles.summaryEditAction}>Cancel</CTAButton>
          <CTAButton onPress={onClose} style={styles.summaryEditAction}>Save changes</CTAButton>
        </View>
      </View>
    </View>
  );
}

function SourcePreviewPanel({ summary, onClose }: { summary: SummaryRecord; onClose: () => void }) {
  const slide = useRef(new Animated.Value(24)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  return (
    <Animated.View style={[styles.sourceOverlay, { opacity: fade }]}>
      <Animated.View style={[styles.sourcePreviewPanel, { transform: [{ translateY: slide }] }]}>
        <View style={styles.pathPanelHeader}>
          <View style={styles.pathPanelTitleGroup}>
            <Text style={styles.pathPanelTitle}>Source file</Text>
            <Text style={styles.pathPanelSubtitle}>{summary.fileName ?? summary.title}</Text>
          </View>
          <CTAButton variant="quiet" small onPress={onClose}>
            Close
          </CTAButton>
        </View>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={styles.largeSourceScroll}>
          <View style={styles.largeFakeDoc}>
            <Text style={styles.invoiceSupplier}>{summary.supplier ?? 'Source issuer'}</Text>
            <Text style={styles.invoiceTitle}>{summary.documentType}</Text>
            <View style={styles.fakeDocLineWide} />
            <View style={styles.fakeDocLine} />
            <View style={styles.fakeDocGrid}>
              <View style={styles.fakeDocBox} />
              <View style={styles.fakeDocBox} />
            </View>
            <Text style={styles.invoiceTotal}>{summary.amount ?? 'Amount not captured'}</Text>
            <View style={styles.fakeDocLineWide} />
            <View style={styles.fakeDocLine} />
            <View style={styles.fakeDocLineWide} />
            <Text style={styles.invoiceTotal}>{summary.path}</Text>
          </View>
        </ScrollView>
        <CTAButton onPress={onClose}>Open source file</CTAButton>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  splashLogoWrap: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1000 / 300,
  },
  splashLogo: {
    width: '100%',
    height: '100%',
  },
  splashLine: {
    fontFamily,
    color: colors.muted,
    marginTop: spacing.xl,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  welcomeContent: {
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  loginContent: {
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  welcomePanel: {
    gap: spacing.xl,
  },
  loginPanel: {
    gap: spacing.xl,
  },
  loginBrand: {
    gap: spacing.lg,
  },
  loginLogo: {
    width: 190,
    height: 58,
  },
  welcomeTitleGroup: {
    gap: spacing.md,
  },
  welcomeTitle: {
    fontFamily,
    color: colors.navy,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  welcomeSubtitle: {
    fontFamily,
    color: colors.text,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
  },
  homeIdCard: {
    gap: spacing.md,
    borderColor: '#D9E3F4',
  },
  homeIdLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  homeIdAddress: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
  },
  welcomeChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  welcomePoints: {
    gap: spacing.md,
  },
  loginCard: {
    gap: spacing.lg,
  },
  loginFieldGroup: {
    gap: spacing.sm,
  },
  loginFieldLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  loginInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
  },
  loginActions: {
    gap: spacing.md,
  },
  forgotLink: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  forgotText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  welcomePoint: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  pointMarker: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
    marginTop: 5,
  },
  pointCopy: {
    flex: 1,
    gap: 2,
  },
  pointTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  pointText: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  dashboardContent: {
    gap: spacing.lg,
  },
  homeHeader: {
    gap: spacing.md,
  },
  myHomeBar: {
    width: '100%',
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderColor: '#D8E2F0',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...softShadow,
  },
  myHomeBarCopy: {
    flex: 1,
    gap: 2,
  },
  switchInlinePill: {
    minHeight: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D7E2F3',
    backgroundColor: colors.surfaceBlue,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchInlineText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  homeHeaderLegacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  homeHeaderCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  homeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  productName: {
    fontFamily,
    color: colors.navy,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  homeSelector: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 2,
  },
  homeSelectorLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  homeSelectorAddress: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  inlineSwitchButton: {
    alignSelf: 'stretch',
    minWidth: 78,
  },
  uploadHero: {
    borderStyle: 'dashed',
    borderColor: '#FFD0C0',
    gap: spacing.lg,
    ...warmShadow,
  },
  uploadHeroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  uploadHeroCopy: {
    flex: 1,
  },
  sectionEyebrow: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  uploadTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  uploadActions: {
    gap: spacing.md,
  },
  uploadActionPrimary: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderColor: '#FFC9B8',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  uploadActionSecondary: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.78,
  },
  uploadActionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadFileIcon: {
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1,
    borderColor: '#D7E2F3',
  },
  uploadActionIconText: {
    fontFamily,
    color: colors.card,
    fontSize: 13,
    fontWeight: '900',
  },
  uploadFileIconText: {
    color: colors.navy,
  },
  miniIconFrame: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCorner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.navy,
  },
  miniCornerTL: {
    left: 2,
    top: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  miniCornerBR: {
    right: 2,
    bottom: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  miniScanLine: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: colors.navy,
  },
  miniFile: {
    width: 20,
    height: 26,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.navy,
  },
  miniPlus: {
    position: 'absolute',
    color: colors.navy,
    fontFamily,
    fontSize: 18,
    fontWeight: '900',
  },
  miniIconLight: {
    borderColor: colors.card,
    backgroundColor: colors.card,
  },
  miniIconDark: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  miniPlusLight: {
    color: colors.card,
  },
  uploadActionCopy: {
    flex: 1,
    gap: 2,
  },
  uploadActionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  uploadActionText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  warningCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  warningAccent: {
    width: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  warningCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  warningTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  warningText: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  sectionAction: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  horizontalCards: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  recentList: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...softShadow,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentTypeBadge: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTypeText: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  recentCopy: {
    flex: 1,
    gap: 2,
  },
  recentTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  recentMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  recentPathLink: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  completenessCard: {
    gap: spacing.md,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  completenessCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  progressDonut: {
    width: 126,
    height: 126,
    borderRadius: 63,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.74)',
    shadowColor: 'rgba(23,23,23,0.16)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    elevation: 5,
  },
  progressRing: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#E4E4E4',
  },
  progressRingCap: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  progressDonutCenter: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(23,23,23,0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  completenessScore: {
    fontFamily,
    color: colors.coral,
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: 0,
  },
  progressDonutLabel: {
    fontFamily,
    color: colors.text,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#ECECEC',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  completenessText: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  completenessNote: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  weightRows: {
    gap: spacing.md,
  },
  weightRow: {
    gap: spacing.sm,
  },
  weightTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recommendationCard: {
    gap: spacing.md,
    backgroundColor: '#FFF9F3',
    borderColor: colors.coral,
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },
  recommendationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiStar: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiStarDiamond: {
    width: 11,
    height: 11,
    borderWidth: 1.3,
    borderColor: colors.coral,
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  aiStarNorth: {
    position: 'absolute',
    top: 1,
    width: 1.3,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  aiStarSouth: {
    position: 'absolute',
    bottom: 1,
    width: 1.3,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  aiStarEast: {
    position: 'absolute',
    right: 1,
    width: 6,
    height: 1.3,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  aiStarWest: {
    position: 'absolute',
    left: 1,
    width: 6,
    height: 1.3,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  recommendationTitle: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  recommendationItem: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  protectionGroups: {
    gap: spacing.md,
  },
  protectionGroup: {
    gap: spacing.sm,
  },
  protectionGroupTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  protectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  protectionRank: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  protectionRowCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  strongText: {
    fontFamily,
    color: colors.success,
    fontSize: 12,
    fontWeight: '900',
  },
  weightLabel: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  weightValue: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  weightTrack: {
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: '#EFEFEF',
    overflow: 'hidden',
  },
  weightFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
  },
  weightFillStandard: {
    backgroundColor: '#A8A8A8',
  },
  weightPill: {
    alignSelf: 'flex-start',
  },
  weightFillNeeds: {
    backgroundColor: colors.coral,
  },
  improveButton: {
    minWidth: 82,
  },
  scanContent: {
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  topBarTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  topBarSpacer: {
    width: 72,
  },
  cameraFrame: {
    height: 330,
    backgroundColor: '#1F2E44',
    borderRadius: 18,
    padding: spacing.xl,
    justifyContent: 'center',
    overflow: 'hidden',
    ...warmShadow,
  },
  documentPreview: {
    backgroundColor: '#FEFCF4',
    borderRadius: radius.sm,
    padding: spacing.lg,
    minHeight: 244,
    transform: [{ rotate: '-1deg' }],
    gap: spacing.md,
  },
  invoiceSupplier: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  invoiceTitle: {
    fontFamily,
    color: colors.navy,
    fontSize: 22,
    fontWeight: '900',
  },
  invoiceLine: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#E7E0CF',
  },
  invoiceLineShort: {
    width: '68%',
  },
  invoiceGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  invoiceBox: {
    flex: 1,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: '#EEE8DA',
  },
  invoiceTotal: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  scanLine: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    height: 3,
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
  },
  corner: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderColor: colors.coral,
  },
  cornerTopLeft: {
    top: spacing.lg,
    left: spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTopRight: {
    top: spacing.lg,
    right: spacing.lg,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: spacing.lg,
    left: spacing.lg,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBottomRight: {
    bottom: spacing.lg,
    right: spacing.lg,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanStepsCard: {
    gap: spacing.lg,
  },
  scanStepsTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  stepsList: {
    gap: spacing.md,
  },
  scanActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  scanActionButton: {
    flex: 1,
  },
  processingContent: {
    justifyContent: 'center',
    gap: spacing.xl,
  },
  processingHero: {
    alignSelf: 'center',
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiRingPulse: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 12,
    borderColor: colors.coral,
  },
  aiRing: {
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 8,
    borderColor: colors.coral,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...warmShadow,
  },
  aiRingLabel: {
    fontFamily,
    color: colors.coral,
    fontSize: 24,
    fontWeight: '900',
  },
  aiRingPercent: {
    fontFamily,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  processingCopy: {
    gap: spacing.sm,
  },
  processingTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    textAlign: 'center',
    fontWeight: '900',
  },
  processingText: {
    fontFamily,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  pipelineCard: {
    gap: spacing.lg,
  },
  summaryScreenContent: {
    gap: spacing.lg,
  },
  conditionCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  conditionRail: {
    width: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  conditionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  conditionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  conditionText: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  successCard: {
    gap: spacing.md,
    borderColor: '#CDE8DA',
  },
  successTitle: {
    fontFamily,
    color: colors.success,
    fontSize: 20,
    fontWeight: '900',
  },
  successText: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  successActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  successButton: {
    flex: 1,
  },
  logbookContent: {
    gap: spacing.lg,
  },
  screenHeader: {
    gap: spacing.sm,
  },
  screenSubtitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  segmented: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  segmentActive: {
    borderColor: colors.navy,
    backgroundColor: colors.surfaceBlue,
  },
  segmentText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: colors.navy,
  },
  metadataNote: {
    gap: spacing.sm,
    backgroundColor: '#FBFCFD',
  },
  metadataTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  metadataText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  taxonomyPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  folderList: {
    gap: spacing.md,
  },
  comingSoonCard: {
    gap: spacing.md,
  },
  comingSoonTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  comingSoonText: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  chatContent: {
    gap: spacing.lg,
  },
  chatAppContent: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  chatTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  chatIconButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    ...softShadow,
  },
  chatIconButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
  chatTitleGroup: {
    flex: 1,
    gap: 1,
  },
  chatTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
  },
  chatSubTitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  assistantAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: '#EFE3C2',
    alignItems: 'center',
    justifyContent: 'center',
    ...softShadow,
  },
  assistantAvatarText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  chatMessages: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  chatMessageList: {
    flex: 1,
    minHeight: 0,
  },
  chatHeroMark: {
    alignSelf: 'center',
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  chatInputDock: {
    gap: spacing.sm,
  },
  suggestionChips: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chatThread: {
    gap: spacing.md,
    minHeight: 330,
  },
  assistantAnswer: {
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  assistantText: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },
  sourceCard: {
    alignSelf: 'flex-start',
    width: '100%',
    gap: spacing.sm,
  },
  chatSourceCard: {
    alignSelf: 'flex-start',
    width: '100%',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(230,230,230,0.86)',
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: spacing.lg,
    ...softShadow,
  },
  chatSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sourceTitleGroup: {
    flex: 1,
    gap: 2,
  },
  sourceLabel: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourceTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  sourcePath: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  sourceButton: {
    alignSelf: 'flex-start',
  },
  sourceAmount: {
    fontFamily,
    color: colors.coral,
    fontSize: 12,
    fontWeight: '900',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  typingText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  chatComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 22,
    padding: spacing.sm,
    ...softShadow,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#F4F4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonText: {
    fontFamily,
    color: colors.navy,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
  },
  attachPlusVertical: {
    position: 'absolute',
    width: 1.6,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: '#777777',
  },
  attachPlusHorizontal: {
    position: 'absolute',
    width: 18,
    height: 1.6,
    borderRadius: radius.pill,
    backgroundColor: '#777777',
  },
  chatInput: {
    flex: 1,
    minHeight: 42,
    color: colors.text,
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  askButton: {
    minWidth: 58,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#FFF0EA',
    borderColor: '#FFD0C0',
  },
  attachedFileChip: {
    minHeight: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    backgroundColor: 'rgba(255,255,255,0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  attachedFileText: {
    flex: 1,
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  attachedFileRemove: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  attachedFileRemoveText: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  drawerRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,23,23,0.26)',
  },
  chatDrawer: {
    width: 312,
    maxWidth: '82%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRightWidth: 1,
    borderRightColor: '#EDEDED',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    ...warmShadow,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  drawerCloseButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F4',
  },
  drawerNav: {
    gap: spacing.sm,
  },
  drawerNavRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
  },
  drawerNavRowActive: {
    backgroundColor: colors.surfaceBlue,
  },
  drawerNavText: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  drawerNavTextActive: {
    color: colors.navy,
    fontWeight: '900',
  },
  drawerSectionTitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  drawerRecentList: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  drawerRecentItem: {
    minHeight: 42,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  drawerRecentItemActive: {
    backgroundColor: '#F7F7F4',
  },
  drawerRecentText: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  newChatButton: {
    minHeight: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-end',
    ...softShadow,
  },
  newChatPlus: {
    fontFamily,
    color: colors.card,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '500',
  },
  newChatText: {
    fontFamily,
    color: colors.card,
    fontSize: 16,
    fontWeight: '900',
  },
  chatActionOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(23,23,23,0.14)',
  },
  chatActionMenu: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
    ...warmShadow,
  },
  chatActionTitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  chatActionRow: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  chatActionText: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  chatActionDelete: {
    color: colors.coral,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,23,23,0.28)',
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  chatAttachSheet: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    ...warmShadow,
  },
  chatAttachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatAttachClose: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: '#F6F6F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAttachTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  chatAttachHeaderSpacer: {
    width: 48,
  },
  chatAttachTiles: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  attachmentTile: {
    flex: 1,
    minHeight: 112,
    borderRadius: 22,
    backgroundColor: '#F4F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  attachmentTileIcon: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentTileText: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  chatAttachRows: {
    gap: spacing.sm,
  },
  chatAttachRow: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#F6F6F4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  chatAttachRowText: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  chatAttachChevron: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  mockToggle: {
    width: 52,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 3,
  },
  mockToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
  },
  filePickerPanel: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '88%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 22,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...warmShadow,
  },
  filePickerSearch: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: '#F6F6F4',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: spacing.lg,
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  filePickerResults: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  filePickerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: spacing.md,
  },
  filePickerCopy: {
    flex: 1,
    gap: 2,
  },
  filePickerTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  filePickerMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  filePickerPath: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  filePickerAttach: {
    minWidth: 72,
  },
  menuGlyph: {
    width: 22,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 1.8,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  menuLineShort: {
    width: 15,
  },
  closeGlyph: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLineA: {
    position: 'absolute',
    width: 22,
    height: 1.8,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '45deg' }],
  },
  closeLineB: {
    position: 'absolute',
    width: 22,
    height: 1.8,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '-45deg' }],
  },
  micGlyph: {
    width: 24,
    height: 26,
    alignItems: 'center',
  },
  micBody: {
    width: 12,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#777777',
  },
  micStem: {
    width: 1.5,
    height: 6,
    backgroundColor: '#777777',
    borderRadius: radius.pill,
  },
  micBase: {
    width: 12,
    height: 1.5,
    backgroundColor: '#777777',
    borderRadius: radius.pill,
  },
  micActiveLine: {
    borderColor: colors.coral,
  },
  micActiveFill: {
    backgroundColor: colors.coral,
  },
  smallStar: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStarCore: {
    width: 9,
    height: 9,
    borderWidth: 1.2,
    borderColor: colors.coral,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  smallStarMuted: {
    borderColor: colors.muted,
  },
  smallStarRayV: {
    position: 'absolute',
    width: 1.2,
    height: 17,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  smallStarRayH: {
    position: 'absolute',
    width: 17,
    height: 1.2,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  smallStarMutedFill: {
    backgroundColor: colors.muted,
  },
  cameraGlyph: {
    width: 27,
    height: 21,
    borderWidth: 1.6,
    borderColor: colors.text,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTop: {
    position: 'absolute',
    top: -5,
    width: 11,
    height: 5,
    borderTopWidth: 1.6,
    borderLeftWidth: 1.6,
    borderRightWidth: 1.6,
    borderColor: colors.text,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.text,
  },
  photoGlyph: {
    width: 27,
    height: 23,
    borderWidth: 1.6,
    borderColor: colors.text,
    borderRadius: 4,
  },
  photoSun: {
    position: 'absolute',
    top: 4,
    left: 5,
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    borderWidth: 1.4,
    borderColor: colors.text,
  },
  photoMountainA: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    width: 12,
    height: 1.5,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '-35deg' }],
  },
  photoMountainB: {
    position: 'absolute',
    right: 4,
    bottom: 6,
    width: 11,
    height: 1.5,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '38deg' }],
  },
  uploadFileGlyph: {
    width: 25,
    height: 28,
    borderWidth: 1.6,
    borderColor: colors.text,
    borderRadius: 4,
  },
  uploadFileFold: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: '#F4F4F2',
  },
  uploadArrowStem: {
    position: 'absolute',
    left: 11,
    top: 10,
    width: 1.5,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  uploadArrowHeadA: {
    position: 'absolute',
    left: 8,
    top: 10,
    width: 7,
    height: 1.5,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '-42deg' }],
  },
  uploadArrowHeadB: {
    position: 'absolute',
    right: 7,
    top: 10,
    width: 7,
    height: 1.5,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    transform: [{ rotate: '42deg' }],
  },
  globeGlyph: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeMeridian: {
    position: 'absolute',
    width: 12,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 1.3,
    borderColor: colors.muted,
  },
  globeEquator: {
    position: 'absolute',
    width: 26,
    height: 1.3,
    borderRadius: radius.pill,
    backgroundColor: colors.muted,
  },
  profileContent: {
    gap: spacing.lg,
  },
  profileHeaderCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileAvatar: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily,
    color: colors.navy,
    fontSize: 16,
    fontWeight: '900',
  },
  profileHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  profileEmail: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  profileHeaderChevron: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  myHomeCard: {
    gap: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  propertySummaryPanel: {
    gap: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderColor: '#EFEFEF',
  },
  propertyTitleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  propertySummaryTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  profileAddress: {
    fontFamily,
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
  },
  profileStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  profileStat: {
    width: '47%',
    minHeight: 78,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: '#FAFAFA',
  },
  profileStatLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  profileStatValue: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  aiSummaryNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FFD8CA',
    backgroundColor: '#FFF8F5',
    padding: spacing.md,
  },
  aiSummaryNoticeText: {
    flex: 1,
    fontFamily,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  propertySectionList: {
    gap: spacing.sm,
  },
  propertySectionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  propertySectionHeader: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  propertySectionHeaderCopy: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  propertySectionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  propertySectionSummary: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  propertySectionToggle: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  propertySectionBody: {
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  propertySectionEditButton: {
    alignSelf: 'flex-start',
  },
  propertyFieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  propertyFieldGridCompact: {
    gap: spacing.xs,
  },
  propertyField: {
    width: '47%',
    minHeight: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FBFCFD',
    padding: spacing.sm,
    gap: 2,
  },
  propertyFieldCompact: {
    width: '48%',
    minHeight: 50,
    padding: spacing.xs,
  },
  propertyFieldLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  propertyFieldValue: {
    fontFamily,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
  propertyItemList: {
    gap: spacing.sm,
  },
  propertyItemCard: {
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    backgroundColor: '#F8FBFF',
    padding: spacing.md,
  },
  propertyItemHeader: {
    gap: 2,
  },
  propertyItemTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  propertyItemMeta: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
  sectionEditPanel: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.84)',
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  sectionEditContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  sectionActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionActionButton: {
    flexGrow: 1,
    flexBasis: '47%',
  },
  switchHomeButton: {
    alignSelf: 'flex-start',
  },
  settingsList: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...softShadow,
  },
  settingsRow: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsCopy: {
    flex: 1,
    gap: 2,
    paddingVertical: spacing.sm,
  },
  settingsText: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  settingsDetail: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.coral,
  },
  settingsArrow: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
  },
  editFormCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  mockField: {
    gap: spacing.xs,
  },
  mockFieldLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  mockFieldInput: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  mockFieldInputLarge: {
    minHeight: 92,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  editActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editActionButton: {
    flex: 1,
  },
  saveNotice: {
    gap: spacing.xs,
    backgroundColor: colors.surfaceGreen,
    borderColor: '#CDE8DA',
  },
  saveNoticeTitle: {
    fontFamily,
    color: colors.success,
    fontSize: 15,
    fontWeight: '900',
  },
  saveNoticeText: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  accountCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  dangerCard: {
    gap: spacing.sm,
    borderColor: '#F1D2C9',
    backgroundColor: '#FFF8F5',
  },
  dangerTitle: {
    fontFamily,
    color: colors.coral,
    fontSize: 14,
    fontWeight: '900',
  },
  dangerText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  dangerButton: {
    alignSelf: 'flex-start',
  },
  dataSectionCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  dataSectionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },
  dataExportList: {
    gap: spacing.sm,
  },
  dataExportRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
  },
  dataExportIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataExportTitle: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
  aiReportList: {
    gap: spacing.sm,
  },
  aiReportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    padding: spacing.md,
  },
  aiReportCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  aiReportTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  aiReportDate: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    fontWeight: '900',
  },
  aiReportDescription: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  historyIntroCard: {
    gap: spacing.sm,
    backgroundColor: colors.cream,
    borderColor: '#EFE3C2',
  },
  historyIntroTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  historyIntroText: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  timeline: {
    gap: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
    marginTop: spacing.lg,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#E1D5C8',
  },
  timelineCard: {
    flex: 1,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: spacing.md,
  },
  timelineTime: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  timelineTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  historyDetailPanel: {
    width: '100%',
    maxWidth: 440,
    gap: spacing.md,
  },
  subscriptionHeroCard: {
    gap: spacing.sm,
    backgroundColor: colors.cream,
    borderColor: '#EFE3C2',
  },
  subscriptionPlan: {
    fontFamily,
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
  },
  subscriptionPrice: {
    fontFamily,
    color: colors.navy,
    fontSize: 17,
    fontWeight: '900',
  },
  usageRow: {
    gap: spacing.sm,
  },
  planCompareCard: {
    gap: spacing.sm,
  },
  planCompareRow: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: spacing.xs,
  },
  tabBarWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  tabBar: {
    height: 74,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    ...warmShadow,
  },
  floatingUpload: {
    position: 'absolute',
    alignSelf: 'center',
    top: -28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.coral,
    borderWidth: 5,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: 'rgba(23,23,23,0.2)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingUploadChat: {
    alignSelf: 'flex-end',
    right: spacing.lg,
    top: -54,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  floatingUploadPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: '#E73D12',
  },
  floatingPlusVertical: {
    position: 'absolute',
    width: 2.2,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
  },
  floatingPlusHorizontal: {
    position: 'absolute',
    width: 22,
    height: 2.2,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: '100%',
  },
  tabItemActive: {},
  tabMark: {
    width: 22,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  tabMarkActive: {
    backgroundColor: colors.navy,
  },
  tabLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  tabLabelActive: {
    color: colors.navy,
  },
  pathModalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pathBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,23,23,0.32)',
  },
  pathPanel: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
    padding: spacing.lg,
    gap: spacing.lg,
    position: 'relative',
    ...warmShadow,
  },
  summaryDetailContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  aiSummaryCard: {
    gap: spacing.sm,
    backgroundColor: 'rgba(253,245,218,0.82)',
    borderColor: '#EFE3C2',
  },
  aiSummaryText: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  extractedInfoCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  homeSwitchPanel: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  homeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: '#FAFAFA',
  },
  homeOptionDot: {
    width: 13,
    height: 13,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  homeOptionDotActive: {
    backgroundColor: colors.coral,
  },
  homeOptionCopy: {
    flex: 1,
    gap: 2,
  },
  homeOptionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  homeOptionMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  reminderDetailPanel: {
    paddingBottom: spacing.md,
  },
  reminderDetailContent: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  detailInfoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#FAFAFA',
    shadowOpacity: 0,
    elevation: 0,
  },
  linkedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  linkedSectionCopy: {
    flex: 1,
    gap: 2,
  },
  linkedSectionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  linkedSectionText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  pathPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  pathPanelTitleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  pathPanelTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  pathPanelSubtitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  segmentStack: {
    gap: spacing.sm,
  },
  locationBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: '#FAFAFA',
    padding: spacing.md,
    gap: spacing.xs,
  },
  pathLabel: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  pathText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#FAFAFA',
  },
  segmentIndex: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  segmentName: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  pathMetadata: {
    gap: spacing.sm,
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  sourcePreviewCard: {
    gap: spacing.md,
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  modalActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modalAction: {
    flexGrow: 1,
    flexBasis: '47%',
  },
  modalActionWide: {
    flexGrow: 1,
    flexBasis: '100%',
  },
  fakeDoc: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  fakeDocLineWide: {
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: '#DED8C8',
    width: '86%',
  },
  fakeDocLine: {
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: '#E8E2D2',
    width: '58%',
  },
  fakeDocGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fakeDocBox: {
    flex: 1,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: '#EFE8D8',
  },
  fileMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fileMetaItem: {
    width: '47%',
    gap: 2,
  },
  fileMetaLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  fileMetaValue: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  sourceOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,23,23,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 18,
  },
  sourcePreviewPanel: {
    width: '100%',
    maxHeight: '86%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  largeSourceScroll: {
    maxHeight: 440,
    borderRadius: radius.md,
  },
  largeFakeDoc: {
    backgroundColor: '#FEFCF4',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  uploadFileContent: {
    gap: spacing.lg,
  },
  uploadFileCard: {
    gap: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: '#EFEFEF',
  },
  fileDropZone: {
    minHeight: 178,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FFD0C0',
    backgroundColor: '#FFF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  fileDropTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  fileDropText: {
    fontFamily,
    color: colors.navy,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '800',
  },
  smartFilingCard: {
    gap: spacing.md,
    borderColor: '#FFD0C0',
    backgroundColor: '#FFF9F6',
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },
  scopeConfirmTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scopeSelectorPanel: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  scopeSelectorOption: {
    minHeight: 58,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scopeSelectorOptionActive: {
    borderColor: colors.navy,
    backgroundColor: colors.surfaceBlue,
  },
  scopeSelectorTitle: {
    flex: 1,
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  viewSettingsButton: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGear: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGearCircle: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1.4,
    borderColor: colors.navy,
  },
  settingsGearTooth: {
    position: 'absolute',
    width: 2,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
  },
  settingsGearToothA: {
    transform: [{ rotate: '0deg' }],
  },
  settingsGearToothB: {
    transform: [{ rotate: '60deg' }],
  },
  settingsGearToothC: {
    transform: [{ rotate: '120deg' }],
  },
  manageViewsPanel: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.84)',
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  manageViewsList: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  manageViewRow: {
    minHeight: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  manageViewCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  manageViewTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  manageViewMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  reorderButtons: {
    gap: 2,
  },
  iosSwitch: {
    width: 52,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: '#E4E4E4',
    padding: 3,
    justifyContent: 'center',
  },
  iosSwitchActive: {
    backgroundColor: colors.coral,
  },
  iosSwitchKnob: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    shadowColor: 'rgba(23,23,23,0.24)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  iosSwitchKnobActive: {
    transform: [{ translateX: 22 }],
  },
  dragHandleIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dragHandleLine: {
    width: 17,
    height: 1.5,
    borderRadius: radius.pill,
    backgroundColor: '#9A9A9A',
  },
  chatSourceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chatSourceVersion: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  summaryDetailFooter: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  summaryEditOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(23,23,23,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  summaryEditPanel: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.86)',
    padding: spacing.lg,
    gap: spacing.md,
    ...warmShadow,
  },
  summaryEditContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  editSection: {
    gap: spacing.sm,
  },
  editSectionTitle: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  editOptionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  editOption: {
    minHeight: 38,
    maxWidth: '100%',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  editOptionActive: {
    borderColor: colors.coral,
    backgroundColor: '#FFF0EA',
  },
  editOptionText: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  editOptionTextActive: {
    color: colors.coral,
  },
  editFieldList: {
    gap: spacing.sm,
  },
  editFieldRow: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    padding: spacing.md,
    gap: spacing.xs,
  },
  editFieldLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  editFieldValue: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  summaryEditActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryEditAction: {
    flex: 1,
  },
  logbookHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    width: '100%',
  },
  logbookHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  logbookSearchButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FFD0C0',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...softShadow,
  },
  logbookSearchButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
    backgroundColor: '#FFF7F3',
  },
  searchGlyph: {
    width: 25,
    height: 25,
  },
  searchGlyphCircle: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 15,
    height: 15,
    borderRadius: radius.pill,
    borderWidth: 1.7,
    borderColor: colors.coral,
  },
  searchGlyphHandle: {
    position: 'absolute',
    right: 3,
    bottom: 4,
    width: 10,
    height: 1.7,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
    transform: [{ rotate: '45deg' }],
  },
  searchModalRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchPanel: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
    position: 'relative',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  searchHeaderTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  searchHeaderSpacer: {
    width: 58,
  },
  searchInputWrap: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: radius.pill,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    minHeight: 50,
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  searchSubmitButton: {
    minWidth: 66,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  searchSubmitButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  searchSubmitText: {
    fontFamily,
    color: colors.card,
    fontSize: 12,
    fontWeight: '900',
  },
  searchSubmitTextDisabled: {
    color: '#9A9A9A',
  },
  searchSuggestionScroller: {
    flexGrow: 0,
    flexShrink: 0,
    height: 36,
    maxHeight: 36,
  },
  searchSuggestionRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
    alignItems: 'center',
  },
  searchSuggestionChip: {
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FFD0C0',
    backgroundColor: '#FFF8F5',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSuggestionText: {
    fontFamily,
    color: colors.coral,
    fontSize: 12,
    fontWeight: '900',
  },
  searchResultsList: {
    flexGrow: 1,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  searchResultsScroll: {
    flex: 1,
    minHeight: 0,
  },
  searchResultsSummary: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },
  searchStartCard: {
    gap: spacing.sm,
    backgroundColor: '#FBFCFD',
    shadowOpacity: 0,
    elevation: 0,
  },
  searchLoadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F8FBFF',
    borderColor: '#CDE1FA',
    shadowOpacity: 0,
    elevation: 0,
  },
  searchLoadingSpinner: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: '#DCEBFA',
    borderTopColor: colors.coral,
    borderRightColor: colors.coral,
  },
  searchLoadingCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  scrollTopButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: '#EAF5FF',
    borderWidth: 1,
    borderColor: '#B9DDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B6FA8',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  scrollTopGlyph: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTopStem: {
    position: 'absolute',
    width: 2,
    height: 15,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
    bottom: 2,
  },
  scrollTopWingLeft: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
    top: 4,
    left: 3,
    transform: [{ rotate: '-42deg' }],
  },
  scrollTopWingRight: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
    top: 4,
    right: 3,
    transform: [{ rotate: '42deg' }],
  },
  searchResultCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  searchResultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  searchResultTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  searchResultTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  searchResultMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  searchPathPreview: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  searchTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  searchResultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: spacing.sm,
  },
  searchResultDate: {
    flex: 1,
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  searchEmptyState: {
    minHeight: 210,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  searchEmptyTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center',
    fontWeight: '900',
  },
  searchEmptyText: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    fontWeight: '700',
  },
  searchEmptyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
