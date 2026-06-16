/**
 * VIVA AI — Utilitários de Privacidade e Segurança
 *
 * REGRAS CRÍTICAS DESTA VERSÃO:
 * - Nunca envie conteúdo do diário emocional para IA
 * - Nunca envie mensagens do chat para IA (chat é mockado na V1)
 * - Nunca envie dados de perfil desnecessários para IA
 * - Nunca envie dados de pagamento para IA
 * - Use apenas o contexto mínimo necessário quando IA real for integrada (V2)
 * - Nunca salve dados sensíveis em localStorage
 * - Nunca faça console.log de dados sensíveis em produção
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Campos considerados sensíveis — nunca logar ou enviar para IA */
const SENSITIVE_FIELDS = [
  'content',       // conteúdo do diário
  'mood',          // humor do diário
  'ai_reflection', // reflexão do diário
  'password',
  'email',
  'full_name',
  'birth_date',
  'avatar_url',
  'city',
  'goals',
  'interests',
  'style_preferences',
  'average_budget',
] as const;

/**
 * Sanitiza input do usuário removendo caracteres perigosos.
 * Use antes de qualquer dado que vá para o banco.
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Verifica se um conteúdo pode ser enviado para IA.
 *
 * Na V1: sempre retorna false — não há IA real.
 * Na V2: adicionar validações como comprimento mínimo,
 *         remoção de PII, verificação de conteúdo sensível.
 *
 * NUNCA enviar para IA:
 * - Conteúdo completo do diário emocional
 * - Dados de pagamento
 * - Informações pessoais desnecessárias
 */
export function shouldSendToAI(_content: string): boolean {
  // V1: IA real não implementada
  // V2: Implementar validação de conteúdo antes de enviar
  return false;
}

/**
 * Remove campos sensíveis de um objeto antes de logar ou exibir.
 * Use ao debugar objetos que possam conter dados pessoais.
 */
export function redactSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  extraFields: string[] = []
): Partial<T> {
  const allSensitive = [...SENSITIVE_FIELDS, ...extraFields];
  const redacted: Partial<T> = {};

  for (const key in obj) {
    if (allSensitive.includes(key)) {
      (redacted as Record<string, unknown>)[key] = '[REDACTED]';
    } else {
      redacted[key] = obj[key];
    }
  }

  return redacted;
}

/**
 * Log seguro — nunca imprime dados sensíveis em produção.
 * Use este método no lugar de console.log para dados de usuário.
 *
 * Em desenvolvimento: loga normalmente.
 * Em produção: silencioso (não loga nada).
 */
export function safeLog(label: string, ...args: unknown[]): void {
  if (IS_PRODUCTION) return;

  // Em desenvolvimento, redacta automaticamente campos sensíveis de objetos
  const sanitized = args.map((arg) => {
    if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
      return redactSensitiveFields(arg as Record<string, unknown>);
    }
    return arg;
  });

  // eslint-disable-next-line no-console
  console.log(`[VIVA:DEV] ${label}`, ...sanitized);
}

/**
 * Log de erro seguro — não expõe stack traces em produção.
 */
export function safeError(label: string, error: unknown): void {
  if (IS_PRODUCTION) return;
  // eslint-disable-next-line no-console
  console.error(`[VIVA:DEV:ERROR] ${label}`, error);
}
