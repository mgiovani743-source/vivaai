"use client";

import { CalendarDays, CheckCircle2, Clipboard, Clock3, Heart, Palette, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { VivaProfileResponse } from "@/lib/viva/profile-types";
import type { VivaPlan } from "@/lib/viva/types";

type MinhaVivaViewProps = {
  data: VivaProfileResponse | null;
};

function formatList(items: string[] | undefined) {
  if (!items || items.length === 0) {
    return "Ainda sem informacao";
  }

  if (items.length === 1) {
    return items[0];
  }

  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Data a definir";
  }

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatPlanForClipboard(plan: VivaPlan) {
  return [
    "Plano Viva",
    "",
    `Resumo do momento: ${plan.momentSummary}`,
    `Direcao de estilo: ${plan.styleDirection}`,
    `Ideia de look: ${plan.outfitIdea}`,
    `Beleza/cabelo/make: ${plan.beauty}`,
    "",
    "Checklist:",
    ...plan.checklist.map((item) => `- ${item}`),
    "",
    "Linha do tempo:",
    ...plan.timeline.map((item) => `- ${item}`),
    "",
    `O que aproveitar ou comprar: ${plan.shopOrReuse}`,
    `O que evitar: ${plan.avoid}`,
    `Lembrete da Viva: ${plan.vivaReminder}`,
  ].join("\n");
}

function SectionCard({
  title,
  children,
  icon,
  accent = "purple",
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  accent?: "purple" | "pink" | "success" | "warning";
}) {
  const accents = {
    purple: "bg-viva-purple/10 text-viva-purple",
    pink: "bg-viva-pink/30 text-viva-purple-dark",
    success: "bg-viva-success/10 text-viva-success",
    warning: "bg-viva-warning/10 text-viva-warning",
  };

  return (
    <section className="rounded-3xl border border-viva-border bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${accents[accent]}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-viva-purple">
            {title}
          </h2>
          <div className="mt-3 text-base leading-relaxed text-viva-graphite">{children}</div>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_34%),linear-gradient(180deg,#fff_0%,#f8f5ff_48%,#fff7fb_100%)] px-4 py-6 text-viva-graphite">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-xl flex-col justify-center">
        <div className="rounded-3xl border border-viva-border bg-white p-6 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg shadow-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
            Nao encontramos essa Viva
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-viva-gray">
            O link pode estar incompleto ou ter sido copiado com algum caractere faltando.
            Voce pode fazer uma nova preparacao e gerar uma area novinha.
          </p>
          <Link
            href="/experiencia"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl gradient-bg px-5 py-3 text-sm font-bold text-white shadow-glow transition-opacity hover:opacity-90"
          >
            Nova preparacao
          </Link>
        </div>
      </div>
    </main>
  );
}

export function MinhaVivaView({ data }: MinhaVivaViewProps) {
  const [copied, setCopied] = useState(false);
  const profile = data?.profile;
  const latestPlan = data?.latestPlan;
  const plan = latestPlan?.plan;

  const planText = useMemo(() => (plan ? formatPlanForClipboard(plan) : ""), [plan]);

  async function copyPlan() {
    if (!planText) {
      return;
    }

    await navigator.clipboard.writeText(planText);
    setCopied(true);
  }

  if (!profile || !latestPlan || !plan) {
    return <EmptyState />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_34%),linear-gradient(180deg,#fff_0%,#f8f5ff_48%,#fff7fb_100%)] px-4 py-5 text-viva-graphite sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para a pagina inicial">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-bg shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold gradient-text">Viva</span>
          </Link>
          <span className="rounded-full border border-viva-purple/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-viva-purple shadow-premium">
            Area pessoal
          </span>
        </header>

        <section className="mt-7 rounded-[2rem] gradient-bg p-6 text-white shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Oi, {profile.name}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Sua Viva esta pronta
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/88 sm:text-lg">
            Um plano leve para voce chegar no seu momento com mais calma, presenca e intencao.
          </p>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          {latestPlan.moments.map((moment) => (
            <span key={moment} className="rounded-full border border-viva-success/30 bg-viva-success/10 px-3 py-1 text-xs font-semibold text-viva-success">
              {moment}
            </span>
          ))}
          {latestPlan.feelings.map((feeling) => (
            <span key={feeling} className="rounded-full border border-viva-purple/20 bg-viva-purple/8 px-3 py-1 text-xs font-semibold text-viva-purple">
              {feeling}
            </span>
          ))}
          {latestPlan.styles.map((style) => (
            <span key={style} className="rounded-full border border-viva-pink/20 bg-viva-pink/20 px-3 py-1 text-xs font-semibold text-viva-purple-dark">
              {style}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Seu momento"
            accent="purple"
            icon={<CalendarDays className="h-5 w-5" />}
          >
            <p>{plan.momentSummary}</p>
            <div className="mt-4 grid gap-2 text-sm text-viva-gray">
              <p>
                <span className="font-semibold text-viva-graphite">Quando:</span>{" "}
                {formatDate(latestPlan.event_date)}
              </p>
              <p>
                <span className="font-semibold text-viva-graphite">Onde:</span>{" "}
                {latestPlan.location || "Local a definir"}
              </p>
              <p>
                <span className="font-semibold text-viva-graphite">Orcamento:</span>{" "}
                {latestPlan.budget || "A definir"}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Seu plano"
            accent="pink"
            icon={<Heart className="h-5 w-5" />}
          >
            <p className="font-semibold">{plan.outfitIdea}</p>
            <p className="mt-3 text-viva-gray">{plan.beauty}</p>
          </SectionCard>

          <SectionCard
            title="Checklist"
            accent="success"
            icon={<CheckCircle2 className="h-5 w-5" />}
          >
            <ul className="space-y-2">
              {plan.checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-viva-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Linha do tempo"
            accent="warning"
            icon={<Clock3 className="h-5 w-5" />}
          >
            <ul className="space-y-2">
              {plan.timeline.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-viva-warning" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Direcao de estilo"
            accent="purple"
            icon={<Palette className="h-5 w-5" />}
          >
            <p>{plan.styleDirection}</p>
            <p className="mt-3 text-sm font-semibold text-viva-gray">
              Estilos: {formatList(latestPlan.styles)}
            </p>
          </SectionCard>

          <SectionCard
            title="Lembrete da Viva"
            accent="pink"
            icon={<Sparkles className="h-5 w-5" />}
          >
            <p className="text-xl font-bold leading-snug gradient-text">{plan.vivaReminder}</p>
            <p className="mt-4 text-sm text-viva-gray">{plan.ifLittleTime}</p>
          </SectionCard>
        </div>

        <div className="mt-6 grid gap-3 pb-8 sm:grid-cols-2">
          <Link
            href="/experiencia"
            className="flex min-h-14 items-center justify-center rounded-2xl border border-viva-border bg-white px-6 py-4 text-base font-bold text-viva-gray transition-colors hover:border-viva-purple/20 hover:text-viva-purple"
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Nova preparacao
            </span>
          </Link>
          <button
            type="button"
            onClick={copyPlan}
            className="min-h-14 rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-glow transition-opacity hover:opacity-90"
          >
            <span className="flex items-center justify-center gap-2">
              <Clipboard className="h-5 w-5" />
              {copied ? "Plano copiado!" : "Copiar plano"}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
