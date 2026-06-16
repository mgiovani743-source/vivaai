// =============================================
// VIVA AI — Dados Mockados
// =============================================
// TODO: Substituir por queries ao Supabase
// TODO: Integrar APIs de afiliados reais
// TODO: Conectar com serviço de IA real (OpenAI/Gemini)

import type {
  User,
  Product,
  VivaEvent,
  Habit,
  Challenge,
  CommunityPost,
  Look,
  ChatMessage,
  DiaryEntry,
  AdminMetrics,
  DailyChecklist,
  InspirationQuote,
  DiscoverEvent,
} from '@/types';

// ── Usuária ──────────────────────────────────
export const mockUser: User = {
  id: '1',
  name: 'Fernanda',
  email: 'fernanda@email.com',
  avatar: '',
  city: 'São Paulo',
  objectives: ['Autoconfiança', 'Estilo pessoal', 'Bem-estar'],
  fashionPreferences: ['Casual chique', 'Minimalista', 'Elegante'],
  averageBudget: 300,
  interests: ['Moda', 'Shows', 'Yoga', 'Skincare'],
  evolutionScore: 78,
  xp: 1250,
  level: 13,
  streak: 7,
  joinedAt: '2025-01-15',
};

// ── Produtos / Promoções ─────────────────────
// TODO: Substituir por dados de APIs de afiliados (ex: Lomadee, Awin, Amazon Associates)
// TODO: Implementar scraping via worker separado para buscar promoções reais
// TODO: Adicionar tracking de cliques para comissão de afiliados
// TODO: Sistema de aprovação manual de promoções antes de exibir
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vestido Midi Floral',
    category: 'Moda',
    originalPrice: 289.90,
    currentPrice: 149.90,
    discount: 48,
    store: 'Renner',
    tag: '🔥 Mais vendido',
    image: '👗',
    link: '#', // TODO: Link real de afiliado
    isFavorite: false,
    createdAt: '2025-06-01',
    isActive: true,
  },
  {
    id: 'p2',
    name: 'Paleta de Sombras Nude',
    category: 'Beleza',
    originalPrice: 159.90,
    currentPrice: 79.90,
    discount: 50,
    store: 'Sephora',
    tag: '✨ Favorito da comunidade',
    image: '💄',
    link: '#',
    isFavorite: true,
    createdAt: '2025-06-01',
    isActive: true,
  },
  {
    id: 'p3',
    name: 'Tênis Branco Classic',
    category: 'Moda',
    originalPrice: 399.90,
    currentPrice: 219.90,
    discount: 45,
    store: 'Nike',
    tag: '👟 Essencial',
    image: '👟',
    link: '#',
    isFavorite: false,
    createdAt: '2025-05-30',
    isActive: true,
  },
  {
    id: 'p4',
    name: 'Brinco Argola Dourada',
    category: 'Acessórios',
    originalPrice: 89.90,
    currentPrice: 39.90,
    discount: 56,
    store: 'Vivara',
    tag: '💎 Achadinho',
    image: '✨',
    link: '#',
    isFavorite: false,
    createdAt: '2025-05-28',
    isActive: true,
  },
  {
    id: 'p5',
    name: 'Legging Compressão Premium',
    category: 'Fitness',
    originalPrice: 199.90,
    currentPrice: 119.90,
    discount: 40,
    store: 'Track&Field',
    tag: '🏋️ Para treino',
    image: '🏃‍♀️',
    link: '#',
    isFavorite: true,
    createdAt: '2025-05-29',
    isActive: true,
  },
  {
    id: 'p6',
    name: 'Kit Skincare Noturno',
    category: 'Autocuidado',
    originalPrice: 249.90,
    currentPrice: 159.90,
    discount: 36,
    store: "L'Oréal",
    tag: '🌙 Rotina da noite',
    image: '🧴',
    link: '#',
    isFavorite: false,
    createdAt: '2025-06-01',
    isActive: true,
  },
  {
    id: 'p7',
    name: 'Bolsa Clutch Festa',
    category: 'Eventos',
    originalPrice: 179.90,
    currentPrice: 89.90,
    discount: 50,
    store: 'Arezzo',
    tag: '🎉 Para eventos',
    image: '👜',
    link: '#',
    isFavorite: false,
    createdAt: '2025-05-27',
    isActive: true,
  },
  {
    id: 'p8',
    name: 'Óculos de Sol Cat Eye',
    category: 'Acessórios',
    originalPrice: 329.90,
    currentPrice: 169.90,
    discount: 49,
    store: 'Chilli Beans',
    tag: '☀️ Verão',
    image: '🕶️',
    link: '#',
    isFavorite: false,
    createdAt: '2025-06-02',
    isActive: true,
  },
  {
    id: 'p9',
    name: 'Perfume Floral Fresco',
    category: 'Beleza',
    originalPrice: 459.90,
    currentPrice: 289.90,
    discount: 37,
    store: 'O Boticário',
    tag: '🌸 Achadinho da semana',
    image: '🌺',
    link: '#',
    isFavorite: true,
    createdAt: '2025-06-02',
    isActive: true,
  },
  {
    id: 'p10',
    name: 'Cropped Tricot',
    category: 'Achadinhos da semana',
    originalPrice: 129.90,
    currentPrice: 49.90,
    discount: 62,
    store: 'Shein',
    tag: '🔥 Menor preço',
    image: '👚',
    link: '#',
    isFavorite: false,
    createdAt: '2025-06-02',
    isActive: true,
  },
];

// ── Eventos da Usuária ───────────────────────
export const mockEvents: VivaEvent[] = [
  {
    id: 'e1',
    title: 'Show da Anitta',
    type: 'Show',
    date: '2025-07-15',
    location: 'Allianz Parque, SP',
    style: 'Ousado e moderno',
    budget: 500,
    emotionalGoal: 'Me sentir poderosa e confiante',
    plan: {
      lookSuggestion: 'Top cropped preto com calça cargo, bota plataforma e acessórios dourados. Maquiagem com glitter nos olhos e batom nude.',
      checklist: [
        'Separar look 2 dias antes',
        'Fazer as unhas',
        'Hidratar a pele a semana toda',
        'Carregar power bank',
        'Levar documento e ingresso digital',
      ],
      routine: [
        { day: '3 dias antes', task: 'Máscara facial hidratante', done: true },
        { day: '2 dias antes', task: 'Separar look e experimentar', done: true },
        { day: '1 dia antes', task: 'Preparar bolsa com essenciais', done: false },
        { day: 'No dia', task: 'Skincare + maquiagem + hair', done: false },
      ],
      recommendedItems: [
        { name: 'Glitter biodegradável', price: 29.90, link: '#' },
        { name: 'Spray fixador', price: 45.90, link: '#' },
        { name: 'Bolsa transparente', price: 39.90, link: '#' },
      ],
      motivationalMessage: 'Você vai arrasar! Lembre-se: confiança é o melhor acessório. 💜✨',
    },
  },
  {
    id: 'e2',
    title: 'Formatura da Amiga',
    type: 'Formatura',
    date: '2025-08-20',
    location: 'Buffet Villa Nobre, SP',
    style: 'Elegante e sofisticado',
    budget: 800,
    emotionalGoal: 'Estar presente e celebrar',
  },
];

// ── Eventos para Descobrir ───────────────────
export const mockDiscoverEvents: DiscoverEvent[] = [
  { id: 'de1', title: 'Festival Lollapalooza', type: 'Festivais', date: '2025-09-15', location: 'Autódromo de Interlagos', image: '🎵', price: 'R$ 450', distance: '12km' },
  { id: 'de2', title: 'Show Ludmilla', type: 'Shows', date: '2025-07-20', location: 'Espaço das Américas', image: '🎤', price: 'R$ 180', distance: '5km' },
  { id: 'de3', title: 'Festa Neon Party', type: 'Festas', date: '2025-07-10', location: 'Club A, Vila Madalena', image: '🎉', price: 'R$ 80', distance: '3km' },
  { id: 'de4', title: 'Workshop de Cerâmica', type: 'Experiências', date: '2025-07-05', location: 'Ateliê Vila Mariana', image: '🎨', price: 'R$ 120', distance: '2km' },
  { id: 'de5', title: 'Yoga no Parque', type: 'Gratuitos', date: '2025-07-08', location: 'Parque Ibirapuera', image: '🧘', price: 'Grátis', distance: '4km' },
  { id: 'de6', title: 'Show Marisa Monte', type: 'Shows', date: '2025-08-10', location: 'Teatro Bradesco', image: '🎶', price: 'R$ 250', distance: '8km' },
  { id: 'de7', title: 'Festival Gastronômico', type: 'Experiências', date: '2025-07-25', location: 'Parque Villa-Lobos', image: '🍕', price: 'R$ 30 entrada', distance: '6km' },
  { id: 'de8', title: 'Roda de Samba', type: 'Gratuitos', date: '2025-07-12', location: 'Casa de Francisca', image: '🥁', price: 'Grátis', distance: '1km' },
];

// ── Hábitos ──────────────────────────────────
export const mockHabits: Habit[] = [
  { id: 'h1', name: 'Meditar 10 min', icon: '🧘', completed: true, streak: 7, xp: 15, category: 'Mente' },
  { id: 'h2', name: 'Skincare manhã', icon: '✨', completed: true, streak: 12, xp: 10, category: 'Beleza' },
  { id: 'h3', name: 'Beber 2L água', icon: '💧', completed: false, streak: 5, xp: 10, category: 'Saúde' },
  { id: 'h4', name: 'Exercício 30 min', icon: '🏃‍♀️', completed: false, streak: 3, xp: 20, category: 'Saúde' },
  { id: 'h5', name: 'Ler 15 páginas', icon: '📖', completed: true, streak: 9, xp: 15, category: 'Mente' },
  { id: 'h6', name: 'Skincare noite', icon: '🌙', completed: false, streak: 10, xp: 10, category: 'Beleza' },
  { id: 'h7', name: 'Gratidão (3 coisas)', icon: '💜', completed: false, streak: 4, xp: 10, category: 'Mente' },
  { id: 'h8', name: 'Sem celular 1h antes de dormir', icon: '📵', completed: false, streak: 2, xp: 20, category: 'Mente' },
];

// ── Desafios ─────────────────────────────────
export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: '7 Dias de Skincare Completa',
    description: 'Complete sua rotina de skincare manhã e noite por 7 dias seguidos.',
    duration: '7 dias',
    xp: 150,
    participants: 342,
    progress: 57,
    isJoined: true,
    category: 'Beleza',
    ranking: [
      { name: 'Ana Clara', avatar: '👩‍🦰', xp: 150, position: 1 },
      { name: 'Fernanda', avatar: '👩‍🦱', xp: 120, position: 2 },
      { name: 'Juliana', avatar: '👩', xp: 100, position: 3 },
      { name: 'Mariana', avatar: '👩‍🦳', xp: 90, position: 4 },
      { name: 'Beatriz', avatar: '👧', xp: 85, position: 5 },
    ],
  },
  {
    id: 'c2',
    title: 'Desafio do Armário Cápsula',
    description: 'Monte 7 looks diferentes usando apenas 15 peças do seu guarda-roupa.',
    duration: '14 dias',
    xp: 200,
    participants: 189,
    progress: 0,
    isJoined: false,
    category: 'Moda',
  },
  {
    id: 'c3',
    title: '21 Dias de Meditação',
    description: 'Medite pelo menos 10 minutos por dia durante 21 dias consecutivos.',
    duration: '21 dias',
    xp: 300,
    participants: 521,
    progress: 33,
    isJoined: true,
    category: 'Mente',
  },
  {
    id: 'c4',
    title: 'Semana Sem Fast Fashion',
    description: 'Passe 7 dias sem comprar de fast fashion. Explore brechós e marcas locais.',
    duration: '7 dias',
    xp: 100,
    participants: 156,
    progress: 0,
    isJoined: false,
    category: 'Estilo de vida',
  },
];

// ── Posts da Comunidade ───────────────────────
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'cp1',
    author: 'Ana Clara',
    avatar: '👩‍🦰',
    content: 'Gente, completei o desafio de skincare de 7 dias e minha pele está INCRÍVEL! Obrigada Viva por me motivar 💜',
    type: 'depoimento',
    likes: 45,
    comments: 12,
    createdAt: '2025-06-02T08:30:00',
  },
  {
    id: 'cp2',
    author: 'Juliana',
    avatar: '👩',
    content: 'Look que montei pro show da Anitta usando as dicas da IA! O que acharam?',
    type: 'look',
    likes: 89,
    comments: 23,
    createdAt: '2025-06-01T18:00:00',
    image: '👗✨',
  },
  {
    id: 'cp3',
    author: 'Mariana',
    avatar: '👩‍🦳',
    content: 'Achei esse vestido por R$ 49,90 na Renner! Parece de R$ 200. Link nos comentários 👇',
    type: 'achadinho',
    likes: 156,
    comments: 34,
    createdAt: '2025-06-01T14:00:00',
  },
  {
    id: 'cp4',
    author: 'Beatriz',
    avatar: '👧',
    content: 'Alguém vai no Lollapalooza? Quero montar um grupo da Viva pra ir juntas! 🎵',
    type: 'evento',
    likes: 67,
    comments: 18,
    createdAt: '2025-06-01T10:00:00',
  },
  {
    id: 'cp5',
    author: 'Camila',
    avatar: '👩‍🦱',
    content: 'Desde que comecei a usar o diário emocional da Viva, me conheço muito melhor. Recomendo demais!',
    type: 'depoimento',
    likes: 78,
    comments: 9,
    createdAt: '2025-05-31T20:00:00',
  },
];

// ── Looks ────────────────────────────────────
export const mockLooks: Look[] = [
  { id: 'l1', title: 'Show Urbano', category: 'Show', image: '🎤', items: ['Top cropped preto', 'Calça cargo', 'Bota plataforma', 'Argolas douradas'], likes: 234 },
  { id: 'l2', title: 'Festival Boho', category: 'Festival', image: '🌻', items: ['Kimono estampado', 'Short jeans', 'Bota country', 'Óculos redondo'], likes: 189 },
  { id: 'l3', title: 'Balada Glam', category: 'Balada', image: '💃', items: ['Vestido midi brilho', 'Sandália tira', 'Clutch metalizada', 'Brinco statement'], likes: 312 },
  { id: 'l4', title: 'Formatura Elegante', category: 'Formatura', image: '🎓', items: ['Vestido longo azul', 'Sandália dourada', 'Clutch perolada', 'Colar delicado'], likes: 278 },
  { id: 'l5', title: 'Jantar Romântico', category: 'Jantar', image: '🕯️', items: ['Blazer oversized', 'Calça alfaiataria', 'Scarpin nude', 'Bolsa estruturada'], likes: 156 },
  { id: 'l6', title: 'Casual Chique', category: 'Casual', image: '☕', items: ['Camisa branca', 'Calça wide leg', 'Tênis branco', 'Bolsa tote'], likes: 201 },
  { id: 'l7', title: 'Gym Aesthetic', category: 'Academia', image: '💪', items: ['Top esportivo', 'Legging compressão', 'Tênis performance', 'Pochete'], likes: 145 },
  { id: 'l8', title: 'Festival Neon', category: 'Festival', image: '🎆', items: ['Body neon', 'Saia de franjas', 'Coturno', 'Body glitter'], likes: 267 },
];

// ── Chat Messages (conversa inicial) ─────────
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'cm1',
    role: 'assistant',
    content: 'Oi, Fernanda! 💜 Sou sua IA pessoal da Viva. Estou aqui pra te ajudar a se preparar para cada momento especial da sua vida. Como posso te ajudar hoje?',
    timestamp: '2025-06-02T08:00:00',
  },
];

// ── Respostas mockadas da IA ─────────────────
// TODO: Substituir por chamadas reais à API de IA (OpenAI/Gemini)
export const mockAIResponses: Record<string, string> = {
  'look': 'Com base no seu estilo e preferências, sugiro um look com peças versáteis que você já tem no guarda-roupa! 👗✨ Que tipo de evento você está preparando? Me conta mais que personalizo certinho pra você.',
  'evento': 'Que demais que você tem um evento! 🎉 Vamos criar um plano completo: look, preparação, checklist e até sugestões de produtos com desconto. Me conta: qual é o evento, quando é e como você quer se sentir?',
  'promoção': 'Achei alguns achadinhos perfeitos pro seu estilo! 🛍️ Tem um vestido midi com 48% off na Renner e uma paleta de sombras com 50% off na Sephora. Quer que eu filtre por alguma categoria específica?',
  'humor': 'Obrigada por compartilhar como está se sentindo 💜 Lembre-se que todos os sentimentos são válidos. Que tal fazer algo especial por você hoje? Posso sugerir uma atividade de autocuidado.',
  'motivação': 'Você é incrível, Fernanda! 🌟 Já são 7 dias consecutivos cuidando de você. Seu score de evolução subiu 5 pontos essa semana. Continue assim — cada pequeno passo conta!',
  'default': 'Adorei sua mensagem! 💜 Estou aqui pra te ajudar no que precisar — looks, eventos, promoções, hábitos ou só pra conversar. O que você precisa agora?',
};

// ── Diário Emocional ─────────────────────────
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: 'd1',
    date: '2025-06-02',
    mood: 'feliz',
    content: 'Hoje acordei motivada! Fiz minha skincare completa e meditei. Me sinto preparada pro dia.',
    aiAnalysis: 'Que lindo, Fernanda! 💜 Seus registros mostram que nos dias que você medita de manhã, seu humor fica melhor o dia todo. Continue com essa rotina matinal!',
  },
  {
    id: 'd2',
    date: '2025-06-01',
    mood: 'ansiosa',
    content: 'Estou ansiosa com o show da próxima semana. Quero que tudo saia perfeito.',
    aiAnalysis: 'É natural sentir ansiedade antes de um evento especial! 🌸 Lembre-se: você já está se preparando e isso é o mais importante. Que tal fazer uma lista do que precisa e ir riscando? Ajuda a sentir controle.',
  },
  {
    id: 'd3',
    date: '2025-05-31',
    mood: 'radiante',
    content: 'Recebi um elogio incrível no trabalho e ainda encontrei um vestido lindo em promoção!',
    aiAnalysis: 'Dias assim merecem ser celebrados! 🌟 Você tem se dedicado muito e os resultados estão aparecendo. Guarde esse sentimento — nos dias difíceis, releia esse registro.',
  },
];

// ── Admin Metrics ────────────────────────────
export const mockAdminMetrics: AdminMetrics = {
  activeUsers: 2847,
  affiliateClicks: 12453,
  favoriteProducts: 8921,
  eventsCreated: 1234,
  estimatedRevenue: 4520.50,
  growthPercent: 23.5,
};

// ── Checklist Diária ─────────────────────────
export const mockDailyChecklist: DailyChecklist[] = [
  { id: 'dc1', task: 'Skincare da manhã', done: true },
  { id: 'dc2', task: 'Meditar 10 minutos', done: true },
  { id: 'dc3', task: 'Beber 2L de água', done: false },
  { id: 'dc4', task: 'Exercício 30 min', done: false },
  { id: 'dc5', task: 'Registrar no diário', done: false },
];

// ── Inspiração do Dia ────────────────────────
export const mockInspiration: InspirationQuote = {
  text: 'A mulher que se conhece profundamente é invencível.',
  author: 'Viva AI',
};

// ── Sugestões rápidas para o Chat ────────────
export const chatSuggestions = [
  '💃 Me ajuda a montar um look',
  '🎉 Tenho um evento chegando',
  '🛍️ Quero ver promoções',
  '💭 Quero desabafar',
  '✨ Me motiva!',
  '📝 O que devo fazer hoje?',
];
