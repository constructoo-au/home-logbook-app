export type CompletenessRow = {
  label: string;
  value: number;
  weight: 'critical' | 'high' | 'standard';
};

export type PropertyScope = 'Whole Property / Shared Asset' | 'Main Dwelling' | 'Granny Flat';
export type FileStatus = 'Current' | 'Superseded' | 'Historical' | 'Pending Review' | 'Duplicate / Alternative Version';

export const propertyScopeOptions: PropertyScope[] = [
  'Whole Property / Shared Asset',
  'Main Dwelling',
  'Granny Flat',
];

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
  homeId: string;
  propertyScope: PropertyScope;
  wbsCode: string;
  wbsName: string;
  recordGroup: string;
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
  fileStatus: FileStatus;
  version: string;
  latest: boolean;
  tags: string[];
  aiSummary: string;
  details?: { label: string; value: string }[];
  certificateSummary?: string[];
};

export type LogbookFolder = {
  id: string;
  label: string;
  count: number;
  latestUpdate: string;
  previewChips: string[];
  description?: string;
  records: SummaryRecord[];
};

export type LogbookViewName =
  | 'WBS'
  | 'Scope'
  | 'Status'
  | 'Document Type'
  | 'Trade / System'
  | 'Fixture / Asset'
  | 'Room / Location'
  | 'Evidence';

export const homeAddress = '17 Martin St, Lidcombe NSW 2141';

export const recentRecords: SummaryRecord[] = [
  {
    id: 'waterproofing-certificate',
    homeId: '17-martin-st',
    propertyScope: 'Main Dwelling',
    wbsCode: '09.04',
    wbsName: 'Wet Area Waterproofing',
    recordGroup: 'Bathroom Waterproofing',
    title: 'BlueSeal Waterproofing Certificate',
    documentType: 'Certificate',
    uploadedDate: '18 Jun 2026',
    path: '17 Martin St / Main Dwelling / 09 Internal Linings, Waterproofing, Finishes & Flooring / 09.04 Wet Area Waterproofing / Bathroom Waterproofing / BlueSeal Waterproofing Certificate.pdf',
    supplier: 'BlueSeal Waterproofing',
    amount: 'N/A',
    fileName: 'blueseal-waterproofing-certificate.pdf',
    fileType: 'PDF certificate',
    status: 'Current',
    fileStatus: 'Current',
    version: 'v1',
    latest: true,
    tags: ['Wet Area', 'Certificate', 'Waterproofing', 'Insurance Evidence'],
    aiSummary: 'Certificate evidence for main dwelling bathroom waterproofing and future insurance or warranty questions.',
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
    homeId: '17-martin-st',
    propertyScope: 'Main Dwelling',
    wbsCode: '13.03',
    wbsName: 'HVAC & Mechanical Servicing',
    recordGroup: 'Daikin Ducted AC',
    title: 'Daikin Ducted AC Service Invoice',
    documentType: 'Invoice',
    uploadedDate: '22 Jun 2026',
    path: '17 Martin St / Main Dwelling / 13. Maintenance, Servicing & Routine Care / 13.03 HVAC & Mechanical Servicing / Daikin Ducted AC / Daikin AC Service Invoice v1.pdf',
    supplier: 'AirPro Mechanical Services',
    amount: 'AUD 8,240.00',
    fileName: 'Daikin AC Service Invoice v1.pdf',
    fileType: 'PDF invoice',
    asset: 'Daikin Ducted Air Conditioning System',
    warranty: '5 years',
    reminder: 'Warranty expiry and annual service',
    confidence: '0.91',
    status: 'Pending Review',
    fileStatus: 'Pending Review',
    version: 'v1',
    latest: true,
    tags: ['HVAC', 'Fixture', 'Warranty', 'Maintenance Evidence'],
    aiSummary: 'Service invoice for the main dwelling ducted AC, useful for warranty continuity and maintenance history.',
  },
  {
    id: 'insurance-policy',
    homeId: '17-martin-st',
    propertyScope: 'Whole Property / Shared Asset',
    wbsCode: '16.01',
    wbsName: 'Building Insurance Policy',
    recordGroup: 'Building Insurance',
    title: 'Building Insurance Policy',
    documentType: 'Insurance Policy',
    uploadedDate: '11 Jun 2026',
    path: '17 Martin St / Whole Property / 16 Building Insurance, Claims & Evidence Packs / 16.01 Building Insurance Policy / 2026 Building Insurance Policy.pdf',
    supplier: 'Harbour Mutual Insurance',
    amount: 'AUD 1,420.00 annual premium',
    fileName: 'building-insurance-policy-2026.pdf',
    fileType: 'PDF policy',
    status: 'Current',
    fileStatus: 'Current',
    version: 'v3',
    latest: true,
    tags: ['Insurance', 'Critical Record', 'Evidence', 'Applies to Main Dwelling, Granny Flat, Shared Assets'],
    aiSummary: 'Whole-property insurance policy covering shared assets and multiple structures at the address.',
  },
  {
    id: 'roof-leak-invoice',
    homeId: '17-martin-st',
    propertyScope: 'Main Dwelling',
    wbsCode: '13.02',
    wbsName: 'Roof Repairs & Service History',
    recordGroup: 'Roof Leak Repair',
    title: 'Roof Leak Repair Invoice',
    documentType: 'Invoice',
    uploadedDate: '04 Jun 2026',
    path: '17 Martin St / Main Dwelling / 13 Maintenance, Servicing & Routine Care / 13.02 Roof Repairs & Service History / Roof Leak Repair / Invoice',
    supplier: 'Apex Roofing Repairs',
    amount: 'AUD 2,180.00',
    fileName: 'roof-leak-repair-invoice.pdf',
    fileType: 'PDF invoice',
    status: 'Current',
    fileStatus: 'Current',
    version: 'v1',
    latest: true,
    tags: ['Roofing', 'Repair', 'Evidence'],
    aiSummary: 'Repair evidence for the main dwelling roof leak, linked to future defect and insurance questions.',
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
  {
    id: 'granny-flat-hot-water-warranty',
    title: 'Granny flat hot water warranty',
    dueLabel: 'review in',
    days: 45,
    tone: 'soon',
    detail: 'The granny flat has a separate Rinnai hot water warranty. Keep it separate from the main dwelling Rheem system.',
    dueDetail: '45 days remaining',
    linkedRecordId: 'granny-flat-hot-water-warranty',
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
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '10.02',
  wbsName: 'Kitchen Cabinetry',
  recordGroup: 'Kitchen Cabinetry',
  title: 'Kitchen Cabinetry Quote',
  documentType: 'Quote',
  uploadedDate: '20 Jun 2026',
  path: '17 Martin St / Main Dwelling / 10 Fixtures, Fittings, Joinery & Built-in Appliances / Kitchen Cabinetry / Kitchen Cabinetry Quote.pdf',
  supplier: 'Northside Joinery Studio',
  amount: 'AUD 18,750.00',
  fileName: 'kitchen-cabinetry-quote-v2.pdf',
  fileType: 'PDF quote',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v2',
  latest: true,
  tags: ['Kitchen', 'Joinery', 'Quote'],
  aiSummary: 'Main dwelling kitchen cabinetry quote captured as fixture and future insurance evidence.',
};

const hotWaterWarranty: SummaryRecord = {
  id: 'hot-water-warranty',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '08.09',
  wbsName: 'Hot Water Systems',
  recordGroup: 'Rheem Hot Water System',
  title: 'Rheem Hot Water System Warranty',
  documentType: 'Warranty',
  uploadedDate: '12 Jun 2026',
  path: '17 Martin St / Main Dwelling / 08 Services Systems / 08.09 Hot Water Systems / Rheem Hot Water System / Warranty',
  supplier: 'Rheem Australia',
  amount: 'N/A',
  fileName: 'rheem-hot-water-system-warranty.pdf',
  fileType: 'PDF warranty',
  asset: 'Rheem Stellar Hot Water System',
  warranty: '7 years tank, 3 years labour',
  reminder: 'Annual service',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v1',
  latest: true,
  tags: ['Plumbing', 'Fixture', 'Warranty', 'Service'],
  aiSummary: 'Main dwelling Rheem hot water warranty with service conditions and current status.',
};

const daikinCurrentService: SummaryRecord = {
  id: 'daikin-service-current',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '13.03',
  wbsName: 'HVAC & Mechanical Servicing',
  recordGroup: 'Daikin Ducted AC',
  title: 'Daikin AC Service Invoice v2',
  documentType: 'Service Record',
  uploadedDate: '28 Jun 2026',
  path: '17 Martin St / Main Dwelling / 13. Maintenance, Servicing & Routine Care / 13.03 HVAC & Mechanical Servicing / Daikin Ducted AC / Daikin AC Service Invoice v2.pdf',
  supplier: 'AirPro Mechanical Services',
  amount: 'AUD 420.00',
  fileName: 'Daikin AC Service Invoice v2.pdf',
  fileType: 'PDF invoice',
  asset: 'Daikin Ducted AC',
  confidence: '0.96',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v2',
  latest: true,
  tags: ['HVAC', 'Service Record', 'Current', 'Maintenance Evidence'],
  aiSummary: 'Latest confirmed Daikin ducted AC service record used by Chat, reminders and protection completeness.',
};

const daikinSupersededService: SummaryRecord = {
  id: 'daikin-service-superseded',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '13.03',
  wbsName: 'HVAC & Mechanical Servicing',
  recordGroup: 'Daikin Ducted AC',
  title: 'Daikin AC Service Invoice v0',
  documentType: 'Service Record',
  uploadedDate: '02 Mar 2025',
  path: '17 Martin St / Main Dwelling / 13. Maintenance, Servicing & Routine Care / 13.03 HVAC & Mechanical Servicing / Daikin Ducted AC / Daikin AC Service Invoice v0.pdf',
  supplier: 'AirPro Mechanical Services',
  amount: 'AUD 390.00',
  fileName: 'Daikin AC Service Invoice v0.pdf',
  fileType: 'PDF invoice',
  asset: 'Daikin Ducted AC',
  confidence: '0.93',
  status: 'Superseded',
  fileStatus: 'Superseded',
  version: 'v0',
  latest: false,
  tags: ['HVAC', 'Service Record', 'Superseded'],
  aiSummary: 'Older Daikin service record kept for audit history after v2 became the current source of truth.',
};

const daikinHistoricalService: SummaryRecord = {
  id: 'daikin-service-historical',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '13.03',
  wbsName: 'HVAC & Mechanical Servicing',
  recordGroup: 'Daikin Ducted AC',
  title: 'Daikin AC Service Invoice 2020',
  documentType: 'Service Record',
  uploadedDate: '12 Feb 2020',
  path: '17 Martin St / Main Dwelling / 13. Maintenance, Servicing & Routine Care / 13.03 HVAC & Mechanical Servicing / Daikin Ducted AC / Daikin AC Service Invoice 2020.pdf',
  supplier: 'AirPro Mechanical Services',
  amount: 'AUD 310.00',
  fileName: 'Daikin AC Service Invoice 2020.pdf',
  fileType: 'PDF invoice',
  asset: 'Daikin Ducted AC',
  confidence: '0.88',
  status: 'Historical',
  fileStatus: 'Historical',
  version: 'v1',
  latest: false,
  tags: ['HVAC', 'Historical', 'Service Record'],
  aiSummary: 'Historical backfill record that helps complete service history but is not the current source of truth.',
};

const daikinDuplicateService: SummaryRecord = {
  id: 'dakin-aircon-duplicate',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '13.03',
  wbsName: 'HVAC & Mechanical Servicing',
  recordGroup: 'Daikin Ducted AC',
  title: 'Dakin Aircon service record 01',
  documentType: 'Invoice',
  uploadedDate: '28 Jun 2026',
  path: '17 Martin St / Main Dwelling / 13. Maintenance, Servicing & Routine Care / 13.03 HVAC & Mechanical Servicing / Daikin Ducted AC / Dakin Aircon service record 01.pdf',
  supplier: 'AirPro Mechanical Services',
  amount: 'AUD 420.00',
  fileName: 'Dakin Aircon service record 01.pdf',
  fileType: 'PDF scan',
  asset: 'Daikin Ducted AC',
  confidence: '0.84',
  status: 'Duplicate / Alternative Version',
  fileStatus: 'Duplicate / Alternative Version',
  version: 'v1',
  latest: false,
  tags: ['HVAC', 'Possible Duplicate', 'Alternative Version'],
  aiSummary: 'Possible duplicate scan of the current Daikin service invoice. Kept but not double-counted.',
};

const conditionalRoofingWarranty: SummaryRecord = {
  id: 'conditional-roofing-warranty',
  homeId: '17-martin-st',
  propertyScope: 'Main Dwelling',
  wbsCode: '07.02',
  wbsName: 'Roofing & Roof Plumbing',
  recordGroup: 'Metal Roof Cladding',
  title: 'Conditional Roofing Warranty',
  documentType: 'Warranty',
  uploadedDate: '19 Jun 2026',
  path: '17 Martin St / Main Dwelling / 07 Building Envelope, Roofing, Windows, External Doors & Cladding / 07.02 Roofing & Roof Plumbing / Metal Roof Cladding / Conditional Roofing Warranty.pdf',
  supplier: 'Apex Roofing Repairs',
  amount: 'N/A',
  fileName: 'conditional-roofing-warranty.pdf',
  fileType: 'PDF warranty',
  asset: 'Metal Roof Cladding',
  warranty: '10 years conditional on annual inspection',
  reminder: 'Annual roof inspection',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v1',
  latest: true,
  tags: ['Warranty', 'Roofing', 'Conditional Warranty', 'Insurance Evidence', 'Maintenance Required'],
  aiSummary: 'Main dwelling roofing warranty with maintenance conditions that affect claim readiness.',
};

const grannyFlatOccupationCertificate: SummaryRecord = {
  id: 'granny-flat-occupation-certificate',
  homeId: '17-martin-st',
  propertyScope: 'Granny Flat',
  wbsCode: '02.06',
  wbsName: 'Occupation Certificate',
  recordGroup: 'Granny Flat Approvals',
  title: 'Granny Flat Occupation Certificate',
  documentType: 'Certificate',
  uploadedDate: '16 Jun 2026',
  path: '17 Martin St / Granny Flat / 02 Design, Planning, Approvals & Professional Reports / 02.06 Occupation Certificate / Granny Flat Occupation Certificate.pdf',
  supplier: 'Cumberland Certifiers',
  amount: 'N/A',
  fileName: 'granny-flat-occupation-certificate.pdf',
  fileType: 'PDF certificate',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v1',
  latest: true,
  tags: ['Certificate', 'Granny Flat', 'Compliance Evidence', 'Current'],
  aiSummary: 'Occupation certificate confirming the granny flat is a separate compliant structure on the property.',
};

const grannyFlatHotWaterWarranty: SummaryRecord = {
  id: 'granny-flat-hot-water-warranty',
  homeId: '17-martin-st',
  propertyScope: 'Granny Flat',
  wbsCode: '08.09',
  wbsName: 'Hot Water Systems',
  recordGroup: 'Rinnai Hot Water System',
  title: 'Granny Flat Hot Water Warranty',
  documentType: 'Warranty',
  uploadedDate: '15 Jun 2026',
  path: '17 Martin St / Granny Flat / 08 Services Systems / 08.09 Hot Water Systems / Rinnai Hot Water System / Granny Flat Hot Water Warranty.pdf',
  supplier: 'Rinnai Australia',
  amount: 'N/A',
  fileName: 'granny-flat-rinnai-hot-water-warranty.pdf',
  fileType: 'PDF warranty',
  asset: 'Rinnai Hot Water System',
  warranty: '6 years heat exchanger, 3 years labour',
  reminder: 'Annual service',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v1',
  latest: true,
  tags: ['Warranty', 'Plumbing', 'Rinnai Hot Water System', 'Insurance Evidence', 'Current'],
  aiSummary: 'Granny flat hot water warranty for the Rinnai system, separate from the main dwelling Rheem warranty.',
};

const grannyFlatKitchenCabinetryInvoice: SummaryRecord = {
  id: 'granny-flat-kitchen-cabinetry-invoice',
  homeId: '17-martin-st',
  propertyScope: 'Granny Flat',
  wbsCode: '10.03',
  wbsName: 'Kitchen Cabinetry',
  recordGroup: 'Granny Flat Kitchen Cabinetry',
  title: 'Granny Flat Kitchen Cabinetry Invoice',
  documentType: 'Invoice',
  uploadedDate: '14 Jun 2026',
  path: '17 Martin St / Granny Flat / 10 Fixtures, Fittings, Joinery & Built-in Appliances / Kitchen Cabinetry / Granny Flat Kitchen Cabinetry Invoice.pdf',
  supplier: 'Northside Joinery Studio',
  amount: 'AUD 9,850.00',
  fileName: 'granny-flat-kitchen-cabinetry-invoice.pdf',
  fileType: 'PDF invoice',
  asset: 'Kitchen Cabinetry',
  status: 'Current',
  fileStatus: 'Current',
  version: 'v1',
  latest: true,
  tags: ['Invoice', 'Joinery', 'Kitchen Cabinetry', 'Insurance Evidence', 'Covered by 2026 Building Insurance Policy'],
  aiSummary: 'Granny flat cabinetry invoice captured as fixture evidence and linked to the whole-property policy.',
};

const emptyRecords: SummaryRecord[] = [];

export const documentFolders: LogbookFolder[] = [
  {
    id: 'quotes',
    label: 'Quotes',
    count: 1,
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
    previewChips: ['HVAC', 'Status', 'Granny Flat'],
    records: [
      recentRecords[1],
      daikinCurrentService,
      daikinSupersededService,
      daikinHistoricalService,
      daikinDuplicateService,
      recentRecords[3],
      grannyFlatKitchenCabinetryInvoice,
    ],
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
    count: 4,
    latestUpdate: '22 Jun 2026',
    previewChips: ['Daikin', 'Hot Water', 'Appliances'],
    records: [hotWaterWarranty, recentRecords[1], conditionalRoofingWarranty, grannyFlatHotWaterWarranty],
  },
  {
    id: 'certificates',
    label: 'Certificates',
    count: 2,
    latestUpdate: '18 Jun 2026',
    previewChips: ['Waterproofing', 'Occupancy', 'Granny Flat'],
    records: [recentRecords[0], grannyFlatOccupationCertificate],
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
  latestUpdate = '22 Jun 2026',
  description?: string
): LogbookFolder => ({
  id,
  label,
  count: recordIds.length,
  latestUpdate,
  previewChips,
  description,
  records: recordIds.map((recordId) => byId[recordId]).filter(Boolean),
});

export const logbookViewFolders: Record<LogbookViewName, LogbookFolder[]> = {
  WBS: [
    group('wbs-02', '02 Design, Planning, Approvals & Professional Reports', ['granny-flat-occupation-certificate'], ['Certificate', 'Compliance']),
    group('wbs-07', '07 Building Envelope, Roofing, Windows, External Doors & Cladding', ['conditional-roofing-warranty'], ['Roofing', 'Warranty']),
    group('wbs-08', '08 Services Systems', ['hot-water-warranty', 'granny-flat-hot-water-warranty'], ['Hot Water', 'Scope aware']),
    group('wbs-09', '09 Internal Linings, Waterproofing, Finishes & Flooring', ['waterproofing-certificate'], ['Bathroom', 'Wet area']),
    group('wbs-10', '10 Fixtures, Fittings, Joinery & Built-in Appliances', ['kitchen-cabinetry-quote', 'granny-flat-kitchen-cabinetry-invoice'], ['Joinery', 'Fixture']),
    group('wbs-13', '13 Maintenance, Servicing & Routine Care', ['daikin-invoice', 'roof-leak-invoice'], ['HVAC', 'Roofing']),
    group('wbs-16', '16 Building Insurance, Claims & Evidence Packs', ['insurance-policy'], ['Policy', 'Whole property']),
  ],
  Scope: [
    group(
      'scope-whole-property',
      'Whole Property / Shared Asset',
      ['insurance-policy'],
      ['Site-wide', 'Shared assets', 'Insurance'],
      '11 Jun 2026',
      'Site-wide records, shared assets, title, insurance and cross-building evidence.'
    ),
    group(
      'scope-main-dwelling',
      'Main Dwelling',
      ['conditional-roofing-warranty', 'waterproofing-certificate', 'daikin-invoice', 'hot-water-warranty', 'kitchen-cabinetry-quote', 'roof-leak-invoice'],
      ['Main house', 'Lifecycle', 'Fixtures'],
      '22 Jun 2026',
      'Records for the main house and its building lifecycle.'
    ),
    group(
      'scope-granny-flat',
      'Granny Flat',
      ['granny-flat-occupation-certificate', 'granny-flat-hot-water-warranty', 'granny-flat-kitchen-cabinetry-invoice'],
      ['Secondary dwelling', 'Rinnai', 'Cabinetry'],
      '16 Jun 2026',
      'Records for the secondary dwelling on the same property.'
    ),
  ],
  Status: [
    group(
      'status-current',
      'Current',
      ['insurance-policy', 'waterproofing-certificate', 'daikin-service-current', 'hot-water-warranty', 'granny-flat-hot-water-warranty'],
      ['Trusted', 'Counts fully', 'AI source'],
      '28 Jun 2026',
      'Latest confirmed records used by AI and Home Protection.'
    ),
    group(
      'status-pending-review',
      'Pending Review',
      ['daikin-invoice'],
      ['Needs confirmation', 'Low count weight'],
      '22 Jun 2026',
      'Files that need your confirmation before they become part of the current Home Logbook.'
    ),
    group(
      'status-historical',
      'Historical',
      ['daikin-service-historical'],
      ['Reference only', 'Past record'],
      '12 Feb 2020',
      'Useful past records that no longer represent the latest state.'
    ),
    group(
      'status-superseded',
      'Superseded',
      ['daikin-service-superseded'],
      ['Replaced', 'Audit trail'],
      '02 Mar 2025',
      'Files replaced by newer versions or updated records.'
    ),
    group(
      'status-duplicate',
      'Duplicate / Alternative Version',
      ['dakin-aircon-duplicate'],
      ['Possible duplicate', 'Not double counted'],
      '28 Jun 2026',
      'Possible duplicate or alternative versions that are kept but not double-counted.'
    ),
  ],
  'Document Type': documentFolders,
  'Trade / System': [
    group('trade-plumbing', 'Plumbing', ['hot-water-warranty'], ['Hot water', 'Warranty']),
    group('trade-electrical', 'Electrical', ['waterproofing-certificate'], ['Certificate', 'Ready']),
    group('trade-hvac', 'HVAC', ['daikin-invoice'], ['Daikin', 'Install']),
    group('trade-roofing', 'Roofing', ['roof-leak-invoice'], ['Roof', 'Repair']),
    group('trade-waterproofing', 'Waterproofing', ['waterproofing-certificate'], ['Bathroom', 'Certificate']),
    group('trade-joinery', 'Joinery', ['kitchen-cabinetry-quote', 'granny-flat-kitchen-cabinetry-invoice'], ['Kitchen', 'Quote']),
    group('trade-carpentry', 'Carpentry', ['kitchen-cabinetry-quote'], ['Built-in', 'Fixture']),
    group('trade-windows-doors', 'Windows & Doors', [], ['External', 'Future']),
  ],
  'Fixture / Asset': [
    group('fixture-daikin', 'Daikin Ducted AC', ['daikin-service-current', 'daikin-invoice', 'daikin-service-historical', 'dakin-aircon-duplicate'], ['HVAC', 'Status aware']),
    group('fixture-rheem', 'Rheem Hot Water System', ['hot-water-warranty'], ['Plumbing', 'Service']),
    group('fixture-rinnai', 'Rinnai Hot Water System', ['granny-flat-hot-water-warranty'], ['Granny Flat', 'Warranty']),
    group('fixture-kitchen', 'Kitchen Cabinetry', ['kitchen-cabinetry-quote'], ['Joinery', 'Quote']),
    group('fixture-mixer', 'Kitchen Mixer', [], ['Plumbing', 'Fixture']),
    group('fixture-shower', 'Shower Screen', ['waterproofing-certificate'], ['Bathroom', 'Evidence']),
    group('fixture-garage', 'Garage Door', [], ['External', 'Future']),
    group('fixture-roof-cladding', 'Roof Cladding', ['roof-leak-invoice'], ['Roofing', 'Repair']),
  ],
  'Room / Location': [
    group('room-kitchen', 'Kitchen', ['kitchen-cabinetry-quote'], ['Joinery', 'Fixture']),
    group('room-bathroom', 'Bathroom', ['waterproofing-certificate'], ['Certificate', 'Wet area']),
    group('room-granny-flat-kitchen', 'Granny Flat Kitchen', ['granny-flat-kitchen-cabinetry-invoice'], ['Secondary dwelling', 'Joinery']),
    group('room-laundry', 'Laundry', ['hot-water-warranty'], ['Plumbing', 'Service']),
    group('room-garage', 'Garage', [], ['Door', 'External']),
    group('room-roof', 'Roof', ['roof-leak-invoice'], ['Repair', 'Evidence']),
    group('room-whole-home', 'Whole Home', ['insurance-policy', 'daikin-invoice'], ['Policy', 'HVAC']),
    group('room-external', 'External Area', ['roof-leak-invoice'], ['Roof', 'Weather']),
  ],
  Evidence: [
    group('evidence-insurance', 'Building Insurance Policy', ['insurance-policy'], ['Insurance', 'Major event']),
    group('evidence-fixtures', 'High-value Fixtures', ['daikin-service-current', 'daikin-invoice', 'hot-water-warranty'], ['HVAC', 'Hot water']),
    group('evidence-warranty', 'Warranty Evidence', ['hot-water-warranty', 'daikin-invoice'], ['Warranty', 'Service']),
    group('evidence-install', 'Installation Evidence', ['daikin-invoice', 'kitchen-cabinetry-quote'], ['Install', 'Invoice']),
    group('evidence-repair', 'Repair History', ['roof-leak-invoice'], ['Roof', 'Repair']),
    group('evidence-certificates', 'Certificates', ['waterproofing-certificate'], ['Certificate', 'Compliance']),
    group('evidence-service', 'Service Records', ['daikin-service-current', 'daikin-service-historical', 'hot-water-warranty'], ['Service', 'Maintenance']),
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
