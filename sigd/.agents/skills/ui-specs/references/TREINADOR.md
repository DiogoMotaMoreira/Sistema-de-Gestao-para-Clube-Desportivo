# TREINADOR_MODULE.md — Módulo Treinador (Perfil: `ROLE_TREINADOR`)
# App Mobile Exclusiva — React Native + Expo (RNF-23)

**Visão Geral:** Ferramenta operacional de relvado para o Treinador.
Acompanha cada ação crítica desde o início do treino até à submissão da ficha
de jogo. Toda a interação ocorre sob pressão de tempo, com luz solar direta e
com o polegar como único vetor de input.

**Paradigma de Design:** Cada ação crítica é acionável com o polegar, nunca
a mais de dois toques da tela inicial. Sem tabelas clássicas, sem sidebar,
sem menus aninhados. Arquitetura em cartões empilhados verticalmente, Bottom
Sheets para ações transacionais e Bottom Navigation Bar de 4 itens.

**Container da App:**
`max-w-md` · `mx-auto` · `h-screen` · `overflow-hidden` · `bg-[#F8FAFC]`
Renderizado como telemóvel centrado no ecrã.

> **Nota de RBAC:** O Treinador apenas vê e opera sobre a(s) equipa(s) a que
> foi explicitamente alocado (RF-07). Nenhuma informação financeira, clínica
> detalhada ou de outros escalões é visível ou acessível.

---

## Especificação do Semáforo Clínico (componente reutilizável)

Surge em todos os cartões de atletas. O Treinador **nunca** vê diagnósticos
ou notas clínicas (RF-23 Data Masking).

| Estado | Fundo | Texto | Borda | Ícone Lucide | Label |
|---|---|---|---|---|---|
| **APTO** | `#ECFDF5` | `#047857` | `1px #047857` | `CheckCircle` | `Apto` |
| **CONDICIONADO** | `#FFFBEB` | `#B45309` | `1px #B45309` | `AlertTriangle` | `Condicionado` |
| **INAPTO — Clínico** | `#FEE2E2` | `#991B1B` | `1px #991B1B` | `XCircle` | `Inapto — Clínico` |
| **INAPTO — Documental** | `#FEF3C7` | `#92400E` | `1px #92400E` | `Clock` | `Inapto — Documental` |

> **Legibilidade ao sol:** todos os badges têm borda sólida (`1px`) na mesma
> cor do texto, garantindo contraste mesmo com luz solar direta sem depender
> apenas do preenchimento de fundo.

---

## Anatomia Global da App Shell (Mobile)

### Top App Bar (fixo, 56px de altura)
- Fundo `#FFFFFF`. Borda inferior `1px #E2E8F0`.
- **Esquerda:** Ícone de voltar `ChevronLeft` (Lucide, 24px, `#0F172A`) quando
  em sub-ecrã. Ausente na tab raiz.
- **Centro:** Título da página (16px, SemiBold, `#0F172A`).
- **Direita:** Ícone contextual (ex: `SlidersHorizontal` para filtros,
  `MoreVertical` para menu) — especificado por ecrã. Ausente quando não
  aplicável.

### Content Area (scroll nativo)
- Fundo `#F8FAFC`. Padding `16px` lateral. Padding superior `8px`.
- Scroll vertical nativo. Não esconde a Bottom Navigation.
- Padding inferior `80px` para que o último cartão não fique sob a
  Bottom Navigation.

### Bottom Navigation Bar (fixo, 56px de altura)
- Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`.
- Quatro itens em linha horizontal uniforme.
- **Item inativo:** ícone 24px Gray 500 + label 10px Gray 500.
- **Item ativo:** ícone 24px `#F1C40F` + label 10px `#F1C40F` SemiBold.
- Touch target mínimo: 44×44px por item (RNF-15).

**Quatro Itens da Bottom Navigation:**

| Posição | Label | Ícone Lucide | Badge |
|---|---|---|---|
| 1 | `Hoje` | `Home` | Badge ambar `!` quando convocatória por publicar < 72h |
| 2 | `Plantel` | `Users` | Sem badge |
| 3 | `Jogos` | `Calendar` | Badge vermelho `[N]` quando ficha de jogo pendente dentro da janela de 24h |
| 4 | `Eu` | `User` | Sem badge |

**Especificação dos badges da Bottom Navigation:**
- Badge vermelho (ficha pendente): círculo sólido 16px, fundo `#991B1B`,
  texto branco Bold 10px, posicionado no canto superior direito do ícone.
  Animação `pulse` de 2 segundos quando prazo < 1h.
- Badge ambar (convocatória por publicar): ponto sólido 8px, fundo `#B45309`,
  sem texto, canto superior direito do ícone.

---

## TAB 1 — HOJE (Landing Page)

**Top App Bar:**
- Centro: `"Bom dia, [Nome]"` (16px, SemiBold, `#0F172A`).
- Direita: Avatar circular do treinador (32px). Ao tocar → navega para TAB 4.

**Sub-header (abaixo da Top App Bar, dentro da Content Area):**
Badge pill da equipa: fundo `#0F172A`, texto `#F1C40F` SemiBold 12px,
corner radius `20px`, padding `6px 12px`. Ex: `Sub-15 A`.
Se o treinador estiver alocado a múltiplas equipas: dropdown horizontal de
pills (scroll horizontal, sem scroll vertical). Ao tocar numa pill diferente,
todos os cards do ecrã atualizam para essa equipa.

---

### Cartão de Alerta Persistente "Convocatória por Publicar"

*(Visível apenas quando existe convocatória em rascunho ou não criada para
um jogo a menos de 72h. Posicionado sempre abaixo do sub-header, acima dos
cards de evento do dia.)*

Fundo `#FFFBEB`. Borda esquerda `4px #B45309`. Borda restante `1px #B45309`.
Corner radius `12px`. Padding `14px 16px`.

Layout:
- Ícone Lucide `AlertTriangle` (16px, `#B45309`) à esquerda, alinhado
  ao centro vertical.
- **Linha 1:** `"Convocatória por publicar"` (14px, SemiBold, `#B45309`).
- **Linha 2:** `"[Adversário] — [Dia da Semana] às [HH:MM]"` (12px, `#B45309`).
- Ícone Lucide `ChevronRight` (16px, `#B45309`) à direita. Ao tocar no
  cartão inteiro → navega para o detalhe do jogo em TAB 3.

---

### Cards de Evento do Dia

Ordenados por prioridade automática (ficha pendente → sessão de treino →
jogo próximo → sem eventos).

---

#### Card Tipo A — Sessão de Treino

Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda restante `1px #E2E8F0`.
Corner radius `12px`. Sombra suave (Y=1, Blur=2). Padding `16px`.

**Sub-estado: Sessão com Chamada Ainda Não Iniciada**

Layout (topo para baixo):
- **Linha 1:** Badge pill `TREINO HOJE` (fundo `#ECFDF5`, texto `#047857`,
  ícone Lucide `Dumbbell` 12px, 10px SemiBold UPPERCASE) + hora à direita
  em Bold 16px `#047857`. Ex: `17:00`.
- **Linha 2:** `"[Instalação] · [Nome da Equipa]"` (13px, Gray 500).
- **Espaçamento:** 12px.
- **Botão Full-width:** `"Iniciar Chamada"` (fundo `#F1C40F`, texto `#000000`
  SemiBold 15px, height 48px, corner radius `12px`, ícone Lucide `ClipboardCheck`
  à esquerda 18px).

**Sub-estado: Chamada Em Curso (ainda não submetida)**

- Badge pill `EM CURSO` (fundo `#EFF6FF`, texto `#1D4ED8`, ícone `Activity`).
- Badge de progresso: `"[N]/[Total] Marcados"` (fundo `#F8FAFC`, texto
  `#0F172A` Bold, borda `1px #E2E8F0`, corner radius `8px`, padding `4px 8px`).
- Botão Full-width Outline: `"Continuar Chamada"` (borda `1px #E2E8F0`,
  texto `#0F172A`, height 48px, corner radius `12px`).

**Sub-estado: Chamada Submetida — Sessão Ainda em Curso**

- Badge pill `EM TREINO` (fundo `#ECFDF5`, texto `#047857`).
- Texto: `"Chamada submetida — [N] presentes, [X] ausentes"` (13px, Gray 500).
- Botão Full-width Outline: `"Ver Chamada"` (read-only).

**Sub-estado: Sessão Terminada — Avaliação Disponível**

- Badge pill `TREINO CONCLUÍDO` (fundo `#F1F5F9`, texto `#64748B`).
- **Contador regressivo de avaliação:**
  - > 6h restantes: texto `"Avaliar até [HH:MM]"` (12px, `#047857`).
  - 1h–6h: texto com cor `#B45309`.
  - < 1h: texto com cor `#991B1B` + borda do card muda para `1px #991B1B`
    pulsante (animação `pulse` 2s).
  - Ex: `"Expira em 5h 32m"`.
- Botão Full-width Dourado: `"Avaliar Sessão"` (fundo `#F1C40F`, texto
  `#000000` SemiBold, height 48px, ícone Lucide `Star` 18px).

**Sub-estado: Sessão Terminada — Avaliação Submetida**

- Badge pill `CONCLUÍDO` (Verde).
- Texto: `"Avaliação submetida"` (13px, Gray 500).
- Sem botão de ação.

---

#### Card Tipo B — Jogo Próximo

Fundo `#FFFFFF`. Borda esquerda `4px #1D4ED8`. Borda restante `1px #E2E8F0`.
Corner radius `12px`. Sombra suave. Padding `16px`.

Layout:
- **Linha 1:** Badge pill `JOGO` (fundo `#EFF6FF`, texto `#1D4ED8`, ícone
  Lucide `Trophy` 12px) + data/hora à direita (13px, `#1D4ED8` Bold).
- **Linha 2:** Adversário (Bold 16px, `#0F172A`). Ex: `FC Rival`.
- **Linha 3:** `"[Quadro Competitivo] · [Local] · [Casa/Fora/Neutro]"`
  (12px, Gray 500).
- **Linha 4:** Estado da convocatória:
  - `"Convocatória: Não criada"` (12px, `#991B1B`, ícone `XCircle` 12px).
  - `"Convocatória: Rascunho guardado"` (12px, `#B45309`, ícone `Clock` 12px).
  - `"Convocatória: Publicada · [N] convocados"` (12px, `#047857`, ícone
    `CheckCircle` 12px).
- **Espaçamento:** 12px.
- **Botão Full-width:** contextual por estado (especificado em TAB 3 — Detalhe
  do Jogo).

---

#### Card Tipo C — Ficha de Jogo Pendente

Fundo `#FFFFFF`. Borda esquerda `4px #991B1B`. Borda restante `1px #991B1B`.
Corner radius `12px`. Sombra suave. Padding `16px`.

Layout:
- **Linha 1:** Badge pill `FICHA PENDENTE` (fundo `#FEE2E2`, texto `#991B1B`,
  ícone Lucide `AlertCircle` 12px, 10px SemiBold).
- **Linha 2:** `"[Adversário]"` (Bold 16px, `#0F172A`).
- **Linha 3:** `"[Data do jogo] · [HH:MM]"` (12px, Gray 500).
- **Contador regressivo:**
  - Fundo `#FEE2E2`, borda `1px #991B1B`, corner radius `8px`,
    padding `6px 10px`.
  - Ícone Lucide `Clock` (14px, `#991B1B`) + texto Bold 14px `#991B1B`:
    `"Expira em [Xh Ym]"`.
  - Quando < 1h: borda do card inteiro pulsa com animação `pulse` 2 segundos.
- **Espaçamento:** 12px.
- **Botão Full-width:** `"Preencher Ficha de Jogo"` (fundo `#991B1B`, texto
  `#FFFFFF` SemiBold 15px, height 52px, corner radius `12px`, ícone Lucide
  `ClipboardList` 18px à esquerda).

---

#### Card de Estado Neutro — Sem Eventos Urgentes

Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `20px`.
Centrado verticalmente.

- Ícone Lucide `CalendarCheck` (48px, Gray 200, opacidade 40%).
- Título: `"Sem eventos para hoje"` (16px, SemiBold, Gray 500).
- Sub-título: `"Próximo evento: [Nome do evento] — [Dia da Semana], [DD/MM]"`
  (13px, Gray 500).

---

### Auto-save Indicator (Top App Bar — sub-header discreto)

Visível apenas durante flows de preenchimento (Lista de Chamada, Avaliação,
Ficha de Jogo):

Linha discreta abaixo da Top App Bar, fundo `#F8FAFC`, padding `4px 16px`:
- Ícone Lucide `Save` (12px, Gray 500) + texto `"Guardado — HH:MM"` (11px,
  Gray 500, itálico).
- Atualiza a cada 30 segundos automaticamente.

---

## TAB 2 — PLANTEL

**Top App Bar:**
- Centro: `"Plantel"` (16px, SemiBold, `#0F172A`).
- Direita: Ícone `Search` (24px, `#0F172A`). Ao tocar → input de pesquisa
  expande-se na Top App Bar (substituindo o título). Placeholder:
  `"Pesquisar atleta..."`. Debounce ≥ 300ms após ≥ 3 caracteres.

**Toggle Group (abaixo da Top App Bar, dentro da Content Area):**
- `Todos [N]` · `Inaptos [X]`
- Ativo: fundo `#0F172A`, texto `#FFFFFF` SemiBold, corner radius `20px`.
- Inativo: fundo transparente, borda `1px #E2E8F0`, texto `#0F172A`, corner
  radius `20px`.
- Padding: `8px 20px`. Altura: `36px`.

---

### Lista de Cartões de Atleta

Scroll vertical. Um cartão por atleta, separados por `8px` de gap.

**Cartão de Atleta (estado Apto):**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Sombra suave.
Padding `14px 16px`. Height mínima `72px`.

Layout em linha horizontal:
- **Avatar** (40px circular, foto do atleta ou inicial em fundo `#E2E8F0`).
- **Coluna de texto** (flex 1, margem esquerda 12px):
  - **Linha 1:** Nome completo (Bold 14px, `#0F172A`).
  - **Linha 2:** `"[Posição] · [N] anos"` (12px, Gray 500).
  - **Linha 3:** `"Méd. treinos: [X.X]  ·  Assiduidade: [XX]%"` (11px,
    Gray 500). Texto truncado com `...` se muito longo.
- **Badge Semáforo** (alinhado à direita, centro vertical). Especificação
  na secção global.
- **Ícone** `ChevronRight` (16px, Gray 200) à extrema direita.

**Cartão de Atleta (estado INAPTO):**
Mesma estrutura + badge `INAPTO — [causa]` (Vermelho) alinhado à direita.
O cartão inteiro fica com opacidade `0.7` para reforçar a indisponibilidade.

**Cartão de Atleta (estado CONDICIONADO):**
Badge `Condicionado` (Ambar). Abaixo do badge: texto minúsculo `"Tocar para
ver restrições"` (10px, `#B45309`). Ao tocar no badge → abre **Bottom Sheet
"Restrições Clínicas Mascaradas"**.

**Swipe Actions nos Cartões (gesture opcional):**
- Swipe para a esquerda desvela área vermelha com ícone `AlertCircle` —
  indica "Reportar Problema" (ação futura, não implementada nesta versão;
  área serve de feedback visual de que o swipe foi reconhecido).

**Empty State (sem atletas):**
- Ícone Lucide `Users` centrado (64px, opacidade 10%, Gray 200).
- Título: `"Plantel vazio"` (16px, Gray 500).
- Sub-título: `"A Direção Técnica ainda não alocou atletas a esta equipa."` (13px, Gray 500).

---

### Ecrã "Perfil do Atleta" (Push Navigation — full screen)

*(Abre ao tocar num cartão de atleta no Plantel)*

**Top App Bar:**
- Esquerda: ícone `ChevronLeft` (24px) → volta ao Plantel.
- Centro: `"Perfil do Atleta"` (16px, SemiBold).

**Conteúdo (scroll vertical):**

**Secção de Identificação:**
Cartão fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`,
padding `20px`:
- Avatar centrado (72px circular).
- Nome (Bold 20px, `#0F172A`, centrado).
- `"[Posição] · [Escalão] · [N] anos"` (14px, Gray 500, centrado).
- Badge Semáforo (centrado, em destaque, padding `8px 16px`).

**Secção "Estatísticas Recentes" (read-only):**
Cartão separado. Título: `"ESTATÍSTICAS RECENTES"` (11px, UPPERCASE, Gray 500).
Quatro métricas em grelha 2×2:
- `Taxa de Assiduidade (4 sem.)` + valor (Bold 20px). Ex: `89%`.
  Cor: ≥ 80% `#047857` · 60–79% `#B45309` · < 60% `#991B1B`.
- `Avaliação Média (5 sess.)` + valor. Ex: `3.8 / 5.0`. Cor `#0F172A`.
- `Minutos Esta Época` + valor. Ex: `1.284 min`. Cor `#0F172A`.
- `Convocatórias Esta Época` + valor. Ex: `18`. Cor `#0F172A`.

Se dados insuficientes para qualquer métrica: `"—"` em Gray 200.

**Secção "Últimas Convocatórias":**
Lista de pills horizontais (scroll horizontal):
- Convocado: pill fundo `#ECFDF5`, ícone `CheckCircle` `#047857`. Ex:
  `"14 Jun"`.
- Não convocado: pill fundo `#F1F5F9`, ícone `Minus` Gray 500.

> **Nota RBAC:** Este ecrã **não exibe** NIF, morada, estado financeiro,
> dados clínicos detalhados, EMDs ou qualquer PII que não seja Nome, Posição,
> Escalão e Idade (RF-23).

---

## TAB 3 — JOGOS

**Top App Bar:**
- Centro: `"Jogos"` (16px, SemiBold).

---

### Lista de Cartões de Jogo

Scroll vertical. Organizados cronologicamente (mais próximos no topo).
Separados por label de secção quando mudam de semana:
`"ESTA SEMANA"` · `"PRÓXIMA SEMANA"` · `"JOGOS ANTERIORES"` (11px, UPPERCASE,
Gray 500, padding `12px 0 4px`).

---

**Cartão de Jogo Futuro — Sem Convocatória:**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Sombra suave.
Padding `16px`. Borda esquerda `4px #1D4ED8`.

Layout:
- **Linha 1:** Badge pill `JOGO FUTURO` (Info/Azul, ícone `Calendar`) +
  data+hora à direita (13px Bold `#1D4ED8`).
- **Linha 2:** Adversário (Bold 16px, `#0F172A`).
- **Linha 3:** `"[Quadro] · [Local] · [Casa / Fora / Neutro]"` (12px, Gray 500).
- **Linha 4:** `"Convocatória: Não criada"` (12px, `#991B1B`, ícone `XCircle`).
- Ícone `ChevronRight` (16px, Gray 200) à direita.

---

**Cartão de Jogo Futuro — Convocatória em Rascunho:**
Borda esquerda `4px #B45309`.

- Linha 4: `"Convocatória: Rascunho"` (12px, `#B45309`, ícone `Clock`).

---

**Cartão de Jogo Futuro — Convocatória Publicada:**
Borda esquerda `4px #047857`.

- Linha 4: `"Convocatória: Publicada · [N] convocados"` (12px, `#047857`,
  ícone `CheckCircle`).

---

**Cartão de Jogo Passado — Ficha Pendente:**
Fundo `#FFFFFF`. Borda `1px #991B1B`. Corner radius `12px`. Sombra suave.
Padding `16px`. Borda esquerda `4px #991B1B`.

- Linha 4: Badge pill `FICHA PENDENTE` (Vermelho) + countdown (ex:
  `"Expira em 4h 12m"`). Cor do countdown: regras do Card Tipo C da TAB 1.

---

**Cartão de Jogo Passado — Ficha Submetida:**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Borda esquerda `4px #64748B`.
Opacidade `0.85`.

- Linha 4: `"Ficha submetida"` (12px, Gray 500, ícone `CheckCircle`).

---

**Cartão de Jogo Passado — Prazo Expirado sem Ficha:**
Fundo `#F8FAFC`. Borda `1px #E2E8F0`. Borda esquerda `4px #E2E8F0`.
Opacidade `0.6`.

- Linha 4: `"Prazo expirado — ficha não submetida"` (12px, `#991B1B`,
  ícone `Ban`).
- Sem botão de ação.

**Empty State (sem jogos agendados):**
- Ícone Lucide `CalendarX` centrado (64px, opacidade 10%, Gray 200).
- Título: `"Sem jogos agendados"` (16px, Gray 500).
- Sub-título: `"Os jogos são agendados pela Direção Técnica."` (13px, Gray 500).

---

### Ecrã "Detalhe do Jogo" (Push Navigation — full screen)

*(Abre ao tocar num cartão de jogo em TAB 3)*

**Top App Bar:**
- Esquerda: `ChevronLeft` → volta à lista de Jogos.
- Centro: `"Detalhe do Jogo"` (16px, SemiBold).

**Conteúdo (scroll vertical):**

**Bloco de Informação do Jogo** (read-only — agendado pela Direção Técnica):
Cartão fundo `#EFF6FF`. Borda `1px #1D4ED8`. Corner radius `12px`.
Padding `16px`.
- Adversário (Bold 20px, `#0F172A`).
- Data e Hora (14px, `#1D4ED8`). Ex: `Sábado, 14 Jun 2026 · 15:00`.
- Local (13px, Gray 500). Ex: `Campo Municipal · Fora`.
- Quadro Competitivo (13px, Gray 500). Ex: `Liga Regional`.

**Área de Ação (fixo no fundo do ecrã, acima da Bottom Navigation):**
Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Padding `12px 16px`.

*Botões contextuais por estado:*

- **Jogo futuro, sem convocatória:**
  Botão Full-width Dourado: `"Criar Convocatória"` (ícone `Users`, height 52px).

- **Jogo futuro, rascunho:**
  Dois botões em linha (50%/50%):
  - Botão Outline `"Descartar"` (borda `1px #991B1B`, texto `#991B1B`, height 48px).
  - Botão Dourado `"Continuar Rascunho"` (height 48px).

- **Jogo futuro, convocatória publicada:**
  Botão Full-width Outline `"Ver Convocatória"` (read-only, height 48px).

- **Jogo passado, ficha pendente dentro da janela:**
  Botão Full-width fundo `#991B1B` texto `#FFFFFF` SemiBold:
  `"Preencher Ficha de Jogo"` (ícone `ClipboardList`, height 52px).

- **Jogo passado, ficha submetida:**
  Botão Full-width Outline `"Ver Resumo do Jogo"` (read-only, height 48px).

- **Jogo passado, prazo expirado:**
  Botão Full-width desativado, fundo `#F1F5F9`, texto Gray 200:
  `"Prazo de Submissão Expirado"` (height 48px).
  Texto auxiliar abaixo (11px, Gray 500, centrado):
  `"A Direção Técnica foi notificada automaticamente."`

---

## FLOW A — Lista de Chamada (Full Screen)

*(Acionado via `"Iniciar Chamada"` ou `"Continuar Chamada"` no Tab Hoje)*

### Top App Bar
- Esquerda: `ChevronLeft`.
- Centro: `"Chamada — [Hora]"` (16px, SemiBold).
- Direita: Ícone `CheckSquare` (24px, `#F1C40F`) — botão `"Todos Presentes"`.
  Ao tocar: todos os atletas elegíveis (não inaptos e sem justificação prévia)
  transitam para estado `Presente` com animação slide verde em cascata.

### Contador de Progresso (sticky, abaixo da Top App Bar)

Fundo `#FFFFFF`. Borda inferior `1px #E2E8F0`. Padding `10px 16px`.
Quatro métricas em linha (25% cada):

- `PRESENTES` + valor (Bold 16px, `#047857`).
- `ATRASADOS` + valor (Bold 16px, `#B45309`).
- `AUSENTES` + valor (Bold 16px, `#991B1B`).
- `POR MARCAR` + valor (Bold 16px, `#0F172A` — muda para `#991B1B` quando > 0).

---

### Lista de Chamada (scroll vertical)

Um cartão por atleta. Gap: `8px`.

---

**Cartão de Atleta Apto — Sem Estado Atribuído:**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.
Height mínima `80px`.

Layout:
- **Coluna esquerda** (flex 1):
  - Avatar 40px + Nome (Bold 14px, `#0F172A`) na mesma linha.
  - `"[Posição]"` + Badge Semáforo (compacto, 11px) na linha abaixo.
- **Coluna direita** (3 chips de estado lado a lado):
  Cada chip: 44×44px mínimo, corner radius `8px`.

  | Chip | Fundo Inativo | Fundo Ativo | Ícone | Label |
  |---|---|---|---|---|
  | Presente | `#F1F5F9` | `#ECFDF5` | `Check` | `P` |
  | Atrasado | `#F1F5F9` | `#FFFBEB` | `Clock` | `A` |
  | Ausente | `#F1F5F9` | `#FEE2E2` | `X` | `F` |

  Cor do ícone/borda no estado ativo: `#047857` / `#B45309` / `#991B1B`.
  Borda `1px` sólida no estado ativo com a mesma cor do ícone.

**Swipe Gestural:**
- Swipe direita (velocidade > 200px/s): transição direta para `Presente`
  + feedback háptico (vibração curta) + flash verde de 200ms sobre o cartão.
- Swipe esquerda: transição para `Ausente` + flash vermelho de 200ms.
- Ao atingir o estado via swipe, os chips atualizam visualmente em tempo real.

---

**Cartão de Atleta — Estado Atribuído:**
Fundo levemente colorido:
- Presente: fundo `#ECFDF5`, borda `1px #047857`.
- Atrasado: fundo `#FFFBEB`, borda `1px #B45309`.
- Ausente: fundo `#FEE2E2`, borda `1px #991B1B`.
Chip correspondente fica com borda sólida ativa.

---

**Cartão de Atleta — Justificação de Ausência Prévia (RF-02):**
Fundo `#F1F5F9`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.

- Nome + posição (como normal).
- Badge pill `Ausente Justificado` (fundo `#EFF6FF`, texto `#1D4ED8`,
  ícone Lucide `Lock` 12px).
- Botão Outline pequeno `"Ver motivo"` (12px, borda `1px #1D4ED8`, texto
  `#1D4ED8`, corner radius `8px`, padding `4px 10px`).
- Os três chips de estado ficam **desativados** (fundo `#F8FAFC`, ícones
  Gray 200, cursor bloqueado).

Ao tocar em `"Ver motivo"` → **Bottom Sheet "Justificação de Ausência"**:
- Handle visual (barra cinzenta 32×4px centrada, corner radius `2px`, fundo
  `#E2E8F0`).
- Título: `"Justificação de Ausência"` (16px, SemiBold).
- `"Submetida por: [Nome EE]"` (12px, Gray 500).
- `"Data de submissão: [DD/MM/AAAA HH:MM]"` (12px, Gray 500).
- Texto do motivo (14px, `#0F172A`, itálico, fundo `#F8FAFC`, borda
  `1px #E2E8F0`, corner radius `8px`, padding `12px`).
- Botão Full-width Outline `"Fechar"` (height 48px).

---

**Cartão de Atleta — INAPTO (Clínico ou Documental):**
Fundo `#F8FAFC`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.
Opacidade `0.6`.

- Nome + posição (opacidade herdada).
- Badge Semáforo `INAPTO — [causa]` (Vermelho ou Ambar-escuro).
- Texto adicional: `"Não pode ser registado nesta sessão"` (11px, Gray 500,
  itálico).
- Os três chips: completamente desativados (fundo `#F1F5F9`, ícones Gray 200,
  não clicáveis).

---

### Rodapé Fixo — Botão "Avançar para Avaliação"

Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Padding `12px 16px`.

**Estado Desativado** (enquanto `Por marcar > 0`):
- Fundo `#F1F5F9`, texto Gray 200 SemiBold: `"Avançar para Avaliação"`.
- Texto auxiliar abaixo (11px, Gray 500, centrado):
  `"Atribua estado a [N] atleta(s) em falta para continuar"`
- Height 52px. Corner radius `12px`.

**Estado Ativo** (quando `Por marcar = 0`):
- Fundo `#F1C40F`, texto `#000000` SemiBold: `"Avançar para Avaliação"`.
- Ícone Lucide `ChevronRight` (18px, `#000000`) à direita.
- Height 52px. Corner radius `12px`.
- **Ação:** Ao clicar, o fluxo avança sem interrupções para o FLOW B (Avaliação).

---

## FLOW B — Avaliação de Rendimento Pós-Sessão (Full Screen)

*(Acionado via `"Avançar para Avaliação"` do Flow A, ou retomado via `"Avaliar Sessão"` no Card Tipo A, Tab Hoje)*

### Top App Bar
- Esquerda: `ChevronLeft` (Volta para o ecrã anterior).
- Centro: `"Avaliação — [Data]"` (16px, SemiBold).
- Direita: Contador regressivo compacto:
  - > 6h: `"[Xh Ym]"` (12px, `#047857`).
  - 1h–6h: `"[Xh Ym]"` (12px, `#B45309`).
  - < 1h: `"[Xm]"` (12px, `#991B1B` Bold).

### Banner de Contexto (sticky, abaixo da Top App Bar)

Fundo `#EFF6FF`. Borda `1px #1D4ED8`. Corner radius `0` (largura total).
Padding `8px 16px`.
`"Apenas atletas presentes na chamada · Escala: [mín]–[máx], incremento [x]"`
(12px, `#1D4ED8`).

### Lista de Avaliação

Um cartão por atleta (apenas os com presença validada ou atraso na chamada).
Scroll vertical. Gap `8px`.

**Cartão de Avaliação:**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `16px`.

Layout (topo para baixo):
- **Linha 1:** Avatar 36px + Nome (Bold 14px, `#0F172A`) + posição (12px,
  Gray 500) na mesma linha.
- **Controlo Stepper de Avaliação:** Layout em linha, alinhado à esquerda:
  - Botão circular `[ - ]` (Outline, 44×44px, borda `1px #E2E8F0`, texto/ícone `#0F172A`).
  - Valor central (Bold 18px, `#0F172A`, min-width 48px, texto centrado). Ex: `3.0`.
  - Botão circular `[ + ]` (Outline, 44×44px, borda `1px #E2E8F0`, texto/ícone `#0F172A`).
  - *Regras do Stepper:* Começa em `3.0`. Limites de `0.0` a `5.0`. Incrementos de `0.5`.
  - Botão de texto à direita: `"Limpar nota"` (12px, Gray 500, sublinhado).
- **Estado "Sem nota":** se `"Limpar nota"` for clicado, o stepper fica inativo/desbotado e o valor central exibe `"—"`. Aparece um subtexto (11px, Gray 500, itálico): `"Será registado como Não Avaliado"`.

**Comportamento Read-Only após janela de 24h:**
- Banner ambar no topo do ecrã (fundo `#FFFBEB`, borda `1px #B45309`,
  padding `10px 16px`):
  `"Janela de avaliação expirada — registo em modo de leitura"`
  (13px, `#B45309`, ícone `Lock` 14px).
- Todos os controlos do stepper ficam desativados, substituídos por texto estático:
  `"Avaliação: [X.X]"` ou `"Não Avaliado"` (14px, Gray 500).

### Rodapé Fixo

Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Padding `12px 16px`.

Botão Full-width Dourado: `"Submeter Sessão Completa"` (height 52px, ícone
`Check` 18px, corner radius `12px`).
Texto auxiliar abaixo (11px, Gray 500, centrado):
`"Atletas sem nota serão registados como 'Não Avaliado'"`

**Modal de Confirmação** (Bottom Sheet):
Handle visual + título `"Confirmar Submissão"` (16px, SemiBold).
`"A chamada e as avaliações ficarão registadas de forma definitiva. [N] atletas avaliados · [X] sem nota."` (14px, Gray 500).
Dois botões em linha: `"Cancelar"` (Outline, 50%) · `"Submeter"` (Dourado, 50%).

**Após submissão final:**
- Toast no topo da Content Area (fundo `#ECFDF5`, borda `1px #047857`,
  corner radius `8px`, padding `10px 14px`, ícone `CheckCircle` Verde):
  `"Sessão submetida com sucesso"`
- Navega automaticamente de volta ao ecrã Hoje após 1.5 segundos.

---

## FLOW C — Convocatória (Multi-Ecrã)

### Ecrã C.1 — Selecionar Convocados (Full Screen)

**Top App Bar:**
- Esquerda: `ChevronLeft` → cancela e volta ao Detalhe do Jogo.
- Centro: `"Convocatória"` (16px, SemiBold).

**Barra de Contexto do Jogo** (sticky, abaixo da Top App Bar):
Fundo `#EFF6FF`. Borda inferior `1px #1D4ED8`. Padding `8px 16px`.
`"[Adversário] · [Dia da Semana] [HH:MM]"` (13px Bold, `#1D4ED8`).

**Contador e Ordenação** (abaixo da barra de contexto):
Linha horizontal: Contador `"[N] / [Teto] selecionados"` (14px, Bold,
`#0F172A`) à esquerda. Ao atingir o teto: cor muda para `#B45309` e texto:
`"Limite atingido"`.
Pills de ordenação à direita (scroll horizontal):
- `"Por Avaliação"` · `"Por Posição"` · `"Alfabético"`
- Ativa: fundo `#0F172A`, texto `#FFFFFF` SemiBold, corner radius `16px`,
  padding `6px 12px`.

---

**Cartão de Atleta Elegível (não selecionado):**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.

Layout:
- Checkbox círculo (24px) à esquerda — vazio, borda `1px #E2E8F0`.
- Avatar 40px + coluna de texto (flex 1):
  - Nome (Bold 14px).
  - Posição + Badge Semáforo + métricas compactas:
    `"Méd: [X.X] · Assiduidade: [XX]%"` (11px, Gray 500).
    Se dados insuficientes: `"Dados insuficientes"` (11px, Gray 500, itálico).

**Cartão de Atleta Selecionado:**
Fundo `#FFFBEB`. Borda `1px #F1C40F`. Corner radius `12px`.
Checkbox: círculo sólido `#F1C40F` com ícone `Check` `#000000` (16px).

**Cartão de Atleta Condicionado (selecionável):**
Badge `Condicionado` (Ambar). Botão inline pequeno:
`"Ver restrições"` (10px, borda `1px #B45309`, texto `#B45309`, corner
radius `6px`, padding `3px 8px`).
Ao tocar → **Bottom Sheet "Restrições Clínicas Mascaradas"**:
- Handle + Título `"Restrições para este jogo"` (16px, SemiBold).
- Nome do atleta (14px, Gray 500).
- Texto das restrições (14px, `#0F172A`): `"[Diretrizes táticas não-patológicas
  fornecidas pelo Médico]"` — zero menção a diagnóstico (RF-23).
- `"Reavaliação: [DD/MM/AAAA]"` (12px, Gray 500).
- Botão Full-width Outline `"Fechar"` (height 48px).

**Cartão de Atleta Bloqueado (não selecionável):**
Fundo `#F8FAFC`. Opacidade `0.6`. Borda `1px #E2E8F0`.
- Checkbox: círculo com ícone `Ban` Gray 200 (não interativo).
- Badge de causa: `"Sem EMD válido"` (Vermelho) ou `"Bloqueado: Documental"`.
- Cursor `not-allowed`.

**Rodapé Fixo:**
Botão Full-width Dourado: `"Confirmar Seleção"` (height 52px, ícone
`ChevronRight`). Desativado se N = 0.

---

### Ecrã C.2 — Bottom Sheet de Logística

*(Abre ao confirmar a seleção de convocados)*

**Bottom Sheet** (desliza de baixo, 55% do ecrã, corners superiores `16px`):
- Handle visual (topo).
- Título: `"Detalhes Logísticos"` (18px, SemiBold).
- Subtítulo: `"[Adversário] · [Dia] [HH:MM]"` (13px, Gray 500).

**Campos:**

Campo 1 — `Input de Texto` **"Local de Concentração"** *(obrigatório)*:
- Label: `Local de Concentração *` (12px, Gray 500).
- Placeholder: `"ex: Balneários do Campo 1"`.
- Borda `1px #E2E8F0`, corner radius `8px`, fundo `#FFFFFF`, height 48px.
- Focus: borda `#F1C40F`.

Campo 2 — **"Hora de Concentração"** *(obrigatório)*:
- Label: `Hora de Concentração *` (12px, Gray 500).
- Time picker nativo (HH:MM, formato 24h). Height 48px.
- Validação: hora de concentração deve ser **anterior** à hora do jogo.
  Erro inline (11px, `#DC2626`): `"Deve ser anterior às [HH:MM] (hora do jogo)."`

**Dois botões em linha** (50%/50%):
- `"Guardar Rascunho"` (Outline, height 52px, corner radius `12px`).
- `"Publicar Convocatória"` (Dourado, height 52px, corner radius `12px`).

**Modal de Confirmação de Publicação:**
Bottom Sheet adicional (30% do ecrã):
- `"Após publicar, a convocatória fica bloqueada e os EE são notificados
  automaticamente."` (14px, Gray 500).
- Dois botões: `"Cancelar"` (Outline, 50%) · `"Publicar"` (Dourado, 50%).

**Toast de sucesso pós-publicação** (topo da Content Area, desliza de cima):
Fundo `#ECFDF5`, borda `1px #047857`, corner radius `8px`, padding `12px 16px`.
Ícone `Send` (Verde) + `"Convocatória publicada — [N] famílias notificadas"` (14px, `#047857`).
Duração: 4 segundos.

---

## FLOW D — Ficha de Jogo (Multi-Step — Push Navigation)

### Barra de Progresso Global (sticky abaixo da Top App Bar)

Visível durante todo o flow. Fundo `#FFFFFF`. Borda inferior `1px #E2E8F0`.
Padding `8px 16px`.

Três segmentos em linha com textos:
`1 XI Inicial` · linha `—` · `2 Eventos` · linha `—` · `3 Rever`

- Passo ativo: texto Bold `#0F172A`, linha à direita em `#F1C40F`.
- Passo concluído: texto `#047857`, ícone `Check` 12px à esquerda.
- Passo futuro: texto Gray 200.

**Auto-save Indicator:** `"Guardado — [HH:MM]"` (11px, Gray 500, itálico,
extremo direito da barra de progresso).

---

### Step 1 — Definir XI Inicial

**Top App Bar:**
- Esquerda: `ChevronLeft` → confirmação antes de sair (`"Guardar rascunho antes de sair?"`).
- Centro: `"XI Inicial"`.

**Instrução:** `"Selecione os [teto] titulares"` (14px, Gray 500, padding `12px 16px`).

**Lista de atletas convocados** (scroll vertical):

Cartão de Atleta Convocado:
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.
- Checkbox à esquerda (44×44px).
- Avatar 40px + coluna de texto (flex 1):
  - Nome (Bold 14px, `#0F172A`).
  - Posição + Badge Semáforo + métricas compactas: `"Méd: [X.X] · Assiduidade: [XX]%"` (11px, Gray 500).
- Ao atingir o teto de titulares: checkboxes dos não selecionados ficam desativadas. Banner topo: `"[Teto] titulares selecionados — restantes são suplentes"` (12px, fundo `#ECFDF5`, texto `#047857`).

Suplentes (separador visual `"SUPLENTES"` 11px UPPERCASE Gray 500 entre as secções): listados automaticamente após seleção dos titulares, sem checkbox.

**Rodapé Fixo:**
Botão Full-width Dourado: `"Confirmar XI"` (height 52px). Desativado se nenhum titular selecionado.

---

### Step 2 — Registar Eventos

**Top App Bar:** Centro: `"Eventos do Jogo"`.

**Placard em tempo real** (sticky, abaixo da Top App Bar):
Fundo `#0F172A`. Padding `12px 16px`. Corner radius `0`.
- `"[Nome Curto Equipa]"` (Bold 18px, `#FFFFFF`) à esquerda.
- Resultado `"[G] — [G]"` (Bold 24px, `#F1C40F`) ao centro.
- `"[Adversário]"` (Bold 18px, `#FFFFFF`) à direita.

**Lista de Atletas com Minutos** (scroll vertical):

Cartão de Atleta em campo:
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `8px`. Padding `12px`.

Layout:
- Nome (Bold 13px, `#0F172A`).
- Barra de progresso de minutos (fundo `#E2E8F0`, preenchimento `#047857`,
  corner radius `4px`, height `6px`).
- `"[N] min"` à direita (12px, Bold, `#0F172A` se em campo; Gray 500 se
  suplente não utilizado).
- Badge: `"Titular"` (Verde compacto) ou `"Entrou min [X]"` (Azul compacto)
  ou `"Suplente"` (Neutro).

**Lista de Eventos Registados** (abaixo dos atletas, scroll integrado):

Separador: `"EVENTOS REGISTADOS"` (11px, UPPERCASE, Gray 500).

Cada evento:
Cartão horizontal compacto: fundo `#F8FAFC`, borda `1px #E2E8F0`,
corner radius `8px`, padding `10px 12px`.
- Ícone do tipo (16px) à esquerda.
- Tipo + Atleta + Minuto (13px, `#0F172A`).
- Botão `"Remover"` (ícone `Trash2` 14px, `#991B1B`) à direita.

Tipos de evento e ícones:
| Tipo | Ícone Lucide | Cor Ícone |
|---|---|---|
| Golo | `Target` | `#047857` |
| Substituição | `ArrowLeftRight` | `#1D4ED8` |
| Cartão Amarelo | `Square` (preenchido amarelo) | `#B45309` |
| Cartão Vermelho | `Square` (preenchido vermelho) | `#991B1B` |

---

**FAB (+) — Adicionar Evento:**
Botão circular fixo, fundo `#F1C40F`, ícone `Plus` `#000000` (24px), 56×56px.
Posição: `fixed bottom-[80px] right-[16px]` (acima do botão de rodapé).
Sombra forte.

Ao tocar → **Bottom Sheet "Tipo de Evento"**:
Handle + título `"Novo Evento"` (16px, SemiBold).
Quatro botões grandes em grelha 2×2:
┌──────────────────┬──────────────────┐
│     [Target]     │ [ArrowLeftRight]  │
│      GOLO        │   SUBSTITUIÇÃO    │
├──────────────────┼──────────────────┤
│    [Square]      │    [Square]       │
│  CARTÃO AMAREL   │  CARTÃO VERMELHO  │
└──────────────────┴──────────────────┘

Cada botão: height 72px, corner radius `12px`, ícone 28px, label 13px
SemiBold. Fundo:
- Golo: fundo `#ECFDF5`, ícone+texto `#047857`.
- Substituição: fundo `#EFF6FF`, ícone+texto `#1D4ED8`.
- Cartão Amarelo: fundo `#FFFBEB`, ícone+texto `#B45309`.
- Cartão Vermelho: fundo `#FEE2E2`, ícone+texto `#991B1B`.

---

**Bottom Sheet "Registar Golo"** (após tocar em Golo):
Handle + título `"Registar Golo"` (16px, SemiBold).

1. `"Quem marcou?"` — lista de atletas em campo (scroll, cartões compactos
   com avatar + nome + posição, tap para selecionar; selecionado: fundo
   `#FFFBEB` borda `#F1C40F`).
2. `"Minuto"` — teclado numérico nativo. Input compacto (height 48px,
   texto central, 20px Bold). Label: `"Minuto do Golo (0–90+)"`.
   Placeholder: `"--"`.
3. Botão Full-width Dourado: `"Confirmar Golo"` (height 52px).

Total de interações: tipo → jogador → minuto → confirmar = **4 interações** (RNF-17 ≤ 5). ✅

---

**Bottom Sheet "Registar Substituição"**:
Handle + título `"Registar Substituição"` (16px, SemiBold).

1. `"Sai do campo:"` — lista de atletas em campo (avatar + nome + minutos
   atuais).
2. `"Entra em campo:"` — lista de suplentes (avatar + nome).
3. `"Minuto"` — input numérico.
4. Botão Full-width Dourado: `"Confirmar Substituição"` (height 52px).

Após confirmar: o sistema recalcula automaticamente os minutos de todos os
atletas afetados. A barra de progresso de minutos atualiza em tempo real.
Toast: `"Substituição registada — minutos recalculados"` (Verde, 2 segundos).

---

**Rodapé Fixo (Step 2):**
Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Padding `12px 16px`.
Dois botões em linha (40%/60%):
- `"Guardar Rascunho"` (Outline, height 48px).
- `"Continuar para Revisão"` (Dourado, height 48px, ícone `ChevronRight`).

---

### Step 3 — Rever e Submeter

**Top App Bar:** Centro: `"Revisão Final"`.

**Bloco de Resultado:**
Fundo `#0F172A`. Padding `16px`. Corner radius `12px`. Margem `16px`.
- `"[Equipa] [G] — [G] [Adversário]"` (Bold 20px, `#FFFFFF`, centrado).

**Lista de Atletas com Resumo Final:**

Cartão por atleta: fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `8px`,
padding `12px 16px`.

- Nome (Bold 14px) + badge de papel (Titular / Suplente Utilizado / Não Utilizado).
- `"[N] minutos"` (13px, Gray 500).
- Eventos do atleta em linha de ícones compactos (16px cada):
  - `Target` Verde por cada golo.
  - `Square` Amarelo por cada cartão amarelo.
  - `Square` Vermelho por cartão vermelho.
  - `ArrowLeftRight` Azul por substituição.

**Banners de Erro de Integridade** (se existirem — aparecem acima da lista):
Fundo `#FEE2E2`. Borda `1px #991B1B`. Corner radius `8px`. Padding `12px`.
Ícone `AlertCircle` `#991B1B` + texto do erro (13px, `#991B1B`).
Ex: `"Substituição a 120 minutos: valor fora do intervalo permitido (0–90+)."`

**Rodapé Fixo:**
Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Padding `12px 16px`.
- Se sem erros: Botão Full-width fundo `#047857`, texto `#FFFFFF` SemiBold:
  `"Submeter Ficha Definitiva"` (height 52px, ícone `Send` 18px).
- Se com erros: Botão Full-width fundo `#F1F5F9`, texto Gray 200 (desativado):
  `"Corrija os erros para submeter"` (height 52px).

**Bottom Sheet de Confirmação Final:**
Handle + título `"Confirmar Submissão"` (16px, SemiBold, cor `#991B1B`).
`"Após submissão, a ficha fica permanentemente bloqueada e não pode ser editada."` (14px, Gray 500).
Dois botões: `"Cancelar"` (Outline, 50%) · `"Submeter"` (fundo `#991B1B`,
texto `#FFFFFF` SemiBold, 50%).

**Toast de sucesso pós-submissão:**
Fundo `#ECFDF5`, borda `1px #047857`, ícone `CheckCircle` Verde.
`"Ficha de Jogo submetida com sucesso."` (14px, `#047857`).
Dura 3 segundos. A app navega automaticamente para TAB 3 (Jogos) após o toast.

---

## TAB 4 — EU

**Top App Bar:** Centro: `"Perfil"`.

**Conteúdo (scroll vertical):**

**Secção de Identificação:**
Cartão fundo `#FFFFFF`, corner radius `16px`, padding `20px`, centrado:
- Avatar circular 72px.
- Nome completo (Bold 18px, `#0F172A`, centrado).
- `"Treinador"` (14px, Gray 500, centrado).
- Equipa(s) atribuída(s): pills horizontais centradas (fundo `#0F172A`,
  texto `#F1C40F`, corner radius `16px`, padding `4px 12px`). Read-only.

**Secção "Preferências":**
Título `"PREFERÊNCIAS"` (11px, UPPERCASE, Gray 500, padding `16px 16px 8px`).

- **Toggle "Modo Alto Contraste (Dia)":**
  Cartão fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `12px`,
  padding `16px`. Layout em linha: Texto `"Modo Alto Contraste"` (14px,
  `#0F172A`) + subtexto abaixo `"Aumenta o contraste para leitura ao sol"`
  (12px, Gray 500). Toggle switch à direita (ativo: `#F1C40F`; inativo: Gray 200).

  **Ao ativar "Modo Alto Contraste":**
  - Fundo dos cartões muda de `#FFFFFF` para `#FFFFFF` (mantém).
  - Fundo da Content Area muda de `#F8FAFC` para `#FFFFFF`.
  - Texto base muda de `#0F172A` para `#000000`.
  - Badges recebem borda `2px` sólida (em vez de `1px`).
  - Shadows aumentam para Sombra Média em todos os cartões.
  - Bottom Navigation: texto e ícones inativos mudam de Gray 500 para `#000000`.

- **Toggle "Guardar Automaticamente":**
  Texto `"Auto-save"` + subtexto `"Guarda rascunhos a cada 30 segundos"`.
  Toggle (ativo por defeito).

**Secção "Informações":**
Título `"SOBRE"` (11px, UPPERCASE, Gray 500, padding `16px 16px 8px`).
- `"Versão da App"` + `"[versão]"` (14px + 14px Gray 500, linha).
- `"Equipa(s) Atribuída(s)"` + lista em Gray 500 (read-only).

**Botão "Terminar Sessão" (no fundo, com espaçamento):**
Fundo `#FEE2E2`. Texto `#991B1B` SemiBold. Borda `1px #991B1B`.
Ícone Lucide `LogOut` (18px, `#991B1B`) à esquerda.
Width: 100%. Height: 52px. Corner radius `12px`. Margem superior `32px`.

**Bottom Sheet de Confirmação de Logout:**
Handle + título `"Terminar Sessão?"` (16px, SemiBold).
`"Terá de fazer login novamente para aceder à app."` (14px, Gray 500).
Dois botões: `"Cancelar"` (Outline, 50%) · `"Terminar Sessão"` (fundo
`#FEE2E2`, texto `#991B1B` SemiBold, 50%).