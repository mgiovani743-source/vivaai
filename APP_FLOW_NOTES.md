# APP_FLOW_NOTES.md — Arquitetura de UX da Viva

> Documento de referência para o time de produto e desenvolvimento.
> Atualizado em: Junho 2026

---

## Visão geral do fluxo

```
LP (/) → /experiencia → /dashboard
```

A Viva tem três camadas de contexto para a usuária:

| Rota | Papel | Estado atual |
|---|---|---|
| `/` | Captação e waitlist | ✅ Funcional (Supabase waitlist) |
| `/experiencia` | Onboarding inteligente | ✅ Funcional (sem persistência) |
| `/dashboard` | Casa da usuária | 🟡 Funcional (dados mockados) |

---

## `/experiencia` — O onboarding inteligente

### O que é

A `/experiencia` é o **primeiro contato real da usuária com a inteligência da Viva**.
Não é uma página de resultado isolada: é o onboarding que coleta preferências, entende o momento da usuária e gera o primeiro plano personalizado.

### Fluxo de 6 passos

| Step | Conteúdo | Dados coletados |
|---|---|---|
| 0 | Boas-vindas / apresentação | — |
| 1 | Dados básicos | `name`, `email`, `whatsapp` |
| 2 | Momento / evento | `moment`, `date`, `location` |
| 3 | Como quer se sentir | `feelings[]` |
| 4 | Estilo e contexto | `style`, `avoid`, `ownedItems`, `budget` |
| 5 | Resultado + plano gerado | Exibe `VivaPlan`, oferece transição para `/dashboard` |

### O que a Viva aprende no onboarding

Ao final do fluxo, a função `buildOnboardingResult()` em `src/lib/viva/plan-generator.ts`
monta um objeto `VivaOnboardingResult` com **todos os dados estruturados** prontos para
persistência no Supabase:

```
VivaOnboardingResult
├── profile        → nome, email, whatsapp
├── event          → momento, data, local
├── preferences    → sensações, estilo, orçamento, evitar, itens que tem
├── plan           → plano narrativo completo (VivaPlan)
├── checklist      → lista prática de preparação
├── timeline       → cronograma até o evento
├── recommendations → shopOrReuse (comprar ou reaproveitar)
├── avoid          → o que a usuária quer evitar
├── vivaNote       → frase personalizada da Viva
└── generatedAt    → timestamp ISO (futuro created_at no Supabase)
```

---

## `/dashboard` — A casa da usuária

### O que é hoje

O `/dashboard` exibe **dados mockados** de uma estrutura visual completa.
Cada card já existe e já tem a estrutura visual certa — falta apenas conectar os dados reais.

### Mapeamento de dados: experiência → dashboard

| Card no Dashboard | Dado mock atual | Dado real futuro (VivaOnboardingResult) |
|---|---|---|
| **Score de Evolução** | `mockUser.evolutionScore` | tabela `viva_progress` (gamificação — etapa futura) |
| **Próximo Evento** | `mockEvents[0]` | `.event.moment` + `.event.date` + `.event.location` |
| ↳ Rotina de preparação | `nextEvent.plan.routine` | `.timeline` |
| ↳ Meta emocional | `nextEvent.emotionalGoal` | `.preferences.feelings` |
| **Checklist do Dia** | `mockDailyChecklist` | `.checklist` (ou `.plan.checklist`) |
| **Achadinhos** | `mockProducts` (estático) | filtrado por `.preferences.style` + `.preferences.budget` |
| ↳ Contexto de compra | — | `.recommendations.shopOrReuse` |
| **Inspiração do Dia** | `mockInspiration.text` | `.vivaNote` (ou `.plan.versionPhrase`) |
| **DashboardHeader** | `user?.name` via `useAuth()` | `.profile.name` (quando Supabase Auth estiver ativo) |

### O que NÃO muda no dashboard por ora

- Layout, sidebar, navegação mobile
- Cards de Desafio da Semana e Acesso Rápido (gamificação — etapa futura)
- AuthProvider e DashboardLayout

---

## Próximo passo recomendado: Persistência no Supabase

### Objetivo

Salvar o `VivaOnboardingResult` gerado pela `/experiencia` no Supabase e
consumir esses dados no `/dashboard`.

### Passos sugeridos

1. **Criar tabela `viva_plans` no Supabase**

   ```sql
   create table viva_plans (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz default now(),
     
     -- profile
     user_name text not null,
     user_email text not null,
     user_whatsapp text,
     
     -- event
     event_moment text,
     event_date date,
     event_location text,
     
     -- preferences (JSONB para flexibilidade)
     preferences jsonb,
     
     -- plan output
     plan jsonb,
     checklist text[],
     timeline text[],
     recommendations jsonb,
     avoid text,
     viva_note text
   );
   ```

2. **Criar Server Action ou API Route `/api/plans`**
   - Recebe `VivaOnboardingResult` via POST
   - Salva na tabela `viva_plans`
   - Retorna `{ id, created_at }` para o client

3. **Chamar `buildOnboardingResult()` no `ExperienceFlow`**
   - Já está implementado o tipo e a função
   - Basta invocar após `generateVivaPlan()` e enviar para a API

4. **Ler plano no `/dashboard`**
   - Server Component: usar `createServerClient()` para buscar o último `viva_plan`
     da usuária e passar como prop para os cards
   - Substituir cada `mock*` pelo dado real conforme o mapeamento acima

5. **Conectar com Supabase Auth**
   - Associar `viva_plans.user_id` ao `auth.users.id`
   - O `DashboardHeader` já lê `user?.name` via `useAuth()` — só precisa do dado real

### Arquivos que serão modificados nessa etapa

- `src/app/api/plans/route.ts` — [NEW] endpoint de persistência
- `src/app/dashboard/page.tsx` — substituir mocks pelos dados do Supabase
- `src/app/dashboard/layout.tsx` — adicionar fetch do plano mais recente
- `src/lib/supabase/` — client já configurado, adicionar queries

---

## O que NÃO deve ser feito ainda

- ❌ Login/registro (AuthProvider existe mas não é obrigatório agora)
- ❌ localStorage como solução de memória persistente
- ❌ Dados simulados de persistência (ex: sessionStorage fingindo banco)
- ❌ Mexer na LP `/` ou em `/api/waitlist`
- ❌ Mexer em configurações da Vercel ou proxy

---

## Arquivos-chave desta arquitetura

| Arquivo | Papel |
|---|---|
| `src/lib/viva/types.ts` | Tipos de input, plano e `VivaOnboardingResult` |
| `src/lib/viva/plan-generator.ts` | `generateVivaPlan()` + `buildOnboardingResult()` |
| `src/components/experience/ExperienceFlow.tsx` | Onboarding completo (6 steps) |
| `src/app/experiencia/page.tsx` | Rota do onboarding |
| `src/app/dashboard/page.tsx` | Dashboard com TODOs de dados reais |
| `src/components/dashboard/DashboardHeader.tsx` | Header com nome da usuária |
| `src/data/mock.ts` | Dados mockados — serão substituídos na próxima etapa |
