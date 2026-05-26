# AUDIT.md — Auditoria Completa do Projecto SIGD

**Data da Auditoria:** 26 de Maio de 2026  
**Próxima entrega:** 27 de Maio de 2026, 23:59  
**Documentos de referência:** SRS.md (42 RFs + 27 RNFs), UseCases.md, SECRETARIA.md, MEDICO.md, TREINADOR.md, DIRETOR_DESPORTIVO.md, PORTAL.md, CEO.md, CFO.md, ADMIN.md

**Estado da BD (dados de demo):**

| Tabela | Registos |
|---|---|
| `atleta` | 17 |
| `utilizador` | 10 |
| `evento_desportivo` | 5 |
| `convocatoria` | 2 |
| `ocorrencia` | 3 |
| `obrigacao_financeira` | 6 |
| `audit_log` | 19 |

---

## 1. BACKEND — Estado por Módulo

### 1.1 Módulo Auth (`com.sigd.auth`)

**Endpoints:**
- `POST /api/v1/auth/login` — Login JWT ✅
- `POST /api/v1/auth/register` — Registo (admin) ✅

**RFs cobertos:** RF-22 (parcial)  
**Lacunas reais:**
- ❌ Sem lockout após 5 tentativas falhadas (RNF-07)
- ❌ Sem política de complexidade de password (RNF-06)
- ❌ Sem endpoint de logout que invalide o token server-side
- ❌ Sem obrigação de mudança de password no 1.º login

---

### 1.2 Módulo Admin (`com.sigd.admin`)

**Endpoints:**
- `GET/POST /api/v1/admin/utilizadores` — Listagem e criação ✅
- `GET/PUT /api/v1/admin/utilizadores/{id}` — Detalhe e edição ✅
- `GET /api/v1/admin/audit` — Audit log paginado ✅

**RFs cobertos:** RF-40 (parcial), RF-24 (parcial)  
**RFs cobertos:** RF-40 (parcial), RF-24 (parcial), UC-16.3 ✅
**Lacunas reais:**
- ❌ Sem endpoint de forçar reset de password (UC-16.4)
- ❌ Sem gestão de locais de treino
- ❌ Sem configuração SMTP (UC-16.2)
- 🔶 Audit log existe com interceptor (`AuditInterceptor.java`) mas só regista POST/PUT/DELETE — sem registo de leitura/login

---

### 1.3 Módulo Clínica (`com.sigd.clinica`)

**Endpoints:**
- `POST /api/v1/clinica/ocorrencias` — Criar ocorrência (ROLE_MEDICO) ✅
- `GET /api/v1/clinica/fila-emd` — Fila EMD (ROLE_MEDICO, ROLE_SECRETARIA, ROLE_DIRETOR_TECNICO) ✅
- `GET /api/v1/clinica/ocorrencias/ativas` — Ocorrências ativas (ROLE_MEDICO, ROLE_DIRETOR_TECNICO) ✅
- `GET /api/v1/clinica/ocorrencias/atleta/{id}` — Histórico do atleta ✅
- `GET /api/v1/clinica/ocorrencias/{id}` — Detalhe da ocorrência (ROLE_MEDICO) ✅
- `POST /api/v1/clinica/ocorrencias/{id}/deliberar` — Deliberar EMD (ROLE_ADMIN) ✅
- `POST /api/v1/clinica/ocorrencias/{id}/alta` — Alta médica (ROLE_MEDICO) ✅

**RFs cobertos:** RF-16 (parcial), RF-17 ✅, RF-19 (parcial)  
**Lacunas reais:**
- ❌ Sem caducidade automática de EMD (RF-15 — trigger temporal)
- ❌ Sem alerta de proximidade de validade (RF-14 — 30 dias antes)
- ❌ Sem bloqueio sistémico em cascata por inaptidão clínica (RF-18 — propaga para convocatória em tempo real)
- 🔶 Deliberação usa ROLE_ADMIN em vez de ROLE_MEDICO — inconsistente com spec

---

### 1.4 Módulo Tesouraria (`com.sigd.tesouraria`)

**Endpoints:**
- `GET/POST/PUT /api/v1/tesouraria/atletas` — CRUD atletas ✅
- `GET /api/v1/tesouraria/atletas/{id}/elegibilidade` — Semáforo por atleta ✅
- `GET/POST/PUT /api/v1/tesouraria/ee` — CRUD encarregados ✅
- `GET /api/v1/tesouraria/ee/{id}/situacao-financeira` — Situação financeira ✅
- `GET /api/v1/tesouraria/ee/{id}/obrigacoes` — Obrigações do EE ✅
- `GET/POST /api/v1/tesouraria/equipas` — Equipas ✅
- `POST /api/v1/tesouraria/pagamentos/{id}/registar` — Registar pagamento ✅
- `GET /api/v1/tesouraria/escaloes` — Escalões ✅
- `GET /api/v1/tesouraria/modalidades` — Modalidades ✅
- `POST /api/v1/tesouraria/provisoes/gerar` — Gerar provisões (RF-29) ✅

**RFs cobertos:** RF-35 ✅, RF-36 ✅, RF-38 (parcial — sem PDF), RF-41 ✅, RF-29 (parcial)  
**Lacunas reais:**
- ❌ Sem desdobramento SAD/Clube no registo de pagamento (RF-33) — obrigações não têm campo `entidadeJuridica` poblado
- ❌ Sem geração de fatura-recibo PDF (RF-38)
- ❌ Sem painel de KPIs de tesouraria agregados (RF-30)
- ❌ Sem monitorização de fluxos de caixa (RF-34)
- ❌ Sem arquivamento/cessação de vínculo de atletas (RF-27)
- ❌ Sem gestão de época desportiva (RF-42)
- ❌ Motor de provisões existe mas não valida sobreposição temporal (UC-05.1 passo 6)

---

### 1.5 Módulo Treinador (`com.sigd.treinador`)

**Endpoints:**
- `GET /api/v1/treinador/sessoes` — Listar sessões ✅
- `POST /api/v1/treinador/sessoes` — Criar sessão de treino ✅
- `POST /api/v1/treinador/sessoes/{id}/chamada` — Submeter chamada ✅
- `POST /api/v1/treinador/sessoes/{id}/avaliacao` — Submeter avaliação ✅
- `GET /api/v1/treinador/eventos` — Listar eventos (jogos) ✅
- `GET /api/v1/treinador/plantel/{equipaId}` — Plantel da equipa ✅
- `GET /api/v1/treinador/plantel/{equipaId}/semaforo` — Semáforo do plantel ✅
- `POST /api/v1/treinador/convocatorias` — Guardar convocatória ✅
- `POST /api/v1/treinador/convocatorias/{id}/publicar` — Publicar ✅
- `GET /api/v1/treinador/convocatorias/{id}/pdf` — PDF da convocatória ✅

**RFs cobertos:** RF-01 (parcial), RF-03 (parcial), RF-04 (parcial), RF-28 (parcial)  
**Lacunas reais:**
- ❌ Sem ficha de jogo backend (RF-09 — endpoint `POST /sessoes/{id}/ficha-jogo` não existe)
- ✅ Bloqueio temporal de fichas (RF-10 — janela de 24h enforced visualmente na UI via `jogoJaAconteceu`)
- ❌ Sem alertas de incumprimento (RF-11)
- ❌ Sem dashboard de rendimento individual por atleta (RF-12 — backend)
- ❌ Sem swipe/gesture nativo na ChamadaScreen (apenas UI)

---

### 1.6 Módulo Portal (`com.sigd.portal`)

**Endpoints existentes:**
**Endpoints existentes:**
- `GET /api/v1/portal/alertas` — Avisos de pendências (mensalidades em atraso) ✅
- O controller delega para `tesouraria` e `clinica` internamente

**Lacunas reais:**
- ❌ Sem endpoint de submissão de justificação de ausência (RF-02)
- ❌ Sem endpoint de upload de documentos (RF-21 / RNF-16)
- ❌ Sem endpoint de notificações do portal (RF-20)
- ❌ Sem cartão digital QR (RF-39)

---

### 1.7 Módulo CEO (`com.sigd.ceo`) e CFO (`com.sigd.cfo`)

**CEO endpoints:**
- `GET /api/v1/ceo/kpis` — KPIs globais ✅
- `GET /api/v1/ceo/performance-escaloes` — Tabela de jogos e resultados por escalão ✅
- `GET /api/v1/ceo/resumo-atletico` — Resumo atlético ✅

**CFO endpoints:**
- `GET /api/v1/cfo/resumo-financeiro` — KPIs financeiros ✅
- `GET /api/v1/cfo/obrigacoes` — Lista obrigações ✅

**Lacunas reais:**
- ❌ Sem análise por centro de responsabilidade (RF-32 — Clube vs. SAD não segregado)
- ❌ Sem fluxos de caixa granulares (RF-34)
- ❌ Sem exportação CSV (apenas UI)
- ❌ Sem geração de relatório PDF executivo

---

### 1.8 Módulo Audit (`com.sigd.audit`)

**Estado actual:**
- `AuditLog.java` + `AuditLogRepository.java` + `AuditInterceptor.java` ✅
- `AuditInterceptor` regista POST/PUT/DELETE com username real (via `auth.getName()`) ✅
- `GET /api/v1/admin/audit` expõe logs paginados ✅

**Lacunas reais:**
- 🔶 Interceptor não regista GET (leitura de dados sensíveis)
- 🔶 Sem enforce append-only (delete não está bloqueado ao nível do repositório)
- ✅ Filtros de data (`dataInicio` e `dataFim`) integrados (`/api/v1/admin/audit-log`) e ui
- 🔶 Entidade `auditada` (entidadeId) não está a ser capturada — só path e ator

---

### 1.9 Módulo Core (`com.sigd.core`)

**Tabelas na BD:** `atleta`, `audit_log`, `avaliacao_rendimento`, `convocatoria`, `convocatoria_atletas`, `encarregado_educacao`, `epoca_desportiva`, `equipa`, `escalao`, `evento_desportivo`, `modalidade`, `obrigacao_financeira`, `ocorrencia`, `registo_assiduidade`, `sessao_treino`, `utilizador`

**Avaliação:** Base de dados bem estruturada. Tabela `epoca_desportiva` existe mas sem CRUD backend.

---

## 2. FRONTEND — Estado por Módulo

### 2.1 Auth

| Ecrã | Integração |
|---|---|
| `LoginScreen.tsx` | ✅ Real — Axios + JWT |

---

### 2.2 Módulo Secretaria (9 ecrãs + subdirectórios)

| Ecrã | Integração | Observação |
|---|---|---|
| `SecretariaScreen.tsx` | ✅ Real | Dashboard com dados reais |
| `AtendimentoScreen.tsx` | ✅ Real | 3 vistas: SEARCH/PROFILE/CHECKOUT |
| `ValidacaoDocumentalScreen.tsx` | 🔶 Mock parcial | Lista atletas reais mas estado documental calculado localmente |
| `ConfiguracoesSecScreen.tsx` | 🔶 Mock parcial | Motor de provisões UI existe mas sem dados reais de época |
| `EntidadesScreen.tsx` | 🎨 Stub | Ficheiro quase vazio (483 bytes) |
| `atletas/AtletaListScreen.tsx` | ✅ Real | Paginação real |
| `atletas/AtletaDetailScreen.tsx` | ✅ Real | Detalhe real |
| `atletas/AtletaCreateEditScreen.tsx` | ✅ Real | CRUD real |
| `encarregados/EncarregadoListScreen.tsx` | ✅ Real | |
| `encarregados/EncarregadoDetailScreen.tsx` | ✅ Real | |
| `encarregados/EncarregadoCreateEditScreen.tsx` | ✅ Real | |
| `equipas/EquipaListScreen.tsx` | ✅ Real | |
| `equipas/EquipaCreateScreen.tsx` | ✅ Real | |

**Lacunas vs. SECRETARIA.md:**
- ❌ AtendimentoScreen não mostra 3 badges (Quotas/EMD/CC) por EE na listagem
- ❌ Sem Tab B (Plano de Pagamentos com tabela de débitos + Sel. Todos) — o CHECKOUT é simplificado
- ❌ Sem Tab C (Histórico de Faturas com código FT e botão impressora)
- ❌ Sem Modal de Impacto Financeiro ao alterar estatuto de Sócio
- ❌ Sem Modal "Registar Bloqueio Manual" (UC-03.2)
- ❌ Sem Modal "Resolver Pendência" (UC-03.3)
- ❌ Sem Modal "Adicionar Artigo Extra" no Checkout
- ❌ Sem campo NIF alternativo no Checkout
- ❌ ValidacaoDocumentalScreen não tem split-pane com pré-visualização de documento
- ❌ ConfiguracoesSecScreen não mostra dados reais de época desportiva

---

### 2.3 Módulo Médico (3 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `FilaEMDsScreen.tsx` | ✅ Real | Deliberação conectada ao backend |
| `MonitorizacaoScreen.tsx` | ✅ Real | Ocorrências ativas e reavaliações |
| `DossiesScreen.tsx` | 🎨 Stub | Ficheiro quase vazio (499 bytes) |

**Lacunas vs. MEDICO.md:**
- ❌ DossiesScreen é um stub — sem dossier clínico individual com timeline
- ❌ Sem alta médica formal na UI (modal de alta)
- ❌ Sem pesquisa por atleta na Fila de EMDs
- ❌ Sem pré-visualização de documento PDF/PNG na Fila de EMDs
- ❌ Sem split-pane na Fila de EMDs (spec exige ~35%/~65%)

---

### 2.4 Módulo Treinador (10 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `HojeScreen.tsx` | ✅ Real | Sessões e jogos reais |
| `PlantelScreen.tsx` | ✅ Real | Plantel + semáforo reais |
| `JogosScreen.tsx` | ✅ Real | Lista de jogos reais |
| `PerfilScreen.tsx` | 🎨 Mock | Dados do perfil do treinador hardcoded |
| `ChamadaScreen.tsx` | ✅ Real | Chamada conectada ao backend |
| `AvaliacaoSessaoScreen.tsx` | ✅ Real | Avaliação conectada ao backend |
| `ConvocatoriaFlowScreen.tsx` | ✅ Real | Semáforo por endpoint único |
| `DetalheJogoScreen.tsx` | ✅ Real | PDF download com JWT |
| `FichaJogoFlowScreen.tsx` | 🎨 Mock | Backend não existe para ficha de jogo |
| `PerfilAtletaScreen.tsx` | 🔶 Parcial | Dados básicos reais, métricas mock |

**Lacunas vs. TREINADOR.md:**
- ❌ FichaJogoFlowScreen — sem backend (submissão é console.log)
- ❌ PerfilScreen não usa dados reais do utilizador autenticado
- ❌ Sem swipe gestural na ChamadaScreen (apenas botões)
- ❌ PerfilAtletaScreen não mostra convocatórias recentes (pills horizontais)
- ❌ Contador regressivo de avaliação (< 1h: pulsante) não implementado

---

### 2.5 Módulo Diretor Desportivo (5 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `CalendarioGlobalScreen.tsx` | ❌ Mock | `diretorDesportivoService.ts` usa `Promise.resolve()` |
| `GestaoPlanteisScreen.tsx` | ❌ Mock | |
| `PlantelEquipaDTScreen.tsx` | ❌ Mock | |
| `QuadrosCompetitivosScreen.tsx` | ❌ Mock | |
| `AnaliseRendimentoScreen.tsx` | ❌ Mock | |

> [!CAUTION]
> Todo o módulo Diretor Desportivo opera com dados fictícios hardcoded. Nenhum endpoint de backend existe para este módulo (nem controller, nem service, nem DTOs dedicados).

---

### 2.6 Módulo CEO (5 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `VisaoExecutivaScreen.tsx` | ✅ Real | KPIs e alertas estratégicos reais (`/ceo/kpis`, `/ceo/alertas`), gráficos mock |
| `AnaliseFinanceiraScreen.tsx` | 🔶 Parcial | KPIs reais, drill-down mock |
| `PerformanceDesportivaScreen.tsx` | 🔶 Parcial | Tabela de resultados por escalão com dados reais |
| `BaseAssociativaScreen.tsx` | 🔶 Parcial | Dados parcialmente reais |
| `AuditoriaCEOScreen.tsx` | ✅ Real | `adminService.getAuditoria()` com paginação |

---

### 2.7 Módulo CFO (4 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `DashboardExecutivoCFOScreen.tsx` | 🔶 Parcial | KPIs reais (`/cfo/resumo-financeiro`), gráficos mock |
| `RelatoriosFinanceirosCFOScreen.tsx` | ❌ Mock | |
| `BaseSocialCFOScreen.tsx` | ❌ Mock | |
| `AuditoriaFinanceiraCFOScreen.tsx` | ❌ Mock | |

---

### 2.8 Módulo Portal EE/Atleta (5 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `InicioScreen.tsx` | ✅ Real | Alertas dinâmicos (Saúde, Mensalidade) via `/api/v1/portal/alertas`, agenda usa mocks residuais |
| `AgendaScreen.tsx` | ❌ Mock | `mockEventos` hardcoded |
| `CartaoScreen.tsx` | ❌ Mock | QR Code fictício |
| `DocumentosScreen.tsx` | ❌ Mock | `mockDocumentos` |
| `ContaScreen.tsx` | ❌ Mock | `mockObrigacoes` |

> [!CAUTION]
> Todo o Portal opera com mocks. O backend (`PortalController.java`) existe mas é um stub isolado. Não há integração real de nenhum ecrã.

---

### 2.9 Módulo Admin (3 ecrãs)

| Ecrã | Integração | Observação |
|---|---|---|
| `GestaoAcessosScreen.tsx` | ✅ Real | CRUD de utilizadores via `adminService.ts` |
| `AuditoriaScreen.tsx` | ✅ Real | Audit log com paginação e filtros |
| `ConfiguracoesScreen.tsx` | 🎨 Mock | Configurações globais sem backend |

---

## 3. REQUISITOS FUNCIONAIS — Mapa de Implementação (Estado Real)

### Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Backend implementado + Frontend real ligado |
| 🔶 | Parcialmente implementado (backend ou frontend incompleto) |
| 🎨 | Só frontend com mock — backend inexistente |
| ❌ | Não existe em nenhuma camada |

---

### Operações de Relvado

| RF | Nome | Backend | Frontend | Estado Geral |
|---|---|---|---|---|
| RF-01 | Registo de Assiduidade | ✅ | ✅ Real | 🔶 Parcial (sem swipe/háptico) |
| RF-02 | Justificações de Ausência (Portal→Treinador) | ❌ | ❌ | ❌ |
| RF-03 | Métricas de Rendimento Pós-Sessão | ✅ | ✅ Real | 🔶 Parcial (sem countdown pulsante) |
| RF-04 | Convocatórias Oficiais | ✅ | ✅ Real | 🔶 Parcial (sem limite de teto enforced no FE) |
| RF-05 | Notificação de Convocatórias (PDF + Push) | 🔶 (PDF) | 🔶 (download) | 🔶 Parcial |
| RF-06 | Config. Hierárquica (Modalidade/Escalão/Equipa) | 🔶 (Equipas CRUD) | 🔶 | 🔶 Parcial |
| RF-07 | Alocação de Staff/Plantel (RBAC) | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-08 | Quadros Competitivos | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-09 | Ficha de Jogo Digital | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-10 | Bloqueio Temporal de Fichas (24h) | ❌ | ❌ | ❌ |
| RF-11 | Alertas de Incumprimento Desportivo | ❌ | ❌ | ❌ |
| RF-12 | Dashboard Rendimento Individual | ❌ | 🎨 Parcial | 🎨 Só UI |
| RF-13 | Dashboard Resultados Globais | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-28 | Planeamento de Sessões de Treino | ✅ | ✅ Real | 🔶 Parcial |

---

### Clínica / Departamento Médico

| RF | Nome | Backend | Frontend | Estado Geral |
|---|---|---|---|---|
| RF-14 | Alertas Caducidade Documental (30 dias) | ❌ | ❌ | ❌ |
| RF-15 | Bloqueio por EMD Caducado | ❌ | ❌ | ❌ |
| RF-16 | Semáforo Clínico | ✅ | ✅ Real | ✅ |
| RF-17 | Abertura de Ocorrências Clínicas | ✅ | ✅ Real | ✅ |
| RF-18 | Interdição Sistémica por Baixa Médica | ❌ | ❌ | ❌ |
| RF-19 | Alta Médica | ✅ endpoint | 🔶 (sem modal formal) | 🔶 Parcial |

---

### Portal do Utilizador

| RF | Nome | Backend | Frontend | Estado Geral |
|---|---|---|---|---|
| RF-20 | Portal Centralizado (EE/Atleta) | 🔶 Stub | 🎨 Mock | 🎨 Só UI |
| RF-21 | Submissão de Documentos (Upload) | ❌ | ❌ | ❌ |
| RF-39 | Cartão Digital QR | ❌ | 🎨 Mock | 🎨 Só UI |

---

### Autenticação e Segurança

| RF | Nome | Backend | Frontend | Estado Geral |
|---|---|---|---|---|
| RF-22 | Autenticação JWT + RBAC | ✅ | ✅ | ✅ |
| RF-23 | Mascaramento RGPD (PII) | ❌ | ❌ | ❌ |
| RF-24 | Audit Trail Automático | 🔶 (POST/PUT/DELETE) | ✅ (leitura) | 🔶 Parcial |
| RF-25 | Gateway de Comunicações (SMTP/Push) | ❌ | ❌ | ❌ |
| RF-26 | Tarefas Agendadas (Cron) | ❌ | ❌ | ❌ |
| RF-40 | RBAC Dinâmico por Role | ✅ | ✅ | ✅ |

---

### Tesouraria e Financeiro

| RF | Nome | Backend | Frontend | Estado Geral |
|---|---|---|---|---|
| RF-27 | Cessação de Vínculo / Arquivamento | ❌ | ❌ | ❌ |
| RF-29 | Motor de Provisão (Quotas/Mensalidades) | 🔶 (endpoint existe) | 🔶 (UI existe) | 🔶 Parcial |
| RF-30 | Dashboard Tesouraria e Incumprimento | ❌ | 🎨 CEO/CFO parcial | 🎨 Só UI |
| RF-31 | Monitorização Ativos Sociais | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-32 | Análise Clube vs. SAD | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-33 | Desdobramento de Receita (Split) | ❌ | ❌ | ❌ |
| RF-34 | Fluxos de Caixa Numerário | ❌ | 🎨 Mock | 🎨 Só UI |
| RF-35 | Pesquisa Unificada de EE | ✅ | ✅ | ✅ |
| RF-36 | Fichas de EE (Master Data) | ✅ | ✅ | ✅ |
| RF-37 | Bloqueio por Inconformidade Documental | ❌ | ❌ | ❌ |
| RF-38 | Registo de Pagamento + Fatura PDF | 🔶 (pagamento) | 🔶 (sem PDF) | 🔶 Parcial |
| RF-41 | Gestão de Perfis de Atletas | ✅ | ✅ | ✅ |
| RF-42 | Gestão de Época Desportiva | ❌ | 🎨 UI existe | 🎨 Só UI |

---

### Resumo Estatístico

| Estado | RF | % |
|---|---|---|
| ✅ Totalmente implementado | 5 | 11,9% |
| 🔶 Parcialmente implementado | 13 | 31,0% |
| 🎨 Só frontend (mock) | 11 | 26,2% |
| ❌ Não existe | 13 | 31,0% |
| **Total** | **42** | 100% |

---

## 4. REQUISITOS NÃO-FUNCIONAIS — Conformidade Real

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-01 | Latência ≤ 1,5s (TTFB) | 🔶 | Sem medição formal; backend responde rápido em localhost |
| RNF-02 | Propagação alertas em tempo real (WebSocket) | ❌ | Sem WebSocket/SSE |
| RNF-03 | Geração PDF/Notificações | 🔶 | PDF de convocatória existe; fatura PDF não existe |
| RNF-04 | Debounce ≥ 300ms | 🔶 | Implementado em AtendimentoScreen e outros; não auditado em todos |
| RNF-05 | Responsividade | 🔶 | React Native adapta; breakpoints desktop não explícitos |
| RNF-06 | Complexidade de passwords | ❌ | Sem validação de política |
| RNF-07 | Lockout (5 tentativas → 15 min) | ❌ | Sem mecanismo |
| RNF-08 | Validade JWT (60s QR / 24h sessão) | 🔶 | JWT existe; expiração não configurada conforme spec |
| RNF-09 | TLS + AES-256 em repouso | 🔶 | HTTPS depende de deploy; sem encriptação em repouso |
| RNF-10 | Imutabilidade audit trail (append-only) | 🔶 | Modelo existe mas delete não está bloqueado |
| RNF-11 | Isolamento multientidade (SAD/Clube) | ❌ | Sem segregação lógica |
| RNF-12 | Proteção injeção/URL direto | 🔶 | Spring Security activo; sem teste de penetração |
| RNF-13 | Higienização API (Jakarta Validation) | ✅ | DTOs com `@Valid`, `@NotNull`, etc. |
| RNF-14 | Design responsivo | 🔶 | Mobile funcional; desktop adequado mas não spec-compliant |
| RNF-15 | Touch targets ≥ 44×44px | 🔶 | Treinador e Portal respeitam; Admin/CEO não auditado |
| RNF-16 | Upload documentos (PDF/PNG ≤ 5MB) | ❌ | Sem upload implementado |
| RNF-17 | Registo eficiente de eventos em jogo | 🎨 | UI existe (mock) |
| RNF-18 | ACID para operações financeiras | 🔶 | `@Transactional` usado; sem teste de stress |
| RNF-19 | Tolerância a falhas de expedição | ❌ | Sem retry queue |
| RNF-20 | Disponibilidade 99,5% | ❌ | Sem monitorização/SLA |
| RNF-21 | Backup e recuperação | ❌ | Sem política de backup |
| RNF-22 | Precisão temporal de cron jobs | ❌ | Sem scheduler |
| RNF-23 | Stack tecnológica mandatória | ✅ | Java 21 + Spring Boot + React Native + MySQL |
| RNF-24 | Deployment Docker | ✅ | Docker Compose funcional com healthcheck |
| RNF-25 | Conformidade RGPD (mascaramento PII) | ❌ | Sem mascaramento de dados |
| RNF-26 | Proibição de crypto customizado | ✅ | BCrypt + JWT standard |
| RNF-27 | Segregação societária SAD/Clube | ❌ | Sem separação de centros de responsabilidade |

**Resumo RNFs:**

| Estado | RNF | % |
|---|---|---|
| ✅ Conforme | 4 | 14,8% |
| 🔶 Parcialmente conforme | 10 | 37,0% |
| ❌ Não conforme | 13 | 48,1% |

---

## 5. PROBLEMAS CRÍTICOS CONHECIDOS

### P1 — Todo o módulo Diretor Desportivo é 100% mock
**Impacto:** Os RFs RF-07, RF-08, RF-09, RF-12, RF-13 não têm backend. Qualquer demo com o perfil ROLE_DIRETOR_TECNICO mostra dados fictícios.

### P2 — Todo o Portal EE/Atleta é 100% mock
**Impacto:** RF-02, RF-20, RF-21, RF-39 — zero integração real. A funcionalidade mais visível para as famílias não existe.

### P3 — Ficha de Jogo sem backend (RF-09)
**Impacto:** O fluxo mais importante do treinador (pós-jogo) termina em `console.log()`.

### P4 — Sem segregação Clube vs. SAD (RF-33 / RNF-27)
**Impacto:** Os pagamentos registados não identificam a entidade jurídica. Dashboards CEO/CFO que mostram análise por entidade são necessariamente mock.

### P5 — Sem upload de documentos (RNF-16)
**Impacto:** Portal não pode submeter EMDs, CC, fotografia. ValidacaoDocumentalScreen não valida documentos reais. Bloqueio sistémico (UC-03.2) não é accionável.

### P6 — DossiesScreen é um stub (499 bytes)
**Impacto:** A ABA 2 do módulo Médico (Dossiês Clínicos com timeline) não existe. O Médico não pode consultar o historial clínico completo de um atleta.

### P7 — EntidadesScreen é um stub (483 bytes)
**Impacto:** A ABA de Gestão de Entidades na Secretaria não tem conteúdo.

### P8 — Motor de Provisão sem validação de sobreposição
**Impacto:** É possível gerar obrigações duplicadas para o mesmo período (UC-05.1 passo 6 — protecção contra sobrefaturação não implementada).

---

## 6. SÍNTESE EXECUTIVA — 10 PRIORIDADES ANTES DE 27/05 23:59

Ordenadas por impacto visual na demo:

| # | Prioridade | Impacto | Esforço Est. |
|---|---|---|---|
| 1 | **Ligar Portal a dados reais** (InicioScreen, AgendaScreen, ContaScreen via portalService → backend) | Alto — famílias vêem dados reais | Médio |
| 2 | **DossiesScreen — implementar dossier clínico** por atleta com timeline de ocorrências | Alto — Médico sem esta ABA perde demo | Médio |
| 3 | **EntidadesScreen — implementar listagem** unificada de entidades (stub actual) | Médio — Secretaria perde ABA visível | Baixo |
| 4 | **FichaJogoFlowScreen — criar endpoint backend** `POST /treinador/sessoes/{id}/ficha-jogo` e ligar | Alto — fluxo treinador incompleto | Alto |
| 5 | **AtendimentoScreen — adicionar 3 badges** (Quotas/EMD/CC) na listagem de EEs | Médio — visual imediato no atendimento | Baixo |
| 6 | **Diretor Desportivo — ligar CalendarioGlobal** ao endpoint real de eventos | Médio — módulo 100% mock | Médio |
| 7 | **ConfiguracoesSecScreen — ligar época** desportiva ao backend (tabela `epoca_desportiva` existe) | Médio — ciclo financeiro depende disto | Médio |
| 8 | **CFO/CEO — corrigir gráficos mock** para usar dados reais de obrigações | Médio — dashboards executivos com dados fictícios | Médio |
| 9 | **Geração de recibo de pagamento** (mesmo que HTML simples em vez de PDF) | Médio — checkout termina sem confirmação fiscal | Médio |
| 10 | **PerfilScreen (Treinador) — ligar a dados reais** do utilizador autenticado | Baixo — stub visível no menu "Eu" | Baixo |

---

## 7. PONTOS POSITIVOS (NÃO REGREDIR)

| Área | Detalhe |
|---|---|
| JWT end-to-end | Login → token → `@PreAuthorize` funciona em toda a cadeia |
| Secretaria CRUD | Atletas, EE, Equipas — CRUD completo com dados reais |
| Clínica integrada | Ocorrências, fila EMD, deliberação, monitorização — todos reais |
| Treinador core | Chamada, avaliação, convocatória, PDF — todos ligados ao backend |
| Audit Trail | `AuditInterceptor` regista automaticamente; `AuditoriaCEOScreen` e `AuditoriaScreen` lêem dados reais |
| Docker | `start.ps1` + healthcheck MySQL + retry loop — arranque estável e reprodutível |
| Dados de demo | 17 atletas, 5 eventos, 3 ocorrências, 6 obrigações — realistas e usáveis |
| TypeScript 0 erros | `npx tsc --noEmit` passa limpo — sem erros de tipo |
| Design system | `Colors.ts` centralizado, `PageHeader` consistente, sem emojis em UI |
