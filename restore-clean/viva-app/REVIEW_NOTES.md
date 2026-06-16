# Viva AI MVP — notas de revisão

## Status
- TypeScript verificado com sucesso (`npx tsc --noEmit`).
- ESLint verificado com sucesso (`npm run lint`).
- Build não foi executado neste ambiente Linux porque o zip original trouxe apenas o pacote SWC do Windows dentro de `node_modules`. Em uma máquina Windows, rode `npm install` e depois `npm run build`.

## Correções aplicadas
- Corrigido bug em `/src/app/admin/page.tsx` onde `prev` era usado fora do callback do `setProducts`.
- Removida dependência quebrada de `clsx` em `/src/lib/utils.ts`.
- Corrigidas incompatibilidades de tipo do Framer Motion com `ease` em variants.
- Corrigido uso de `Date.now()` no chat para passar no lint do React.
- Removidos imports/variáveis não utilizados que geravam warnings.

## Como rodar
```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Rotas principais
- `/`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/eventos`
- `/dashboard/promocoes`
- `/dashboard/favoritos`
- `/dashboard/looks`
- `/dashboard/descobrir-eventos`
- `/dashboard/diario`
- `/dashboard/habitos`
- `/dashboard/desafios`
- `/dashboard/comunidade`
- `/dashboard/chat`
- `/dashboard/perfil`
- `/admin`
