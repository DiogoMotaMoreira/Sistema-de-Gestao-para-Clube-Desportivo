# Módulo: Departamento Desportivo (Perfil: `ROLE_DIRETOR_TECNICO`)

**Visão Geral:** O motor operacional desportivo do clube. O Diretor Técnico
define a hierarquia do clube (modalidades, escalões, equipas com matrizes
financeiras), gere o espaço-tempo desportivo (calendário de treinos e jogos),
supervisiona os plantéis e analisa o rendimento desportivo e administrativo
através de dashboards de Business Intelligence. As suas ações têm impacto
direto no RBAC — alocar um treinador a uma equipa concede-lhe acesso automático
aos módulos operacionais dessa equipa (RF-07).

**Página Inicial (Landing Page):** `ABA 1 — Calendário Global`

---

## Barra de Navegação Principal (sempre visível no topo do módulo)

Quatro abas fixas:
`Calendário Global` | `Gestão de Plantéis` | `Quadros Competitivos` |
`Análise e Rendimento`

---

## Especificação do Semáforo de Elegibilidade (componente reutilizável)

Usado nas tabelas de plantel e nos cartões de equipa. Quatro estados:

| Estado | Fundo | Texto/Ícone | Ícone Lucide | Texto do Badge |
|---|---|---|---|---|
| **APTO** | `#ECFDF5` | `#047857` | `CheckCircle` | `Apto` |
| **CONDICIONADO** | `#FFFBEB` | `#B45309` | `AlertTriangle` | `Condicionado` |
| **INAPTO — Clínico** | `#FEE2E2` | `#991B1B` | `XCircle` | `Inapto — Clínico` |
| **INAPTO — Documental** | `#FEF3C7` | `#92400E` | `Clock` | `Inapto — Documental` |

> **Nota RBAC:** O Diretor Técnico vê apenas o semáforo mascarado (RF-16 /
> RF-23). **Não vê** diagnósticos, patologias, NIF, morada nem dados
> financeiros individuais do atleta.

---

## ABA 1: Calendário Global

**Objetivo:** Agendamento e visualização de todos os eventos desportivos
(treinos, jogos oficiais, manutenção de infraestruturas) com suporte a
microciclos em lote e validação sistémica de conflitos.

---

### Barra de Stats (topo da Content Area)

Cartão branco (`#FFFFFF`, borda `1px #E2E8F0`, corner radius `12px`,
padding `12px 16px`). Três métricas separadas por divisores `1px #E2E8F0`:

- `ESTE MÊS — TREINOS` — valor ex. `8` (Bold 20px, `#047857`)
- `ESTE MÊS — JOGOS` — valor ex. `3` (Bold 20px, `#1D4ED8`)
- `PENDÊNCIAS` — valor ex. `1` (Bold 20px, `#991B1B` se > 0, `#0F172A` se = 0).
  Quando > 0: link clicável `→ Ver Incumprimentos` (12px, `#1D4ED8`, ícone
  Lucide `ExternalLink`) que navega diretamente para o sub-ecrã de Auditoria
  da ABA 4.

---

### Grelha de Calendário

**Barra de Controlos (acima da grelha, dentro da Content Area):**

- Setas de navegação: `←` (ícone Lucide `ChevronLeft`, Outline 36px) ·
  `Maio 2026` (Bold, 18px, `#0F172A`) · `→` (ícone Lucide `ChevronRight`,
  Outline 36px).
- Toggle `Mensal / Semanal`:
  - Ativo: fundo `#F1C40F`, texto `#000000` SemiBold, sem borda.
  - Inativo: fundo transparente, borda `1px #E2E8F0`, texto `#0F172A`.
- Dropdown `Equipa: Ver Todas` — Placeholder: `"Ver Todas"`. Opções:
  `Ver Todas` *(defeito)* · lista de equipas ativas (gerada dinamicamente).
- Botão Dourado (extremo direito): `+ Agendar Evento` (ícone Lucide `Plus`) →
  abre o **Slide-over "Agendar Novo Evento"**.

---

**Especificação dos Blocos de Evento no Calendário:**

| Tipo | Fundo | Texto | Borda Esquerda | Exemplo de Label |
|---|---|---|---|---|
| **Treino** | `#ECFDF5` | `#047857` | `3px #047857` | `09:00 · Sub-15 A · Campo A` |
| **Jogo Oficial** | `#EFF6FF` | `#1D4ED8` | `3px #1D4ED8` | `16:00 · Sub-17 · vs FC Porto` |
| **Manutenção / Infraestrutura** | `#FFFBEB` | `#B45309` | `3px #B45309` | `Campo B — Manutenção` |

Especificação visual de cada bloco:
- Corner radius: `6px`. Padding: `4px 8px`. Largura: `100%` da célula do dia.
- Texto do label: 12px, SemiBold, cor conforme tabela.
- Hover: sombra média (Y=4, Blur=6, opacidade 5%). Cursor `pointer`.
- Ao clicar num bloco de Jogo Oficial → abre **Modal "Detalhe de Evento —
  Jogo Oficial"**. Ao clicar num bloco de Treino → abre **Modal "Detalhe de
  Evento — Treino"** (read-only com dados básicos).
- Ao clicar numa célula de dia **vazia** → abre o Slide-over com a data
  pré-preenchida no campo correspondente.

**Indicadores visuais sobrepostos nos blocos:**

- **Ponto vermelho de pendência** (ficha de jogo em falta — RF-11):
  Círculo sólido 8px, cor `#991B1B`, posicionado no canto superior direito
  do bloco. Tooltip ao hover (cartão fundo `#0F172A`, texto branco, 12px):
  `"Ficha de jogo em falta · Prazo expirado"`

- **Badge "Sem convocatória"** (jogo a menos de 72h sem convocatória
  publicada — sugestão mundo real):
  Badge pill horizontal `"Sem convocatória"`, fundo `#FFFBEB`, texto
  `#B45309` (10px, SemiBold), ícone Lucide `Clock` (10px) à esquerda.
  Posicionado abaixo da label do evento. Tooltip: `"Este jogo não tem
  convocatória publicada. Treinador: [Nome]."`

---

### Slide-over "Agendar Novo Evento"

**Anatomia do Slide-over:**
- Painel lateral que desliza da direita (`transform: translateX`).
- Largura: `480px` (desktop) · `100vw` (mobile).
- Fundo: `#FFFFFF`. Sombra forte (Y=10, Blur=15, opacidade 10%).
- Backdrop escuro (`#000000` a 30% opacidade) por trás do painel —
  clicar no backdrop fecha o slide-over sem guardar.
- Mantém a grelha de calendário visível em fundo (apenas parcialmente escurecida).

**Estrutura Interna do Slide-over:**

*Cabeçalho (fixo, não faz scroll):*
- Título: `Agendar Novo Evento` (18px, SemiBold, `#0F172A`).
- Botão `✕` (ícone Lucide `X`, Outline, 32px) no canto superior direito →
  fecha sem guardar.
- Tabs de tipo de evento (abaixo do título):
  - `TREINO` | `JOGO OFICIAL`
  - Tab ativa: sublinhado `2px #F1C40F`, texto `#0F172A` SemiBold 14px.
  - Tab inativa: sem sublinhado, texto Gray 500 14px.

*Área de scroll (conteúdo dos campos):*

---

**Tab "TREINO":**

Campo 1 — `Dropdown` **"Equipa"** *(obrigatório)*:
- Label: `Equipa *` (12px, Gray 500).
- Placeholder: `"Selecione a equipa..."`.
- Opções: lista dinâmica de equipas ativas.

Campo 2 — `Dropdown` **"Instalação"** *(obrigatório)*:
- Label: `Instalação *` (12px, Gray 500).
- Placeholder: `"Selecione a instalação..."`.
- Opções: lista de instalações registadas em ABA 2 Tab C.

Campo 3 — `Input de Hora` **"Hora de Início"** *(obrigatório)*:
- Label: `Hora de Início *` (12px, Gray 500).
- Placeholder: `"HH:MM"`. Formato 24h.

Campo 4 — `Input de Hora` **"Hora de Fim"** *(obrigatório)*:
- Label: `Hora de Fim *` (12px, Gray 500).
- Placeholder: `"HH:MM"`.
- Validação: deve ser posterior à Hora de Início. Erro inline (11px, `#991B1B`):
  `"A hora de fim deve ser posterior à hora de início."`

**Toggle "Criar Microciclo (Repetir Semanalmente)":**
- Switch com label `Criar Microciclo (Repetir Semanalmente)` (14px, `#0F172A`).
- Por defeito: desligado (evento único).

**Secção expandida (visível apenas quando o toggle está ativo):**
- Linha divisória `1px #E2E8F0` + label `"Configuração do Microciclo"` (12px,
  UPPERCASE, Gray 500).

  Campo — `Input de Data` **"Data de Início do Padrão"** *(obrigatório)*:
  - Placeholder: `"dd/mm/aaaa"`.

  Campo — `Input de Data` **"Data de Fim do Padrão"** *(obrigatório)*:
  - Placeholder: `"dd/mm/aaaa"`.
  - Validação: deve ser posterior à Data de Início. Erro inline (11px,
    `#991B1B`): `"A data de fim deve ser posterior à data de início."`

  Campo — **"Dias da Semana"** *(obrigatório — pelo menos 1)*:
  - Sete pills clicáveis em linha horizontal:
    `Seg` · `Ter` · `Qua` · `Qui` · `Sex` · `Sáb` · `Dom`
  - Pill selecionado: fundo `#F1C40F`, texto `#000000` SemiBold, corner
    radius `20px`, padding `6px 12px`.
  - Pill não selecionado: fundo transparente, borda `1px #E2E8F0`, texto
    `#0F172A`, corner radius `20px`, padding `6px 12px`.
  - Se nenhum dia selecionado e o utilizador tenta validar: erro inline
    (11px, `#991B1B`): `"Selecione pelo menos um dia da semana."`

---

**Tab "JOGO OFICIAL":**

Campo 1 — `Dropdown` **"Equipa"** *(obrigatório)*:
- Label: `Equipa *` (12px, Gray 500).
- Placeholder: `"Selecione a equipa..."`.

Campo 2 — `Dropdown` **"Quadro Competitivo"** *(obrigatório)*:
- Label: `Quadro Competitivo *` (12px, Gray 500).
- Placeholder: `"Selecione o quadro..."`.
- Opções: lista de quadros registados na ABA 3, filtrada pela equipa selecionada.

Campo 3 — **Toggle de Condição** *(obrigatório — seleção exclusiva)*:
- Três botões em linha:
  - `Casa` · `Fora` · `Neutro`
  - Ativo: fundo `#F1C40F`, texto `#000000` SemiBold, corner radius `8px`.
  - Inativo: fundo `#F1F5F9`, texto Gray 500.

- **Se "Casa" selecionado:** Dropdown `"Instalação"` (obrigatório).
  Label: `Instalação *` (12px, Gray 500).
  Placeholder: `"Selecione a instalação..."`.
  Opções: lista de instalações registadas.

- **Se "Fora" selecionado:** Input de texto `"Local do Jogo"` (obrigatório).
  Label: `Local do Jogo *` (12px, Gray 500).
  Placeholder: `"ex: Estádio do Adversário, Porto"`.

- **Se "Neutro" selecionado:** Input de texto `"Local do Jogo"` (obrigatório).
  Label: `Local Neutro *` (12px, Gray 500).
  Placeholder: `"ex: Estádio Municipal de Braga"`.

Campo 4 — `Autocomplete` **"Adversário"** *(obrigatório)*:
- Label: `Adversário *` (12px, Gray 500).
- Placeholder: `"Digite o nome do adversário..."`.
- Comportamento: debounce ≥ 300ms após ≥ 3 caracteres. Apresenta sugestões
  de adversários já registados em jogos anteriores. Texto livre permitido
  (não é obrigatório selecionar uma sugestão).

Campo 5 — `Input de Data` **"Data do Jogo"** *(obrigatório)*:
- Label: `Data *` (12px, Gray 500).
- Placeholder: `"dd/mm/aaaa"`.
- Validação: data não pode ser retroativa (anterior a hoje).
  Erro inline (11px, `#991B1B`): `"Não é possível registar jogos em datas passadas."`

Campo 6 — `Input de Hora` **"Hora do Jogo"** *(obrigatório)*:
- Label: `Hora *` (12px, Gray 500).
- Placeholder: `"HH:MM"`. Formato 24h.

---

**Área de Preview e Validação (acima do rodapé fixo do slide-over):**
Visível após clicar em **"Validar Planeamento"**.

Linha divisória `1px #E2E8F0` + título `"Resultado da Validação"` (12px,
UPPERCASE, Gray 500).

*Para evento único (treino ou jogo):*
- Sem conflitos: badge Verde `"Sem conflitos detectados"` (ícone `CheckCircle`).
- Com conflito de instalação: banner Vermelho (descrito abaixo).
- Com conflito de corpo técnico: banner Amarelo (descrito abaixo).

*Para Microciclo (treino em lote):*
- Linha Verde (ícone `CheckCircle`, `#047857`): `"[N] sessões a criar"`.
- Linha Ambar (ícone `AlertTriangle`, `#B45309`): `"[X] sessões ignoradas
  por conflito"`. Cada sessão ignorada aparece listada abaixo:
  - `"❌ [dd/mm/aaaa] · [Hora] — [Instalação] já reservada por [Equipa]"`
    (12px, `#991B1B`). Dropdown inline `"Instalação alternativa:"` com
    opções disponíveis (obrigatório resolver antes de confirmar).

*Conflito de corpo técnico (não-bloqueante, aparece como aviso ambar):*
Cartão fundo `#FFFBEB`, borda `1px #B45309`, corner radius `8px`,
padding `12px`:
- Ícone Lucide `AlertTriangle` (`#B45309`, 14px) + texto (14px, `#B45309`):
  `"[Treinador X] indisponível — alocado a [Equipa Y] em [dd/mm · HH:MM]."`
- Dropdown inline `"Designar Substituto (opcional):"` (Placeholder:
  `"Selecione substituto..."`, lista do corpo técnico disponível).
- Pode confirmar sem preencher este campo.

---

*Rodapé fixo do slide-over (não faz scroll):*
- **Estado 1 — antes de validar:** Botão Outline `Validar Planeamento`
  (largura total). Botão Outline `Cancelar` (mais pequeno, à esquerda).
- **Estado 2 — validado sem conflitos bloqueantes:** Botão Dourado
  `Confirmar Agendamento` (largura total). Botão Outline `Editar`
  (volta ao estado 1).
- **Estado 3 — com conflitos bloqueantes não resolvidos:** Botão Dourado
  `Confirmar Agendamento` desativado (fundo `#F1F5F9`, texto Gray 200,
  cursor `not-allowed`). Tooltip: `"Resolva os conflitos de instalação para confirmar."`

**Toast pós-confirmação** (canto inferior direito, 5 segundos):
- Treino único: fundo `#ECFDF5`, borda esquerda `4px #047857`, texto:
  `"Sessão de treino agendada com sucesso."`
- Microciclo: fundo `#ECFDF5`, borda esquerda `4px #047857`, texto:
  `"[N] sessões criadas · [X] ignoradas por conflito."`
- Jogo Oficial: fundo `#EFF6FF`, borda esquerda `4px #1D4ED8`, texto:
  `"Jogo oficial registado. A equipa pode agora publicar convocatória."`

---

### Modal "Detalhe de Evento — Jogo Oficial"

*(Abre ao clicar num bloco azul no calendário)*

- **Cabeçalho:** Fundo `#1D4ED8` (Azul Info sólido), padding `16px 24px`,
  corner radius `12px 12px 0 0`. Texto branco.
  - Linha 1: Adversário (Bold 18px). Ex: `Sub-15 A vs FC Porto B`.
  - Linha 2: Data e Hora (14px). Ex: `Sábado, 17 Mai 2026 · 15:00`.
  - Linha 3: Local (12px, opacidade 80%). Ex: `Estádio João Cardoso — Casa`.
  - Linha 4: Quadro Competitivo (12px, opacidade 80%). Ex: `Campeonato Distrital`.

- **Corpo do Modal:** Fundo `#FFFFFF`, padding `24px`.
  - Linha: `Estado da Convocatória:` + Badge (Verde `Publicada` ou Ambar
    `Sem Convocatória`).
  - Linha: `Estado da Ficha de Jogo:` + Badge (Verde `Submetida`, Ambar
    `Pendente`, Vermelho `Em Falta`).

- **Rodapé:** Dois botões Outline alinhados à direita:
  - `Ver Convocatória` (ícone Lucide `Users`) — abre vista read-only.
  - `Ver Ficha de Jogo` (ícone Lucide `ClipboardList`) — abre vista read-only.
  - *(Nota arquitetural: ambos são read-only — a criação/edição pertence ao Treinador.)*

---

## ABA 2: Gestão de Plantéis

**Objetivo:** Criação e gestão da hierarquia desportiva do clube (Modalidade →
Escalão → Equipa), configuração de matrizes financeiras, alocação de atletas e
corpo técnico, e arquivamento de atletas.

---

### Nível 1 — Grid de Equipas por Modalidade

**Barra de Ações (topo da Content Area):**
- Botão Dourado: `+ Criar Escalão / Equipa` (ícone Lucide `Plus`) →
  abre **Modal 1 "Criar Escalão / Equipa (Multi-Step)"**.

**Agrupamento por Modalidade:**
Secção textual `SECÇÃO: FUTEBOL` (12px, UPPERCASE, Gray 500, padding
`16px 0 8px`). Separador `1px #E2E8F0` abaixo. Repetido para cada
modalidade ativa.

**Cartões de Equipa** (grelha 3 colunas desktop, 2 tablet, 1 mobile):
Cartão: fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`, sombra
suave, padding `20px`.

Conteúdo de cada cartão:
- **Nome da Equipa** (Bold 16px, `#0F172A`). Ex: `Sub-15 A`.
- **Treinador Principal** (14px, Gray 500). Ex: `João Silva`. Se vago:
  badge Vermelho `Sem Treinador Principal` (ícone Lucide `UserX`).
- **Nº de Atletas** (12px, Gray 500). Ex: `18 atletas`.
- **Badges de alerta** (linha horizontal, visíveis apenas quando > 0):
  - Badge Ambar `[N] Inaptos` (ícone `AlertTriangle`).
  - Badge Vermelho `[X] Bloqueados` (ícone `XCircle`).
- **Botão Outline** `Gerir Plantel →` (ícone Lucide `ChevronRight`) → navega
  para Nível 2.

**Empty State (sem equipas criadas):**
- Ícone Lucide `Layers` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhuma equipa criada."` (16px, Gray 500).
- Sub-título: `"Crie a primeira estrutura hierárquica do clube."` (14px, Gray 500).
- Botão Dourado: `+ Criar Escalão / Equipa`.

---

### Nível 2 — Detalhe de Equipa

**Breadcrumb (topo):**
`Gestão de Plantéis > [Nome da Equipa]` (14px, Gray 500 · `>` · `#0F172A`)

---

**Linha de Saúde do Plantel** (fundo `#F8FAFC`, borda `1px #E2E8F0`,
corner radius `12px`, padding `12px 16px`; acima das tabs):
Quatro métricas em linha, separadas por divisores `1px #E2E8F0`:

- `ATLETAS ATIVOS` — valor (Bold 18px, `#0F172A`)
- `INAPTOS — CLÍNICO` — valor (Bold 18px, `#991B1B` se > 0, `#0F172A` se = 0)
- `INAPTOS — DOCUMENTAL` — valor (Bold 18px, `#92400E` se > 0, `#0F172A` se = 0)
- `BLOQUEADOS — FINANCEIRO` — valor (Bold 18px, `#991B1B` se > 0, `#0F172A` se = 0)

---

**Cabeçalho do Detalhe (abaixo da linha de saúde):**
- Título: Nome da Equipa (Bold 22px, `#0F172A`) + Modalidade e Escalão
  (14px, Gray 500). Ex: `Sub-15 A · Futebol 11 · Sub-15`.
- **Botão Dourado** `+ Alocar Atleta` (ícone Lucide `UserPlus`) → abre
  **Modal 2 "Alocar Atletas ao Plantel"**.
- **Botão Outline** `+ Alocar Staff` (ícone Lucide `Briefcase`) → abre
  **Modal 4 "Alocar Staff Técnico"**.

---

**Tabs Internas do Detalhe:**

`Plantel de Atletas` *(ativa por defeito)* | `Corpo Técnico` |
`Configurações do Escalão`

- Tab ativa: sublinhado `2px #F1C40F`, texto `#0F172A` SemiBold, 14px.
- Tab inativa: sem sublinhado, texto Gray 500, 14px.

---

#### Tab "Plantel de Atletas"

**Tabela de Atletas:**

| COLUNA | DETALHES |
|---|---|
| `Nº` | Número de camisola (12px, Gray 500). Se não atribuído: `—`. |
| `ATLETA` | Foto avatar (32px circular) + Nome completo (Bold 14px, `#0F172A`) + Idade (12px, Gray 500). |
| `POSIÇÃO` | Texto simples (14px, `#0F172A`). Ex: `Médio`. |
| `ESTADO CLÍNICO` | Badge Semáforo (especificação na secção global deste documento). |
| `ESTADO ADMINISTRATIVO` | Badge com quatro estados: `Válido` (Verde, ícone `CheckCircle`); `Documental Pendente` (Ambar, ícone `Clock`); `EMD Caducado` (fundo `#FEF3C7`, texto `#92400E`, ícone `Clock`); `Financeiro Bloqueado` (Vermelho, ícone `AlertCircle`). |
| `AÇÕES` | Dois botões icon-only: `Remover do Plantel` (ícone Lucide `UserMinus`, Outline borda `#E2E8F0`, hover fundo `#FEE2E2` texto `#991B1B`) · `Arquivar Atleta` (ícone Lucide `Archive`, Outline borda `#E2E8F0`, hover fundo `#FEE2E2` texto `#991B1B`). Tooltips ao hover: `"Remover do Plantel"` e `"Arquivar Atleta"` respetivamente. |

Hover nas linhas: fundo `#F1F5F9`.
Paginação: `← Anterior` e `Próxima →` (20 itens por página).
Linha de sumário: `A mostrar [1–20] de [N] atletas`.

**Empty State:**
- Ícone Lucide `Users` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Plantel vazio."` (14px, Gray 500).
- Sub-título: `"Aloque atletas a esta equipa para começar."` (12px, Gray 500).
- Botão Dourado: `+ Alocar Atleta`.

---

#### Tab "Corpo Técnico"

**Tabela de Staff:**

| COLUNA | DETALHES |
|---|---|
| `NOME` | Nome completo (Bold 14px, `#0F172A`). |
| `FUNÇÃO` | Texto. Ex: `Treinador Principal`. Se for `Treinador Principal`: badge Vermelho `Exclusivo` (ícone `Lock`) ao lado, para sinalizar que este cargo não pode ser acumulado noutra equipa do mesmo nível. |
| `OUTRAS EQUIPAS` | Se o staff acumula funções: lista de equipas em badges Neutros (fundo `#F1F5F9`, texto `#64748B`). Se exclusivo: `—`. |
| `AÇÕES` | Botão icon-only `Remover` (ícone `UserMinus`, Outline, hover Vermelho). |

**Empty State:**
- Ícone Lucide `Briefcase` centrado, 48px, opacidade 10%.
- Título: `"Sem corpo técnico alocado."` (14px, Gray 500).
- Botão Outline: `+ Alocar Staff`.

---

#### Tab "Configurações do Escalão"

> **Nota:** Esta tab mostra e permite editar os parâmetros do Escalão ao
> qual esta equipa pertence. As alterações afetam **todas as equipas** deste
> escalão. Uma confirmação é exigida antes de guardar.

**Secção: Regulamentação**
- Campo read-only + botão Editar (ícone `Pencil`, 14px): `Idade Limite Superior: [N] anos`.
- Campo read-only + botão Editar: `Idade Limite Inferior: [N] anos`.
- Campo read-only + botão Editar: `Teto Máximo de Convocatória: [N] atletas`.

**Secção: Matriz Financeira**
Três campos read-only com botões de Editar inline:
- `Quota Anual (€) → Associação: [valor]€`
- `Mensalidade Base (€) → SAD: [valor]€`
- `Mensalidade Sócio (€) → SAD: [valor]€`

**Secção: Escala de Avaliação (RF-03)**
- Campo read-only: `Escala: [mín] – [máx], incrementos de [x]`. Ex: `1,0 – 5,0, incremento 0,5`.
- Botão Outline `Editar Escala` → abre inline um formulário com três inputs numéricos:
  `Mínimo`, `Máximo`, `Incremento`. Botões `Cancelar` / `Guardar`.

**Histórico de Alterações (ícone Lucide `History`, 14px, `#1D4ED8`, clicável):**
Ao clicar, expande um bloco (fundo `#F8FAFC`, borda `1px #E2E8F0`, corner
radius `8px`, padding `12px`) com as últimas 5 alterações em lista:
- Cada linha: `[DD/MM/AAAA HH:MM] · [Nome do Ator] · [Campo]: [Valor Anterior] → [Valor Novo]`
  (12px, Gray 500, fonte monoespaçada para os valores).
- Ex: `13 Mai 2026 · João Diretor · Mensalidade Base: 30,00€ → 35,00€`

**Botão Guardar Configurações** (Dourado, largura total da secção):
Ao clicar: exibe modal de confirmação inline simples:
- Texto: `"Esta alteração afeta todas as equipas do escalão [Nome]. Confirma?"`.
- Botões: `Cancelar` (Outline) · `Guardar` (Dourado).

---

### Modais da ABA 2

---

#### Modal 1 — "Criar Escalão / Equipa (Multi-Step)"

*(Abre via botão `+ Criar Escalão / Equipa` na listagem)*

- **Título:** `Criar Novo Escalão / Equipa` (18px, SemiBold, `#0F172A`).

**Indicador de Progresso (linha de steps no topo do modal):**
Três nós ligados por linha horizontal:
- Nó ativo: círculo sólido `#F1C40F` (20px) + label Bold abaixo.
- Nó concluído: círculo sólido `#047857` + ícone `Check` branco dentro.
- Nó futuro: círculo `#E2E8F0` + número cinza.
Labels: `1 Identidade` · `2 Regulamentação` · `3 Financeiro`.

---

**Step 1 — Identidade:**

Campo 1 — `Dropdown` **"Modalidade"** *(obrigatório)*:
- Placeholder: `"Selecione a modalidade..."`.
- Opções: `Futebol 11` · `Futebol 7` · `Futsal` · `Outra`.

Campo 2 — `Dropdown` **"Escalão"** *(obrigatório)*:
- Placeholder: `"Selecione escalão existente..."`.
- Opções: escalões já criados para a modalidade selecionada + opção especial
  `"+ Criar Novo Escalão"`.
- Ao selecionar `"+ Criar Novo Escalão"`: revela o campo de nome do escalão
  abaixo.

Campo 3 — `Input de Texto` **"Nome da Equipa"** *(obrigatório)*:
- Placeholder: `"ex: Sub-15 A"`.
- **Validação de unicidade em tempo real** (debounce 500ms): enquanto o
  utilizador escreve, o sistema verifica se já existe equipa com este nome no
  mesmo escalão/modalidade. Se existe: borda `#DC2626` + mensagem inline
  (11px, `#991B1B`): `"Já existe uma equipa com este nome neste escalão."`

**Rodapé Step 1:** Botão Outline `Cancelar` · Botão Dourado `Próximo →`
(desativado se campos obrigatórios em falta).

---

**Step 2 — Regulamentação** *(nível Escalão — aplica-se se "Criar Novo Escalão")*:

Campo 1 — `Input Numérico` **"Idade Limite Superior"** *(obrigatório)*:
- Placeholder: `"ex: 15"`. Valor inteiro positivo.
- Helper text: `"Atletas mais velhos não podem ser associados ao plantel."` (11px, Gray 500).

Campo 2 — `Input Numérico` **"Idade Limite Inferior"** *(opcional)*:
- Placeholder: `"ex: 13"`. Valor inteiro positivo.
- Helper text: `"Atletas mais novos recebem aviso de 'Subida de Escalão'."` (11px, Gray 500).

Campo 3 — `Input Numérico` **"Teto Máximo de Convocatória"** *(obrigatório)*:
- Placeholder: `"ex: 22"`. Valor inteiro positivo.
- Helper text: `"Número máximo de atletas na lista de convocados."` (11px, Gray 500).

**Rodapé Step 2:** Botão Outline `← Anterior` · Botão Dourado `Próximo →`.

---

**Step 3 — Matriz Financeira e Avaliação** *(nível Escalão — obrigatório)*:

Bloco informativo (fundo `#EFF6FF`, borda `1px #1D4ED8`, corner radius `8px`,
padding `12px`):
`"Os valores financeiros definidos aqui alimentam o Motor de Provisão de
Mensalidades (RF-29). A receita é segregada automaticamente por entidade."`

Campo 1 — `Input Numérico` **"Quota Anual (€) → Associação"** *(obrigatório)*:
- Placeholder: `"0,00"`. Duas casas decimais. Mínimo: `0,01`.

Campo 2 — `Input Numérico` **"Mensalidade Base (€) → SAD"** *(obrigatório)*:
- Placeholder: `"0,00"`.

Campo 3 — `Input Numérico` **"Mensalidade Sócio (€) → SAD"** *(obrigatório)*:
- Placeholder: `"0,00"`.
- Validação: deve ser ≤ Mensalidade Base. Erro inline (11px, `#991B1B`):
  `"A mensalidade de sócio não pode ser superior à mensalidade base."`

Campo 4 — **"Escala de Avaliação de Rendimento (RF-03)":**
- Label: `Escala de Avaliação *` (12px, Gray 500).
- Três inputs numéricos em linha: `Mínimo` (Placeholder: `"1,0"`) ·
  `Máximo` (Placeholder: `"5,0"`) · `Incremento` (Placeholder: `"0,5"`).
- Helper text: `"Escala usada pelo treinador para avaliar atletas pós-sessão.
  Por defeito: 1,0 – 5,0, incremento 0,5."` (11px, Gray 500).

**Rodapé Step 3:** Botão Outline `← Anterior` · Botão Dourado `Criar Escalão / Equipa`.

**Toast de sucesso:** fundo `#ECFDF5`, borda esquerda `4px #047857`, texto:
`"[Nome da Equipa] criada com sucesso."`

---

#### Modal 2 — "Alocar Atletas ao Plantel"

*(Abre via botão `+ Alocar Atleta` no cabeçalho do detalhe de equipa)*

- **Título:** `Alocar Atletas — [Nome da Equipa]` (18px, SemiBold, `#0F172A`).

**Linha de informação** (fundo `#F8FAFC`, borda `1px #E2E8F0`, corner radius
`8px`, padding `10px`, 12px, Gray 500):
`Plantel atual: [N] atletas  ·  Teto de convocatória: [X]  ·  Vagas: [Y]`

**Campo de Pesquisa:**
- Placeholder: `"Pesquisar atleta por nome ou NIF..."`.
- Debounce ≥ 300ms após ≥ 3 caracteres.
- Apresenta lista de atletas disponíveis (registados no sistema, fora do plantel
  desta equipa).

**Lista de Resultados de Pesquisa:**

- **Linha normal (elegível):**
  Checkbox ativa + Nome (Bold 14px) + Escalão + Idade (12px, Gray 500).

- **Linha com aviso "Subida de Escalão"** (atleta mais novo que o limite
  inferior):
  Checkbox ativa + fundo `#FFFBEB` + Nome + badge Ambar `Subida de Escalão
  (nascido [ano])` (ícone `AlertTriangle`, 12px, `#B45309`).

- **Linha bloqueada — Sem EMD:**
  Checkbox desativada (cinza, cursor `not-allowed`) + Nome opaco (50%
  opacidade) + badge Vermelho `Bloqueado: Sem EMD` (ícone `XCircle`).

- **Linha bloqueada — Documentação Pendente:**
  Idem + badge `Bloqueado: Documentação Pendente`.

- **Linha bloqueada — Já no Plantel:**
  Idem + badge Neutro `Já inscrito nesta equipa` (ícone `CheckCircle`,
  fundo `#F1F5F9`, texto `#64748B`).

**Rodapé do Modal:**
- Botão Outline `Cancelar`.
- Botão Dourado `Confirmar Alocação ([N] selecionados)` — o `[N]` atualiza
  dinamicamente conforme as checkboxes ativas.
  - **Desativado** se nenhum atleta selecionado.

**Toast de sucesso:** `"[N] atletas alocados ao plantel [Nome da Equipa]."`

---

#### Modal 3 — "Arquivar Atleta"

*(Abre via ícone `Archive` na coluna AÇÕES da Tab "Plantel de Atletas")*

- **Cabeçalho vermelho:** Fundo `#FEE2E2`, padding `16px 24px`,
  corner radius `12px 12px 0 0`.
  - Ícone Lucide `Archive` (20px, `#991B1B`) + Título `Arquivar Atleta`
    (18px, SemiBold, `#991B1B`).
  - Sub-título: `[Nome Completo do Atleta] · [Escalão]` (14px, `#991B1B`).

- **Corpo do Modal** (fundo `#FFFFFF`, padding `24px`):

  Bloco de aviso (fundo `#FFFBEB`, borda `1px #B45309`, corner radius `8px`,
  padding `16px`, ícone Lucide `AlertTriangle` `#B45309` à esquerda):
  `"Esta ação cessa o vínculo desportivo do atleta de forma permanente.
  O atleta será removido de todas as áreas operacionais ativas (assiduidade,
  convocatórias, fichas de jogo). O Portal do Encarregado de Educação ficará
  bloqueado para novas submissões a partir da data de eficácia."` (14px,
  `#B45309`).

  Campo 1 — `Textarea` **"Justificação do Arquivamento"** *(obrigatório)*:
  - Label: `Justificação *` (12px, Gray 500).
  - Placeholder: `"Descreva o motivo do arquivamento (mín. 10 caracteres)..."`
  - Altura mínima: 3 linhas.
  - Contador: `[X / 500]` (11px, Gray 500).
  - Validação: mínimo 10 caracteres. Erro inline (11px, `#991B1B`):
    `"A justificação deve ter pelo menos 10 caracteres."`

  Campo 2 — `Input de Data` **"Data de Eficácia do Desvínculo"** *(obrigatório)*:
  - Label: `Data de Eficácia *` (12px, Gray 500).
  - Placeholder: `"dd/mm/aaaa"`.
  - Helper text: `"Pode ser hoje ou uma data futura. Dívidas vencidas anteriores
    à data de eficácia permanecem ativas."` (11px, Gray 500).
  - Validação: não pode ser data passada. Erro inline: `"A data de eficácia
    deve ser hoje ou futura."`

- **Rodapé do Modal:**
  - Botão Outline `Cancelar`.
  - Botão Destrutivo `Confirmar Arquivamento` (fundo `#FEE2E2`, texto
    `#991B1B` SemiBold, ícone Lucide `Archive`).
  - **Desativado** se justificação < 10 chars ou data inválida.

**Toast de confirmação:** fundo `#FEE2E2`, borda esquerda `4px #991B1B`,
texto: `"[Nome do Atleta] arquivado. Dívidas vencidas pendentes mantidas."`

---

#### Modal 4 — "Alocar Staff Técnico"

*(Abre via botão `+ Alocar Staff` no cabeçalho do detalhe de equipa)*

- **Título:** `Alocar Staff Técnico — [Nome da Equipa]` (18px, SemiBold, `#0F172A`).

**Campo de Pesquisa:**
- Placeholder: `"Pesquisar colaborador por nome..."`.
- Debounce ≥ 300ms após ≥ 3 caracteres.

**Lista de Resultados:**

- **Linha normal:** Checkbox + Nome (Bold 14px) + Função atual (12px, Gray 500).
- **Linha com conflito de exclusividade** (Treinador Principal já alocado
  nesta equipa):
  Checkbox desativada + badge Vermelho `Cargo Exclusivo Preenchido` (ícone
  `Lock`). Tooltip: `"O cargo de Treinador Principal já está preenchido.
  Apenas um é permitido por equipa."`.

Dropdown **"Função na Equipa"** *(obrigatório — aparece após seleção de colaborador)*:
- Placeholder: `"Selecione a função..."`. Opções: `Treinador Principal` ·
  `Treinador Adjunto` · `Preparador Físico` · `Fisioterapeuta` · `Analista` ·
  `Outro`.

**Rodapé:**
- Botão Outline `Cancelar`.
- Botão Dourado `Confirmar Alocação`.

**Toast de sucesso com confirmação de RBAC** (fundo `#ECFDF5`, borda
esquerda `4px #047857`, 6 segundos):
`"[Nome do Treinador] alocado como [Função]. Acesso automático concedido
ao módulo operacional de [Nome da Equipa]. (RF-07)"`

---

## ABA 3: Quadros Competitivos

**Objetivo:** Parametrização de provas oficiais que alimentam os dropdowns de
agendamento de jogos.

---

### Listagem de Quadros

**Barra de Ações (topo):**
- Botão Dourado: `+ Novo Quadro Competitivo` (ícone Lucide `Plus`) →
  abre **Modal "Novo Quadro Competitivo"**.

**Tabela de Quadros:**

| COLUNA | DETALHES |
|---|---|
| `NOME DA PROVA` | Texto (Bold 14px, `#0F172A`). Ex: `Campeonato Distrital`. |
| `ESCALÃO ASSOCIADO` | Badge Neutro (fundo `#F1F5F9`, texto `#64748B`). Ex: `Sub-15`. |
| `EQUIPAS ASSOCIADAS` | Lista de badges Neutros ou `—` se nenhuma. |
| `ESTADO` | Badge: `Em Curso` → Verde (ícone `PlayCircle`). `Agendado` → Ambar (ícone `Calendar`). `Encerrado` → Neutro Cinza (ícone `CheckCircle`). |
| `AÇÕES` | Botão icon-only `Editar` (ícone `Pencil`, Outline) · Botão icon-only `Arquivar` (ícone `Archive`, Outline hover Vermelho). |

Hover nas linhas: fundo `#F1F5F9`.
Paginação: `← Anterior` e `Próxima →`.

**Empty State:**
- Ícone Lucide `Trophy` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhum quadro competitivo registado."` (16px, Gray 500).
- Sub-título: `"Crie quadros competitivos para agendar jogos oficiais."` (14px, Gray 500).
- Botão Dourado: `+ Novo Quadro Competitivo`.

---

### Modal "Novo Quadro Competitivo"

- **Título:** `Novo Quadro Competitivo` (18px, SemiBold, `#0F172A`).

Campo 1 — `Input de Texto` **"Nome da Prova"** *(obrigatório)*:
- Placeholder: `"ex: Campeonato Distrital Sub-15 2025/26"`.

Campo 2 — `Dropdown` **"Escalão Associado"** *(obrigatório)*:
- Placeholder: `"Selecione o escalão..."`.
- Opções: lista de escalões criados em ABA 2.

Campo 3 — `Dropdown` **"Equipas Participantes"** *(múltipla seleção)*:
- Placeholder: `"Selecione equipas..."`.
- Filtra automaticamente pelas equipas do escalão selecionado.

Campo 4 — `Dropdown` **"Estado Inicial"** *(obrigatório)*:
- Placeholder: `"Selecione o estado..."`.
- Opções: `Agendado` · `Em Curso`.

**Rodapé:**
- Botão Outline `Cancelar`.
- Botão Dourado `Criar Quadro` (ícone Lucide `Plus`).

---

## ABA 4: Análise e Rendimento

**Objetivo:** Business Intelligence desportiva — cruzamento de dados táticos,
administrativos e clínicos para apoio à decisão estratégica.

**Rodapé Global da ABA 4** (fixo no fundo da Content Area):
Linha discreta (Gray 500, 12px, alinhada à direita):
`Dados calculados às [HH:MM] de [DD/MM/AAAA]  ·  Próxima atualização automática: [HH:MM]`
Botão Outline à direita: `Exportar Relatório (PDF)` (ícone Lucide `FileText`).

---

### Sub-navegação horizontal da ABA 4

Três tabs internas:
`Visão Global — Coletivo` *(ativa por defeito)* | `Análise Individual` |
`Auditoria de Incumprimentos`

- Tab ativa: sublinhado `2px #F1C40F`, texto `#0F172A` SemiBold, 14px.
- Tab inativa: Gray 500.

---

### Tab A — Visão Global — Coletivo (RF-13 / UC-08.1)

**Controlos de Topo (barra de filtros):**

- Dropdown `ÉPOCA` — Placeholder: `"Época Ativa"`. Opções: lista de épocas
  registadas.
- Dropdown `EQUIPA` — Placeholder: `"Todas as Equipas"`. Opções: lista de
  equipas ativas.
- Dropdown `PERÍODO` — Placeholder: `"Última Jornada (7 dias)"`. Opções:
  `Última Jornada (7 dias)` *(defeito)* · `Este Mês` · `Época Completa` ·
  `Personalizado (De / Até)`.
- Quando `Personalizado`: inputs `De` e `Até` (Placeholder: `"dd/mm/aaaa"`;
  validação: "De" anterior a "Até").
- Botão de texto `Limpar Filtros` (visível quando ≥ 1 filtro ativo, 12px,
  `#1D4ED8`).

---

**Banner de Dados Provisórios** (visível apenas quando existem jogos na janela
de 24h com ficha ainda não submetida definitivamente — RF-10):
Fundo `#FFFBEB`, borda `1px #B45309`, corner radius `12px`, padding `12px 16px`.
Ícone Lucide `Clock` (`#B45309`, 16px) + texto (14px, `#B45309`):
`"[N] jogo(s) na janela regulamentar de 24h — os resultados assinalados com
'Provisório' podem sofrer alterações antes da validação final."`

---

**Linha de KPI Cards (4 cartões):**
Grelha 4 colunas (desktop), 2×2 (tablet), 1 coluna (mobile).
Cada cartão: fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`,
sombra suave, padding `20px`.

**KPI 1 — Taxa de Vitórias:**
- Label: `TAXA DE VITÓRIAS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `58,3%` (Bold 700, 28px, `#0F172A`).
- Badge de variação vs. período anterior (mesmas regras dos módulos CFO/CEO):
  - Positiva: ícone `ArrowUpRight` + texto `#047857`. Ex: `+4,2% vs. período ant.`
  - Negativa: ícone `ArrowDownRight` + texto `#991B1B`.
- **Badge "Provisório"** (visível apenas se este KPI inclui jogos na janela de
  24h): badge Ambar pill `Inclui dados provisórios` (ícone `Clock`, 10px,
  fundo `#FFFBEB`, texto `#B45309`), posicionado no canto superior direito
  do cartão.

**KPI 2 — Golos Marcados:**
- Label: `GOLOS MARCADOS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `47` (Bold 700, 28px, `#0F172A`).
- Subtexto: `Média: [X] por jogo` (12px, Gray 500).
- Badge "Provisório" (mesma lógica do KPI 1).

**KPI 3 — Golos Sofridos:**
- Label: `GOLOS SOFRIDOS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `23` (Bold 700, 28px, `#991B1B`).
- Subtexto: `Média: [X] por jogo` (12px, Gray 500).
- Badge "Provisório" (mesma lógica).

**KPI 4 — Submissão de Fichas de Jogo:**
- Label: `FICHAS DE JOGO SUBMETIDAS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `18/20` (Bold 700, 28px; `18` em `#047857` se = total,
  em `#991B1B` se < total).
- Subtexto: `[N] em falta` (12px, `#991B1B` se N > 0, Gray 500 se N = 0).
- **Link no rodapé do cartão** (separado por `1px #E2E8F0`):
  Botão de texto `Ver Incumprimentos →` (12px, `#1D4ED8`, ícone `ExternalLink`)
  → navega para **Tab "Auditoria de Incumprimentos"**.

**Estado Vazio de todos os KPIs (sem dados no período):**
Valor: `—` (Bold 700, 28px, Gray 200). Subtexto: `"Sem dados para o período."`.

---

**Gráficos (dois painéis lado a lado, 50%/50%, desktop):**

**Painel Esquerdo: Bar Chart "Rendimento por Escalão"**
- Tipo: Barras verticais agrupadas (3 barras por escalão: V/E/D).
- Eixo X: Escalões (ex: `Sub-13`, `Sub-15`, `Sub-17`, `Sub-19`, `Seniores`).
  Label 12px, Gray 500.
- Eixo Y: Contagem de jogos (0 a N). Label 12px, Gray 500.
  Grelha horizontal tracejada `1px #E2E8F0`.
- Cores:
  - Barra Vitórias: `#047857`, corner radius `4px` topo.
  - Barra Empates: `#B45309`, corner radius `4px` topo.
  - Barra Derrotas: `#991B1B`, corner radius `4px` topo.
- Legenda (acima, alinhada à direita): ponto `#047857` `Vitórias` ·
  ponto `#B45309` `Empates` · ponto `#991B1B` `Derrotas`.
- Tooltip (cartão fundo `#0F172A`, texto branco, 12px):
Sub-15 — Época 2025/26
────────────────────────
Vitórias:  7
Empates:   3
Derrotas:  2
Total:    12 jogos
- Drill-down (ao clicar numa barra): filtra automaticamente o Dropdown
  `EQUIPA` no topo para mostrar apenas o escalão clicado.
- **Empty State:** Ícone `BarChart2` centrado, 40px, opacidade 10%.
  Título: `"Sem dados de rendimento para o período selecionado."` (14px, Gray 500).
  Botão Outline: `Ajustar Período`.

**Painel Direito: Line Chart "Tendência de Golos"**
- Tipo: Linhas duplas.
- Eixo X: Datas/jornadas do período (abreviadas, 12px, Gray 500).
- Eixo Y: Golos (0 a N, 12px, Gray 500). Grelha tracejada `1px #E2E8F0`.
- Linha "Golos Marcados": cor `#047857`, espessura `2px`. Área: `#047857` 8% opacidade.
- Linha "Golos Sofridos": cor `#991B1B`, espessura `2px`. Área: `#991B1B` 8% opacidade.
- Pontos nos nós: círculo sólido 6px, cor da linha.
- Legenda (acima, direita): linha `#047857` `Golos Marcados` · linha `#991B1B`
  `Golos Sofridos`.
- Tooltip (cartão fundo `#0F172A`, texto branco, 12px):
Jornada 8 — 10 Mai 2026
─────────────────────────
Marcados: 3
Sofridos: 1
- **Empty State:** Ícone `LineChart` centrado, 40px, opacidade 10%.
  Título: `"Sem dados de golos para o período."` (14px, Gray 500).

---

**Empty State Global da Tab A (quando sem jogos validados):**
- Ícone Lucide `Trophy` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Sem eventos desportivos validados para o período selecionado."` (16px, Gray 500).
- Sub-título: `"Ajuste o período ou aguarde que as fichas de jogo sejam submetidas."` (14px, Gray 500).
- Botão Outline: `Ajustar Período`.

---

### Tab B — Análise Individual (RF-12 / UC-08.2)

**Estado Vazio Inicial (antes de pesquisa):**
- Ícone Lucide `Search` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Pesquise um atleta para visualizar o seu perfil de rendimento."` (16px, Gray 500).
- Campo de pesquisa centrado (largura 400px):
  - Placeholder: `"Nome do atleta..."`. Ícone Lucide `Search` à esquerda.
  - Debounce ≥ 300ms após ≥ 3 caracteres. Lista de sugestões abaixo.

---

**Estado Pós-Pesquisa (atleta selecionado):**

**Cartão Biográfico (topo):**
Fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`, padding `20px`,
layout em linha:
- Avatar circular (56px) + Nome (Bold 20px, `#0F172A`) + Escalão + Idade
  (14px, Gray 500) + Última consulta (12px, Gray 500).
- Badge Semáforo do atleta (especificação na secção global).

**Filtros Dimensionais (abaixo do cartão biográfico):**
- Dropdown `Competição` — Placeholder: `"Todas as Competições"`.
- Dropdown `Período` — Placeholder: `"Época Ativa"`. Opções: `Época Ativa` ·
  `Este Mês` · `Personalizado`.

---

**Linha de KPI Cards Individuais (6 cartões em grelha 3×2):**

| KPI | Valor Exemplo | Cor | Ícone |
|---|---|---|---|
| `MINUTOS TOTAIS` | `1.284 min` | `#0F172A` | `Timer` |
| `CONVOCATÓRIAS` | `18 / 22` | `#0F172A` | `Users` |
| `GOLOS` | `7` | `#047857` | `Target` |
| `INFRAÇÕES` | `3 Amarelos · 0 Vermelhos` | `#B45309` | `AlertOctagon` |
| `AVALIAÇÃO MÉDIA` | `3,8 / 5,0` | `#0F172A` | `Star` |
| `DISPONIBILIDADE CLÍNICA` | `87%` | cor progressiva (≥80% verde, 60-79% ambar, <60% vermelho) | `HeartPulse` |

Cada cartão: fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `12px`,
sombra suave, padding `16px`.

---

**Radar Chart Comparativo "Atleta vs. Mediana da Equipa":**

Cartão fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`,
sombra suave, padding `24px`.

- **Tipo:** Spider / Radar Chart hexagonal.
- **Eixos (6 dimensões):**
  1. `Golos por 90 min`
  2. `Taxa de Convocatória (%)`
  3. `Avaliação Média Treino`
  4. `Assiduidade (%)`
  5. `Disponibilidade Clínica (%)`
  6. `Minutos por Jogo`
- Cada eixo: escala 0–100 (normalizada). Label nos extremos: 12px, Gray 500.
- **Polígono Atleta:** preenchimento `#F1C40F` (Dourado Boavista) a 30%
  opacidade + borda sólida `2px #F1C40F`. Pontos nos vértices: círculo sólido
  6px `#F1C40F`.
- **Polígono Mediana da Equipa:** preenchimento `#1D4ED8` (Azul Info) a 15%
  opacidade + borda sólida `2px #1D4ED8` tracejada. Pontos: círculo sólido
  6px `#1D4ED8`.
- **Legenda** (abaixo do gráfico, em linha):
  - Quadrado sólido `#F1C40F` (12px) + `[Nome do Atleta]`.
  - Quadrado tracejado `#1D4ED8` (12px) + `Mediana da Equipa`.
- **Tooltip ao hover num vértice** (cartão fundo `#0F172A`, texto branco, 12px):
Taxa de Convocatória
──────────────────────
João Silva:       81,8%
Mediana Equipa:   74,2%
Diferença:        +7,6%

---

**Empty State para atleta sem dados suficientes:**
- Ícone Lucide `BarChart2` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Dados insuficientes para calcular indicadores."` (16px, Gray 500).
- Sub-título: `"O atleta ainda não tem registos desta competição no período
  selecionado."` (14px, Gray 500).
- Botão Outline: `Ajustar Filtros`.

---

### Tab C — Auditoria de Incumprimentos (RF-11 / UC-08.3)

*(Acessível diretamente na sub-navegação ou via link `→ Ver Incumprimentos`)*

**Barra de Ações (topo):**
- Dropdown `PERÍODO` — Placeholder: `"Esta Semana"`. Opções: `Esta Semana`
  *(defeito)* · `Este Mês` · `Época` · `Personalizado`.
- Dropdown `ESCALÃO` — Placeholder: `"Todos os Escalões"`.
- Dropdown `ESTADO` — Placeholder: `"Todos"`. Opções: `Todos` · `Não Lido` ·
  `Reconhecido` · `Arquivado`.
- Botão Destrutivo (Outline Vermelho, extremo direito): `Notificar Todos` (ícone
  Lucide `Bell`) → abre **Modal "Confirmar Notificação em Massa"**.

---

**Tabela de Incumprimentos:**

| COLUNA | DETALHES |
|---|---|
| `JOGO` | Adversário + data (Bold 14px, `#0F172A`). Ex: `vs FC Porto · 10 Mai`. |
| `ESCALÃO` | Badge Neutro. Ex: `Sub-17`. |
| `TREINADOR RESPONSÁVEL` | Nome (14px, `#0F172A`). |
| `ATRASO` | Tempo desde o prazo expirado (14px, `#991B1B`). Ex: `Expirado há 3 dias`. |
| `ESTADO` | Badge: `Não Lido` → Vermelho (fundo `#FEE2E2`, texto `#991B1B`, ícone `Circle`). `Reconhecido` → Neutro Cinza (fundo `#F1F5F9`, texto `#64748B`, ícone `CheckCircle`). `Arquivado` → Neutro mais claro (fundo `#F8FAFC`, texto `#94A3B8`, ícone `Archive`). |
| `AÇÕES` | Três botões icon-only (visíveis no hover da linha): `Notificar` (ícone `Bell`, Outline) · `Reconhecer` (ícone `Check`, Outline Verde no hover) · `Arquivar` (ícone `Archive`, Outline no hover). Tooltips respetivos. |

> **Nota:** `Reconhecer` e `Arquivar` ficam desativados se o estado já for
> `Reconhecido` ou `Arquivado` respetivamente.

Hover nas linhas: fundo `#F1F5F9`.
Paginação: `← Anterior` e `Próxima →`.

**Toast de concorrência** (se ao clicar `Reconhecer` o alerta já tiver sido
processado por outro perfil entretanto — UC-08.3 fluxo de exceção):
Fundo `#FFFBEB`, borda esquerda `4px #B45309`, 6 segundos:
`"Este alerta já foi reconhecido por [Nome] às [HH:MM]. A linha foi atualizada."`
A linha em causa é removida da vista filtrada ou o badge atualizado.

**Toast de reconhecimento bem-sucedido:**
Fundo `#ECFDF5`, borda esquerda `4px #047857`:
`"Incumprimento reconhecido e registado no Audit Trail."`

---

**Modal "Confirmar Notificação em Massa":**
*(Abre via botão `Notificar Todos`)*
- **Título:** `Notificar Treinadores — Incumprimento de Fichas`
  (18px, SemiBold, `#0F172A`).
- **Conteúdo:** `"Serão notificados [N] treinadores com alertas 'Não Lido'
  via gateway de comunicações (RF-25). Esta ação não altera o estado dos
  alertas no sistema."` (14px, Gray 500).
- **Rodapé:** Botão Outline `Cancelar` · Botão Dourado `Enviar Notificações`.
- **Toast de sucesso:** `"Notificações enviadas a [N] treinadores."`

---

**Empty State (sem incumprimentos):**
- Ícone Lucide `CheckCircle` centrado, 64px, `#047857`, opacidade 30%.
- Título: `"Nenhum incumprimento registado para o período selecionado."` (16px, `#047857`).
- Sub-título: `"Todas as fichas de jogo foram submetidas dentro do prazo."` (14px, Gray 500).

**Empty State (filtros sem resultados):**
- Ícone Lucide `SearchX` centrado, 64px, opacidade 10%.
- Título: `"Nenhum incumprimento corresponde aos filtros aplicados."` (16px, Gray 500).
- Botão Outline: `Limpar Filtros`.