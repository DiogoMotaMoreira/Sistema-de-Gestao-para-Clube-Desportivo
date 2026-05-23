# DESIGN.md — Sistema de Design & Biblioteca de Componentes (SIGD)

**Versão:** 2.2 | **Última Atualização:** 23-05-2026 | **Status:** Aprovado para Implementação

Este documento constitui a **"Constituição do Design System"** do Sistema Integrado de Gestão Desportiva (SIGD) do Boavista FC. Define, com rigor máximo, todos os tokens de design, componentes UI e padrões comportamentais. 
**Nota para a IA/Figma:** Este documento é totalmente agnóstico de frameworks web. Define os blocos de construção universais. As interfaces específicas de cada módulo (Secretaria, Médicos, etc.) serão definidas nos seus respetivos ficheiros Markdown de requisitos. Nunca desenhes ecrãs específicos apenas com base neste ficheiro.

---

## 1. Fundamentos do Sistema de Design

### 1.1. Paleta de Cores (Design Tokens)

| Nome | Hex | Propósito |
|------|-----|----------|
| **Preto (Primária Escura)** | #000000 | Texto principal, iconografia, bordas estruturais |
| **Branco (Primária Clara)** | #FFFFFF | Fundos de cartões, inputs, modais |
| **Dourado Boavista (CTA)** | #F1C40F | Botões primários, ações de destaque |
| **Gray 50 (Fundo App)** | #F8FAFC | Fundo da área de conteúdo (Off-white) |
| **Gray 100 (Hover)** | #F1F5F9 | Linhas de tabela ao passar (hover) |
| **Gray 200 (Bordas)** | #E2E8F0 | Bordas de cartões, inputs e divisoras suaves |
| **Gray 500 (Texto Secundário)** | #64748B | Textos secundários, labels, cabeçalhos de tabelas |
| **Preto Boavista (Sidebar)**| #000000 | Fundo da Sidebar, Elementos de alto contraste |

**Cores Semânticas (Soft Badges / Pills)**
* **Sucesso (Verde):** Fundo `#ECFDF5` | Texto/Ícone `#047857`
* **Aviso (Amarelo):** Fundo `#FFFBEB` | Texto/Ícone `#B45309`
* **Erro/Destrutivo (Vermelho):** Fundo `#FEE2E2` | Texto/Ícone `#991B1B`
* **Info (Azul):** Fundo `#EFF6FF` | Texto/Ícone `#1D4ED8`

---

### 1.2. Tipografia e Escalas

* **Font Family:** Inter (primária) ou Roboto (sans-serif universal).
* **Títulos (H1, H2):** SemiBold (600) ou Bold (700). Cor: Gray 900 (`#0F172A`).
* **Texto Base (Body):** 14px ou 16px Regular (400). Cor: Gray 900 (`#0F172A`).
* **Texto Secundário (Hint/Placeholder):** 12px ou 14px Regular. Cor: Gray 500 (`#64748B`).
* **Cabeçalhos de Tabela:** 12px Medium (500), UPPERCASE. Cor: Gray 500 (`#64748B`).

---

### 1.3. Espaçamento, Cantos e Sombras

* **Sistema de Grid/Gap:** Múltiplos de 4px (ex: 8px, 12px, 16px, 24px).
* **Corner Radius (Arredondamento):**
  * Inputs, Botões pequenos e Dropdowns: `8px`
  * Cartões, Modais, Soft Badges: `12px` ou `16px`
  * Avatares: `100%` (Circular)
* **Drop Shadows (Sombras para profundidade):**
  * **Sombra Suave (Cartões/Inputs):** Y=1, Blur=2, Opacity=5% (`#000000`)
  * **Sombra Média (Dropdowns):** Y=4, Blur=6, Opacity=5% (`#000000`)
  * **Sombra Forte (Modais):** Y=10, Blur=15, Opacity=10% (`#000000`)

---

## 2. Anatomia Global da Aplicação (App Shell)

A estrutura base da aplicação adapta-se estritamente ao dispositivo do utilizador (Contexto Desktop vs. Contexto Mobile).

### 2.1. App Shell em Desktop (Backoffice: Direção, Secretaria, Médico)
1. **Sidebar (Navegação Lateral):** 
   * Fixa à esquerda. Largura ~280px.
   * Background estritamente escuro: `#000000` (Preto Puro).
   * Item ativo: Fundo suave com barra vertical dourada à esquerda.
2. **Page Header (Cabeçalho Superior):**
   * Background: `#FFFFFF`. Altura: ~64px. Borda inferior fina: `1px #E2E8F0`.
   * **Conteúdo:** EXCLUSIVAMENTE Breadcrumbs ou Título do Módulo à esquerda.
   * **PROIBIDO:** Colocar botões de ação de negócio neste cabeçalho.
3. **Content Area (Área de Conteúdo):**
   * Background: `#F8FAFC` (Gray 50).
   * Padding generoso (24px ou 32px). Todas as ações e barras de pesquisa vivem aqui dentro.

### 2.2. App Shell em Mobile (Terreno: Treinador, Atleta, EE)
1. **Top App Bar (Cabeçalho Mobile):**
   * Fundo `#FFFFFF` com borda inferior `1px #E2E8F0`.
   * Elementos: Título da página ao centro. Opcional: Ícone de voltar (`<`) à esquerda, Ícone de ação (ex: Filtros) à direita.
2. **Content Area (Área de Scroll):**
   * Background: `#F8FAFC`. Padding reduzido (`16px`).
   * A área faz scroll nativo sem esconder o Bottom Navigation.
3. **Bottom Navigation Bar (Rodapé Fixo de Navegação):**
   * Substitui a Sidebar do Desktop. Fixa no fundo do ecrã. Fundo `#FFFFFF` com borda superior `1px #E2E8F0`.
   * Máximo de 4 a 5 ícones (ex: Início, Plantel, Assiduidade, Perfil). Item ativo ganha a cor `#F1C40F`.

---

## 3. Biblioteca de Componentes Core

### 3.1. Botões
* **Primário:** Fundo `#F1C40F` | Texto `#000000` SemiBold. Sem borda.
* **Secundário (Outline):** Fundo Transparente | Borda 1px `#E2E8F0` | Texto `#0F172A`. Hover: Fundo `#F8FAFC`.
* **Destrutivo:** Fundo `#FEE2E2` | Texto `#991B1B` SemiBold.
* *Nota:* Nunca usar ícones genéricos (emojis). Usar ícones vetoriais da biblioteca Lucide React (ex: `<Search>`, `<Plus>`, `<Trash>`).

### 3.2. Inputs e Formulários
* Background: `#FFFFFF`.
* Borda: 1px `#E2E8F0`. Corner Radius: `8px`.
* Em estado de `Focus`: Borda muda para Dourado `#F1C40F` (Outline).
* Em estado de `Erro`: Borda muda para Vermelho `#DC2626`.

### 3.3. Soft Badges / Semáforos (Proibido Emojis)
O SIGD usa indicadores visuais de estado (Apto, Inapto, Dívida, etc.). É **proibido o uso de emojis nativos** (🟢, 🔴).
* Utilizar "Pills" com as Cores Semânticas definidas na secção 1.1.
* Estrutura: Ícone vetorial pequeno à esquerda + Texto descritivo à direita.
* Exemplo Sucesso: Fundo `#ECFDF5`, Ícone Lucide Check, Texto "Quotas em dia" (Tudo em verde).

### 3.4. Cartões (Cards)
* Background: `#FFFFFF`.
* Borda: 1px `#E2E8F0`.
* Corner Radius: `12px` ou `16px`.
* Drop Shadow: Sombra Suave (Y=1, Blur=2).

### 3.5. Tabelas SaaS
* **Proibido o uso de linhas verticais.**
* Linhas horizontais separadoras muito finas (1px `#E2E8F0`).
* Cabeçalho de Tabela com background invisível ou `#F8FAFC`, texto `UPPERCASE` e tamanho 12px.
* Linhas (Rows) devem ter efeito de hover visual (ex: background `#F8FAFC`).

### 3.6. Modais e Overlays
* **Backdrop:** Fundo escuro com 40% a 50% de opacidade e opcionalmente `backdrop-blur` suave.
* **Janela do Modal:** Fundo `#FFFFFF`, Corner Radius `12px`, Drop Shadow Forte.
* **Rodapé do Modal:** Botões de ação sempre alinhados à direita (Cancelar [Secundário] -> Confirmar [Primário]).

---

## 4. Padrões Comportamentais (UX)

* **Debounce de Pesquisa:** Inputs de pesquisa global apenas disparam após 3 caracteres inseridos e paragem na digitação.
* **Read-Only Dinâmico:** Se um registo for expirado/bloqueado no tempo (ex: Avaliação de Jogo após 24h), os inputs transformam-se em texto estático (sem bordas), acompanhados por um banner (Warning/Yellow) a explicar o motivo do bloqueio. Não esconder os dados.
* **Empty States (Estados Vazios):** Nunca apresentar ecrãs ou tabelas em branco. Usar sempre um "Empty State": Um ícone vetorial gigante centrado (opacidade 10%), um Título claro, um subtítulo e um botão Primário para criar a primeira entidade.

---

## 5. Estratégia de Responsividade e Adaptação UX

* **Regra de Ouro UI:** O sistema usa Tailwind (Mobile-First). O layout e a densidade de dados devem priorizar a clareza em ecrãs pequenos antes de expandir para ecrãs grandes.

### 5.1. Padrões Específicos para Mobile (< 768px)
* **Morte ao Scroll Horizontal:** É estritamente proibido usar tabelas clássicas em Mobile. Cada linha (Row) de uma tabela transforma-se num Cartão (Card) vertical empilhado, com labels e valores em formato de lista (ex: `Label: Valor`).
* **Ergonomia de Toque (Touch Targets):** 
  * Botões de ação primária (Submeter/Gravar) passam a ocupar 100% da largura (Full-width).
  * Sempre que possível, botões primários devem ser afixados no fundo do ecrã (`fixed bottom`) logo acima da Bottom Navigation, para estarem ao alcance do polegar.
* **Modais em Mobile:** Os Modais centrais do Desktop transformam-se em "Bottom Sheets" (painéis que deslizam de baixo para cima, ocupando a metade inferior do ecrã e com os cantos superiores arredondados a `16px`).

### 5.2. Padrões Específicos para Desktop (≥ 1024px)
* Tabelas de alta densidade expandem em full-width.
* Modais abrem de forma clássica (centrados no ecrã com backdrop escuro).
* Fluxos pesados (ex: Agendamento de Calendário) usam "Slide-overs" laterais à direita (~400px de largura) em vez de Modais no centro do ecrã.