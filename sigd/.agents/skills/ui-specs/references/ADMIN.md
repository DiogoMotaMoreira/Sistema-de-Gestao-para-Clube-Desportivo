# Módulo: Administração de Sistema (Perfil: `ROLE_ADMIN`)

**Visão Geral:** O painel de controlo técnico e de segurança do SIGD. Reservado
exclusivamente a técnicos de TI do clube. Cobre o provisionamento de acessos
(RBAC), a monitorização de segurança (Audit Trail), a gestão do motor de
comunicações e a configuração de dados de referência estrutural.

**Página Inicial (Landing Page):** `ABA 1 — Gestão de Acessos`.

---

## Barra de Navegação Principal (sempre visível no topo do módulo)

Três abas fixas:
`Gestão de Acessos` | `Auditoria e Segurança` | `Configurações Globais`

---

## ABA 1: Gestão de Acessos (RBAC)

**Objetivo:** Controlo do diretório de contas de utilizadores internos (Staff) e
atribuição rigorosa de perfis de permissão (Roles).

---

### Nível 1 — Listagem de Utilizadores

**Barra de Sumário (topo, acima da tabela):**
Uma linha discreta de texto secundário (Gray 500, 12px):
`[X] colaboradores  ·  [Y] bloqueados  ·  [Z] sem login registado`

> "Sem login registado" = utilizadores cuja coluna `Último Login` é `Nunca`
> (conta criada mas nunca autenticada).

---

**Barra de Ações:**

- Campo de pesquisa. Placeholder: `"Pesquisar por nome ou email..."`
  - Comportamento: consulta ativada após ≥ 3 caracteres (debounce ≥ 300ms).
- Botão Outline `Filtros ▾` → abre **Pop-over de Filtros**:
  - Secção "Por Perfil": checkboxes `Todos os Perfis` (default) · `ROLE_ADMIN` ·
    `ROLE_SECRETARIA` · `ROLE_TREINADOR` · `ROLE_MEDICO` ·
    `ROLE_DIRECAO_TECNICA` · `ROLE_CFO`
  - Secção "Por Estado": `Todos os Estados` (default) · `Ativo` · `Bloqueado`
  - Botão de texto `Limpar Filtros` (visível apenas quando ≥ 1 filtro ativo).
- Botão Dourado (extremo direito): `+ Novo Colaborador` → navega para
  **Nível 2** em modo de criação.

---

**Tabela de Acessos:**

| Coluna | Detalhes |
|---|---|
| `Utilizador` | Nome completo (Bold, 14px) na linha superior. Email (Gray 500, 12px) na linha inferior. |
| `Perfil(es)` | Um ou mais Soft Badges (Pills). Cor por role: `ROLE_ADMIN` → badge Vermelho (fundo `#FEE2E2`, texto `#991B1B`); todos os outros roles → badge Info/Azul (fundo `#EFF6FF`, texto `#1D4ED8`). Texto do badge = nome curto do role sem o prefixo "ROLE_" (ex: "Admin", "Secretaria", "Treinador", "Médico", "Direção Técnica", "CFO"). |
| `Último Login` | Formato: `DD MMM AAAA, HH:MM` (ex: `13 Mai 2026, 09:34`). Se nunca autenticado: texto `Nunca` em Gray 500 itálico. |
| `Estado` | Soft Badge: `Ativo` → badge Verde (fundo `#ECFDF5`, texto `#047857`, ícone Lucide `CheckCircle`). `Bloqueado` → badge Vermelho (fundo `#FEE2E2`, texto `#991B1B`, ícone Lucide `Lock`). |
| `Ações` | Menu `···` (três pontos) com opções contextuais listadas abaixo. |

**Opções do menu `···` (contextuais por estado da conta):**
- `Editar Perfil` → navega para **Nível 2** em modo de edição.
- `Editar Campos Críticos` → abre **Modal "Editar Campos Críticos"** *(exclusivo para corrigir Nome ou Data de Nascimento de atletas, operação que a Secretaria não tem permissão — UC-01.2 secundário)*.
- `Forçar Reset Password` → abre **Modal "Forçar Reset de Password"**.
- **Condicional por Estado:**
  - Se `Estado = Ativo` → opção `Bloquear Acesso` (texto Vermelho) → abre
    **Modal "Bloquear Acesso"**.
  - Se `Estado = Bloqueado` → opção `Reativar Acesso` (texto Verde) → abre
    **Modal "Reativar Acesso"**.

**Paginação:** `← Anterior` e `Próxima →` no rodapé da tabela.

**Estado Vazio (tabela sem utilizadores ou pesquisa sem resultados):**
- Ícone vetorial Lucide `Users` (centrado, grande, opacidade 10%, Gray 200).
- Título: `"Nenhum colaborador registado"`
- Sub-título: `"Crie o primeiro acesso ao sistema para que o staff possa
  autenticar-se."`
- Botão Dourado: `+ Novo Colaborador`

**Estado Vazio (filtros aplicados sem resultados):**
- Ícone Lucide `SearchX` (centrado, opacidade 10%).
- Título: `"Nenhum resultado encontrado"`
- Sub-título: `"Tente ajustar os filtros ou a cadeia de pesquisa."`
- Botão Outline: `Limpar Filtros`

---

### Nível 2 — Formulário de Criação / Edição

**Breadcrumb (topo):**
- Modo Criação: `Gestão de Acessos > Novo Colaborador`
- Modo Edição: `Gestão de Acessos > [Nome Completo do Utilizador]`

---

**Painel 1 — Dados do Colaborador:**

- Input `Nome Completo` *(obrigatório)*. Placeholder: `"ex: João Silva"`.
  - Erro inline: `"Campo obrigatório."`
- Input `Email Institucional` *(obrigatório)*. Placeholder: `"ex: joao.silva@boavistafc.pt"`.
  - Validação: formato de e-mail válido.
  - Erro inline (formato): `"Endereço de e-mail inválido."`
  - Erro inline (duplicado): `"Este e-mail já está registado no sistema."`

---

**Painel 2 — Atribuição de Roles:**

Lista de checkboxes individuais (uma por linha):

| Checkbox | Label Visível | Nota de Comportamento |
|---|---|---|
| `[ ] ROLE_ADMIN` | `Administrador de Sistema` | **Bloqueada e não editável** se este utilizador for o único Admin ativo. Ao passar o cursor: tooltip `"Não é possível remover o único Administrador de Sistema ativo."` |
| `[ ] ROLE_SECRETARIA` | `Secretaria` | — |
| `[ ] ROLE_TREINADOR` | `Treinador` | — |
| `[ ] ROLE_MEDICO` | `Médico / Departamento Clínico` | — |
| `[ ] ROLE_DIRECAO_TECNICA` | `Direção Técnica` | — |
| `[ ] ROLE_CFO` | `Direção Executiva / CFO` | — |

Texto de apoio (abaixo da lista, Gray 500, 12px):
`"Um utilizador pode acumular múltiplos perfis em simultâneo."`

---

**Painel 3 — Segurança:**

- Checkbox: `[ ] Obrigar a mudar password no próximo login`
  - Texto descritivo (Gray 500, 12px): `"O utilizador será redirecionado para a
    página de redefinição de password na próxima autenticação."`

---

**Rodapé do Formulário:**

- Botão Outline: `Cancelar` → regressa ao **Nível 1** sem guardar.
- Botão Dourado:
  - Modo Criação: `Criar Colaborador`
  - Modo Edição: `Guardar Alterações`

**Estado de Sucesso (pós-gravação):**
- Redireciona para Nível 1.
- Banner Verde no topo da tabela (desaparece após 4 segundos):
  - Criação: `"Conta criada com sucesso. As credenciais foram enviadas para
    [email]."`
  - Edição: `"Perfil atualizado com sucesso."`

---

## ABA 2: Auditoria e Segurança (Audit Trail)

**Objetivo:** Registo imutável, somente de leitura, de todos os eventos críticos
do sistema (RF-24 / RNF-10).

**Nota de imutabilidade (banner fixo de informação, fundo `#EFF6FF`, texto
`#1D4ED8`, ícone Lucide `ShieldCheck`):**
`"Este registo é imutável (append-only). Nenhum utilizador, incluindo o
Administrador, pode editar ou eliminar entradas de auditoria."`

---

### Barra de Filtros

Linha de inputs em sequência:

- Input Date `De` (Placeholder: `"dd/mm/aaaa"`)
- Input Date `Até` (Placeholder: `"dd/mm/aaaa"`)
  - Validação: Data "De" deve ser anterior ou igual a "Até".
    Erro inline: `"A data inicial deve ser anterior à data final."`
- Dropdown `Módulo de Origem`. Placeholder: `"Todos os Módulos"`. Opções:
  - `Todos os Módulos` *(default)*
  - `Gestão de Acessos`
  - `Secretaria`
  - `Clínica / Departamento Médico`
  - `Tesouraria`
  - `Direção Técnica`
  - `Portal Utilizador`
  - `Configurações Globais`
  - `Autenticação`
- Dropdown `Tipo de Operação`. Placeholder: `"Todos os Tipos"`. Opções:
  - `Todos os Tipos` *(default)*
  - `AUTENTICAÇÃO` — inclui LOGIN, LOGOUT, LOCKOUT, RESET_PASSWORD
  - `CRIAÇÃO` — inclui registos novos de qualquer entidade
  - `EDIÇÃO` — inclui atualizações de dados
  - `AÇÃO DE SEGURANÇA` — inclui BLOQUEAR_ACESSO, REVOGAR_ROLE, FORÇAR_RESET
  - `EXPORTAÇÃO` — inclui EXPORTAR_LOGS, EXPORTAR_CSV
  - `VALIDAÇÃO_DOCUMENTAL` — inclui aprovações/rejeições de EMD e documentos civis
  - `LIQUIDAÇÃO_FINANCEIRA` — inclui LIQUIDAR_PAGAMENTO, GERAR_PROVISAO
  - `GESTÃO_CLÍNICA` — inclui ALTA_MEDICA, ABERTURA_OCORRENCIA
- Input de pesquisa. Placeholder: `"Pesquisar por nome ou ID do ator..."`
- Botão de texto `Limpar Filtros` (visível apenas quando ≥ 1 filtro ativo).
- Botão Outline (extremo direito): `Exportar Logs (CSV)`

---

### Tabela de Auditoria

**Status: Read-Only Absoluto.** Nenhuma célula é editável.

| Coluna | Detalhes |
|---|---|
| `Data / Hora` | Formato: `DD MMM AAAA, HH:MM:SS` (ex: `13 Mai 2026, 09:34:12`). |
| `Ator` | Nome do utilizador (Bold) na linha superior. Role (Gray 500, 12px) na linha inferior. Ex: `João Silva` / `Administrador de Sistema`. |
| `Ação` | Soft Badge com código de cor por categoria: **Segurança/Destrutiva** (BLOQUEAR_ACESSO, REVOGAR_ROLE, FORÇAR_RESET, ELIMINAR) → badge Vermelho (fundo `#FEE2E2`, texto `#991B1B`). **Criação** (CREATE_*) → badge Verde (fundo `#ECFDF5`, texto `#047857`). **Edição** (UPDATE_*, EDITAR_*) → badge Azul/Info (fundo `#EFF6FF`, texto `#1D4ED8`). **Autenticação / Leitura** (LOGIN, LOGOUT, EXPORTAR, VISUALIZAR) → badge Neutro (fundo `#F1F5F9`, texto `#64748B`). |
| `Módulo` | Texto simples (ex: `Gestão de Acessos`, `Tesouraria`). |
| `Endereço IP` | Formato IPv4 (ex: `192.168.1.45`) ou IPv6 quando aplicável. Fonte monoespaçada. |
| `Detalhe` | Botão Outline `Ver Detalhe` → abre **Modal "Detalhe de Auditoria"**. |

**Paginação:** `← Anterior` e `Próxima →` no rodapé.

**Estado Vazio (sem eventos registados):**
- Ícone Lucide `ShieldCheck` (centrado, grande, opacidade 10%, Gray 200).
- Título: `"Nenhum evento de auditoria registado"`
- Sub-título: `"Os eventos aparecerão aqui à medida que operações forem
  realizadas no sistema."`

**Estado Vazio (filtros sem resultados):**
- Ícone Lucide `SearchX`.
- Título: `"Nenhum evento corresponde aos filtros aplicados"`
- Botão Outline: `Limpar Filtros`

---

## ABA 3: Configurações Globais & Comunicações

**Objetivo:** Painel técnico de TI para gestão do gateway de comunicações,
configuração de parâmetros globais e dados de referência estrutural.

**Layout em dois painéis verticais** lado a lado (desktop), empilhados
(mobile).

---

### Painel A — Gateway de Comunicações (SMTP/Push)

**Título do Painel:** `Gateway de Comunicações (SMTP/Push)`

**Label contextual de ambiente** (texto Gray 500, 12px, abaixo do título):
`"Configurado atualmente: Mailtrap (Ambiente de Desenvolvimento)"`

---

**Credenciais de Acesso:**

- Input mascarado (tipo password) `API Key`. Placeholder: `"••••••••••••••••"`.
  Ícone de olho `Eye / EyeOff` para revelar/ocultar temporariamente.
- Input mascarado (tipo password) `SMTP Password`. Placeholder: `"••••••••••••••••"`.
  Ícone de olho `Eye / EyeOff` para revelar/ocultar temporariamente.

---

**Bloco de Estado da Ligação:**

- Título da secção: `Estado da Ligação`
- Indicador visual inline:
  - **Online:** badge Verde (fundo `#ECFDF5`, ícone `Wifi`, texto `#047857`
    "Online — Gateway Operacional").
  - **Offline:** badge Vermelho (fundo `#FEE2E2`, ícone `WifiOff`, texto
    `#991B1B` "Offline — Falha na Ligação").
  - **Não testado / Desconhecido:** badge Neutro (fundo `#F1F5F9`, ícone
    `HelpCircle`, texto `#64748B` "Estado desconhecido — Execute um teste").
- Botão Outline: `Testar Ligação`

**Comportamento do botão "Testar Ligação":**
- Ao clicar: botão entra em estado de loading (ícone `Loader` giratório, texto
  `"A testar..."`; botão desativado durante o teste).
- **Sucesso:** Botão volta ao normal. Badge de estado atualiza para **Online**.
  Banner Verde inline sob o bloco: `"Ligação estabelecida com sucesso.
  Resposta em [Xms]."`
- **Falha:** Badge de estado atualiza para **Offline**. Banner Vermelho inline:
  `"Falha na ligação. Código de erro: [CÓDIGO]. Verifique as credenciais e o
  estado do serviço externo."`
- O feedback dos banners persiste até ao próximo teste ou até guardar configurações.

---

**Tabela de Registos de Envios Falhados [UC-16.2]:**

**Título da secção:** `Registos de Envios Falhados`

| Coluna | Detalhes |
|---|---|
| `Notificação` | Tipo de notificação (ex: `Convocatória Publicada`, `Alerta EMD`, `Reset de Password`) e módulo de origem em Gray 500 abaixo (ex: `Direção Técnica`). |
| `Destinatário` | Nome do destinatário (Bold) na linha superior. Endereço de email (Gray 500, 12px, fonte monoespaçada) na linha inferior. |
| `Tentativas` | Número inteiro (ex: `3`). Badge Vermelho se ≥ 3 tentativas. |
| `Último Erro` | Código HTTP ou SMTP abreviado em fonte monoespaçada (ex: `550 — Mailbox not found`). |
| `Estado` | Badge: `Falha Permanente` → Vermelho. `Reenvio em Curso` → Amarelo/Aviso (fundo `#FFFBEB`, texto `#B45309`). `Arquivado` → Neutro (Gray). |
| `Ações` | Menu `···` com: `Inspecionar Detalhe` → abre **Modal "Detalhe de Notificação Falhada"**. `Corrigir Contacto` → abre **Modal "Corrigir Contacto do Destinatário"**. `Reenviar Manualmente` → dispara reenvio imediato (estado transita para `Reenvio em Curso`). `Arquivar (Ignorar)` → estado transita para `Arquivado` (sem reenvio). |

**Paginação:** `← Anterior` e `Próxima →` no rodapé.

**Estado Vazio (sem falhas registadas):**
- Ícone Lucide `MailCheck` (centrado, grande, opacidade 10%, Gray 200).
- Título: `"Nenhuma falha de expedição registada"`
- Sub-título: `"Todas as notificações foram entregues com sucesso."`

---

### Painel B — Parâmetros Globais & Locais de Treino

**Título do Painel:** `Parâmetros Globais & Dados de Referência`

---

**Secção: Limiar de Alerta de Caducidade Documental [RF-14]**

- Input numérico `Limiar de Alerta de Caducidade Documental (dias)`.
  Placeholder: `"30"`. Valor padrão: `30`.
  - Validação: valor mínimo `1`, valor máximo `365`. Tipo: inteiro.
  - Erro inline (fora de intervalo): `"O valor deve estar entre 1 e 365 dias."`
  - Erro inline (campo vazio): `"Campo obrigatório."`
- Texto de apoio (Gray 500, 12px): `"Valor aplicado nas rotinas automáticas de
  varrimento de EMDs e documentos civis. Qualquer alteração a este parâmetro é
  registada no Audit Trail com nível de severidade elevado."`

---

**Secção: Locais de Treino e Infraestruturas**

**Título da secção:** `Locais de Treino e Infraestruturas`

**Botão Outline** (topo direito da secção): `+ Novo Local` → abre **Modal
"Novo / Editar Local de Treino"**.

**Tabela de Locais de Treino:**

| Coluna | Detalhes |
|---|---|
| `Nome` | Nome descritivo do local (ex: `Campo Principal João Cardoso`). |
| `Tipo` | Badge Neutro com o tipo: `Campo de Futebol`, `Ginásio`, `Piscina`, `Sala de Reuniões`, `Outro`. |
| `Estado` | Badge: `Ativo` → Verde. `Inativo` → Neutro/Cinza. |
| `Ações` | Menu `···` com: `Editar` → abre Modal de edição. `Desativar` / `Ativar` (condicional por estado). |

**Estado Vazio:**
- Ícone Lucide `MapPin` (centrado, grande, opacidade 10%).
- Título: `"Nenhum local de treino registado"`
- Sub-título: `"Adicione as infraestruturas do clube para disponibilizá-las no
  planeamento de sessões de treino."`
- Botão Dourado: `+ Novo Local`

---

**Rodapé Global da ABA 3:**

- Botão Outline: `Cancelar` → reverte todas as alterações não guardadas.
- Botão Dourado: `Guardar Configurações`

**Estado de Sucesso (pós-gravação):**
Banner Verde no topo do conteúdo da ABA 3 (desaparece após 4 segundos):
`"Configurações guardadas com sucesso. As alterações entram em vigor
imediatamente."`

**Estado de Erro:**
Banner Vermelho:
`"Erro ao guardar configurações. Verifique os campos assinalados e tente
novamente."`

---

## Modais e Componentes Globais

**Regras Globais:**
- Todos os modais têm botão `✕` de fecho no canto superior direito.
- Clicar no backdrop escuro fecha o modal sem guardar.
- Rodapé dos modais: botão Cancelar (Outline) à esquerda →
  botão de confirmação (Dourado ou Vermelho) à direita.
- Campos obrigatórios marcados com `*`; ao submeter com campo vazio exibem
  borda vermelha e erro inline `"Campo obrigatório."`

---

### Modal 1 — "Bloquear Acesso"

- **Título:** `Bloquear Acesso — [Nome do Utilizador]`
- **Mensagem:** `"Tem a certeza que deseja revogar o acesso a [Nome]? A sessão
  atual será terminada imediatamente e o utilizador não poderá autenticar-se
  até que o acesso seja reativado."`
- **Botões:** `Cancelar` (Outline) · `Confirmar e Bloquear` (Destrutivo:
  fundo `#FEE2E2`, texto `#991B1B`).

---

### Modal 2 — "Reativar Acesso"

- **Título:** `Reativar Acesso — [Nome do Utilizador]`
- **Mensagem:** `"Tem a certeza que pretende restaurar o acesso a [Nome]?
  O utilizador poderá autenticar-se novamente na próxima tentativa de login."`
- **Botões:** `Cancelar` (Outline) · `Confirmar e Reativar` (Dourado).

---

### Modal 3 — "Forçar Reset de Password"

- **Título:** `Forçar Redefinição de Password`
- **Conteúdo:** Linha de informação: `"Será enviado um link de recuperação
  temporário para:"` Abaixo: endereço de email do colaborador em destaque
  (Bold, fundo `#F8FAFC`, borda `#E2E8F0`, padding 8px, radius 8px,
  fonte monoespaçada).
- **Aviso** (fundo `#FFFBEB`, texto `#B45309`, ícone Lucide `AlertTriangle`):
  `"O link de recuperação expira ao fim de 24 horas."`
- **Botões:** `Cancelar` (Outline) · `Enviar Email de Reset` (Dourado).
- **Feedback inline pós-clique (substitui o rodapé do modal):**
  - Sucesso: banner Verde `"Email enviado com sucesso para [email]."`
    Botão único: `Fechar`.
  - Gateway offline: banner Laranja/Aviso `"Gateway offline. O email será
    enfileirado e enviado assim que a ligação for restabelecida."` Botão
    único: `Fechar`.

---

### Modal 4 — "Detalhe de Auditoria"

- **Título:** `Detalhe do Evento de Auditoria`
- **Linha de Metadados** (fundo `#F8FAFC`, borda `#E2E8F0`, padding 12px,
  radius 8px, antes do bloco JSON):
  `ID do Evento: [UUID]  ·  [Data/Hora]  ·  Ator: [Nome]  ·  IP: [Endereço IP]`
- **Bloco de Código JSON** (fundo `#1E293B` — Preto azulado escuro, padding
  16px, radius 8px, texto branco, fonte monoespaçada 13px, com scrollbar
  vertical se o conteúdo exceder 300px de altura).
  Campos exibidos no JSON:
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
- **Rodapé:** Botão Outline `Fechar` (único botão; ação de leitura — sem
  confirmação destrutiva).

---

### Modal 5 — "Editar Campos Críticos"

*(Acessível via menu `···` de qualquer utilizador — cumpre UC-01.2 secundário
para edição de campos biográficos bloqueados para a Secretaria.)*

- **Título:** `Editar Campos Biográficos Críticos`
- **Banner de aviso** (fundo `#FEE2E2`, texto `#991B1B`,
  ícone Lucide `ShieldAlert`):
  `"Esta operação sobrepõe as restrições da Secretaria e gera um alerta de
  auditoria de nível SEVERO. Prossiga apenas com autorização formal."`
- **Campos:**
  - Input `Nome Completo` *. Placeholder: `"Nome completo atual do atleta"`.
  - Input `Data de Nascimento` *. Placeholder: `"dd/mm/aaaa"`.
    Validação: data não pode ser futura.
    Erro inline: `"A data de nascimento não pode ser uma data futura."`
- **Texto de apoio** (Gray 500, 12px):
  `"Apenas o Administrador de Sistema tem permissão para modificar estes
  campos. A alteração ficará registada no Audit Trail com o identificador
  do ator responsável."`
- **Botões:** `Cancelar` (Outline) · `Confirmar Alteração Crítica` (Destrutivo:
  fundo `#FEE2E2`, texto `#991B1B`).

---

### Modal 6 — "Detalhe de Notificação Falhada"

*(Abre via ação "Inspecionar Detalhe" na tabela de falhas do gateway, ABA 3
Painel A.)*

- **Título:** `Detalhe da Notificação Falhada`
- **Bloco de Metadados** (fundo `#F8FAFC`, borda `#E2E8F0`, padding 12px,
  radius 8px, duas colunas em grelha 2×4):
  - `Tipo de Notificação:` [valor]
  - `Módulo de Origem:` [valor]
  - `Destinatário:` [Nome]
  - `Email:` [endereço, fonte monoespaçada]
  - `Data da Primeira Tentativa:` [DD MMM AAAA, HH:MM]
  - `Número de Tentativas:` [N]
  - `Código de Erro:` [código HTTP/SMTP em monoespaçada]
  - `Descrição do Erro:` [mensagem completa]
- **Rodapé:** `Cancelar` (Outline) · `Reenviar Manualmente` (Dourado).

---

### Modal 7 — "Corrigir Contacto do Destinatário"

*(Abre via ação "Corrigir Contacto" na tabela de falhas, ABA 3 Painel A.)*

- **Título:** `Corrigir Dados de Contacto do Destinatário`
- **Informação atual** (read-only, fundo `#F8FAFC`, borda `#E2E8F0`):
  `Email atual: [endereço falhado, fonte monoespaçada]`
- **Campo:**
  - Input `Novo Email do Destinatário` *. Placeholder:
    `"novo.email@dominio.com"`.
    Validação: formato de e-mail válido.
    Erro inline: `"Endereço de e-mail inválido."`
- **Aviso** (fundo `#FFFBEB`, texto `#B45309`):
  `"A correção atualiza permanentemente os dados de contacto no perfil do
  utilizador no sistema."`
- **Botões:** `Cancelar` (Outline) · `Guardar e Reenviar` (Dourado).

---

### Modal 8 — "Novo / Editar Local de Treino"

- **Título:**
  - Criação: `Adicionar Local de Treino`
  - Edição: `Editar Local de Treino`
- **Campos:**
  - Input `Nome do Local` *. Placeholder: `"ex: Campo Principal João Cardoso"`.
  - Dropdown `Tipo` *. Placeholder: `"Selecione o tipo..."`. Opções:
    `Campo de Futebol` · `Ginásio` · `Piscina` · `Sala de Reuniões` · `Outro`
  - Input `Capacidade (Nº de pessoas)` *(opcional)*. Placeholder: `"ex: 200"`.
    Tipo numérico, valor mínimo 1.
- **Botões:** `Cancelar` (Outline) · `Guardar Local` (Dourado).