# PORTAL_MODULE.md — Módulo Portal (Perfis: `ROLE_EE` e `ROLE_ATLETA`)
# App Mobile Exclusiva — React Native + Expo (RNF-23)

**Visão Geral:** Único ponto de contacto digital entre as famílias/atletas e
o clube. App B2C pensada para zero fricção: um pai com dois minutos de atenção
disponível na fila do supermercado deve conseguir consultar a convocatória do
filho, submeter um documento e verificar o estado financeiro sem precisar de
formação.

**Sub-roles suportados:**
- `ROLE_EE` — Encarregado de Educação com um ou mais dependentes associados.
  Opera em nome dos atletas que tutela. É o destinatário das obrigações
  financeiras.
- `ROLE_ATLETA` — Atleta maior de idade que é o próprio responsável financeiro
  e submete os seus próprios documentos.

**Paradigma de Design:** Zero fricção, ação imediata, informação densa mas
legível. Cada CTA crítico acessível com um toque, nunca a mais de dois ecrãs
da tela inicial.

**Container da App:**
`max-w-md` · `mx-auto` · `h-screen` · `overflow-hidden` · `bg-[#F8FAFC]`
Renderizado como telemóvel centrado no ecrã.

> **Nota de RBAC:** A única escrita permitida neste portal é a submissão de
> justificações de ausência e de documentos — e apenas para os próprios
> dependentes do EE autenticado (ou para o próprio atleta). Todo o resto é
> leitura, notificação e apresentação do cartão digital. Pagamento remoto é
> **estritamente proibido** (RF-20).

---

## Especificação de Badges de Estado Financeiro (componente reutilizável)

| Estado | Fundo | Texto | Borda | Ícone Lucide | Label |
|---|---|---|---|---|---|
| **PAGO** | `#ECFDF5` | `#047857` | `1px #047857` | `CheckCircle` | `Pago` |
| **PENDENTE** | `#FFFBEB` | `#B45309` | `1px #B45309` | `Clock` | `Pendente` |
| **VENCIDO** | `#FEE2E2` | `#991B1B` | `1px #991B1B` | `AlertCircle` | `Vencido` |
| **VENCIDO CRÍTICO** | `#FEE2E2` | `#991B1B` | `1px #991B1B` | `AlertCircle` | `Vencido` |

> **Vencido Crítico** (quando ≥ 2 mensalidades vencidas há > 30 dias, condição
> de bloqueio do cartão — RF-39): o badge tem adicionalmente uma animação
> `pulse` de 2 segundos e o cartão de obrigação recebe borda `2px #991B1B`.

---

## Especificação de Badges de Estado Documental (componente reutilizável)

| Estado | Fundo | Texto | Ícone Lucide | Label |
|---|---|---|---|---|
| **APROVADO** | `#ECFDF5` | `#047857` | `CheckCircle` | `Aprovado` |
| **PENDENTE DE VALIDAÇÃO** | `#EFF6FF` | `#1D4ED8` | `Clock` | `Em Análise` |
| **REJEITADO** | `#FEE2E2` | `#991B1B` | `XCircle` | `Rejeitado` |
| **EM FALTA** | `#FEE2E2` | `#991B1B` | `AlertCircle` | `Em Falta` |

---

## Especificação de Badges de Elegibilidade (componente reutilizável)

| Estado | Fundo | Texto | Borda | Ícone | Label |
|---|---|---|---|---|---|
| **APTO** | `#ECFDF5` | `#047857` | `1px #047857` | `CheckCircle` | `Apto` |
| **BLOQUEADO** | `#FEE2E2` | `#991B1B` | `1px #991B1B` | `Lock` | `Bloqueado` |
| **VÍNCULO ENCERRADO** | `#F1F5F9` | `#64748B` | `1px #E2E8F0` | `Archive` | `Vínculo Encerrado` |

---

## Anatomia Global da App Shell (Mobile B2C)

### Top App Bar (fixo, 56px de altura)
- Fundo `#FFFFFF`. Borda inferior `1px #E2E8F0`.
- **Esquerda (sub-ecrãs):** Ícone `ChevronLeft` (Lucide, 24px, `#0F172A`).
  Ausente nas tabs raiz.
- **Centro (sub-ecrãs):** Título da página (16px, SemiBold, `#0F172A`).
- **Direita (todas as tabs raiz):** Ícone `Bell` (Lucide, 24px, `#0F172A`)
  com badge de notificações não lidas. Ao tocar → navega para o Centro de
  Notificações.

**Badge de notificações não lidas:**
Círculo sólido 16px, fundo `#991B1B`, texto branco Bold 10px, canto superior
direito do ícone `Bell`. Oculto quando N = 0.

---

### Header Global de Contexto (abaixo da Top App Bar, todas as tabs exceto Cartão)

**Para ROLE_EE (com um dependente):**
Fundo `#FFFFFF`. Borda inferior `1px #E2E8F0`. Padding `10px 16px`.
Layout em linha:
- Avatar circular 36px do atleta (foto ou inicial em fundo `#E2E8F0`).
- Coluna de texto (margem esquerda 10px):
  - Nome do dependente ativo (Bold 14px, `#0F172A`).
  - `"[Escalão / Equipa]"` + Badge de Elegibilidade compacto (10px SemiBold).
    Ex: `"Sub-15 A"` + badge `Apto` Verde.
- Ícone `Bell` com badge (extremo direito, 24px).

**Para ROLE_EE (com múltiplos dependentes):**
Mesma estrutura, mas o nome do dependente tem ícone `ChevronDown` (14px,
Gray 500) à direita, formando uma pill clicável:
[Avatar]  João Silva  ▾               [Bell[N]]
Sub-15 A  ●Apto

Ao tocar na pill do nome → **Bottom Sheet "Selecionar Dependente"**.

**Para ROLE_ATLETA (adulto):**
Mesma estrutura sem ícone `ChevronDown` (apenas um contexto possível):
[Avatar]  Marco Costa                 [Bell[N]]
Sub-19  ●Apto

---

### Bottom Navigation Bar (fixo, 64px de altura)

Fundo `#FFFFFF`. Borda superior `1px #E2E8F0`. Cinco itens.

| Posição | Label | Ícone Lucide | Tamanho Ícone | Destaque |
|---|---|---|---|---|
| 1 | `Início` | `Home` | 24px | Sem destaque |
| 2 | `Agenda` | `CalendarDays` | 24px | Sem destaque |
| 3 | `Cartão` | `CreditCard` | 28px | Círculo dourado (especificação abaixo) |
| 4 | `Docs` | `FileText` | 24px | Sem destaque |
| 5 | `Conta` | `User` | 24px | Sem destaque |

**Item ativo (posições 1, 2, 4, 5):**
Ícone `#F1C40F` + label 10px `#F1C40F` SemiBold.

**Item Cartão (posição 3 — centralizado e destacado):**
- Círculo sólido `#F1C40F` de 48×48px como fundo do ícone.
- Ícone `CreditCard` 28px `#000000` dentro do círculo.
- Label `"Cartão"` abaixo (10px, `#F1C40F` SemiBold quando ativo, `#64748B`
  quando inativo).
- O círculo está ligeiramente elevado acima da Bottom Bar (translateY -8px),
  criando um efeito de "botão principal".

**Touch target mínimo:** 44×44px por item (RNF-15).

---

## Banner de Vínculo Arquivado (RF-27)

*(Visível em toda a app quando o atleta foi arquivado após a data de eficácia)*

Fundo `#F1F5F9`. Borda `1px #E2E8F0`. Corner radius `0` (largura total do
ecrã). Padding `10px 16px`.

Layout em linha:
- Ícone Lucide `Info` (16px, `#64748B`) à esquerda.
- Texto (13px, `#64748B`):
  `"Vínculo desportivo encerrado a [DD/MM/AAAA]. Não é possível submeter
  novos documentos ou justificações."`

**Efeito nas tabs:**
- Tab Agenda: todos os CTAs de submissão ficam ocultados. Cartões mostram
  apenas dados históricos read-only.
- Tab Docs: FAB removido. Botões de submissão substituídos por texto gray
  `"Submissão encerrada"`.
- Tab Cartão: estado `VÍNCULO ENCERRADO` (especificação abaixo).

---

## TAB 1 — INÍCIO (Landing Page)

**Top App Bar:** Não exibe título central (o Header Global de Contexto serve
como identificação). Apenas ícone `Bell` à direita.

**Content Area (scroll vertical, padding 16px):**

---

### Cards de Alerta (ordenados por prioridade — aparecem apenas quando aplicável)

---

#### Card de Alerta: Justificação de Ausência Pendente

*(Visível quando o dependente foi marcado ausente numa sessão dentro da
janela de 24h e a justificação ainda não foi submetida)*

Fundo `#FFFFFF`. Borda esquerda `4px #EA580C` (laranja escuro). Borda
restante `1px #E2E8F0`. Corner radius `12px`. Sombra suave. Padding `16px`.

Layout (topo para baixo):
- **Linha 1:** Badge pill `JUSTIFICAÇÃO PENDENTE` (fundo `#FFF7ED`, texto
  `#EA580C`, ícone Lucide `AlertTriangle` 12px, 10px SemiBold).
- **Linha 2:** `"[Nome do Atleta] faltou ao [Treino/Jogo] de [DD MMM · HH:MM]"`
  (14px, Bold, `#0F172A`).
- **Linha 3 — Contador regressivo:**
  - > 12h restantes: `"Tens [Xh Ym] para justificar"` (12px, `#B45309`).
  - 6h–12h: mesma mensagem (12px, `#EA580C`).
  - < 6h: `"Tens [Xh Ym] para justificar"` (12px, `#991B1B` Bold).
  - < 1h: borda do card inteiro muda para `2px #991B1B` pulsante (animação
    `pulse` 2s).
- **Espaçamento:** 12px.
- **Botão Full-width:** `"Justificar Agora"` (fundo `#EA580C`, texto `#FFFFFF`
  SemiBold 15px, height 48px, corner radius `12px`, ícone Lucide `FileEdit`
  18px à esquerda). Ao tocar → abre diretamente o **Bottom Sheet
  "Justificação de Ausência"** no contexto da sessão correta.

---

#### Card de Alerta: EMD a Caducar ou Caducado

*(Visível conforme proximidade da data de expiração — RF-14)*

**Sub-estado por urgência:**

| Dias restantes | Fundo borda esq. | Cor da borda | Label badge | Texto CTA |
|---|---|---|---|---|
| 16–30 dias | `4px #B45309` | `1px #E2E8F0` | `EMD EXPIRA EM [N] DIAS` (Ambar) | `"Submeter Novo EMD"` |
| 8–15 dias | `4px #EA580C` | `1px #E2E8F0` | `EMD EXPIRA EM [N] DIAS` (Laranja) | `"Submeter Novo EMD"` |
| 4–7 dias | `4px #991B1B` | `1px #991B1B` | `EMD EXPIRA EM [N] DIAS` (Vermelho) | `"Submeter URGENTE"` |
| 1–3 dias | `4px #991B1B` pulsante | `1px #991B1B` | `EMD EXPIRA EM [N] DIAS` (Vermelho) + animação `pulse` | `"Submeter URGENTE"` |
| Expirado | `4px #991B1B` | `1px #991B1B` | `EMD EXPIRADO` (Vermelho) | `"Submeter Novo EMD"` |

Layout (igual para todos os sub-estados):
- **Linha 1:** Badge pill conforme tabela.
- **Linha 2:** `"[Nome do Atleta] · Válido até [DD MMM AAAA]"` (14px, Bold, `#0F172A`).
- **Linha 3:** `"Renova antes que o atleta fique bloqueado"` (12px, Gray 500).
- **Botão Full-width:** cor de fundo: Ambar `#B45309` / Laranja `#EA580C` /
  Vermelho `#991B1B`. Texto `#FFFFFF` SemiBold. Height 48px. Corner radius
  `12px`. Ícone `Upload` 18px à esquerda. Label conforme tabela.
  → Ao tocar: abre **Bottom Sheet "Novo Documento"** com tipo `EMD`
  pré-selecionado.

---

#### Card de Alerta: Documento Rejeitado

*(Visível quando a Secretaria ou o Médico rejeitou um documento submetido)*

Fundo `#FFFFFF`. Borda esquerda `4px #991B1B`. Borda restante `1px #FEE2E2`.
Corner radius `12px`. Padding `16px`.

Layout:
- **Linha 1:** Badge pill `DOCUMENTO REJEITADO` (fundo `#FEE2E2`, texto
  `#991B1B`, ícone `XCircle` 12px, 10px SemiBold).
- **Linha 2:** `"[Tipo de Documento]"` (14px, Bold, `#0F172A`).
- **Linha 3:** Label `"Motivo:"` (12px, Gray 500) + texto do motivo (12px,
  `#991B1B`, itálico). Ex: `"Documento ilegível — fotografia desfocada"`.
- **Botão Full-width:** fundo transparente, borda `1px #991B1B`, texto
  `#991B1B` SemiBold, height 48px, corner radius `12px`, ícone `Upload`
  18px: `"Submeter Novo Documento"`. → Abre Bottom Sheet com tipo pré-selecionado.

---

### Card de Próximo Evento (Treino ou Jogo)

*(Visível sempre — o evento mais próximo do dependente selecionado)*

**Próximo evento é um Treino:**
Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `16px`.

- **Linha 1:** Badge pill `TREINO` (fundo `#ECFDF5`, texto `#047857`, ícone
  Lucide `Dumbbell` 12px) + dia e hora à direita (13px, `#047857` Bold).
  Ex: `"Terça, 27 Mai · 17:00"`.
- **Linha 2:** `"[Instalação] · [Equipa]"` (12px, Gray 500).
- Sem botão de ação (treinos são read-only para EE/Atleta).

**Próximo evento é um Jogo — Atleta CONVOCADO:**
Fundo `#FFFFFF`. Borda esquerda `4px #1D4ED8`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `16px`.

- **Linha 1:** Badge pill `JOGO` (fundo `#EFF6FF`, texto `#1D4ED8`, ícone
  `Trophy` 12px) + dia/hora à direita (13px, `#1D4ED8` Bold).
- **Linha 2:** Adversário (Bold 16px, `#0F172A`). Ex: `FC Rival`.
- **Linha 3:** `"[Quadro] · [Local] · [Casa/Fora]"` (12px, Gray 500).
- **Linha 4:** `"Concentração: [HH:MM] · [Local de Concentração]"` (12px,
  Gray 500).
- **Linha 5:** Badge Verde `"[Nome] está CONVOCADO"` (ícone `CheckCircle`,
  fundo `#ECFDF5`, texto `#047857`).
- **Botão Full-width Outline:** `"Ver Convocatória"` (borda `1px #1D4ED8`,
  texto `#1D4ED8`, height 44px, ícone `Users` 16px). → Navega para o detalhe
  do jogo na Tab Agenda.

**Próximo evento é um Jogo — Atleta NÃO convocado:**
Mesma estrutura mas sem badge de convocado. Linha extra:
`"[Nome] não está convocado para este jogo"` (12px, Gray 500, itálico).
Sem botão de ação.

---

### Card de Estado Positivo (quando não há alertas)

Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `20px`.
Borda esquerda `4px #047857`.

- Ícone Lucide `ShieldCheck` (32px, `#047857`, opacidade 80%).
- **Linha 1:** `"Tudo em ordem!"` (16px, Bold, `#047857`).
- **Linha 2:** `"[Nome do Atleta] · Apto · Documentação válida"` (13px,
  Gray 500).
- **Linha 3:** `"Próximo treino: [Dia], [DD MMM] · [HH:MM] · [Local]"`
  (12px, Gray 500). Se não houver próximo evento: `"Sem eventos agendados
  para breve."`.

---

### Centro de Notificações

*(Abre ao tocar no ícone `Bell` no header. Push Navigation — ecrã full-screen)*

**Top App Bar:**
- Esquerda: `ChevronLeft`.
- Centro: `"Notificações"` (16px, SemiBold).
- Direita: Botão texto `"Marcar todas como lidas"` (12px, `#1D4ED8`) — visível
  apenas quando existem notificações não lidas.

**Lista de Notificações (scroll vertical):**

Separadores de data: `"HOJE"` · `"ONTEM"` · `"ESTA SEMANA"` (11px, UPPERCASE,
Gray 500, padding `12px 0 4px`).

**Cartão de Notificação Não Lida:**
Fundo `#EFF6FF`. Borda `1px #1D4ED8`. Corner radius `12px`. Padding `14px 16px`.
Borda esquerda `4px #1D4ED8`. Gap: 8px.

**Cartão de Notificação Lida:**
Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.
Opacidade `0.8`.

**Conteúdo de cada cartão:**
- Ícone do tipo (24px):
  - Convocatória: `Trophy` `#1D4ED8`.
  - Alerta EMD: `AlertTriangle` `#B45309`.
  - Documento aprovado: `CheckCircle` `#047857`.
  - Documento rejeitado: `XCircle` `#991B1B`.
  - Justificação aceite: `ThumbsUp` `#047857`.
- Texto da notificação (14px, `#0F172A`). Ex: `"João Silva foi convocado para o
  jogo vs FC Rival — Sábado 15:00"`.
- Timestamp (11px, Gray 500). Ex: `"Hoje às 20:34"`.
- Ao tocar no cartão inteiro: navega por deep link para o ecrã relevante
  (ex: notificação de convocatória → detalhe do jogo na Tab Agenda).

**Empty State (sem notificações):**
- Ícone Lucide `BellOff` (64px, opacidade 10%, Gray 200).
- Título: `"Sem notificações"` (16px, Gray 500).
- Sub-título: `"Avisamos-te quando houver novidades."` (13px, Gray 500).

---

## TAB 2 — AGENDA

**Top App Bar:**
- Centro: `"Agenda"`.

**Toggle de Vista (abaixo do Header de Contexto, na Content Area):**
Dois botões pill em linha:
- `"Próximos"` (ativo por defeito): fundo `#0F172A`, texto `#FFFFFF` SemiBold,
  corner radius `20px`, padding `8px 20px`.
- `"Passados"`: fundo transparente, borda `1px #E2E8F0`, texto `#0F172A`,
  corner radius `20px`, padding `8px 20px`.

---

### Lista de Cartões de Eventos (scroll vertical)

Separadores de semana: `"ESTA SEMANA"` · `"PRÓXIMA SEMANA"` · `"EM [MÊS]"`
(11px, UPPERCASE, Gray 500, padding `12px 0 4px`).

---

**Cartão de Treino — Presença Confirmada:**
Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`.

- **Linha 1:** Badge `TREINO` (Verde, ícone `Dumbbell`) + data/hora à direita
  (13px, `#047857` Bold).
- **Linha 2:** `"[Instalação]"` (12px, Gray 500).
- **Linha 3:** Badge `"Presente"` (fundo `#ECFDF5`, texto `#047857`, ícone
  `CheckCircle` 12px).

---

**Cartão de Treino — Ausência Não Justificada (dentro da janela de 24h):**
Fundo `#FFFFFF`. Borda esquerda `4px #EA580C`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`.

- **Linha 1:** Badge `TREINO` (fundo `#FFF7ED`, texto `#EA580C`, ícone
  `Dumbbell`) + data/hora à direita.
- **Linha 2:** `"[Instalação]"` (12px, Gray 500).
- **Linha 3:** Badge `"Ausente — Não justificado"` (fundo `#FEE2E2`, texto
  `#991B1B`, ícone `XCircle` 12px).
- **Linha 4 — Countdown:**
  - > 6h: `"Prazo: [Xh Ym] restantes"` (12px, `#B45309`, ícone `Clock` 12px).
  - 1h–6h: mesma cor `#EA580C`.
  - < 1h: `#991B1B` Bold. Borda do card muda para `2px #991B1B` pulsante.
- **Botão Full-width:** fundo `#EA580C`, texto `#FFFFFF` SemiBold, height 48px,
  corner radius `12px`, ícone `FileEdit` 18px: `"Justificar Falta"`. → Abre
  **Bottom Sheet "Justificação de Ausência"**.

---

**Cartão de Treino — Ausência Justificada (pendente de validação):**
Fundo `#FFFFFF`. Borda esquerda `4px #B45309`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`.

- **Linha 1:** Badge `TREINO` (Ambar) + data/hora.
- **Linha 2:** `"[Instalação]"` (12px, Gray 500).
- **Linha 3:** Badge `"Ausente — Justificado"` (fundo `#FFFBEB`, texto
  `#B45309`, ícone `Clock` 12px).
- **Linha 4:** `"Estado: Aguarda confirmação do treinador"` (11px, Gray 500).

---

**Cartão de Treino — Ausência Justificada e Aceite:**
Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`.

- Badge `"Ausente — Justificado"` (Ambar) + Badge separado `"Aceite"` (Verde,
  ícone `ThumbsUp`).

---

**Cartão de Treino — Prazo de Justificação Expirado:**
Fundo `#F8FAFC`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `14px 16px`.
Opacidade `0.7`.

- Badge `"Ausente — Prazo expirado"` (fundo `#F1F5F9`, texto `#64748B`, ícone
  `Ban` 12px).
- Sem botão de ação.

---

**Cartão de Jogo — Atleta Convocado:**
Fundo `#FFFFFF`. Borda esquerda `4px #1D4ED8`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `16px`.

- **Linha 1:** Badge `JOGO OFICIAL` (fundo `#EFF6FF`, texto `#1D4ED8`, ícone
  `Trophy` 12px) + data/hora à direita (Bold 13px, `#1D4ED8`).
- **Linha 2:** Adversário (Bold 16px, `#0F172A`). Ex: `"vs FC Rival"`.
- **Linha 3:** `"[Quadro] · [Local] · [Casa / Fora / Neutro]"` (12px, Gray 500).
- **Linha 4:** `"Concentração: [HH:MM] · [Local de Concentração]"` (12px,
  Gray 500).
- **Linha 5:** Badge Verde Bold `"[Nome] está CONVOCADO"` (ícone `CheckCircle`,
  14px, fundo `#ECFDF5`, texto `#047857`).
- **Botões em linha (50%/50%):**
  - `"Ver Convocatória"` (Outline, borda `1px #1D4ED8`, texto `#1D4ED8`,
    height 44px, ícone `Users` 16px).
  - `"Partilhar PDF"` (Outline, borda `1px #E2E8F0`, texto `#0F172A`, height
    44px, ícone `Share2` 16px). → Abre Share Sheet nativo do iOS/Android
    com o PDF da convocatória (RF-05).

---

**Cartão de Jogo — Atleta Não Convocado:**
Mesma estrutura sem badge de convocado e sem botões.
- **Linha 5:** `"[Nome] não está convocado para este jogo"` (12px, Gray 500,
  itálico).

---

**Ecrã "Lista de Convocados" (Push Navigation — read-only):**
*(Abre via botão "Ver Convocatória")*

**Top App Bar:**
- Esquerda: `ChevronLeft`.
- Centro: `"Convocatória"` (16px, SemiBold).

**Bloco de Informação do Jogo (read-only):**
Cartão fundo `#EFF6FF`, borda `1px #1D4ED8`, corner radius `12px`, padding `16px`:
- Adversário (Bold 18px, `#0F172A`).
- Data/Hora (14px, `#1D4ED8`).
- Local (12px, Gray 500).
- `"Concentração: [HH:MM] — [Local]"` (12px, Gray 500).

**Lista de Atletas Convocados (scroll):**
Separador: `"[N] CONVOCADOS"` (11px, UPPERCASE, Gray 500).
Cada atleta: linha com Avatar 32px + Nome (14px, `#0F172A`) + Posição (12px,
Gray 500). Lista em ordem alfabética. Read-only absoluto.

---

### Bottom Sheet "Justificação de Ausência"

*(Abre via cartão de ausência não justificada ou via CTA na Tab Início)*

**Anatomia do Bottom Sheet:**
- Ocupa ~60% do ecrã (desliza de baixo para cima).
- Corner radius superior `16px`. Fundo `#FFFFFF`.
- Handle visual (barra cinzenta 32×4px, fundo `#E2E8F0`, corner radius `2px`,
  centrada no topo, margin top `12px`).
- Backdrop `#000000` a 40% de opacidade atrás do painel.
- Arrastar para baixo fecha o Bottom Sheet.

**Conteúdo:**

Bloco de contexto (fundo `#F8FAFC`, borda `1px #E2E8F0`, corner radius `8px`,
padding `12px`, margin bottom `16px`):
- `"[Tipo de Evento] — [DD MMM AAAA · HH:MM]"` (13px Bold, `#0F172A`).
- `"[Atleta] · [Equipa]"` (12px, Gray 500).

Countdown de prazo:
- Fundo `#FFFBEB`, borda `1px #B45309`, corner radius `8px`, padding `8px 12px`.
- Ícone `Clock` (14px, `#B45309`) + texto `"Podes justificar por mais [Xh Ym]"`.
  Se < 1h: fundo `#FEE2E2`, borda `#991B1B`, texto `#991B1B`.

**Campo de texto obrigatório:**
Label: `Motivo da ausência *` (12px, Gray 500).
Textarea fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `8px`, height mínima 5 linhas.
Placeholder: `"Descreve o motivo da falta (mínimo 10 caracteres)"`.
Contador de caracteres (canto inferior direito, 11px, Gray 500): `"[X] / 500"`.
- X < 10: contador em `#991B1B`.
- X ≥ 10: contador em Gray 500.
Erro inline (11px, `#DC2626`): `"O motivo deve ter pelo menos 10 caracteres."`

**Secção de anexo (opcional):**
Label: `Comprovativo (opcional)` (12px, Gray 500).
Dois botões em linha (50%/50%):
- `"Fotografar"` (fundo `#F1C40F`, texto `#000000` SemiBold, height 48px,
  ícone Lucide `Camera` 18px, corner radius `8px`). → Abre câmara nativa.
- `"Escolher Ficheiro"` (Outline, borda `1px #E2E8F0`, texto `#0F172A`,
  height 48px, ícone `FolderOpen` 18px, corner radius `8px`).

**Após seleção de ficheiro:**
Preview compacto (fundo `#F8FAFC`, borda `1px #E2E8F0`, corner radius `8px`,
padding `10px`):
- Ícone `Paperclip` (14px, Gray 500) + nome do ficheiro (12px, `#0F172A`,
  truncado a 28 chars) + ícone `X` (14px, Gray 500) à direita para remover.

Validações client-side (sem requests ao servidor se inválido):
- Formato inválido → erro inline (11px, `#DC2626`): `"Formato inválido.
  Apenas PDF e PNG são aceites."`
- Tamanho > 5MB → erro inline: `"O ficheiro excede 5 MB."`

**Rodapé fixo do Bottom Sheet:**
Botão Full-width Dourado: `"Submeter Justificação"` (fundo `#F1C40F`, texto
`#000000` SemiBold, height 52px, corner radius `12px`, ícone `Send` 18px).
- **Desativado** (fundo `#F1F5F9`, texto Gray 200) quando textarea < 10 chars.
- **Ativo** quando textarea ≥ 10 chars.

**Toast pós-submissão** (desliza de cima, 4 segundos):
Fundo `#ECFDF5`, borda `1px #047857`, corner radius `8px`, padding `12px 16px`,
ícone `CheckCircle` Verde + `"Justificação submetida com sucesso."` (14px,
`#047857`).

**Estado: Justificação já submetida:**
Se já existe justificação para esta ausência, o Bottom Sheet não abre com
formulário. Em vez disso: cartão read-only com texto da justificação + estado
atual (`"Pendente"` Ambar ou `"Aceite"` Verde ou `"Recusada"` Vermelho) +
botão `"Fechar"` Outline.

---

## TAB 3 — CARTÃO

**Propósito:** Cartão digital de identificação. Ecrã full-screen imersivo.

**Top App Bar:** Ausente neste ecrã. O ecrã ocupa o ecrã completo incluindo
a área da status bar do sistema operativo.

**Nota de acessibilidade:** Este ecrã deve funcionar com brilho máximo do
ecrã. Fundo branco, texto preto, QR em alto contraste.

---

### Estado ATIVO

**Layout full-screen, fundo `#FFFFFF`:**

**Secção Superior (padding `24px 20px`):**
- Logótipo do clube centrado (imagem estática, height 40px).
- `"Boavista Futebol Clube"` (13px, Gray 500, centrado) abaixo do logótipo.

**Secção de Identificação (centrada):**
- Avatar circular (96px), foto do atleta. Sombra média.
- Nome completo (Bold 22px, `#0F172A`, centrado).
- `"[Escalão / Equipa]"` (14px, Gray 500, centrado).
- `"N.º de Sócio: [XXXX]"` (13px, Gray 500, centrado).

**Separador** `1px #E2E8F0` com margem horizontal `20px`.

**Secção do QR Code (centrada):**
- Área branca com borda `2px #0F172A`, corner radius `16px`, padding `16px`,
  width `200px` × height `200px`.
- Dentro: QR Code gerado dinamicamente (módulos pretos em fundo branco, alto
  contraste absoluto, sem logótipo sobreposto para garantir leitura em luz
  forte).
- Validade: 60 segundos (RNF-08). Regenerado automaticamente sem interação.

**Countdown do QR (abaixo da área do QR):**
Barra de progresso circular (24px de diâmetro, espessura 3px):
- Arco preenchido: `#F1C40F`.
- Arco vazio: `#E2E8F0`.
- Texto no centro: `"[N]s"` (10px, Gray 500).
- Quando chega a 0: QR é regenerado com animação `fadeIn` de 300ms. O contador
  recomeça de 60.

**Badge de Estado (abaixo do countdown):**
Badge Grande pill `"ATIVO"` (fundo `#ECFDF5`, texto `#047857` Bold 14px,
ícone `Wifi` 16px, padding `8px 20px`, corner radius `20px`).

**Rodapé do Cartão (abaixo de tudo, padding `0 20px 24px`):**
`"QR renovado automaticamente · Válido por 60 segundos"` (11px, Gray 500,
centrado).

---

### Estado BLOQUEADO

**Layout full-screen, fundo `#FFFFFF`:**

Secção Superior e de Identificação: idênticas ao estado ATIVO.

**Separador** `1px #E2E8F0`.

**Secção de Bloqueio (centrada):**
- Área fundo `#F8FAFC`, borda `2px #E2E8F0` tracejada, corner radius `16px`,
  padding `24px`, width `200px` × height `200px`. Centrada.
- Dentro:
  - Ícone Lucide `Lock` (48px, `#991B1B`).
  - `"ACESSO"` (16px, Bold, `#991B1B`, centrado).
  - `"BLOQUEADO"` (16px, Bold, `#991B1B`, centrado).

**Secção de Causas:**
Label: `"Por resolver:"` (12px, UPPERCASE, Gray 500, padding `16px 0 8px`).
Lista de causas (cada item em linha):
- Ícone `Circle` sólido 8px `#991B1B` + texto (13px, `#0F172A`). Ex:
  - `"2 mensalidades vencidas há mais de 30 dias"`
  - `"EMD caducado"`

**Botões de Ação (por causa):**
- Se causa financeira: Botão Full-width Outline (borda `1px #991B1B`, texto
  `#991B1B`, height 44px, ícone `CreditCard`): `"Ver Situação Financeira"`.
  → Navega para Tab Conta.
- Se causa documental: Botão Full-width Outline (borda `1px #991B1B`, texto
  `#991B1B`, height 44px, ícone `Upload`): `"Submeter Documento"`. → Abre
  Bottom Sheet de upload na Tab Docs.

---

### Estado VÍNCULO ENCERRADO (RF-27)

**Layout idêntico mas sem QR e sem botões de ação:**
- Área cinzenta estriada (padrão hatch `#E2E8F0` em fundo `#F8FAFC`) no lugar
  do QR.
- Ícone `Archive` (48px, `#64748B`).
- `"VÍNCULO"` + `"ENCERRADO"` (Bold, `#64748B`, centrado).
- `"Válido até: [DD/MM/AAAA]"` (12px, Gray 500, centrado).
- Badge `"Vínculo Encerrado"` (Neutro, fundo `#F1F5F9`, texto `#64748B`).

---

## TAB 4 — DOCS (DOCUMENTOS)

**Top App Bar:**
- Centro: `"Documentos de [Nome do Atleta]"` (16px, SemiBold).

**FAB `"+ Submeter Documento"` (fixo, canto inferior direito):**
Botão circular 56×56px, fundo `#F1C40F`, ícone Lucide `Plus` (`#000000`,
24px). Posição: `fixed`, `bottom: 80px`, `right: 16px`. Sombra forte.
Ao tocar → **Bottom Sheet "Novo Documento"**.

---

### Secção "Ações Pendentes" (visível apenas quando existem documentos em falta)

Label: `"AÇÕES PENDENTES"` (11px, UPPERCASE, `#991B1B`, padding `16px 0 8px`).
Cartões de alerta de documento em falta ou rejeitado (especificação idêntica
aos cards da Tab Início).

---

### Secção "Documentos Enviados"

Label: `"DOCUMENTOS ENVIADOS"` (11px, UPPERCASE, Gray 500, padding `16px 0 8px`).

**Cartão de Documento — Em Análise:**
Fundo `#FFFFFF`. Borda esquerda `4px #1D4ED8`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `16px`. Gap entre cartões: `8px`.

- **Linha 1:** Ícone `FileText` (20px, `#1D4ED8`) + Nome do tipo (Bold 14px,
  `#0F172A`). Ex: `"Exame Médico-Desportivo"`.
- **Linha 2:** `"Submetido a [DD MMM AAAA]"` (12px, Gray 500).
- **Tracker Visual (abaixo):**
  Linha horizontal com 3 nós e 2 conectores:
[Nó ativo ●]──── [Nó ativo ●] ──── [Nó vazio ○]
Recebido         Em Análise         Aprovado
  - Nó ativo: círculo sólido 12px `#1D4ED8` + label abaixo (11px, `#1D4ED8`).
  - Nó vazio: círculo com borda `1px #E2E8F0` 12px + label abaixo (11px,
    Gray 200).
  - Conector ativo: linha `2px #1D4ED8`.
  - Conector inativo: linha `2px #E2E8F0`.
- **Linha de estado:** `"Em análise pelo [Secretaria / Departamento Médico]"`
  (11px, `#1D4ED8`, itálico).

---

**Cartão de Documento — Aprovado:**
Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `16px`.

- **Linha 1:** Ícone `FileText` (20px, `#047857`) + Nome do tipo (Bold 14px).
- **Linha 2:** `"Submetido a [DD MMM AAAA]"` (12px, Gray 500).
- **Tracker Visual:**
[●]──── [●] ──── [● Aprovado ✓]
Recebido  Analisado  Aprovado
  Todos os nós e conectores em `#047857`.
- **Linha de validade:** `"Válido até: [DD MMM AAAA]"` (12px, `#047857` Bold).

---

**Cartão de Documento — Rejeitado:**
Fundo `#FFFFFF`. Borda esquerda `4px #991B1B`. Borda `1px #FEE2E2`.
Corner radius `12px`. Padding `16px`.

- **Linha 1:** Ícone `FileText` (20px, `#991B1B`) + Nome do tipo (Bold 14px).
- **Linha 2:** `"Submetido a [DD MMM AAAA]"` (12px, Gray 500).
- **Tracker Visual:**
[●]──── [●] ──── [✗ Rejeitado]
Recebido  Analisado  Rejeitado
  Último nó e conector em `#991B1B`.
- **Bloco de motivo** (fundo `#FEE2E2`, borda `1px #991B1B`, corner radius
  `8px`, padding `10px`):
  - Label `"Motivo:"` (11px, UPPERCASE, `#991B1B`).
  - Texto do motivo (13px, `#991B1B`, itálico).
- **Botão Full-width:** fundo transparente, borda `1px #991B1B`, texto
  `#991B1B` SemiBold, height 44px, corner radius `12px`, ícone `Upload` 16px:
  `"Submeter Novo Documento"`. → Abre Bottom Sheet com tipo pré-selecionado.

---

**Empty State (sem documentos):**
- Ícone Lucide `FolderOpen` (64px, opacidade 10%, Gray 200).
- Título: `"Ainda não enviaste documentos"` (16px, Gray 500).
- Sub-título: `"Submete o EMD e os documentos de identificação para
  ativar o cartão do atleta."` (13px, Gray 500).
- O FAB permanece visível para iniciar a submissão.

---

### Bottom Sheet "Novo Documento"

*(Abre via FAB `+` ou via botão `"Submeter Novo Documento"` num cartão rejeitado)*

**Anatomia:** 65% do ecrã, corners superiores `16px`, fundo `#FFFFFF`, handle
visual (barra cinzenta 32×4px, centrada).

**Conteúdo:**

Título: `"Submeter Documento"` (18px, SemiBold, `#0F172A`). Padding `20px 16px 12px`.

**Dropdown "Tipo de Documento"** *(obrigatório)*:
Label: `Tipo de Documento *` (12px, Gray 500).
Selector com fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `8px`,
height 48px, ícone `ChevronDown` 16px Gray 500 à direita.
Placeholder: `"Seleciona o tipo..."`.
Opções:
- `"Exame Médico-Desportivo (EMD)"`.
- `"Bilhete de Identidade / Cartão Cidadão"`.
- `"Outro Documento Civil"`.

*(Se aberto via "Submeter Novo Documento" de um cartão rejeitado: tipo
pré-selecionado e campo read-only — UC-14.3 fluxo alternativo "Substituição
de documento rejeitado".)*

**Dois botões de upload (50%/50%):**
- **Botão `"Fotografar"`** (fundo `#F1C40F`, texto `#000000` SemiBold, height 56px,
  corner radius `8px`, ícone `Camera` 20px centrado acima, label abaixo).
  → Abre câmara nativa do dispositivo. **CTA Primário — hierarquia B2C.**
- **Botão `"Escolher Ficheiro"`** (Outline, borda `1px #E2E8F0`, texto `#0F172A`,
  height 56px, corner radius `8px`, ícone `FolderOpen` 20px centrado acima,
  label abaixo).
  → Abre file picker nativo.

Nota informativa (12px, Gray 500, centrada): `"Formatos aceites: PDF ou PNG  ·  Máx. 5 MB"`

**Após seleção de ficheiro válido:**
Preview compacto (fundo `#F8FAFC`, borda `1px #E2E8F0`, corner radius `8px`,
padding `12px 14px`, margin top `12px`):
- Ícone `FileText` (20px, Gray 500) à esquerda.
- Nome do ficheiro (13px, `#0F172A`, flex 1, truncado com `...`).
- Tamanho do ficheiro (11px, Gray 500). Ex: `"2,4 MB"`.
- Ícone `X` (16px, Gray 500) à direita para remover.

Se thumbnail disponível (PNG): miniatura 40×40px com corner radius `4px` à
esquerda em vez do ícone.

**Erros client-side** (antes de qualquer request):
- Formato inválido: `"Formato não suportado. Usa PDF ou PNG."` (11px, `#DC2626`).
- Tamanho excedido: `"Ficheiro demasiado grande. Máximo: 5 MB."` (11px, `#DC2626`).

**Botão Full-width "Submeter Documento":**
- **Desativado** (fundo `#F1F5F9`, texto Gray 200): enquanto tipo não
  selecionado ou ficheiro não carregado/válido.
- **Ativo** (fundo `#F1C40F`, texto `#000000` SemiBold, height 52px,
  corner radius `12px`, ícone `Send` 18px): quando ambas as condições
  satisfeitas.

**Toast pós-submissão:**
Fundo `#EFF6FF`, borda `1px #1D4ED8`, ícone `Clock` Azul, 4 segundos:
`"Documento enviado — a aguardar validação."` (14px, `#1D4ED8`).

---

## TAB 5 — CONTA

**Top App Bar:**
- Centro: `"Conta"`.

---

### Secção "Situação Financeira" (READ-ONLY — RF-20)

> **Nota legal:** Esta secção é estritamente read-only. **Não existe qualquer
> botão de pagamento, referência MB transacional, nem trigger de liquidação.**
> (RF-20 — bloqueio sistémico absoluto de liquidação remota.)

---

**KPI Cards de Resumo (grelha 2 colunas, gap `12px`):**

Cartão `"Em Dívida"`:
Fundo `#FEE2E2` (se > 0€) / `#ECFDF5` (se 0€). Borda `1px` na cor semântica.
Corner radius `12px`. Padding `16px`.
- Label `"EM DÍVIDA"` (10px, UPPERCASE, Gray 500).
- Valor (Bold 24px, `#991B1B` se > 0€, `#047857` se 0€). Ex: `"87,50 €"`.
  Formatação: separador de milhares `.` · decimal `,` · `€` com espaço.

Cartão `"Pago Este Mês"`:
Fundo `#ECFDF5`. Borda `1px #047857`. Corner radius `12px`. Padding `16px`.
- Label `"PAGO ESTE MÊS"` (10px, UPPERCASE, Gray 500).
- Valor (Bold 24px, `#047857`). Ex: `"25,00 €"`.

---

**Cartão "Dados para Pagamento Externo":**

*(Não constitui funcionalidade de pagamento — apenas informação de referência)*

Fundo `#FFFFFF`. Borda `1px #E2E8F0`. Corner radius `12px`. Padding `16px`.

- Label `"DADOS PARA PAGAMENTO"` (11px, UPPERCASE, Gray 500, margin bottom `12px`).

Linha IBAN:
- `"IBAN"` (12px, Gray 500) + código IBAN (13px, `#0F172A`, fonte monoespaçada).
- Botão `"Copiar"` (Outline compacto, borda `1px #E2E8F0`, texto `#0F172A`,
  corner radius `8px`, padding `6px 12px`, ícone `Copy` 14px). Ao tocar:
  feedback háptico (vibração curta) + ícone muda temporariamente para
  `CheckCircle` Verde por 2 segundos + toast micro: `"IBAN copiado"`.

Linha Referência de Sócio:
- `"Ref. Sócio"` (12px, Gray 500) + `"[XXXX]"` (13px, `#0F172A`, Bold).
- Botão `"Copiar"` (idêntico ao IBAN).

Separador `1px #E2E8F0`.

Nota de rodapé (11px, Gray 500, itálico):
`"O pagamento deve ser efectuado por transferência bancária ou ao balcão da
secretaria. O clube não aceita pagamentos remotos por esta app."`

---

**Secção "Obrigações Financeiras":**

Label: `"OBRIGAÇÕES"` (11px, UPPERCASE, Gray 500, padding `16px 0 8px`).

Sub-tabs de filtro (pills horizontais):
`"Todas"` · `"Pendentes"` · `"Pagas"`
- Ativa: fundo `#0F172A`, texto `#FFFFFF` SemiBold, corner radius `16px`.
- Inativa: borda `1px #E2E8F0`, texto `#0F172A`.

**Cartão de Obrigação — Vencida:**
Fundo `#FFFFFF`. Borda esquerda `4px #991B1B`. Borda `1px #FEE2E2`.
Corner radius `12px`. Padding `14px 16px`.

- **Linha 1:** `"[Nome da mensalidade/quota]"` (14px, Bold, `#0F172A`).
  Ex: `"Mensalidade Março 2026"`.
- **Linha 2:** `"[Entidade] · [Valor]"` (12px, Gray 500).
  Ex: `"SAD/Formação · 25,00 €"`.
- **Linha 3:** `"Vencido há [N] dias"` (12px, `#991B1B`).
- **Badge:** `VENCIDO` (Vermelho, ícone `AlertCircle`). Se ≥ 2 mensalidades
  vencidas > 30 dias: badge adicional `"Cartão bloqueado"` (ícone `Lock`,
  fundo `#FEE2E2` texto `#991B1B` Bold — para comunicar a consequência).

**Cartão de Obrigação — Pendente:**
Fundo `#FFFFFF`. Borda esquerda `4px #B45309`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`.

- **Linha 1:** Nome (Bold 14px).
- **Linha 2:** Entidade + Valor (12px, Gray 500).
- **Linha 3:** `"Vence a [DD MMM AAAA]"` (12px, `#B45309`).
- **Badge:** `PENDENTE` (Ambar, ícone `Clock`).

**Cartão de Obrigação — Paga:**
Fundo `#FFFFFF`. Borda esquerda `4px #047857`. Borda `1px #E2E8F0`.
Corner radius `12px`. Padding `14px 16px`. Opacidade `0.85`.

- **Linha 1:** Nome (Bold 14px).
- **Linha 2:** Entidade + Valor (12px, Gray 500).
- **Linha 3:** `"Pago a [DD MMM AAAA]"` (12px, `#047857`).
- **Linha 4 (layout em linha):** Badge `PAGO` (Verde, ícone `CheckCircle`) +
  Botão Outline compacto `"Ver Fatura"` (borda `1px #1D4ED8`, texto `#1D4ED8`,
  corner radius `8px`, padding `4px 10px`, ícone `FileDown` 14px) à direita.
  → Abre o PDF da fatura gerada pela Secretaria (download ou Share Sheet nativo).

**Empty State (sem obrigações no filtro selecionado):**
- Ícone Lucide `CheckCircle` (48px, `#047857`, opacidade 40%).
- `"Sem [pendentes / pagas] neste período"` (14px, Gray 500).

---

### Secção "Perfil"

Label: `"PERFIL"` (11px, UPPERCASE, Gray 500, padding `24px 0 8px`).

Cartão fundo `#FFFFFF`, borda `1px #E2E8F0`, corner radius `12px`,
padding `16px`:

- Avatar circular 56px (centrado).
- Nome completo (Bold 18px, `#0F172A`, centrado).
- Email (13px, Gray 500, centrado).
- Telemóvel (13px, Gray 500, centrado).

Linha de estado associativo:
- `"Estatuto:"` (12px, Gray 500) + badge `"Sócio"` (Verde) ou `"Não Sócio"`
  (Neutro Gray).

Nota informativa (11px, Gray 500, itálico, centrado):
`"Para alterar os teus dados, contacta a secretaria do clube."`

Separador `1px #E2E8F0`.

**Secção "Atletas Associados"** (apenas para ROLE_EE):
Label: `"ATLETAS ASSOCIADOS"` (11px, UPPERCASE, Gray 500).
Lista vertical de dependentes:
- Cada linha: Avatar 36px + Nome (Bold 14px) + Escalão (12px, Gray 500) +
  Badge de elegibilidade compacto.

---

**Botão "Terminar Sessão" (fundo da Content Area, com margem superior `24px`):**
Fundo `#FEE2E2`. Texto `#991B1B` SemiBold. Borda `1px #991B1B`.
Ícone Lucide `LogOut` (18px, `#991B1B`) à esquerda.
Width `100%`. Height `52px`. Corner radius `12px`.

**Bottom Sheet de Confirmação de Logout:**
Handle + título `"Terminar Sessão?"` (16px, SemiBold).
`"Terás de fazer login novamente para aceder à app."` (14px, Gray 500).
Dois botões em linha (50%/50%):
- `"Cancelar"` (Outline, height 48px).
- `"Terminar Sessão"` (fundo `#FEE2E2`, texto `#991B1B` SemiBold, height 48px).

---

## Bottom Sheet "Selecionar Dependente" (ROLE_EE com múltiplos filhos)

*(Abre ao tocar na pill `"[Nome] ▾"` no Header Global de Contexto)*

**Anatomia:** 50% do ecrã + scroll se muitos dependentes. Corners superiores
`16px`. Handle visual.

Título: `"Selecionar Atleta"` (16px, SemiBold, padding `16px`).

**Lista de Dependentes:**
Um cartão por dependente (separados por `1px #E2E8F0`):
- Avatar circular 48px.
- **Coluna de texto:**
  - Nome (Bold 15px, `#0F172A`).
  - `"[Escalão / Equipa]"` (12px, Gray 500).
  - Badge de elegibilidade compacto.
- **Ícone de seleção** (extremo direito):
  - Dependente ativo: ícone `CheckCircle` (20px, `#F1C40F` sólido).
  - Dependente inativo: círculo vazio (20px, borda `1px #E2E8F0`).

Ao tocar num dependente:
- O Bottom Sheet fecha.
- Toda a app atualiza para o contexto do dependente selecionado.
- A pill do Header Global atualiza para o novo nome.
- A seleção persiste para sessões futuras.