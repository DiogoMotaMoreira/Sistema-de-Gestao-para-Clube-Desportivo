# Módulo: Presidência e Direção Executiva (Perfil: `ROLE_CEO`)

**Visão Geral:** Painel de comando estratégico da Presidência e Direção
Executiva do clube. Apresenta uma visão transversal e integrada de toda a
organização — financeira, desportiva e operacional — num único ecrã de
briefing executivo. Equivale ao "relatório de segunda-feira de manhã" do CEO:
permite avaliar, em 30 segundos, a saúde global do clube sem navegar por
módulos individuais. Todos os dados são estritamente **read-only**. O CEO
**nunca** executa operações transacionais.

**Página Inicial (Landing Page):** `ABA 1 — Visão Executiva Integrada`

> **Nota de RBAC (Regra de Ouro):** Zero escrita. Zero execução. Zero
> aprovação transacional. As únicas ações permitidas são leitura de dados
> agregados, aplicação de filtros e exportação de relatórios (CSV / PDF).
> Qualquer dado individual de atleta, ficha clínica ou conta corrente de EE
> está bloqueado por RBAC — o CEO acede apenas a agregados.

---

## Barra de Navegação Principal (sempre visível no topo do módulo)

Cinco abas fixas:
`Visão Executiva` | `Análise Financeira` | `Performance Desportiva` |
`Base Associativa` | `Auditoria`

---

## ABA 1: Visão Executiva Integrada

**Objetivo:** Dashboard de alto nível com KPIs financeiros, desportivos e
operacionais, alertas estratégicos e gráficos de evolução. Todos os
componentes desta aba reagem ao período selecionado na barra de filtros.

---

### Barra de Filtros Temporal (topo da Content Area)

**Layout:** Linha horizontal dentro de um cartão branco (`#FFFFFF`, borda
`1px #E2E8F0`, corner radius `12px`, padding 16px), fundo da Content Area
`#F8FAFC`.

- Label `Período de análise:` (Gray 500, 12px, alinhado à esquerda).
- Grupo de botões de seleção rápida (pill buttons; apenas um ativo de cada vez):
  - Estado ativo: fundo `#F1C40F`, texto `#000000` SemiBold, sem borda.
  - Estado inativo: fundo transparente, borda `1px #E2E8F0`, texto `#0F172A`.
  - Opções: `Esta Semana` | `Este Mês` | `Época Ativa` *(ativo por defeito)* |
    `Personalizado`
- Quando `Personalizado` está selecionado, revelam-se dois inputs de data
  inline:
  - Input `De` — Placeholder: `"dd/mm/aaaa"`. Borda `1px #E2E8F0`,
    corner radius `8px`, fundo `#FFFFFF`.
  - Input `Até` — Placeholder: `"dd/mm/aaaa"`. Mesma especificação.
  - Validação: "De" deve ser anterior ou igual a "Até".
    Erro inline (abaixo dos inputs): `"A data inicial deve ser anterior à data final."` (12px, `#DC2626`).
- Botão Outline `Gerar Relatório Executivo (PDF)` (extremo direito, ícone
  Lucide `FileText`) → abre **Modal "Gerar Relatório Executivo (PDF)"**.

**Comportamento de atualização:** Ao alterar qualquer controlo de período,
todos os KPIs, alertas e gráficos da aba atualizam de forma assíncrona (sem
reload da página). Durante a atualização, cada bloco exibe um skeleton shimmer
(retângulo cinzento animado, `#E2E8F0`, sobre o conteúdo anterior). A barra
de filtros mantém-se interativa durante o loading.

---

### Bloco de Alertas Estratégicos

**Layout:** Cartão de largura total (`100%`), fundo e borda condicionais:
- Se existirem alertas ativos: fundo `#FFFBEB`, borda `1px #B45309`.
- Se não existirem alertas: fundo `#ECFDF5`, borda `1px #047857`.
Corner radius `12px`, padding `16px`.

**Cabeçalho do bloco:**
- Ícone Lucide `Bell` (16px) + Título `Alertas Estratégicos` (14px, SemiBold,
  `#0F172A`), alinhados à esquerda.

**Estado com alertas ativos (lista vertical de linhas de alerta):**
Cada linha de alerta contém:
- Ícone Lucide `AlertTriangle` (14px, `#B45309`) à esquerda.
- Texto do alerta (14px, `#0F172A`) ao centro.
- Badge de severidade à direita: `Crítico` → fundo `#FEE2E2` texto `#991B1B`;
  `Aviso` → fundo `#FFFBEB` texto `#B45309`; `Info` → fundo `#EFF6FF`
  texto `#1D4ED8`.

Linhas de alerta possíveis (exemplos com dados dinâmicos):
[AlertTriangle] "[3] escalões com fichas de jogo em incumprimento"           [Crítico]
[AlertTriangle] "Taxa de regularidade de sócios desceu 8% este mês"          [Aviso]
[AlertTriangle] "[23] atletas com documentação a expirar nos próximos 30 dias" [Aviso]
[AlertTriangle] "Gateway de comunicações: Offline — [12] notificações falhadas" [Crítico]
Cada linha é separada por divisor `1px #E2E8F0`.

**Estado sem alertas:**
- Ícone Lucide `CheckCircle` (16px, `#047857`) + Texto `"Sem alertas críticos
  ativos — Clube operacionalmente saudável."` (14px, `#047857`).
- O bloco mantém a altura mínima de 56px mesmo no estado positivo.

---

### Linha 1 — KPIs Financeiros (4 Cartões)

**Layout:** Quatro cartões em grelha de 4 colunas (desktop), 2×2 (tablet),
1 coluna (mobile). Cada cartão: fundo `#FFFFFF`, borda `1px #E2E8F0`,
corner radius `16px`, sombra suave (Y=1, Blur=2, opacidade 5%).

> **Formatação de moeda (aplicada a todos os valores monetários do módulo):**
> Separador de milhares = `.` (ponto). Separador decimal = `,` (vírgula).
> Símbolo `€` com espaço após o número. Ex: `1.240.500,00 €`, `45.200,00 €`.
> Valores inteiros sem casas decimais. Ex: `12.450`.

---

**KPI F1 — Receita Total (YTD)**

- Ícone Lucide `TrendingUp` (24px, Gray 200) — canto superior direito do cartão.
- Label: `RECEITA TOTAL (YTD)` (10px, UPPERCASE, Gray 500).
- Valor: ex. `1.240.500,00 €` (Bold 700, 28px, `#0F172A`).
- **Badge de variação vs. época anterior:**
  - Positiva (> 0%): ícone Lucide `ArrowUpRight` (14px) + texto, ambos
    `#047857`. Ex: `+12,3% vs. época anterior`.
  - Negativa (< 0%): ícone Lucide `ArrowDownRight` (14px) + texto, ambos
    `#991B1B`. Ex: `-4,1% vs. época anterior`.
  - Neutra (= 0%): ícone Lucide `Minus` (14px) + texto, ambos Gray 500.
    Ex: `Sem variação vs. época anterior`.
- Subtexto: `Época 2025/2026` (12px, Gray 500).

---

**KPI F2 — Passivo Pendente**

- Ícone Lucide `AlertCircle` (24px, `#991B1B`) — canto superior direito.
- Label: `PASSIVO PENDENTE` (10px, UPPERCASE, Gray 500).
- Valor: ex. `45.200,00 €` (Bold 700, 28px, `#991B1B`).
- **Badge de variação** (lógica invertida: redução = melhoria = verde;
  aumento = agravamento = vermelho):
  - Redução (vs. período anterior): `#047857` + `ArrowDownRight`.
    Ex: `-8,2% vs. mês anterior` em verde = melhoria.
  - Aumento: `#991B1B` + `ArrowUpRight`. Ex: `+5,1% vs. mês anterior`.
- Subtexto: `230 mensalidades em atraso` (12px, Gray 500).
- **Divisor horizontal** `1px #E2E8F0` no rodapé do cartão.
- **Link de drill-down** (abaixo do divisor): botão de texto `Ver detalhes
  por escalão` (12px, `#1D4ED8`, ícone Lucide `ChevronRight` à direita) →
  abre **Modal "Drill-Down da Dívida por Escalão"**.

---

**KPI F3 — Taxa de Regularidade Financeira**

- Ícone Lucide `PieChart` (24px, Gray 200) — canto superior direito.
- Label: `TAXA DE REGULARIDADE FINANCEIRA` (10px, UPPERCASE, Gray 500).
- **Gauge circular compacto** (mini, 64px de diâmetro, espessura do arco 8px):
  - Arco preenchido: cor progressiva por faixa:
    - ≥ 85%: `#047857` (Verde Sucesso)
    - 70%–84%: `#B45309` (Amarelo/Aviso)
    - < 70%: `#991B1B` (Vermelho Destrutivo)
  - Arco de fundo (vazio): `#E2E8F0`.
  - Valor no centro do gauge: ex. `88%` (Bold 700, 16px, mesma cor do arco).
- Subtexto linha 1: `Sócios com quotas em dia` (12px, Gray 500).
- Subtexto linha 2: `10.956 de 12.450 sócios` (12px, `#0F172A` Bold para
  os números, Gray 500 para o texto de ligação).

---

**KPI F4 — Fluxo de Caixa do Período**

- Ícone Lucide `Banknote` (24px, Gray 200) — canto superior direito.
- Label: `FLUXO DE CAIXA DO PERÍODO` (10px, UPPERCASE, Gray 500).
- Valor total: ex. `2.100,00 €` (Bold 700, 28px, `#0F172A`).
- **Badge de variação:** mesmas regras de cor do KPI F1.
- **Mini-tabela de breakdown por canal** (fundo `#F8FAFC`, padding 8px,
  corner radius 8px, borda `1px #E2E8F0`; três linhas):
  - `Numerário` ............... `320,00 €`
  - `Multibanco` .............. `1.240,00 €`
  - `MBWay` .................. `540,00 €`
  - Separador visual entre canal (Gray 500, 11px) e valor (Bold 12px, `#0F172A`),
    os pontos são `...` em Gray 200 para preenchimento visual.

**Estado Vazio de todos os KPIs Financeiros (período sem dados):**
- Valor substituído por `— €` ou `—` (Bold 700, 28px, Gray 200).
- Badge de variação oculta.
- Subtexto: `"Sem dados para o período selecionado."` (12px, Gray 500,
  itálico).
- Gauge do KPI F3: arco completamente cinzento (`#E2E8F0`), centro mostra `—`.

---

### Linha 2 — KPIs Desportivos (3 Cartões)

**Layout:** Três cartões em grelha de 3 colunas (desktop), 1 coluna (mobile).
Mesma especificação visual dos KPIs Financeiros.

> **Nota de RBAC:** Estes dados são lidos do motor agregado de RF-13 (Direção
> Técnica), mas sem drill-down individual de atleta. O CEO vê apenas agregados
> globais por escalão.

---

**KPI D1 — Resultados da Última Jornada**

- Ícone Lucide `Trophy` (24px, Gray 200) — canto superior direito.
- Label: `RESULTADOS DA ÚLTIMA JORNADA` (10px, UPPERCASE, Gray 500).
- **Três mini-badges inline** (todos os escalões combinados):
  - `[V] Vitórias` → fundo `#ECFDF5`, texto `#047857`. Ex: `7 Vitórias`.
  - `[E] Empates` → fundo `#FFFBEB`, texto `#B45309`. Ex: `3 Empates`.
  - `[D] Derrotas` → fundo `#FEE2E2`, texto `#991B1B`. Ex: `2 Derrotas`.
- Subtexto: `12 jogos disputados · Época 2025/2026` (12px, Gray 500).

---

**KPI D2 — Taxa de Submissão de Fichas de Jogo**

- Ícone Lucide `ClipboardCheck` (24px, Gray 200) — canto superior direito.
- Label: `FICHAS DE JOGO SUBMETIDAS NO PRAZO` (10px, UPPERCASE, Gray 500).
- **Gauge circular compacto** (64px, espessura 8px; mesmas regras de cor
  progressiva do KPI F3, com os mesmos limiares ≥85% / 70–84% / <70%):
  - Valor no centro: ex. `92%` (Bold 700, 16px, cor progressiva).
- Subtexto: `11 de 12 jogos com ficha dentro do prazo` (12px, Gray 500).
- Linha de detalhe: se existirem jogos fora do prazo: badge Vermelho
  `[N] incumprimento(s) pendente(s)` (12px).

---

**KPI D3 — Atletas em Incumprimento**

- Ícone Lucide `UserX` (24px, `#991B1B`) — canto superior direito.
- Label: `ATLETAS BLOQUEADOS` (10px, UPPERCASE, Gray 500).
- Valor total: ex. `31` (Bold 700, 28px, `#991B1B`).
- **Três badges por categoria** (abaixo do valor, em linha):
  - `Documental: [N]` → badge Vermelho.
  - `Clínico: [N]` → badge Amarelo.
  - `Financeiro: [N]` → badge Vermelho.
- Subtexto: `Atletas inaptos para treino ou convocatória` (12px, Gray 500).

**Estado Vazio dos KPIs Desportivos (sem jogos no período):**
- Valor substituído por `—`.
- Subtexto: `"Sem dados desportivos para o período selecionado."` (12px,
  Gray 500, itálico).

---

### Linha 3 — KPIs Operacionais (3 Cartões)

**Layout:** Três cartões em grelha de 3 colunas (desktop), 1 coluna (mobile).

---

**KPI O1 — Sócios Ativos**

- Ícone Lucide `Users` (24px, Gray 200) — canto superior direito.
- Label: `SÓCIOS ATIVOS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `12.450` (Bold 700, 28px, `#0F172A`).
- **Badge de variação:** mesmas regras do KPI F1 (comparação vs. mesmo período
  da época anterior).
- Subtexto: `Vínculo associativo ativo e regularizado` (12px, Gray 500).

---

**KPI O2 — Atletas Federados**

- Ícone Lucide `ShieldCheck` (24px, Gray 200) — canto superior direito.
- Label: `ATLETAS FEDERADOS` (10px, UPPERCASE, Gray 500).
- Valor: ex. `450` (Bold 700, 28px, `#0F172A`).
- **Badge de variação:** mesmas regras do KPI F1.
- Subtexto: `Distribuídos por 18 equipas ativas` (12px, Gray 500).
- **Tooltip ao hover no valor** (cartão flutuante fundo `#0F172A`, texto
  branco 12px): distribuição por escalão, ex:
Sub-13:   62 atletas
Sub-15:   87 atletas
Sub-17:   74 atletas
Sub-19:   58 atletas
Seniores: 169 atletas

---

**KPI O3 — Saúde Documental**

- Ícone Lucide `FileCheck` (24px, Gray 200) — canto superior direito.
- Label: `SAÚDE DOCUMENTAL` (10px, UPPERCASE, Gray 500).
- **Gauge circular compacto** (64px, espessura 8px; mesmas regras de cor
  progressiva do KPI F3):
  - Representa `% atletas com EMD válido E CC válido`.
  - Valor no centro: ex. `87%` (Bold 700, 16px, cor progressiva).
- Subtexto linha 1: `Atletas com toda a documentação válida` (12px, Gray 500).
- Subtexto linha 2: `392 de 450 atletas` (12px, Bold para números).

**Estado Vazio dos KPIs Operacionais:** Valor `—`, subtexto `"Sem dados para
o período."` (12px, Gray 500, itálico).

---

### Secção de Gráficos Principais

**Layout:** Dois painéis lado a lado (~65% esquerda / ~35% direita) em
desktop; empilhados em mobile. Cada painel é um cartão `#FFFFFF`, borda
`1px #E2E8F0`, corner radius `16px`, sombra suave.

---

**Painel Esquerdo: Gráfico de Barras "Evolução Mensal de Proveitos — Clube
vs. SAD"**

- **Tipo:** Barras Verticais Agrupadas (grouped bar chart). Para cada período,
  duas barras lado a lado. Nunca sobrepostas nem empilhadas.
- **Eixo X:** Meses do período (abreviados: `Jan`, `Fev`, `Mar`, `Abr`,
  `Mai`). Label 12px, Gray 500. Sem linhas verticais.
- **Eixo Y (esquerda):** Valores em euros com sufixo `k` (ex: `0`, `20k`,
  `40k`, `60k`). Label 12px, Gray 500. Linhas de grelha horizontais:
  `1px #E2E8F0`, tracejadas.
- **Cores das Barras:**
  - Barra Clube: cor `#000000` (Preto Puro), corner radius `4px` no topo.
  - Barra SAD: cor `#F1C40F` (Dourado Boavista), corner radius `4px` no topo.
- **Legenda permanente** (acima do gráfico, alinhada à direita):
  - Ponto circular `#000000` (8px) + texto `Clube` (12px, Gray 500).
  - Ponto circular `#F1C40F` (8px) + texto `SAD` (12px, Gray 500).
- **Tooltip ao fazer hover** (cartão flutuante, fundo `#0F172A`, texto branco,
  corner radius `8px`, sombra forte, padding `12px`):
Abril 2026
─────────────────────
Clube:   48.000,00 €
SAD:     35.000,00 €
─────────────────────
Total:   83.000,00 €
  O separador `─────` é uma linha `1px rgba(255,255,255,0.2)`.
- **Controlos adicionais** (canto superior direito do cartão, antes da
  legenda): Toggle pills `Época Atual` *(ativo por defeito)* |
  `Época Anterior` | `Comparar Épocas`. Quando `Comparar Épocas`: cada mês
  exibe 4 barras (Clube Atual, SAD Atual, Clube Anterior — opacidade 40%,
  SAD Anterior — opacidade 40%).
- **Empty State:**
  - Fundo `#F8FAFC` na área do gráfico.
  - Ícone Lucide `BarChart2` centrado, 48px, opacidade 10%, Gray 200.
  - Título: `"Sem dados de proveitos para o período selecionado."` (14px,
    Gray 500, centrado).
  - Botão Outline: `Ajustar Período`.

---

**Painel Direito: Gráfico Donut "Distribuição de Atletas por Escalão"**

- **Tipo:** Donut (anel circular, espessura ~28px, fundo central vazio).
- **Paleta de cores das fatias** (atribuída por escalão, ordem fixa):
  - Sub-13: `#F1C40F` (Dourado Boavista)
  - Sub-15: `#000000` (Preto Puro)
  - Sub-17: `#64748B` (Gray 500)
  - Sub-19: `#0F172A` (Gray 900)
  - Seniores: `#94A3B8` (Gray 400)
  - Outros: `#E2E8F0` (Gray 200)
- **Centro do Donut:** Número total de atletas (Bold 700, 22px, `#0F172A`)
  + label `"Atletas"` (12px, Gray 500) na linha abaixo.
- **Legenda** (abaixo do gráfico, grelha 2 colunas):
  Cada item: ponto colorido (8px) + `[Escalão]` + `[N] at.` + `([XX]%)`.
  Ex: `● Sub-15  87 at. (19%)`  (12px, `#0F172A`).
- **Tooltip ao hover numa fatia** (cartão fundo `#0F172A`, texto branco,
  padding `12px`, corner radius `8px`):
Sub-15
──────────────
87 atletas
19% do total
- **Empty State:**
  - Anel tracejado cinzento (`#E2E8F0`) no lugar do donut.
  - Texto centrado: `"Sem dados demográficos."` (14px, Gray 500).

---

### Rodapé do Dashboard

Linha discreta (Gray 500, 12px, alinhada à direita, dentro da Content Area):
`Dados calculados às [HH:MM] de hoje  ·  Última sincronização: [DD/MM/AAAA HH:MM]  ·  Época ativa: 2025/2026`

---

## ABA 2: Análise Financeira

**Objetivo:** Análise financeira aprofundada em três perspetivas: Tesouraria
e Incumprimento, Análise Clube vs. SAD e Fluxos de Caixa.

---

### Sub-navegação horizontal (tabs internas da ABA 2)

Três tabs em linha, dentro da Content Area (não são abas do módulo):
`Tesouraria e Incumprimento` *(ativa por defeito)* | `Clube vs. SAD` |
`Fluxos de Caixa`

- Tab ativa: sublinhado `2px #F1C40F`, texto `#0F172A` SemiBold.
- Tab inativa: sem sublinhado, texto Gray 500.

---

### Tab "Tesouraria e Incumprimento" (UC-05.2 / RF-30)

**Barra de Filtros e Ações:**
- Grupo de presets: `Este Mês` | `Trimestre` | `Época Ativa` *(defeito)* |
  `Personalizado`. Mesma especificação visual da ABA 1.
- Quando `Personalizado`: inputs `De` e `Até` (mesma especificação da ABA 1).
- Botão Outline: `Exportar PDF` (ícone Lucide `FileText`).
- Botão Outline: `Exportar Excel` (ícone Lucide `Sheet`).

**KPIs da Tab (3 cartões em linha):**

Cartão 1 — `RECEITA CAPTADA`:
- Valor formatado. Ex: `1.240.500,00 €` (Bold 700, 24px, `#0F172A`).
- Badge de variação (mesmas regras do KPI F1 da ABA 1).

Cartão 2 — `DÍVIDA VENCIDA TOTAL`:
- Valor formatado. Ex: `45.200,00 €` (Bold 700, 24px, `#991B1B`).
- Badge de variação (lógica invertida — redução = verde).
- Link rodapé: `Ver detalhes por escalão` (`#1D4ED8`, ícone `ChevronRight`)
  → abre **Modal "Drill-Down da Dívida por Escalão"**.

Cartão 3 — `RÁCIO DE LIQUIDEZ`:
- Fórmula: `Receita Captada / (Receita Captada + Dívida Vencida) × 100`.
- Valor formatado: ex. `96,5%` (Bold 700, 24px).
- Cor do valor: ≥ 85% → `#047857`; 70–84% → `#B45309`; < 70% → `#991B1B`.
- Badge de variação (mesmas regras do KPI F1, comparando com período anterior).
- Tooltip ao hover no valor (cartão fundo `#0F172A`, texto branco, 12px):
Rácio de Liquidez
───────────────────────────
Receita captada: 1.240.500,00 €
Dívida vencida:     45.200,00 €
Rácio:               96,5%

**Gráfico de Linha "Evolução de Receita vs. Dívida":**
- Tipo: Linhas duplas no mesmo gráfico.
- Eixo X: Meses do período (abreviados, 12px, Gray 500).
- Eixo Y (esquerda): Valores em euros com sufixo `k` (12px, Gray 500).
  Linhas de grelha horizontais: `1px #E2E8F0` tracejadas.
- Linha Receita: cor `#047857`, espessura `2px`. Área preenchida abaixo da
  linha: `#047857` a 8% de opacidade.
- Linha Dívida: cor `#991B1B`, espessura `2px`. Área: `#991B1B` a 8%.
- Pontos nos nós: círculo sólido 6px, cor da linha respectiva.
- Legenda permanente (acima do gráfico, direita):
  - Linha `#047857` + `Receita Captada` (12px, Gray 500).
  - Linha `#991B1B` + `Dívida Vencida` (12px, Gray 500).
- Tooltip ao hover (cartão fundo `#0F172A`, texto branco, 12px):
Março 2026
─────────────────────────
Receita:   83.000,00 €
Dívida:     3.200,00 €
- **Empty State:**
  - Fundo `#F8FAFC`. Ícone Lucide `LineChart` centrado, 48px, opacidade 10%.
  - Título: `"Sem dados financeiros para o período selecionado."` (14px, Gray 500).
  - Botão Outline: `Ajustar Período`.

---

### Tab "Clube vs. SAD" (UC-05.3 / RF-32 / RNF-27)

> **Conformidade RNF-27:** Os saldos do Clube e da SAD nunca aparecem
> combinados sem filtro de centro de responsabilidade explícito. Os dois
> painéis são sempre independentes.

**Barra de Filtros e Ações:** Idêntica à tab anterior (presets + Personalizado
+ Exportar PDF + Exportar Excel).

**Dois Painéis Comparativos Independentes (50% / 50%):**
- Painel Esquerdo: badge `ASSOCIAÇÃO / CLUBE` (fundo `#0F172A`, texto
  `#FFFFFF`, 12px, corner radius `8px`).
- Painel Direito: badge `SAD / FORMAÇÃO` (fundo `#FFFBEB`, texto `#B45309`,
  12px, corner radius `8px`).
- Cada painel: cartão `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`,
  sombra suave. Em mobile: empilhados verticalmente.

**Conteúdo de cada Painel (estrutura idêntica, valores distintos):**

Bloco A — KPIs da Entidade (3 métricas em linha horizontal, separadas por
divisores `1px #E2E8F0`):

  Métrica 1 — `RECEITA CAPTADA`:
  - Valor formatado. Ex: Clube `820.300,00 €` / SAD `420.200,00 €`
    (18px, Bold, `#0F172A`).
  - Badge de variação (regras do KPI F1).

  Métrica 2 — `DÍVIDA VENCIDA`:
  - Valor formatado. Ex: Clube `28.500,00 €` / SAD `16.700,00 €`
    (18px, Bold, `#991B1B`).
  - Badge de variação (lógica invertida).

  Métrica 3 — `RÁCIO DE COBERTURA`:
  - Fórmula: `Receita / (Receita + Dívida) × 100`.
  - Ex: `96,6%` (18px, Bold, cor progressiva: ≥85% `#047857`, 70–84%
    `#B45309`, <70% `#991B1B`).
  - Tooltip ao hover (cartão fundo `#0F172A`, texto branco, 12px):
Rácio de Cobertura Operacional
─────────────────────────────────
Receita captada:   820.300,00 €
Dívida vencida:     28.500,00 €
Eficiência:             96,6%

Bloco B — Gráfico de Linha "Evolução Mensal da Entidade":
- Eixo X: meses (abreviados, 12px Gray 500).
- Eixo Y: euros com sufixo `k` (12px Gray 500). Grelha tracejada `1px #E2E8F0`.
- Clube: linha `#000000`, 2px. SAD: linha `#F1C40F`, 2px.
  Área abaixo: 8% opacidade da cor da linha.
- Pontos nos nós: círculo 6px, cor da linha.
- Tooltip ao hover (cartão fundo `#0F172A`, texto branco, 12px):
  Clube:
Abril 2026 — CLUBE
─────────────────────
Receita:  48.000,00 €
Dívida:    1.800,00 €
  SAD (tooltip análoga).
- **Empty State de cada gráfico de linha:**
  - Linha tracejada horizontal (Gray 200) no centro da área.
  - Ícone Lucide `LineChart` centrado, 40px, opacidade 10%.
  - `"Sem dados para esta entidade no período."` (12px, Gray 500).

Bloco C — Tabela de Rubricas da Entidade:
- Título: `Detalhe por Rubrica` (14px, SemiBold, `#0F172A`).
- Colunas:

| RUBRICA | ESCALÃO | DÉBITOS GERADOS | VALOR TOTAL | LIQUIDADO | EM DÍVIDA | TAXA LIQ. |
|---|---|---|---|---|---|---|
| Ex: `Mensalidade Sócio Sub-15` | Badge `Sub-15` | `245` | `8.575,00 €` | `7.906,00 €` | `669,00 €` | `92,2%` |

  - Coluna `TAXA LIQ.`: cor progressiva por valor (≥85% → `#047857`;
    70–84% → `#B45309`; <70% → `#991B1B`).
  - Coluna `EM DÍVIDA`: cor `#991B1B`.
  - Coluna `LIQUIDADO`: cor `#047857`.
- Paginação: `← Anterior` e `Próxima →` (10 itens por página).
- **Empty State da tabela:**
  - Ícone Lucide `Table` centrado, 40px, opacidade 10%.
  - `"Sem rubricas registadas para este centro no período."` (14px, Gray 500).

---

### Tab "Fluxos de Caixa" (RF-34)

**Barra de Filtros e Ações:** Presets temporais + Personalizado + Botão
Outline `Exportar CSV` (ícone Lucide `Download`).

**Tabela de Agregação por Canal:**

| CANAL | VALOR TOTAL (CLUBE) | VALOR TOTAL (SAD) | TOTAL COMBINADO |
|---|---|---|---|
| Numerário | `1.200,00 €` | `320,00 €` | `1.520,00 €` |
| Multibanco | `4.800,00 €` | `1.100,00 €` | `5.900,00 €` |
| MBWay | `1.800,00 €` | `540,00 €` | `2.340,00 €` |
| **Total** | **`7.800,00 €`** | **`1.960,00 €`** | **`9.760,00 €`** |

Especificação visual:
- Linha `Total`: fundo `#F8FAFC`, texto Bold.
- Colunas monetárias: alinhadas à direita.
- Cabeçalhos: UPPERCASE, 12px, Gray 500.
- Hover nas linhas: fundo `#F1F5F9`.

**Empty State:**
- Ícone Lucide `Banknote` centrado, 48px, opacidade 10%.
- Título: `"Sem fluxos de caixa registados no período selecionado."` (14px,
  Gray 500).
- Subtítulo: `"Ajuste o período de análise."` (12px, Gray 500).
- Botão Outline: `Ajustar Período`.

---

## ABA 3: Performance Desportiva

**Objetivo:** Vista read-only dos resultados desportivos agregados do clube,
consumindo os dados de RF-13 (Direção Técnica) sem drill-down individual de
atleta. Toda a informação é estritamente de consulta.

> **Nota de RBAC:** O CEO não acede ao perfil individual de atletas. Esta aba
> mostra apenas agregados por escalão. Nenhuma linha é clicável para detalhe
> individual.

---

### Barra de Filtros e Ações

- Dropdown `Escalão` — Placeholder: `"Todos os Escalões"`. Opções:
  `Todos os Escalões` *(defeito)* · `Sub-13` · `Sub-15` · `Sub-17` ·
  `Sub-19` · `Seniores`.
- Grupo de presets temporais: `Esta Semana` | `Este Mês` | `Época Ativa`
  *(defeito)* | `Personalizado`.
- Quando `Personalizado`: inputs `De` e `Até` (mesma especificação da ABA 1).

---

### KPIs Desportivos da Tab (linha de 4 cartões)

Cartão 1 — `JOGOS DISPUTADOS`:
- Valor: ex. `36` (Bold 700, 28px, `#0F172A`).
- Subtexto: `No período selecionado` (12px, Gray 500).

Cartão 2 — `DISTRIBUIÇÃO DE RESULTADOS`:
- Três badges em linha:
  - `[V] V` → fundo `#ECFDF5`, texto `#047857`. Ex: `21 V`.
  - `[E] E` → fundo `#FFFBEB`, texto `#B45309`. Ex: `8 E`.
  - `[D] D` → fundo `#FEE2E2`, texto `#991B1B`. Ex: `7 D`.
- Subtexto: `V = Vitória  ·  E = Empate  ·  D = Derrota` (10px, Gray 500).

Cartão 3 — `MÉDIA DE GOLOS POR JOGO`:
- Dois valores em linha:
  - `2,3 a favor` (Bold, `#047857`).
  - `1,1 contra` (Bold, `#991B1B`).
- Subtexto: `Golos marcados e sofridos por jogo` (12px, Gray 500).

Cartão 4 — `FICHAS DE JOGO PENDENTES`:
- Valor: ex. `2` (Bold 700, 28px, `#B45309` se > 0, `#047857` se = 0).
- Subtexto: `Jogos dentro da janela de 24h` (12px, Gray 500).
- Se > 0: badge Amarelo adicional: `Dados provisórios incluídos nas métricas`.

---

### Tabela de Resultados por Escalão

**Nota:** Read-Only Absoluto. Nenhuma linha tem ação de navegação.

| ESCALÃO | JOGOS | V | E | D | GOLOS FAVOR | GOLOS CONTRA | SALDO | ESTADO DOS DADOS |
|---|---|---|---|---|---|---|---|---|
| Sub-15 | 8 | 5 | 2 | 1 | 18 | 9 | +9 | — |
| Sub-17 | 7 | 4 | 1 | 2 | 12 | 8 | +4 | `Provisório` |

- Coluna `SALDO`: verde se positivo (`#047857`), vermelho se negativo
  (`#991B1B`), cinza se zero (Gray 500).
- Coluna `ESTADO DOS DADOS`: badge Amarelo `Dados provisórios` nas linhas
  com fichas de jogo dentro da janela de 24h (RF-10/RF-13). Vazio nas
  restantes.
- Hover das linhas: fundo `#F1F5F9`.
- Paginação: `← Anterior` e `Próxima →`.

**Gráfico de Barras Horizontais "Win Rate (%) por Escalão":**
- Tipo: Barras horizontais. Uma barra por escalão.
- Eixo Y: nomes dos escalões (12px, Gray 500).
- Eixo X: percentagem 0% a 100%, marcas a cada 25% (12px, Gray 500).
- Cor das barras: `#F1C40F` (Dourado Boavista), corner radius `4px` à direita.
- Linha de referência a `50%`: `2px #E2E8F0` tracejada + label `50%` (10px,
  Gray 500).
- Tooltip ao hover numa barra (cartão fundo `#0F172A`, texto branco, 12px):
Sub-15
─────────────────
Win Rate:  62,5%
5V / 2E / 1D
8 jogos disputados
- **Empty State:**
  - Ícone Lucide `Trophy` centrado, 48px, opacidade 10%, Gray 200.
  - Título: `"Sem dados desportivos para o período selecionado."` (14px,
    Gray 500).
  - Subtítulo: `"Aguarde que os jogos sejam registados pela equipa técnica."` (12px, Gray 500).
  - Botão Outline: `Ajustar Período`.

---

## ABA 4: Base Associativa

**Objetivo:** Monitorização read-only da base de sócios e atletas com filtros
demográficos e exportação CSV (RF-31). Sem qualquer operação de criação ou
edição — esse domínio pertence à Secretaria.

> **Nota RBAC:** Esta aba é estritamente de consulta. A gestão de fichas de
> EE/Sócios pertence à Secretaria (UC-02, RF-36).

---

### Mini-Dashboard de Topo (3 métricas em linha)

Três blocos em linha horizontal, separados por divisores `1px #E2E8F0`,
dentro de um cartão `#FFFFFF`, corner radius `12px`:

- `SÓCIOS ATIVOS` — valor ex. `12.450` (Bold 20px, `#0F172A`) + badge de variação.
- `TAXA DE REGULARIDADE` — valor ex. `88%` (Bold 20px, cor progressiva) +
  subtexto `[10.956] em dia`.
- `ATLETAS INSCRITOS` — valor ex. `450` (Bold 20px, `#0F172A`) + subtexto
  `Em 18 equipas`.

---

### Barra de Filtros Demográficos e Exportação

- Dropdown `Escalão` — Placeholder: `"Todos os Escalões"`. Opções: `Todos
  os Escalões` *(defeito)* · `Sub-13` · `Sub-15` · `Sub-17` · `Sub-19` ·
  `Seniores` · `Outro`.
- Dropdown `Faixa Etária` — Placeholder: `"Todas as Idades"`. Opções:
  `Todas as Idades` *(defeito)* · `< 13 anos` · `13–14 anos` · `15–16 anos`
  · `17–18 anos` · `≥ 19 anos`.
- Dropdown `Estado` — Placeholder: `"Todos os Estados"`. Opções:
  `Todos os Estados` *(defeito)* · `Ativo` · `Pendente` · `Arquivado`.
- Botão de texto `Limpar Filtros` (visível quando ≥ 1 filtro ativo; 12px,
  `#1D4ED8`).
- Botão Outline: `Exportar CSV` (ícone Lucide `Download`).

---

### Dois Gráficos Lado a Lado (50%/50%)

**Gráfico Esquerdo: Donut "Distribuição de Atletas por Escalão"**
- Mesmas especificações visuais do donut da ABA 1 (cores, legenda, centro,
  tooltip, empty state).
- Os filtros da barra de filtros aplicam-se a este gráfico.

**Gráfico Direito: Barras Horizontais "Sócios por Situação Financeira"**
- Tipo: Barras horizontais simples.
- Eixo Y: três categorias: `Regularizado`, `Em Dívida`, `Arquivado`.
- Eixo X: contagem absoluta (0 a N, marcas automáticas, 12px Gray 500).
- Cores:
  - `Regularizado`: `#047857`.
  - `Em Dívida`: `#991B1B`.
  - `Arquivado`: `#94A3B8` (Gray 400).
- Corner radius das barras: `4px` à direita.
- Valores absolutos visíveis à direita de cada barra (Bold, 12px, `#0F172A`).
  Ex: `10.956`, `1.194`, `300`.
- Tooltip ao hover (cartão fundo `#0F172A`, texto branco, 12px):
Regularizado
──────────────────
10.956 sócios
88% do total ativo
- **Empty State:**
  - Ícone Lucide `BarChart3` centrado, 48px, opacidade 10%.
  - `"Sem dados associativos disponíveis."` (14px, Gray 500).

---

### Tabela de Resumo Demográfico por Escalão

**Nota:** Read-Only Absoluto.

| ESCALÃO | ATLETAS ATIVOS | SÓCIOS (ATLETAS) | % DOCS EM DIA | % FINAN. REGULARIZADO |
|---|---|---|---|---|
| Sub-13 | 62 | 45 | 94,8% | 91,2% |
| Sub-15 | 87 | 71 | 78,2% | 85,1% |
| Sub-17 | 74 | 58 | 82,4% | 88,7% |
| Sub-19 | 58 | 40 | 91,4% | 79,3% |
| Seniores | 169 | 98 | 85,2% | 92,0% |

- Coluna `% DOCS EM DIA`: célula com fundo vermelho claro `#FEE2E2` e texto
  `#991B1B` quando valor < 80%. Célula com fundo verde claro `#ECFDF5` e
  texto `#047857` quando ≥ 80%.
- Coluna `% FINAN. REGULARIZADO`: mesma lógica de cor (limiar: < 80% =
  vermelho, ≥ 80% = verde).
- Linha de totais no rodapé (fundo `#F8FAFC`, texto Bold):
  `Total: 450 atletas · [X]% docs em dia · [Y]% financ. regularizado`.
- Hover nas linhas: fundo `#F1F5F9`.
- Paginação: `← Anterior` e `Próxima →`.

**Empty State (filtros sem resultados):**
- Ícone Lucide `SearchX` centrado, 48px, opacidade 10%.
- Título: `"Nenhum escalão corresponde aos filtros aplicados."` (14px, Gray 500).
- Botão Outline: `Limpar Filtros`.

**Empty State (sem dados):**
- Ícone Lucide `Users` centrado, 48px, opacidade 10%.
- Título: `"Sem dados populacionais disponíveis."` (14px, Gray 500).
- Subtítulo: `"Os registos são criados e geridos pela Secretaria."` (12px, Gray 500).

---

## ABA 5: Auditoria

**Objetivo:** Acesso read-only ao histórico imutável de todos os eventos do
sistema (UC-16.1 — CEO como ator Secundário). Visibilidade global (todos os
módulos), sem capacidade de edição ou eliminação.

**Banner fixo de imutabilidade** (topo da Content Area, fundo `#EFF6FF`,
texto `#1D4ED8`, ícone Lucide `ShieldCheck`, borda `1px #1D4ED8`):
`"Acesso de visualização apenas. Todos os registos são imutáveis (RF-24 / RNF-10). Nenhum dado pode ser editado ou eliminado."`

---

### Barra de Filtros e Ações

- Input Date `De` — Placeholder: `"dd/mm/aaaa"`.
- Input Date `Até` — Placeholder: `"dd/mm/aaaa"`.
  - Validação: "De" anterior ou igual a "Até".
    Erro inline: `"A data inicial deve ser anterior à data final."` (12px, `#DC2626`).
- Dropdown `Módulo de Origem` — Placeholder: `"Todos os Módulos"`. Opções:
  `Todos os Módulos` *(defeito)* · `Secretaria` · `Clínica / Departamento Médico`
  · `Tesouraria` · `Direção Técnica` · `Portal Utilizador` ·
  `Configurações Globais` · `Gestão de Acessos` · `Autenticação`.
- Dropdown `Tipo de Operação` — Placeholder: `"Todos os Tipos"`. Opções:
  `Todos os Tipos` *(defeito)* · `AUTENTICAÇÃO` · `CRIAÇÃO` · `EDIÇÃO` ·
  `AÇÃO DE SEGURANÇA` · `EXPORTAÇÃO` · `VALIDAÇÃO_DOCUMENTAL` ·
  `LIQUIDAÇÃO_FINANCEIRA` · `GESTÃO_CLÍNICA`.
- Input de pesquisa — Placeholder: `"Pesquisar por nome do ator ou entidade..."`
  (debounce ≥ 300ms após ≥ 3 caracteres).
- Botão de texto `Limpar Filtros` (visível quando ≥ 1 filtro ativo).
- Botão Outline: `Exportar Logs (CSV)` (ícone Lucide `Download`).

---

### Tabela de Auditoria

**Status: Read-Only Absoluto.** Nenhuma célula é editável nem há ações de
escrita.

| DATA / HORA | ATOR | AÇÃO | MÓDULO | ENDEREÇO IP | DETALHE |
|---|---|---|---|---|---|
| `13 Mai 2026, 14:32:05` | `João Silva` / `Secretaria` | badge `LIQUIDAÇÃO_PAGAMENTO` | `Tesouraria` | `192.168.1.45` | Botão `Ver Detalhe` |

Especificação das colunas:

- `DATA / HORA`: formato `DD MMM AAAA, HH:MM:SS` (14px, `#0F172A`).
- `ATOR`: Nome (Bold, 14px, `#0F172A`) + Role abaixo (12px, Gray 500).
- `AÇÃO`: Soft Badge com código de cor por categoria:
  - `AÇÃO DE SEGURANÇA` / `BLOQUEAR_ACESSO` → badge Vermelho (fundo `#FEE2E2`,
    texto `#991B1B`).
  - `CRIAÇÃO` → badge Verde (fundo `#ECFDF5`, texto `#047857`).
  - `EDIÇÃO` / `LIQUIDAÇÃO_FINANCEIRA` / `GERAÇÃO_PROVISÃO` → badge Azul Info
    (fundo `#EFF6FF`, texto `#1D4ED8`).
  - `AUTENTICAÇÃO` / `EXPORTAÇÃO` / `LEITURA` → badge Neutro (fundo `#F1F5F9`,
    texto `#64748B`).
  - `VALIDAÇÃO_DOCUMENTAL` / `GESTÃO_CLÍNICA` → badge Amarelo (fundo `#FFFBEB`,
    texto `#B45309`).
- `MÓDULO`: texto simples (14px, `#0F172A`).
- `ENDEREÇO IP`: fonte monoespaçada, 12px, Gray 500. Ex: `192.168.1.45`.
- `DETALHE`: Botão Outline `Ver Detalhe` → abre **Modal "Detalhe de Auditoria"**.

Hover nas linhas: fundo `#F1F5F9`.
Paginação: `← Anterior` e `Próxima →` (20 itens por página).
Linha de sumário: `A mostrar [1–20] de [N] eventos`.

**Empty State (sem eventos):**
- Ícone Lucide `ShieldCheck` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Nenhum evento de auditoria registado."` (14px, Gray 500).
- Subtítulo: `"Os eventos aparecerão aqui à medida que operações forem realizadas."` (12px, Gray 500).

**Empty State (filtros sem resultados):**
- Ícone Lucide `SearchX` centrado, 48px, opacidade 10%.
- Título: `"Nenhum evento corresponde aos filtros aplicados."` (14px, Gray 500).
- Botão Outline: `Limpar Filtros`.

---

## Modais e Componentes Globais

**Regras Globais de Modais:**
- Botão `✕` (ícone Lucide `X`) no canto superior direito de todos os modais.
- Clicar no backdrop escuro (40–50% opacidade) fecha o modal sem alterações.
- Todos os modais deste módulo são read-only exceto onde indicado.
- Formatação monetária em todos os modais: `1.240.500,00 €` (ponto = milhar,
  vírgula = decimal, espaço antes de `€`).

---

### Modal 1 — "Gerar Relatório Executivo (PDF)"

*(Abre via botão `Gerar Relatório Executivo (PDF)` no rodapé da ABA 1)*

- **Título:** `Gerar Relatório Executivo` (18px, SemiBold, `#0F172A`).
- **Sub-título:** `Selecione as secções a incluir no documento.`
  (14px, Gray 500).

**Bloco de Informação do Período** (fundo `#F8FAFC`, borda `1px #E2E8F0`,
padding 12px, corner radius 8px):
`Período incluído: [preset selecionado ou De: DD/MM/AAAA — Até: DD/MM/AAAA]`
(12px, Gray 500). + linha: `Gerado por: [Nome do utilizador]  ·  [Data/Hora
atual]` (12px, Gray 500).

**Lista de Checkboxes de Secções:**
- `[x] Visão Executiva Integrada — KPIs e alertas estratégicos`
  *(sempre marcada, não editável — obrigatória)*
- `[x] Análise Financeira — Clube vs. SAD e tesouraria`
  *(sempre marcada, não editável — obrigatória)*
- `[ ] Performance Desportiva por Escalão` *(opcional, desmarcada por defeito)*
- `[ ] Base Associativa com segmentação demográfica` *(opcional, desmarcada
  por defeito)*

Texto de apoio (Gray 500, 12px, abaixo das checkboxes):
`"As secções marcadas serão incluídas no documento PDF. As secções obrigatórias não podem ser removidas."`

**Rodapé do Modal:**
- Botão Outline `Cancelar`.
- Botão Dourado `Gerar PDF` (ícone Lucide `FileText`).
- **Estado de loading** (enquanto o documento é gerado, após clicar `Gerar PDF`):
  - Botão muda para: ícone Lucide `Loader` giratório + texto `"A gerar..."`.
  - Botão fica desativado (cinza, não-clicável) durante o processo.
- **Estado de sucesso** (após geração):
  - Banner Verde inline (fundo `#ECFDF5`, texto `#047857`, ícone `CheckCircle`):
    `"Relatório gerado com sucesso."`
  - Botão Outline `Descarregar PDF` (substitui `Gerar PDF`).
  - Botão Outline `Fechar` (substitui `Cancelar`).

---

### Modal 2 — "Drill-Down da Dívida por Escalão"

*(Abre via link `Ver detalhes por escalão` no KPI "Passivo Pendente" da
ABA 1, e via link no cartão "Dívida Vencida Total" da ABA 2 tab Tesouraria)*

- **Título:** `Passivo Pendente — Detalhe por Escalão` (18px, SemiBold,
  `#0F172A`).
- **Sub-título:** `Período: [preset ou De/Até selecionado]` (14px, Gray 500).

**Tabela Read-Only:**

| ESCALÃO | N.º DE EE EM DÍVIDA | VALOR TOTAL EM DÍVIDA | DÍVIDA MÉDIA POR EE | ENTIDADE | ANTIGUIDADE MÉDIA |
|---|---|---|---|---|---|
| Sub-15 | 45 | `1.575,00 €` | `35,00 €` | Badge `SAD` | `42 dias` |
| Sub-17 | 38 | `1.330,00 €` | `35,00 €` | Badge `SAD` | `28 dias` |
| Seniores | 22 | `1.100,00 €` | `50,00 €` | Badge `Clube` | `61 dias` |

Especificação:
- Ordenação padrão: valor total decrescente.
- Coluna `ENTIDADE`: badge `Clube` (Neutro: fundo `#F1F5F9`, texto `#64748B`)
  ou badge `SAD` (Amarelo: fundo `#FFFBEB`, texto `#B45309`).
- Coluna `ANTIGUIDADE MÉDIA`: badge Vermelho (fundo `#FEE2E2`, texto `#991B1B`)
  quando > 30 dias. Badge Amarelo (fundo `#FFFBEB`, texto `#B45309`) quando
  15–30 dias. Texto simples Gray 500 quando < 15 dias.
- Coluna `VALOR TOTAL EM DÍVIDA`: cor `#991B1B`.

**Linha de Totais** (rodapé da tabela, fundo `#F8FAFC`, texto Bold):
`Total: 230 EE em dívida  ·  45.200,00 €`

Paginação: `← Anterior` e `Próxima →` (10 itens por página).

**Empty State (sem dívida no período):**
- Ícone Lucide `CheckCircle` centrado, 40px, `#047857`, opacidade 50%.
- Título: `"Sem passivo pendente para o período selecionado."` (14px,
  `#047857`).

**Rodapé do Modal:**
- Botão Outline `Exportar CSV` (ícone `Download`, alinhado à esquerda).
- Botão Outline `Fechar` (alinhado à direita).

---

### Modal 3 — "Detalhe de Auditoria"

*(Abre via botão `Ver Detalhe` na tabela da ABA 5)*

- **Título:** `Detalhe do Evento de Auditoria` (18px, SemiBold, `#0F172A`).

**Bloco de Metadados** (fundo `#F8FAFC`, borda `1px #E2E8F0`, padding `12px`,
corner radius `8px`, grelha 2×4):
- `ID do Evento:` [UUID em fonte monoespaçada, 12px]
- `Data / Hora:` [DD MMM AAAA, HH:MM:SS]
- `Ator:` [Nome] — [Role]
- `Módulo:` [nome do módulo]
- `Tipo de Operação:` [badge colorido conforme categoria]
- `Entidade Afetada:` [nome ou descrição]
- `Endereço IP:` [IPv4 em fonte monoespaçada]
- `Centro de Responsabilidade:` badge `Clube` (Neutro) / `SAD` (Amarelo) /
  `Ambos` (Azul Info) / `N/A` (Neutro)

**Bloco de Código JSON** (fundo `#1E293B`, padding `16px`, corner radius
`8px`, texto branco `#F8FAFC`, fonte monoespaçada 13px, scrollbar vertical
se conteúdo exceder 280px de altura):
```json
{
  "event_id": "...",
  "timestamp": "...",
  "actor_id": "...",
  "actor_name": "...",
  "actor_role": "...",
  "module": "...",
  "action_type": "...",
  "entity_type": "...",
  "entity_id": "...",
  "ip_address": "...",
  "changes": {
    "[nome_do_campo]": {
      "before": "...",
      "after": "..."
    }
  }
}
```

**Rodapé do Modal:** Botão Outline `Fechar` (único botão, alinhado à direita).