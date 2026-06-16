import type { VivaExperienceInput, VivaPlan, VivaOnboardingResult } from "./types";

const momentDirections: Record<string, { outfit: string; beauty: string; cue: string }> = {
  "Show ou festival": {
    outfit:
      "Uma base confortável com ponto de impacto: jeans, saia ou peça utilitária, top bem ajustado e terceira peça leve. Finalize com acessório marcante e sapato já testado.",
    beauty:
      "Make com pele durável, brilho controlado e um ponto de luz. Cabelo preso estilizado ou ondas com fixação leve para atravessar o evento sem perder movimento.",
    cue: "energia, presença e liberdade para se movimentar",
  },
  Casamento: {
    outfit:
      "Um look polido com tecido fluido, caimento limpo e acessórios delicados. Priorize uma cor que ilumine seu rosto e uma sandália confortável para muitas horas.",
    beauty:
      "Pele luminosa, olhos suaves ou boca elegante, e cabelo com acabamento mais refinado. A ideia é ficar bonita ao vivo e nas fotos sem parecer excessiva.",
    cue: "sofisticação, leveza e memória afetiva",
  },
  Formatura: {
    outfit:
      "Uma produção com estrutura e celebração: vestido, conjunto ou alfaiataria com detalhe especial. Escolha uma peça protagonista e deixe o resto respirar.",
    beauty:
      "Make de longa duração com acabamento fotogênico. Cabelo alinhado, ondas marcadas ou preso moderno para sustentar a noite inteira.",
    cue: "conquista, brilho e segurança",
  },
  Viagem: {
    outfit:
      "Monte uma cápsula versátil com peças que combinam entre si: base neutra, uma cor de destaque, calçado confortável e acessórios que mudam o clima do look.",
    beauty:
      "Beleza prática: pele leve, proteção solar, cabelo fácil de retocar e nécessaire enxuta com seus produtos essenciais.",
    cue: "praticidade bonita, conforto e intenção",
  },
  Encontro: {
    outfit:
      "Escolha uma silhueta que você já sabe que funciona no seu corpo. Inclua textura, perfume e um detalhe pessoal em vez de tentar parecer outra pessoa.",
    beauty:
      "Make fresca, pele bem cuidada e cabelo com toque natural. O acabamento deve aproximar, não esconder.",
    cue: "presença, naturalidade e confiança tranquila",
  },
  Aniversário: {
    outfit:
      "Deixe uma peça carregar o clima de celebração: brilho sutil, cor especial, recorte elegante ou acessório com personalidade. O look precisa parecer seu.",
    beauty:
      "Beleza com um ponto festivo, como boca mais presente, iluminador ou cabelo com volume. Mantenha a base confortável para aproveitar o momento.",
    cue: "celebração, protagonismo e alegria",
  },
  Festa: {
    outfit:
      "Combine conforto e intenção: uma peça de impacto, uma base segura e acessórios que elevam. Teste o look sentado, andando e dançando.",
    beauty:
      "Make resistente com acabamento bonito em luz baixa. Cabelo com fixação suficiente e retoques simples na bolsa.",
    cue: "movimento, impacto e leveza",
  },
  "Nova fase pessoal": {
    outfit:
      "Crie um uniforme simbólico para essa virada: peças que traduzam quem você está se tornando, com caimento bom e um detalhe que marque essa nova energia.",
    beauty:
      "Beleza limpa e intencional, com foco em cuidado, sobrancelha, pele e cabelo alinhado. A proposta é parecer descansada, inteira e presente.",
    cue: "renovação, clareza e força silenciosa",
  },
  Outro: {
    outfit:
      "Comece por uma base que te deixe segura e adicione um elemento especial ligado ao contexto. O equilíbrio ideal é bonito, possível e fiel ao seu momento.",
    beauty:
      "Beleza coerente com a duração e o lugar: pele bem preparada, cabelo que aguente a ocasião e um detalhe que faça você se reconhecer.",
    cue: "intenção, segurança e autenticidade",
  },
};

const styleDirections: Record<string, string> = {
  básica: "linhas limpas, bons básicos, poucos elementos e acabamento impecável",
  elegante: "caimento refinado, paleta coesa e acessórios discretos com presença",
  casual: "peças fáceis, textura interessante e conforto sem perder intenção",
  romântica: "formas suaves, tecidos leves, detalhe delicado e beleza luminosa",
  moderna: "silhueta atual, contraste de proporções e acessórios mais gráficos",
  criativa: "mistura de cor, textura ou acessório autoral com uma base equilibrada",
  sofisticada: "materiais nobres, poucos contrastes e uma composição bem editada",
  confortável: "modelagem livre, toque macio e escolhas que sustentam sua energia",
};

const feelingCopy: Record<string, string> = {
  confiante: "segurança no caimento e decisões sem excesso",
  elegante: "polimento nos detalhes e uma presença tranquila",
  leve: "conforto visual, movimento e pouca complicação",
  marcante: "um elemento protagonista que seja lembrado",
  confortável: "peças testadas e uma beleza fácil de manter",
  sofisticada: "acabamento preciso e escolhas bem editadas",
  natural: "texturas reais, pele fresca e autenticidade",
  poderosa: "postura, contraste e um detalhe de força",
};

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function daysUntil(date?: string) {
  if (!date) {
    return null;
  }

  const eventDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(eventDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Math.ceil((eventDate.getTime() - today.getTime()) / 86_400_000);
}

function buildTimeline(date?: string) {
  const remainingDays = daysUntil(date);

  if (remainingDays === null) {
    return [
      "Hoje: defina o clima do look, separe referências e escolha uma peça principal.",
      "Próximo passo: prove combinações completas com sapato, bolsa e acessórios.",
      "Na véspera: deixe roupa, beleza e itens de bolsa prontos.",
      "No dia: reserve tempo para se arrumar sem pressa e faça um último teste de conforto.",
    ];
  }

  if (remainingDays <= 1) {
    return [
      "Hoje: escolha a combinação mais segura e evite estrear peça desconfortável.",
      "Antes de sair: revise bolsa, documento, carregador, retoques e previsão do tempo.",
      "Última hora: faça cabelo e make em versões simples de retocar.",
    ];
  }

  if (remainingDays <= 7) {
    return [
      "Hoje: feche o look principal e uma alternativa caso o clima mude.",
      "Até 3 dias antes: teste o look completo e ajuste barra, alça ou acessórios.",
      "Na véspera: separe roupa, beleza, itens de bolsa e rota.",
      "No dia: hidrate, coma bem e comece a se arrumar com margem.",
    ];
  }

  return [
    "Agora: escolha a direção visual e liste o que você já tem.",
    "Duas semanas antes: prove combinações e identifique lacunas reais.",
    "Uma semana antes: resolva compras, ajustes e beleza que dependem de agenda.",
    "Na véspera: deixe tudo separado, passado e testado.",
    "No dia: siga um ritual simples para entrar no momento com calma.",
  ];
}

export function generateVivaPlan(input: VivaExperienceInput): VivaPlan {
  // Momento principal (foco do plano) — usa o primeiro selecionado ou fallback
  const primaryMoment = input.moments[0] || "Outro";
  // Momentos secundários — complementam o contexto no resumo
  const secondaryMoments = input.moments.slice(1);

  const dateLabel = formatDate(input.date);
  const location = input.location?.trim();

  // Múltiplos estilos: pega os selecionados ou usa fallback
  const styles = input.styles.length > 0 ? input.styles : ["elegante"];
  const feelings = input.feelings.length > 0 ? input.feelings : ["confiante"];

  // Direção visual baseada no momento principal
  const direction = momentDirections[primaryMoment] ?? momentDirections.Outro;

  // Frase de sensações expandidas
  const feelingSentence = feelings
    .map((f) => feelingCopy[f] ?? f)
    .join(", ");

  // Frase de estilos: combina naturalmente
  // Ex: "básica e elegante" / "elegante, moderna e criativa"
  function joinList(arr: string[]): string {
    if (arr.length === 1) return arr[0];
    const last = arr[arr.length - 1];
    const rest = arr.slice(0, -1);
    return `${rest.join(", ")} e ${last}`;
  }

  // Descrição combinada dos estilos selecionados
  const styleDescriptions = styles.map((s) => styleDirections[s] ?? s);
  const styleDirectionText =
    styles.length === 1
      ? styleDirections[styles[0]] ?? styles[0]
      : styleDescriptions.slice(0, 2).join("; ") +
        (styleDescriptions.length > 2 ? "; e mais" : "");

  const ownedItems = input.ownedItems?.trim();
  const avoid = input.avoid?.trim();
  const budget = input.budget || "ainda não sei";

  // Resumo do momento: foco no principal + contexto dos secundários
  const momentCore = [
    `Você está se preparando para ${primaryMoment.toLowerCase()}`,
    dateLabel ? `em ${dateLabel}` : "",
    location ? `em ${location}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const momentContext =
    secondaryMoments.length > 0
      ? ` O plano também considera o clima de ${joinList(secondaryMoments.map((m) => m.toLowerCase()))}.`
      : "";

  const avoidText = avoid
    ? `Evite: ${avoid}. Além disso, não deixe para estrear algo que aperta, escorrega ou exige manutenção o tempo todo.`
    : "Evite excesso de informação no look, sapato sem teste e decisões de última hora que não combinam com o seu conforto.";

  return {
    momentSummary: `${momentCore}.${momentContext} A direção é criar uma preparação com ${direction.cue}, respeitando o que você quer sentir: ${feelings.join(", ")}.`,
    styleDirection: styles.length === 1
      ? `Seu estilo-base é ${styles[0]}. Traduza isso em ${styleDirections[styles[0]] ?? styles[0]}, com foco em ${feelingSentence}.`
      : `Seu plano combina uma base ${joinList(styles)} — ${styleDirectionText}. Tudo isso a favor de ${feelingSentence}.`,
    outfitIdea: direction.outfit,
    beauty: direction.beauty,
    checklist: [
      "Provar o look completo com sapato, bolsa e acessórios.",
      "Testar sentar, andar e se movimentar por alguns minutos.",
      "Separar itens de bolsa: documento, dinheiro/cartão, retoque, lenço e carregador.",
      "Checar clima, deslocamento e tempo real para se arrumar.",
      "Registrar uma foto do look aprovado para não repensar tudo no dia.",
    ],
    timeline: buildTimeline(input.date),
    shopOrReuse: ownedItems
      ? `Comece aproveitando: ${ownedItems}. Com orçamento "${budget}", compre só o que fechar uma lacuna clara: ajuste, acessório, beleza ou peça-chave.`
      : `Com orçamento "${budget}", priorize combinações com o que você já tem. Se comprar algo, escolha uma peça que também funcione depois desse momento.`,
    avoid: avoidText,
    versionPhrase: `${input.name.trim() || "Você"}, sua versão para esse momento é ${feelings.slice(0, 3).join(", ")} e presente. Você não precisa performar: precisa chegar inteira.`,
    weekPriority: `Priorize fechar o look principal e fazer ao menos um teste completo antes do dia.`,
    ifLittleTime: `Se o tempo apertar: escolha a peça mais segura que você já tem e adicione um acessório que marque a produção.`,
    detailThatChanges: `Um detalhe muda tudo: ${direction.cue}. Não subestime esse fator.`,
    vivaReminder: `${input.name.trim() || "Você"}, você não precisa ser outra pessoa. Precisa ser você — inteira, presente e pronta.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildOnboardingResult
//
// Monta o objeto VivaOnboardingResult completo a partir do input da usuária
// e do plano gerado. Esse objeto está pronto para ser persistido no Supabase
// na próxima etapa (tabela `viva_plans`).
//
// Por enquanto, é usado apenas para estruturar tipagem e documentar
// quais dados cada bloco do /dashboard vai consumir futuramente.
// ─────────────────────────────────────────────────────────────────────────────

export function buildOnboardingResult(
  input: VivaExperienceInput,
  plan: VivaPlan,
): VivaOnboardingResult {
  return {
    // ── Identidade da usuária ─────────────────────────────────────────────
    // Alimentará: DashboardHeader (saudação com nome)
    profile: {
      name: input.name.trim(),
      email: input.email.trim(),
      ...(input.whatsapp?.trim() ? { whatsapp: input.whatsapp.trim() } : {}),
    },

    // ── Eventos / momentos ──────────────────────────────────────────────
    // Alimentará: Card "Próximo Evento" no /dashboard
    event: {
      moments: input.moments,
      ...(input.date ? { date: input.date } : {}),
      ...(input.location?.trim() ? { location: input.location.trim() } : {}),
    },

    // ── Preferências de estilo ────────────────────────────────────────────
    // Alimentará: Card "Achadinhos" (filtro por estilo/orçamento)
    preferences: {
      feelings: input.feelings,
      styles: input.styles,
      budget: input.budget,
      ...(input.avoid?.trim() ? { avoid: input.avoid.trim() } : {}),
      ...(input.ownedItems?.trim() ? { ownedItems: input.ownedItems.trim() } : {}),
    },

    // ── Plano narrativo completo ──────────────────────────────────────────
    // Alimentará: seção de detalhe do plano (futura rota /dashboard/plano)
    plan,

    // ── Checklist prático ─────────────────────────────────────────────────
    // Alimentará: Card "Checklist do Dia" no /dashboard
    checklist: plan.checklist,

    // ── Cronograma até o evento ───────────────────────────────────────────
    // Alimentará: seção de rotina no Card "Próximo Evento"
    timeline: plan.timeline,

    // ── Recomendações de compra/reaproveitamento ──────────────────────────
    // Alimentará: Card "Achadinhos" (contexto personalizado)
    recommendations: {
      shopOrReuse: plan.shopOrReuse,
    },

    // ── O que evitar ──────────────────────────────────────────────────────
    // Alimentará: dica contextual no /dashboard
    avoid: plan.avoid,

    // ── Nota personalizada da Viva ────────────────────────────────────────
    // Alimentará: Card "Inspiração do Dia" no /dashboard
    vivaNote: plan.vivaReminder,

    // ── Timestamp de geração ──────────────────────────────────────────────
    // Será `created_at` na tabela `viva_plans` do Supabase
    generatedAt: new Date().toISOString(),
  };
}
