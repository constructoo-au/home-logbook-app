export type CompletenessRow = {
  label: string;
  value: number;
  weight: 'critical' | 'high' | 'standard';
};

export type Reminder = {
  id: string;
  title: string;
  dueLabel: string;
  days?: number;
  tone: 'urgent' | 'soon' | 'normal' | 'condition';
  detail: string;
  dueDetail: string;
  linkedRecordId: string;
  actionHint?: string;
};

export type SummaryRecord = {
  id: string;
  title: string;
  documentType: string;
  uploadedDate: string;
  path: string;
  supplier?: string;
  amount?: string;
  fileName?: string;
  fileType?: string;
  asset?: string;
  warranty?: string;
  reminder?: string;
  confidence?: string;
  status?: string;
  version: string;
  latest: boolean;
  tags: string[];
  details?: { label: string; value: string }[];
  certificateSummary?: string[];
};

export type LogbookFolder = {
  id: string;
  label: string;
  count: number;
  latestUpdate: string;
  previewChips: string[];
  records: SummaryRecord[];
};

export type LogbookViewName = 'Document Type' | 'WBS' | 'Trade' | 'Fixture' | 'Room' | 'Evidence';

export const homeAddress = '17 Martin St, Lidcombe NSW 2141';

export const recentRecords: SummaryRecord[] = [
  {
    id: 'waterproofing-certificate',
    title: 'BlueSeal Waterproofing Certificate',
    documentType: 'Certificate',
    uploadedDate: '18 Jun 2026',
    path: '17 Martin St / 08 Internal Linings, Waterproofing, Finishes & Flooring / Waterproofing / Bathroom Waterproofing / Certificate',
    supplier: 'BlueSeal Waterproofing',
    amount: 'N/A',
    fileName: 'blueseal-waterproofing-certificate.pdf',
    fileType: 'PDF certificate',
    version: 'v1',
    latest: true,
    tags: ['Wet Area', 'Certificate', 'Warranty', 'High Weight'],
    details: [
      { label: 'Certified by', value: 'Roberto B. Dela Cruz' },
      { label: 'Contractor', value: 'Mycrotyx Builders Corporation' },
      { label: 'Owner', value: 'BDO Unibank, Inc.' },
      { label: 'Subject / work type', value: 'Waterproofing Works' },
      { label: 'Waterproofing system', value: 'Polyurethane waterproofing, cold-applied' },
      { label: 'Covered areas', value: 'Toilets, Hand Sink, Slop Sink and Pantry' },
      { label: 'Quantity', value: '19.21 m2' },
      { label: 'Warranty period', value: '5 years' },
    ],
    certificateSummary: [
      'Works completed in all parts and requirements.',
      'Conforms to contract drawings and specifications.',
      'Ready for inspection and usage.',
      'Owner acceptance does not remove warranty rights under the contract documents.',
    ],
  },
  {
    id: 'daikin-invoice',
    title: 'Daikin Ducted AC Installation Invoice',
    documentType: 'Invoice',
    uploadedDate: '22 Jun 2026',
    path: '17 Martin St / 07 Services Rough-in & Fit-off / HVAC / Daikin Ducted AC / Invoice',
    supplier: 'AirPro Mechanical Services',
    amount: 'AUD 8,240.00',
    fileName: 'daikin-ducted-ac-installation-invoice.pdf',
    fileType: 'PDF invoice',
    asset: 'Daikin Ducted Air Conditioning System',
    warranty: '5 years',
    reminder: 'Warranty expiry and annual service',
    confidence: '0.91',
    status: 'Needs confirmation',
    version: 'v1',
    latest: true,
    tags: ['HVAC', 'Fixture', 'Warranty', 'Services'],
  },
  {
    id: 'insurance-policy',
    title: 'Building Insurance Policy',
    documentType: 'Insurance Policy',
    uploadedDate: '11 Jun 2026',
    path: '17 Martin St / 13 Insurance, Claims & Evidence Packs / Building Insurance / Policy',
    supplier: 'Harbour Mutual Insurance',
    amount: 'AUD 1,420.00 annual premium',
    fileName: 'building-insurance-policy-2026.pdf',
    fileType: 'PDF policy',
    version: 'v3',
    latest: true,
    tags: ['Insurance', 'Critical Record', 'Evidence'],
  },
  {
    id: 'roof-leak-invoice',
    title: 'Roof Leak Repair Invoice',
    documentType: 'Invoice',
    uploadedDate: '04 Jun 2026',
    path: '17 Martin St / 12 Maintenance, Repairs & Service History / Roofing / Roof Leak Repair / Invoice',
    supplier: 'Apex Roofing Repairs',
    amount: 'AUD 2,180.00',
    fileName: 'roof-leak-repair-invoice.pdf',
    fileType: 'PDF invoice',
    version: 'v1',
    latest: true,
    tags: ['Roofing', 'Repair', 'Evidence'],
  },
];

export const daikinSummary = recentRecords[1];

export const reminders: Reminder[] = [
  {
    id: 'insurance-renewal',
    title: 'Building insurance renewal',
    dueLabel: 'due in',
    days: 14,
    tone: 'urgent',
    detail: 'Renew the policy or upload the new annual policy schedule so major-event evidence stays current.',
    dueDetail: '14 days remaining',
    linkedRecordId: 'insurance-policy',
  },
  {
    id: 'daikin-warranty',
    title: 'Daikin ducted AC warranty',
    dueLabel: 'expires in',
    days: 30,
    tone: 'soon',
    detail: 'Warranty expiry is approaching. Keep the invoice and service records connected to the Daikin fixture.',
    dueDetail: '30 days remaining',
    linkedRecordId: 'daikin-invoice',
  },
  {
    id: 'warranty-condition',
    title: 'Warranty condition needs attention',
    dueLabel: 'action needed',
    tone: 'condition',
    detail: 'Annual licensed servicing may be required to keep this warranty valid.',
    dueDetail: 'High priority',
    linkedRecordId: 'daikin-invoice',
    actionHint: 'Upload the latest licensed service record to update this warranty status.',
  },
  {
    id: 'hot-water-service',
    title: 'Hot water system service',
    dueLabel: 'due in',
    days: 60,
    tone: 'normal',
    detail: 'A current service record helps protect the fixture warranty and future home evidence.',
    dueDetail: '60 days remaining',
    linkedRecordId: 'hot-water-warranty',
  },
];

export const completenessRows: CompletenessRow[] = [
  { label: 'Approvals & Certificates', value: 85, weight: 'critical' },
  { label: 'Services & Fixtures', value: 72, weight: 'high' },
  { label: 'Handover & Warranties', value: 64, weight: 'critical' },
  { label: 'Insurance & Evidence', value: 58, weight: 'critical' },
  { label: 'Maintenance Records', value: 42, weight: 'high' },
  { label: 'External Works & Landscaping', value: 20, weight: 'standard' },
];

export const wbsTaxonomy = [
  '00 Home Profile & Property Admin',
  '01 Pre-construction & Contract Setup',
  '02 Planning, Approvals, Certificates & Statutory Insurance',
  '03 Site Establishment & Groundworks',
  '04 Substructure, Slab & Below-ground Services',
  '05 Superstructure, Framing & Structural Works',
  '06 Building Envelope, Roofing, Windows & External Cladding',
  '07 Services Rough-in & Fit-off',
  '08 Internal Linings, Waterproofing, Finishes & Flooring',
  '09 Fixtures, Fittings, Joinery & Built-in Appliances',
  '10 External Works, Driveway, Garage & Landscaping',
  '11 Handover, Manuals, Warranties & As-built Records',
  '12 Maintenance, Repairs & Service History',
  '13 Insurance, Claims & Evidence Packs',
  '14 Financials, Quotes, Contracts, Payments & Variations',
];

const kitchenQuote: SummaryRecord = {
  id: 'kitchen-cabinetry-quote',
  title: 'Kitchen Cabinetry Quote',
  documentType: 'Quote',
  uploadedDate: '20 Jun 2026',
  path: '17 Martin St / 09 Fixtures, Fittings, Joinery & Built-in Appliances / Joinery / Kitchen Cabinetry / Quote',
  supplier: 'Northside Joinery Studio',
  amount: 'AUD 18,750.00',
  fileName: 'kitchen-cabinetry-quote-v2.pdf',
  fileType: 'PDF quote',
  version: 'v2',
  latest: true,
  tags: ['Kitchen', 'Joinery', 'Quote'],
};

const hotWaterWarranty: SummaryRecord = {
  id: 'hot-water-warranty',
  title: 'Hot Water System Warranty',
  documentType: 'Warranty',
  uploadedDate: '12 Jun 2026',
  path: '17 Martin St / 07 Services Rough-in & Fit-off / Plumbing / Hot Water System / Warranty',
  supplier: 'Rheem Australia',
  amount: 'N/A',
  fileName: 'rheem-hot-water-system-warranty.pdf',
  fileType: 'PDF warranty',
  asset: 'Rheem Stellar Hot Water System',
  warranty: '7 years tank, 3 years labour',
  reminder: 'Annual service',
  version: 'v1',
  latest: true,
  tags: ['Plumbing', 'Fixture', 'Warranty', 'Service'],
};

const emptyRecords: SummaryRecord[] = [];

export const documentFolders: LogbookFolder[] = [
  {
    id: 'quotes',
    label: 'Quotes',
    count: 3,
    latestUpdate: '20 Jun 2026',
    previewChips: ['Kitchen', 'Joinery', 'Quote'],
    records: [kitchenQuote],
  },
  {
    id: 'contracts',
    label: 'Contracts',
    count: 2,
    latestUpdate: '03 May 2026',
    previewChips: ['Builder', 'Variations'],
    records: emptyRecords,
  },
  {
    id: 'invoices',
    label: 'Invoices',
    count: 7,
    latestUpdate: '22 Jun 2026',
    previewChips: ['HVAC', 'Roofing', 'Service'],
    records: [recentRecords[1], recentRecords[3]],
  },
  {
    id: 'receipts',
    label: 'Receipts',
    count: 4,
    latestUpdate: '16 Jun 2026',
    previewChips: ['Tiles', 'Paint', 'Hardware'],
    records: emptyRecords,
  },
  {
    id: 'warranties',
    label: 'Warranties',
    count: 5,
    latestUpdate: '22 Jun 2026',
    previewChips: ['Daikin', 'Hot Water', 'Appliances'],
    records: [hotWaterWarranty, recentRecords[1]],
  },
  {
    id: 'certificates',
    label: 'Certificates',
    count: 4,
    latestUpdate: '18 Jun 2026',
    previewChips: ['Waterproofing', 'Occupancy', 'Electrical'],
    records: [recentRecords[0]],
  },
  {
    id: 'manuals',
    label: 'Manuals',
    count: 2,
    latestUpdate: '14 Jun 2026',
    previewChips: ['HVAC', 'Oven'],
    records: emptyRecords,
  },
  {
    id: 'reports',
    label: 'Reports',
    count: 2,
    latestUpdate: '09 Jun 2026',
    previewChips: ['Pest', 'Roof'],
    records: emptyRecords,
  },
  {
    id: 'photos',
    label: 'Photos',
    count: 12,
    latestUpdate: '17 Jun 2026',
    previewChips: ['Before', 'After', 'Evidence'],
    records: emptyRecords,
  },
  {
    id: 'insurance-policies',
    label: 'Insurance Policies',
    count: 1,
    latestUpdate: '11 Jun 2026',
    previewChips: ['Policy', 'Renewal', 'Evidence'],
    records: [recentRecords[2]],
  },
];

export const allRecords = Array.from(
  new Map(documentFolders.flatMap((folder) => folder.records).map((record) => [record.id, record])).values()
);

const byId = Object.fromEntries(allRecords.map((record) => [record.id, record]));

const group = (
  id: string,
  label: string,
  recordIds: string[],
  previewChips: string[],
  latestUpdate = '22 Jun 2026'
): LogbookFolder => ({
  id,
  label,
  count: recordIds.length,
  latestUpdate,
  previewChips,
  records: recordIds.map((recordId) => byId[recordId]).filter(Boolean),
});

export const logbookViewFolders: Record<LogbookViewName, LogbookFolder[]> = {
  'Document Type': documentFolders,
  WBS: [
    group('wbs-02', '02 Planning, Approvals, Certificates & Statutory Insurance', ['waterproofing-certificate'], ['Certificate', 'Compliance']),
    group('wbs-07', '07 Services Rough-in & Fit-off', ['daikin-invoice', 'hot-water-warranty'], ['HVAC', 'Plumbing']),
    group('wbs-08', '08 Internal Linings, Waterproofing, Finishes & Flooring', ['waterproofing-certificate'], ['Bathroom', 'Wet area']),
    group('wbs-09', '09 Fixtures, Fittings, Joinery & Built-in Appliances', ['kitchen-cabinetry-quote'], ['Joinery', 'Fixture']),
    group('wbs-12', '12 Maintenance, Repairs & Service History', ['roof-leak-invoice'], ['Roofing', 'Repair']),
    group('wbs-13', '13 Insurance, Claims & Evidence Packs', ['insurance-policy'], ['Policy', 'Evidence']),
  ],
  Trade: [
    group('trade-plumbing', 'Plumbing', ['hot-water-warranty'], ['Hot water', 'Warranty']),
    group('trade-electrical', 'Electrical', ['waterproofing-certificate'], ['Certificate', 'Ready']),
    group('trade-hvac', 'HVAC', ['daikin-invoice'], ['Daikin', 'Install']),
    group('trade-roofing', 'Roofing', ['roof-leak-invoice'], ['Roof', 'Repair']),
    group('trade-waterproofing', 'Waterproofing', ['waterproofing-certificate'], ['Bathroom', 'Certificate']),
    group('trade-joinery', 'Joinery', ['kitchen-cabinetry-quote'], ['Kitchen', 'Quote']),
    group('trade-carpentry', 'Carpentry', ['kitchen-cabinetry-quote'], ['Built-in', 'Fixture']),
    group('trade-windows-doors', 'Windows & Doors', [], ['External', 'Future']),
  ],
  Fixture: [
    group('fixture-daikin', 'Daikin Ducted AC', ['daikin-invoice'], ['HVAC', 'Warranty']),
    group('fixture-rheem', 'Rheem Hot Water System', ['hot-water-warranty'], ['Plumbing', 'Service']),
    group('fixture-kitchen', 'Kitchen Cabinetry', ['kitchen-cabinetry-quote'], ['Joinery', 'Quote']),
    group('fixture-mixer', 'Kitchen Mixer', [], ['Plumbing', 'Fixture']),
    group('fixture-shower', 'Shower Screen', ['waterproofing-certificate'], ['Bathroom', 'Evidence']),
    group('fixture-garage', 'Garage Door', [], ['External', 'Future']),
    group('fixture-roof-cladding', 'Roof Cladding', ['roof-leak-invoice'], ['Roofing', 'Repair']),
  ],
  Room: [
    group('room-kitchen', 'Kitchen', ['kitchen-cabinetry-quote'], ['Joinery', 'Fixture']),
    group('room-bathroom', 'Bathroom', ['waterproofing-certificate'], ['Certificate', 'Wet area']),
    group('room-laundry', 'Laundry', ['hot-water-warranty'], ['Plumbing', 'Service']),
    group('room-garage', 'Garage', [], ['Door', 'External']),
    group('room-roof', 'Roof', ['roof-leak-invoice'], ['Repair', 'Evidence']),
    group('room-whole-home', 'Whole Home', ['insurance-policy', 'daikin-invoice'], ['Policy', 'HVAC']),
    group('room-external', 'External Area', ['roof-leak-invoice'], ['Roof', 'Weather']),
  ],
  Evidence: [
    group('evidence-insurance', 'Building Insurance Policy', ['insurance-policy'], ['Insurance', 'Major event']),
    group('evidence-fixtures', 'High-value Fixtures', ['daikin-invoice', 'hot-water-warranty'], ['HVAC', 'Hot water']),
    group('evidence-warranty', 'Warranty Evidence', ['hot-water-warranty', 'daikin-invoice'], ['Warranty', 'Service']),
    group('evidence-install', 'Installation Evidence', ['daikin-invoice', 'kitchen-cabinetry-quote'], ['Install', 'Invoice']),
    group('evidence-repair', 'Repair History', ['roof-leak-invoice'], ['Roof', 'Repair']),
    group('evidence-certificates', 'Certificates', ['waterproofing-certificate'], ['Certificate', 'Compliance']),
    group('evidence-service', 'Service Records', ['hot-water-warranty'], ['Service', 'Maintenance']),
  ],
};

export const smartScanSteps = [
  'Detecting document edges',
  'Cropping',
  'Enhancing contrast',
  'Preparing upload',
];

export const aiProcessingSteps = [
  'Reading document',
  'Extracting dates and amounts',
  'Classifying by construction system',
  'Creating Summary Card',
  'Adding to My Home Knowledge Base',
];
