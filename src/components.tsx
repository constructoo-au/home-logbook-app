import React, { PropsWithChildren, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fontFamily, radius, softShadow, spacing, warmShadow } from './theme';
import { LogbookFolder, Reminder, SummaryRecord } from './mockData';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, scroll = true, style, contentStyle }: ScreenProps) {
  return (
    <View style={[styles.screen, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.screenContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.screenContent, styles.screenStatic, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

export function Card({
  children,
  style,
  pressable,
  onPress,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  pressable?: boolean;
  onPress?: () => void;
}>) {
  if (pressable) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

type PillTone = 'navy' | 'coral' | 'cream' | 'neutral' | 'success';
export type IconName =
  | 'home'
  | 'logbook'
  | 'scan'
  | 'filePlus'
  | 'boxEvidence'
  | 'fixture'
  | 'certificate'
  | 'reminder'
  | 'shield'
  | 'folder'
  | 'documentType'
  | 'wbs'
  | 'trade'
  | 'room'
  | 'evidence'
  | 'chat'
  | 'profile'
  | 'source'
  | 'version';

export function Pill({
  children,
  tone = 'neutral',
  style,
  textStyle,
}: PropsWithChildren<{
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}>) {
  return (
    <View style={[styles.pill, pillStyles[tone], style]}>
      <Text style={[styles.pillText, pillTextStyles[tone], textStyle]}>{children}</Text>
    </View>
  );
}

type CTAButtonProps = PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet';
  small?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function CTAButton({
  children,
  onPress,
  variant = 'primary',
  small = false,
  disabled = false,
  style,
}: CTAButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        buttonStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.buttonText, buttonTextStyles[variant], small && styles.buttonTextSmall]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function AppIcon({
  name,
  active = false,
  primary = false,
  muted = false,
  size = 44,
  style,
}: {
  name: IconName;
  active?: boolean;
  primary?: boolean;
  muted?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const stroke = primary ? colors.card : active ? colors.navy : muted ? '#7A7A7A' : colors.navy;
  const tileBg = primary ? colors.coral : active ? colors.surfaceBlue : '#FAFAFA';
  const tileBorder = primary ? colors.coral : active ? '#C7D7EF' : colors.border;
  const line = { backgroundColor: stroke, borderColor: stroke };

  return (
    <View style={[styles.iconTile, { width: size, height: size, borderColor: tileBorder, backgroundColor: tileBg }, style]}>
      <IconGlyph name={name} stroke={stroke} line={line} />
    </View>
  );
}

function IconGlyph({ name, stroke, line }: { name: IconName; stroke: string; line: ViewStyle }) {
  if (name === 'scan') {
    return (
      <View style={styles.scanGlyph}>
        <View style={[styles.scanCornerGroup, styles.scanTL]}>
          <View style={[styles.scanCornerH, styles.scanCornerHTop, line]} />
          <View style={[styles.scanCornerV, styles.scanCornerVLeft, line]} />
        </View>
        <View style={[styles.scanCornerGroup, styles.scanTR]}>
          <View style={[styles.scanCornerH, styles.scanCornerHTop, line]} />
          <View style={[styles.scanCornerV, styles.scanCornerVRight, line]} />
        </View>
        <View style={[styles.scanCornerGroup, styles.scanBL]}>
          <View style={[styles.scanCornerV, styles.scanCornerVLeft, line]} />
          <View style={[styles.scanCornerH, styles.scanCornerHBottom, line]} />
        </View>
        <View style={[styles.scanCornerGroup, styles.scanBR]}>
          <View style={[styles.scanCornerV, styles.scanCornerVRight, line]} />
          <View style={[styles.scanCornerH, styles.scanCornerHBottom, line]} />
        </View>
        <View style={[styles.scanSweep, line]} />
      </View>
    );
  }

  if (name === 'filePlus' || name === 'source' || name === 'version' || name === 'evidence') {
    return (
      <View style={[styles.docGlyph, { borderColor: stroke }]}>
        {name === 'filePlus' ? <Text style={[styles.iconPlus, { color: stroke }]}>+</Text> : null}
        {name === 'source' ? <View style={[styles.sourceFold, { borderColor: stroke }]} /> : null}
        {name === 'version' ? <View style={[styles.versionBack, { borderColor: stroke }]} /> : null}
        {name === 'evidence' ? <View style={[styles.shieldMini, { borderColor: stroke }]} /> : null}
      </View>
    );
  }

  if (name === 'boxEvidence') {
    return (
      <View style={styles.boxGlyph}>
        <View style={[styles.boxTopLeft, line]} />
        <View style={[styles.boxTopRight, line]} />
        <View style={[styles.boxUpperLeft, line]} />
        <View style={[styles.boxUpperRight, line]} />
        <View style={[styles.boxCenterEdge, line]} />
        <View style={[styles.boxLeftEdge, line]} />
        <View style={[styles.boxRightEdge, line]} />
        <View style={[styles.boxBottomLeft, line]} />
        <View style={[styles.boxBottomRight, line]} />
      </View>
    );
  }

  if (name === 'fixture') {
    return (
      <View style={[styles.acGlyph, { borderColor: stroke }]}>
        <View style={[styles.acFan, { borderColor: stroke }]} />
        <View style={[styles.acSlot, line]} />
        <View style={[styles.acSlotSmall, line]} />
      </View>
    );
  }

  if (name === 'folder') {
    return (
      <View style={[styles.folderGlyph, { borderColor: stroke }]}>
        <View style={[styles.folderTab, { borderColor: stroke, backgroundColor: 'transparent' }]} />
      </View>
    );
  }

  if (name === 'logbook') {
    return (
      <View style={styles.bookGlyph}>
        <View style={[styles.bookCover, { borderColor: stroke }]} />
        <View style={[styles.bookSpine, line]} />
        <View style={[styles.bookPageLine, line]} />
        <View style={[styles.bookFold, line]} />
      </View>
    );
  }

  if (name === 'home') {
    return (
      <View style={styles.homeGlyph}>
        <View style={[styles.homeRoofLeft, line]} />
        <View style={[styles.homeRoofRight, line]} />
        <View style={[styles.homeWallLeft, line]} />
        <View style={[styles.homeWallRight, line]} />
        <View style={[styles.homeBase, line]} />
        <View style={[styles.homeDoorLeft, line]} />
        <View style={[styles.homeDoorRight, line]} />
        <View style={[styles.homeDoorTop, line]} />
      </View>
    );
  }

  if (name === 'shield' || name === 'certificate') {
    return (
      <View style={styles.shieldGlyph}>
        <View style={[styles.shieldTop, line]} />
        <View style={[styles.shieldLeft, line]} />
        <View style={[styles.shieldRight, line]} />
        <View style={[styles.shieldLowerLeft, line]} />
        <View style={[styles.shieldLowerRight, line]} />
        <View style={[styles.shieldInnerLine, line]} />
      </View>
    );
  }

  if (name === 'reminder') {
    return (
      <View style={[styles.clockGlyph, { borderColor: stroke }]}>
        <View style={[styles.clockHandTall, line]} />
        <View style={[styles.clockHandShort, line]} />
      </View>
    );
  }

  if (name === 'chat') {
    return (
      <View style={styles.chatGlyphWrap}>
        <View style={[styles.chatGlyph, { borderColor: stroke }]} />
        <View style={[styles.chatTailA, line]} />
        <View style={[styles.chatTailB, line]} />
        <View style={[styles.chatDot, styles.chatDotOne, line]} />
        <View style={[styles.chatDot, styles.chatDotTwo, line]} />
        <View style={[styles.chatDot, styles.chatDotThree, line]} />
      </View>
    );
  }

  if (name === 'profile') {
    return (
      <View style={styles.profileGlyph}>
        <View style={[styles.profileHead, { borderColor: stroke }]} />
        <View style={[styles.profileBody, { borderColor: stroke }]} />
      </View>
    );
  }

  if (name === 'wbs') {
    return (
      <View style={styles.wbsGlyph}>
        <View style={[styles.wbsNode, { borderColor: stroke }]} />
        <View style={[styles.wbsLine, line]} />
        <View style={[styles.wbsNodeSmall, styles.wbsNodeLeft, { borderColor: stroke }]} />
        <View style={[styles.wbsNodeSmall, styles.wbsNodeRight, { borderColor: stroke }]} />
      </View>
    );
  }

  if (name === 'trade') {
    return (
      <View style={styles.tradeGlyph}>
        <View style={[styles.toolHandle, line]} />
        <View style={[styles.toolHead, { borderColor: stroke }]} />
      </View>
    );
  }

  if (name === 'room') {
    return (
      <View style={[styles.roomGlyph, { borderColor: stroke }]}>
        <View style={[styles.roomInner, line]} />
      </View>
    );
  }

  return (
    <View style={[styles.docGlyph, { borderColor: stroke }]}>
      <View style={[styles.docLineA, line]} />
      <View style={[styles.docLineB, line]} />
    </View>
  );
}

export function PathChips({
  path,
  onPress,
  style,
}: {
  path: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const segments = path.split(' / ');

  return (
    <View style={[styles.pathChipBlock, style]}>
      <Text style={styles.pathLabel}>Generated path</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pathChipScroller}>
        {segments.map((segment, index) => (
          <Pressable
            key={`${segment}-${index}`}
            onPress={onPress}
            style={({ pressed }) => [styles.pathChip, pressed && onPress && styles.pressed]}
          >
            <Text style={styles.pathChipText}>{segment}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function SourceFilePreviewCard({
  summary,
  onOpenSource,
  compact = false,
  showAction = true,
  style,
}: {
  summary: SummaryRecord;
  onOpenSource?: () => void;
  compact?: boolean;
  showAction?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const previewDetails = summary.details ?? [];
  const certificateSummary = summary.certificateSummary ?? [];

  return (
    <Card style={[styles.sourcePreviewCard, compact && styles.sourcePreviewCardCompact, style]}>
      <View style={styles.sourcePreviewHeader}>
        <AppIcon name="source" size={compact ? 34 : 40} active />
        <View style={styles.sourcePreviewTitleGroup}>
          <Text style={styles.sourcePreviewEyebrow}>Source file</Text>
          <Text style={styles.sourcePreviewTitle}>{summary.fileName ?? `${summary.title}.pdf`}</Text>
        </View>
      </View>

      <View style={styles.sourceMetaGrid}>
        <SourceMeta label="File type" value={summary.fileType ?? summary.documentType} />
        <SourceMeta label="Uploaded" value={summary.uploadedDate} />
        <SourceMeta label="Version" value={summary.version} />
        <SourceMeta label="Latest" value={summary.latest ? 'Latest version' : 'Older version'} />
      </View>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={[styles.sourcePreviewScroll, compact && styles.sourcePreviewScrollCompact]}
        contentContainerStyle={styles.sourcePreviewDocument}
      >
        <Text style={styles.previewIssuer}>{summary.supplier ?? 'Source issuer'}</Text>
        <Text style={styles.previewDocType}>
          {summary.documentType === 'Certificate' ? 'Certificate of Warranty: Waterproofing Works' : summary.documentType}
        </Text>
        {previewDetails.length > 0 ? (
          <View style={styles.previewDetailGrid}>
            {previewDetails.map((detail) => (
              <View key={detail.label} style={styles.previewDetailRow}>
                <Text style={styles.previewDetailLabel}>{detail.label}</Text>
                <Text style={styles.previewDetailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.previewLineWide} />
        <View style={styles.previewLine} />
        <View style={styles.previewLineShort} />
        <View style={styles.previewGrid}>
          <View style={styles.previewBox} />
          <View style={styles.previewBox} />
        </View>
        {certificateSummary.length > 0 ? (
          <View style={styles.previewSummaryBlock}>
            <Text style={styles.previewSummaryTitle}>Certificate summary</Text>
            {certificateSummary.map((item) => (
              <Text key={item} style={styles.previewBody}>- {item}</Text>
            ))}
          </View>
        ) : null}
        <Text style={styles.previewBody}>
          {summary.title} was uploaded as evidence for {summary.tags.join(', ')}. This preview area scrolls so long
          policies, invoices, certificates and maintenance notes can be inspected without breaking the modal layout.
        </Text>
        <View style={styles.previewLineWide} />
        <View style={styles.previewLine} />
        <Text style={styles.previewAmount}>{summary.amount ?? 'Amount not captured'}</Text>
      </ScrollView>

      {showAction ? (
        <View style={styles.sourcePreviewActions}>
          <CTAButton variant="secondary" small onPress={onOpenSource} style={styles.sourcePreviewAction}>
            Open source file
          </CTAButton>
        </View>
      ) : null}
    </Card>
  );
}

type SummaryCardProps = {
  summary: SummaryRecord;
  variant?: 'full' | 'compact';
  onPathPress?: (summary: SummaryRecord) => void;
  onPress?: (summary: SummaryRecord) => void;
  onConfirm?: () => void;
  onEdit?: () => void;
  onMove?: () => void;
  confirmed?: boolean;
  showPathChips?: boolean;
  showActions?: boolean;
};

export function SummaryCard({
  summary,
  variant = 'compact',
  onPathPress,
  onPress,
  onConfirm,
  onEdit,
  onMove,
  confirmed = false,
  showPathChips = true,
  showActions = true,
}: SummaryCardProps) {
  const isFull = variant === 'full';
  const rows = [
    ['Document type', summary.documentType],
    ['Uploaded date', summary.uploadedDate],
    ['Issued by', summary.supplier],
    ...(summary.details?.map((detail) => [detail.label, detail.value] as [string, string]) ?? []),
    ['Amount', summary.amount],
    ['Asset', summary.asset],
    ['Warranty', summary.warranty],
    ['Reminder suggested', summary.reminder],
    ['Confidence', summary.confidence],
    ['Status', confirmed ? 'Confirmed' : summary.status],
    ['Version', summary.version],
    ['Latest version', summary.latest ? 'Yes' : 'No'],
    ].filter((row): row is [string, string] => Boolean(row[1]));
  const compactDetails = summary.details?.slice(0, 6) ?? [];

  return (
    <Card
      pressable={Boolean(onPress) && !isFull}
      onPress={() => onPress?.(summary)}
      style={[styles.summaryCard, isFull && styles.summaryCardFull]}
    >
      <View style={styles.summaryHeader}>
        <View style={styles.summaryTitleGroup}>
          <Text style={styles.summaryTitle}>{summary.title}</Text>
          <Text style={styles.summarySubtitle}>{summary.documentType}</Text>
        </View>
        <Pill tone={summary.latest ? 'success' : 'neutral'}>{summary.latest ? 'Latest' : 'Older'}</Pill>
      </View>

      {isFull ? (
        <View style={styles.fields}>
          {rows.map(([label, value]) => (
            <FieldRow key={label} label={label} value={value} />
          ))}
        </View>
      ) : (
        <View style={styles.compactBlock}>
          <View style={styles.compactMeta}>
            <Text style={styles.metaText}>{summary.documentType}</Text>
            <Text style={styles.metaDivider}>/</Text>
            <Text style={styles.metaText}>{summary.uploadedDate}</Text>
            <Text style={styles.metaDivider}>/</Text>
            <Text style={styles.metaText}>{summary.version}</Text>
            <Text style={styles.metaDivider}>/</Text>
            <Text style={styles.metaText}>{summary.latest ? 'Latest version' : 'Superseded'}</Text>
          </View>
          <View style={styles.compactMeta}>
            <Text style={styles.metaText}>Issued by: {summary.supplier ?? 'Not captured'}</Text>
            <Text style={styles.metaDivider}>/</Text>
            <Text style={styles.metaText}>Amount: {summary.amount ?? 'N/A'}</Text>
          </View>
          {compactDetails.length > 0 ? (
            <View style={styles.compactDetailGrid}>
              {compactDetails.map((detail) => (
                <View key={detail.label} style={styles.compactDetailItem}>
                  <Text style={styles.compactDetailLabel}>{detail.label}</Text>
                  <Text style={styles.compactDetailValue}>{detail.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}

      {showPathChips ? <PathChips path={summary.path} onPress={() => onPathPress?.(summary)} /> : null}

      <View style={styles.tagRow}>
        {summary.tags.map((tag) => (
          <Pill key={tag} tone={tag.includes('High') || tag.includes('Critical') ? 'cream' : 'neutral'}>
            {tag}
          </Pill>
        ))}
      </View>

      {isFull && showActions ? (
        <View style={styles.summaryActions}>
          <CTAButton onPress={onConfirm} disabled={confirmed} style={styles.flexAction}>
            {confirmed ? 'Confirmed' : 'Confirm'}
          </CTAButton>
          <CTAButton variant="secondary" onPress={onEdit} small>
            Edit
          </CTAButton>
          <CTAButton variant="secondary" onPress={onMove} small>
            Move
          </CTAButton>
          <CTAButton variant="ghost" onPress={() => onPathPress?.(summary)} small>
            View file path
          </CTAButton>
        </View>
      ) : null}
    </Card>
  );
}

export function ReminderCard({
  reminder,
  resolved = false,
  onPress,
}: {
  reminder: Reminder;
  resolved?: boolean;
  onPress?: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const isCondition = reminder.tone === 'condition';
  const theme = reminderThemes[reminder.tone];
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, reminder.tone === 'normal' ? 1.012 : 1.04],
  });

  return (
    <Card
      pressable
      onPress={onPress}
      style={[
        styles.reminderCard,
        { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor },
        resolved && styles.reminderResolved,
      ]}
    >
      <View style={styles.reminderIconRow}>
        <CountdownReminderIcon backgroundColor={theme.iconBackground} strokeColor={theme.iconStroke} />
        <Pill tone={resolved ? 'success' : theme.pillTone}>
          {resolved ? 'Resolved' : reminder.dueLabel}
        </Pill>
      </View>
      <Text style={styles.reminderTitle}>{reminder.title}</Text>
      <View style={styles.reminderNumberStack}>
        {typeof reminder.days === 'number' ? (
          <>
            <Animated.Text style={[styles.daysText, { color: theme.accentColor, transform: [{ scale }] }]}>{reminder.days}</Animated.Text>
            <Text style={styles.reminderCaption}>days remaining</Text>
          </>
        ) : (
          <>
            <Animated.Text style={[styles.actionText, { color: theme.accentColor, transform: [{ scale }] }]}>Action</Animated.Text>
            <Text style={styles.reminderCaption}>high priority</Text>
          </>
        )}
      </View>
    </Card>
  );
}

function CountdownReminderIcon({
  backgroundColor,
  strokeColor,
}: {
  backgroundColor: string;
  strokeColor: string;
}) {
  const line = { backgroundColor: strokeColor, borderColor: strokeColor };

  return (
    <View style={[styles.countdownIcon, { backgroundColor }]}>
      <View style={[styles.countdownClockFace, { borderColor: strokeColor }]} />
      <View style={[styles.countdownHandTall, line]} />
      <View style={[styles.countdownHandShort, line]} />
    </View>
  );
}

function SourceMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.sourceMetaItem}>
      <Text style={styles.sourceMetaLabel}>{label}</Text>
      <Text style={styles.sourceMetaValue}>{value}</Text>
    </View>
  );
}

export function FolderCard({
  folder,
  expanded,
  onToggle,
  onPathPress,
  onSummaryPress,
  iconName = 'folder',
  index = 0,
  dimmed = false,
}: {
  folder: LogbookFolder;
  expanded: boolean;
  onToggle: () => void;
  onPathPress: (summary: SummaryRecord) => void;
  onSummaryPress?: (summary: SummaryRecord) => void;
  iconName?: IconName;
  index?: number;
  dimmed?: boolean;
}) {
  const reveal = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded, reveal]);

  const translateY = reveal.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] });
  const tintStyle = folderTintStyles[index % folderTintStyles.length];

  return (
    <View style={[styles.folderBlock, dimmed && styles.folderBlockDimmed]}>
      <Card style={[styles.folderCard, tintStyle, expanded && styles.folderCardExpanded]}>
        <Pressable onPress={onToggle} style={styles.folderHead}>
          <AppIcon name={iconName} active={expanded} muted={dimmed} />
          <View style={styles.folderTitleGroup}>
            <Text style={styles.folderTitle}>{folder.label}</Text>
            <Text style={styles.folderMeta}>{folder.count} records / Updated {folder.latestUpdate}</Text>
          </View>
          <Text style={styles.expandText}>{expanded ? 'Collapse' : 'Expand'}</Text>
        </Pressable>

        <View style={styles.tagRow}>
          {folder.previewChips.map((chip) => (
            <Pill key={chip} tone="neutral">
              {chip}
            </Pill>
          ))}
        </View>
      </Card>

      {expanded ? (
        <Animated.View style={[styles.expandedRecords, { opacity: reveal, transform: [{ translateY }] }]}>
          {folder.records.length > 0 ? (
            folder.records.map((record) => (
              <SummaryCard key={record.id} summary={record} onPathPress={onPathPress} onPress={onSummaryPress} />
            ))
          ) : (
            <View style={styles.emptyFolder}>
              <Text style={styles.emptyTitle}>No opened record in this slice yet.</Text>
              <Text style={styles.emptyText}>Upload or scan a matching document and AI will place it here automatically.</Text>
            </View>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}

export function ChatBubble({
  sender,
  children,
  style,
}: PropsWithChildren<{
  sender: 'user' | 'assistant';
  style?: StyleProp<ViewStyle>;
}>) {
  const isUser = sender === 'user';

  return (
    <View style={[styles.chatBubble, isUser ? styles.userBubble : styles.aiBubble, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.chatText, isUser && styles.userChatText]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function UploadSheet({
  visible,
  onClose,
  onSmartScan,
  onUploadFile,
}: {
  visible: boolean;
  onClose: () => void;
  onSmartScan: () => void;
  onUploadFile: () => void;
}) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [420, 0] });

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <Animated.View style={[styles.uploadSheet, { transform: [{ translateY }] }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Add to Home Logbook</Text>
              <Text style={styles.sheetSubtitle}>Create a searchable, reminder-ready record.</Text>
            </View>
            <CTAButton variant="quiet" small onPress={onClose}>
              Close
            </CTAButton>
          </View>

          <View style={styles.uploadOptions}>
            <UploadOption
              iconName="scan"
              title="Smart Scan"
              detail="Scan paper records into your Logbook."
              primary
              onPress={onSmartScan}
            />
            <UploadOption
              iconName="filePlus"
              title="Upload file"
              detail="Upload PDFs, photos or documents."
              onPress={onUploadFile}
            />
            <UploadOption
              iconName="boxEvidence"
              title="Add fixture evidence"
              detail="Record fixed assets for future warranty or building protection evidence."
              onPress={onUploadFile}
            />
            <UploadOption
              iconName="certificate"
              title="Add warranty or certificate"
              detail="Upload documents with expiry dates or conditions."
              onPress={onUploadFile}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function UploadOption({
  iconName,
  title,
  detail,
  onPress,
  primary = false,
}: {
  iconName: IconName;
  title: string;
  detail: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.uploadOption, primary && styles.uploadOptionPrimary, pressed && styles.pressed]}
    >
      <AppIcon name={iconName} primary={primary} />
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDetail}>{detail}</Text>
      </View>
    </Pressable>
  );
}

export function ProgressStep({
  label,
  index,
  active,
  completed,
}: {
  label: string;
  index: number;
  active: boolean;
  completed: boolean;
}) {
  return (
    <View style={styles.progressStep}>
      <View style={[styles.stepDot, completed && styles.stepDotDone, active && styles.stepDotActive]}>
        <Text style={[styles.stepDotText, (completed || active) && styles.stepDotTextActive]}>{index + 1}</Text>
      </View>
      <View style={styles.stepCopy}>
        <Text style={[styles.stepLabel, active && styles.stepLabelActive, completed && styles.stepLabelDone]}>
          {label}
        </Text>
        <Text style={styles.stepStatus}>{completed ? 'Complete' : active ? 'In progress' : 'Waiting'}</Text>
      </View>
    </View>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  navy: { backgroundColor: colors.surfaceBlue, borderColor: '#D7E2F3' },
  coral: { backgroundColor: '#FFF0EA', borderColor: '#FFD3C5' },
  cream: { backgroundColor: colors.cream, borderColor: '#F0DFAE' },
  neutral: { backgroundColor: '#F7F7F7', borderColor: colors.border },
  success: { backgroundColor: colors.surfaceGreen, borderColor: '#CDE8DA' },
});

const pillTextStyles = StyleSheet.create({
  navy: { color: colors.navy },
  coral: { color: colors.coral },
  cream: { color: '#7A5D00' },
  neutral: { color: colors.muted },
  success: { color: colors.success },
});

const buttonStyles = StyleSheet.create({
  primary: { backgroundColor: colors.coral, borderColor: colors.coral },
  secondary: { backgroundColor: colors.surfaceBlue, borderColor: '#D8E2F0' },
  ghost: { backgroundColor: colors.card, borderColor: colors.border },
  quiet: { backgroundColor: '#F7F7F7', borderColor: colors.border },
});

const buttonTextStyles = StyleSheet.create({
  primary: { color: colors.card },
  secondary: { color: colors.navy },
  ghost: { color: colors.navy },
  quiet: { color: colors.muted },
});

const folderTintStyles: ViewStyle[] = [
  { backgroundColor: '#FFFDF5', borderColor: '#EFE3C2' },
  { backgroundColor: '#FFF7F3', borderColor: '#FFD8CA' },
  { backgroundColor: '#F6F9FE', borderColor: '#D7E2F3' },
  { backgroundColor: colors.card, borderColor: '#EFE9DD' },
];

const reminderThemes: Record<
  Reminder['tone'],
  {
    backgroundColor: string;
    borderColor: string;
    iconBackground: string;
    iconStroke: string;
    accentColor: string;
    pillTone: PillTone;
  }
> = {
  urgent: {
    backgroundColor: '#FFF0EA',
    borderColor: '#FFD0C0',
    iconBackground: colors.coral,
    iconStroke: colors.card,
    accentColor: colors.coral,
    pillTone: 'coral',
  },
  soon: {
    backgroundColor: '#EEF6FF',
    borderColor: '#CFE2FF',
    iconBackground: '#E3F0FF',
    iconStroke: colors.navy,
    accentColor: colors.navy,
    pillTone: 'navy',
  },
  normal: {
    backgroundColor: '#F7F7F7',
    borderColor: '#E1E1E1',
    iconBackground: '#EFEFEF',
    iconStroke: '#777777',
    accentColor: '#676767',
    pillTone: 'neutral',
  },
  condition: {
    backgroundColor: '#FFF7D8',
    borderColor: '#F0DFAE',
    iconBackground: '#FFF0B8',
    iconStroke: '#8A6400',
    accentColor: '#8A6400',
    pillTone: 'cream',
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 110,
    gap: spacing.lg,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  screenStatic: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...softShadow,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.995 }],
  },
  pill: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
  },
  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    fontFamily,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  buttonTextSmall: {
    fontSize: 13,
  },
  disabled: {
    opacity: 0.68,
  },
  iconTile: {
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanGlyph: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCornerGroup: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
  scanTL: {
    left: 0,
    top: 0,
  },
  scanTR: {
    right: 0,
    top: 0,
  },
  scanBL: {
    left: 0,
    bottom: 0,
  },
  scanBR: {
    right: 0,
    bottom: 0,
  },
  scanCornerH: {
    position: 'absolute',
    left: 0,
    width: 12,
    height: 2,
    borderRadius: radius.pill,
  },
  scanCornerHTop: {
    top: 0,
  },
  scanCornerV: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 12,
    borderRadius: radius.pill,
  },
  scanCornerVLeft: {
    left: 0,
  },
  scanCornerVRight: {
    right: 0,
  },
  scanCornerHBottom: {
    bottom: 0,
  },
  scanSweep: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 13,
    height: 2.2,
    borderRadius: radius.pill,
  },
  docGlyph: {
    width: 20,
    height: 26,
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlus: {
    fontFamily,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '700',
  },
  sealGlyph: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    borderWidth: 1.4,
  },
  sourceFold: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderLeftWidth: 1.4,
    borderBottomWidth: 1.4,
    backgroundColor: colors.card,
  },
  versionBack: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 18,
    height: 24,
    borderWidth: 1.4,
    borderRadius: 4,
  },
  shieldMini: {
    width: 11,
    height: 13,
    borderWidth: 1.4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  boxGlyph: {
    width: 30,
    height: 30,
  },
  boxTopLeft: {
    position: 'absolute',
    top: 7,
    left: 5,
    width: 15,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '-31deg' }],
  },
  boxTopRight: {
    position: 'absolute',
    top: 7,
    right: 5,
    width: 15,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '31deg' }],
  },
  boxUpperLeft: {
    position: 'absolute',
    top: 13,
    left: 4,
    width: 16,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '31deg' }],
  },
  boxUpperRight: {
    position: 'absolute',
    top: 13,
    right: 4,
    width: 16,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '-31deg' }],
  },
  boxCenterEdge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 1.4,
    height: 13,
    borderRadius: radius.pill,
  },
  boxLeftEdge: {
    position: 'absolute',
    top: 13,
    left: 3,
    width: 1.4,
    height: 11,
    borderRadius: radius.pill,
  },
  boxRightEdge: {
    position: 'absolute',
    top: 13,
    right: 3,
    width: 1.4,
    height: 11,
    borderRadius: radius.pill,
  },
  boxBottomLeft: {
    position: 'absolute',
    top: 24,
    left: 4,
    width: 14,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '31deg' }],
  },
  boxBottomRight: {
    position: 'absolute',
    top: 24,
    right: 4,
    width: 14,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '-31deg' }],
  },
  acGlyph: {
    width: 26,
    height: 18,
    borderWidth: 1.4,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acFan: {
    width: 8,
    height: 8,
    borderWidth: 1.4,
    borderRadius: radius.pill,
  },
  acSlot: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 3,
    height: 1.4,
    borderRadius: radius.pill,
  },
  acSlotSmall: {
    position: 'absolute',
    width: 6,
    height: 1.4,
    top: 3,
    right: 4,
    borderRadius: radius.pill,
  },
  folderGlyph: {
    width: 27,
    height: 19,
    borderWidth: 1.4,
    borderRadius: 5,
    marginTop: 4,
  },
  folderTab: {
    position: 'absolute',
    top: -8,
    left: 1,
    width: 13,
    height: 8,
    borderTopWidth: 1.4,
    borderLeftWidth: 1.4,
    borderRightWidth: 1.4,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  bookGlyph: {
    width: 29,
    height: 29,
  },
  bookCover: {
    position: 'absolute',
    left: 5,
    top: 2,
    width: 18,
    height: 24,
    borderWidth: 1.4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 1,
    backgroundColor: 'transparent',
  },
  bookSpine: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 1.4,
    height: 23,
    borderRadius: radius.pill,
  },
  bookPageLine: {
    position: 'absolute',
    left: 9,
    right: 7,
    bottom: 6,
    height: 1.4,
    borderRadius: radius.pill,
  },
  bookFold: {
    position: 'absolute',
    top: 6,
    right: 4,
    width: 8,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '50deg' }],
  },
  homeGlyph: {
    width: 29,
    height: 28,
    alignItems: 'center',
  },
  homeRoofLeft: {
    position: 'absolute',
    top: 7,
    left: 2,
    width: 17,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '-41deg' }],
  },
  homeRoofRight: {
    position: 'absolute',
    top: 7,
    right: 2,
    width: 17,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '41deg' }],
  },
  homeWallLeft: {
    position: 'absolute',
    left: 6,
    top: 13,
    width: 1.4,
    height: 12,
    borderRadius: radius.pill,
  },
  homeWallRight: {
    position: 'absolute',
    right: 6,
    top: 13,
    width: 1.4,
    height: 12,
    borderRadius: radius.pill,
  },
  homeBase: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 3,
    height: 1.4,
    borderRadius: radius.pill,
  },
  homeDoorLeft: {
    position: 'absolute',
    left: 12,
    bottom: 3,
    width: 1.4,
    height: 8,
    borderRadius: radius.pill,
  },
  homeDoorRight: {
    position: 'absolute',
    right: 12,
    bottom: 3,
    width: 1.4,
    height: 8,
    borderRadius: radius.pill,
  },
  homeDoorTop: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    height: 1.4,
    borderRadius: radius.pill,
  },
  shieldGlyph: {
    width: 29,
    height: 29,
  },
  shieldTop: {
    position: 'absolute',
    left: 7,
    top: 4,
    width: 15,
    height: 1.4,
    borderRadius: radius.pill,
  },
  shieldLeft: {
    position: 'absolute',
    left: 6,
    top: 5,
    width: 1.4,
    height: 13,
    borderRadius: radius.pill,
    transform: [{ rotate: '-5deg' }],
  },
  shieldRight: {
    position: 'absolute',
    right: 6,
    top: 5,
    width: 1.4,
    height: 13,
    borderRadius: radius.pill,
    transform: [{ rotate: '5deg' }],
  },
  shieldLowerLeft: {
    position: 'absolute',
    left: 8,
    top: 17,
    width: 11,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '38deg' }],
  },
  shieldLowerRight: {
    position: 'absolute',
    right: 8,
    top: 17,
    width: 11,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '-38deg' }],
  },
  shieldInnerLine: {
    position: 'absolute',
    left: 10,
    top: 12,
    width: 9,
    height: 1.4,
    borderRadius: radius.pill,
  },
  clockGlyph: {
    width: 24,
    height: 24,
    borderWidth: 1.4,
    borderRadius: radius.pill,
  },
  clockHandTall: {
    position: 'absolute',
    left: 10,
    top: 5,
    width: 1.4,
    height: 8,
    borderRadius: radius.pill,
  },
  clockHandShort: {
    position: 'absolute',
    left: 11,
    top: 12,
    width: 7,
    height: 1.4,
    borderRadius: radius.pill,
  },
  chatGlyphWrap: {
    width: 29,
    height: 27,
  },
  chatGlyph: {
    position: 'absolute',
    left: 2,
    top: 4,
    width: 25,
    height: 18,
    borderWidth: 1.4,
    borderRadius: 11,
  },
  chatTailA: {
    position: 'absolute',
    right: 5,
    bottom: 3,
    width: 10,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '36deg' }],
  },
  chatTailB: {
    position: 'absolute',
    right: 2,
    bottom: 1,
    width: 9,
    height: 1.4,
    borderRadius: radius.pill,
    transform: [{ rotate: '66deg' }],
  },
  chatDot: {
    position: 'absolute',
    top: 12,
    width: 2.4,
    height: 2.4,
    borderRadius: radius.pill,
  },
  chatDotOne: {
    left: 9,
  },
  chatDotTwo: {
    left: 14,
  },
  chatDotThree: {
    left: 19,
  },
  profileGlyph: {
    width: 25,
    height: 26,
    alignItems: 'center',
  },
  profileHead: {
    width: 11,
    height: 11,
    borderRadius: radius.pill,
    borderWidth: 1.4,
  },
  profileBody: {
    position: 'absolute',
    bottom: 1,
    width: 22,
    height: 13,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1.4,
  },
  wbsGlyph: {
    width: 27,
    height: 25,
    alignItems: 'center',
  },
  wbsNode: {
    width: 10,
    height: 10,
    borderWidth: 1.4,
    borderRadius: 4,
  },
  wbsLine: {
    width: 1.4,
    height: 7,
    borderRadius: radius.pill,
  },
  wbsNodeSmall: {
    position: 'absolute',
    bottom: 0,
    width: 9,
    height: 9,
    borderWidth: 1.4,
    borderRadius: 4,
  },
  wbsNodeLeft: {
    left: 2,
  },
  wbsNodeRight: {
    right: 2,
  },
  tradeGlyph: {
    width: 27,
    height: 25,
  },
  toolHandle: {
    position: 'absolute',
    left: 12,
    top: 8,
    width: 2,
    height: 18,
    borderRadius: radius.pill,
    transform: [{ rotate: '42deg' }],
  },
  toolHead: {
    position: 'absolute',
    top: 2,
    left: 5,
    width: 17,
    height: 10,
    borderWidth: 1.4,
    borderRadius: 5,
  },
  roomGlyph: {
    width: 26,
    height: 22,
    borderWidth: 1.4,
    borderRadius: 5,
  },
  roomInner: {
    position: 'absolute',
    left: 9,
    top: 0,
    bottom: 0,
    width: 1.4,
    borderRadius: radius.pill,
  },
  docLineA: {
    width: 12,
    height: 1.4,
    borderRadius: radius.pill,
    marginBottom: 4,
  },
  docLineB: {
    width: 9,
    height: 1.4,
    borderRadius: radius.pill,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryCardFull: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(230,230,230,0.82)',
    ...warmShadow,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  summaryTitleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  summarySubtitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  fields: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fieldRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: spacing.xs,
  },
  fieldLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldValue: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  compactBlock: {
    gap: spacing.sm,
  },
  compactMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  compactDetailGrid: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  compactDetailItem: {
    gap: 2,
  },
  compactDetailLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  compactDetailValue: {
    fontFamily,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  metaText: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  metaDivider: {
    color: colors.border,
  },
  pathBlock: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pathLabel: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pathText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  flexAction: {
    flexGrow: 1,
  },
  pathChipBlock: {
    gap: spacing.sm,
  },
  pathChipScroller: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  pathChip: {
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  pathChipText: {
    fontFamily,
    color: colors.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  sourcePreviewCard: {
    gap: spacing.md,
    backgroundColor: 'rgba(251,252,253,0.92)',
    borderColor: 'rgba(221,231,244,0.9)',
  },
  sourcePreviewCardCompact: {
    padding: spacing.md,
    shadowOpacity: 0,
    elevation: 0,
  },
  sourcePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sourcePreviewTitleGroup: {
    flex: 1,
    gap: 2,
  },
  sourcePreviewEyebrow: {
    fontFamily,
    color: colors.navy,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourcePreviewTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  sourceMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sourceMetaItem: {
    width: '47%',
    gap: 2,
  },
  sourceMetaLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourceMetaValue: {
    fontFamily,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  sourcePreviewScroll: {
    maxHeight: 168,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FEFCF4',
  },
  sourcePreviewScrollCompact: {
    maxHeight: 112,
  },
  sourcePreviewDocument: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewIssuer: {
    fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  previewDocType: {
    fontFamily,
    color: colors.navy,
    fontSize: 18,
    fontWeight: '900',
  },
  previewDetailGrid: {
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8DFCC',
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: '#FFFDF7',
  },
  previewDetailRow: {
    gap: 2,
  },
  previewDetailLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewDetailValue: {
    fontFamily,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  previewLineWide: {
    width: '86%',
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E0D9C8',
  },
  previewLine: {
    width: '66%',
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E8E1D1',
  },
  previewLineShort: {
    width: '42%',
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#EDE6D6',
  },
  previewGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  previewBox: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: '#EEE8DA',
  },
  previewBody: {
    fontFamily,
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  previewSummaryBlock: {
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: '#F0DFAE',
    padding: spacing.md,
  },
  previewSummaryTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  previewAmount: {
    fontFamily,
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  sourcePreviewActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sourcePreviewAction: {
    flexGrow: 1,
    flexBasis: '100%',
  },
  reminderCard: {
    width: 184,
    minHeight: 176,
    justifyContent: 'space-between',
  },
  reminderUrgent: {
    borderColor: '#FFD3C5',
  },
  reminderCondition: {
    backgroundColor: colors.cream,
    borderColor: '#F0DFAE',
  },
  reminderResolved: {
    opacity: 0.72,
  },
  reminderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countdownIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownClockFace: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 6,
    top: 6,
    borderRadius: radius.pill,
    borderWidth: 1.7,
  },
  countdownHandTall: {
    position: 'absolute',
    width: 1.7,
    height: 11,
    borderRadius: radius.pill,
    top: 11,
    left: 21,
  },
  countdownHandShort: {
    position: 'absolute',
    width: 11,
    height: 1.7,
    borderRadius: radius.pill,
    top: 22,
    left: 21,
  },
  reminderNumberStack: {
    gap: 1,
  },
  daysText: {
    fontFamily,
    color: colors.coral,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actionText: {
    fontFamily,
    color: colors.coral,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  reminderTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  reminderCaption: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  folderBlock: {
    gap: spacing.md,
  },
  folderBlockDimmed: {
    opacity: 0.58,
  },
  folderCard: {
    gap: spacing.md,
  },
  folderCardExpanded: {
    ...warmShadow,
  },
  folderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBlue,
    borderWidth: 1,
    borderColor: '#D7E2F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderIconText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  folderTitleGroup: {
    flex: 1,
    gap: 2,
  },
  folderTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  folderMeta: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  expandText: {
    fontFamily,
    color: colors.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  expandedRecords: {
    gap: spacing.md,
  },
  emptyFolder: {
    backgroundColor: '#FAFAFA',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    fontFamily,
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  emptyText: {
    fontFamily,
    color: colors.muted,
    lineHeight: 18,
    fontSize: 13,
  },
  chatBubble: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    maxWidth: '88%',
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  chatText: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  userChatText: {
    color: colors.card,
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
  uploadSheet: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.76)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    ...warmShadow,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sheetTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  sheetSubtitle: {
    fontFamily,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  uploadOptions: {
    gap: spacing.md,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  uploadOptionPrimary: {
    borderColor: '#FFD0C0',
    backgroundColor: '#FFF8F5',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconPrimary: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  optionIconText: {
    fontFamily,
    color: colors.navy,
    fontWeight: '900',
    fontSize: 12,
  },
  optionIconPrimaryText: {
    color: colors.card,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  optionDetail: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  stepDotActive: {
    borderColor: colors.coral,
    backgroundColor: colors.coral,
  },
  stepDotDone: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  stepDotText: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  stepDotTextActive: {
    color: colors.card,
  },
  stepCopy: {
    flex: 1,
    gap: 2,
  },
  stepLabel: {
    fontFamily,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  stepLabelActive: {
    color: colors.text,
  },
  stepLabelDone: {
    color: colors.navy,
  },
  stepStatus: {
    fontFamily,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
});
