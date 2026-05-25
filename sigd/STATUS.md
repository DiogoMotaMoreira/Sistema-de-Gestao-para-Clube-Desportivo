# Estado do Projeto (SIGD)

## Infraestrutura & Setup
- **Scripts Utilitários:** O `start.ps1` gere o arranque de forma resiliente: inicializa com `docker compose down` e mata processos zumbis nas portas `8080` (Backend) e `8082` (Frontend). Implementa um *Health Check* assíncrono rigoroso (`docker inspect`) que aguarda até 150 segundos (30 tentativas * 5s) antes de abortar caso o MySQL falhe a inicializar, eliminando *sleeps* estáticos bloqueantes. O porto do Docker Desktop na `8081` (usado pelo PHPMyAdmin) é estritamente poupado a rescisões para proteger a integridade do motor local.
- **Health Checks (Docker):** O contentor MySQL assegura estabilidade através do `mysql ... SELECT 1` iterativo (`interval: 5s`), blindando a aplicação contra a janela de "falso healthy" do Docker.

## Módulo Admin
- **Funcional:** Estrutura base de UI (Gestão de Acessos). Validações de Formulários de Criação. Componente `<Select>` e `<Checkbox>`. Endpoints REST do Backend (Spring Boot) desenvolvidos: listar, criar, bloquear, reativar utilizadores com validação anti-bloqueio próprio. Dados de testes em base de dados inicializados via *Flyway Seed V4* (`cfo`, `diretor`, `ee`, `atleta`). O `adminService.ts` no frontend está ligado à API real via Axios com autenticação JWT. Listagem, paginação, pesquisa com debounce e submissões assíncronas ativas.
- **Com Mocks:** O endpoint de Audit Log `/api/v1/admin/audit-log` está a retornar Page.empty() (Mock) no backend e o frontend usa array fixo para `getAuditoria`, `getNotificacoesFalhadas` e `getLocaisTreino`. Teste de Modais (UI usa o primeiro utilizador da página).
- **Quebrado ou Incompleto:** A aba de Configurações Globais (Gateway de Comunicações e Locais de Treino) não tem formulários completos nem lógica ligada desenvolvida.
- **Endpoints backend em falta:** Endpoints de Audit Log reais, Endpoints para Parâmetros Globais, SMTP Gateway e Locais de Treino.

## Módulo CEO (Visão Executiva)
- **Funcional:** Navegação e estrutura de ecrãs.
- **Com Mocks:** Totalmente dependente do `ceoService.ts` com promessas simuladas (Mocks) para gráficos de taxa de ocupação, performance global, KPIs financeiros macro e vitórias.
- **Quebrado ou Incompleto:** Não possui lógica de filtragem temporal real associada ao backend.
- **Endpoints backend em falta:** Todos os endpoints analíticos de Data Warehouse (`/api/v1/ceo/*`).

## Módulo CFO (Direção Executiva)
- **Funcional:** Páginas base com estrutura de relatórios.
- **Com Mocks:** O `cfoService.ts` simula listagens de receitas, despesas, centros de custo e fluxo de caixa.
- **Quebrado ou Incompleto:** Exportação CSV e drill-down de categorias não estão funcionais.
- **Endpoints backend em falta:** API para extração detalhada e agregação de dados de tesouraria (`/api/v1/cfo/*`).

## Módulo Secretaria
- **Funcional:** Criação e Edição de Atletas e Equipas via UI (Validações estritas de dados civis, NIF, Dropdowns preenchidos com chamadas reais a `getEncarregados()` e `getEquipas()`).
- **Com Mocks:** Alguns dados residuais estatísticos no ecrã de Dashboard da Secretaria podem ainda recorrer a Mocks locais.
- **Quebrado ou Incompleto:** N/A.
- **Endpoints backend em falta:** Pagamentos manuais ao balcão, Gestão documental civil avançada.

## Módulo Clínica (Departamento Médico)
- **Funcional:** Navegação base (Fila EMD, Lesões, Ocorrências). O `clinicaService.ts` foi refatorizado e encontra-se agora totalmente ligado aos endpoints reais `/api/v1/clinica/*` através de Axios (com injeção automática de tokens JWT), substituindo por completo os Mocks locais. As funcionalidades críticas como criar ocorrências, listar fila de EMD e submeter deliberações comunicam ativamente com a base de dados. Dados reais em BD injetados via *Flyway Seed V5* (ocorrências de Lesão, Doença e Trauma associadas aos atletas ativos).
- **Com Mocks:** N/A (A migração de dados locais para transações REST está completa nas flows base).
- **Quebrado ou Incompleto:** Pode faltar a injeção em tempo real (via Websockets) caso a fila EMD requeira submissão reativa multi-ecrã.
- **Endpoints backend em falta:** Avaliações de prontidão preditiva ou relatórios/Boletins Clínicos agregados de longo termo.

## Módulo Treinador
- **Funcional:** Funcionalidades ligadas à API (`getEquipas()`, `getPlantel()`). As ações de listagem e criação de Eventos/Sessões de treino, bem como transações vitais (`submeterChamada`, `submeterAvaliacao`, `guardarConvocatoria`) estão agora conectadas via Axios aos novos endpoints (`/api/v1/treinador/*`). O Treinador consome e produz dados reais, abandonando a dependência de Mocks locais para os fluxos principais. Adicionalmente, as listagens agregam agora com sucesso Sessões e Eventos via paralelismo de promessas, com as devidas permissões transversais (RBAC) ajustadas para Treinador e Direção Técnica.
- **Com Mocks:** Ficha de Jogo/Relatório Oficial de jogo continua a usar Mock (`console.log`), tal como os Microciclos.
- **Quebrado ou Incompleto:** O componente de Drag & Drop para quadros táticos ou planeamento em calendário requer ajustes de performance.
- **Endpoints backend em falta:** Quadros Táticos, Relatórios Oficiais de Jogo e Microciclos.

## Módulo Portal (Encarregado de Educação / Atleta)
- **Funcional:** Terminar Sessão (Logout via `authStore`), visualização do Resumo Financeiro e Listagem de Obrigações (chamadas à API real `/api/v1/tesouraria/ee/...`), KPIs e cópia de NIB/Ref. Dados de demonstração inicializados e injetados com êxito na BD via *Flyway Seed V5* (Quotas, Mensalidades com estatutos de Pago/Pendente/Atraso).
- **Com Mocks:** Lógica residual em algumas queries pontuais. Notificações/Alertas estáticos.
- **Quebrado ou Incompleto:** O clube não aceita pagamentos remotos por app, então falta a clarificação se existirá integração SIBS futura.
- **Endpoints backend em falta:** Download de faturas reais/PDFs, Websockets/SSE para push notifications.

## Módulo Diretor Desportivo (DT)
- **Funcional:** Obtenção de plantéis globais e equipas em vigor usando API real (`/api/v1/tesouraria/equipas` e `atletas`).
- **Com Mocks:** Análises de performance por escalão e relatórios de observação. Avaliação de Treinadores está simulada.
- **Quebrado ou Incompleto:** Dashboard transversal ainda com componentes fixos.
- **Endpoints backend em falta:** Aprovação de planeamentos táticos, Transferências internas entre escalões, Analytics Desportivos (`/api/v1/direcao-tecnica/*`).
