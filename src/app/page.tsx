'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CalendarHeart,
  Brain,
  Heart,
  Zap,
  ArrowRight,
  Check,
  Star,
  ChevronDown,
  Bookmark,
  Compass,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Dados da LP ────────────────────────────────────────────────────────

const howItWorks = [
  {
    num: '01',
    title: 'Escolha o momento',
    description: 'Conte para a Viva qual ocasião você quer viver melhor: uma festa, viagem, evento, encontro ou fase pessoal.',
  },
  {
    num: '02',
    title: 'Conte sobre você',
    description: 'Seu estilo, sua rotina, seus gostos, seu orçamento, suas dúvidas e como você quer se sentir.',
  },
  {
    num: '03',
    title: 'Receba um caminho',
    description: 'A Viva organiza ideias, inspirações, checklist, cuidados e sugestões para te ajudar a se preparar.',
  },
  {
    num: '04',
    title: 'Evolua com o tempo',
    description: 'A visão é que a Viva aprenda com suas escolhas e fique cada vez mais conectada com quem você é.',
  },
];

const paraQuem = [
  {
    icon: CalendarHeart,
    text: 'Para quem quer se sentir mais preparada antes de momentos importantes.',
  },
  {
    icon: Bookmark,
    text: 'Para quem salva mil referências, mas não sabe por onde começar.',
  },
  {
    icon: Heart,
    text: 'Para quem quer organizar estilo, beleza, rotina e escolhas sem complicar.',
  },
  {
    icon: Compass,
    text: 'Para quem quer viver uma nova fase com mais clareza e confiança.',
  },
];

// ── Componente principal ────────────────────────────────────────────────

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bot_field: '' });
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Por favor, informe seu nome.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Por favor, informe um e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'duplicate') {
          setDuplicate(true);
          setSubmitted(true);
        } else {
          setFormError(data.error || 'Ocorreu um erro inesperado. Tente novamente.');
        }
      } else {
        setDuplicate(false);
        setSubmitted(true);
      }
    } catch (error) {
      setFormError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const faqs = [
    {
      q: 'A Viva já está disponível?',
      a: 'Ainda estamos construindo a primeira versão. A lista é para quem quer acompanhar de perto e receber acesso antecipado.',
    },
    {
      q: 'A Viva será um aplicativo?',
      a: 'A primeira experiência será digital e simples de acessar. A ideia é evoluir aos poucos, ouvindo as primeiras usuárias.',
    },
    {
      q: 'Vou precisar pagar agora?',
      a: 'Não. Neste momento, a lista serve apenas para demonstrar interesse e acompanhar o lançamento.',
    },
    {
      q: 'A Viva vai escolher tudo por mim?',
      a: 'Não. A proposta é ajudar você a organizar ideias, enxergar caminhos e tomar decisões com mais clareza — sempre mantendo seu estilo e sua vontade no centro.',
    },
    {
      q: 'A Viva vai lembrar das minhas preferências?',
      a: 'A visão da Viva é criar uma experiência cada vez mais personalizada, capaz de aprender com suas escolhas e momentos ao longo do tempo.',
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-viva-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">Viva</span>
          </a>

          {/* CTA nav — apenas lista, sem login */}
          <a
            href="#lista"
            className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
          >
            Quero acesso antecipado
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center px-5 pt-24 pb-16">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-viva-purple/15 blur-[130px] animate-pulse-soft" />
          <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-viva-lavender/15 blur-[110px] animate-float" />
          <div className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-viva-pink/20 blur-[110px] animate-pulse-soft" />
        </div>

        {/* Floating dots */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { className: 'top-28 left-[8%] h-4 w-4 bg-viva-purple/35', anim: { y: [0, -18, 0], x: [0, 8, 0] }, dur: 5 },
            { className: 'top-44 right-[12%] h-3 w-3 bg-viva-lavender/45', anim: { y: [0, 14, 0], x: [0, -7, 0] }, dur: 4 },
            { className: 'bottom-36 left-[18%] h-5 w-5 bg-viva-pink/35', anim: { y: [0, -10, 0] }, dur: 6 },
            { className: 'top-1/3 right-[22%] h-2 w-2 bg-viva-purple/25', anim: { y: [0, 16, 0], x: [0, -10, 0] }, dur: 7 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${dot.className}`}
              animate={dot.anim}
              transition={{ duration: dot.dur, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-viva-purple/20 bg-viva-purple/6 px-5 py-2 text-sm font-medium text-viva-purple">
              <Sparkles className="h-4 w-4" />
              Sua preparação pessoal com IA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight text-viva-graphite sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]"
          >
            Prepare sua melhor versão{' '}
            <span className="gradient-text">para os momentos</span>{' '}
            que importam.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-viva-gray sm:text-xl"
          >
            A Viva está nascendo para ajudar você a se organizar, se inspirar e se preparar para eventos, viagens, festas, encontros e novas fases com mais clareza, estilo e confiança.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#lista"
              className="inline-flex items-center gap-2 rounded-2xl gradient-bg px-9 py-4.5 text-base font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              Quero acesso antecipado
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 text-sm text-viva-gray/60">
            A primeira versão está sendo construída. Seja uma das primeiras.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Problema ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-viva-light">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-wider text-viva-purple"
            >
              O problema
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-bold text-viva-graphite sm:text-4xl leading-tight"
            >
              Sua vida está espalhada em{' '}
              <span className="gradient-text">mil lugares</span>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-viva-gray"
            >
              Looks salvos no Instagram, ideias no Pinterest, prints no celular, datas na agenda, desejos em abas abertas e planos que ficam para depois. A Viva nasce para transformar tudo isso em uma experiência mais simples, pessoal e conectada com o momento que você quer viver.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Conceito central ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-viva-purple/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-viva-purple">
              COMO A VIVA ENTRA NA SUA VIDA
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold text-viva-graphite sm:text-4xl">
              Você escolhe o momento.{' '}
              <span className="gradient-text">A Viva ajuda a preparar o caminho.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-viva-gray">
              Pode ser um show, uma viagem, um casamento, uma formatura, um encontro ou uma nova fase. A Viva foi pensada para ajudar você a organizar ideias, estilo, cuidados, escolhas e próximos passos de um jeito mais leve e personalizado.
            </motion.p>

            {/* A frase central */}
            <motion.div
              variants={fadeUp}
              className="mt-10 mx-auto max-w-2xl rounded-2xl border border-viva-purple/15 bg-gradient-to-br from-viva-purple/5 to-viva-pink/5 p-8"
            >
              <p className="text-xl font-medium text-viva-graphite leading-snug">
                &ldquo;Mais do que decidir o que vestir, a ideia é ajudar você a se sentir pronta para viver o momento com confiança.&rdquo;
              </p>
            </motion.div>
          </motion.div>

          {/* Como funciona */}
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {howItWorks.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="rounded-2xl border border-viva-border bg-white p-6 shadow-card hover:shadow-premium transition-shadow duration-300"
              >
                <span className="text-3xl font-extrabold gradient-text">{step.num}</span>
                <h3 className="mt-3 text-base font-bold text-viva-graphite">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-viva-gray">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Para Quem ────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-viva-light">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-viva-purple">
              Para quem é
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold text-viva-graphite sm:text-4xl">
              Feita para quem quer viver{' '}
              <span className="gradient-text">momentos com intenção</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {paraQuem.map((m, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl border border-viva-border bg-white p-6 shadow-card hover:shadow-premium hover:border-viva-purple/20 transition-all duration-300"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg shadow-glow">
                  <m.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-base text-viva-graphite leading-relaxed mt-1.5">{m.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Visão de futuro (Memória) ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-viva-purple">
              Visão
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold text-viva-graphite sm:text-4xl">
              Uma experiência que <span className="gradient-text">aprende com você.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-viva-gray">
              A Viva está sendo pensada para lembrar do que você gosta, do que evita, dos momentos que viveu e da forma como quer se sentir. Assim, cada nova preparação pode ficar mais pessoal, mais útil e mais sua.
            </motion.p>
            
            <motion.div variants={fadeUp} className="mt-8 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-purple/8">
              <Brain className="h-8 w-8 text-viva-purple" />
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Lista de interesse ── SEÇÃO PRINCIPAL ───────────────────── */}
      <section id="lista" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-viva-purple/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-viva-pink/10 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-xl px-5 sm:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-viva-purple/20 bg-viva-purple/6 px-5 py-2 text-sm font-medium text-viva-purple mb-6">
              <Zap className="h-4 w-4" />
              Acesso antecipado
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-viva-graphite sm:text-4xl">
              Entre na primeira lista{' '}
              <span className="gradient-text">da Viva.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-5 text-lg text-viva-gray leading-relaxed">
              A primeira versão está sendo construída. Cadastre-se para acompanhar o lançamento e receber acesso antecipado quando a experiência abrir.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mt-10"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-viva-success/20 bg-viva-success/5 p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-viva-success/15">
                    <Check className="h-7 w-7 text-viva-success" />
                  </div>
                  {duplicate ? (
                    <>
                      <h3 className="text-xl font-bold text-viva-graphite">Você já está na lista! 💜</h3>
                      <p className="mt-2 text-viva-gray">
                        Este e-mail já foi cadastrado. Fique de olho na sua caixa de entrada, avisaremos assim que abrir.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-viva-graphite">Você entrou na lista da Viva. 💜</h3>
                      <p className="mt-2 text-viva-gray">
                        Quando a primeira versão abrir, vamos te avisar.
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-viva-border bg-white p-8 shadow-card"
                >
                  <div className="space-y-4">
                    {/* Honeypot field (hidden from users) */}
                    <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                      <input
                        type="text"
                        name="bot_field"
                        tabIndex={-1}
                        value={formData.bot_field}
                        onChange={(e) => setFormData((p) => ({ ...p, bot_field: e.target.value }))}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-viva-graphite mb-1.5">
                        Seu nome
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Como prefere ser chamada?"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-xl border border-viva-border px-4 py-3 text-sm text-viva-graphite placeholder:text-viva-gray/50 outline-none focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/10 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-viva-graphite mb-1.5">
                        Seu e-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-xl border border-viva-border px-4 py-3 text-sm text-viva-graphite placeholder:text-viva-gray/50 outline-none focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/10 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-viva-graphite mb-1.5">
                        WhatsApp <span className="text-viva-gray/60 font-normal">(opcional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full rounded-xl border border-viva-border px-4 py-3 text-sm text-viva-graphite placeholder:text-viva-gray/50 outline-none focus:border-viva-purple focus:ring-2 focus:ring-viva-purple/10 transition-all"
                      />
                    </div>

                    {formError && (
                      <p className="text-sm text-viva-danger">{formError}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl gradient-bg py-3.5 text-base font-semibold text-white shadow-glow hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Entrando na lista...
                        </span>
                      ) : (
                        <>
                          Entrar na lista
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-viva-gray/60">
                      Sem spam. Só novidades importantes sobre a Viva.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-viva-light">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-viva-purple">
              Dúvidas
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-2xl font-bold text-viva-graphite sm:text-3xl">
              Perguntas frequentes
            </motion.h2>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-xl border border-viva-border bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-viva-graphite">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-viva-gray shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-viva-gray">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white">
            <Star className="h-4 w-4" />
            Seja uma das primeiras
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
            Pronta para preparar sua melhor versão?
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-lg text-white/80 leading-relaxed">
            Entre na lista de acesso e faça parte da primeira versão da Viva AI.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href="#lista"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-viva-purple shadow-premium hover:bg-viva-light transition-colors"
            >
              Quero participar da primeira versão
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-viva-border bg-white py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Viva</span>
            </div>

            <p className="text-sm text-viva-gray/60">
              © {new Date().getFullYear()} Viva AI — Evolução pessoal feminina
            </p>

            <div className="flex items-center gap-1 text-sm text-viva-gray/60">
              Feito com{' '}
              <Heart className="mx-1 h-3.5 w-3.5 fill-viva-pink text-viva-pink" />
              para mulheres incríveis
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
