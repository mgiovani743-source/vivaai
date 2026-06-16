// =============================================
// VIVA AI — Tipos TypeScript
// =============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  city: string;
  objectives: string[];
  fashionPreferences: string[];
  averageBudget: number;
  interests: string[];
  evolutionScore: number;
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  store: string;
  tag: string;
  image: string;
  link: string; // TODO: Substituir por link real de afiliado
  isFavorite: boolean;
  createdAt: string;
  isActive: boolean;
}

export type ProductCategory =
  | 'Moda'
  | 'Beleza'
  | 'Acessórios'
  | 'Fitness'
  | 'Eventos'
  | 'Autocuidado'
  | 'Achadinhos da semana';

export interface VivaEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  style: string;
  budget: number;
  emotionalGoal: string;
  plan?: EventPlan;
}

export type EventType =
  | 'Show'
  | 'Festival'
  | 'Balada'
  | 'Formatura'
  | 'Jantar'
  | 'Casamento'
  | 'Encontro'
  | 'Viagem'
  | 'Outro';

export interface EventPlan {
  lookSuggestion: string;
  checklist: string[];
  routine: RoutineItem[];
  recommendedItems: RecommendedItem[];
  motivationalMessage: string;
}

export interface RoutineItem {
  day: string;
  task: string;
  done: boolean;
}

export interface RecommendedItem {
  name: string;
  price: number;
  link: string;
}

export interface DiscoverEvent {
  id: string;
  title: string;
  type: 'Shows' | 'Festas' | 'Festivais' | 'Experiências' | 'Gratuitos';
  date: string;
  location: string;
  image: string;
  price: string;
  distance?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  streak: number;
  xp: number;
  category: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  participants: number;
  progress: number;
  isJoined: boolean;
  category: string;
  ranking?: RankingEntry[];
}

export interface RankingEntry {
  name: string;
  avatar: string;
  xp: number;
  position: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  type: 'depoimento' | 'look' | 'achadinho' | 'evento' | 'geral';
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
}

export interface Look {
  id: string;
  title: string;
  category: LookCategory;
  image: string;
  items: string[];
  likes: number;
}

export type LookCategory =
  | 'Show'
  | 'Festival'
  | 'Balada'
  | 'Formatura'
  | 'Jantar'
  | 'Casual'
  | 'Academia';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  mood: MoodType;
  content: string;
  aiAnalysis?: string;
}

export type MoodType = 'radiante' | 'feliz' | 'neutra' | 'triste' | 'ansiosa' | 'irritada' | 'cansada';

export interface AdminMetrics {
  activeUsers: number;
  affiliateClicks: number;
  favoriteProducts: number;
  eventsCreated: number;
  estimatedRevenue: number;
  growthPercent: number;
}

export interface DailyChecklist {
  id: string;
  task: string;
  done: boolean;
}

export interface InspirationQuote {
  text: string;
  author: string;
}
