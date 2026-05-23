# AGENTS.md — SIGD (Sistema Integrado de Gestão Desportiva)

## Identidade do Projeto
- **Nome:** SIGD — ERP desportivo para o Boavista Futebol Clube
- **Equipa:** OmniSystema (4 devs — projeto académico LI4, Universidade do Minho, 2025/2026)
- **Objetivo:** Single Source of Truth (Master Data) para apoiar a recuperação financeira e administrativa do clube (PER)
- **Pilares:** Tesouraria · Relvado · Clínica · Portal B2C

## Stack Tecnológico
- **Frontend:** React Native + Expo SDK 52+ (TypeScript strict)
  - Expo Web → backoffice desktop (CEO, CFO, Secretaria, Médico, DT, Admin)
  - Expo Mobile → apps de campo e família (Treinador, Portal EE/Atleta)
- **Backend:** Java 21 + Spring Boot 3.x (REST API JSON)
- **Base de Dados:** MySQL 8.x com JPA/Hibernate (Spring Data)
- **Auth:** JWT stateless (access + refresh token) via Spring Security
- **Ícones:** lucide-react-native (NUNCA usar emojis como indicadores visuais)

## Arquitetura
- Monólito modular Spring Boot: packages por domínio
  - `com.sigd.auth` | `com.sigd.core` | `com.sigd.clinica` | `com.sigd.relvado`
  - `com.sigd.desporto` | `com.sigd.tesouraria` | `com.sigd.portal`
  - `com.sigd.audit` | `com.sigd.notification` | `com.sigd.config`
- REST API versionada: `/api/v1/{dominio}/...`
- Frontend consome API via Axios com interceptor JWT automático
- Segregação financeira SAD/Clube via coluna discriminadora `entidade_juridica` + filtro forçado na camada Service
- Audit trail: tabela append-only com JPA @EntityListener
- Cron jobs Spring @Scheduled: alertas EMD (30 dias), fecho fichas jogo (24h)

## Roles RBAC (8 perfis)
| Role | Tipo | Plataforma | Módulos |
|------|------|-----------|---------|
| `ROLE_ADMIN` | IT/Sistema | Desktop (Web) | Gestão Acessos, Auditoria, Config |
| `ROLE_CEO` | Read-only | Desktop (Web) | Dashboard Executivo transversal |
| `ROLE_CFO` | Read-only | Desktop (Web) | Dashboard Financeiro, Relatórios |
| `ROLE_SECRETARIA` | Transacional | Desktop (Web) | Atendimento, Faturação, Docs Civis |
| `ROLE_DIRETOR_TECNICO` | Gestão | Desktop (Web) | Calendário, Plantéis, Quadros, Análise |
| `ROLE_MEDICO` | Clínico | Desktop (Web) | Fila EMDs, Dossiês, Monitorização |
| `ROLE_TREINADOR` | Operacional | Mobile | Assiduidade, Convocatórias, Fichas |
| `ROLE_EE` / `ROLE_ATLETA` | Portal B2C | Mobile | Consultas, Upload Docs, Financeiro |

## Design System (Tokens Reais — DESIGN.md)
### Paleta de Cores
```
PRETO_PRIMARIO   = '#000000'  // Texto, ícones, sidebar
BRANCO           = '#FFFFFF'  // Fundos de cartões, inputs, modais
DOURADO_CTA      = '#F1C40F'  // Botões primários, destaques
GRAY_50_FUNDO    = '#F8FAFC'  // Fundo da app (off-white)
GRAY_100_HOVER   = '#F1F5F9'  // Hover de linhas de tabela
GRAY_200_BORDAS  = '#E2E8F0'  // Bordas de cartões/inputs
GRAY_500_TEXTO2  = '#64748B'  // Textos secundários, labels
GRAY_900_TEXTO1  = '#0F172A'  // Texto principal (títulos, body)
```
### Cores Semânticas (Soft Badges)
```
SUCESSO_BG = '#ECFDF5'  SUCESSO_TEXT = '#047857'  // Verde (Apto, Pago)
AVISO_BG   = '#FFFBEB'  AVISO_TEXT   = '#B45309'  // Amarelo (A expirar)
ERRO_BG    = '#FEE2E2'  ERRO_TEXT    = '#991B1B'  // Vermelho (Inapto, Dívida)
INFO_BG    = '#EFF6FF'  INFO_TEXT    = '#1D4ED8'  // Azul (Info)
```
### Tipografia
- Font: Inter (primária), fallback Roboto
- Títulos: SemiBold 600 / Bold 700, cor GRAY_900
- Body: 14-16px Regular 400, cor GRAY_900
- Secundário: 12-14px Regular, cor GRAY_500
- Headers de tabela: 12px Medium 500 UPPERCASE, cor GRAY_500

### Layout
- Espaçamento: múltiplos de 4px (8, 12, 16, 24, 32)
- Border radius: inputs/botões 8px, cartões/modais 12-16px, avatares circular
- Sombras: suave (Y1 B2 5%), média (Y4 B6 5%), forte (Y10 B15 10%)

### Regras de Layout por Plataforma
- **Desktop (≥1024px):** Sidebar fixa esquerda (280px, fundo #000), header #FFF com breadcrumbs, content area #F8FAFC
- **Mobile (<768px):** Top App Bar + Bottom Navigation (4-5 itens). Tabelas → Cards verticais. Modais → Bottom Sheets. Botões primários full-width fixos no fundo.

### Componentes
- Botão Primário: fundo #F1C40F, texto #000 SemiBold
- Botão Secundário: fundo transparente, borda 1px #E2E8F0, texto #0F172A
- Botão Destrutivo: fundo #FEE2E2, texto #991B1B
- Inputs: fundo #FFF, borda 1px #E2E8F0, radius 8px. Focus → borda #F1C40F. Erro → borda #DC2626.
- Badges/Semáforos: Pills com ícone Lucide + texto. NUNCA emojis (🟢🔴). Usar cores semânticas.
- Tabelas: SEM linhas verticais. Horizontais finas 1px #E2E8F0. Header UPPERCASE 12px.
- Modais desktop: backdrop 40-50% opaco + blur, janela #FFF radius 12px, botões à direita (Cancelar | Confirmar)
- Empty states: ícone vetorial grande (10% opacidade), título, subtítulo, botão CTA

## Regras Críticas de Negócio
1. **Semáforo Clínico (RF-16):** Traduz diagnósticos em APTO/INAPTO. O Treinador NUNCA vê diagnósticos (RGPD) — apenas o semáforo mascarado.
2. **Segregação SAD/Clube:** OBRIGATÓRIA em todas as transações financeiras. Coluna `entidade_juridica` + filtro Service.
3. **Bloqueio EMD (RF-15):** EMD caducado = bloqueio sistémico total (sem convocatória, sem presença).
4. **Fichas de Jogo (RF-10):** Bloqueio automático 24h após o evento. Após bloqueio, inputs → texto read-only + banner amarelo.
5. **Audit Trail (RF-24):** Tabela append-only. NUNCA DELETE/UPDATE no audit log.
6. **Debounce pesquisa:** Inputs de pesquisa disparam após 3 caracteres + paragem de digitação (300ms).
7. **Read-only dinâmico:** Registos expirados/bloqueados → inputs transformam-se em texto sem bordas + banner Warning.
8. **Zero scroll horizontal mobile:** Tabelas → Cards verticais empilhados em mobile.

## Convenções de Código (Frontend)
- TypeScript strict mode. NUNCA `any`, `as any`, `@ts-ignore`.
- Componentes funcionais com hooks. NUNCA class components.
- Ficheiros: PascalCase para componentes/screens, camelCase para hooks/utils/services.
- Estilos: `StyleSheet.create()` do React Native. NUNCA inline styles, NUNCA Tailwind.
  - O DESIGN.md usa notação Tailwind como referência, mas a implementação é SEMPRE StyleSheet.
  - Traduzir: `bg-[#F8FAFC]` → `backgroundColor: '#F8FAFC'`, `rounded-xl` → `borderRadius: 12`, etc.
- Navegação: React Navigation v7 (@react-navigation/native, stack, bottom-tabs, drawer).
- Estado global: Zustand (uma store por domínio).
- API: Axios centralizado em src/services/ com interceptor JWT. Tipos tipados.
- Cores: SEMPRE importar de src/constants/colors.ts. NUNCA hardcodar hex.
- URLs: SEMPRE importar de src/constants/endpoints.ts.
- Platform checks: `Platform.OS === 'web'` para diferenciar layout desktop/mobile.
- Ícones: `lucide-react-native`. Import: `import { Search, Plus, Trash2 } from 'lucide-react-native'`.

## Convenções de Código (Backend)
- Java 21, Spring Boot 3.x.
- Package: `com.sigd.{dominio}.{camada}` (controller, service, repository, dto, model).
- DTOs separados de entidades JPA. NUNCA expor @Entity na API.
- Validação: Jakarta Bean Validation (@NotNull, @NotBlank, @Valid, @Size, etc.).
- Erros: formato padronizado `{ status, error, message, timestamp, path }`.
- Paginação: Spring Data Pageable (page, size, sort via query params).
- Segurança: @PreAuthorize("hasRole('ROLE_X')") nos controllers.
- Transações: @Transactional nos services. ACID obrigatório em operações financeiras.
- Testes: JUnit 5 + Mockito. Mínimo: testes unitários nos services.

## Boas Práticas de Engenharia de Software
- **Separation of Concerns:** Cada camada tem responsabilidade única. Controllers não têm lógica de negócio. Services não fazem queries diretas. Repositories não validam.
- **DRY (Don't Repeat Yourself):** Componentes reutilizáveis em components/ui/ e components/domain/. Hooks partilhados em hooks/.
- **SOLID:** Single Responsibility nos services. Dependency Injection via Spring (@Autowired) e React (Context/Zustand).
- **Defensive Programming:** Validar inputs no frontend E no backend. Never trust the client.
- **Error Handling:** try/catch em todas as chamadas API. Feedback visual ao utilizador (toast/alert). Nunca falhar silenciosamente.
- **Loading States:** OBRIGATÓRIO em todas as operações assíncronas. Skeleton loaders ou spinners.
- **Accessibility:** accessibilityLabel em todos os TouchableOpacity. Contraste WCAG AA.
- **Git:** Conventional Commits (feat:, fix:, refactor:, docs:). Uma feature por branch.
- **Code Review:** Nunca fazer merge sem revisão. O agent gera código, o humano valida.

## Quando Consultares Skills
- Para saber **O QUE** construir → skill `ui-specs` (ficheiros UI por módulo)
- Para saber **PORQUÊ** → skill `srs-knowledge` (requisitos formais RF/RNF)
- Para saber **OS FLUXOS** → skill `use-cases` (cenários passo a passo)
- Para saber **A ESTRUTURA** técnica → skill `architecture` (ADRs, API, modelo de dados)
