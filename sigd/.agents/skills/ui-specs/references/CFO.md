# Módulo: Direção Executiva e Financeira (Perfil: `ROLE_CFO`)

**Visão Geral:** Painel de Alta Direção (C-Level) para o Chief Financial Officer
e Direção Executiva. Apresenta KPIs financeiros e demográficos agregados,
análise comparativa por centro de responsabilidade (Clube vs. SAD) e acesso
read-only ao audit trail de eventos financeiros. Todos os dados são de consulta
exclusiva — o CFO não executa operações transacionais.

**Página Inicial (Landing Page):** `ABA 1 — Dashboard Executivo`

> **Nota de RBAC:** Este módulo é estritamente read-only. Nenhum botão de
> criação, edição ou eliminação de entidades existe neste módulo.
> A única ação de escrita permitida é `Exportar CSV/PDF` (geração de ficheiro
> local sem impacto na base de dados).

---

## Barra de Navegação Principal (sempre visível no topo do módulo)

Quatro abas fixas:
`Dashboard Executivo` | `Relatórios Financeiros` | `Base Social & Desportiva` | `Auditoria Financeira`

---

## ABA 1: Dashboard Executivo

**Objetivo:** Visão executiva de KPIs financeiros, demográficos e fluxos de
caixa. Todos os dados reagem ao período selecionado na barra de filtros.

---

### Barra de Filtros Temporal (topo da Content Area, dentro do cartão branco)

**Layout:** Uma linha horizontal com os seguintes controlos, da esquerda para
a direita:

- Label `Período de análise:` (Gray 500, 12px).
- Grupo de botões de seleção rápida (pill buttons, apenas um ativo de cada vez;
  o ativo fica com fundo `#F1C40F` e texto `#000000`; os inativos ficam com
  fundo transparente, borda `#E2E8F0` e texto `#0F172A`):
  - `Este Mês`
  - `Trimestre`
  - `Época Ativa` *(default ao carregar a página)*
  - `Personalizado`
- Quando `Personalizado` está selecionado, revelam-se dois inputs de data
  inline:
  - Input `De` — Placeholder: `"dd/mm/aaaa"`
  - Input `Até` — Placeholder: `"dd/mm/aaaa"`
  - Validação: "De" deve ser anterior ou igual a "Até".
    Erro inline: `"Data inicial deve ser anterior à data final."`
- Botão Outline (extremo direito): `Exportar CSV` (ícone Lucide `Download`).
  Ao clicar, gera um ficheiro `.csv` com todos os KPIs e dados tabulares
  do período selecionado.

**Comportamento:** Ao alterar qualquer controlo de período, todos os KPIs,
gráficos e listas do Dashboard atualizam de forma assíncrona (sem reload da
página). Durante a atualização, cada cartão de KPI e cada gráfico exibe um
estado de loading: esqueleto cinza animado (skeleton shimmer) sobre o valor
anterior. A barra de filtros mantém-se clicável durante o loading.

---

### Secção 1 — Cartões de KPI (Topo)

**Layout:** Quatro cartões dispostos horizontalmente em grelha de 4 colunas
(desktop) ou 2×2 (tablet) ou 1 coluna (mobile). Cada cartão tem fundo `#FFFFFF`,
borda `1px #E2E8F0`, corner radius `16px`, sombra suave (Y=1, Blur=2).

---

**KPI 1 — Receita Total (YTD)**

- **Label:** `Receita Total` (12px, UPPERCASE, Gray 500)
- **Ícone Lucide:** `TrendingUp` (canto superior direito do cartão, Gray 200,
  24px)
- **Valor Principal:** `1.240.500,00 €` (Bold 700, 28px, `#0F172A`)
  - Formatação obrigatória: separador de milhares = `.` (ponto);
    separador decimal = `,` (vírgula); símbolo `€` com espaço após o número.
- **Badge de Variação (abaixo do valor):**
  - Se variação positiva (> 0%): texto `#047857`, ícone Lucide `ArrowUpRight`,
    ex: `+12,3% face à época anterior`
  - Se variação negativa (< 0%): texto `#991B1B`, ícone Lucide `ArrowDownRight`,
    ex: `-4,1% face à época anterior`
  - Se variação neutra (= 0%): texto Gray 500, ícone Lucide `Minus`,
    ex: `Sem variação face à época anterior`
- **Subtexto:** `Época 2025/2026 · Atualizado às [HH:MM]` (12px, Gray 500)

---

**KPI 2 — Passivo Pendente**

- **Label:** `Passivo Pendente` (12px, UPPERCASE, Gray 500)
- **Ícone Lucide:** `AlertCircle` (canto superior direito, `#991B1B`, 24px)
- **Valor Principal:** `45.200,00 €` (Bold 700, 28px, `#991B1B`)
- **Badge de Variação:** mesmas regras de cor do KPI 1 mas com lógica invertida
  (redução da dívida é positiva → verde; aumento da dívida é negativo → vermelho).
  Ex: `-8,2% face ao mês anterior` em verde significa melhoria.
- **Subtexto:** `230 mensalidades em atraso` (12px, Gray 500)
- **Link de Drill-down (rodapé do cartão, linha separada por divisor `1px #E2E8F0`):**
  Botão de texto inline: `Ver detalhes por escalão` (12px, `#1D4ED8`, ícone
  Lucide `ChevronRight` à direita) → ao clicar, abre **Modal "Drill-down do
  Passivo Pendente"**.

---

**KPI 3 — Sócios Ativos**

- **Label:** `Sócios Ativos` (12px, UPPERCASE, Gray 500)
- **Ícone Lucide:** `Users` (canto superior direito, Gray 200, 24px)
- **Valor Principal:** `12.450` (Bold 700, 28px, `#0F172A`)
  - Formatação: separador de milhares = `.` (ponto). Sem casas decimais.
- **Badge de Variação:** mesmas regras de cor do KPI 1.
  Ex: `+3,1% face ao mês anterior`
- **Subtexto:** `Taxa de regularidade associativa: 88%` (12px, Gray 500)

---

**KPI 4 — Atletas Federados**

- **Label:** `Atletas Federados` (12px, UPPERCASE, Gray 500)
- **Ícone Lucide:** `ShieldCheck` (canto superior direito, Gray 200, 24px)
- **Valor Principal:** `450` (Bold 700, 28px, `#0F172A`)
- **Badge de Variação:** mesmas regras de cor do KPI 1.
- **Subtexto:** `Distribuídos por 18 equipas` (12px, Gray 500)

---

**Estado Vazio de KPI (quando não há dados para o período selecionado):**
Todos os quatro cartões de KPI exibem:
- Valor substituído por `— €` ou `—` (traço longo em Gray 200, Bold 700, 28px)
- Badge de variação oculta.
- Subtexto: `"Sem dados para o período selecionado."` (12px, Gray 500, itálico)

---

### Secção 2 — Gráficos Principais e Fluxos (Meio)

**Layout:** Dois painéis lado a lado (~60% esquerda / ~40% direita) em desktop;
empilhados em mobile.

---

**Painel Esquerdo: Gráfico de Barras "Evolução de Proveitos — Clube vs. SAD"**

- **Tipo:** Gráfico de Barras Verticais Agrupadas (grouped bar chart).
  Para cada período (mês), existem DUAS barras lado a lado: uma para o Clube
  e uma para a SAD. As barras nunca se sobrepõem nem se empilham.
- **Eixo X:** Meses do período selecionado, abreviados (ex: `Jan`, `Fev`,
  `Mar`, `Abr`, `Mai`). Label 12px, Gray 500.
- **Eixo Y (esquerda):** Valores monetários em euros, sem casas decimais,
  com sufixo `k` para milhares (ex: `0`, `20k`, `40k`, `60k`). Label 12px,
  Gray 500. Linhas de grelha horizontais: `1px #E2E8F0`, tracejadas.
- **Cores das Barras:**
  - Barra Clube: cor `#000000` (Preto Puro), corner radius `4px` no topo.
  - Barra SAD: cor `#F1C40F` (Dourado Boavista), corner radius `4px` no topo.
- **Legenda (acima do gráfico, alinhada à direita):**
  - Ponto circular `#000000` + texto `Clube`
  - Ponto circular `#F1C40F` + texto `SAD`
  Ambos com 12px, Gray 500.
- **Tooltip (ao fazer hover numa barra ou num grupo de barras):**
  - Aparece como cartão flutuante com fundo `#0F172A` (escuro), padding 12px,
    corner radius 8px, sombra forte.
  - Conteúdo (texto branco, 12px):
[Nome do Mês] [Ano]
────────────────────
Clube:   48.000,00 €
SAD:     35.000,00 €
────────────────────
Total:   83.000,00 €
  - O separador `────` é uma linha `1px` com opacidade 20%.
- **Empty State (sem dados para o período):**
  - Área do gráfico preenchida com fundo `#F8FAFC`.
  - Ícone Lucide `BarChart2` centrado, 48px, opacidade 10%, Gray 200.
  - Título centrado: `"Sem dados de proveitos para o período selecionado."`
    (14px, Gray 500)
  - Botão Outline centrado: `Ajustar Período`

---

**Painel Direito: Lista "Últimos Fluxos em Numerário"**

- **Cabeçalho do Painel:**
  - Título: `Últimos Fluxos em Numerário` (16px, SemiBold, `#0F172A`)
  - Subtítulo: `Movimentos presenciais da Secretaria` (12px, Gray 500)

- **Mini-sumário de Agregação por Canal (acima da lista, fundo `#F8FAFC`,
  padding 12px, corner radius 8px, borda `1px #E2E8F0`):**
  Três colunas lado a lado:
  - `Numerário` | valor total formatado (ex: `320,00 €`) | badge Neutro
  - `Multibanco` | valor total formatado (ex: `1.240,00 €`) | badge Azul Info
  - `MBWay` | valor total formatado (ex: `540,00 €`) | badge Verde
  - Abaixo de cada coluna: linha de segregação discreta em Gray 500, 10px:
    `Clube: X€ · SAD: Y€`

- **Lista de Transações Individuais:**
  Cada linha da lista contém (separadas por `1px #E2E8F0`):
  - **Coluna Esquerda:**
    - Hora do movimento (Bold, 14px, `#0F172A`). Ex: `14:30`
    - Método de pagamento (12px, Gray 500). Ex: `Multibanco`
  - **Coluna Centro:**
    - Nome / Referência do EE pagador (14px, `#0F172A`). Ex: `Carlos Silva`
    - Entidade destrinçada (12px): badge `Clube` (Neutro) ou badge `SAD` (Dourado
      `#F1C40F` fundo `#FFFBEB` texto `#B45309`)
  - **Coluna Direita (alinhada à direita):**
    - Valor (Bold, 14px, `#0F172A`). Ex: `120,00 €`

- **Paginação:** `← Anterior` e `Próxima →` no rodapé da lista
  (paginação de 10 itens por página).

- **Empty State:**
  - Ícone Lucide `Banknote` centrado, 48px, opacidade 10%.
  - Título: `"Nenhum fluxo registado no período selecionado."` (14px, Gray 500)

---

### Secção 3 — Distribuições (Fundo)

**Layout:** Dois painéis lado a lado (50%/50%) em desktop; empilhados em mobile.

---

**Painel Esquerdo: Gráfico Donut "Distribuição de Atletas por Escalão"**

- **Tipo:** Gráfico Donut (anel circular, espessura ~30px, fundo vazio central).
- **Paleta de cores das fatias** (atribuída por escalão, sempre na mesma ordem):
  - Sub-13: `#F1C40F` (Dourado Boavista)
  - Sub-15: `#000000` (Preto Puro)
  - Sub-17: `#64748B` (Gray 500)
  - Sub-19: `#0F172A` (Gray 900)
  - Seniores: `#E2E8F0` (Gray 200)
  - Outros: `#94A3B8` (Gray 400)
- **Centro do Donut:** Número total de atletas em Bold 700 22px (`#0F172A`),
  com label abaixo `"Atletas"` em 12px Gray 500.
- **Legenda (abaixo do gráfico, em grelha 2 colunas):**
  Cada item: ponto colorido + `[Nome do Escalão]` + `[N] atletas` +
  `([XX]%)`. Ex: `● Sub-15  87 atletas (19%)`
- **Tooltip (ao fazer hover numa fatia):**
  Cartão flutuante fundo `#0F172A`, texto branco:
Sub-15
──────────────
87 atletas
19% do total
- **Filtros demográficos (acima do gráfico, alinhados à direita):**
  Dropdown `Filtrar por Modalidade` — Placeholder: `"Todas as Modalidades"`.
  Opções: `Todas as Modalidades` *(default)* · `Futebol 11` · `Futebol 7` ·
  `Futsal` · `Outras`.
- **Empty State:**
  - Anel cinzento tracejado (50% opacidade) no lugar do donut.
  - Título centrado: `"Sem dados demográficos para o período."` (14px, Gray 500)

---

**Painel Direito: Gauge "Taxa de Regularidade Associativa"**

- **Label Principal (acima do gauge):** `Taxa de Regularidade Associativa`
  (14px, SemiBold, `#0F172A`)
- **Tipo:** Gráfico Gauge (arco semicircular, ~180°). Espessura do arco ~24px.
- **Cores do arco:**
  - Arco preenchido (valor atual): cor progressiva:
    - 0%–59%: `#991B1B` (Vermelho Destrutivo)
    - 60%–79%: `#B45309` (Amarelo/Aviso)
    - 80%–100%: `#047857` (Verde Sucesso)
  - Arco de fundo (parte vazia): `#E2E8F0` (Gray 200)
- **Centro do Gauge:** Percentagem em Bold 700 32px com a cor correspondente
  à faixa. Ex: `88%` em `#047857`.
- **Linha 1 (abaixo da percentagem):** `Sócios com quotas em dia` (12px,
  Gray 500, centrado)
- **Linha 2 (abaixo):** `[10.956] de [12.450] sócios regularizados` (12px,
  `#0F172A` Bold para os números, Gray 500 para o texto). Os valores são
  calculados: `Total Sócios Ativos × (Taxa% / 100)`.
- **Marcas de referência no arco:**
  - Marca a `60%`: linha vertical fina `#B45309` + label `"60%"` (10px)
  - Marca a `80%`: linha vertical fina `#047857` + label `"80%"` (10px)
- **Tooltip (ao fazer hover no arco):**
  Cartão flutuante fundo `#0F172A`, texto branco:
Taxa de Regularidade: 88%
──────────────────────────
Regularizados: 10.956
Pendentes:     1.494
Total ativo:   12.450
- **Empty State:**
  - Arco tracejado cinzento.
  - Texto centrado: `"—"` em Gray 200, Bold 32px.
  - Label: `"Sem dados associativos para o período."` (12px, Gray 500)

---

### Secção 4 — Estado das Provisões da Época Ativa (Rodapé do Dashboard)

*(Visibilidade do CFO como ator Secundário em UC-05.1)*

**Layout:** Cartão de largura total (100%), fundo `#FFFFFF`, borda
`1px #E2E8F0`, corner radius `12px`, padding 16px.

- **Título (esquerda):** `Provisões da Época Ativa — 2025/2026`
  (14px, SemiBold, `#0F172A`)
- **Conteúdo (linha de métricas, três blocos separados por divisores verticais
  `1px #E2E8F0`):**

  Bloco 1:
  - Label: `DÉBITOS GERADOS` (10px, UPPERCASE, Gray 500)
  - Valor: `5.400` (20px, Bold, `#0F172A`)
  - Subtexto: `Mensalidades + Quotas` (11px, Gray 500)

  Bloco 2:
  - Label: `DÉBITOS EM FALTA` (10px, UPPERCASE, Gray 500)
  - Valor: `14` (20px, Bold, `#991B1B`)
  - Subtexto: `Atletas sem plano processado` (11px, Gray 500)

  Bloco 3:
  - Label: `ÚLTIMA GERAÇÃO EM LOTE` (10px, UPPERCASE, Gray 500)
  - Valor: `12 Mai 2026` (20px, Bold, `#0F172A`)
  - Subtexto: `Processado pela Secretaria` (11px, Gray 500)

- **Nota informativa (direita, alinhada ao centro vertical):**
  Badge Info (fundo `#EFF6FF`, texto `#1D4ED8`, ícone Lucide `Info`):
  `"A geração de provisões é executada pela Secretaria. Este painel é read-only."`

---

### Rodapé do Dashboard

Linha discreta em Gray 500, 12px, alinhada à direita:
`Dados atualizados às [HH:MM] de hoje · Próxima atualização automática: [HH:MM]`

---

## ABA 2: Relatórios Financeiros

**Objetivo:** Análise comparativa aprofundada da performance financeira por
centro de responsabilidade (Clube vs. SAD), com filtro de período e rácios
de eficiência (UC-05.3 / RF-32).

---

### Barra de Filtros e Ações

Linha horizontal no topo da Content Area:

- Grupo de botões de preset rápido (mesmo padrão visual da ABA 1):
  `Este Mês` | `Trimestre` | `Época Ativa` *(default)* | `Personalizado`
- Quando `Personalizado`: inputs `De` e `Até` (mesmo comportamento da ABA 1).
- Botão Outline: `Exportar PDF` (ícone Lucide `FileText`).
- Botão Outline: `Exportar Excel` (ícone Lucide `Sheet`).

---

### Painéis Comparativos Clube vs. SAD

**Layout:** Dois painéis lado a lado de largura igual (50%/50%) em desktop;
empilhados em mobile. Cada painel é um cartão `#FFFFFF`, borda `1px #E2E8F0`,
corner radius `16px`.

**Cabeçalho de cada painel (dentro do cartão):**
- Painel Esquerdo — Badge Preto: `ASSOCIAÇÃO / CLUBE`
- Painel Direito — Badge Dourado (fundo `#FFFBEB`, texto `#B45309`): `SAD / FORMAÇÃO`

---

**Conteúdo de cada Painel (estrutura idêntica, valores distintos):**

**Bloco A — KPIs Financeiros da Entidade:**
Três métricas em linha horizontal dentro do painel:

  Métrica 1:
  - Label: `RECEITA CAPTADA` (10px, UPPERCASE, Gray 500)
  - Valor: ex. Clube `820.300,00 €` / SAD `420.200,00 €` (18px, Bold, `#0F172A`)
  - Variação vs. período anterior: badge colorido (mesmas regras da ABA 1)

  Métrica 2:
  - Label: `DÍVIDA VENCIDA` (10px, UPPERCASE, Gray 500)
  - Valor: ex. Clube `28.500,00 €` / SAD `16.700,00 €` (18px, Bold, `#991B1B`)

  Métrica 3:
  - Label: `RÁCIO DE EFICIÊNCIA` (10px, UPPERCASE, Gray 500)
  - Valor calculado: `Receita Captada / (Receita Captada + Dívida Vencida) × 100`
    Ex: `96,6%` (18px, Bold)
  - Cor do valor: se ≥ 85% → `#047857` (Verde); se 70%–84% → `#B45309` (Amarelo);
    se < 70% → `#991B1B` (Vermelho).
  - Tooltip ao hover no rácio (cartão escuro `#0F172A`, texto branco 12px):
Rácio de Cobertura Operacional
───────────────────────────────
Receita captada:  820.300,00 €
Dívida vencida:    28.500,00 €
Eficiência:           96,6%

**Bloco B — Gráfico de Linha "Evolução Mensal da Entidade":**
- Tipo: Gráfico de Linha (line chart) individual por painel.
- Eixo X: Meses do período selecionado (abreviados, 12px Gray 500).
- Eixo Y: Valores em euros (sufixo `k` para milhares, 12px Gray 500).
- Linha principal: Clube → cor `#000000`; SAD → cor `#F1C40F`. Espessura 2px.
  Pontos nos nós: círculo 6px, mesmo cor.
- Área sob a linha: preenchimento com cor da linha, 10% opacidade.
- Linhas de grelha: `1px #E2E8F0`, horizontais, tracejadas.
- Tooltip ao hover num ponto (cartão escuro `#0F172A`, texto branco 12px):
Abril 2026 — [CLUBE / SAD]
───────────────────────────
Receita:   48.000,00 €
Dívida:     2.100,00 €
- **Empty State de cada gráfico de linha:**
  - Linha tracejada horizontal no centro da área (Gray 200).
  - Ícone Lucide `LineChart` centrado, 40px, opacidade 10%.
  - Texto: `"Sem dados para o período selecionado."` (12px, Gray 500)

**Bloco C — Tabela de Rubricas da Entidade:**
- Título da secção: `Detalhe por Rubrica` (14px, SemiBold)
- Colunas:

| Coluna | Detalhes |
|---|---|
| `Rubrica` | Nome (ex: `Mensalidade Sócio Sub-15`, `Quota Associativa Anual`) |
| `Escalão` | Badge Neutro (ex: `Sub-15`, `Seniores`) |
| `Débitos Gerados` | Número inteiro (ex: `245`) |
| `Valor Total Gerado` | Formatado em euros (ex: `8.575,00 €`) |
| `Valor Liquidado` | Formatado em euros, cor `#047857` |
| `Valor em Dívida` | Formatado em euros, cor `#991B1B` |
| `Taxa de Liquidação` | Percentagem (ex: `92,3%`) com cor progressiva (≥85% verde, 70–84% amarelo, <70% vermelho) |

- Paginação: `← Anterior` e `Próxima →` no rodapé (10 itens por página).
- **Empty State da tabela:**
  - Ícone Lucide `Table` centrado, 40px, opacidade 10%.
  - Título: `"Sem rubricas registadas para este centro no período."`
  - Sub-título: `"Ajuste o período ou verifique se existem provisões geradas."`

---

## ABA 3: Base Social & Desportiva

**Objetivo:** Monitorização read-only da base de sócios e atletas do clube,
com filtros demográficos e exportação de dados (RF-31). Nenhuma operação de
criação ou edição é possível nesta aba.

> **Nota RBAC:** Esta aba é estritamente de consulta. A gestão de fichas de
> sócios e EE pertence à Secretaria (UC-02, RF-36).

---

### Barra de Filtros e Exportação

Linha horizontal no topo:

- Dropdown `Tipo de Entidade` — Placeholder: `"Todos"`. Opções:
  `Todos` *(default)* · `Sócios` · `Atletas` · `Encarregados de Educação`
- Dropdown `Escalão` — Placeholder: `"Todos os Escalões"`. Opções:
  `Todos os Escalões` *(default)* · `Sub-13` · `Sub-15` · `Sub-17` ·
  `Sub-19` · `Seniores` · `Outro`
- Dropdown `Estado` — Placeholder: `"Todos os Estados"`. Opções:
  `Todos os Estados` *(default)* · `Ativo` · `Pendente` · `Arquivado`
- Botão de texto `Limpar Filtros` (visível apenas quando ≥ 1 filtro ativo).
- Botão Outline: `Exportar CSV` (ícone Lucide `Download`).

---

### Cartões de Resumo Demográfico

Quatro cartões em linha (mesma estrutura visual dos KPIs da ABA 1):

1. **Total de Sócios Ativos:** ex. `12.450` · Subtexto: `Com vínculo associativo ativo`
2. **Sócios Regularizados:** ex. `10.956` · Badge Verde: `88% do total`
3. **Atletas Inscritos:** ex. `450` · Subtexto: `Em 18 equipas ativas`
4. **Atletas com Documentação Pendente:** ex. `23` · Badge Vermelho: `5,1% sem EMD válido`

---

### Tabela de Entidades

**Nota:** Tabela read-only. Nenhuma linha tem ação de edição.

| Coluna | Detalhes |
|---|---|
| `Nome` | Nome completo (Bold, 14px). Abaixo: NIF em Gray 500, 12px. |
| `Tipo` | Badges sobrepostos: `Atleta` (Info/Azul) e/ou `Sócio` (Verde) e/ou `EE` (Neutro/Cinza) |
| `Escalão` | Badge Neutro (ex: `Sub-15`). Vazio para Sócios não-atletas. |
| `Estado` | Badge: `Ativo` → Verde. `Pendente` → Amarelo. `Arquivado` → Neutro Cinza. |
| `Situação Financeira` | Badge: `Regularizado` → Verde (ícone `CheckCircle`). `Em Dívida` → Vermelho (ícone `AlertCircle`). |
| `Documentação` | Badge: `Válida` → Verde. `Em Validação` → Amarelo. `Caducada` → Vermelho. |

**Paginação:** `← Anterior` e `Próxima →` no rodapé (20 itens por página).
Linha de sumário: `A mostrar [1–20] de [12.450] registos`.

**Empty State (filtros sem resultados):**
- Ícone Lucide `SearchX` centrado, 48px, opacidade 10%.
- Título: `"Nenhum registo corresponde aos filtros aplicados."`
- Botão Outline: `Limpar Filtros`

**Empty State (sem dados):**
- Ícone Lucide `Users` centrado, 48px, opacidade 10%.
- Título: `"Nenhuma entidade registada no sistema."`
- Sub-título: `"Os registos são criados pela Secretaria."`

---

## ABA 4: Auditoria Financeira

**Objetivo:** Acesso read-only ao registo imutável de eventos financeiros
do sistema, restrito ao domínio financeiro e administrativo relevante para
o CFO (UC-16.1 — ator Secundário). O CFO não vê eventos clínicos, técnicos
ou de segurança de TI.

> **Nota de imutabilidade** (banner fixo no topo, fundo `#EFF6FF`, texto
> `#1D4ED8`, ícone Lucide `ShieldCheck`):
> `"Este registo é imutável (append-only). Nenhum dado pode ser editado ou
> eliminado. Visibilidade restrita a eventos do domínio financeiro."`

---

### Barra de Filtros

Linha horizontal:

- Input Date `De` — Placeholder: `"dd/mm/aaaa"`
- Input Date `Até` — Placeholder: `"dd/mm/aaaa"`
  - Validação: "De" anterior ou igual a "Até".
    Erro inline: `"A data inicial deve ser anterior à data final."`
- Dropdown `Tipo de Evento Financeiro` — Placeholder: `"Todos os Tipos"`.
  Opções:
  - `Todos os Tipos` *(default)*
  - `LIQUIDAÇÃO_PAGAMENTO` — pagamentos registados ao balcão
  - `GERAÇÃO_PROVISÃO` — criação de lotes de mensalidades/quotas
  - `ALTERAÇÃO_ESTATUTO_SÓCIO` — mudança de vínculo associativo
  - `EMISSÃO_FATURA` — geração de fatura-recibo
  - `EXPORTAÇÃO_FINANCEIRA` — exportações de dados financeiros
- Input de pesquisa — Placeholder: `"Pesquisar por nome do ator ou entidade..."`
  (debounce ≥ 300ms após ≥ 3 caracteres).
- Botão de texto `Limpar Filtros` (visível quando ≥ 1 filtro ativo).
- Botão Outline: `Exportar CSV` (ícone Lucide `Download`).

---

### Tabela de Eventos Financeiros

**Status: Read-Only Absoluto.** Nenhuma célula é editável. Nenhuma ação de
escrita está disponível nesta tabela.

| Coluna | Detalhes |
|---|---|
| `Data / Hora` | Formato: `DD MMM AAAA, HH:MM:SS` (ex: `13 Mai 2026, 14:32:05`). |
| `Evento` | Soft Badge com código de cor: `LIQUIDAÇÃO_PAGAMENTO` → Verde. `GERAÇÃO_PROVISÃO` → Azul Info. `ALTERAÇÃO_ESTATUTO_SÓCIO` → Amarelo. `EMISSÃO_FATURA` → Neutro Cinza. `EXPORTAÇÃO_FINANCEIRA` → Neutro Cinza. |
| `Ator` | Nome do utilizador responsável (Bold, 14px). Role abaixo em Gray 500 12px (ex: `Secretaria`). |
| `Entidade Afetada` | Nome da entidade financeira (ex: `Carlos Silva [EE]`) ou tipo de operação em lote (ex: `Lote 230 débitos`). |
| `Centro de Responsabilidade` | Badge: `Clube` → Neutro Cinza. `SAD` → Amarelo (fundo `#FFFBEB`, texto `#B45309`). `Ambos` → Azul Info. |
| `Valor` | Formatado em euros (ex: `120,00 €`). Para lotes: valor total do lote. Cor `#0F172A`. |
| `Detalhe` | Botão Outline `Ver Detalhe` → abre **Modal "Detalhe de Evento Financeiro"**. |

**Paginação:** `← Anterior` e `Próxima →` no rodapé (20 itens por página).
Linha de sumário: `A mostrar [1–20] de [N] eventos`.

**Empty State (sem eventos no período/filtro):**
- Ícone Lucide `FileSearch` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Nenhum evento financeiro encontrado."`
- Sub-título: `"Ajuste o período ou os filtros de tipo de evento."`
- Botão Outline: `Limpar Filtros`

---

## Modais e Componentes Globais

**Regras Globais:**
- Todos os modais têm botão `✕` de fecho (ícone Lucide `X`) no canto superior
  direito.
- Clicar no backdrop escuro fecha o modal sem guardar.
- Todos os modais desta aba são read-only: o rodapé tem apenas um botão
  `Fechar` (Outline), exceto onde indicado.
- Campos numéricos: formatação portuguesa (ponto = milhar, vírgula = decimal,
  símbolo `€` com espaço).

---

### Modal 1 — "Drill-down do Passivo Pendente"

*(Abre ao clicar em `Ver detalhes por escalão` no KPI "Passivo Pendente")*

- **Título:** `Passivo Pendente — Detalhe por Escalão e Tipologia`
- **Sub-título:** Período analisado: `[preset ou intervalo selecionado]`
  (Gray 500, 12px)

**Tabela de Detalhe (read-only):**

| Coluna | Detalhes |
|---|---|
| `Escalão` | Badge Neutro (ex: `Sub-15`, `Sub-17`, `Seniores`) |
| `Tipologia` | Texto (ex: `Mensalidade Base`, `Mensalidade Sócio`, `Quota Associativa`) |
| `Nº de Débitos` | Número inteiro (ex: `45`) |
| `Valor em Dívida` | Formatado em euros, cor `#991B1B` (ex: `1.575,00 €`) |
| `Entidade` | Badge: `Clube` (Neutro) ou `SAD` (Amarelo) |
| `Antiguidade Média` | Em dias (ex: `42 dias`). Badge Vermelho se > 30 dias. |

**Linha de Totais (rodapé da tabela, fundo `#F8FAFC`, Bold):**
`Total: 230 débitos · 45.200,00 €`

**Paginação:** `← Anterior` e `Próxima →` (10 itens por página).

**Empty State (sem dívida):**
- Ícone Lucide `CheckCircle` centrado, 40px, cor `#047857`, opacidade 50%.
- Título: `"Sem passivo pendente para o período selecionado."` (Verde)

**Rodapé do Modal:** Botão Outline `Fechar` (único botão, alinhado à direita).

---

### Modal 2 — "Detalhe de Evento Financeiro"

*(Abre ao clicar em `Ver Detalhe` na tabela da ABA 4)*

- **Título:** `Detalhe do Evento Financeiro`

**Bloco de Metadados** (fundo `#F8FAFC`, borda `1px #E2E8F0`, padding 12px,
radius 8px, grelha 2×4):
- `ID do Evento:` [UUID, fonte monoespaçada]
- `Data / Hora:` [DD MMM AAAA, HH:MM:SS]
- `Tipo de Evento:` [badge colorido]
- `Ator:` [Nome] — [Role]
- `Endereço IP:` [IPv4, fonte monoespaçada]
- `Centro de Responsabilidade:` [badge Clube / SAD / Ambos]
- `Entidade Afetada:` [Nome ou descrição]
- `Valor da Operação:` [formatado em euros]

**Bloco de Alterações (JSON)** (fundo `#1E293B`, padding 16px, radius 8px,
texto branco, fonte monoespaçada 13px, scrollbar vertical se > 250px de altura):
```json
{
  "event_id": "...",
  "timestamp": "...",
  "actor_id": "...",
  "entity_type": "...",
  "entity_id": "...",
  "financial_center": "CLUBE | SAD | AMBOS",
  "amount": "...",
  "changes": {
    "[campo]": {
      "before": "...",
      "after": "..."
    }
  }
}
```

**Rodapé do Modal:** Botão Outline `Fechar` (único botão, alinhado à direita).