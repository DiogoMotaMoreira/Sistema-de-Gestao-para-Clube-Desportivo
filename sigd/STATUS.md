# Estado do Projeto (SIGD)

## Infraestrutura & Setup
- **Scripts Utilitários:** O `start.ps1` gere o arranque de forma resiliente: inicializa com `docker compose down` e mata processos zumbis nas portas `8080` (Backend) e `8082` (Frontend). Implementa um *Health Check* assíncrono rigoroso (`docker inspect`) que aguarda até 150 segundos (30 tentativas * 5s) antes de abortar caso o MySQL falhe a inicializar, eliminando *sleeps* estáticos bloqueantes. O porto do Docker Desktop na `8081` (usado pelo PHPMyAdmin) é estritamente poupado a rescisões para proteger a integridade do motor local.
- **Health Checks (Docker):** O contentor MySQL assegura estabilidade através do `mysql ... SELECT 1` iterativo (`interval: 5s`), blindando a aplicação contra a janela de "falso healthy" do Docker.

## Módulo Auth & Admin
- **Funcional:** Login seguro (BCrypt/JWT), Bloqueio de Força Bruta em Memória (RNF-07), Gestão central de Utilizadores, Validação de Complexidade de Passwords no frontend e backend (RNF-06), e Gestão de Épocas Desportivas (criação e ativação integradas com API).
- **Em Falta:** Reset de password via e-mail e integração SSO.

## Auditoria Global (RF-24)
- **Funcional:** Interceptor Automático (`AuditInterceptor`) implementado, que guarda metadados (ator, IP, entidade, ação) de todos os requests POST/PUT/DELETE em `audit_log`.

## Notas de Implementação Adicionais REST do Backend (Spring Boot) desenvolvidos: listar, criar, bloquear, reativar utilizadores com validação anti-bloqueio próprio. Dados de testes em base de dados inicializados via *Flyway Seed V4* (`cfo`, `diretor`, `ee`, `atleta`). O `adminService.ts` no frontend está ligado à API real via Axios com autenticação JWT. Listagem, paginação, pesquisa com debounce e submissões assíncronas ativas.
- **Com Mocks:** O endpoint de Audit Log `/api/v1/admin/audit-log` está a retornar Page.empty() (Mock) no backend e o frontend usa array fixo para `getAuditoria`, `getNotificacoesFalhadas` e `getLocaisTreino`. Teste de Modais (UI usa o primeiro utilizador da página).
- **Quebrado ou Incompleto:** A aba de Configurações Globais (Gateway de Comunicações e Locais de Treino) não tem formulários completos nem lógica ligada desenvolvida.
- **Endpoints backend em falta:** Endpoints de Audit Log reais, Endpoints para Parâmetros Globais, SMTP Gateway e Locais de Treino.
- **Segurança:** Lockout por brute force implementado (RNF-07) limitando contas por 15 min após 5 falhas no login.

## Módulo CEO (Visão Executiva)
- **Funcional:** Navegação e estrutura de ecrãs.
- **Com Mocks:** Totalmente dependente do `ceoService.ts` com promessas simuladas (Mocks) para gráficos de taxa de ocupação, performance global, KPIs financeiros macro e vitórias.
- **Treinador:** RF-15 (Bloqueio sistémico por EMD caducado) e lógica de semáforo de prontidão (RF-16) totalmente operacional no backend e mobile.
- **CEO Dashboard:** KPI Engine implementado com sucesso via `GET /api/v1/ceo/kpis`. Dashboard executivo exibe dados operacionais reais em tempo real em vez de mocks.

## O Que Falta Fazer (Next Steps)
- **Endpoints backend em falta:** Todos os endpoints analíticos de Data Warehouse (`/api/v1/ceo/*`).

## Módulo CFO (Direção Executiva)
- **Funcional:** Dashboard CFO implementado (`GET /api/v1/cfo/resumo-financeiro`) exibindo KPIs reais segregados por entidade jurídica (Clube vs. SAD). Listagem de obrigações conectada (`GET /api/v1/cfo/obrigacoes`).
- **Com Mocks:** Gráficos detalhados, fluxos de caixa e auditoria no `cfoService.ts`.
- **Quebrado ou Incompleto:** Exportação CSV e drill-down de categorias não estão funcionais.
- **Endpoints backend em falta:** API para extração de fluxo de caixa granular (`/api/v1/cfo/fluxos`).

## Módulo Secretaria
- **Funcional:** Criação e Edição de Atletas e Equipas via UI (Validações estritas de dados civis, NIF, Dropdowns preenchidos com chamadas reais a `getEncarregados()` e `getEquipas()`).
- **Com Mocks:** Alguns dados residuais estatísticos no ecrã de Dashboard da Secretaria podem ainda recorrer a Mocks locais.
- **Quebrado ou Incompleto:** N/A.
- **Endpoints backend em falta:** Pagamentos manuais ao balcão, Gestão documental civil avançada.
- **Motor de Provisão (RF-29):** Implementado endpoint (`POST /api/v1/tesouraria/provisoes/gerar`) no `ProvisaoService` para geração em lote de Mensalidades (SAD) e Quotas Anuais (CLUBE) respeitando descontos de Sócio vs. Base.

## Módulo Clínica (Departamento Médico)
- **Funcional:** Navegação base (Fila EMD, Lesões, Ocorrências). O `clinicaService.ts` foi refatorizado e encontra-se agora totalmente ligado aos endpoints reais `/api/v1/clinica/*` através de Axios (com injeção automática de tokens JWT), substituindo por completo os Mocks locais. As funcionalidades críticas como criar ocorrências, listar fila de EMD e submeter deliberações comunicam ativamente com a base de dados. Dados reais em BD injetados via *Flyway Seed V5* (ocorrências de Lesão, Doença e Trauma associadas aos atletas ativos). O Dashboard de Monitorização (MonitorizacaoScreen) reflete ocorrências ativas e reavaliações agendadas, tudo proveniente da API. A Fila de EMDs (FilaEMDsScreen) processa aprovações/reprovações alimentando o histórico real de prontidão do atleta.
- **Com Mocks:** N/A (A migração de dados locais para transações REST está completa nas flows base).
- **Quebrado ou Incompleto:** Pode faltar a injeção em tempo real (via Websockets) caso a fila EMD requeira submissão reativa multi-ecrã.
- **Endpoints backend em falta:** Avaliações de prontidão preditiva ou relatórios/Boletins Clínicos agregados de longo termo.

## Módulo Treinador
- **Funcional:** Semáforo Clínico (RF-16) funcional e conectado à BD real. Eventos, Sessões, e Convocatórias comunicam 100% com a API. O bloqueio visual de presença no ChamadaScreen reflete corretamente o estado de saúde (Bloqueando "Baixa Médica" e "EMD em Falta").
- **Com Mocks:** Ficha de Jogo continua a usar Mock. Microciclos não implementados.
- **Quebrado ou Incompleto:** N/A.
- **Endpoints backend em falta:** Quadros Táticos e Microciclos.
- **Exportação de PDF (RF-05):** Geração dinâmica de PDF para Convocatórias via iText implementada e ligada no frontend no `DetalheJogoScreen`.

## Módulo Portal (Encarregado de Educação / Atleta)
- **Funcional:** Terminar Sessão, visualização do Resumo Financeiro, Listagem de Obrigações, KPIs e cópia de NIB/Ref. Cartão Digital com estado real e exibição do N.º de Sócio e Prontidão/Elegibilidade (RF-39 Parcial) integrados via `GET /api/v1/portal/me`.
- **Com Mocks:** Lógica residual em algumas queries pontuais. Notificações/Alertas estáticos. QR code ainda atua como placeholder visual.
- **Quebrado ou Incompleto:** O clube não aceita pagamentos remotos por app.
- **Endpoints backend em falta:** Download de faturas reais/PDFs, Websockets/SSE para push notifications.

## Módulo Diretor Desportivo (DT)
- **Funcional:** Obtenção de plantéis globais e equipas em vigor usando API real (`/api/v1/tesouraria/equipas` e `atletas`).
- **Com Mocks:** Análises de performance por escalão e relatórios de observação. Avaliação de Treinadores está simulada.
- **Quebrado ou Incompleto:** Dashboard transversal ainda com componentes fixos.
- **Endpoints backend em falta:** Aprovação de planeamentos táticos, Transferências internas entre escalões, Analytics Desportivos (`/api/v1/direcao-tecnica/*`).
