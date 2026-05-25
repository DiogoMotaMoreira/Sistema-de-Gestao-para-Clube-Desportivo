# AUDIT.md — Auditoria Completa do Projecto SIGD

**Data da Auditoria:** 25 de Maio de 2026  
**Documentos de Referência:**
- SRS.md (42 RFs + 27 RNFs)
- UseCases.md (16 UCs)
- DESIGN.md, SECRETARIA.md, MEDICO.md, TREINADOR.md, DIRETOR_DESPORTIVO.md, PORTAL.md, CEO.md, CFO.md, ADMIN.md

---

## 1. BACKEND — Estado por Módulo

### 1.1 Módulo Auth (`com.sigd.auth`)

| Componente | Ficheiro | Estado |
|---|---|---|
| Controller | `AuthController.java` | ✅ Implementado |
| DTO | `LoginDTO.java` | ✅ Implementado |
| JWT Filter | `JwtAuthenticationFilter.java` | ✅ Implementado |
| Service | `AuthService.java`, `JwtService.java` | ✅ Implementado |

**RFs Cobertos:** RF-22 (parcial — autenticação JWT + login/logout)  
**Lacunas:**
- ❌ Não implementa lockout após tentativas falhadas (RF-22 / RNF-07 — 5 tentativas → bloqueio 15 min)
- ❌ Não implementa obrigar mudança de password no próximo login
- ❌ Não implementa política de complexidade de passwords (RNF-06)
- ❌ Sem endpoint de logout que invalide o token

---

### 1.2 Módulo Admin (`com.sigd.admin`)

| Componente | Ficheiro | Estado |
|---|---|---|
| Controller | `UtilizadorAdminController.java` | ✅ Implementado |
| DTO | `UtilizadorAdminDTO.java` | ✅ Implementado |
| Service | `UtilizadorAdminService.java` | ✅ Implementado |
| Exceptions | `UtilizadorJaExisteException.java`, `UtilizadorNotFoundException.java` | ✅ Implementado |

**RFs Cobertos:** RF-40 (RBAC parcial — CRUD de utilizadores com roles)  
**Lacunas:**
- ❌ Sem endpoint de bloqueio/reativação de acesso (UC-16.3)
- ❌ Sem endpoint de forçar reset de password (UC-16.4)
- ❌ Sem endpoint de edição de campos críticos (nome/data nascimento de atletas — UC-01.2 secundário)
- ❌ Sem endpoints de configuração de gateway SMTP (UC-16.2)
- ❌ Sem endpoints de gestão de locais de treino

---

### 1.3 Módulo Clínica (`com.sigd.clinica`)

| Componente | Ficheiro | Estado |
|---|---|---|
| Controller | `OcorrenciaController.java` | ✅ Implementado |
| DTOs | `OcorrenciaDTO.java`, `DeliberacaoDTO.java`, `FilaEMDDTO.java` | ✅ Implementado |
| Service | `OcorrenciaService.java` | ✅ Implementado |

**Endpoints disponíveis:**
- `POST /api/v1/clinica/ocorrencias` — Criar ocorrência (ROLE_MEDICO) ✅
- `GET /api/v1/clinica/fila-emd` — Fila EMD (ROLE_MEDICO) ✅
- `GET /api/v1/clinica/ocorrencias/atleta/{id}` — Histórico do atleta (ROLE_MEDICO) ✅
- `GET /api/v1/clinica/ocorrencias/{id}` — Detalhe da ocorrência (ROLE_MEDICO) ✅
- `POST /api/v1/clinica/ocorrencias/{id}/deliberar` — Deliberar EMD (ROLE_ADMIN) ✅

**RFs Cobertos:** RF-17 (parcial), RF-19 (parcial)  
**Lacunas:**
- ❌ Sem endpoint de alta médica explícito (RF-19 — encerramento formal)
- ❌ Sem semáforo clínico de tradução de prontidão (RF-16 — Verde/Amarelo/Vermelho)
- ❌ Sem bloqueio sistémico de utilização desportiva por EMD caducado (RF-15)
- ❌ Sem interdição sistémica por baixa médica (RF-18)
- ❌ Sem endpoint de monitorização/alertas de caducidade documental (RF-14)

---

### 1.4 Módulo Tesouraria (`com.sigd.tesouraria`)

| Componente | Ficheiro | Estado |
|---|---|---|
| Controllers | `AtletaController.java`, `EncarregadoController.java`, `EquipaController.java`, `ObrigacaoController.java` | ✅ Implementado |
| DTOs | `AtletaDTO.java`, `EncarregadoEducacaoDTO.java`, `EquipaDTO.java`, `ObrigacaoFinanceiraDTO.java`, `SituacaoFinanceiraDTO.java`, `TransferenciaDTO.java` | ✅ Implementado |
| Services | `AtletaService.java`, `EncarregadoService.java`, `ObrigacaoFinanceiraService.java` | ✅ Implementado |

**Endpoints disponíveis:**
- CRUD Atletas: `GET/POST/PUT /api/v1/tesouraria/atletas` (ROLE_SECRETARIA) ✅
- CRUD EE: `GET/POST/PUT /api/v1/tesouraria/ee` (ROLE_SECRETARIA) ✅
- Situação Financeira: `GET /api/v1/tesouraria/ee/{id}/situacao-financeira` ✅
- Equipas: `GET/POST /api/v1/tesouraria/equipas` (ROLE_SECRETARIA) ✅
- Pagamentos: `POST /api/v1/tesouraria/pagamentos/{id}/registar` ✅
- Obrigações por EE: `GET /api/v1/tesouraria/ee/{id}/obrigacoes` ✅
- Escalões: `GET /api/v1/tesouraria/escaloes` ✅
- Modalidades: `GET /api/v1/tesouraria/modalidades` ✅

**RFs Cobertos:** RF-35 (parcial), RF-36 (parcial), RF-38 (parcial), RF-41 (parcial)  
**Lacunas:**
- ❌ Sem motor de provisão automática (RF-29 — geração em lote de quotas/mensalidades)
- ❌ Sem desdobramento lógico SAD/Clube (RF-33 — internal split)
- ❌ Sem geração de fatura-recibo PDF (RF-38 — PDF)
- ❌ Sem painel de KPIs financeiros (RF-30)
- ❌ Sem monitorização de fluxos de caixa (RF-34)
- ❌ Sem análise rentabilidade Clube vs. SAD (RF-32)
- ❌ Sem gestão de época desportiva (RF-42)
- ❌ Sem arquivamento/cessação de vínculo de atletas (RF-27)
- ❌ Sem transferência de atleta entre equipas (`TransferenciaDTO` existe mas sem controller/endpoint)

---

### 1.5 Módulo Audit (`com.sigd.audit`)

| Componente | Ficheiro | Estado |
|---|---|---|
| Model | `AuditLog.java` | ✅ Implementado |
| Repository | `AuditLogRepository.java` | ✅ Implementado |

**RFs Cobertos:** RF-24 (parcial — modelo e repositório existem)  
**Lacunas:**
- ❌ Sem controller/endpoint de consulta de logs (UC-16.1 — CEO e Admin como leitores)
- ❌ Sem interceptor automático que regista eventos (RF-24 exige append-only automático)
- ❌ Sem exportação CSV de logs
- ❌ O audit trail não é consumido em nenhum endpoint REST

---

### 1.6 Módulo Core (`com.sigd.core`)

| Componente | Ficheiros | Estado |
|---|---|---|
| Models | `Atleta.java`, `EncarregadoEducacao.java`, `Equipa.java`, `Escalao.java`, `Modalidade.java`, `ObrigacaoFinanceira.java`, `Ocorrencia.java`, `Utilizador.java`, + enums | ✅ Implementado |
| Repositories | `AtletaRepository.java`, `EncarregadoEducacaoRepository.java`, `EquipaRepository.java`, `EscalaoRepository.java`, `ModalidadeRepository.java`, `ObrigacaoFinanceiraRepository.java`, `OcorrenciaRepository.java`, `UtilizadorRepository.java` | ✅ Implementado |
| Enums | `EstadoElegibilidade`, `EstadoEMD`, `EstadoObrigacao`, `EstadoOcorrencia`, `GrauRestricaoDesportiva`, `TipoObrigacao`, `TipoOcorrencia` | ✅ Implementado |

**Avaliação:** Base sólida de entidades. Modelos bem mapeados para os domínios financeiro e clínico.

---

### 1.7 Módulo Treinador (`com.sigd.treinador`)

| Componente | Ficheiros | Estado |
|---|---|---|
| Controller | `SessaoTreinoController.java`, `EventoDesportivoController.java` | ✅ Implementado |
| Service | `SessaoTreinoService.java`, `EventoDesportivoService.java` | ✅ Implementado |
| Testes | `SessaoTreinoServiceTest.java` | ✅ Implementado |

**Endpoints disponíveis:**
- CRUD Sessões de Treino, Registo Chamada, Registo Avaliação (ROLE_TREINADOR) ✅
- CRUD Eventos Desportivos e Publicação Convocatória (ROLE_TREINADOR) ✅

**RFs Cobertos:** RF-01, RF-03, RF-04, RF-28 (implementados a nível de backend).

---

### 1.8 Módulos Backend INEXISTENTES

| Módulo Esperado (SRS) | Pacote | Estado |
|---|---|---|
| Direção Técnica | `com.sigd.direcao` | ❌ **NÃO EXISTE** |
| Portal do Utilizador (EE/Atleta) | `com.sigd.portal` | ❌ **NÃO EXISTE** |
| CEO Dashboard | `com.sigd.ceo` | ❌ **NÃO EXISTE** |
| CFO Dashboard | `com.sigd.cfo` | ❌ **NÃO EXISTE** |
| Comunicações (SMTP/Push) | `com.sigd.comunicacoes` | ❌ **NÃO EXISTE** |

> [!CAUTION]
> **5 módulos de backend inteiros não existem.** Os ecrãs de frontend para estes módulos dependem inteiramente de dados mock.

---

## 2. FRONTEND — Estado por Módulo

### 2.1 Login / Auth

| Ecrã | Ficheiro | Estado |
|---|---|---|
| LoginScreen | `screens/auth/LoginScreen.tsx` | ✅ Real (Axios → backend) |

**Integração:** ✅ Ligado ao backend real via `authService.ts` (JWT login funcional)

---

### 2.2 Módulo Secretaria

| Ecrã | Ficheiro | Estado |
|---|---|---|
| SecretariaScreen (Dashboard) | `screens/secretaria/SecretariaScreen.tsx` | ✅ Implementado |
| AtletaListScreen | `screens/secretaria/atletas/AtletaListScreen.tsx` | ✅ Implementado |
| AtletaDetailScreen | `screens/secretaria/atletas/AtletaDetailScreen.tsx` | ✅ Implementado |
| AtletaCreateEditScreen | `screens/secretaria/atletas/AtletaCreateEditScreen.tsx` | ✅ Implementado |
| EncarregadoListScreen | `screens/secretaria/encarregados/EncarregadoListScreen.tsx` | ✅ Implementado |
| EncarregadoDetailScreen | `screens/secretaria/encarregados/EncarregadoDetailScreen.tsx` | ✅ Implementado |
| EncarregadoCreateEditScreen | `screens/secretaria/encarregados/EncarregadoCreateEditScreen.tsx` | ✅ Implementado |
| EquipaListScreen | `screens/secretaria/equipas/EquipaListScreen.tsx` | ✅ Implementado |
| EquipaCreateScreen | `screens/secretaria/equipas/EquipaCreateScreen.tsx` | ✅ Implementado |
| EntidadesScreen | `screens/secretaria/EntidadesScreen.tsx` | ✅ Implementado |
| AtendimentoScreen | `screens/secretaria/AtendimentoScreen.tsx` | ✅ Implementado |
| ValidacaoDocumentalScreen | `screens/secretaria/ValidacaoDocumentalScreen.tsx` | ✅ Implementado |
| ConfiguracoesSecScreen | `screens/secretaria/ConfiguracoesSecScreen.tsx` | ✅ Implementado |

**Integração:** ✅ `secretariaService.ts` usa Axios real para CRUD de atletas, EE, equipas, pagamentos  
**Lacunas de UI vs. SECRETARIA.md:**
- ❌ Sem Aba de Provisões / Motor de Geração em Lote (SECRETARIA.md Aba 3)
- ❌ Sem gestão de Época Desportiva (SECRETARIA.md Aba 5 — Configurações)
- ❌ Sem modal de fatura-recibo PDF
- ❌ Sem exportação CSV/PDF
- ❌ Sem banner de segregação financeira Clube/SAD no atendimento

---

### 2.3 Módulo Médico (Clínica)

| Ecrã | Ficheiro | Estado |
|---|---|---|
| DossiesScreen | `screens/medico/DossiesScreen.tsx` | ✅ Implementado |
| FilaEMDsScreen | `screens/medico/FilaEMDsScreen.tsx` | ✅ Implementado |
| MonitorizacaoScreen | `screens/medico/MonitorizacaoScreen.tsx` | ✅ Implementado |

**Integração:** ✅ `clinicaService.ts` usa Axios real para todas as funções (ocorrências, fila EMD, deliberação)  
**Lacunas de UI vs. MEDICO.md:**
- ❌ Sem ecrã de Dossier Clínico Individual detalhado (drill-down por atleta com timeline)
- ❌ Sem modal de Alta Médica formal
- ❌ Sem badges de semáforo clínico (Verde/Amarelo/Vermelho) conforme spec
- ❌ Sem cronómetro de bloqueio temporal para deliberação EMD

---

### 2.4 Módulo Treinador

| Ecrã | Ficheiro | Estado |
|---|---|---|
| HojeScreen | `screens/treinador/HojeScreen.tsx` | ✅ Implementado |
| PlantelScreen | `screens/treinador/PlantelScreen.tsx` | ✅ Implementado |
| JogosScreen | `screens/treinador/JogosScreen.tsx` | ✅ Implementado |
| PerfilScreen | `screens/treinador/PerfilScreen.tsx` | ✅ Implementado |
| ChamadaScreen | `screens/treinador/flows/ChamadaScreen.tsx` | ✅ Implementado |
| AvaliacaoSessaoScreen | `screens/treinador/flows/AvaliacaoSessaoScreen.tsx` | ✅ Implementado |
| ConvocatoriaFlowScreen | `screens/treinador/flows/ConvocatoriaFlowScreen.tsx` | ✅ Implementado |
| FichaJogoFlowScreen | `screens/treinador/flows/FichaJogoFlowScreen.tsx` | ✅ Implementado |
| DetalheJogoScreen | `screens/treinador/flows/DetalheJogoScreen.tsx` | ✅ Implementado |
| PerfilAtletaScreen | `screens/treinador/flows/PerfilAtletaScreen.tsx` | ✅ Implementado |
| SemaforoBadge (componente) | `screens/treinador/components/SemaforoBadge.tsx` | ✅ Implementado |

**Integração:** ✅ **REAL (Fluxos Core)**
- `getEquipas()` → ✅ Axios real (`/tesouraria/equipas`)
- `getPlantel()` → ✅ Axios real (`/tesouraria/atletas`)
- `getEventosHoje()` → ✅ Axios real (`/treinador/eventos` e `/treinador/sessoes`)
- `getJogos()` → ✅ Axios real (`/treinador/eventos`)
- `submeterChamada()` → ✅ Axios real (`/treinador/sessoes/{id}/chamada`)
- `submeterAvaliacao()` → ✅ Axios real (`/treinador/sessoes/{id}/avaliacao`)
- `guardarConvocatoria()` → ✅ Axios real (`/treinador/convocatorias`)
- `submeterFichaJogo()` → ❌ **Mock** (console.log)

> [!WARNING]
> O módulo Treinador está funcional a nível de chamadas, avaliações e convocatórias, operando sobre dados reais. Apenas a ficha de jogo ainda depende de um Mock.

---

### 2.5 Módulo Diretor Desportivo

| Ecrã | Ficheiro | Estado |
|---|---|---|
| (Ecrãs dentro de `screens/diretorDesportivo/`) | — | ✅ Implementado |

**Integração:** ❌ **100% Mock** (`diretorDesportivoService.ts` usa `Promise.resolve()` com arrays hardcoded para tudo: equipas, atletas, staff, quadros, eventos, incumprimentos)

> [!CAUTION]
> Nenhum endpoint de backend existe para a Direção Técnica. Todo o módulo opera com dados fictícios.

---

### 2.6 Módulo CEO

| Ecrã | Ficheiro | Estado |
|---|---|---|
| (Ecrãs dentro de `screens/ceo/`) | — | ✅ Implementado |

**Integração:** ❌ **100% Mock** (`ceoService.ts` usa `Promise.resolve()` com `mockAlertas`)

---

### 2.7 Módulo CFO

| Ecrã | Ficheiro | Estado |
|---|---|---|
| (Ecrãs dentro de `screens/cfo/`) | — | ✅ Implementado |

**Integração:** ❌ **100% Mock** (`cfoService.ts` — comentário explícito `// ★ Serviço Mock ★`)

---

### 2.8 Módulo Portal (EE/Atleta)

| Ecrã | Ficheiro | Estado |
|---|---|---|
| InicioScreen | `screens/portal/InicioScreen.tsx` | ✅ Implementado |
| AgendaScreen | `screens/portal/AgendaScreen.tsx` | ✅ Implementado |
| CartaoScreen | `screens/portal/CartaoScreen.tsx` | ✅ Implementado |
| DocumentosScreen | `screens/portal/DocumentosScreen.tsx` | ✅ Implementado |
| ContaScreen | `screens/portal/ContaScreen.tsx` | ✅ Implementado |
| PortalHeader | `screens/portal/components/PortalHeader.tsx` | ✅ Implementado |
| PortalBadges | `screens/portal/components/PortalBadges.tsx` | ✅ Implementado |

**Integração:** ❌ **100% Mock** (`portalService.ts` usa `mockDependentes`, `mockNotificacoes`, `mockEventos`, `mockDocumentos`, `mockObrigacoes`)

---

### 2.9 Módulo Admin

| Ecrã | Ficheiro | Estado |
|---|---|---|
| (Ecrãs dentro de `screens/admin/`) | — | ✅ Implementado |

**Integração:** ✅ `adminService.ts` usa Axios real para CRUD de utilizadores  
**Lacunas:**
- ❌ Sem ecrã de Auditoria (ABA 2 do ADMIN.md)
- ❌ Sem ecrã de Configurações/Gateway SMTP (ABA 3 do ADMIN.md)
- ❌ Sem gestão de locais de treino

---

### 2.10 Navegação

| Ficheiro | Função |
|---|---|
| `AppNavigator.tsx` | Routing principal (auth vs. role-based) |
| `AuthNavigator.tsx` | Stack de login |
| `DesktopNavigator.tsx` | Navegação desktop (Secretaria, Médico, Admin, CEO, CFO, Diretor) |
| `PortalNavigator.tsx` | Bottom Tab Navigator do Portal (5 tabs) |
| `TreinadorNavigator.tsx` | Bottom Tab Navigator do Treinador (4 tabs + flows) |

**Avaliação:** ✅ Estrutura de navegação completa para todos os perfis (RBAC por role no frontend)

---

## 3. REQUISITOS FUNCIONAIS — Mapa de Implementação

### Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Implementado (backend + frontend) |
| 🔶 | Parcialmente implementado |
| ❌ | Não implementado |
| 🎨 | Só frontend (mock) |

---

### Operações de Relvado

| RF | Nome | Backend | Frontend | Estado |
|---|---|---|---|---|
| RF-01 | Registo de Assiduidade | ✅ | 🎨 `ChamadaScreen` | 🔶 Parcial |
| RF-02 | Justificações de Ausência (Portal→Treinador) | ❌ | ❌ | ❌ |
| RF-03 | Métricas de Rendimento Pós-Sessão | ✅ | 🎨 `AvaliacaoSessaoScreen` | 🔶 Parcial |
| RF-04 | Convocatórias Oficiais | ✅ | 🎨 `ConvocatoriaFlowScreen` | 🔶 Parcial |
| RF-05 | Notificação de Convocatórias (Push/Email) | ❌ | ❌ | ❌ |
| RF-06 | Config. Hierárquica (Modalidade/Escalão/Equipa) | 🔶 (Equipas CRUD) | 🔶 (Equipas CRUD) | 🔶 Parcial |
| RF-07 | Alocação de Staff/Plantel | ❌ | 🎨 Diretor mock | 🔶 Só UI |
| RF-08 | Quadros Competitivos | ❌ | 🎨 Diretor mock | 🔶 Só UI |
| RF-09 | Ficha de Jogo Digital | ❌ | 🎨 `FichaJogoFlowScreen` | 🔶 Só UI |
| RF-10 | Bloqueio Temporal de Fichas | ❌ | ❌ | ❌ |
| RF-11 | Alertas de Incumprimento Desportivo | ❌ | ❌ | ❌ |
| RF-12 | Dashboard Rendimento Individual | ❌ | 🎨 `PerfilAtletaScreen` | 🔶 Só UI |
| RF-13 | Dashboard Resultados Globais | ❌ | 🎨 CEO/Diretor mock | 🔶 Só UI |
| RF-28 | Planeamento de Treinos | ✅ | ❌ | 🔶 Parcial |

---

### Clínica / Departamento Médico

| RF | Nome | Backend | Frontend | Estado |
|---|---|---|---|---|
| RF-14 | Alertas Caducidade Documental | ❌ | ❌ | ❌ |
| RF-15 | Bloqueio por EMD Caducado | ❌ | ❌ | ❌ |
| RF-16 | Semáforo Clínico | ❌ | 🎨 `SemaforoBadge` | 🔶 Só UI |
| RF-17 | Abertura de Ocorrências Clínicas | ✅ | ✅ | ✅ |
| RF-18 | Interdição por Baixa Médica | ❌ | ❌ | ❌ |
| RF-19 | Alta Médica | 🔶 (deliberação parcial) | 🔶 | 🔶 Parcial |

---

### Portal do Utilizador

| RF | Nome | Backend | Frontend | Estado |
|---|---|---|---|---|
| RF-20 | Portal Centralizado (EE/Atleta) | ❌ | 🎨 5 tabs mock | 🔶 Só UI |
| RF-21 | Validação de Documentos Oficiais | ❌ | 🎨 `ValidacaoDocumentalScreen` | 🔶 Só UI |
| RF-39 | Cartão Digital QR | ❌ | 🎨 `CartaoScreen` | 🔶 Só UI |

---

### Autenticação e Segurança

| RF | Nome | Backend | Frontend | Estado |
|---|---|---|---|---|
| RF-22 | Autenticação JWT + RBAC | ✅ | ✅ | ✅ |
| RF-23 | Mascaramento RGPD | ❌ | ❌ | ❌ |
| RF-24 | Audit Trail | 🔶 (modelo+repo) | ❌ | 🔶 Parcial |
| RF-25 | Gateway de Comunicações | ❌ | ❌ | ❌ |
| RF-26 | Tarefas Agendadas (Cron) | ❌ | ❌ | ❌ |
| RF-40 | RBAC Dinâmico | 🔶 | 🔶 | 🔶 Parcial |

---

### Tesouraria e Financeiro

| RF | Nome | Backend | Frontend | Estado |
|---|---|---|---|---|
| RF-27 | Cessação de Vínculo/Arquivamento | ❌ | ❌ | ❌ |
| RF-29 | Motor de Provisão (Quotas/Mensalidades) | ❌ | ❌ | ❌ |
| RF-30 | Dashboard Tesouraria e Incumprimento | ❌ | 🎨 CEO/CFO mock | 🔶 Só UI |
| RF-31 | Monitorização Ativos Sociais | ❌ | 🎨 CEO/CFO mock | 🔶 Só UI |
| RF-32 | Análise Clube vs. SAD | ❌ | 🎨 CFO mock | 🔶 Só UI |
| RF-33 | Desdobramento Receita (Internal Split) | ❌ | ❌ | ❌ |
| RF-34 | Fluxos de Caixa Numerário | ❌ | 🎨 CFO mock | 🔶 Só UI |
| RF-35 | Pesquisa Unificada de EE | ✅ | ✅ | ✅ |
| RF-36 | Fichas de EE (Master Data) | ✅ | ✅ | ✅ |
| RF-37 | Bloqueio por Inconformidade Documental | ❌ | ❌ | ❌ |
| RF-38 | Registo Pagamento + Fatura PDF | 🔶 (pagamento sem PDF) | 🔶 | 🔶 Parcial |
| RF-41 | Gestão de Perfis de Atletas | ✅ | ✅ | ✅ |
| RF-42 | Gestão de Época Desportiva | ❌ | ❌ | ❌ |

---

### Resumo Estatístico de RFs

| Estado | Qtd | % |
|---|---|---|
| ✅ Totalmente implementados | **5** | 11,9% |
| 🔶 Parcialmente implementados | **17** | 40,5% |
| ❌ Não implementados | **20** | 47,6% |
| **Total** | **42** | 100% |

---

## 4. REQUISITOS NÃO-FUNCIONAIS — Mapa de Conformidade

### Desempenho

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-01 | Latência ≤ 1,5s | 🔶 | Backend responde rápido mas sem medição formal |
| RNF-02 | Propagação alertas tempo real | ❌ | Sem WebSocket/SSE implementado |
| RNF-03 | Geração documentos PDF/notificações | ❌ | Sem geração PDF |
| RNF-04 | Debounce de pesquisa ≥ 300ms | 🔶 | Implementado em alguns ecrãs de frontend |
| RNF-05 | Responsividade a viewport | 🔶 | React Native adapta mas sem breakpoints desktop explícitos |

### Segurança

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-06 | Complexidade de passwords | ❌ | Sem validação de política |
| RNF-07 | Lockout (5 tentativas) | ❌ | Sem mecanismo de bloqueio |
| RNF-08 | Validade JWT (60s QR / 24h sessão) | 🔶 | JWT existe mas sem configuração de expiração conforme spec |
| RNF-09 | Encriptação (TLS + AES-256 repouso) | 🔶 | HTTPS depende do deploy; sem encriptação em repouso |
| RNF-10 | Imutabilidade audit trail | 🔶 | Modelo `AuditLog` existe mas sem enforce append-only |
| RNF-11 | Isolamento multientidade (SAD/Clube) | ❌ | Sem segregação lógica implementada |
| RNF-12 | Proteção contra injeção/URL direto | 🔶 | Spring Security previne algo mas sem teste explícito |
| RNF-13 | Filtragem payload/higienização API | 🔶 | Validação Jakarta existe em DTOs |

### Usabilidade

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-14 | Design responsivo (mobile + desktop) | ✅ | React Native + Web com layout adaptativo |
| RNF-15 | Touch targets ≥ 44×44px | 🔶 | Usado em portal; não auditado em todos os ecrãs |
| RNF-16 | Upload docs (PDF/PNG, ≤5MB) | ❌ | Sem upload de documentos implementado |
| RNF-17 | Registo eficiente de eventos em jogo | 🔶 | UI da ficha de jogo existe (mock) |

### Fiabilidade

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-18 | ACID para operações financeiras | 🔶 | Spring `@Transactional` usado mas sem teste de stress |
| RNF-19 | Tolerância a falhas de expedição | ❌ | Sem retry queue para notificações |
| RNF-20 | Disponibilidade 99,5% | ❌ | Sem monitorização/SLA |
| RNF-21 | Backup e recuperação | ❌ | Sem política de backup |
| RNF-22 | Precisão temporal de cron jobs | ❌ | Sem scheduler implementado |

### Portabilidade e Conformidade

| RNF | Nome | Estado | Observação |
|---|---|---|---|
| RNF-23 | Stack tecnológica mandatória | ✅ | Java 21 + Spring Boot + React Native + MySQL ✓ |
| RNF-24 | Deployment Docker | ✅ | Docker Compose funcional ✓ |
| RNF-25 | Conformidade RGPD | ❌ | Sem mascaramento de dados PII |
| RNF-26 | Proibição de crypto customizado | ✅ | Usa BCrypt + JWT standard ✓ |
| RNF-27 | Segregação societária SAD/Clube | ❌ | Sem separação de centros de responsabilidade |

### Resumo Estatístico de RNFs

| Estado | Qtd | % |
|---|---|---|
| ✅ Conforme | **4** | 14,8% |
| 🔶 Parcialmente conforme | **12** | 44,4% |
| ❌ Não conforme | **11** | 40,7% |
| **Total** | **27** | 100% |

---

## 5. PROBLEMAS CRÍTICOS

### 5.1 🔴 Backend incompleto — 5 módulos inteiros inexistentes

**Severidade:** CRÍTICA  
**Impacto:** Diretor Desportivo, Portal, CEO, CFO e Motor de Comunicações não têm suporte de backend. Todos os ecrãs destes módulos operam com dados fictícios.

**RFs afetados:** RF-02, RF-05, RF-07 a RF-13, RF-20, RF-25, RF-29 a RF-34, RF-39

**Recomendação:** Priorizar os módulos de Treinador (RF-01/03/04/09 — core do negócio desportivo) e Portal (RF-20 — ponto de contacto com famílias).

---

### 5.2 🟡 Ficha de Jogo continua com console.log()

**Severidade:** MÉDIA  
**Ficheiro:** `treinadorService.ts` linha 206  
**Descrição:** A operação `submeterFichaJogo()` retorna `true` após um `console.log()`. 

**Impacto:** O fluxo principal foi ligado ao backend, mas o último passo (submissão da ficha do jogo) ainda não armazena os dados.

---

### 5.3 🔴 Sem motor de provisão financeira (RF-29)

**Severidade:** CRÍTICA  
**Descrição:** Não existe geração automática de obrigações financeiras (quotas e mensalidades). As obrigações na BD foram inseridas manualmente via seed SQL. Sem este motor, o ciclo financeiro do clube não opera.

---

### 5.4 🔴 Sem segregação Clube vs. SAD (RF-33 / RNF-27)

**Severidade:** ALTA  
**Descrição:** O modelo `ObrigacaoFinanceira` não segrega entidade jurídica (Associação vs. SAD). Todos os pagamentos são tratados como uma entidade única. Isto viola RF-33 (desdobramento de receita) e RNF-27 (segregação societária).

---

### 5.5 🟡 Sem upload de documentos (RNF-16 / RF-21)

**Severidade:** ALTA  
**Descrição:** Nenhum endpoint aceita upload de ficheiros (EMD, CC, documentos civis). Sem isto, o Portal não pode submeter documentos e a Secretaria não pode validar.

---

### 5.6 🟡 Sem geração de PDF (RF-05, RF-38)

**Severidade:** ALTA  
**Descrição:** Não existe geração de PDFs (convocatórias, faturas-recibo). Isto é obrigatório para RF-05 (PDF de convocatória) e RF-38 (fatura-recibo).

---

### 5.7 🟡 Sem gestão de sessões de treino no frontend

**Severidade:** ALTA  
**Descrição:** A entidade `SessaoTreino` já existe no backend, mas o planeamento de treinos recorrentes (RF-28) ainda não está ligado ao frontend. Os eventos mostrados ao treinador são arrays hardcoded.

---

### 5.8 🟡 Audit Trail incompleto

**Severidade:** MÉDIA  
**Descrição:** O modelo `AuditLog` e repositório existem, mas:
- Não há interceptor automático a registar eventos
- Não há controller para consulta
- Não há UI de auditoria (nem para Admin nem para CEO)
- RF-24 exige append-only com imutabilidade — sem enforcement

---

## 6. IMPLEMENTAÇÕES POSITIVAS

### 6.1 ✅ Autenticação JWT funcional e end-to-end

Login → JWT → token no header → intercetado por `JwtAuthenticationFilter` → roles verificados por `@PreAuthorize`. Toda a cadeia funciona do frontend ao backend.

### 6.2 ✅ CRUD completo de Secretaria ligado ao backend real

Atletas, Encarregados, Equipas — CRUD completo com Axios real, pesquisa paginada, e situação financeira. É o módulo mais maduro do sistema.

### 6.3 ✅ Clínica integrada com backend real

Após a recente migração de mocks para Axios, o módulo de Clínica opera com dados reais: criação de ocorrências, fila EMD, histórico do atleta, e deliberação.

### 6.4 ✅ Infraestrutura Docker robusta

`docker-compose.yml` com healthcheck MySQL, `start.ps1` com retry loop de 30 tentativas, PHPMyAdmin funcional na porta 8081. Arranque estável e reprodutível.

### 6.5 ✅ Cobertura de ecrãs excelente

Todos os 10 módulos de frontend têm ecrãs implementados com UI detalhada e atenção ao design. A navegação cobre todos os perfis (RBAC no frontend via roles).

### 6.6 ✅ Modelo de dados bem estruturado

Os modelos JPA no `core` cobrem as entidades principais (Atleta, EE, Equipa, Escalão, Modalidade, Ocorrência, Obrigação Financeira) com enums para estados. Base sólida para expansão.

### 6.7 ✅ Dados de demonstração realistas

O ficheiro `V5__seed_demo.sql` popula a BD com dados verosímeis do Boavista FC (atletas, equipas, escalões, modalidades, ocorrências clínicas, obrigações financeiras).

### 6.8 ✅ Padrão de serviço frontend consistente

Todos os services (`*Service.ts`) seguem o mesmo padrão: instância Axios com interceptor JWT, tipagem TypeScript, e baseURL centralizada. Migrar de mock para real é mecanicamente simples.

---

## 7. SÍNTESE EXECUTIVA

| Dimensão | Score | Detalhe |
|---|---|---|
| **Backend (Secretaria)** | ⭐⭐⭐⭐ | CRUD completo, paginação, pagamentos |
| **Backend (Clínica)** | ⭐⭐⭐ | Ocorrências e deliberação funcionais |
| **Backend (Auth/Admin)** | ⭐⭐⭐ | JWT + RBAC + CRUD utilizadores |
| **Backend (Treinador)** | ⭐⭐⭐ | Sessões e Eventos funcionais |
| **Backend (CEO/CFO/Portal/DT)** | ⭐ | Inexistente |
| **Frontend (Todos os módulos)** | ⭐⭐⭐⭐ | UI completa para todos os perfis |
| **Integração Backend↔Frontend** | ⭐⭐⭐ | 4 de 10 módulos ligados (Treinador migrado) |
| **Cobertura de RFs** | ⭐⭐ | 5/42 completos (11,9%) |
| **Conformidade RNFs** | ⭐⭐ | 4/27 conformes (14,8%) |
| **Infraestrutura** | ⭐⭐⭐⭐ | Docker, CI, scripts robustos |

> [!IMPORTANT]
> **Veredicto:** O sistema tem uma base sólida de frontend (UI completa), uma infraestrutura de deploy estável, e 4 módulos de backend funcionais (Secretaria, Clínica, Auth/Admin, Treinador).
> O caminho crítico para a demo passa por:
> 1. Ligar frontend do Treinador aos novos endpoints do backend (migrar `treinadorService.ts`).
> 2. Criar backend para Portal (RF-20)
> 3. Implementar geração de PDF (RF-05, RF-38)
> 4. Implementar motor de provisão financeira (RF-29)
