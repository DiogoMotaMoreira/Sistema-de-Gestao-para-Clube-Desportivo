#### [RNF-01] — Latência de Operações Síncronas

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-01] — Latência de Operações Síncronas |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta / Obrigatória |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Todas as operações com feedback imediato ao utilizador (assiduidade, submissão de avaliações, pesquisa) devem completar-se em ≤ 1,5 segundos.
- A métrica deve ser mantida com até 50 utilizadores concorrentes.

**Critérios de Verificação:**

1. Executar teste de carga com 50 sessões ativas simultâneas. O teste PASSA se, e só se, 100% das respostas de escrita da API (TTFB) registarem um tempo de latência ≤ 1,5 segundos.

**Justificação / Dependências:** Garante a fluidez no atendimento presencial e no registo em relvado, evitando a degradação da experiência de uso.

**Fontes de Origem:** Requisito de Engenharia, Inquérito Q6.

---

#### [RNF-02] — Propagação de Alertas em Tempo Real

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-02] — Propagação de Alertas em Tempo Real |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta / Obrigatória |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- Eventos de incumprimento detetados em background devem ser propagados aos dashboards em ≤ 60 segundos sem necessidade de refresh manual da página.

**Critérios de Verificação:**

1. Simular a geração de um evento de incumprimento. O teste PASSA se a notificação assíncrona for propagada e persistida no painel recetor em tempo ≤ 60 segundos após a gravação na base de dados.

**Justificação / Dependências:** Essencial para a monitorização executiva proativa e gestão de exceções em tempo real.

**Fontes de Origem:** US08, US32.

---

#### [RNF-03] — Eficiência na Geração de Documentos e Notificações

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-03] — Eficiência na Geração de Documentos e Notificações |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta / Obrigatória |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- A geração de instâncias PDF (recibos/convocatórias) deve ser concluída em ≤ 30 segundos.
- A entrega ao destinatário final deve ocorrer em ≤ 5 minutos após o enfileiramento.

**Critérios de Verificação:**

1. Acionar a confirmação definitiva de uma convocatória. O teste PASSA se: A) O PDF for gerado e enfileirado em ≤ 30 segundos; e B) A entrega efetiva ao destinatário final ocorrer em ≤ 5 minutos após o enfileiramento.

**Justificação / Dependências:** Evita esperas excessivas no balcão e garante que comunicações desportivas chegam às famílias atempadamente.

**Fontes de Origem:** US07, US16, US23.

---

#### [RNF-04] — Controlo de Sobrecarga de Pesquisa (Debounce)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-04] — Controlo de Sobrecarga de Pesquisa (Debounce) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Média |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O motor de pesquisa deve aplicar um debounce de ≥ 300ms antes de disparar a consulta à API.
- Devem ser evitadas requisições redundantes durante a digitação acelerada.

**Critérios de Verificação:**

1. Inserir rapidamente 5 caracteres no campo de pesquisa. O teste PASSA se a API receber apenas 1 pedido (disparado após a pausa de digitação), rejeitando o disparo contínuo por caractere.

**Justificação / Dependências:** Protege a infraestrutura contra picos de tráfego e reduz o consumo de recursos computacionais.

**Fontes de Origem:** Requisito de Arquitetura.

---

#### [RNF-05] — Responsividade a Eventos de Geometria

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-05] — Responsividade a Eventos de Geometria |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O recálculo da interface após rotação do dispositivo (landscape/portrait) deve ocorrer em ≤ 300 milissegundos.
- O estado da sessão e formulários a meio do preenchimento não devem sofrer perda de dados.

**Critérios de Verificação:**

1. Executar rotação de ecrã e enviar a app para background durante o preenchimento de um formulário longo. O teste PASSA se, ao retornar, 100% dos dados de input se mantiverem em memória e o tempo de "repaint" visual for ≤ 300 milissegundos.

**Justificação / Dependências:** Crucial para o uso dinâmico em tablets e smartphones no relvado pelo corpo técnico.

**Fontes de Origem:** Inquérito Q3.

---

### Segurança

Diretrizes mandatórias para a proteção da integridade, confidencialidade e disponibilidade da informação. Engloba as normas de autenticação, criptografia, controlo de acessos e mitigação de vulnerabilidades sistémicas.

---

#### [RNF-06] — Política de Complexidade de Passwords

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-06] — Política de Complexidade de Passwords |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- As passwords devem ter comprimento mínimo de 8 caracteres, incluindo pelo menos 1 letra maiúscula e 1 dígito.
- O armazenamento deve utilizar funções de hash com salt (BCrypt ou Argon2).
- É proibida a implementação de algoritmos de autenticação próprios (*in-house*).

**Critérios de Verificação:**

1. Submeter payload de registo com a password "senha1234" (8 caracteres, sem maiúscula). O teste PASSA se a API rejeitar a operação com código HTTP 400.
2. Auditar código; o teste PASSA se o armazenamento de passwords utilizar um algoritmo de *hashing* com *salt* (BCrypt ou Argon2), verificável por inspeção das dependências de segurança do sistema.

**Justificação / Dependências:** Proteção contra ataques de dicionário e acessos não autorizados.

**Fontes de Origem:** RF-22, OWASP.

---

#### [RNF-07] — Proteção contra Ataques de Força Bruta (Lockout)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-07] — Proteção contra Ataques de Força Bruta (Lockout) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Após 5 tentativas de autenticação consecutivas falhadas, o sistema deve bloquear o acesso à conta por 15 minutos.
- O evento deve ser registado com prioridade alta no audit trail.

**Critérios de Verificação:**

1. Submeter 5 tentativas de login falhadas consecutivas com o mesmo username. À 6ª tentativa (mesmo que com a password correta), o teste PASSA se a API devolver erro HTTP 403 e o sistema impuser o bloqueio estrito de acesso por 15 minutos.

**Justificação / Dependências:** Mitiga o risco de comprometimento de contas por ferramentas automáticas de brute force.

**Fontes de Origem:** RF-22.

---

#### [RNF-08] — Gestão e Validade de Sessões (JWT)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-08] — Gestão e Validade de Sessões (JWT) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- As sessões devem ser geridas via tokens JWT com algoritmo HS256.
- O token deve ter validade máxima de 8 horas de inatividade.
- A validade dos QR Codes de acesso deve ser de 60 segundos.

**Critérios de Verificação:**

1. Inspecionar a carga do token JWT; o teste PASSA se não contiver dados PII em *plain-text*.
2. Injetar pedido na API com token expirado após 8 horas de inatividade; o teste PASSA se a resposta for taxativamente HTTP 401 (*Unauthorized*).

**Justificação / Dependências:** Garante a integridade da comunicação e segurança do acesso móvel.

**Fontes de Origem:** RF-22, RF-39.

---

#### [RNF-09] — Encriptação de Dados em Trânsito e Repouso

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-09] — Encriptação de Dados em Trânsito e Repouso |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Em ambiente de produção, o sistema deve suportar comunicação encriptada sobre HTTPS/TLS 1.2+.
- Dados PII e clínicos devem ser encriptados na base de dados (ex: AES-256 ou *hashing* criptográfico adequado).

**Critérios de Verificação:**

1. Num cenário de *deployment* em produção, intercetar o tráfego de rede (*Packet Sniffing*). O teste PASSA se a infraestrutura for capaz de forçar o uso de HTTPS/TLS 1.2+ e rejeitar comunicações em plain-text.
2. Aceder diretamente à BD; o teste PASSA se as passwords e dados críticos identificados estiverem devidamente ofuscados/encriptados e ilegíveis.

**Justificação / Dependências:** Cumprimento do RGPD e proteção contra fugas de dados sensíveis.

**Fontes de Origem:** RNF Global, RGPD.

---

#### [RNF-10] — Imutabilidade e Integridade do Audit Trail

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-10] — Imutabilidade e Integridade do Audit Trail |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- A tabela de auditoria deve ser estritamente "append-only".
- Ninguém, incluindo o administrador, pode editar ou apagar registos de auditoria persistidos.

**Critérios de Verificação:**

1. Submeter via script SQL um comando DELETE ou UPDATE diretamente na tabela do Audit Trail. O teste PASSA se o SGBD rejeitar a operação e emitir um erro de restrição de nível de sistema.

**Justificação / Dependências:** Garante a transparência e impede a ocultação de fraudes ou erros clínicos.

**Fontes de Origem:** RF-24.

---

#### [RNF-11] — Isolamento Multientidade via Segregação Lógica de Dados

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-11] — Isolamento Multientidade via Segregação Lógica de Dados |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- O sistema deve aplicar políticas rigorosas de Segregação Lógica de Dados ao nível da camada de aplicação e/ou SGBD.
- O isolamento deve impedir sistemicamente que a Associação Desportiva extraia ou visualize dados financeiros afetos à SAD e vice-versa.

**Critérios de Verificação:**

1. Efetuar um pedido de extração de dados à API financeira utilizando um token de sessão autenticado e restrito à entidade Clube. O teste PASSA se a resposta do servidor retornar estritamente os movimentos da sua entidade e 0 registos pertencentes à entidade SAD.

**Justificação / Dependências:** Exigência legal e contabilística para evitar o cruzamento de capitais.

**Fontes de Origem:** Ata-02.

---

#### [RNF-12] — Proteção contra Injeção e Acesso Direto por URL

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-12] — Proteção contra Injeção e Acesso Direto por URL |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O servidor deve rejeitar pedidos a rotas protegidas feitos via manipulação direta de URL.
- Parâmetros de URL devem ser validados contra esquemas estritos (Sanitization).

**Critérios de Verificação:**

1. Invocar um endpoint administrativo (`/admin/config`) injetando um token de utilizador com perfil "Sócio". O teste PASSA se o *middleware* intercetar o pedido e devolver instantaneamente código HTTP 403 (*Forbidden*), abortando a lógica subjacente.

**Justificação / Dependências:** Previne ataques de bypass de autenticação e manipulação de objetos (IDOR).

**Fontes de Origem:** RF-23.

---

#### [RNF-13] — Filtragem de Payload e Higienização de API

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-13] — Filtragem de Payload e Higienização de API |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- O middleware da API deve remover campos sensíveis do payload de resposta que não correspondam ao perfil do utilizador (ex: ocultar diagnóstico médico para o treinador).

**Critérios de Verificação:**

1. Intercetar a resposta JSON de um endpoint de perfil de atleta usando credenciais de "Treinador". O teste PASSA se os nós referentes a diagnóstico clínico e dados fiscais estiverem estruturalmente ausentes do payload devolvido.

**Justificação / Dependências:** Implementação técnica do princípio de "Need-to-Know" e minimização de dados.

**Fontes de Origem:** RF-40.

---

### Usabilidade

Métricas de ergonomia e acessibilidade que regulam a interface do utilizador (UI) e a experiência de navegação (UX), assegurando a adaptação eficiente do sistema a diferentes dispositivos e contextos físicos de utilização.

---

#### [RNF-14] — Design Responsivo e Suporte de Viewport

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-14] — Design Responsivo e Suporte de Viewport |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- A interface deve apresentar um design responsivo (*Mobile-First*), garantindo usabilidade plena em ecrãs móveis, com suporte base a partir de resoluções de 320px de largura.
- Viewports < 768px aplicam prioridade a layouts fluidos em coluna única com otimização de navegação tátil.
- Viewports ≥ 768px habilitam layouts multi-coluna e otimização para matrizes de dados complexas.

**Critérios de Verificação:**

1. Renderizar a interface de front-office numa *viewport* restrita a 320px de largura (ex: simulador de iPhone SE). O teste PASSA se os elementos estruturais essenciais se adaptarem fluidamente ao ecrã, sem comprometer a legibilidade ou bloquear o acesso às ações de submissão do utilizador.

**Justificação / Dependências:** Essencial para garantir que o sistema é utilizável tanto no telemóvel do treinador como no computador da secretaria.

**Fontes de Origem:** W3C.

---

#### [RNF-15] — Dimensão de Alvos de Interação Tátil (Touch Targets)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-15] — Dimensão de Alvos de Interação Tátil (Touch Targets) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- Em formato móvel, todos os elementos de interação tátil (botões, campos de input) devem ter uma dimensão mínima de 44x44px.
- Deve ser respeitada a conformidade com o critério WCAG 2.1 AA.

**Critérios de Verificação:**

1. Inspecionar a árvore DOM em contexto móvel. O teste PASSA se 100% dos elementos acionáveis (botões e hiperligações) apresentarem uma *bounding box* de renderização com a dimensão mínima de 44x44 pixels (Conformidade WCAG 2.1 AA).

**Justificação / Dependências:** Garante a precisão tátil em ambientes dinâmicos e de utilização rápida no exterior (relvado).

**Fontes de Origem:** WCAG 2.1.

---

#### [RNF-16] — Restrições e Validação de Upload de Documentos

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-16] — Restrições e Validação de Upload de Documentos |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Média |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O sistema deve aceitar exclusivamente ficheiros nos formatos PDF e PNG.
- O tamanho máximo por ficheiro é de 5 MB.
- A validação e rejeição devem ocorrer localmente no cliente antes do envio ao servidor.

**Critérios de Verificação:**

1. Selecionar na interface um ficheiro .ZIP ou um ficheiro PDF com 5,1 MB. O teste PASSA se o validador frontend *client-side* abortar a transação e devolver erro instantâneo, gerando exatamente 0 pedidos de rede (*requests*) ao servidor backend.

**Justificação / Dependências:** Otimiza o tráfego de rede e garante a padronização e legibilidade dos documentos clínicos e civis.

**Fontes de Origem:** RF-20.

---

#### [RNF-17] — Eficiência de Registo de Eventos em Jogo

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-17] — Eficiência de Registo de Eventos em Jogo |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- O registo de cada evento dinâmico de uma partida (substituição, golo, cartão) não deve exigir mais de 5 interações do utilizador (cliques ou toques).

**Critérios de Verificação:**

1. Executar um registo completo de substituição ou golo. O teste PASSA se o evento for submetido e confirmado com sucesso exigindo o máximo estrito de 5 interações táteis (cliques/toques).

**Justificação / Dependências:** Foco na operabilidade sob pressão de tempo e fadiga em contexto de balneário ou relvado.

**Fontes de Origem:** US29, US30.

---

### Fiabilidade

Atributos que determinam o nível de tolerância a falhas do ecossistema tecnológico, os mecanismos de recuperação e as garantias de disponibilidade (*uptime*) da plataforma.

---

#### [RNF-18] — Garantia Transacional ACID para Operações Financeiras

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-18] — Garantia Transacional ACID para Operações Financeiras |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Todas as operações de escrita financeira (liquidação, provisão, desdobramento) devem ser executadas em blocos transacionais ACID.
- Em caso de falha de conectividade ou violação de integridade, o sistema deve executar rollback completo.

**Critérios de Verificação:**

1. Injetar uma falha de rede ou exceção ao nível do código a meio do processamento de um pagamento desdobrado (SAD/Clube). O teste PASSA se o motor SGBD executar *rollback* absoluto, garantindo 0 alterações parciais persistidas nas tabelas afetadas.

**Justificação / Dependências:** Protege a integridade dos saldos e evita discrepâncias contabilísticas entre o Clube e a SAD.

**Fontes de Origem:** Ata-02.

---

#### [RNF-19] — Mecanismo de Tolerância a Falhas de Expedição

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-19] — Mecanismo de Tolerância a Falhas de Expedição |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O sistema deve garantir resiliência operacional face ao gateway de comunicações externo.
- Em caso de anomalia, recusa ou quebra na rede SMTP/Push, o sistema deve isolar o erro sem bloquear a *thread* do utilizador principal.
- O serviço deve intercetar a anomalia e classificar internamente o registo de comunicação com o estado de "Falha Permanente" (ou aplicar políticas de reenvio assíncrono, se suportado), disponibilizando-o para análise no painel administrativo.

**Critérios de Verificação:**

1. Simular uma quebra intencional de ligação ao serviço SMTP de destino. O teste PASSA se a aplicação processar a transação do lado do utilizador sem exibir erro de sistema (bloqueio 500) e persistir o evento com status de falha na base de dados para posterior auditoria/recuperação.

**Justificação / Dependências:** Garante que a indisponibilidade momentânea de serviços de email não paralisa a operação base da secretaria e permite rastrear mensagens não entregues.

**Fontes de Origem:** RF-25.

---

#### [RNF-20] — Disponibilidade de Serviço (Uptime)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-20] — Disponibilidade de Serviço (Uptime) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- O sistema deve garantir uma disponibilidade mínima (uptime) de 99% durante o horário operacional (08h00–22h00 em dias úteis).
- Manutenções planeadas devem ocorrer fora deste intervalo.

**Critérios de Verificação:**

1. Extrair relatório de monitorização contínua (ex: Datadog) após ciclo mensal. O teste PASSA se o tempo total de inatividade não planeada no horário útil (08h–22h) for ≤ 1%, correspondendo à garantia de Uptime de 99%.

**Justificação / Dependências:** Assegura que o balcão da secretaria e os treinadores não ficam impossibilitados de trabalhar durante os períodos críticos.

**Fontes de Origem:** RNF Global.

---

#### [RNF-21] — Política de Backup e Recuperação de Dados

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-21] — Política de Backup e Recuperação de Dados |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Realização de backups automáticos diários da base de dados.
- Retenção mínima de 30 dias de histórico.
- Armazenamento dos backups em localização física distinta do servidor de produção.

**Critérios de Verificação:**

1. Auditar repositório físico secundário. O teste PASSA se existirem 30 ficheiros de dump diários consecutivos.
2. Executar restauro em ambiente staging; o teste PASSA se a integridade estrutural for 100% reposta.

**Justificação / Dependências:** Protege a memória histórica do clube e garante a continuidade de negócio em caso de desastre tecnológico.

**Fontes de Origem:** RNF Global.

---

#### [RNF-22] — Precisão Temporal de Rotinas de Background

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-22] — Precisão Temporal de Rotinas de Background |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- As tarefas agendadas (Cron Jobs) devem ser executadas com uma janela de tolerância máxima de 5 minutos face ao horário configurado.
- Rotinas críticas como a verificação de caducidade EMD devem correr em horários de baixo tráfego (ex: 02h00).

**Critérios de Verificação:**

1. Configurar o Cron Job de caducidade EMD para as 02h00. O teste PASSA se o trigger de execução nos logs do servidor ocorrer obrigatoriamente dentro da janela [02h00 — 02h05] (tolerância de 5 min).

**Justificação / Dependências:** Garante que o processamento pesado não degrada a performance durante o uso diário e que os dados estão atualizados logo no início do dia.

**Fontes de Origem:** RF-26.

---

### Restrições de Design e Conformidade

Imposições arquiteturais e obrigações de cumprimento normativo e legal, incluindo o isolamento financeiro estrito, a aderência ao RGPD e a utilização mandatória de *standards* padronizados pela indústria de *software*.

---

#### [RNF-23] — Stack Tecnológica Mandatória

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-23] — Stack Tecnológica Mandatória |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Obrigatória |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve ser obrigatoriamente implementado usando React Native + Expo (Mobile), Java Spring Boot (Backend API) e MySQL (Base de Dados).
- A interface de secretaria/direção pode ser implementada em React Web.
- Estão estritamente proibidas substituições desta stack base.

**Critérios de Verificação:**

1. Auditar ficheiros de build (package.json / pom.xml). O teste PASSA se o projeto compilar exclusivamente com React Native, Java Spring Boot e MySQL, rejeitando qualquer dependência framework alternativa.

**Justificação / Dependências:** Garante o alinhamento com as competências da equipa de desenvolvimento e controla a complexidade de manutenção.

**Fontes de Origem:** Plano de Projeto, RNF Global.

---

#### [RNF-24] — Modelo de Deployment e Exigência de Conectividade

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-24] — Modelo de Deployment e Exigência de Conectividade |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Média |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve ser *deployável* num ambiente de servidor *Cloud* ou *On-Premise*.
- Não é exigido, nem suportado, o modo de funcionamento offline.
- O dispositivo móvel do utilizador tem de ter conectividade ativa à internet para operar qualquer módulo.

**Critérios de Verificação:**

1. Executar ações de leitura e escrita na aplicação móvel enquanto o dispositivo se encontra em "Modo de Voo". O teste PASSA se a aplicação bloquear preventivamente o fluxo e exibir o alerta modal standard de "Ausência de Conectividade à Rede".

**Justificação / Dependências:** Simplificação arquitetural para a fase inicial do projeto, evitando lógicas complexas de sincronização e reconciliação de dados.

**Fontes de Origem:** RNF Global.

---

#### [RNF-25] — Conformidade Estrita com o RGPD

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-25] — Conformidade Estrita com o RGPD |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Crítica |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- O sistema deve cumprir na íntegra o Regulamento Geral sobre a Proteção de Dados (EU 2016/679).
- Inclui garantias de direito ao esquecimento (anonimização), portabilidade de dados e políticas documentadas de retenção clínica.

**Critérios de Verificação:**

1. Invocar o fluxo de eliminação de conta (Direito ao Esquecimento). O teste PASSA se uma auditoria imediata à Base de Dados comprovar que 100% das instâncias PII foram apagadas ou substituídas por hashes criptográficos irreversíveis.

**Justificação / Dependências:** Requisito legal intransponível para o tratamento de dados de saúde, especialmente tratando-se de atletas menores de idade.

**Fontes de Origem:** RNF Global, Legislação Europeia.

---

#### [RNF-26] — Proibição de Algoritmos de Segurança Customizados

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-26] — Proibição de Algoritmos de Segurança Customizados |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- É estritamente proibida a implementação de algoritmos de autenticação, encriptação ou controlo de sessão desenvolvidos internamente (*in-house*).
- O sistema deve usar exclusivamente bibliotecas e padrões standard validados pela indústria.

**Critérios de Verificação:**

1. Executar rotina de Análise Estática de Código (SAST) sobre o repositório fonte. O teste PASSA se a ferramenta reportar 0 instâncias de criptografia implementada *in-house*, comprovando o uso exclusivo de bibliotecas web standard da indústria.

**Justificação / Dependências:** Evita a introdução de vulnerabilidades graves no sistema através de implementações criptográficas amadoras ou experimentais.

**Fontes de Origem:** RNF Global, OWASP.

---

#### [RNF-27] — Segregação Societária e Financeira Obrigatória

| Campo | Valor |
|---|---|
| **ID & Nome** | [RNF-27] — Segregação Societária e Financeira Obrigatória |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Não-Funcional |
| **Prioridade** | Crítica |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve respeitar a separação legal e física entre a Associação Desportiva e a SAD.
- Não pode existir cruzamento de capitais ou visão consolidada de lucros mútuos sem os devidos filtros de Centro de Responsabilidade.

**Critérios de Verificação:**

1. Extrair mapa de faturação a partir do perfil do CFO. O teste PASSA se os Dashboards processarem os valores contabilísticos do Clube de forma matematicamente isolada e sem contaminação dos saldos da SAD.

**Justificação / Dependências:** Exigência máxima do CFO para garantir a autonomia legal das entidades e evitar penalizações em processos de auditoria contabilística.

**Fontes de Origem:** Entrevista CFO, Ata-02, US10.