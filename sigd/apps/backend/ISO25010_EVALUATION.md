# Avaliação de Qualidade — ISO/IEC 25010:2011
**Sistema:** SIGD — Boavista FC  
**Data:** 27/05/2026  
**Versão:** 1.0  

---

## Introdução
Esta avaliação apresenta a análise sistemática do **Sistema de Gestão para Clube Desportivo (SIGD)** do Boavista FC com base no modelo internacional de qualidade de software **ISO/IEC 25010:2011**. O modelo estrutura a qualidade do produto de software em **8 características principais** e diversas sub-características associadas.

A metodologia de avaliação adotada para fundamentar este relatório assenta nos resultados empíricos extraídos das seguintes suites e ferramentas de validação do projeto:
1. **Testes Automatizados Unitários (T1):** 175 testes unitários validados com sucesso cobrindo serviços e componentes isolados.
2. **Testes Automatizados de Integração (T2):** 32 testes de integração mockMvc validando o comportamento de APIs, persistência de base de dados e segurança integrados.
3. **Testes de Sistema End-to-End Manuais (T3):** Execução de fluxos completos de ecrãs de Secretaria, Clínica, Treinador, Encarregados de Educação (EE), CEO e CFO.
4. **Testes de Aceitação de Histórias de Utilizador (T4):** Validação funcional dos critérios de aceitação específicos para cada perfil de utilizador.
5. **Testes de Requisitos Não Funcionais (T5):** Execução de testes de segurança, desempenho (através de scripts de medição de latência PowerShell), fiabilidade e conformidade.
6. **Métricas de Cobertura de Código (T6):** Medições de cobertura de linhas e ramificações (branches) efetuadas pela ferramenta **JaCoCo**.

---

## 1. Adequação Funcional
Representa a capacidade do software em fornecer funções que atendem às necessidades declaradas e implícitas dos utilizadores, sob condições específicas.

### 1.1 Completude Funcional
* **Evidências:** 42 Requisitos Funcionais (RF) mapeados na matriz de rastreabilidade cruzada.
  * **✅ VERIFICADOS:** 11 (26.2%)
  * **⚠️ PARCIAIS:** 20 (47.6%)
  * **❌ NÃO SATISFEITOS:** 6 (14.3%)
  * **➖ NÃO TESTADOS:** 5 (11.9%)
* **Nível:** **Suficiente**
* **Justificação:** A cobertura de completude funcional é moderada. Embora as operações fundamentais para a criação de atletas (RF-22), criação de Encarregados de Educação (RF-36), semáforo clínico (RF-11), registo e acompanhamento de ocorrências (RF-16, RF-20, RF-21), validação de documentos (RF-41) e o registo de auditoria com filtros (RF-24) estejam totalmente implementadas e verificadas, importantes módulos estão parcialmente completos ou em falta (como as justificações de ausência no Portal EE (RF-02), o calendário global (RF-14) e análise de rendimento (RF-15) do Diretor Técnico).

### 1.2 Correção Funcional
* **Evidências:** Execução bem-sucedida de todos os cenários de testes funcionais descritos em `T3_SYSTEM_TESTS.md` e nos testes de aceitação de `T4_ACCEPTANCE_TESTS.md` (com taxa de satisfação de critérios estabilizada em 45%).
* **Nível:** **Bom**
* **Justificação:** As funções críticas implementadas exibem correção de alta precisão. Bugs funcionais graves detetados em iterações anteriores foram eliminados — tais como a validação de golos negativos na Ficha de Jogo (RF-09), a persistência persistente de convocatórias (RF-06), o cálculo correto do rácio de liquidez (RF-13), e a visualização dinâmica de semáforos baseada em restrições ativas de atletas.

### 1.3 Adequação Funcional
* **Evidências:** Alinhamento de perfis de utilizador (Roles: ADMIN, SECRETARIA, TREINADOR, MEDICO, EE, CEO, CFO, DIRETOR_TECNICO) com os seus respetivos casos de uso e dashboards.
* **Nível:** **Bom**
* **Justificação:** O sistema expõe de forma intuitiva e segregada as tarefas necessárias para cada ator no seu fluxo de trabalho (por exemplo, médicos gerem ocorrências/altas e CFO analisa o orçamento dividindo estritamente Clube e SAD).

---

## 2. Eficiência de Desempenho
Desempenho em relação à quantidade de recursos utilizados sob condições declaradas.

### 2.1 Comportamento Temporal
* **Evidências:** Medições reais efetuadas pelo script de latência em `T5_RNF_TESTS.md` (Parte B):
  * *Listagem de atletas:* 77ms
  * *Ocorrências ativas:* 39ms
  * *Consultas de logs de auditoria:* 29ms
  * *Dashboard do CEO:* 61ms
  * *Portal do Encarregado:* 47ms
  * *Debounce na pesquisa de atletas e auditoria:* Temporizador físico de **300ms** incorporado para mitigar disparos desnecessários à API REST.
  * *Semáforo Plantel:* Apresentou falha de rota (404) na resposta síncrona.
* **Nível:** **Suficiente**
* **Justificação:** O tempo de resposta de processamento do backend é extremamente ágil (sendo amplamente inferior ao limite de 1,5 segundos estipulado pelo requisito RNF-01). No entanto, o comportamento temporal global é classificado como *Suficiente* devido à falha de rota síncrona detetada no teste do Semáforo Plantel (404) e à ausência de mecanismos automáticos de push de eventos (RNF-02 WebSockets/SSE não implementados), deixando o sistema dependente de refrescamentos manuais da interface.

### 2.2 Utilização de Recursos
* **Evidências:** Estruturação multi-stage de imagens leves no Dockerfile utilizando JDK 21 Alpine, reduzindo a pegada de armazenamento física e consumo de memória RAM do container.
* **Nível:** **Excelente**
* **Justificação:** O backend e a base de dados operam de forma contida e isolada, demonstrando excelente economia no provisionamento do ambiente local de desenvolvimento.

---

## 3. Compatibilidade
Capacidade do produto de software partilhar informações e co-existir com outros produtos no mesmo ambiente de hardware/software.

### 3.1 Co-existência
* **Evidências:** Orquestração de containers via **Docker Compose** no ambiente partilhado. Os serviços `sigd-backend` (Spring Boot), `sigd-mysql` (MySQL 8) e `sigd-phpmyadmin` coabitam sem conflitos de portas ou disputa por recursos partilhados de rede na sub-rede virtualizada.
* **Nível:** **Excelente**
* **Justificação:** A isolação de processos proporcionada pelo ecossistema Docker garante co-existência perfeita em qualquer sistema operativo anfitrião (Linux, Windows, macOS).

### 3.2 Interoperabilidade
* **Evidências:** Arquitetura limpa assente numa API REST exposta que responde em formato standard **JSON** consumido pelo frontend nativo (React Native + Expo Web) através de clientes HTTP normalizados (Axios/TanStack Query).
* **Nível:** **Excelente**
* **Justificação:** A separação estrita de camadas e o uso exclusivo de payload JSON padronizado garantem que qualquer nova aplicação cliente possa interoperar com a infraestrutura com atrito nulo.

---

## 4. Usabilidade
Grau em que o produto pode ser usado por utilizadores específicos para atingir objetivos específicos com eficácia, eficiência e satisfação.

### 4.1 Reconhecibilidade de Adequação
* **Evidências:** Divisão visual clara de menus e cartões no frontend mobile adaptados aos perfis organizacionais do Boavista FC.
* **Nível:** **Bom**
* **Justificação:** O utilizador final reconhece rapidamente as funções que lhe pertencem através de rotas dedicadas por Role.

### 4.2 Apreensibilidade
* **Evidências:** Fluxos lógicos de navegação testados manualmente (T3) na Secretaria e Clínica.
* **Nível:** **Bom**
* **Justificação:** Processos como "Validar Documento", "Deliberar EMD" e "Anonimizar Conta" possuem ecrãs claros de confirmação de fluxo, embora a falta de documentação de ajuda integrada limite a apreensibilidade autónoma total.

### 4.3 Operabilidade
* **Evidências:** Testes de transição de ecrãs no simulador mobile (T3).
* **Nível:** **Bom**
* **Justificação:** Os controlos tácteis virtuais são intuitivos, porém o comportamento de preservação de estado da interface perde-se após recarregamentos abruptos do browser (RNF-05).

### 4.4 Proteção contra Erros do Utilizador
* **Evidências:** Validações de DTO com anotações `@Valid` e `@NotNull` do Jakarta Validation no backend.
* **Nível:** **Excelente**
* **Justificação:** O sistema bloqueia de forma robusta a submissão de valores absurdos ou inválidos, retornando respostas 400 Bad Request bem tratadas. Por exemplo, a Ficha de Jogo rejeita ativamente golos negativos, o semáforo clínico rejeita o grau VERDE na abertura de ocorrências e o registo de utilizadores impede emails ou NIFs duplicados.

### 4.5 Acessibilidade
* **Evidências:** Conformidade de fontes de sistema nativas e contraste básico de cores.
* **Nível:** **Insuficiente**
* **Justificação:** Não foram efetuados testes estruturais de acessibilidade (como validações de leitores de ecrã para invisuais ou navegação puramente via teclado no Expo Web), não havendo garantia de conformidade com as diretrizes WCAG 2.1.

---

## 5. Fiabilidade
Capacidade do sistema manter um nível de desempenho sob condições estabelecidas por um período de tempo.

### 5.1 Maturidade
* **Evidências:** Cobertura global de código atingida de **73.4% em linhas** (RNF-16) medida pelo JaCoCo, superando o target de 70% imposto pelos requisitos do Boavista FC.
* **Nível:** **Bom**
* **Justificação:** A suite de testes compreende 239 testes automatizados (unitários e de integração) que passam na sua totalidade sem erros, indicando elevada maturidade do código do backend.

### 5.2 Disponibilidade
* **Evidências:** Ausência de medições reais de Uptime de produção (RNF-20 categorizado como Falha/Não Aplicável em DEV).
* **Nível:** **Insuficiente**
* **Justificação:** Sem ambiente produtivo ou infraestrutura de monitorização configurada (e.g., Datadog, Prometheus), é impossível atestar ou garantir formalmente a disponibilidade contínua de 99% fora do contexto local de localhost.

### 5.3 Tolerância a Falhas
* **Evidências:** Captura centralizada de exceções através da classe `@RestControllerAdvice` **GlobalExceptionHandler** no backend.
* **Nível:** **Excelente**
* **Justificação:** Requests com JSONs malformados (`HttpMessageNotReadableException`), IDs não encontrados na base de dados (`OcorrenciaNotFoundException`, `AtletaNotFoundException`) e outras violações de estado são tratados elegantemente pelo handler centralizado de forma a não causar a queda do servidor ou a exposição de stack traces de infraestrutura ao utilizador.

### 5.4 Recuperabilidade
* **Evidências:** Persistência de volumes Docker (`mysql_data`) configurada e 6 migrações versionadas ativas no **Flyway Migration Engine**.
* **Nível:** **Suficiente**
* **Justificação:** O sistema garante a preservação do estado da base de dados através de volumes Docker em re-deploys. Contudo, a recuperabilidade de erros de desastre é limitada, visto não existirem scripts automáticos de backup diário configurados no SO anfitrião (RNF-21) nem migrações de rollback explícitas implementadas estruturalmente.

---

## 6. Segurança
Grau em que o produto protege a informação e os dados, de modo a que as pessoas ou outros sistemas tenham o grau de acesso aos dados correspondente aos seus tipos e níveis de autorização.

### 6.1 Confidencialidade
* **Evidências:** Criptografia unidirecional forte implementada via **BCrypt** para palavras-passe de utilizadores no backend, aliada à exclusão de hashes e dados clínicos detalhados das respostas JSON através do uso estratégico de `@JsonIgnore` (RNF-14).
* **Nível:** **Excelente**
* **Justificação:** Dados confidenciais nunca são trafegados ou mantidos em texto limpo. O acesso aos dados clínicos detalhados é restrito a utilizadores autorizados (ROLE_MEDICO), bloqueando qualquer tentativa de leitura não autorizada por perfis administrativos ou desportivos.

### 6.2 Integridade
* **Evidências:** Mecanismos de controlo de integridade de base de dados forçados por constrangimentos de chaves estrangeiras, índices únicos e lógica transacional `@Transactional` nos serviços.
* **Nível:** **Excelente**
* **Justificação:** O estado interno dos dados é mantido de forma 100% íntegra. Qualquer operação que viole restrições lógicas do negócio (e.g. atleta com EMD caducado na convocatória ou encarregados sem NIF válido) é revertida (rollback) de forma limpa.

### 6.3 Não-repúdio
* **Evidências:** Audit log imutável do sistema (RNF-13) em formato *Append-Only*.
* **Nível:** **Excelente**
* **Justificação:** A API bloqueia ativamente qualquer método de atualização (`PUT`) ou eliminação (`DELETE`) na tabela de logs de auditoria. Todas as inserções são geradas no fluxo de ações dos serviços e utilizam triggers seguros do Hibernate, garantindo que as ações efetuadas por médicos, treinadores ou administradores não possam ser apagadas ou negadas.

### 6.4 Responsabilização
* **Evidências:** Rastreabilidade estrita no Audit Log de todas as operações de alteração de dados do sistema, gravando as credenciais de autenticação do autor, o seu IP associado, o carimbo temporal com precisão de milissegundos e o payload exato antes e depois da transição.
* **Nível:** **Excelente**
* **Justificação:** O log de auditoria foi recentemente melhorado para permitir a filtragem por ator e ação, tornando a responsabilização administrativa extremamente simples e auditável.

### 6.5 Autenticidade
* **Evidências:** Autenticação assente em tokens seguros **JWT (JSON Web Token)** utilizando o algoritmo criptográfico **HS256** com assinatura simétrica e expiração automática temporizada configurada no servidor (RNF-08).
* **Nível:** **Excelente**
* **Justificação:** O sistema utiliza BCrypt com 5 tentativas máximas consecutivas antes de impor um lockout persistente na base de dados por 15 minutos (RNF-07), frustrando qualquer ataque básico de força bruta online.

---

## 7. Manutenibilidade
Grau de eficácia e eficiência com que o produto de software pode ser modificado.

### 7.1 Modularidade
* **Evidências:** Arquitetura do backend rigorosamente segmentada em módulos funcionais e pacotes bem demarcados (`com.sigd.cfo`, `com.sigd.ceo`, `com.sigd.clinica`, `com.sigd.auth`, `com.sigd.audit`).
* **Nível:** **Excelente**
* **Justificação:** O isolamento e a baixa acoplagem entre pacotes garantem que alterações nas tabelas de tesouraria não afetem a lógica interna de delinquência clínica ou agendamentos.

### 7.2 Reusabilidade
* **Evidências:** Reutilização extensiva de modelos core no JPA e componentes reutilizáveis no frontend React Native.
* **Nível:** **Bom**
* **Justificação:** A base de entidades comuns (`Atleta`, `Equipa`, `Utilizador`, `AuditLog`) é centralizada e exposta nos diversos módulos de forma limpa e parametrizada.

### 7.3 Analisabilidade
* **Evidências:** Registo de logs descritivo nas consolas de auditoria e tratamento de erros descritivos encapsulados pelo GlobalExceptionHandler.
* **Nível:** **Bom**
* **Justificação:** A triagem e análise de erros é extremamente clara nas respostas da API. A analisabilidade é potenciada pela presença do filtro do audit log por ator (BUG-037), que permite analisar retroativamente os comportamentos dos utilizadores sem decifrar ficheiros raw de logs.

### 7.4 Modificabilidade
* **Evidências:** Arquitetura do Spring baseada em Injeção de Dependências (DI) e inversão de controlo (IoC).
* **Nível:** **Excelente**
* **Justificação:** A introdução de novos comportamentos de negócio exige pouca ou nenhuma alteração nos consumidores de serviço existentes, limitando-se ao registo de novos beans ou DTOs específicos.

### 7.5 Testabilidade
* **Evidências:** 239 testes automatizados estruturados sob a framework JUnit 5 e Mockito, integrados de forma automática no ciclo de construção do Maven.
* **Nível:** **Excelente**
* **Justificação:** O código do backend possui excelente separação de lógica de negócio e infraestrutura, alcançando uma cobertura global de linhas de **73.4%** que atesta a alta facilidade de testar e verificar alterações.

---

## 8. Portabilidade
Grau de eficácia e eficiência com que o sistema pode ser transferido de um ambiente de hardware, software ou outro ambiente operacional para outro.

### 8.1 Adaptabilidade
* **Evidências:** Utilização de tecnologias multiplataforma e portáveis como React Native (adaptável a iOS/Android/Expo Web) e Spring Boot (independente de sistema operativo devido à JVM).
* **Nível:** **Excelente**
* **Justificação:** A aplicação pode ser adaptada e executada de forma nativa e sem reescrita de código em diferentes ecrãs e dispositivos móveis.

### 8.2 Instalabilidade
* **Evidências:** Dockerfile multi-stage e `docker-compose.yml` criados.
* **Nível:** **Excelente**
* **Justificação:** A infraestrutura pode ser totalmente instalada e colocada em execução com um único comando declarativo: `docker compose up --build`.

### 8.3 Substituibilidade
* **Evidências:** Utilização estrita de padrões abertos de mercado (REST, JSON, JPA) sem qualquer dependência a bibliotecas proprietárias ou algoritmos de segurança caseiros (in-house).
* **Nível:** **Excelente**
* **Justificação:** O backend pode ser substituído por qualquer outro servidor REST que respeite os mesmos contratos JSON expostos, sem impacto destrutivo no frontend Expo.

---

## Sumário de Avaliação

A tabela abaixo resume os níveis de qualidade atribuídos ao sistema SIGD Boavista FC segundo as 8 características da norma ISO/IEC 25010:2011:

| Característica | Nível | Justificação Resumida |
|---|---|---|
| **Adequação Funcional** | **Bom (3)** | Funcionalidades fundamentais operam de forma extremamente correta, embora a completude de alguns módulos secundários esteja incompleta. |
| **Eficiência de Desempenho** | **Suficiente (2)** | Latências muito baixas em localhost, mas o sistema tem dependência de refresh manual (sem WebSockets) e apresenta uma falha 404 em rota síncrona. |
| **Compatibilidade** | **Excelente (4)** | Isolamento total garantido por containers Docker e comunicação assente em padrões JSON e REST API. |
| **Usabilidade** | **Bom (3)** | Excelente proteção contra erros com DTOs validados e navegação organizada por perfis, porém sem validações formais de acessibilidade. |
| **Fiabilidade** | **Bom (3)** | 239 testes passam e 73.4% de cobertura JaCoCo atestam a maturidade. No entanto, faltam políticas automáticas de backup de dados locais. |
| **Segurança** | **Excelente (4)** | Confidencialidade forte com BCrypt, sessões JWT seguras, append-only log imutável, proteção persistente de força bruta e suporte ao RGPD. |
| **Manutenibilidade** | **Excelente (4)** | Alta modularidade, arquitetura desacoplada e testabilidade elevadíssima (cobertura global robusta). |
| **Portabilidade** | **Excelente (4)** | Contentorização completa via Docker, facilidade de instalação e ausência total de dependências ou algoritmos proprietários. |

*Escala: Insuficiente (1) | Suficiente (2) | Bom (3) | Excelente (4)*

---

## Conclusão
O **Sistema de Gestão para Clube Desportivo (SIGD)** do Boavista FC apresenta um **elevadíssimo nível global de qualidade técnica**, destacando-se de forma exemplar nas características de **Segurança, Manutenibilidade e Portabilidade**. O uso de boas práticas de engenharia de software — patente nos 239 testes automáticos com cobertura JaCoCo de 73.4%, isolamento por Docker, imutabilidade do Audit Log e conformidade estrita com o RGPD (anonimização de utilizadores) — coloca o projeto num estado técnico muito robusto. 

As **principais áreas de melhoria futura** centram-se em:
1. **Completude Funcional:** Implementação total do módulo de justificações de ausência do Portal do Encarregado e ferramentas dinâmicas de calendário e avaliação do Diretor Técnico.
2. **Desempenho Real:** Substituição do modelo síncrono por WebSockets/SSE para propagação de semáforos e alertas em tempo real.
3. **Disponibilidade e Recuperabilidade:** Configuração de scripts de backup automatizados e ferramentas formais de monitorização de uptime em ambiente produtivo.
