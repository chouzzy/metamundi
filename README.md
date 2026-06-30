# Metamundi · Cotação inteligente de passagens

Plataforma que automatiza a cotação de passagens da **Metamundi** (agência de viagens):

> A agência manda o pedido no **WhatsApp** → uma **IA interpreta** → o sistema busca preços (**em dinheiro + em milhas + por companhia**) → devolve a **cotação estruturada** para a agência escolher.

Objetivo: cortar o tempo de cotação manual (de ~45 min para segundos).
**Awer** orquestra a solução; os devs da Metamundi integram as fontes reais no esqueleto abaixo.

> ⚠️ **Protótipo navegável.** Todos os dados são **fictícios/mockados**. A arquitetura já está pronta para receber as integrações reais — veja [Onde plugar o real](#onde-plugar-o-real).

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens próprios, layout *bento*)
- **lucide-react** (ícones)
- Deploy **Vercel** (zero config)

## Rodando localmente

```bash
npm install
npm run dev
# http://localhost:3000  → redireciona para /login
```

Build de produção:

```bash
npm run build && npm start
```

## Fluxo de telas

| Rota | Tela | O que mostra |
|------|------|--------------|
| `/login` | Login | Entrada da agência (split-screen). Credenciais já preenchidas — é só **Entrar**. |
| `/dashboard` | Dashboard (bento) | KPIs, tempo médio de cotação, cotações recentes, WhatsApp ao vivo, companhias mais cotadas. |
| `/conversas` | Conversas (WhatsApp) | Chat real: pedido em texto livre → **IA interpreta** → responde com a cotação. |
| `/nova` | Nova cotação | Cola o pedido → **Interpretar com IA** (chama a API) → **Gerar cotação**. |
| `/cotacoes` | Histórico | Todas as cotações da operação. |
| `/cotacoes/[id]` | **Cotação estruturada** (o coração) | Comparativo por companhia: **dinheiro + milhas**, destaques de *melhor preço* e *melhor em milhas*, ordenação. |

## Arquitetura

```
src/
├─ app/
│  ├─ (app)/                 # área logada (layout com sidebar)
│  │  ├─ dashboard/          # bento
│  │  ├─ conversas/          # WhatsApp + interpretação IA
│  │  ├─ cotacoes/           # lista + [id] (cotação estruturada)
│  │  └─ nova/               # fluxo de nova cotação
│  ├─ login/                 # autenticação (mock)
│  └─ api/                   # ── contrato HTTP para integrações ──
│     ├─ auth/login          # POST  autenticação
│     ├─ interpret           # POST  texto livre → pedido estruturado (NLU)
│     ├─ quotes              # GET lista · POST dispara busca
│     ├─ quotes/[id]         # GET cotação completa
│     ├─ conversations       # GET lista · /[id] detalhe
│     └─ dashboard           # GET indicadores + recentes
├─ components/               # UI (bento, badges, timeline de voo, cards…)
└─ lib/
   ├─ types.ts               # modelo de domínio (a "forma" dos dados)
   ├─ mock-data.ts           # dados de exemplo
   └─ data.ts                # camada de acesso (DAL) + IA de interpretação
```

## Onde plugar o real

A regra de ouro: **páginas e APIs só conversam com `src/lib/data.ts`**. Trocar mock por produção
não exige mexer na UI — basta reimplementar as funções da DAL mantendo os tipos de `src/lib/types.ts`.

| Função em `lib/data.ts` | Hoje (mock) | Integração real dos devs |
|-------------------------|-------------|--------------------------|
| `interpret(text)` | heurística (regex) | LLM (ex.: Claude) com extração de entidades |
| `getQuoteIdForRoute()` / `POST /api/quotes` | resolve mock por rota | motor de busca de tarifas (companhias + milhas) |
| `getQuote(id)` | objeto estático | resultado real da busca |
| `getConversations()` | lista fixa | WhatsApp Business API |
| `POST /api/auth/login` | aceita tudo | sessão/JWT real |

Os endpoints em `app/api/*` já expõem esse contrato em HTTP — prontos para serem consumidos
pelo sistema da Metamundi.

## Dados reais (opcional) — API de tarifas

O app já integra a **Travelpayouts (Aviasales Data API)** para puxar **preços reais** de passagens (gratuito). Funciona assim:

- **Sem token** → tudo roda com dados mock (padrão, nunca quebra).
- **Com token** → a tela **Nova cotação** dispara uma busca real e a cotação aberta mostra o selo **“Dados ao vivo · Travelpayouts”** com preços reais (em BRL). As **milhas** são *estimadas* a partir do preço (não há API pública gratuita de milhas).

Para ativar:

```bash
cp .env.example .env.local
# edite .env.local e cole seu TRAVELPAYOUTS_TOKEN
npm run dev
```

Token gratuito: crie conta em [travelpayouts.com](https://www.travelpayouts.com) → *Developers / API tokens*. Na Vercel, adicione `TRAVELPAYOUTS_TOKEN` em **Settings → Environment Variables**.

> Por que Travelpayouts e não Amadeus? A **Amadeus Self-Service** foi descontinuada (jul/2026). A Travelpayouts é gratuita, ativa e devolve preços reais por rota/data — encaixando no modelo da DAL ([src/lib/flights-api.ts](src/lib/flights-api.ts)). Trocar por Amadeus Enterprise/Duffel depois é só reimplementar `searchLiveQuote`.

## Deploy na Vercel

O projeto é **zero-config** na Vercel:

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) (framework detectado: Next.js).
2. Deploy. Pronto.

Ou via CLI:

```bash
npm i -g vercel
vercel --prod
```

---

© 2025 Metamundi · Plataforma orquestrada pela **Awer**.
