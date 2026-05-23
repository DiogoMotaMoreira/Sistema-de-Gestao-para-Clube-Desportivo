# Módulo: Departamento Clínico (Perfil: `ROLE_MEDICO`)

**Visão Geral:** O centro de gestão de saúde e aptidão desportiva do clube.
O Médico valida Exames Médico-Desportivos (EMDs) submetidos via Portal B2C,
gere o histórico clínico de lesões através de timelines cronológicas imutáveis
e monitoriza preventivamente a validade documental para garantir que o
Semáforo Clínico de cada atleta reflete a sua real capacidade desportiva.
Cada ação fica imutavelmente registada no Audit Trail (RF-24) vinculada ao
identificador do profissional.

**Página Inicial (Landing Page):** `ABA 1 — Fila de EMDs`

> **Nota de Confidencialidade (RGPD / RNF-25):** Banner fixo discreto no
> rodapé global da aplicação (12px, Gray 500, fundo `#F8FAFC`, borda superior
> `1px #E2E8F0`):
> `"Dados clínicos sujeitos a sigilo médico — RGPD (EU 2016/679).
> O acesso e tratamento destes dados estão restritos a profissionais de saúde
> autorizados (ROLE_MEDICO). Todas as ações são registadas de forma imutável."`

---

## Barra de Navegação Principal (sempre visível no topo do módulo)

Três abas fixas:
`Fila de EMDs [N]` | `Dossiês Clínicos` | `Monitorização Preventiva`

> **Especificação do badge `[N]`:**
> - Badge circular (18px de diâmetro), fundo `#991B1B`, texto branco Bold
>   10px, posicionado no canto superior direito da label `Fila de EMDs`.
> - Exibe a contagem de EMDs pendentes de deliberação.
> - **Quando N = 0:** o badge fica oculto (não renderizado).
> - Atualiza em tempo real sem reload da página.

---

## Especificação do Semáforo Clínico (componente reutilizável em todo o módulo)

O Semáforo Clínico é um componente de Soft Badge usado em cartões, cabeçalhos
e modais. Existem quatro estados possíveis, cada um com especificação de cor
distinta:

| Estado | Fundo | Texto/Ícone | Ícone Lucide | Texto do Badge |
|---|---|---|---|---|
| **APTO** | `#ECFDF5` | `#047857` | `CheckCircle` | `APTO — Elegível` |
| **CONDICIONADO** | `#FFFBEB` | `#B45309` | `AlertTriangle` | `CONDICIONADO — Restrição Parcial` |
| **INAPTO — Lesão Ativa** | `#FEE2E2` | `#991B1B` | `XCircle` | `INAPTO — Lesão Ativa` |
| **INAPTO — EMD Caducado** | `#FEF3C7` | `#92400E` | `Clock` | `INAPTO — EMD Caducado` |

> **Regra de precedência do Semáforo:** Se um atleta tiver simultaneamente
> uma lesão ativa e EMD caducado, o estado exibido é `INAPTO — Lesão Ativa`
> (bloqueio clínico tem precedência visual). Ambas as causas são listadas no
> tooltip do badge (ao hover):
> `"Causas ativas: Lesão Ativa · EMD Caducado"` (12px, branco, fundo `#0F172A`).

---

## ABA 1: Fila de EMDs

**Objetivo:** Triagem, análise e deliberação (aprovação ou rejeição) de
Exames Médico-Desportivos submetidos via Portal B2C (UC-14.3 / RF-20).

> **Nota de RBAC:** A visibilidade e deliberação sobre EMDs está
> **exclusivamente** reservada a `ROLE_MEDICO` (RF-21). A Secretaria não
> vê nem acede a estes documentos.

**Layout Split-Pane Assimétrico** (~35% esquerda · ~65% direita).

---

### Painel Esquerdo — Fila de Trabalho

**Mini-Dashboard (topo do painel) — 3 métricas em linha:**
`[N] Pendentes` (Vermelho se >0) · `[X] Aprovados este mês` (Verde) · `[Y] Rejeitados` (Vermelho)

**Barra de Pesquisa:**
- Placeholder: `"Pesquisar atleta..."`
- Comportamento: debounce ≥ 300ms após ≥ 3 caracteres.

---

**Estrutura de Cada Cartão de EMD Pendente:**
[Nome do Atleta]                                      [Badge SLA: Há X horas/dias]
Escalão: [Escalão]
Origem: Portal B2C
Submetido por: [Nome do EE]
[Ícone Documento] Exame Médico-Desportivo

*Exemplo:*
João Silva                                            Há 2h
Escalão: Sub-15
Origem: Portal B2C
Submetido por: Carlos Silva [EE]
[Ícone FileText] Exame Médico-Desportivo

**Especificação do Badge SLA (tempo em fila):**
| Tempo em Fila | Fundo | Texto | Exemplo |
|---|---|---|---|
| < 24 horas | `#F1F5F9` | `#64748B` | `Há 2h` |
| 24h – 47h59m | `#FFFBEB` | `#B45309` | `Há 1 dia` |
| ≥ 48 horas | `#FEE2E2` | `#991B1B` | `Há 3 dias` |

Ao clicar num cartão → o EMD correspondente é carregado no Painel Direito.
O cartão selecionado fica com fundo de destaque (fundo `#FFFBEB` e borda esquerda `4px #F1C40F`).

**Estado Vazio (sem EMDs pendentes):**
Texto centrado no painel com ícone `CheckCircle` (`#047857`, opacidade 30%):
`"Fila limpa"`
`"Não há EMDs pendentes de deliberação."`

---

### Painel Direito — Zona de Deliberação

**Estado Inicial / Vazio (nenhum EMD selecionado):**
Fundo `#F8FAFC`. Ícone `FileSearch` (opacidade 10%).
Texto centrado: `"Selecione um EMD da lista para iniciar a deliberação."`

---

**Estado Ativo (EMD selecionado):**

**Área de Pré-visualização:**
Componente de visualização de ficheiro (PDF ou PNG) que ocupa a maior parte do painel (~60% da altura do painel direito).
Fundo `#1E293B` (escuro) para contraste com o documento.
Suporta zoom básico (botões `+` e `−`) e paginação (`← Página [X] de [Y] →`).

---

**Painel Inferior — Ações de Decisão:**
Fundo `#FFFFFF`, padding `16px`. Linha separadora `1px #E2E8F0` acima (fixo, não faz scroll com o PDF).

- **Campo `Válido até` (Input de Data):**
  - Placeholder: `"dd/mm/aaaa"`.
  - Helper text permanente: `"* Apenas datas futuras são permitidas"`.
  - **Obrigatório** para a aprovação do EMD.
  - **Estado de erro** (se data for passada/hoje): borda vermelha `#DC2626` e mensagem inline `"Data inválida — o EMD já se encontra caducado."`

- **Textarea `Motivo de Rejeição`:**
  - Placeholder: `"Indique o motivo clínico (mín. 10 caracteres)"`.
  - Altura mínima visível: 3 linhas.
  - Contador de caracteres: `[X / 500]` (Fica vermelho `#991B1B` se < 10).
  - O preenchimento desta textarea (mínimo 10 caracteres) é o **único gatilho** que ativa o botão `✕ Rejeitar`.

- **Botão Verde:** `✓ Aprovar EMD` (Fundo `#ECFDF5`, texto `#047857`)
  - **Desativado** (fundo `#F1F5F9`, cursor `not-allowed`) se o campo `Válido até` estiver vazio ou com data inválida.
  - **Ativo** quando uma data futura válida for inserida.

- **Botão Vermelho:** `✕ Rejeitar EMD` (Fundo `#FEE2E2`, texto `#991B1B`)
  - **Desativado** (cinza, não-clicável) enquanto a textarea `Motivo de Rejeição` tiver menos de 10 caracteres.
  - **Ativo** assim que a textarea contiver ≥ 10 caracteres.

> **Nota:** Os dois botões de decisão são mutuamente exclusivos na sua ativação (ou o utilizador preenche a data para aprovar, ou o motivo para rejeitar), mas podem estar ambos desativados simultaneamente.

---

**Comportamento Pós-Decisão** (após clicar `Aprovar` ou `Rejeitar`):

1. O cartão do atleta deliberado **desaparece** da lista com animação `slide-out` para a esquerda.
2. O Painel Direito **volta ao estado vazio**: `"Selecione um EMD da lista para iniciar a deliberação."`
3. O contador `[N] Pendentes` no mini-dashboard do Painel Esquerdo **decrementa em 1**.
4. O badge da aba de navegação principal `Fila de EMDs [N]` **decrementa em 1**. Se N atingir 0, o badge é ocultado.
5. **Toast de confirmação** (duração 5s, no canto inferior direito):
   - Aprovação: fundo `#ECFDF5`, borda esquerda verde. `"✓ EMD Aprovado — [Nome do Atleta] agora APTO. Notificação enviada ao EE."`
   - Rejeição: fundo `#FEE2E2`, borda esquerda vermelha. `"✕ EMD Rejeitado — Notificação com motivo enviada ao EE."`

## ABA 2: Dossiês Clínicos

**Objetivo:** Arquivo mestre de saúde desportiva. Permite consultar o estado
global do plantel e aceder ao histórico clínico detalhado de cada atleta.

---

### Nível 1 — Grid de Cartões (Diretório de Pacientes)

**Barra de Filtros e Pesquisa (topo da Content Area):**

- Toggle Group (esquerda):
  - Botão `Apenas Inaptos / Lesionados`: Outline, borda `1px #991B1B`,
    texto `#991B1B`. Quando ativo: fundo `#FEE2E2`, texto `#991B1B` SemiBold.
  - Botão `Todos os Atletas`: Outline, borda `#E2E8F0`, texto `#0F172A`.
    Quando ativo: fundo `#F1F5F9`, texto `#0F172A` SemiBold.
  - Por defeito: `Todos os Atletas` ativo.

- Input de pesquisa. Placeholder: `"Pesquisar atleta por nome..."`
  (debounce ≥ 300ms após ≥ 3 caracteres).

- Dropdown `Escalão / Equipa`. Placeholder: `"Todos os Escalões"`. Opções:
  `Todos os Escalões` *(defeito)* · `Sub-13` · `Sub-15` · `Sub-17` ·
  `Sub-19` · `Seniores`.

**Grid de Cartões de Atleta:**
Grelha responsiva: 4 colunas (desktop ≥ 1024px) · 2 colunas (tablet) ·
1 coluna (mobile).

Cada cartão: fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`,
sombra suave (Y=1, Blur=2). Padding `16px`.

Conteúdo de cada cartão (de cima para baixo):
1. **Avatar** circular (56px, `100%` border-radius, foto do atleta ou
   inicial do nome em fundo `#E2E8F0`).
2. **Nome** (Bold, 14px, `#0F172A`).
3. **Escalão + Idade** (12px, Gray 500). Ex: `Sub-17 · 16 anos`.
4. **Badge Semáforo** (especificação na secção global deste documento).
5. **Badge de Ocorrências Ativas** (visível apenas quando N > 0):
   fundo `#EFF6FF`, texto `#1D4ED8`, ícone Lucide `Activity` (12px).
   Ex: `2 Ocorrências Ativas`.
6. **Botão** `Ver Dossiê` (Dourado, largura total do cartão, ícone Lucide
   `ChevronRight` à direita) → navega para **Nível 2**.

**Paginação:** `← Anterior` e `Próxima →` no rodapé do grid (20 cartões
por página). Linha de sumário: `A mostrar [1–20] de [N] atletas`.

**Empty State (sem atletas no filtro):**
- Ícone Lucide `SearchX` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhum atleta encontrado para os critérios aplicados."` (16px,
  Gray 500).
- Botão Outline: `Limpar Filtros`.

**Empty State (sem atletas registados):**
- Ícone Lucide `Users` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhum atleta registado no sistema."` (16px, Gray 500).
- Sub-título: `"Os perfis de atletas são criados pela Secretaria."` (14px,
  Gray 500).

---

### Nível 2 — Dossiê Individual do Atleta

**Breadcrumb (topo):** `Dossiês Clínicos > [Nome Completo do Atleta]`
(14px, Gray 500 · `>` · `#0F172A`)

---

**Cabeçalho Biográfico (cartão fixo de topo):**
Cartão `#FFFFFF`, borda `1px #E2E8F0`, corner radius `16px`, padding `24px`.
Layout em linha horizontal:

- **Coluna 1:** Avatar circular (80px), foto do atleta.
- **Coluna 2 (conteúdo principal):**
  - Nome completo (Bold 700, 20px, `#0F172A`).
  - `[Escalão] · [Idade] anos` (14px, Gray 500). Ex: `Sub-17 · 16 anos`.
  - `Última Consulta: [DD/MM/AAAA]` (12px, Gray 500).
- **Coluna 3 (semáforo + ação):**
  - **Badge Semáforo gigante** (altura 36px, corner radius `16px`; mesma
    especificação da secção global, mas em tamanho maior: ícone 16px, texto
    14px SemiBold).
  - Se INAPTO ou CONDICIONADO, linha adicional (12px, Gray 500):
    `"Causa: [descrição da causa]"`.
  - **Botão Dourado** `+ Nova Ocorrência` (ícone Lucide `Plus`, alinhado
    à direita do cabeçalho).

> **Nota de RBAC:** O Médico vê no cabeçalho: Nome, Escalão, Idade, Foto
> e estado clínico. **Não vê** NIF, morada, dados financeiros, nem avaliações
> de rendimento desportivo (RNF-13).

---

**Tabs Internas do Dossiê:**

`Ocorrências Ativas` *(ativa por defeito)* | `Histórico Clínico` |
`Histórico de EMDs`

- Tab ativa: sublinhado `2px #F1C40F`, texto `#0F172A` SemiBold, 14px.
- Tab inativa: sem sublinhado, texto Gray 500, 14px.

---

#### Tab "Ocorrências Ativas"

**Estado com ocorrências ativas:**
Para cada ocorrência ativa — um **Cartão de Lesão** independente:

Cartão: fundo `#FFFFFF`, borda esquerda `4px` com cor do semáforo da
ocorrência (`#991B1B` para INAPTO, `#B45309` para CONDICIONADO), corner
radius `12px`, padding `20px`.

**Cabeçalho do Cartão de Lesão:**
- Linha 1 (topo):
  - Nome da lesão (Bold, 16px, `#0F172A`). Ex: `Entorse no Joelho Direito`.
  - Badge `Em Tratamento` (fundo `#EFF6FF`, texto `#1D4ED8`, ícone Lucide
    `Activity`) — alinhado à direita.
- Linha 2:
  - `Próxima Reavaliação: [DD/MM/AAAA]` (12px, Gray 500) à esquerda.
  - Se a data de reavaliação é hoje ou passada: badge Vermelho
    `Reavaliação em Atraso` à direita do texto (ícone Lucide `Clock`,
    fundo `#FEE2E2`, texto `#991B1B`).
- Linha 3 (botões, alinhados à direita):
  - Botão Outline `+ Nova Evolução` (ícone Lucide `FilePlus`) →
    abre **Modal 2: Registar Evolução Clínica**.
  - Botão Verde `Emitir Alta` (fundo `#ECFDF5`, texto `#047857` SemiBold,
    ícone Lucide `CheckCircle`) → abre **Modal 3: Emitir Alta Médica**.

**Divisor** `1px #E2E8F0` entre o cabeçalho e a timeline.

**Timeline da Lesão** (scroll vertical dentro do cartão, mais recente no
topo):

Cada nó da timeline:
- **Indicador visual do nó:** linha vertical `2px #E2E8F0` à esquerda +
  círculo sólido `12px` com cor do grau de restrição desse registo:
  - Interrupção Total: `#991B1B`.
  - Restrição Condicionada: `#B45309`.
  - Sem Restrição: `#047857`.
- **Conteúdo do nó** (à direita da linha vertical):
  - **Data e hora** (Bold, 12px, `#0F172A`). Ex: `13 Mai 2026 · 09:34`.
  - Badge de Grau de Restrição em vigor após esta entrada:
    - `Interrupção Total` → fundo `#FEE2E2`, texto `#991B1B`.
    - `Restrição Condicionada` → fundo `#FFFBEB`, texto `#B45309`.
    - `Sem Restrição` → fundo `#ECFDF5`, texto `#047857`.
  - **Nota Clínica** (texto livre, 14px, `#0F172A`, itálico). Ex:
    `"Atleta apresenta dor moderada na flexão. Manutenção do protocolo de
    fisioterapia."`
  - Se existir Nota Interna: bloco separado por linha tracejada `1px #E2E8F0`,
    ícone Lucide `Lock` (12px, Gray 500) + label `"Nota Interna — Confidencial"`
    (11px, Gray 500) + texto da nota (12px, Gray 500, itálico).
    **Este bloco é invisível para perfis não-médicos.**
  - **Próxima Reavaliação estipulada nesta entrada** (12px, Gray 500):
    `Próxima reavaliação: [DD/MM/AAAA]`
  - **Anexos clínicos** (lista horizontal de pills clicáveis):
    - Cada pill: ícone Lucide `Paperclip` (12px) + nome do ficheiro
      (12px, `#1D4ED8`, truncado em 20 chars com reticências) + extensão.
    - Ex: pill `relatorio_fisio_mai26.pdf` → ao clicar abre
      **Modal "Visualização de Anexo Clínico"**.
  - **Linha de vinculação legal** (rodapé do nó, Gray 500, 11px, itálico):
    `"Registado por: Dr. [Nome do Médico] · [DD/MM/AAAA HH:MM]"` (RF-17).

**Primeiro nó da timeline (o mais recente) é o "Registo de Abertura":**
- Ícone Lucide `PlusCircle` (12px, cor do grau de restrição inicial).
- Label adicional: `"Abertura da Ocorrência"` (11px, Gray 500).

**Empty State (sem ocorrências ativas):**
- Ícone Lucide `Activity` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Sem ocorrências clínicas ativas."` (14px, Gray 500).
- Sub-título: `"O atleta encontra-se clinicamente apto."` (12px, Gray 500).

---

#### Tab "Histórico Clínico"

Ocorrências **encerradas**, em modo read-only absoluto.

**Banner de leitura apenas** (fundo `#EFF6FF`, texto `#1D4ED8`, ícone Lucide
`Lock`, 12px):
`"Histórico clínico imutável — RF-24. Não é possível editar registos
encerrados."`

Layout idêntico ao das Ocorrências Ativas, mas:
- Borda esquerda do cartão de lesão: `4px #94A3B8` (Gray 400 — inativo).
- Badge de estado: `Encerrada` (fundo `#F1F5F9`, texto `#64748B`, ícone
  Lucide `CheckCircle`).
- Campo adicional no cabeçalho: `Data de Alta: [DD/MM/AAAA]` (12px, Gray 500).
- **Sem botões de ação** (sem `+ Nova Evolução`, sem `Emitir Alta`).
- A timeline é read-only (sem hover interativo nos nós).

**Empty State:**
- Ícone Lucide `Clock` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Sem ocorrências clínicas no histórico."` (14px, Gray 500).

---

#### Tab "Histórico de EMDs"

Lista read-only de todos os EMDs validados (aprovados ou rejeitados) para
este atleta.

**Tabela de EMDs:**

| COLUNA | DETALHES |
|---|---|
| `DATA DE SUBMISSÃO` | Formato `DD MMM AAAA` (ex: `13 Mai 2026`). |
| `SUBMETIDO POR` | Nome do EE (14px, `#0F172A`). |
| `DOCUMENTO` | Ícone Lucide `FileText` + label `Exame Médico-Desportivo`. |
| `DELIBERAÇÃO` | Badge: `Aprovado` → Verde. `Rejeitado` → Vermelho. `Pendente` → Neutro Amarelo. |
| `VÁLIDO ATÉ` | Formato `DD/MM/AAAA`. Vermelho se data passada. |
| `DELIBERADO POR` | `Dr. [Nome]` (12px, Gray 500) + data da deliberação. |
| `MOTIVO (REJEIÇÃO)` | Texto do motivo (12px, Gray 500, itálico). Vazio se aprovado. |

- Paginação: `← Anterior` e `Próxima →` (10 itens por página).

**Empty State:**
- Ícone Lucide `FileSearch` centrado, 48px, opacidade 10%, Gray 200.
- Título: `"Nenhum EMD no histórico deste atleta."` (14px, Gray 500).

---

### Modais da ABA 2

---

#### Modal 1 — "Abrir Nova Ocorrência Clínica" (UC-12.1 / RF-17)

*(Abre via botão `+ Nova Ocorrência` no Cabeçalho Biográfico)*

- **Título:** `Abrir Nova Ocorrência Clínica` (18px, SemiBold, `#0F172A`).
- **Sub-título:** `[Nome do Atleta] · [Escalão]` (14px, Gray 500).

**Banner de Confidencialidade** (fundo `#EFF6FF`, texto `#1D4ED8`, ícone
Lucide `ShieldCheck`, 12px, abaixo do título):
`"Dados clínicos sujeitos a sigilo médico — apenas visíveis a ROLE_MEDICO."`

**Campos do Formulário:**

Campo 1 — `Input de Data` **"Data de Início da Ocorrência"** *(obrigatório)*:
- Label: `Data de Início da Ocorrência *` (12px, Gray 500).
- Placeholder: `"dd/mm/aaaa"`.
- Helper text: `"Pode ser retroativa (data em que a lesão ocorreu)."` (11px,
  Gray 500).
- Validação: não pode ser data futura. Erro inline (11px, `#991B1B`):
  `"A data de início não pode ser futura."`

Campo 2 — `Dropdown` **"Tipificação Normalizada"** *(obrigatório)*:
- Label: `Tipificação *` (12px, Gray 500).
- Placeholder: `"Selecione a tipificação..."`. Opções:
  `Muscular` · `Articular` · `Óssea` · `Doença Sistémica` · `Outro`.

Campo 3 — `Dropdown` **"Região Anatómica Afetada"** *(obrigatório)*:
- Label: `Região Anatómica *` (12px, Gray 500).
- Placeholder: `"Selecione a região..."`. Opções:
  `Cabeça / Pescoço` · `Ombro Direito` · `Ombro Esquerdo` · `Cotovelo D.` ·
  `Cotovelo E.` · `Pulso / Mão D.` · `Pulso / Mão E.` · `Coluna Cervical` ·
  `Coluna Lombar` · `Anca / Virilha D.` · `Anca / Virilha E.` ·
  `Coxa D.` · `Coxa E.` · `Joelho D.` · `Joelho E.` · `Perna D.` ·
  `Perna E.` · `Tornozelo D.` · `Tornozelo E.` · `Pé D.` · `Pé E.` ·
  `Outro`.

**Alerta de Conflito de Região (condicional):**
Quando a região selecionada já tem uma ocorrência ativa, surge um banner
inline (abaixo do dropdown, fundo `#FFFBEB`, borda `1px #B45309`,
corner radius `8px`, padding `12px`):
[AlertTriangle - #B45309]  Existe uma ocorrência ativa para "[Região]".
Como pretende proceder?
[Botão Outline]  Substituir diagnóstico anterior   [Botão Outline]  Registar como lesão paralela

- Botão `Substituir diagnóstico anterior`: borda `1px #991B1B`, texto
  `#991B1B`. Ao clicar: a ocorrência anterior transita para "Encerrada
  (Substituída)" no histórico.
- Botão `Registar como lesão paralela`: borda `#E2E8F0`, texto `#0F172A`.
  Ao clicar: ambas ficam ativas em simultâneo.
- **Enquanto nenhuma das opções estiver selecionada, o botão "Criar Ocorrência"
  permanece desativado.**

Campo 4 — `Dropdown` **"Grau de Restrição Desportiva"** *(obrigatório)*:
- Label: `Grau de Restrição *` (12px, Gray 500).
- Placeholder: `"Selecione o grau..."`. Opções:
  `Interrupção Total` · `Restrição Condicionada` · `Sem Restrição (Apto)`.

**Preview do Semáforo (inline, à direita do dropdown, atualiza imediatamente
ao selecionar opção):**
Linha: ícone Lucide `ChevronRight` (Gray 500) + label `"Estado resultante:"` +
Badge Semáforo correspondente:
- `Interrupção Total` → badge `INAPTO — Lesão Ativa` (Vermelho).
- `Restrição Condicionada` → badge `CONDICIONADO — Restrição Parcial` (Amarelo).
- `Sem Restrição (Apto)` → badge `APTO — Elegível` (Verde).
- *Sem seleção:* label cinza `"Selecione o grau para ver o impacto."` (12px,
  Gray 500).

Campo 5 — `Input de Data` **"Data Prevista de Reavaliação"** *(obrigatório)*:
- Label: `Data Prevista de Reavaliação *` (12px, Gray 500).
- Placeholder: `"dd/mm/aaaa"`.
- Helper text: `"* Deve ser uma data futura."` (11px, Gray 500).
- Erro inline se data passada ou hoje (11px, `#991B1B`):
  `"A data de reavaliação deve ser estritamente futura."`

Campo 6 — `Textarea` **"Descrição Inicial da Ocorrência"** *(obrigatório)*:
- Label: `Descrição Inicial *` (12px, Gray 500).
- Placeholder: `"Descreva detalhadamente a ocorrência clínica, sintomas e
  protocolo inicial de tratamento..."`
- Altura mínima: 4 linhas.
- Contador: `[X / 2000]` (11px, Gray 500, canto inferior direito).

**Rodapé do Modal:**
- Botão Outline `Cancelar`.
- Botão Dourado `Criar Ocorrência` (ícone Lucide `Plus`).
  - **Desativado** se algum campo obrigatório vazio ou com erro, ou se
    conflito de região sem resolução.

---

#### Modal 2 — "Registar Evolução Clínica" (UC-12.2 / RF-17)

*(Abre via botão `+ Nova Evolução` no Cartão de Lesão Ativa)*

- **Título:** `Registar Evolução Clínica` (18px, SemiBold, `#0F172A`).
- **Sub-título:** `[Nome da Lesão] · [Nome do Atleta]` (14px, Gray 500).

**Banner de Confidencialidade** (idêntico ao Modal 1).

**Campos do Formulário:**

Campo 1 — `Dropdown` **"Atualizar Grau de Restrição"** *(obrigatório)*:
- Label: `Grau de Restrição Atualizado *` (12px, Gray 500).
- Opções: `Interrupção Total` · `Restrição Condicionada` · `Sem Restrição (Apto)`.

**Preview do Semáforo (inline, comportamento idêntico ao Modal 1).**

Campo 2 — `Input de Data` **"Próxima Reavaliação"** *(obrigatório)*:
- Label: `Próxima Reavaliação *` (12px, Gray 500).
- Placeholder: `"dd/mm/aaaa"`.
- Helper text: `"* Apenas datas futuras são permitidas."` (11px, Gray 500).
- Erro inline se data passada (11px, `#991B1B`):
  `"A data de reavaliação deve ser estritamente futura."`

Campo 3 — `Textarea` **"Nota Clínica"** *(obrigatório)*:
- Label: `Nota Clínica *` (12px, Gray 500).
- Placeholder: `"Descreva a evolução clínica, intervenções realizadas e
  resposta do atleta ao tratamento..."`
- Altura mínima: 4 linhas.
- Contador: `[X / 2000]` (11px, Gray 500).

Campo 4 — `Textarea` **"Observações Internas — Confidencial"** *(opcional)*:
- Label com ícone Lucide `Lock` (12px): `Observações Internas — Confidencial`
  (12px, Gray 500).
- Fundo do campo: `#FFFBEB` (amarelo muito claro, para distinguir visualmente).
- Placeholder: `"Notas privadas não transmitidas ao atleta, EE nem ao
  corpo técnico. Apenas visíveis a ROLE_MEDICO."`
- Altura mínima: 2 linhas.
- Helper text (11px, `#B45309`): `"Este campo não é transmitido ao semáforo
  nem ao EE. Armazenado separadamente."`

Campo 5 — `Dropzone` **"Anexos Clínicos"** *(opcional)*:
- Label: `Anexos Clínicos` (12px, Gray 500).
- Área de drag & drop (fundo `#F8FAFC`, borda `2px dashed #E2E8F0`, corner
  radius `8px`, padding `24px`, centrado):
  - Ícone Lucide `Upload` (32px, Gray 200).
  - Texto: `"Arraste ficheiros para aqui ou clique para selecionar"` (14px,
    Gray 500).
  - Sub-texto: `"Formatos aceites: PDF, PNG · Máximo 5 MB por ficheiro"`
    (12px, Gray 500).
- Após selecionar ficheiro válido: pill com ícone Lucide `Paperclip` + nome
  + ícone `X` para remover.
- Erro inline se formato inválido (11px, `#991B1B`):
  `"Formato não suportado. Apenas PDF e PNG são aceites."`
- Erro inline se tamanho excedido (11px, `#991B1B`):
  `"O ficheiro excede o limite de 5 MB."`

**Rodapé do Modal:**
- Botão Outline `Cancelar`.
- Botão fundo `#000000`, texto `#FFFFFF` SemiBold: `Gravar Registo`
  (ícone Lucide `Save`).
  - **Desativado** se grau de restrição ou data de reavaliação sem valor válido,
    ou se nota clínica vazia.

---

#### Modal 3 — "Emitir Alta Médica" (UC-12.3 / RF-19)

*(Abre via botão verde `Emitir Alta` no Cartão de Lesão Ativa)*

- **Título:** `Emitir Alta Médica` (18px, SemiBold, `#0F172A`).
- **Sub-título:** `[Nome da Lesão] · [Nome do Atleta]` (14px, Gray 500).

**Bloco de Preview de Impacto no Semáforo** (topo do modal, fundo `#F8FAFC`,
borda `1px #E2E8F0`, corner radius `8px`, padding `16px`):

- **Se sem outras ocorrências ativas:**
  Ícone Lucide `CheckCircle` (`#047857`, 20px) + texto (14px, `#047857`):
  `"O semáforo transitará para APTO — atleta elegível para treino e convocatórias."`

- **Se com ocorrências paralelas ativas:**
  Ícone Lucide `AlertTriangle` (`#B45309`, 20px) + texto (14px, `#B45309`):
  `"O atleta manter-se-á INAPTO: [Nome da Lesão Paralela] (ocorrência
  #[ID] ainda ativa)."`

**Campos do Formulário:**

Campo 1 — `Radio Buttons` **"Tipo de Alta"** *(obrigatório)*:
- Label: `Tipo de Alta *` (12px, Gray 500).
- Opções (radio buttons verticais):
  - `Alta Definitiva` — atleta considerado totalmente recuperado.
  - `Alta Condicionada` — atleta com limitações residuais.

Campo 2 — `Dropdown` **"Grau de Restrição Residual"** *(condicional;
visível apenas quando "Alta Condicionada" está selecionado)*:
- Label: `Grau de Restrição Residual *` (12px, Gray 500).
- Placeholder: `"Selecione o grau de aptidão parcial..."`.
- Opções: `Restrição Condicionada (aptidão parcial)` · `Treino Ligeiro
  Autorizado` · `Jogo Proibido — Treino Autorizado`.
- Preview do Semáforo inline (comportamento idêntico ao Modal 1): a seleção
  atualiza o badge resultante imediatamente.

Campo 3 — `Input de Data` **"Data Efetiva de Encerramento"** *(obrigatório)*:
- Label: `Data Efetiva de Encerramento *` (12px, Gray 500).
- Placeholder: `"dd/mm/aaaa"`.
- Helper text: `"* Deve ser igual ou anterior à data de hoje."` (11px, Gray 500).
- Validação: data não pode ser futura. Erro inline (11px, `#991B1B`):
  `"A data de encerramento não pode ser futura."`

Campo 4 — `Textarea` **"Diretrizes para o Treinador / Parecer Final"**
*(obrigatório)*:
- Label: `Parecer Final — Diretrizes para o Corpo Técnico *` (12px, Gray 500).
- Placeholder: `"Descreva as condicionantes para o regresso à atividade
  desportiva e as instruções para o treinador (ex: evitar sprints por
  2 semanas, sem contacto físico)..."`
- Altura mínima: 4 linhas.
- Contador: `[X / 2000]` (11px, Gray 500).
- Helper text (11px, `#1D4ED8`):
  `"Este parecer será visível ao corpo técnico no semáforo (versão mascarada
  — sem diagnóstico clínico)."`

**Rodapé do Modal:**
- Botão Outline `Cancelar`.
- Botão Verde `Confirmar Alta` (fundo `#ECFDF5`, texto `#047857` SemiBold,
  ícone Lucide `CheckCircle`).
  - **Desativado** se tipo de alta não selecionado, data inválida ou parecer
    vazio.

---

#### Modal 4 — "Visualização de Anexo Clínico" (Lightbox)

*(Abre ao clicar num ficheiro na timeline da lesão)*

- **Título:** `[Nome do ficheiro]` (16px, SemiBold, `#0F172A`).
- **Sub-título:** `Carregado em [DD/MM/AAAA HH:MM] · [Tamanho do ficheiro]`
  (12px, Gray 500).

**Área de visualização** (fundo `#1E293B`, min-height 400px, corner radius
`8px`):
- PDF: renderizado inline com controlos `← Página [X] de [Y] →` + zoom.
- PNG: imagem centralizada com zoom `+` e `−`.

**Banner RGPD** (fundo `#FFFBEB`, texto `#B45309`, ícone Lucide `Lock`,
12px, abaixo da área de visualização):
`"Documento clínico sujeito a sigilo médico — download bloqueado por política
de proteção de dados (RGPD)."`

**Rodapé do Modal:**
- Botão Outline `Fechar` (único botão; sem opção de download).

---

## ABA 3: Monitorização Preventiva

**Objetivo:** Visão analítica para antecipar a caducidade de EMDs de todo
o clube e gerir reavaliações clínicas próximas (RF-14 / UC-13.2).

---

### Painel "Reavaliações Clínicas nos Próximos 7 Dias"

Cartão de alerta (largura total, fundo `#FFFBEB`, borda `1px #B45309`,
corner radius `12px`, padding `16px`) visível apenas quando existam
reavaliações nos próximos 7 dias.

- **Cabeçalho:** Ícone Lucide `Calendar` (`#B45309`, 16px) + título
  `"Reavaliações Clínicas nos Próximos 7 Dias"` (14px, SemiBold, `#B45309`).
- **Conteúdo:** Lista horizontal de pills (um por atleta), cada pill:
  - Ícone Lucide `User` (12px, `#B45309`) + Nome do atleta (Bold 12px,
    `#0F172A`) + data de reavaliação (12px, Gray 500) + escalão (12px,
    Gray 500).
  - Ex: `Dr. João Silva · Sub-17 · Reavaliação: 25/05/2026`
  - Ao clicar numa pill: navega para o Dossiê do atleta (ABA 2, Nível 2).
- **Se não há reavaliações próximas:** este bloco fica oculto (não renderizado).

---

### Barra de Filtros e Pesquisa

**Toggle Group (esquerda):**
- `Todos` (ativo por defeito): fundo `#F1C40F`, texto `#000000` SemiBold.
- `A Expirar (< 30 dias)`: Outline, borda `#B45309`, texto `#B45309`.
  Quando ativo: fundo `#FFFBEB`, texto `#B45309` SemiBold.
- `Expirados`: Outline, borda `#991B1B`, texto `#991B1B`.
  Quando ativo: fundo `#FEE2E2`, texto `#991B1B` SemiBold.

**Dropdown (centro):** `"Todos os Escalões"`. Opções: `Todos os Escalões`
*(defeito)* · `Sub-13` · `Sub-15` · `Sub-17` · `Sub-19` · `Seniores`.

**Barra de pesquisa (direita):**
- Placeholder: `"Pesquisar atleta ou escalão..."`
- Debounce ≥ 300ms após ≥ 3 caracteres.

**Botão de texto `Limpar Filtros`** (visível quando ≥ 1 filtro ativo, 12px,
`#1D4ED8`).

---

### Tabela de Monitorização de EMDs

| COLUNA | DETALHES |
|---|---|
| `ATLETA` | Nome completo (Bold, 14px, `#0F172A`). |
| `ESCALÃO / EQUIPA` | Texto simples (14px, `#0F172A`). Ex: `Sub-17 · Equipa A`. |
| `DATA VALIDADE EMD` | Formato `DD/MM/AAAA`. Cabeçalho clicável para ordenar ascendentemente (ícone Lucide `ArrowUp` / `ArrowDown` ao lado do label). |
| `ESTADO PREVENTIVO` | Badge semântica: `Válido` → Verde (fundo `#ECFDF5`, texto `#047857`, ícone `CheckCircle`). `A Expirar` → Amarelo (fundo `#FFFBEB`, texto `#B45309`, ícone `Clock`). `Expirado` → Vermelho (fundo `#FEE2E2`, texto `#991B1B`, ícone `XCircle`). |
| `ALERTA ENVIADO` | Timestamp do último alerta automático enviado ao EE (12px, Gray 500, fonte monoespaçada). Ex: `22/05/2026 · 02:03`. Se o envio falhou: badge `Pendente` (fundo `#FFFBEB`, texto `#B45309`, ícone `AlertTriangle`). Se nunca enviado: `—` (Gray 200). |
| `AÇÃO` | Para linhas com estado `Expirado` E EMD pendente na fila: link `Ver Fila de EMDs` (12px, `#1D4ED8`, ícone Lucide `ExternalLink`) → navega para ABA 1 com pesquisa pré-filtrada pelo nome do atleta. Para os restantes: célula vazia. |

Hover nas linhas: fundo `#F1F5F9`.
Paginação: `← Anterior` e `Próxima →` no rodapé (20 itens por página).
Linha de sumário: `A mostrar [1–20] de [N] atletas`.

---

**Nota Informativa no Rodapé da Tabela** (fundo `#F8FAFC`, borda superior
`1px #E2E8F0`, padding `12px`, 12px, Gray 500, ícone Lucide `Info`):
`"Alertas automáticos de caducidade são enviados a [30] dias de expiração
· Parâmetro configurado exclusivamente pelo Administrador de Sistema
(RF-14) · O envio é processado em background pelo sistema — não requer
ação manual."`

> O valor `[30]` é dinâmico — reflete o limiar atual configurado pelo Admin.

---

**Empty State (nenhum atleta nos filtros aplicados):**
- Ícone Lucide `SearchX` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhum atleta encontrado para os critérios selecionados."` (16px,
  Gray 500).
- Botão Outline: `Limpar Filtros`.

**Empty State (sem atletas registados):**
- Ícone Lucide `Users` centrado, 64px, opacidade 10%, Gray 200.
- Título: `"Nenhum atleta registado no sistema."` (16px, Gray 500).
- Sub-título: `"Os perfis de atletas são criados pela Secretaria."` (12px,
  Gray 500).