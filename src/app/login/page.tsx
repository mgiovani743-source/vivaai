'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'E-mail inválido';
    if (!password.trim()) newErrors.password = 'Informe sua senha';
    else if (password.length < 6) newErrors.password = 'Mínimo de 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    // Fallback mockado: sem Supabase configurado, apenas redireciona
    if (!isSupabaseConfigured()) {
      setTimeout(() => router.push('/dashboard'), 600);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      if (error.message.includes('Invalid login credentials')) {
        setErrors({ general: 'E-mail ou senha incorretos.' });
      } else if (error.message.includes('Email not confirmed')) {
        setErrors({ general: 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.' });
      } else {
        setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
      }
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-viva-purple/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-viva-pink/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-viva-lavender/10 blur-[80px]" />
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
                  Bem-vinda de volta ✨
                </p>
              </div>
            </div>

            {/* General error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-2 rounded-xl bg-viva-danger/10 border border-viva-danger/20 p-3"
              >
                <AlertCircle className="h-4 w-4 text-viva-danger flex-shrink-0" />
                <p className="text-sm text-viva-danger">{errors.general}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="••••••••"
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
                  <p className="mt-1.5 text-xs text-viva-danger">{errors.password}</p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-viva-purple hover:text-viva-purple-dark transition-colors"
                  onClick={() => alert('Recuperação de senha disponível em breve!')}
                >
                  Esqueceu a senha?
                </button>
              </div>

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
                    Entrar
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

            {/* Register link */}
            <p className="text-center text-sm text-viva-gray">
              Ainda não tem conta?{' '}
              <Link
                href="/register"
                className="font-semibold text-viva-purple hover:text-viva-purple-dark transition-colors"
              >
                Criar conta
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
