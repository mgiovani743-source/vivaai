'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Informe seu nome';
    else if (name.trim().length < 2) newErrors.name = 'Nome muito curto';
    if (!email.trim()) newErrors.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'E-mail inválido';
    if (!password.trim()) newErrors.password = 'Crie uma senha';
    else if (password.length < 6)
      newErrors.password = 'Mínimo de 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  }

  function clearError(field: keyof typeof errors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-viva-lavender/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-viva-pink/20 blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-viva-purple/10 blur-[80px]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-viva-border bg-white shadow-premium">
          {/* Gradient accent bar */}
          <div className="h-1.5 w-full gradient-bg" />

          <div className="px-6 py-10 sm:px-10">
            {/* Brand */}
            <div className="mb-8 flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg shadow-glow">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold gradient-text">VIVA</h1>
                <p className="mt-1 text-sm text-viva-gray">
                  Crie sua conta e comece a evoluir ✨
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-viva-graphite"
                >
                  Nome
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-gray/50" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError('name');
                    }}
                    placeholder="Seu nome"
                    className={`w-full rounded-xl border bg-viva-light/50 py-3 pl-10 pr-4 text-sm text-viva-graphite placeholder:text-viva-gray/40 transition-colors focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple ${
                      errors.name ? 'border-viva-danger' : 'border-viva-border'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-viva-danger">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-viva-graphite"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-gray/50" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError('email');
                    }}
                    placeholder="seu@email.com"
                    className={`w-full rounded-xl border bg-viva-light/50 py-3 pl-10 pr-4 text-sm text-viva-graphite placeholder:text-viva-gray/40 transition-colors focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple ${
                      errors.email ? 'border-viva-danger' : 'border-viva-border'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-viva-danger">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-viva-graphite"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-gray/50" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full rounded-xl border bg-viva-light/50 py-3 pl-10 pr-11 text-sm text-viva-graphite placeholder:text-viva-gray/40 transition-colors focus:outline-none focus:ring-2 focus:ring-viva-purple/30 focus:border-viva-purple ${
                      errors.password ? 'border-viva-danger' : 'border-viva-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-viva-gray/50 hover:text-viva-purple transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-viva-danger">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs leading-relaxed text-viva-gray/60">
                Ao criar sua conta, você concorda com nossos{' '}
                <button
                  type="button"
                  className="font-medium text-viva-purple hover:underline"
                  onClick={() => alert('Termos disponíveis em breve!')}
                >
                  Termos de Uso
                </button>{' '}
                e{' '}
                <button
                  type="button"
                  className="font-medium text-viva-purple hover:underline"
                  onClick={() => alert('Política disponível em breve!')}
                >
                  Política de Privacidade
                </button>
                .
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Criar minha conta
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-viva-border" />
              <span className="text-xs text-viva-gray/60">ou</span>
              <div className="h-px flex-1 bg-viva-border" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-viva-gray">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-viva-purple hover:text-viva-purple-dark transition-colors"
              >
                Já tenho conta
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center text-xs text-viva-gray/50">
          <Link href="/" className="hover:text-viva-purple transition-colors">
            ← Voltar para a página inicial
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
