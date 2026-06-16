'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CalendarHeart,
  Tag,
  Shirt,
  BookHeart,
  Trophy,
  Users,
  Check,
  ArrowRight,
  Star,
  Heart,
  Zap,
  Crown,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: CalendarHeart,
    title: 'Modo Evento',
    description:
      'Prepare-se para qualquer ocasião com sugestões personalizadas de look, beleza e atitude.',
    color: 'text-viva-purple',
    bg: 'bg-viva-purple/10',
  },
  {
    icon: Tag,
    title: 'Promoções Inteligentes',
    description:
      'Receba ofertas exclusivas de marcas parceiras baseadas no seu estilo e preferências.',
    color: 'text-viva-lavender',
    bg: 'bg-viva-lavender/10',
  },
  {
    icon: Shirt,
    title: 'Looks com IA',
    description:
      'Gere combinações de roupas incríveis usando inteligência artificial e seu guarda-roupa.',
    color: 'text-viva-pink',
    bg: 'bg-pink-400',
  },
  {
    icon: BookHeart,
    title: 'Diário Emocional',
    description:
      'Registre seus sentimentos e receba insights sobre padrões emocionais e bem-estar.',
    color: 'text-viva-purple',
    bg: 'bg-viva-purple/10',
  },
  {
    icon: Trophy,
    title: 'Hábitos & XP',
    description:
      'Gamifique sua evolução com pontos de experiência, conquistas e streaks diários.',
    color: 'text-viva-lavender',
    bg: 'bg-viva-lavender/10',
  },
  {
    icon: Users,
    title: 'Comunidade Viva',
    description:
      'Conecte-se com mulheres incríveis, compartilhe looks e inspire-se todos os dias.',
    color: 'text-viva-pink',
    bg: 'bg-pink-400',
  },
];

const testimonials = [
  {
    name: 'Mariana S.',
    avatar: '👩🏻',
    role: 'Designer, São Paulo',
    text: 'A VIVA mudou minha relação com moda e autoestima. Nunca me senti tão segura ao me vestir para eventos importantes!',
    stars: 5,
  },
  {
    name: 'Camila R.',
    avatar: '👩🏽',
    role: 'Empreendedora, Rio de Janeiro',
    text: 'O diário emocional é transformador. Consegui identificar padrões que nem minha terapeuta tinha percebido. Recomendo demais!',
    stars: 5,
  },
  {
    name: 'Juliana M.',
    avatar: '👩🏼',
    role: 'Médica, Belo Horizonte',
    text: 'As promoções inteligentes já me economizaram mais que o valor da assinatura. E os looks com IA são surpreendentes!',
    stars: 5,
  },
];

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '',
    description: 'Para experimentar o básico',
    features: [
      'Looks com IA (3/mês)',
      'Diário Emocional básico',
      'Hábitos (até 3)',
      'Comunidade (leitura)',
    ],
    cta: 'Começar grátis',
    href: '/register',
    highlighted: false,
    icon: Zap,
  },
  {
    name: 'Pro',
    price: 'R$ 29,90',
    period: '/mês',
    description: 'O mais popular entre nossas usuárias',
    features: [
      'Looks com IA ilimitados',
      'Modo Evento completo',
      'Promoções Inteligentes',
      'Diário Emocional avançado',
      'Hábitos ilimitados + XP',
      'Comunidade completa',
    ],
    cta: 'Assinar Pro',
    href: '/register',
    highlighted: true,
    icon: Star,
  },
  {
    name: 'VIP',
    price: 'R$ 49,90',
    period: '/mês',
    description: 'A experiência completa e exclusiva',
    features: [
      'Tudo do Pro',
      'Consultoria IA premium',
      'Acesso antecipado a recursos',
      'Conteúdo exclusivo',
      'Suporte prioritário',
      'Badge VIP na comunidade',
    ],
    cta: 'Quero ser VIP',
    href: '/register',
    highlighted: false,
    icon: Crown,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* ── Navbar ───────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VIVA</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-medium text-viva-graphite hover:text-viva-purple transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-20">
        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-viva-purple/20 blur-[120px] animate-pulse-soft" />
          <div className="absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full bg-viva-lavender/20 blur-[100px] animate-float" />
          <div className="absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-viva-pink/30 blur-[100px] animate-pulse-soft" />
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-28 left-[10%] h-4 w-4 rounded-full bg-viva-purple/40"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-[15%] h-3 w-3 rounded-full bg-viva-lavender/50"
            animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-32 left-[20%] h-5 w-5 rounded-full bg-viva-pink/40"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute top-1/3 right-[25%] h-2 w-2 rounded-full bg-viva-purple/30"
            animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-viva-purple/20 bg-viva-purple/5 px-4 py-1.5 text-sm font-medium text-viva-purple">
              <Sparkles className="h-4 w-4" />
              Evolução pessoal com inteligência artificial
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight text-viva-graphite sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Sua IA de{' '}
            <span className="gradient-text">evolução pessoal.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-viva-gray sm:text-xl"
          >
            Prepare sua melhor versão para cada momento da sua vida.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl gradient-bg px-8 py-4 text-base font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              Começar grátis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-viva-border bg-white px-8 py-4 text-base font-semibold text-viva-graphite shadow-card hover:border-viva-purple/30 transition-colors"
            >
              Já tenho conta
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm text-viva-gray/70"
          >
            ✨ Mais de 10.000 mulheres já estão evoluindo com a VIVA
          </motion.p>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-wider text-viva-purple"
            >
              Recursos
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-bold text-viva-graphite sm:text-4xl"
            >
              Tudo o que você precisa para{' '}
              <span className="gradient-text">brilhar</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-viva-gray"
            >
              Uma plataforma completa que une moda, beleza, autoconhecimento e
              inteligência artificial.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group relative rounded-2xl border border-viva-border bg-white p-6 shadow-card transition-all duration-300 hover:shadow-glow hover:border-viva-purple/20"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}
                >
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-viva-graphite">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-viva-gray">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────── */}
      <section className="relative bg-viva-light py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-wider text-viva-purple"
            >
              Depoimentos
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-bold text-viva-graphite sm:text-4xl"
            >
              Quem usa, <span className="gradient-text">ama</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="rounded-2xl border border-viva-border bg-white p-6 shadow-card"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-viva-warning text-viva-warning"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-viva-gray italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-viva-pink-light text-xl">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-viva-graphite">
                      {t.name}
                    </p>
                    <p className="text-xs text-viva-gray">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-wider text-viva-purple"
            >
              Planos
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-bold text-viva-graphite sm:text-4xl"
            >
              Escolha o plano ideal para{' '}
              <span className="gradient-text">você</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-viva-gray"
            >
              Comece grátis e evolua quando quiser. Sem compromisso, cancele quando desejar.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-viva-purple bg-white shadow-glow scale-[1.02]'
                    : 'border-viva-border bg-white shadow-card hover:shadow-glow hover:border-viva-purple/20'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white">
                    Mais popular
                  </span>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      plan.highlighted
                        ? 'gradient-bg'
                        : 'bg-viva-purple/10'
                    }`}
                  >
                    <plan.icon
                      className={`h-5 w-5 ${
                        plan.highlighted ? 'text-white' : 'text-viva-purple'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-viva-graphite">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-viva-graphite">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-viva-gray">{plan.period}</span>
                  )}
                </div>
                <p className="mb-6 text-sm text-viva-gray">{plan.description}</p>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-viva-graphite"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-viva-success" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? 'gradient-bg text-white shadow-glow hover:opacity-90'
                      : 'border border-viva-purple text-viva-purple hover:bg-viva-purple hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Pronta para sua melhor versão?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-white/80"
          >
            Junte-se a milhares de mulheres que estão transformando suas vidas
            com a VIVA. Comece hoje, é grátis.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-viva-purple shadow-premium hover:bg-viva-light transition-colors"
            >
              Começar grátis agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className="border-t border-viva-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">VIVA</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-viva-gray">
              <Link href="/login" className="hover:text-viva-purple transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="hover:text-viva-purple transition-colors">
                Criar conta
              </Link>
            </div>

            <p className="flex items-center gap-1 text-sm text-viva-gray/60">
              Feito com <Heart className="h-3.5 w-3.5 fill-viva-pink text-viva-pink" /> por VIVA AI
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
