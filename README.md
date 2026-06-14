# Inbox de Atendimento WhatsApp com IA

Painel de atendimento estilo WhatsApp Web construído em **Next.js (App Router) + TypeScript**,
consumindo a API hospedada do desafio. O foco é a experiência de frontend: arquitetura de
componentes, fronteira Server/Client consciente, data fetching com sincronização em tempo
(quase) real, estados de carregamento/erro/vazio e acessibilidade básica.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Linguagem | TypeScript (strict) |
| Estado de servidor | TanStack Query v5 (cache, polling, optimistic) |
| HTTP | Axios (cliente tipado fornecido) |
| Formulário | React Hook Form + Zod (resolver) |
| Estilo | Tailwind CSS v4 (tokens semânticos) + shadcn/ui |
| Animação | `motion` (shimmer do "Gerando…") |
| Datas | Day.js |
| Qualidade | Biome (lint + format) |
| Testes | Vitest + Testing Library (unit/integração), Playwright (e2e) |

---

## Como rodar (passo a passo)

Pré-requisitos: **Node 20+** e npm.

```bash
# 1. Variáveis de ambiente (a URL da API hospedada já vem preenchida)
cp .env.example .env.local

# 2. Instalar dependências
npm install

# 3. Ambiente de desenvolvimento
npm run dev            # http://localhost:3000
```

Outros comandos:

```bash
npm run build          # build de produção
npm run start          # sobe o build de produção

npm run format         # Biome (escreve correções)
npm run lint           # Biome (apenas checagem)
npm run typecheck      # tsc --noEmit

npm run test           # unit + integração (Vitest)
npm run test:coverage  # cobertura (threshold global de 80%)
npm run test:e2e       # end-to-end (Playwright; sobe build+start na porta 3100)
```

A `.env.example` aponta para a API hospedada utilizada no desafio, portanto nenhuma configuração adicional é necessária para começar a desenvolver.

### Backend local (opcional)

Para desenvolvimento isolado, o backend fornecido pelo desafio também pode ser executado localmente.

Sem Docker:

```bash
cd server
node local.mjs
```

Ou via Docker Compose (a partir da raiz do projeto):

```yml
services:
  api:
    image: node:22-alpine
    working_dir: /app
    command: node local.mjs
    ports:
      - "4000:4000"
    volumes:
      - ./server:/app
```

```bash
docker compose up -d
```

Ao utilizar o backend local, configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Features

Requisitos do desafio:

1. **Lista de conversas** — contato, última mensagem, horário, badge de não-lidas e **busca**
   por nome/telefone (com debounce de 250ms).
2. **Tela de chat** — histórico em bolhas (cliente × atendente), timestamps e ícones de status
   (enviando/enviada/entregue/lida/falha). **Infinite scroll** para mensagens antigas.
3. **Envio de mensagem com update otimista** — a mensagem aparece imediatamente (status
   "enviando") e é reconciliada com a resposta do servidor; em erro, faz rollback.
4. **Sugerir resposta com IA** — chama `POST /ai/suggest` e preenche o campo (a chave da OpenAI
   nunca chega ao browser). Estado "Gerando…" com efeito _shimmer_.
5. **Estados** — loading (skeletons), erro (com retry) e vazio bem tratados; acessibilidade básica.
6. **Atualização em tempo (quase) real** — polling via TanStack Query.

Extras:

- **Splash screen** de primeira visita (logo NeoFibra) com transição suave; nunca reaparece
  (nem no F5) — decidido no servidor via cookie.
- **Página 404** dedicada, com retorno ao inbox.
- **Banner de offline** (reage a `online`/`offline`).
- **Responsividade** estilo WhatsApp Web: duas colunas no desktop, navegação por URL no mobile.
- **Acessibilidade**: landmarks, skip link, `aria-live`, `aria-busy`, foco visível, rótulos.

---

## Arquitetura — feature-based

Organização por **feature** (domínio) + camadas compartilhadas. Cada feature é autossuficiente
(`components`, `hooks`, `services`, `schemas`, `utils`, `constants`) e só expõe o que precisa.

```text
src/
├─ app/                      # App Router (rotas, layouts, loading/error/not-found)
│  ├─ layout.tsx             #   layout raiz: shell + prefetch + splash (Server)
│  ├─ page.tsx               #   home (placeholder do painel)
│  ├─ not-found.tsx          #   404
│  ├─ error.tsx              #   error boundary global
│  └─ conversations/
│     ├─ layout.tsx          #   monta o ChatPanel acima do segmento dinâmico
│     └─ [conversationId]/   #   page (prefetch das mensagens) + loading
├─ actions/                  # Server Actions (ex.: marcar splash como vista)
├─ components/               # UI compartilhada (ui/, layout/, estados, splash, logo)
├─ constants/                # constantes compartilhadas (polling, splash)
├─ contexts/                 # contextos globais (status de conexão)
├─ features/
│  ├─ agent/                 # perfil do atendente
│  ├─ chat/                  # mensagens, composer, IA, otimista, paginação
│  └─ conversations/         # lista, busca, item, skeleton
├─ hooks/                    # hooks compartilhados (debounce, autosize textarea)
├─ lib/                      # integrações (http/axios, react-query, dayjs, shadcn)
├─ providers/                # providers de cliente (QueryClient, conexão)
├─ styles/                   # globals.css (tokens de cor/tema)
└─ utils/                    # utilitários puros (datas, iniciais, teclado)
```

### Server vs Client Components (consciente)

- **Server Components** (padrão): `app/layout.tsx` (prefetch + hidratação), `app/page.tsx`,
  `not-found.tsx`, `components/splash.tsx` (lê o cookie e decide se renderiza a splash) e a
  Server Action `actions/splash/…`. Nada de JS desnecessário no cliente.
- **Client Components** (`"use client"`): tudo que usa estado/efeito/hooks do React Query —
  `ChatPanel`, composer (RHF), botão de IA, lista de conversas, banner offline, `splash.client`.

A fronteira é deliberada: o servidor faz o trabalho de dados/decisão; o cliente cuida de
interação e sincronização.

### Estratégia de renderização (SSR / SSG / ISR)

O app é **SSR dinâmico** (todas as rotas saem como `ƒ Dynamic` no build). É a escolha correta
para um inbox **por usuário e em tempo real**:

- **SSG/ISR não se aplicam**: o conteúdo é específico do atendente logado e muda a cada segundos
  (polling). Pré-renderizar/revalidar estaticamente serviria dados "mortos".
- **SSR** entrega o shell + dados iniciais (sidebar/perfil prefetchados e hidratados no
  TanStack Query), evitando _flash_ de loading no primeiro paint; o cliente assume a
  sincronização. A leitura de cookie da splash (`cookies()`) também torna a rota dinâmica.

---

## Data fetching & estado (TanStack Query)

- **Prefetch + hydration no servidor**: o `layout.tsx` faz prefetch de `/me` e `/conversations`
  em paralelo (sem _waterfall_) e hidrata o cache — primeiro render já com dados.
- **`useConversation(id)`** usa `select` para derivar **uma** conversa do cache da lista, sem
  refetch separado e re-renderizando só quando aquela conversa muda.
- **Histórico com `useInfiniteQuery`**: a API não pagina, então o fatiamento em páginas é feito
  no client (`get-messages-page`), mantendo o contrato de infinite scroll — trocar para
  paginação real do backend seria transparente.
- **Update otimista** (`use-send-message`): `onMutate` injeta a bolha no cache (e atualiza a
  última mensagem da sidebar) antes da resposta; `onError` faz **rollback por id** (não por
  snapshot, para não apagar envios concorrentes); `onSuccess` substitui a otimista pela
  confirmada; `onSettled` invalida para reconciliar.
- **Cache/invalidação**: `staleTime` de 15s evita refetch imediato após a hidratação; mutações
  invalidam mensagens + conversas.

### Polling × WebSocket (decisão)

Uso **polling** via TanStack Query: conversas a cada **5s** e mensagens a cada **3s**
(`refetchIntervalInBackground: false` para pausar em abas inativas). Foi a escolha mais proporcional ao escopo do desafio: reduz complexidade operacional, não exige infraestrutura adicional e mantém o fluxo de sincronização previsível para o frontend.

**Trade-off / o que eu faria a seguir:** para tempo real de verdade, um **WebSocket** (ou SSE)
eliminaria a latência média do intervalo e o tráfego redundante de poll — o servidor empurraria
apenas deltas (mensagem nova, status atualizado). Eu manteria o TanStack Query como _store_ do
cliente e apenas trocaria a fonte de atualização: o handler do socket faria `setQueryData`/
`invalidateQueries` nas mesmas chaves. Polling fica como _fallback_ quando o socket cai. Não
implementei porque o backend do desafio expõe só REST e o polling atende ao requisito.

---

## Formulário (composer)

O campo de mensagem usa **React Hook Form + Zod** (`zodResolver`): o schema rejeita mensagem
vazia/somente espaços, e a validação fica desacoplada do componente. Enter envia, Shift+Enter
quebra linha, e o textarea cresce automaticamente até um teto (com scroll interno).

---

## Splash, 404 e offline

- **Splash**: o Server Component `splash.tsx` lê o cookie `neofibra_splash_seen`. Na primeira
  visita ele renderiza o `splash.client` (animação), que ao terminar chama a **Server Action**
  `markSplashSeenAction` para gravar o cookie. Em visitas seguintes (inclusive F5) o servidor
  **não** envia a splash no HTML — sem _flash_, sem _script_ inline, sem `localStorage`.
- **404**: `app/not-found.tsx` com a logo e retorno ao inbox.
- **Offline**: `ConnectionStatusProvider` + banner; a sugestão de IA usa `networkMode: "always"`
  para **falhar rápido** offline em vez de ficar pendente.

---

## Acessibilidade (básica)

`lang="pt-BR"`, landmarks (`<main>`, `<aside aria-label>`), **skip link** "Pular para o
conteúdo", rótulos em inputs (busca e mensagem), `aria-busy` nos botões de estado (IA/enviar),
`aria-live` para erros e offline, `role="status"` nos skeletons, ícones decorativos com
`aria-hidden` e foco visível (`focus-visible:ring`).

---

## Estilo / tema

Cores **100% via tokens** em `styles/globals.css` (`@theme`): nada de cor crua (`bg-neutral-200`
etc.) nos componentes — só utilitários semânticos (`bg-surface`, `text-muted-foreground`,
`border-line`, `bg-wa-teal`…). Isso deixa o tema centralizado e pronto para dark mode.

---

## Testes

| Tipo | Ferramenta | Onde | O que cobre |
|---|---|---|---|
| Unit | Vitest + TL | `src/**/*.test.tsx` (co-locados) | componentes, hooks, utils, cache otimista |
| Integração | Vitest + TL | `tests/integration/` | fluxo do chat (otimista, IA, troca de conversa) |
| E2E | Playwright | `e2e/` (chromium + mobile) | inbox, busca, navegação, envio otimista, IA |

- **Cobertura**: ~**99%** (threshold global de 80% configurado no `vitest.config.ts`).

---

## Trade-offs assumidos

Algumas decisões foram intencionalmente pragmáticas para o escopo do desafio:

- Polling em vez de WebSocket para reduzir complexidade.
- Infinite scroll implementado sobre dados locais porque a API não expõe paginação.
- Cache baseado em TanStack Query em vez de uma solução global de estado dedicada.
- Splash controlada por cookie no servidor para evitar flash visual e lógica duplicada no cliente.

Essas escolhas priorizam simplicidade, legibilidade e facilidade de manutenção sem comprometer os requisitos propostos.

---

### Evoluções futuras

Além dos pontos já mencionados (WebSocket, virtualização e paginação real), eu consideraria:

- **Validação tipada de ambiente** com `@t3-oss/env-nextjs`, garantindo que variáveis obrigatórias sejam verificadas em build time e startup, reduzindo erros de configuração entre ambientes.

- **Internacionalização (i18n)** para suportar múltiplos idiomas sem acoplamento dos textos aos componentes.

- **Sistema de notificações** para novas mensagens e eventos importantes, utilizando notificações do navegador e indicadores visuais no inbox.

- **Animações de transição** para entrada, saída e reordenação de elementos (mensagens, estados de carregamento e listas), melhorando a percepção de fluidez sem impactar a usabilidade.

- **Qualidade contínua**: evoluir a análise estática com ferramentas como SonarQube para acompanhar cobertura, duplicação de código, complexidade, code smells e métricas de manutenção ao longo da evolução do projeto.

- **Observabilidade**: adicionar instrumentação via OpenTelemetry e integração com plataformas como SigNoz, Grafana ou Datadog para monitoramento de métricas, logs, traces e erros em produção.

- **Product Analytics**: integrar ferramentas como PostHog para acompanhar uso das funcionalidades, comportamento dos usuários, adoção da sugestão por IA e métricas de engajamento do inbox.

- **Otimizações de runtime e tooling**, avaliando alternativas como Bun para desenvolvimento e execução local, caso tragam ganhos mensuráveis no fluxo de build e DX da equipe.