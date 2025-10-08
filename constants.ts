import { LandingPageContent, User, UserRole } from './types';

export const initialLandingPageContent: LandingPageContent = {
  logoUrl: '', // Default logo can be text or empty
  mainTitle: 'Black Friday',
  highlightedTitle: 'Ferramentas de Precisão',
  description: 'As melhores ferramentas profissionais com preços que você nunca viu. Preencha o formulário e garanta condições especiais da Black Friday. Um de nossos representantes entrará em contato.',
  features: [
    { id: 'feat1', icon: 'check', text: 'Qualidade Profissional' },
    { id: 'feat2', icon: 'tag', text: 'Preços de Fábrica' },
  ],
  backgroundImageUrl: 'https://images.unsplash.com/photo-1590137782389-13e70a4a6c4c?q=80&w=1974&auto=format&fit=crop',
  colorPalette: {
    primary: '#4c0519', // Roughly red-900 for backgrounds
    accent: '#facc15',  // amber-400
    textPrimary: '#ffffff', // white
    textSecondary: '#d1d5db', // gray-300
  },
  showProductSection: true,
  productSectionTitle: 'Ofertas Imperdíveis da Black Friday',
  productSectionDescription: 'Confira uma seleção de nossas melhores ferramentas com descontos exclusivos. A hora de equipar sua oficina é agora!',
  products: [
    {
      id: 'prod1',
      name: 'Furadeira de Impacto Pro-X',
      image: 'https://picsum.photos/seed/drill/400/300',
    },
    {
      id: 'prod2',
      name: 'Serra Circular MasterCut',
      image: 'https://picsum.photos/seed/saw/400/300',
    },
    {
      id: 'prod3',
      name: 'Kit de Chaves TitanGrip',
      image: 'https://picsum.photos/seed/wrench/400/300',
    },
  ],
};

export const COUNTRIES = [
  { name: 'Brazil', code: 'BR', dialCode: '55', flag: '🇧🇷' },
  { name: 'United States', code: 'US', dialCode: '1', flag: '🇺🇸' },
  { name: 'Portugal', code: 'PT', dialCode: '351', flag: '🇵🇹' },
  { name: 'Argentina', code: 'AR', dialCode: '54', flag: '🇦🇷' },
  { name: 'Spain', code: 'ES', dialCode: '34', flag: '🇪🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '44', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', dialCode: '49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '33', flag: '🇫🇷' },
];

// Mock user data for authentication
export const mockUsers: User[] = [
  { id: 'user-1', email: 'admin@bomcorte.com', password: 'password123', role: UserRole.ADMIN },
  { id: 'user-2', email: 'editor@bomcorte.com', password: 'password123', role: UserRole.EDITOR },
  { id: 'user-3', email: 'viewer@bomcorte.com', password: 'password123', role: UserRole.VIEWER },
];