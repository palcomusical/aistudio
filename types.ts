export enum Region {
  SUL = 'Sul',
  SUDESTE = 'Sudeste',
  CENTRO_OESTE = 'Centro-Oeste',
  NORDESTE = 'Nordeste',
  NORTE = 'Norte',
}

export interface LeadFormData {
  name: string;
  whatsapp: string; // The number without dial code
  email: string;
  cep: string;
  state: string;
  city: string;
  dialCode: string; // e.g., "55" for Brazil
  lgpdConsent: boolean;
}


export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export enum LeadStatus {
  PENDENTE = 'Pendente',
  ATENDIDO = 'Atendido',
}

export interface DashboardData {
  totalContacts: number;
  trafficSource: { source: string; count: number }[];
  topRegions: { region: Region; count: number }[];
  leadStatus: { status: LeadStatus; count: number }[];
  representativeRanking: { name: string; attended: number }[];
  leadsByLocation: { state: string; city: string; count: number }[];
}

// --- NEW TYPES FOR ADMIN PANEL ---

export enum IntegrationType {
  GOOGLE_SHEETS = 'Google Sheets',
  N8N = 'n8n',
  META_ADS = 'Meta Ads',
}

export interface Integration {
  id: IntegrationType;
  name: string;
  isActive: boolean;
  credentials: Record<string, string>; // e.g., { apiKey: '', sheetId: '' }
}

export interface LeadField {
  id: string; // e.g., 'field_1678886400000'
  name: string; // e.g., 'produto_interesse'
  label: string; // e.g., 'Produto de Interesse'
  isRequired: boolean;
}

export enum LeadSourceType {
  ORGANICO = 'Orgânico',
  PAGO = 'Pago',
  LANDING_PAGE = 'Landing Page',
  WHATSAPP = 'WhatsApp',
}

export interface LeadSourceConfig {
  id: string;
  name: string;
  type: LeadSourceType;
  integrations: Integration[];
  requiredFields: LeadField[];
  webhookUrl: string;
}

// --- NEW TYPES FOR LANDING PAGE EDITOR ---

export interface Feature {
  id: string;
  icon: string; // e.g., 'check', 'tag'
  text: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
}

export interface ColorPalette {
  primary: string; // Background tints, dark colors
  accent: string;  // Main call-to-action, highlights (e.g., yellow/amber)
  textPrimary: string; // Main text (e.g., white)
  textSecondary: string; // Muted text (e.g., light gray)
}

export interface LandingPageContent {
  logoUrl: string;
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  features: Feature[];
  backgroundImageUrl: string;
  colorPalette: ColorPalette;
  showProductSection: boolean;
  productSectionTitle: string;
  productSectionHighlightedTitle: string;
  productSectionDescription: string;
  products: Product[];
}

// --- NEW TYPES FOR AUTHENTICATION ---
export enum UserRole {
  ADMIN = 'Administrador',
  EDITOR = 'Editor',
  VIEWER = 'Visualizador'
}

export interface User {
  id: string;
  email: string;
  password?: string; // Should be handled securely on a real backend
  role: UserRole;
}