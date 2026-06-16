"use client";

import { ArrowLeft, Check, Clipboard, LayoutDashboard, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { generateVivaPlan } from "@/lib/viva/plan-generator";
import type {
  BudgetOption,
  FeelingOption,
  MomentOption,
  StyleOption,
  VivaExperienceInput,
  VivaPlan,
} from "@/lib/viva/types";

// ─────────────────────────────────────────────────────────────────────────────
// Opções dos selects
// ─────────────────────────────────────────────────────────────────────────────

const momentOptions: MomentOption[] = [
  "Show ou festival",
  "Casamento",
  "Formatura",
  "Viagem",
  "Encontro",
  "Aniversário",
  "Festa",
  "Nova fase pessoal",
  "Outro",
];

const feelingOptions: FeelingOption[] = [
  "confiante",
  "elegante",
  "leve",
  "marcante",
  "confortável",
  "sofisticada",
  "natural",
  "poderosa",
];

const styleOptions: StyleOption[] = [
  "básica",
  "elegante",
  "casual",
  "romântica",
  "moderna",
  "criativa",
  "sofisticada",
  "confortável",
];

const budgetOptions: BudgetOption[] = [
  "não quero comprar nada",
  "até R$100",
  "R$100 a R$250",
  "R$250 a R$500",
  "acima de R$500",
  "ainda não sei",
];

// ─────────────────────────────────────────────────────────────────────────────
// Estado inicial
// ─────────────────────────────────────────────────────────────────────────────

const initialInput: VivaExperienceInput = {
  name: "",
  email: "",
  whatsapp: "",
  moments: [],
  date: "",
  location: "",
  feelings: [],
  styles: [],
  avoid: "",
  ownedItems: "",
  budget: "",
};

type Step = 0 | 1 | 2 | 3 | 4 | 5;

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────────

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPlanForClipboard(plan: VivaPlan) {
  return [
    "Plano Viva",
    "",
    `Resumo do momento: ${plan.momentSummary}`,
    `Direção de estilo: ${plan.styleDirection}`,
    `Ideia de look: ${plan.outfitIdea}`,
    `Beleza/cabelo/make: ${plan.beauty}`,
    "",
    "Checklist prático:",
    ...plan.checklist.map((item) => `- ${item}`),
    "",
    "Cronograma até o evento:",
    ...plan.timeline.map((item) => `- ${item}`),
    "",
    `O que aproveitar ou comprar: ${plan.shopOrReuse}`,
    `O que evitar: ${plan.avoid}`,
    `Frase da sua versão: ${plan.versionPhrase}`,
  ].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Componentes de UI
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-viva-graphite">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <span className="mt-2 block text-sm text-viva-danger">{error}</span> : null}
    </label>
  );
}

/**
 * Botão de opção — suporta seleção única e múltipla.
 * Estado visual claro: borda + fundo roxa quando selecionado,
 * neutro + hover suave quando não selecionado.
 */
function OptionButton({
  selected,
  children,
  onClick,
  multi = false,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  /** true = checkbox visual; false = radio visual */
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "min-h-12 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-150",
        selected
          ? "border-viva-purple bg-viva-purple text-white shadow-glow"
          : "border-viva-border bg-white text-viva-graphite hover:border-viva-purple/40 hover:bg-viva-purple/5",
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{children}</span>
        {selected ? (
          /* Ícone: círculo preenchido para radio, check para multi */
          multi ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/25">
              <Check className="h-3.5 w-3.5 text-white" />
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          )
        ) : (
          /* Placeholder vazio para manter alinhamento */
          <span className={cn(
            "h-5 w-5 shrink-0 border-2 border-viva-border bg-white",
            multi ? "rounded-md" : "rounded-full",
          )} />
        )}
      </span>
    </button>
  );
}

/** Badge de seleção múltipla — mostra quantos itens foram escolhidos */
function SelectionBadge({ count, label }: { count: number; label: string }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-viva-purple/10 px-2.5 py-1 text-xs font-semibold text-viva-purple">
      <Check className="h-3 w-3" />
      {count} {label}
    </span>
  );
}

function PlanSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-viva-border bg-white p-5 shadow-card">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-viva-purple">{title}</h3>
      <div className="mt-3 text-base leading-relaxed text-viva-graphite">{children}</div>
    </section>
  );
}

/** Mensagem de erro estilizada */
function ErrorMsg({ message }: { message: string }) {
  return (
    <p className="mt-3 flex items-center gap-2 rounded-xl border border-viva-danger/20 bg-viva-danger/5 px-3 py-2 text-sm font-medium text-viva-danger">
      <span className="text-base">⚠️</span>
      {message}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export function ExperienceFlow() {
  const [step, setStep] = useState<Step>(0);
  const [input, setInput] = useState<VivaExperienceInput>(initialInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  /** Aviso de limite de 3 momentos — exibido inline na etapa, some em 3s */
  const [momentLimitWarning, setMomentLimitWarning] = useState(false);

  const plan = useMemo(() => (step === 5 ? generateVivaPlan(input) : null), [input, step]);
  const progress = step === 0 ? 8 : Math.round(((step + 1) / 6) * 100);

  // ── Helpers de update ────────────────────────────────────────────────────

  function update<K extends keyof VivaExperienceInput>(key: K, value: VivaExperienceInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  /** Toggle seleção múltipla de momentos (máximo 3) */
  function toggleMoment(moment: MomentOption) {
    setInput((current) => {
      const isSelected = current.moments.includes(moment);
      if (isSelected) {
        // Remove
        return { ...current, moments: current.moments.filter((m) => m !== moment) };
      }
      if (current.moments.length >= 3) {
        // Atingiu o limite — exibe aviso temporário
        setMomentLimitWarning(true);
        setTimeout(() => setMomentLimitWarning(false), 3000);
        return current; // não adiciona
      }
      return { ...current, moments: [...current.moments, moment] };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.moments;
      return next;
    });
  }

  /** Toggle seleção múltipla para feelings */
  function toggleFeeling(feeling: FeelingOption) {
    setInput((current) => {
      const selected = current.feelings.includes(feeling);
      return {
        ...current,
        feelings: selected
          ? current.feelings.filter((item) => item !== feeling)
          : [...current.feelings, feeling],
      };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.feelings;
      return next;
    });
  }

  /** Toggle seleção múltipla para styles */
  function toggleStyle(style: StyleOption) {
    setInput((current) => {
      const selected = current.styles.includes(style);
      return {
        ...current,
        styles: selected
          ? current.styles.filter((item) => item !== style)
          : [...current.styles, style],
      };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.styles;
      return next;
    });
  }

  // ── Validação ────────────────────────────────────────────────────────────

  function validateCurrentStep() {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!input.name.trim()) nextErrors.name = "Informe seu nome.";
      if (!input.email.trim()) {
        nextErrors.email = "Informe seu e-mail.";
      } else if (!isValidEmail(input.email)) {
        nextErrors.email = "Digite um e-mail válido.";
      }
    }

    if (step === 2 && input.moments.length === 0) {
      nextErrors.moments = "Escolha pelo menos um momento para continuar.";
    }

    if (step === 3 && input.feelings.length === 0) {
      nextErrors.feelings = "Escolha pelo menos uma sensação para continuar.";
    }

    if (step === 4) {
      if (input.styles.length === 0) {
        nextErrors.styles = "Escolha pelo menos um estilo para continuar.";
      }
      if (!input.budget) {
        nextErrors.budget = "Escolha uma faixa de orçamento.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // ── Navegação ────────────────────────────────────────────────────────────

  function nextStep() {
    if (!validateCurrentStep()) return;
    setCopied(false);
    setStep((current) => Math.min(current + 1, 5) as Step);
  }

  function previousStep() {
    setCopied(false);
    setErrors({});
    setStep((current) => Math.max(current - 1, 0) as Step);
  }

  function restart() {
    setInput(initialInput);
    setErrors({});
    setCopied(false);
    setMomentLimitWarning(false);
    setStep(0);
  }

  async function copyPlan() {
    if (!plan) return;
    await navigator.clipboard.writeText(formatPlanForClipboard(plan));
    setCopied(true);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_34%),linear-gradient(180deg,#fff_0%,#f8f5ff_48%,#fff7fb_100%)] px-4 py-5 text-viva-graphite sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-3xl flex-col">

        {/* Header */}
        <header className="flex items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para a página inicial">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-bg shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold gradient-text">Viva</span>
          </Link>
          <span className="rounded-full border border-viva-purple/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-viva-purple shadow-premium">
            Primeiro acesso
          </span>
        </header>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-viva-gray">
            <span>{step === 5 ? "Plano pronto ✨" : `Passo ${step + 1} de 6`}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white shadow-inner">
            <div
              className="h-full rounded-full gradient-bg transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card principal */}
        <div className="flex flex-1 items-center py-8">
          <div className="w-full rounded-[2rem] border border-white/80 bg-white/86 p-5 shadow-card backdrop-blur-xl sm:p-8">

            {/* Botão voltar */}
            {step > 0 ? (
              <button
                type="button"
                onClick={previousStep}
                className="mb-6 inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-viva-gray transition-colors hover:text-viva-purple"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            ) : null}

            {/* ── Step 0: Boas-vindas ──────────────────────────────────────── */}
            {step === 0 ? (
              <section className="py-8 text-center sm:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-bg shadow-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-viva-purple">
                  Sua primeira preparação
                </p>
                <h1 className="mx-auto mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-viva-graphite sm:text-5xl">
                  Vamos criar seu primeiro plano Viva?
                </h1>
                <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-viva-gray">
                  Responda algumas perguntas rápidas sobre seu próximo momento especial.
                  A Viva vai usar isso para entender seu estilo e montar um plano só seu.
                </p>
                <div className="mx-auto mt-8 flex max-w-sm flex-col gap-2 text-left">
                  {[
                    { emoji: "✍️", text: "Você conta sobre o momento" },
                    { emoji: "🎨", text: "A Viva aprende seu estilo" },
                    { emoji: "✨", text: "Seu primeiro plano fica pronto" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-viva-border bg-white/80 px-4 py-3">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm font-medium text-viva-graphite">{item.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-9 min-h-14 w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90 sm:w-auto sm:min-w-56"
                >
                  Começar minha preparação
                </button>
              </section>
            ) : null}

            {/* ── Step 1: Dados básicos ────────────────────────────────────── */}
            {step === 1 ? (
              <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-viva-purple">
                  Sobre você
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-viva-graphite">
                  Como vamos te chamar?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-viva-gray">
                  A Viva vai usar isso para personalizar seu plano e lembrar de você na próxima vez.
                </p>
                <div className="mt-8 space-y-5">
                  <Field label="Nome" error={errors.name}>
                    <input
                      value={input.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="min-h-13 w-full rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="Seu nome"
                    />
                  </Field>
                  <Field label="E-mail" error={errors.email}>
                    <input
                      type="email"
                      value={input.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="min-h-13 w-full rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="voce@email.com"
                    />
                  </Field>
                  <Field label="WhatsApp (opcional)">
                    <input
                      value={input.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      className="min-h-13 w-full rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="(00) 00000-0000"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 min-h-14 w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
                >
                  Continuar
                </button>
              </section>
            ) : null}

            {/* ── Step 2: Momentos (múltipla seleção, máx 3) ───────────────── */}
            {step === 2 ? (
              <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-viva-purple">
                  Seu momento
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-viva-graphite">
                  Qual é o momento que você quer preparar?
                </h1>

                {/* Instrução + badge de contagem */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-base leading-relaxed text-viva-gray">
                    Escolha até 3 opções. A Viva vai usar isso como ponto de partida do seu plano.
                  </p>
                  {input.moments.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-viva-purple/10 px-2.5 py-1 text-xs font-semibold text-viva-purple">
                      <Check className="h-3 w-3" />
                      {input.moments.length} de 3 {input.moments.length === 1 ? "selecionado" : "selecionados"}
                    </span>
                  )}
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {momentOptions.map((moment) => (
                    <OptionButton
                      key={moment}
                      selected={input.moments.includes(moment)}
                      onClick={() => toggleMoment(moment)}
                      multi={true}
                    >
                      {moment}
                    </OptionButton>
                  ))}
                </div>
                {/* Aviso de limite — aparece ao tentar selecionar a 4ª opção */}
                {momentLimitWarning && (
                  <ErrorMsg message="Escolha até 3 momentos para manter seu plano mais focado." />
                )}
                {errors.moments ? <ErrorMsg message={errors.moments} /> : null}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Data (opcional)">
                    <input
                      type="date"
                      value={input.date}
                      onChange={(e) => update("date", e.target.value)}
                      className="min-h-13 w-full rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                    />
                  </Field>
                  <Field label="Cidade/local (opcional)">
                    <input
                      value={input.location}
                      onChange={(e) => update("location", e.target.value)}
                      className="min-h-13 w-full rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="Ex.: São Paulo"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 min-h-14 w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
                >
                  Continuar
                </button>
              </section>
            ) : null}

            {/* ── Step 3: Sensações (múltipla seleção) ────────────────────── */}
            {step === 3 ? (
              <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-viva-purple">
                  Como quer se sentir
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-viva-graphite">
                  Escolha as sensações que mais importam.
                </h1>

                {/* Instrução de múltipla seleção + contador */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-base leading-relaxed text-viva-gray">
                    Escolha uma ou mais opções.
                  </p>
                  <SelectionBadge
                    count={input.feelings.length}
                    label={input.feelings.length === 1 ? "selecionada" : "selecionadas"}
                  />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {feelingOptions.map((feeling) => (
                    <OptionButton
                      key={feeling}
                      selected={input.feelings.includes(feeling)}
                      onClick={() => toggleFeeling(feeling)}
                      multi={true}
                    >
                      {feeling}
                    </OptionButton>
                  ))}
                </div>
                {errors.feelings ? <ErrorMsg message={errors.feelings} /> : null}

                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 min-h-14 w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
                >
                  Continuar
                </button>
              </section>
            ) : null}

            {/* ── Step 4: Estilo + contexto (múltipla seleção) ────────────── */}
            {step === 4 ? (
              <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-viva-purple">
                  Estilo e contexto
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-viva-graphite">
                  Agora vamos deixar o plano completamente seu.
                </h1>
                <p className="mt-3 text-base leading-relaxed text-viva-gray">
                  Essas preferências ficam salvas para a Viva te conhecer melhor a cada preparação.
                </p>

                {/* Estilos — múltipla seleção */}
                <div className="mt-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-viva-graphite">Estilo</p>
                    <SelectionBadge
                      count={input.styles.length}
                      label={input.styles.length === 1 ? "selecionado" : "selecionados"}
                    />
                  </div>
                  <p className="mt-1 text-sm text-viva-gray">
                    Escolha os estilos que mais combinam com você.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {styleOptions.map((style) => (
                      <OptionButton
                        key={style}
                        selected={input.styles.includes(style)}
                        onClick={() => toggleStyle(style)}
                        multi={true}
                      >
                        {style}
                      </OptionButton>
                    ))}
                  </div>
                  {errors.styles ? <ErrorMsg message={errors.styles} /> : null}
                </div>

                {/* Campos opcionais */}
                <div className="mt-7 space-y-5">
                  <Field label="O que quer evitar?">
                    <textarea
                      value={input.avoid}
                      onChange={(e) => update("avoid", e.target.value)}
                      className="min-h-28 w-full resize-none rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="Ex.: salto alto, roupa muito justa, brilho demais"
                    />
                  </Field>
                  <Field label="O que já tem para aproveitar?">
                    <textarea
                      value={input.ownedItems}
                      onChange={(e) => update("ownedItems", e.target.value)}
                      className="min-h-28 w-full resize-none rounded-2xl border border-viva-border bg-white px-4 py-3 text-base outline-none transition focus:border-viva-purple focus:ring-4 focus:ring-viva-purple/10"
                      placeholder="Ex.: vestido preto, blazer branco, sandália nude"
                    />
                  </Field>
                </div>

                {/* Orçamento — seleção única */}
                <div className="mt-7">
                  <p className="text-sm font-semibold text-viva-graphite">Orçamento</p>
                  <p className="mt-1 text-sm text-viva-gray">Escolha uma opção.</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {budgetOptions.map((budget) => (
                      <OptionButton
                        key={budget}
                        selected={input.budget === budget}
                        onClick={() => update("budget", budget)}
                        multi={false}
                      >
                        {budget}
                      </OptionButton>
                    ))}
                  </div>
                  {errors.budget ? <ErrorMsg message={errors.budget} /> : null}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 min-h-14 w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
                >
                  Gerar meu plano
                </button>
              </section>
            ) : null}

            {/* ── Step 5: Resultado ────────────────────────────────────────── */}
            {step === 5 && plan ? (
              <section>
                {/* Cabeçalho do plano */}
                <div className="rounded-3xl gradient-bg p-5 text-white shadow-glow">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                    Primeiro plano Viva
                  </p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
                    {input.name.trim()}, sua preparação começou.
                  </h1>
                  <p className="mt-4 text-base leading-relaxed text-white/88">{plan.momentSummary}</p>
                </div>

                {/* Chips de preferências salvas */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {input.moments.map((m) => (
                    <span key={m} className="rounded-full border border-viva-success/30 bg-viva-success/10 px-3 py-1 text-xs font-semibold text-viva-success">
                      {m}
                    </span>
                  ))}
                  {input.feelings.map((f) => (
                    <span key={f} className="rounded-full border border-viva-purple/20 bg-viva-purple/8 px-3 py-1 text-xs font-semibold text-viva-purple">
                      {f}
                    </span>
                  ))}
                  {input.styles.map((s) => (
                    <span key={s} className="rounded-full border border-viva-pink/20 bg-viva-pink/8 px-3 py-1 text-xs font-semibold text-viva-pink">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Seções do plano */}
                <div className="mt-5 grid gap-4">
                  <PlanSection title="Direção de estilo">{plan.styleDirection}</PlanSection>
                  <PlanSection title="Ideia de look">{plan.outfitIdea}</PlanSection>
                  <PlanSection title="Beleza/cabelo/make">{plan.beauty}</PlanSection>

                  <PlanSection title="Checklist prático">
                    <ul className="space-y-2">
                      {plan.checklist.map((item) => (
                        <li key={item} className="flex gap-3">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-viva-purple" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </PlanSection>

                  <PlanSection title="Cronograma até o evento">
                    <ul className="space-y-2">
                      {plan.timeline.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-viva-pink" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </PlanSection>

                  <PlanSection title="O que aproveitar ou comprar">{plan.shopOrReuse}</PlanSection>
                  <PlanSection title="O que evitar">{plan.avoid}</PlanSection>
                  <PlanSection title="Frase da sua versão">
                    <p className="text-xl font-bold leading-snug gradient-text">{plan.versionPhrase}</p>
                  </PlanSection>
                </div>

                {/* Seção de transição para o dashboard */}
                <div className="mt-8 rounded-3xl border border-viva-purple/20 bg-gradient-to-br from-viva-purple/5 to-viva-lavender/10 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-viva-purple">
                    Próximo passo
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-viva-graphite">
                    Seu primeiro plano Viva está pronto.
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-viva-gray">
                    Esse é o primeiro passo para a Viva entender seu estilo, seus momentos e a forma como você quer se sentir.
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={copyPlan}
                    className="min-h-14 rounded-2xl border border-viva-purple/20 bg-white px-6 py-4 text-base font-bold text-viva-purple transition-colors hover:bg-viva-purple/5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Clipboard className="h-5 w-5" />
                      {copied ? "Copiado!" : "Copiar plano"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={restart}
                    className="min-h-14 rounded-2xl border border-viva-border bg-white px-6 py-4 text-base font-bold text-viva-gray transition-colors hover:border-viva-purple/20 hover:text-viva-purple"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Refazer experiência
                    </span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="flex min-h-14 items-center justify-center rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      Ver minha Viva
                    </span>
                  </Link>
                </div>
              </section>
            ) : null}

          </div>
        </div>
      </div>
    </main>
  );
}
