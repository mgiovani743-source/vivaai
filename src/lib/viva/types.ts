// ─────────────────────────────────────────────────────────────────────────────
// Opções do formulário de onboarding
// ─────────────────────────────────────────────────────────────────────────────

export type MomentOption =
  | "Show ou festival"
  | "Casamento"
  | "Formatura"
  | "Viagem"
  | "Encontro"
  | "Aniversário"
  | "Festa"
  | "Nova fase pessoal"
  | "Outro";

export type FeelingOption =
  | "confiante"
  | "elegante"
  | "leve"
  | "marcante"
  | "confortável"
  | "sofisticada"
  | "natural"
  | "poderosa";

export type StyleOption =
  | "básica"
  | "elegante"
  | "casual"
  | "romântica"
  | "moderna"
  | "criativa"
  | "sofisticada"
  | "confortável";

export type BudgetOption =
  | "não quero comprar nada"
  | "até R$100"
  | "R$100 a R$250"
  | "R$250 a R$500"
  | "acima de R$500"
  | "ainda não sei";

// ─────────────────────────────────────────────────────────────────────────────
// Input que a usuária preenche na /experiencia (onboarding)
// ─────────────────────────────────────────────────────────────────────────────

export type VivaExperienceInput = {
  name: string;
  email: string;
  whatsapp?: string;
  /** Momentos selecionados — múltipla seleção, máximo 3 */
  moments: MomentOption[];
  date?: string;
  location?: string;
  /** Sensações desejadas — múltipla seleção */
  feelings: FeelingOption[];
  /** Estilos preferidos — múltipla seleção */
  styles: StyleOption[];
  avoid?: string;
  ownedItems?: string;
  budget: BudgetOption | "";
};

// ─────────────────────────────────────────────────────────────────────────────
// Plano gerado pela Viva após o onboarding
// ─────────────────────────────────────────────────────────────────────────────

export type VivaPlan = {
  momentSummary: string;
  styleDirection: string;
  outfitIdea: string;
  beauty: string;
  checklist: string[];
  timeline: string[];
  shopOrReuse: string;
  avoid: string;
  versionPhrase: string;
  weekPriority: string;
  ifLittleTime: string;
  detailThatChanges: string;
  vivaReminder: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// VivaOnboardingResult — objeto completo gerado ao final do onboarding.
//
// Estrutura pensada para ser salva futuramente no Supabase como um único
// registro na tabela `viva_plans`. Cada bloco mapeia para um card ou seção
// do /dashboard:
//
//   profile        → DashboardHeader (nome, saudação)
//   event          → Card "Próximo Evento"
//   preferences    → Card "Achadinhos" (filtro de estilo/orçamento)
//   plan           → plano narrativo completo
//   checklist      → Card "Checklist do Dia"
//   timeline       → cronograma no Card "Próximo Evento"
//   recommendations→ Card "Achadinhos" (shopOrReuse)
//   avoid          → uso interno / dica no Dashboard
//   vivaNote       → Card "Inspiração do Dia" / frase personalizada
//   generatedAt    → timestamp ISO — campo created_at no Supabase
// ─────────────────────────────────────────────────────────────────────────────

export type VivaOnboardingResult = {
  /** Dados de identificação da usuária */
  profile: {
    name: string;
    email: string;
    whatsapp?: string;
  };

  /** Momentos / eventos que motivaram o onboarding (máximo 3) */
  event: {
    /** Primeiro momento = foco principal do plano */
    moments: MomentOption[];
    date?: string;       // formato YYYY-MM-DD vindo do input
    location?: string;
  };

  /** Preferências de estilo coletadas no onboarding */
  preferences: {
    feelings: FeelingOption[];
    /** Estilos preferidos — múltipla seleção */
    styles: StyleOption[];
    budget: BudgetOption | "";
    avoid?: string;
    ownedItems?: string;
  };

  /** Plano narrativo completo gerado pela Viva */
  plan: VivaPlan;

  /** Checklist prático — alimenta o card "Checklist do Dia" */
  checklist: string[];

  /** Cronograma até o evento — alimenta o card "Próximo Evento" */
  timeline: string[];

  /** Recomendação de compra/reaproveitamento */
  recommendations: {
    shopOrReuse: string;
  };

  /** O que a usuária quer evitar */
  avoid: string;

  /**
   * Frase personalizada da Viva para a usuária.
   * Alimenta o card "Inspiração do Dia" no dashboard.
   */
  vivaNote: string;

  /**
   * Timestamp ISO da geração do plano.
   * Será o campo `created_at` quando persistido no Supabase.
   */
  generatedAt: string;
};
