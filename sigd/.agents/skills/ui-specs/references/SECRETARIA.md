# 🛡️ Módulo: Secretaria (Perfil: `ROLE_SECRETARIA`)

**Visão Geral:** O coração administrativo e financeiro da plataforma. Centraliza o
atendimento ao balcão, a liquidação de pagamentos presenciais, a certificação de
documentos civis e a gestão do ciclo de vida das épocas desportivas.

**Página Inicial (Landing):** `ABA 1 — Atendimento`.

---

## Barra de Navegação Principal (sempre visível no topo)

Quatro abas fixas: `Atendimento` | `Gestão de Entidades` | `Validação Documental [N]` | `Configurações Operacionais`

> **Nota sobre `[N]`:** Badge numérico circular a vermelho, posicionado no canto
> superior direito da label da aba "Validação Documental". Exibe a contagem de
> documentos civis **pendentes de triagem**. O badge fica **oculto** (sem renderização)
> quando `N = 0`.

---

## 📁 ABA 1: Atendimento

**Objetivo:** Ponto único de pesquisa, triagem e gestão transacional por
Encarregado de Educação (EE).

---

### Nível 1 — Listagem Global de Utentes

**Estado Inicial:** Ao aceder à aba, o sistema apresenta todos os EEs ativos no
diretório central, ordenados **alfabeticamente por nome**, em paginação de
**20 cartões por página**.

#### Barra de Pesquisa

- Campo de texto com ícone de lupa à esquerda.
- Placeholder: `"Pesquise por Nome ou NIF..."`
- **Comportamento:** A consulta ao servidor é ativada **apenas** quando o utilizador
  faz uma pausa na digitação após introduzir **≥ 3 caracteres consecutivos**
  (debounce de ≥ 300 ms). Com menos de 3 caracteres, nenhuma consulta é disparada.
- **Estado Vazio (pesquisa sem resultados):** Texto centrado no grid:
  `"Nenhum resultado encontrado para '[cadeia introduzida]'. Verifique o nome ou NIF."`

#### Grid de Cartões de EE

Cada cartão contém:

- **Foto de Perfil** (circular, 48px; placeholder genérico se inexistente).
- **Nome Completo** (Bold, texto principal).
- **NIF** (texto secundário, cor cinza).
- **Semáforo de Estado Consolidado** — três badges coloridos independentes:
  - Badge `Quotas`:
    - 🟢 Verde — Situação financeira regularizada.
    - 🔴 Vermelho — Uma ou mais mensalidades em dívida vencida.
  - Badge `EMD`:
    - 🟢 Verde — Todos os EMDs dos atletas associados são válidos.
    - 🟠 Laranja — Pelo menos um EMD expira nos **próximos 30 dias**.
    - 🔴 Vermelho — Pelo menos um atleta com EMD caducado ou sem exame registado.
  - Badge `CC`:
    - 🟢 Verde — Documentação civil válida para todos os associados.
    - 🟠 Laranja — Pelo menos um documento civil expira nos **próximos 30 dias**.
    - 🔴 Vermelho — Documento civil caducado, rejeitado ou pendente de validação.
- **Botão Dourado:** `Abrir Ficha 360º` → Navega para **Nível 2**.

#### Paginação

Rodapé do grid: botões `← Anterior` e `Próxima →`.

---

### Nível 2 — Ficha 360º do Utente

**Breadcrumb (topo):** `Atendimento > [Nome Completo do EE]`

---

#### Barra Estática de Perfil (fixo no topo; não rola com o conteúdo da página)

- Foto de Perfil (circular, 56px).
- **Nome Completo** (Bold, 20px).
- **NIF** e **Email** na linha secundária.
- **Atletas Associados:** Sequência de tags clicáveis, uma por atleta
  (ex: tag `João Silva · Sub-15`, tag `Marta Silva · Sub-17`). Ao clicar numa tag,
  o foco da Tab A desloca-se para o cartão do respetivo atleta.
- **Controlo de Estatuto de Sócio:**
  - Switch `Sócio` com label dinâmica ao lado:
    - Se ativo: tag verde `Sócio Ativo`.
    - Se inativo: tag cinza `Sem Estatuto de Sócio`.
  - Ao **alterar o switch** (em qualquer direção), o sistema abre imediatamente o
    **Modal "Impacto Financeiro (Sócio)"** antes de qualquer persistência.
    O switch reverte ao estado anterior caso o utilizador cancele o modal.

---

#### Tabs de Conteúdo

`Visão Geral` | `Plano de Pagamentos` | `Histórico de Faturas`

---

#### Tab A: Visão Geral

**Cartões de Atletas** (um cartão por atleta associado ao EE):

Cada cartão contém:

- `[Nome do Atleta]` (Bold) seguido de `([Escalão])` — ex: `Maria Silva (Sub-17)`.
- Linha de estado EMD com ícone de semáforo:
  - 🟢 `EMD Válido até [Mês/Ano]`
  - 🟠 `EMD expira em [X] dias`
  - 🔴 `EMD Caducado`
  - ⚪ `EMD em Validação` (documento submetido a aguardar avaliação médica)
  - ⛔ `EMD em Falta`
- Linha de estado Documentação Civil com ícone de semáforo:
  - 🟢 `Documentação Válida`
  - ⚪ `Pendente de Validação`
  - 🔴 `Documentação Caducada`
  - 🔴 `Documento Rejeitado`
- **Menu Contextual `···`** (três pontos, canto superior direito do cartão):
  - `Registar Bloqueio Manual` — sempre visível → abre **Modal "Registar Bloqueio Manual"**.
  - `Resolver Pendência / Desbloquear` — **visível apenas se o atleta tiver pelo
    menos um bloqueio burocrático ativo** → abre **Modal "Resolver Pendência"**.

**Estado Vazio (EE sem atletas associados):**
Texto centrado: `"Nenhum atleta associado a este responsável."`
Botão Outline: `+ Associar Atleta` → Navega para ABA 2 em modo de criação.

---

**Painel de Aviso Financeiro**
(**Visível apenas quando o total de dívida vencida do EE é > 0,00€.**)

- Fundo vermelho claro, ícone de aviso `⚠` à esquerda.
- Texto: `"Aviso: Este utente possui um valor total em dívida de [Valor Total]€"`

---

**Botão Secundário (Outline, rodapé da tab):**
`+ Anexar Documento Presencial` → Abre **Modal "Anexar Documento Presencial"**.

---

#### Tab B: Plano de Pagamentos

**Título:** `Mensalidades e Quotas`

**Tabela de Débitos:**

| Coluna | Tipo | Detalhes |
|---|---|---|
| `[Checkbox]` | Seleção | Checkbox individual por linha. Cabeçalho da coluna tem `[ ] Sel. Todos`. |
| `Descrição` | Texto | Ex: `Mensalidade Fevereiro 25/26 (Sócio)` ou `Mensalidade Fevereiro 25/26 (Base)` — o sufixo `(Sócio)` ou `(Base)` reflete o estatuto atual do EE e distingue a tabela de preços aplicada. Para quotas: `Quota Associativa 25/26`. |
| `Entidade` | Badge | `SAD` (badge azul) ou `Clube` (badge verde), conforme mapeamento do Escalão definido em RF-06. |
| `Data Venc.` | Data | Formato `dd/mm/aaaa`. Itens com data **vencida** (anterior à data atual) exibem a data a **vermelho**. |
| `Valor` | Monetário | Ex: `35,00€`. |

**Estado Vazio (sem débitos pendentes):**
Texto centrado: `"Não existem mensalidades ou quotas pendentes para este utente."`

**Ações de Rodapé (fora da tabela):**

- Botão Outline (esquerda): `+ Adicionar Artigo Extra` → Abre **Modal "Adicionar Artigo Extra"**.
- Botão Dourado (direita): `Liquidar Selecionados ([X]) — Total: [Valor]€`
  - `[X]` = contagem dinâmica de itens selecionados.
  - `[Valor]` = soma dinâmica dos valores das checkboxes ativas, em euros.
  - **Estado Desativado** (cinza, não-clicável): quando `[X] = 0` (nenhuma checkbox marcada).
  - **Estado Ativo**: ao ter ≥ 1 item selecionado → ao clicar, navega para **Nível 3 — Checkout**.

---

#### Tab C: Histórico de Faturas

**Tabela de Documentos:**

| Coluna | Tipo | Detalhes |
|---|---|---|
| `Fatura` | Código + Tag | Código da fatura (ex: `FT 2026/0124`). Tag `HOJE` (badge azul) visível exclusivamente em faturas cuja data de emissão é o dia corrente. |
| `Data` | Data | Formato `dd/mm/aaaa`. |
| `Entidade` | Badge | `SAD` (badge azul) ou `Clube` (badge verde). |
| `Método` | Texto | Canal de pagamento utilizado: `Numerário`, `Multibanco` ou `MBWay`. |
| `Valor` | Monetário | Ex: `35,00€`. |
| `Ação` | Ícone | Ícone de impressora `🖨`. Ao clicar, gera a 2ª via da fatura em PDF para impressão/download direto. |

**Estado Vazio:**
Texto centrado: `"Não existem faturas registadas para este utente."`

---

### Nível 3 — Ecrã de Checkout (Nova Liquidação)

**Breadcrumb (topo):** `Atendimento > [Nome Completo do EE] > Nova Liquidação`

---

**Banner de Alerta Financeiro**
(**Visível apenas se o utente tiver obrigações com vencimento há mais de 30 dias.**)

- Fundo laranja, ícone `⚠` à esquerda.
- Texto: `"⚠ Este sócio tem mensalidades vencidas há mais de 30 dias. O cartão digital pode estar temporariamente bloqueado."`

---

**Layout em Duas Colunas:**

##### Coluna Esquerda — Resumo da Fatura

- **Título:** `Resumo da Fatura`
- Linha de subtotal: `Total de Artigos ([X])` alinhado à esquerda · `[Valor Total]€` alinhado à direita.
- Linha de distribuição: `Distribuição: Clube: [ValorClube]€  ·  SAD: [ValorSAD]€`
  (valores calculados automaticamente com base na entidade de cada rubrica, per RF-33).
- Linha final: **`Total a Pagar: [Valor Total]€`** (Bold, tamanho maior).
- **Campo Opcional:** Input `NIF para fatura (Terceiro)`. Placeholder: `"NIF alternativo (opcional)"`.
  Ao preencher, o NIF inserido é usado **exclusivamente** na emissão deste documento fiscal,
  sem alterar a ficha mestre do EE.
- **Método de Pagamento (seleção obrigatória):**
  - Título da secção: `Método de Pagamento *`
  - Grupo de **3 botões de seleção exclusiva** (apenas um ativo de cada vez; nenhum pré-selecionado):
    - `Numerário`
    - `Multibanco`
    - `MBWay`
- **Botão Principal:** `LIQUIDAR PAGAMENTO` (Dourado, largura total da coluna).
  - **Estado Desativado** (cinza, não-clicável): enquanto nenhum método de pagamento
    estiver selecionado.
  - **Estado Ativo**: após seleção de método → ao clicar, processa o pagamento e apresenta
    o **Estado de Sucesso** abaixo.

##### Coluna Direita — Artigos Selecionados

- **Título:** `Artigos Selecionados`
- Botão Outline: `+ Adicionar Artigo Extra` → Abre **Modal "Adicionar Artigo Extra"**.
- **Tabela de Itens:**

| Coluna | Detalhes |
|---|---|
| `Descrição` | Ex: `Mensalidade Fevereiro 25/26 (Sócio)` ou `Taxa inscrição torneio`. |
| `Entidade` | Badge `SAD` ou `Clube`. |
| `Valor` | Ex: `35,00€`. |

---

**Botão Secundário (Outline, rodapé do ecrã, fora das colunas):**
`← Cancelar e Voltar` → Regressa para **Nível 2 (Ficha 360º)** sem processar pagamento.

---

**Estado de Sucesso — Ecrã Pós-Liquidação**
(Substitui o layout do Checkout após processamento bem-sucedido.)

- Ícone de check verde (grande, centrado).
- Título: `Pagamento registado com sucesso!`
- Sub-texto: `"Fatura [Nº da Fatura] emitida."`
- Dois botões:
  - Botão Outline: `🖨 Imprimir / Descarregar Fatura`
  - Botão Dourado: `Voltar à Ficha do Utente` → Regressa para Nível 2.

---

## 📁 ABA 2: Gestão de Entidades

**Objetivo:** Cadastro, consulta e edição centralizada de perfis de Atletas, Sócios
e Encarregados de Educação (Master Data do clube).

---

### Nível 1 — Listagem de Entidades

#### Barra Superior

- Barra de pesquisa direta. Placeholder: `"Pesquisar por nome ou NIF..."`
- Botão Outline `Filtros ▾` → Abre **Pop-over de Filtros**:
  - `[ ] Apenas com Dívidas`
  - `[ ] Apenas Sócios`
  - Os filtros são aplicados **automaticamente** ao assinalar/desassinalar cada checkbox.
  - Botão de texto `Limpar Filtros` (visível apenas quando ≥ 1 filtro está ativo).
- Botão Dourado (extremo direito): `+ Novo Registo` → Navega para **Nível 2** em
  modo de criação.

#### Tabela de Entidades

| Coluna | Detalhes |
|---|---|
| `Nome` | Nome completo. |
| `Tipo` | Badge: `Atleta`, `Sócio` ou `EE`. Uma entidade pode ter múltiplos badges. |
| `NIF` | Número de identificação fiscal. |
| `Contacto` | Número de telemóvel. |
| `Status` | Badge: `Ativo` (verde) ou `Arquivado` (cinza). |
| `Ações` | Menu `···`: opção `Editar` → Navega para Nível 2 em modo de edição; opção `Ver Histórico` → Abre vista de auditoria read-only do registo. |

**Paginação:** `← Anterior` e `Próxima →` no rodapé.

**Estado Vazio:** `"Nenhuma entidade encontrada para os critérios aplicados."`

---

### Nível 2 — Formulário de Registo / Edição

**Breadcrumb:**
- Modo Criação: `Gestão de Entidades > Novo Registo`
- Modo Edição: `Gestão de Entidades > [Nome da Entidade]`

---

#### Painel 1 — Dados Pessoais

- Input `Nome Completo` *(obrigatório)*.
  - *(Modo Edição — campo bloqueado: texto cinza, não editável. Aviso abaixo do campo:
    `"Campo bloqueado após criação. Contacte a Administração de Sistema para retificar."` )*
- Input `NIF` *(obrigatório)*. Placeholder: `"000 000 000"`.
  - Validação: exatamente 9 dígitos numéricos.
  - Erros inline:
    - `"NIF inválido (deve conter 9 dígitos)."`
    - `"Este NIF já existe no diretório."`
- Input `Data de Nascimento` *(obrigatório)*. Placeholder: `"dd/mm/aaaa"`.
  - *(Modo Edição — campo bloqueado, mesmo aviso do Nome.)*
- Input `Morada` *(opcional)*. Placeholder: `"Rua, Nº, Código Postal, Localidade"`.
- Input `Email` *(obrigatório)*. Placeholder: `"exemplo@email.com"`.
  - Validação: formato de e-mail válido. Erro inline: `"Endereço de e-mail inválido."`
- Input `Telemóvel` *(obrigatório)*. Placeholder: `"9XX XXX XXX"`.

---

#### Painel 2 — Tipologia & Vínculos

- **Switch `Registar como Sócio`**
  - Texto de apoio (sempre visível): `"O número de sócio é gerado automaticamente após a gravação."`
  - *(Modo Edição de registo já Sócio: switch ativo; linha adicional read-only:
    `Nº de Sócio: [Número]`)*
- **Switch `Registar como Atleta`**
  - Quando **ativo**, revela o Painel 3 e as seguintes opções:
    - `Checkbox: [ ] O atleta assume a própria responsabilidade financeira
      (atleta maior de idade ou emancipado)`
    - Se checkbox **marcada**: campo de pesquisa de EE fica **oculto**; o sistema
      criará automaticamente uma ficha de EE em nome do próprio atleta.
      Texto informativo: `"Uma ficha de Encarregado de Educação será criada
      automaticamente em nome do próprio atleta."`
    - Se checkbox **desmarcada** *(estado por omissão)*: Painel 3 exibe o campo de
      pesquisa e associação de EE.

---

#### Painel 3 — Responsável Financeiro

*(Visível apenas quando `Registar como Atleta` está ativo e a checkbox de maioridade
está desmarcada.)*

**Cartão de Identificação do Responsável Atual** *(visível após associação)*:
- `Nome: [Nome do EE]`
- `NIF: [NIF do EE]`
- `Email: [Email do EE]`
- Botão Outline `Alterar Responsável` *(visível apenas em modo Edição)* → Revela o
  campo de pesquisa abaixo.

**Campo de Pesquisa de EE** *(visível em modo Criação ou após clicar `Alterar Responsável`)*:
- Placeholder: `"Pesquisar EE por nome ou NIF..."`
- Comportamento: inicia a pesquisa após ≥ 3 caracteres (debounce ≥ 300 ms).
- Apresenta lista de sugestões com `[Nome do EE] — [NIF]`.
- Ao selecionar uma sugestão, o Cartão de Identificação acima é populado.

---

#### Rodapé do Formulário

- Botão Outline: `Cancelar` → Regressa para Nível 1 sem guardar.
- Botão Dourado:
  - Modo Criação: `Criar Entidade`
  - Modo Edição: `Guardar Alterações`

**Validação ao Submeter:** Todos os campos obrigatórios (*) em falta ficam
destacados com borda vermelha e mensagem inline: `"Campo obrigatório."`

**Estado de Sucesso (pós-gravação):**
- Redireciona para Nível 1.
- Banner verde no topo da listagem (desaparece automaticamente após 4 segundos):
  - Criação: `"Entidade criada com sucesso."`
  - Edição: `"Alterações guardadas com sucesso."`

---

## 📁 ABA 3: Validação Documental

**Objetivo:** Triagem e certificação de documentos civis e institucionais
(**Cartão de Cidadão** e **Fotografia de Perfil**) submetidos via Portal B2C.

> **Nota RBAC:** EMDs são **automaticamente encaminhados** para a fila médica e
> **não são visíveis** nesta aba para o perfil `ROLE_SECRETARIA`.

**Layout Split-Pane Assimétrico** (~35% esquerda · ~65% direita).

---

### Painel Esquerdo — Fila de Trabalho

**Mini-Dashboard (topo do painel) — 3 métricas em linha:**
`[N] Pendentes` · `[X] Aprovados este mês` · `[Y] Rejeitados`

**Filtro por Estado (tabs horizontais imediatamente abaixo):**
`Pendentes` *(ativo por omissão)* | `Histórico`

**Barra de Pesquisa:** Placeholder: `"Pesquisar entidade..."`

---

**Estrutura de Cada Cartão de Documento Pendente:**
[Nome do Atleta]                         [Há X horas / Há X dias]
Perfil: [Tipo] ([Escalão, se aplicável])
Origem: Portal B2C
Submetido por: [Nome do EE]
[Ícone Documento] [Tipo de Documento] · [Data de Submissão dd/mm/aaaa]

*Exemplo:*
João Silva                                            Há 2h
Perfil: Atleta (Sub-15)
Origem: Portal B2C
Submetido por: Carlos Silva [EE]
[Ícone] Cartão de Cidadão · 12 Maio 2026

Ao clicar num cartão → o documento correspondente é carregado no Painel Direito.
O cartão selecionado fica com fundo de destaque (estado ativo).

**Estado Vazio (sem documentos pendentes):**
Texto centrado no painel: `"Nenhum documento pendente de validação."`

---

**Estrutura de Cada Cartão no Histórico** *(tab Histórico)*:

Igual ao cartão de pendente, mas com um badge adicional de resultado:
- Badge verde `Aprovado` ou badge vermelho `Rejeitado`.

---

### Painel Direito — Zona de Auditoria

**Estado Inicial / Vazio (sem documento selecionado):**
Texto centrado: `"Selecione um documento da lista para iniciar a auditoria."`

---

**Estado Ativo (documento selecionado):**

**Área de Pré-visualização:**
Componente de visualização de ficheiro (PDF ou PNG) que ocupa a maior parte do painel.
Suporta zoom básico (botões `+` e `−`).

---

**Painel Inferior — Ações de Decisão:**

- **Campo `Data de Validade do Documento`:**
  - Placeholder: `"dd/mm/aaaa"`.
  - **Visível e obrigatório** apenas quando o tipo de documento é `Cartão de Cidadão`.
  - **Oculto** para `Fotografia de Perfil`.
- **Textarea `Justificação Administrativa`:**
  - Placeholder: `"Preencha obrigatoriamente para rejeitar, ou adicione notas facultativas à aprovação..."`
  - Altura mínima visível: 4 linhas.
  - O preenchimento desta textarea (mínimo 1 caractere) é o **único gatilho** que ativa
    o botão `✕ Rejeitar Documento`.
- **Botão Verde:** `✓ Aprovar Documento`
  - **Desativado** se o documento for `Cartão de Cidadão` e o campo
    `Data de Validade` estiver vazio.
  - **Ativo** nas restantes condições válidas.
- **Botão Vermelho:** `✕ Rejeitar Documento`
  - **Desativado** (cinza, não-clicável) enquanto a textarea `Justificação Administrativa`
    estiver vazia.
  - **Ativo** assim que a textarea contiver ≥ 1 caractere.

---

**Comportamento Pós-Decisão** (após clicar `Aprovar` ou `Rejeitar`):

1. O cartão tratado **desaparece** da lista `Pendentes`.
2. O mesmo cartão **aparece** na lista `Histórico` com o badge de resultado
   (`Aprovado` verde ou `Rejeitado` vermelho).
3. O Painel Direito **volta ao estado vazio**: `"Selecione um documento da lista para iniciar a auditoria."`
4. O contador `[N] Pendentes` no mini-dashboard **decrementa em 1**.
5. O badge da aba de navegação `Validação Documental [N]` **decrementa em 1**.
   Se N atingir 0, o badge é ocultado.

---

## 📁 ABA 4: Configurações Operacionais

**Objetivo:** Controlo do ciclo de vida das épocas desportivas e execução do motor
de faturação automática em lote.

**Layout em Dois Painéis Horizontais** (lado a lado, cada um com ~50% da largura).

---

### Painel Esquerdo — Gestão de Épocas Desportivas

**Título:** `Épocas Desportivas`

**Botão Outline** (topo direito do painel): `+ Nova Época` → Abre **Modal "Nova Época"**.

**Tabela de Épocas:**

| Coluna | Detalhes |
|---|---|
| `Época` | Nome descritivo (ex: `2025/2026`). |
| `Início` | Formato `dd/mm/aaaa`. |
| `Fim` | Formato `dd/mm/aaaa`. |
| `Estado` | Badge: `Em Planeamento` (azul) · `Ativa` (verde) · `Encerrada` (cinza). |
| `Ação` | Botão `Ativar Época` (vermelho) — **visível exclusivamente** em linhas cujo `Estado = "Em Planeamento"`. Linhas com `Estado = "Ativa"` ou `Estado = "Encerrada"` **não têm botão de ação**. → Ao clicar, abre **Modal "Ativar Época"**. |

**Estado Vazio (sem épocas criadas):**
Texto centrado: `"Nenhuma época desportiva registada. Crie a primeira época para começar."`
Botão Dourado centrado: `+ Nova Época`

---

### Painel Direito — Motor de Provisões (Lote)

- **Título:** `Motor de Provisões (Lote)`
- **Subtítulo:** `Processamento de Mensalidades`
- **Texto Descritivo:** `"Este motor deteta e processa automaticamente as mensalidades
  em falta para atletas inscritos sem plano de faturação gerado na época ativa."`

**Bloco "Estado do Sistema"** (fundo cinza claro, bordas arredondadas):
- Quando N > 0 (existem atletas sem provisões): texto cor laranja —
  `"Foram detetados [N] atletas inscritos sem plano de mensalidades na época ativa."`
- Quando N = 0 (tudo processado): texto cor verde —
  `"Não há atletas com mensalidades pendentes de processamento."`

**Botão Principal:** `Pré-visualizar & Processar Lote` (Dourado, largura total do painel).
- **Estado Desativado** (cinza, não-clicável): quando `N = 0`.
- **Estado Ativo**: quando `N > 0` → ao clicar, abre **Modal "Resumo de Provisões"**.

**Estado de Sucesso (pós-processamento):**
Banner verde no painel direito: `"Processamento concluído. [N] planos de mensalidades
gerados com sucesso."` (permanente até nova navegação).

---

## 🛠️ Modais e Componentes Globais

### Regras Globais de Modais

- Todos os modais têm botão `✕` de fecho no canto superior direito.
- Clicar no **overlay escuro** fora do modal fecha-o sem guardar.
- Campos marcados com `*` são **obrigatórios**; ao submeter com campo vazio, exibem
  mensagem inline `"Campo obrigatório."` e ficam com borda vermelha.
- **Cor dos botões de confirmação:**
  - Ação destrutiva / irreversível → **Vermelho**.
  - Ação positiva / de criação → **Dourado**.
  - Ação neutral / de cancelamento → **Outline/Cinza**.

---

### Modal 1 — "Nova Época"

- **Título:** `Criar Nova Época`
- **Campos:**
  - Input `Nome da Época` * — Placeholder: `"ex: 2026/2027"`.
  - Input `Data de Início` * — Placeholder: `"dd/mm/aaaa"`.
  - Input `Data de Fim` * — Placeholder: `"dd/mm/aaaa"`.
- **Validação:**
  - Data de Início deve ser anterior à Data de Fim.
    Erro inline: `"A data de início deve ser anterior à data de fim."`
  - As datas não podem sobrepor-se a uma época já registada.
    Erro inline: `"As datas inseridas sobrepõem-se com uma época já registada."`
- **Botões:** `Cancelar` (Outline) · `Criar Época` (Dourado).

---

### Modal 2 — "Ativar Época"

- **Título:** `⚠ Aviso Crítico — Ação Irreversível`
- **Mensagem:** `"Está prestes a ativar a época '[Nome da Época]'. Esta ação encerrará
  irreversivelmente a época atualmente ativa e despoletará a geração automática de
  provisões de faturação para todos os atletas ativos. Esta operação não pode ser
  desfeita. Confirma?"`
- **Botões:** `Cancelar` (Outline) · `Confirmar e Ativar` (**Vermelho**).

---

### Modal 3 — "Resumo de Provisões"

- **Título:** `Pré-visualização do Lote de Provisões`
- **Conteúdo dinâmico:**
  - `"Atletas a processar: [N]"`
  - `"Quotas a gerar: [X]"`
  - `"Mensalidades a gerar: [Y]"`
  - `"Total prospetivo: [Valor]€"`
- **Aviso:** `"Os valores acima são uma estimativa baseada nas tabelas do Escalão e
  no estatuto de Sócio de cada EE na data de hoje."`
- **Botões:** `Cancelar` (Outline) · `Processar Agora` (Dourado).

---

### Modal 4 — "Impacto Financeiro (Sócio)"

- **Título:** `Confirmar Alteração de Estatuto de Sócio`
- **Mensagem (dinâmica, dois cenários):**
  - Ao **remover** estatuto: `"Atenção: Retirar o estatuto de Sócio a [Nome do EE]
    irá recalcular [N] mensalidades pendentes. O valor mensal passará
    de [ValorAtual]€ para [ValorNovo]€."`
  - Ao **atribuir** estatuto: `"Ao atribuir o estatuto de Sócio a [Nome do EE],
    [N] mensalidades pendentes serão recalculadas. O valor mensal passará
    de [ValorAtual]€ para [ValorNovo]€."`
- **Botões:** `Cancelar` (Outline) · `Confirmar Alteração` (Dourado).

---

### Modal 5 — "Adicionar Artigo Extra"

- **Título:** `Adicionar Artigo Extra`
- **Campos:**
  - Input `Descrição do Artigo` * — Placeholder: `"ex: Taxa de inscrição em torneio"`.
  - Input `Valor (€)` * — Tipo numérico; placeholder: `"0,00"`. Apenas valores positivos.
- **Botões:** `Cancelar` (Outline) · `Adicionar à Fatura` (Dourado).

---

### Modal 6 — "Registar Bloqueio Manual"

- **Título:** `Registar Bloqueio Documental`
- **Campos:**
  - Dropdown `Motivo do Bloqueio` * — Placeholder: `"Selecione o motivo..."`.
    Opções:
    - `Documentação Irregular`
    - `Documento em Falta`
    - `Documento Caducado`
    - `Ação Disciplinar`
    - `Outro`
  - Textarea `Observações` * — Placeholder: `"Descreva o motivo para registo no
    histórico de auditoria..."`. Altura: 4 linhas. Mínimo: 10 caracteres.
- **Botões:** `Cancelar` (Outline) · `Confirmar Bloqueio` (**Vermelho**).

---

### Modal 7 — "Resolver Pendência / Desbloquear"

- **Título:** `Levantar Restrição Documental`
- **Texto Informativo (fundo cinza claro):**
  `"Ao confirmar, a restrição burocrática ativa será removida do perfil do atleta.
  Se existirem outras restrições ativas (médicas ou financeiras), a elegibilidade
  global pode permanecer suspensa."`
- **Campos:**
  - Textarea `Notas de Resolução` * — Placeholder: `"Descreva como a situação foi
    regularizada (ex: documento apresentado presencialmente)..."`.
    Altura: 4 linhas. Mínimo: 10 caracteres.
- **Botões:** `Cancelar` (Outline) · `Confirmar Desbloqueio` (Dourado).

---

### Modal 8 — "Anexar Documento Presencial"

- **Título:** `Anexar Documento Presencial`
- **Campos:**
  - Dropdown `Tipo de Documento` * — Placeholder: `"Selecione o tipo de documento..."`.
    Opções:
    - `Cartão de Cidadão`
    - `EMD (Exame Médico-Desportivo)`
    - `Fotografia de Perfil`
  - **Campos e mensagens condicionais** (dependem da seleção do Dropdown):
    - Se `Cartão de Cidadão` → Exibe input `Data de Validade` * (Placeholder:
      `"dd/mm/aaaa"`).
    - Se `EMD` → Exibe banner laranja informativo:
      `"ℹ Este documento será automaticamente encaminhado para a fila de validação
      do Departamento Médico. Não necessita de ação adicional da Secretaria."`
      (nenhum campo extra).
    - Se `Fotografia de Perfil` → Sem campos adicionais nem mensagem.
  - **Zona de Upload (Drag & Drop):**
    - Texto central: `"Arraste o ficheiro para aqui ou clique para selecionar"`
    - Sub-texto: `"Formatos aceites: PDF, PNG  ·  Tamanho máximo: 5 MB"`
    - Após seleção de ficheiro válido: exibe `[Nome do ficheiro] · [Tamanho]` com
      ícone de remoção `✕` para cancelar a seleção.
    - Se o ficheiro tiver **formato inválido**: erro inline (sem envio ao servidor):
      `"Formato inválido. Apenas PDF e PNG são aceites."`
    - Se o ficheiro **exceder 5 MB**: erro inline (sem envio ao servidor):
      `"O ficheiro excede o tamanho máximo permitido de 5 MB."`
- **Botões:** `Cancelar` (Outline) · `Submeter Documento` (Dourado).
  - **Estado Desativado** (cinza): enquanto o tipo de documento não estiver selecionado
    **ou** nenhum ficheiro válido estiver carregado na zona de upload.
  - **Estado Ativo**: ambas as condições satisfeitas simultaneamente.