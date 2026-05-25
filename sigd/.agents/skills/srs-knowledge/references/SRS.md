# Especificação de Requisitos de Software (SRS)
**Estrutura Normativa baseada em IEEE Std 830-1998**

**Autor:** OmniSystema / Sistema de gestão para um clube desportivo

---

# Capítulo 1 — Introdução

## 1.1 Objetivo

O presente documento de Especificação de Requisitos de Software (*Software Requirements Specification* — SRS) tem como propósito definir, de forma formal, exaustiva e inequívoca, o escopo funcional e as restrições técnicas do Sistema Integrado de Gestão Desportiva (SIGD). Este documento constitui a base técnica e normativa para todas as fases subsequentes do ciclo de vida de desenvolvimento, servindo como o referencial único e vinculativo para a conceção da arquitetura, implementação da lógica de negócio e execução dos protocolos de verificação e aceitação.

O objetivo central desta especificação é garantir o alinhamento absoluto entre as necessidades operacionais das diversas áreas da instituição e a solução tecnológica a produzir. Destina-se a orientar a equipa de engenharia na construção de um sistema robusto e escalável, providenciando simultaneamente aos *stakeholders* — nomeadamente as direções executiva, desportiva, médica e administrativa — um instrumento de validação para as regras de negócio, restrições de segurança e critérios de aceitação que regem o ecossistema digital do projeto.

---

## 1.2 Âmbito

O âmbito deste produto foca-se na criação do SIGD, uma plataforma centralizada para a gestão do ecossistema desportivo, clínico e administrativo da instituição. O sistema abrange a digitalização e interoperabilidade de quatro pilares operacionais fundamentais: a tesouraria, responsável pela emissão, gestão de faturação e controlo de cobrança de quotas e mensalidades; as operações de relvado, que garantem o planeamento de microciclos, registo de assiduidade e gestão de convocatórias oficiais; a clínica médica, dedicada à monitorização da prontidão física dos atletas, histórico de lesões e controlo de exames médico-desportivos; e o portal do utilizador, que atua como a interface externa digital para a comunicação bidirecional, consulta de dados e acompanhamento do percurso do atleta pelas famílias.

Para garantir a viabilidade do projeto, focar o desenvolvimento no valor central de negócio e evitar a expansão descontrolada do escopo, é imperativo estabelecer limites estritos sobre as exclusões do sistema. No domínio financeiro e administrativo, a plataforma não substitui um *software* de contabilidade certificada externa, limitando-se a processar a tesouraria de balcão e a exportar matrizes de dados. Adicionalmente, o sistema não efetua a gestão de recursos humanos, excluindo o processamento de salários, gestão de contratos ou controlo de ponto de funcionários e equipa técnica.

No domínio desportivo, o sistema atua como uma ferramenta de gestão logística e administrativa, distinguindo-se claramente das soluções de alto rendimento. Como tal, a solução não realiza análise de vídeo tático, não possui integrações nativas com ferramentas externas de prospeção para recrutamento, nem processa a biometria avançada recolhida por dispositivos vestíveis. O foco da aplicação mantém-se na organização da informação, na mitigação de riscos legais e na eliminação de estrangulamentos operacionais e financeiros.

---

## 1.3 Definições, Acrónimos e Abreviaturas

Esta secção estabelece o referencial taxonómico do documento, definindo a totalidade dos acrónimos e jargões técnicos utilizados ao longo da especificação:

- **ACID** — *Atomicity, Consistency, Isolation, Durability*: Propriedades teóricas que garantem que as transações na base de dados (ex: pagamentos) sejam processadas de forma fiável e inquebrável.
- **AES-256** — *Advanced Encryption Standard* (256-bit): Padrão de criptografia simétrica da indústria, utilizado para garantir a confidencialidade dos dados sensíveis em repouso.
- **API** — *Application Programming Interface*: Interface de comunicação que permite a interoperabilidade de dados entre a aplicação móvel/web e os servidores centrais.
- **CEO** — *Chief Executive Officer*: Diretor Executivo (perfil de acesso máximo para governação estratégica).
- **CFO** — *Chief Financial Officer*: Diretor Financeiro (perfil focado na monitorização e auditoria das receitas).
- **CSV** — *Comma-Separated Values*: Formato padronizado de ficheiro de texto utilizado para a exportação e importação de matrizes de dados (ex: exportação para contabilidade externa).
- **EMD** — Exame Médico-Desportivo: Documento clínico e legal obrigatório para atestar a aptidão física do atleta para a prática desportiva federada.
- **HTTPS** — *Hypertext Transfer Protocol Secure*: Protocolo de comunicação encriptada obrigatório em todas as transmissões de dados via Internet.
- **IAM** — *Identity and Access Management*: Gestão de Identidade e Acessos, referente às políticas e arquiteturas que garantem que os utilizadores têm as permissões corretas.
- **IEEE** — *Institute of Electrical and Electronics Engineers*: Organização internacional responsável pela norma Std 830-1998, que dita a estrutura arquitetural deste documento.
- **JSON** — *JavaScript Object Notation*: Formato leve e padronizado de intercâmbio de dados utilizado na comunicação entre o *frontend* e o *backend*.
- **JWT** — *JSON Web Token*: Padrão de mercado utilizado na transmissão compacta e segura de credenciais de autorização de sessão entre o cliente e o servidor.
- **KPI** — *Key Performance Indicator*: Indicador-Chave de Desempenho, métricas visuais utilizadas nos *dashboards* para avaliar o sucesso desportivo e financeiro.
- **NIF** — Número de Identificação Fiscal: Chave de identificação civil e tributária obrigatória no *master data* para faturação.
- **PDF** — *Portable Document Format*: Formato de ficheiro universal utilizado pelo sistema para a geração de documentos de leitura imutáveis (ex: recibos e pautas).
- **PII** — *Personally Identifiable Information*: Informação de Identificação Pessoal, englobando qualquer dado sensível (civil ou clínico) protegido por regulamentação de privacidade.
- **QA** — *Quality Assurance*: Garantia de Qualidade, referindo-se aos processos sistémicos que testam e asseguram que o *software* cumpre rigorosamente estes requisitos.
- **QR** — *Quick Response*: Código bidimensional (código de barras em matriz) gerado pela plataforma para atuar como identificador digital do atleta/sócio.
- **RBAC** — *Role-Based Access Control*: Controlo de Acessos Baseado em Funções. O motor arquitetural que garante a segregação de vistas (ex: treinadores não veem dados de tesouraria).
- **RNF** — Requisito Não-Funcional: Especificação focada em atributos transversais de qualidade da infraestrutura e do ecossistema, tais como segurança, fiabilidade, usabilidade ou performance.
- **RF** — Requisito Funcional: Especificação técnica determinística de uma funcionalidade de negócio esperada do sistema.
- **RGPD** — Regulamento Geral sobre a Proteção de Dados: Legislação europeia (UE 2016/679) que impõe à plataforma a implementação de algoritmos de mascaramento de dados pessoais.
- **SAD** — Sociedade Anónima Desportiva: Entidade jurídica profissional autónoma, cujos fluxos contabilísticos e receitas são estritamente segregados da Associação Desportiva original.
- **SAST** — *Static Application Security Testing*: Análise Estática de Segurança de Código, metodologia de teste imposta aos programadores para detetar vulnerabilidades de segurança.
- **SGBD** — Sistema de Gestão de Bases de Dados: O motor relacional de persistência da informação da plataforma (ex: PostgreSQL ou similar).
- **SIGD** — Sistema Integrado de Gestão Desportiva: A nomenclatura oficial do produto de *software* especificado no presente documento.
- **SQL** — *Structured Query Language*: Linguagem padrão de pesquisa estruturada, utilizada internamente pelo motor relacional da plataforma.
- **SRS** — *Software Requirements Specification*: Especificação de Requisitos de Software (a classificação oficial deste documento).
- **TLS** — *Transport Layer Security*: Protocolo criptográfico desenhado para fornecer segurança ponta-a-ponta nas comunicações na rede.
- **TTFB** — *Time to First Byte*: Métrica de desempenho que dita o tempo máximo que o servidor pode demorar a iniciar a resposta a um pedido do utilizador.
- **US** — *User Story*: História de Utilizador (a narrativa de negócio original do cliente que ditou a formulação de um requisito técnico).
- **UUID** — *Universally Unique Identifier*: Identificador Único Universal de 128-bits, utilizado para garantir que chaves de transações na base de dados nunca colidem.

---

## 1.4 Referências

As seguintes normas, documentos e literaturas constituem o referencial normativo, técnico e de negócio para a elaboração desta Especificação de Requisitos:

- [1] IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*, Institute of Electrical and Electronics Engineers, Inc., 1998.
- [2] I. Sommerville, *Engenharia de Software*, 10ª edição. Pearson, 2018.
- [3] Parlamento Europeu e Conselho da União Europeia, *Regulamento (UE) 2016/679 (Regulamento Geral sobre a Proteção de Dados — RGPD)*, Bruxelas, 2016.
- [4] OWASP Foundation, *OWASP Top 10: Standard Awareness Document for Developers and Web Application Security*, 2021.
- [5] Universidade do Minho, *Relatório Final de Projeto: SIGD* — Documento principal contendo o catálogo completo de *User Stories*, transcrição de entrevistas e atas de levantamento de negócio, Braga, 2026.

---

## 1.5 Visão Geral

Este documento encontra-se estruturado em três capítulos principais, em estrita conformidade com as diretrizes da norma IEEE Std 830-1998. O presente capítulo (Capítulo 1) estabelece o propósito, o âmbito de aplicação e o enquadramento normativo do SIGD. O Capítulo 2 fornece uma perspetiva de alto nível sobre o produto, mapeando as características dos utilizadores, as dependências sistémicas e as restrições operacionais e tecnológicas do projeto. Por fim, o Capítulo 3 constitui o núcleo transacional e arquitetural da especificação, detalhando o catálogo exaustivo de 42 requisitos funcionais — que regem as lógicas de negócio dos domínios desportivo, clínico e financeiro — bem como os 27 requisitos não-funcionais que ditam os atributos de qualidade, segurança e desempenho do sistema.

---

# Capítulo 2 — Descrição Geral

## 2.1 Perspetiva do Produto

O SIGD é um produto de *software* autossuficiente e independente, concebido para substituir o ecossistema legado e fragmentado da instituição, até então assente em suportes manuais e ferramentas de comunicação não estruturadas. O produto estabelece-se como o núcleo operacional da infraestrutura tecnológica do clube, assumindo o papel de fonte única de verdade (*Single Source of Truth*). Toda a inteligência de negócio é consolidada num repositório de dados mestre (*Master Data*), através do qual a informação flui de forma transacional, coerente e auditável entre os departamentos financeiro, clínico e técnico.

Sob o ponto de vista arquitetural, o sistema adota uma abordagem multiplataforma (*cross-platform*), distribuída entre interfaces móveis e *Web*, suportadas por uma infraestrutura de dados centralizada. A interface do utilizador opera sob um paradigma adaptativo, moldado à dualidade dos contextos de utilização da organização: privilegia a mobilidade e a ergonomia tátil para as operações dinâmicas no terreno (equipa técnica no relvado), garantindo, em simultâneo, a densidade de informação e o controlo exigidos em ecrãs de maior dimensão (*desktop*) para a gestão administrativa, clínica e executiva em ambiente de escritório.

---

## 2.2 Funções do Produto

As funcionalidades do SIGD encontram-se organizadas em cinco macrossegmentos lógicos, concebidos para operar de forma interoperável e assentes na mesma base de dados mestre. As funções estruturantes do sistema compreendem:

- **Gestão Financeira e Tesouraria:** Automação da geração de obrigações (quotas e mensalidades), processamento de pagamentos ao balcão com desdobramento lógico e imediato de receita (Associação vs. SAD), e monitorização da saúde financeira através de painéis analíticos (*dashboards*).
- **Operações Desportivas:** Parametrização hierárquica da instituição (modalidades, escalões e equipas), gestão do ciclo de vida do atleta, registo tátil e imediato de assiduidade no terreno, e elaboração de convocatórias e eventos desportivos.
- **Controlo Clínico e Prontidão:** Registo de ocorrências e lesões, controlo rigoroso da caducidade de exames médico-desportivos e cálculo automatizado do estado de prontidão física do atleta (que bloqueia ou autoriza a sua convocação pela equipa técnica).
- **Portal do Utilizador:** Interface de serviço aos Encarregados de Educação para consulta da agenda do atleta, verificação de conta corrente, liquidação de valores pendentes e submissão bidirecional de documentos e justificações.
- **Administração e Configuração Global:** Gestão da máquina de estados temporal das épocas desportivas (transição e arquivo de anos letivos), parametrização de valores estruturais (tabelas de preços) e controlo estrito de acessos aos diferentes módulos com base no perfil do utilizador.

---

## 2.3 Características dos Utilizadores

Esta secção descreve os perfis dos atores que interagem com o sistema, detalhando a sua literacia tecnológica, o contexto físico de utilização e as exigências de interface, por forma a guiar as diretrizes de engenharia de *frontend* e *design* (UI/UX):

- **Direção Executiva (CEO/CFO):** Utilizadores focados na governação estratégica. Acedem ao sistema maioritariamente em ambiente de secretária (*desktop*), privilegiando a visualização de painéis analíticos com elevada densidade de informação financeira e desportiva. Exigem navegação estruturada e precisão de dados para suporte à decisão.
- **Administração / Secretaria:** O motor operacional do sistema. Utilizam a plataforma de forma intensiva em terminais de escritório para tarefas de inserção de dados em massa (faturação, inscrições, configurações). Exigem interfaces otimizadas para produtividade, com suporte robusto a navegação por teclado e fluxos que minimizem a repetição de tarefas.
- **Equipa Técnica (Treinadores):** Utilizadores que operam em contextos híbridos. No relvado, o acesso é predominantemente via dispositivos móveis (*smartphone*/*tablet*), exigindo componentes visuais de alto contraste e otimizados para interação tátil rápida. Contudo, para tarefas de planeamento (ex: elaboração de convocatórias), utilizam dispositivos portáteis ou de secretária. O sistema deve, por isso, ser totalmente responsivo, garantindo uma transição fluida entre a agilidade do telemóvel e a densidade de informação do computador.
- **Departamento Médico:** Perfil focado na conformidade e privacidade. Responsáveis pela inserção de dados clínicos sensíveis. Exigem formulários claros que previnam erros de diagnóstico e dependem de mecanismos que garantam a segregação visual e o sigilo absoluto face aos restantes perfis da organização.
- **Encarregados de Educação / Atletas:** Representam o público-alvo abrangente, com literacia tecnológica heterogénea. Interagem com o portal do utilizador prioritariamente via *smartphone*. Exigem uma interface intuitiva e de "atrito zero", centrada na consulta da conta corrente e na receção de notificações institucionais.

---

## 2.4 Restrições

O desenvolvimento do SIGD está subordinado a um conjunto de condicionantes regulatórias, operacionais e tecnológicas que delimitam as decisões de arquitetura e implementação:

- **Políticas Regulatórias e Legais:** O sistema deve assegurar a segregação lógica e física de dados entre a Associação Desportiva e a SAD, impossibilitando qualquer cruzamento de fluxos financeiros. No domínio da privacidade, em estrita conformidade com o RGPD, é obrigatório o mascaramento de diagnósticos clínicos e a restrição de acesso a dados de saúde a perfis não-clínicos. Adicionalmente, por exigências de auditoria e transparência, a plataforma interdita a eliminação física de registos transacionais, impondo a geração de rastos de auditoria imutáveis.
- **Ambiente Operacional e Interface:** Por razões de viabilidade técnica e escopo, o sistema exige conectividade contínua à rede, não contemplando funcionalidades de sincronização assíncrona ou operação *offline*. No contexto de utilização no relvado, a interface deve ser rigorosamente responsiva e otimizada para dispositivos móveis, priorizando a ergonomia tátil. A identificação digital de sócios e atletas está circunscrita à geração de códigos bidimensionais (*QR Code*).
- **Segurança e Tecnologia:** É mandatória a utilização de padrões e bibliotecas consolidadas para o controlo de acessos e delegação de autorizações de sessão (via *tokens* JWT). É estritamente proibida a implementação de protocolos de segurança ou algoritmos de autenticação de desenvolvimento próprio (*in-house*), devendo a solução repousar exclusivamente sobre tecnologias testadas e certificadas pela indústria de *software*.

---

## 2.5 Pressupostos e Dependências

A viabilidade arquitetural e a execução operacional do SIGD assentam num conjunto de pressupostos críticos. Qualquer alteração nestes fatores externos poderá comprometer a eficácia dos requisitos detalhados neste documento.

- **Infraestrutura de Rede e Conectividade:** Assume-se como pressuposto inegociável que a instituição assegura cobertura de rede sem fios de alta densidade (Wi-Fi) ou conectividade móvel (4G/5G) estável em todos os seus recintos, incluindo áreas de treino e relvados. Uma vez que o sistema, por restrição técnica [2.4], opera exclusivamente em modo *online*, a continuidade do registo de dados no terreno depende inteiramente da disponibilidade e qualidade da infraestrutura de rede providenciada pelo clube.
- **Ecossistema Tecnológico e Serviços:** O desenvolvimento depende da estabilidade das ferramentas multiplataforma adotadas (React Native e Expo). Adicionalmente, o funcionamento da plataforma está dependente da alta disponibilidade de serviços de terceiros, nomeadamente a infraestrutura de alojamento centralizado (*cloud*) e provedores de serviços de correio eletrónico (*SMTP API*), fundamentais para o escoamento de notificações e alertas.
- **Hardware e Validação de Acessos:** O sistema atua estritamente como um emissor de credenciais digitais. Assume-se que os utilizadores possuem dispositivos móveis funcionais para a exibição do *QR Code*. Toda a responsabilidade pelo *hardware* de leitura e validação física (e.g., torniquetes, leitores óticos de bancada) é externa ao SIGD, não sendo necessária qualquer integração nativa com câmaras de dispositivos para este efeito no âmbito deste *software*.
- **Interoperabilidade Financeira:** O SIGD depende do pressuposto de que o *software* de contabilidade externa da Associação e da SAD suporta a importação de dados via formatos padronizados (*CSV* ou *XML*). O sistema garante a exportação íntegra destes artefactos, dependendo desta compatibilidade passiva para assegurar a consistência contabilística final sem redundância de inserção manual.

---

# Capítulo 3 — Especificação de Requisitos

Este capítulo constitui o núcleo normativo e técnico do presente documento, consolidando a especificação exaustiva de todos os requisitos funcionais e não-funcionais inerentes ao SIGD. A estruturação e o detalhe aqui apresentados cumprem rigorosamente os atributos de qualidade — clareza, consistência, testabilidade e rastreabilidade — exigidos pela norma IEEE Std 830-1998, servindo como base contratual para a arquitetura de *software* e para os protocolos de Garantia de Qualidade (QA).

---

## 3.1 Requisitos Funcionais

Esta secção apresenta o catálogo estruturado das operações de negócio suportadas pelo sistema. Cada especificação funcional (RF) define de forma determinística o comportamento esperado da plataforma, mapeando as pré-condições operacionais, a lógica de processamento transacional e as transições de estado resultantes das interações dos atores com o ecossistema digital.

---

### [RF-01] — Registo Digital de Assiduidade e Pontualidade em Dispositivo Móvel

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-01] — Registo Digital de Assiduidade e Pontualidade em Dispositivo Móvel |
| **Área do Sistema** | Operações de Relvado |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve existir uma interface de registo de assiduidade, acessível a partir da vista de agenda diária na aplicação móvel da equipa técnica.
- Ao aceder à interface, o sistema carrega e apresenta a lista exclusiva do plantel ativo associado à equipa em questão, ordenada alfabeticamente.
- Para cada atleta, o sistema disponibiliza opções de seleção única e excludente representativas do estado de comparência (presente, ausente ou atrasado). Por omissão, o sistema não assume nenhum estado predefinido no início da chamada.
- O utilizador submete o estado de assiduidade através de interação direta. O sistema deve associar um identificador lógico semântico refletindo a tipologia de presença ao registo do atleta e atualizar os contadores de totalização.
- O estado selecionado deve ser persistido na base de dados, juntamente com a respetiva marcação temporal (*timestamp*).

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US01 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter o registo de assiduidade para um atleta do plantel ativo. O teste PASSA se o SGBD persistir o estado lógico e o motor de cálculo atualizar os contadores de totalização da sessão.

**Justificação / Dependências:** Solicitado pelo Treinador Miguel Santos e suportado pelo inquérito, onde 55% dos utilizadores privilegiam interfaces móveis e 28% consideram a assiduidade a métrica de maior valor, este requisito atua como a fundação de dados do relvado. É crucial porque a recolha exata destes estados alimenta diretamente o histórico do atleta e atua como filtro de dependência para bloquear ou permitir ações subsequentes, nomeadamente definindo quem fica elegível para a avaliação de rendimento no final do treino [RF-03].

**Fontes de Origem:** US01, Ent. Miguel, Inquérito Q11.

---

### [RF-02] — Submissão Digital e Integração Direta de Justificações de Ausência

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-02] — Submissão Digital e Integração Direta de Justificações de Ausência |
| **Área do Sistema** | Portal do Utilizador / Operações de Relvado |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Deve ser disponibilizada uma funcionalidade de justificação de ausência, acessível através das opções de ação no detalhe da sessão de treino, dentro do Portal do Utilizador.
- O utilizador inicia o processo através do preenchimento obrigatório de um descritivo textual com o motivo da ausência. Este campo está sujeito a validação estrita de dimensão, exigindo um preenchimento mínimo de 10 caracteres e impondo um limite máximo de 500 caracteres para permitir a submissão.
- O sistema verifica a marcação temporal da submissão face à hora planeada para o fim da sessão de treino. A justificação é permitida de forma prévia ou posterior, impondo-se um bloqueio sistémico estrito à operação caso seja ultrapassado o prazo regulamentar de 24 horas consecutivas após o término da sessão, emitindo-se uma notificação de erro por expiração de prazo temporal.
- Em caso de submissão prévia com sucesso, o sistema persiste o estado lógico de ausência do atleta. Aquando do acesso do Treinador à interface de registo de assiduidade [RF-01], o sistema inibe a edição manual desse registo e apresenta um indicador de falta justificada.
- Em caso de submissão com sucesso após o treino, o sistema atualiza o registo no histórico do atleta, convertendo um eventual estado de ausência injustificada num estado de ausência justificada, e emite um feedback de confirmação de sistema para o utilizador.
- O sistema permite que a equipa técnica consulte o motivo submetido mediante interação direta com o indicador de justificação na própria lista de chamada, apresentando o texto explicativo de forma integrada sem forçar a navegação para ecrãs secundários.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US02 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma justificação de ausência com um motivo inferior a 10 caracteres ou decorridas mais de 24 horas após o término da sessão. O teste PASSA se o sistema rejeitar a transação por erro de validação e impedir qualquer alteração no histórico de assiduidade do atleta.

**Justificação / Dependências:** Respondendo à exigência do Treinador Miguel Santos em centralizar os fluxos de comunicação, e mitigando a dispersão comprovada pelos 32% de inquiridos que usam vias informais (WhatsApp) ou falham os avisos, este requisito é fundamental para a integridade da base de dados. Ao injetar a justificação do portal do cliente diretamente na interface da equipa técnica, o sistema previne a duplicação de dados, automatiza o estado de assiduidade e bloqueia edições manuais indevidas na lista de presenças diária.

**Fontes de Origem:** US02, Ent. Miguel, Inquérito Q9.

---

### [RF-03] — Atribuição e Registo de Métricas de Rendimento de Treino Pós-Sessão

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-03] — Atribuição e Registo de Métricas de Rendimento de Treino Pós-Sessão |
| **Área do Sistema** | Operações de Relvado |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve existir uma interface dedicada à avaliação de desempenho, acessível a partir do detalhe da sessão de treino, na aplicação da equipa técnica.
- Ao solicitar o acesso ao módulo de avaliação, o sistema cruza a hora atual com a hora de término planeada para a sessão. Caso a sessão ainda se encontre a decorrer, o sistema inibe a interação e emite uma notificação informativa indicando a indisponibilidade temporal do módulo.
- Uma vez validada a conclusão da sessão, o sistema carrega a lista de avaliação filtrando e apresentando estritamente os atletas que obtiveram um estado de presença validado na chamada da sessão, suprimindo da vista os registos de atletas ausentes.
- O sistema disponibiliza, de forma individualizada, um seletor de classificação numérica no intervalo de 1.0 a 5.0, com incrementos de 0.5 pontos. Esta escala é configurável pela Direção Técnica no módulo de administração [RF-06], permitindo que a avaliação seja atribuída através de interação rápida na interface.
- O sistema aplica um controlo temporal rigoroso à operação: decorrido o prazo regulamentar de 24 horas consecutivas após o fecho da sessão, a capacidade de edição ou registo é permanentemente revogada, transitando a lista para um estado estrito de leitura. A ausência de nota submetida dentro desta janela é registada no sistema como Não Avaliado, sendo identificada através de um estado lógico próprio e excluída do cálculo de médias longitudinais.
- Verificando-se a submissão dentro da janela temporal válida, o sistema persiste a classificação no histórico do atleta e apresenta o respetivo indicador de persistência junto ao registo.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US05 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Tentar o acesso ao módulo de avaliação de rendimento antes do horário de término planeado para a sessão. O teste PASSA se o sistema inibir a operação e, após a conclusão do treino, o motor de filtragem suprimir da lista os atletas sem estado de presença validado.

**Justificação / Dependências:** Garantindo o pedido do Treinador Miguel Santos por um histórico quantitativo, a imposição sistémica desta avaliação estruturada e limitada a uma janela estrita de 24 horas constitui o motor de dados avaliativos da plataforma. É vital para a arquitetura do negócio, pois a agregação inalterável destas notas (numa escala fracionária de base 5) fornece os critérios obrigatórios para a elaboração de convocatórias de jogo [RF-04] e alimenta os dashboards longitudinais consumidos pela Direção Técnica [RF-12 e RF-13].

**Fontes de Origem:** US05, Ent. Miguel.

---

### [RF-04] — Elaboração e Gestão de Convocatórias Oficiais de Jogo

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-04] — Elaboração e Gestão de Convocatórias Oficiais de Jogo |
| **Área do Sistema** | Operações de Relvado |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve ser disponibilizada uma interface de gestão de convocatórias oficiais, acessível a partir do detalhe do evento no calendário desportivo da equipa.
- Aquando do acesso, o sistema compila e apresenta a lista integral do plantel associado, permitindo a ordenação dinâmica por critérios táticos ou alfabéticos. O sistema deve calcular e expor, para cada atleta, a média avaliativa das últimas 5 sessões de treino com presença validada [RF-03] e a taxa de assiduidade das últimas 4 semanas [RF-01]. Quando o histórico disponível for inferior ao período mínimo de cálculo, deve ser emitida uma notificação informativa de sistema de dados insuficientes em vez de um valor calculado sobre amostra incompleta.
- O sistema executa uma rotina obrigatória de validação de elegibilidade cruzando variáveis clínicas e burocráticas. Caso se verifique inaptidão clínica [RF-18], caducidade do Exame Médico-Desportivo (EMD) [RF-15] ou qualquer pendência administrativa ditada pela Secretaria [RF-37], o sistema desativa a respetiva capacidade de seleção. Sobre os registos inibidos é aposto um indicador de estado de inaptidão correspondente à tipologia da falha, assegurando o bloqueio sistémico da convocatória do atleta.
- A elaboração da lista processa-se por seleção individualizada dos elementos elegíveis, cabendo ao sistema atualizar e exibir em tempo real o apuramento quantitativo total de escolhas realizadas.
- O sistema aplica regras dinâmicas de limitação quantitativa, herdadas da parametrização específica da modalidade ou competição associada. Atingido o limite imposto, é bloqueada a inserção de novos elementos e o sistema aciona uma notificação explicativa sobre a restrição de volume.
- O utilizador dispõe da opção de persistir a seleção num estado provisório para edição futura, ou de acionar a confirmação definitiva, circunstância que consolida logicamente o documento e transita automaticamente o utilizador para a fase de parametrização logística [RF-05].

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US06 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Tentar selecionar um atleta com o EMD caducado ou com inaptidão clínica registada. O teste PASSA se o sistema inibir imediatamente a ação lógica de seleção sobre esse registo, garantindo a sua exclusão da listagem final a submeter.

**Justificação / Dependências:** Em linha com a visão técnica do Treinador Miguel Santos e com os 34% de inquiridos (Q11) que valorizam o calendário de convocatórias, este requisito é crucial porque materializa o cruzamento de regras de negócio estritas. Ao cruzar automaticamente o histórico de rendimento com as barreiras clínicas e legais, atua como o filtro de integridade que define a "Verdade Desportiva" do fim de semana, criando a dependência primária para a emissão de comunicações [RF-05] e para a futura Ficha de Jogo [RF-09].

**Fontes de Origem:** US06, Ent. Miguel, Inquérito Q11, Q18.

---

### [RF-05] — Notificação Automática de Convocatórias e Logística aos Encarregados de Educação

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-05] — Notificação Automática de Convocatórias e Logística aos Encarregados de Educação |
| **Área do Sistema** | Operações de Relvado / Motor de Comunicações |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- A interface de planeamento logístico e publicação deve ser invocada de forma sequencial pelo sistema após a validação final do elenco no módulo de convocatória [RF-04].
- O sistema assegura a apresentação não editável dos dados primários do evento oficial (entidade adversária, data e hora de jogo), herdados por integração direta com o calendário competitivo [RF-08].
- O preenchimento da componente logística exige a introdução obrigatória dos parâmetros referentes ao local e à marcação horária da concentração desportiva.
- Previamente à submissão definitiva, o sistema efetua uma validação lógica de coerência cronológica: caso a hora introduzida para a concentração iguale ou ultrapasse a hora oficial agendada para o jogo, a transação é interrompida e é emitido um alerta de incoerência temporal.
- O motor de validação acautela igualmente a completude dos dados essenciais, inibindo o avanço lógico da operação e exigindo correção caso se detete a ausência de parâmetros logísticos obrigatórios.
- Ultimadas e aprovadas as validações, o sistema converte a convocatória do estado provisório para um estado finalizado de publicação, trancando o documento contra mutações de edição.
- Após a confirmação definitiva da convocatória, o sistema deve gerar o documento institucional estruturado (PDF) e enfileirar as notificações no motor centralizado [RF-25], confirmando o enfileiramento na interface do utilizador. O sistema deve propagar em simultâneo a alteração de estado para o Portal do Utilizador correspondente.
- O documento institucional estruturado (PDF) gerado deve conter, no mínimo, a seguinte matriz de dados obrigatória: nome e logótipo do clube, designação da equipa e respetivo escalão, data, hora e local do jogo e da concentração, identificação da entidade adversária, e a lista nominal dos convocados ordenada de forma alfabética.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US07 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter os parâmetros logísticos com a hora de concentração definida para um momento posterior ao início oficial do jogo. O teste PASSA se o motor de validação interromper a publicação e, após a retificação de dados, o sistema gerar a entidade PDF institucional e enfileirar as notificações no serviço de mensageria.

**Justificação / Dependências:** Apoiado na exigência de 57% dos inquiridos (Q18) que priorizam a receção de notificações oficiais, e respondendo à necessidade expressa (US07) de automatização, este requisito possui um impacto arquitetural central. Transforma o evento de submissão do treinador num gatilho de sistema (trigger) que invoca o serviço de notificações externo [RF-25], populando automaticamente a interface dos clientes [RF-20] e isolando o núcleo desportivo de interações manuais, garantindo que os dados visíveis no portal derivam estritamente da base de dados oficial.

**Fontes de Origem:** US07, Ent. Miguel, Inquérito Q10, Q18.

---

### [RF-06] — Configuração Hierárquica da Estrutura Desportiva (Modalidade, Escalão, Equipa)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-06] — Configuração Hierárquica da Estrutura Desportiva (Modalidade, Escalão, Equipa) |
| **Área do Sistema** | Direção Técnica / Administração Desportiva |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Deve existir um módulo de configuração estrutural da época desportiva, acessível a partir da interface principal da Direção Técnica.
- A parametrização hierárquica tem início com a definição da entidade agregadora base (Modalidade), parametrizada através de uma tipologia restrita do sistema, prosseguindo com a alocação da categoria desportiva correspondente (Escalão).
- A criação sistémica do Escalão exige a introdução obrigatória de métricas regulamentares: limite temporal por evento, teto máximo de vagas na convocatória e, criticamente, os parâmetros financeiros estruturais. Neste ato, o sistema impõe o mapeamento obrigatório das rubricas de receita às respetivas entidades jurídicas destinatárias: a Quota Associativa Anual é mapeada para a entidade Associação Desportiva, e as Mensalidades (Base e de Sócio) são mapeadas para a entidade SAD/Formação.
- O nó final da arquitetura processa-se através da criação da entidade formal (Equipa). Aquando da tentativa de persistência em base de dados, o sistema valida obrigatoriamente a unicidade da nomenclatura para evitar conflitos dentro da mesma ramificação.
- Consolidada a persistência estrutural, o sistema disponibiliza de imediato as respetivas áreas modulares transversais para a associação do plantel de atletas e do corpo técnico [RF-07].
- As métricas financeiras e regulamentares definidas herdam automaticamente o papel de constantes de validação e cálculo a ser consumidas pelos módulos consequentes de submissão de eventos [RF-04/09] e de provisão financeira [RF-29].
- Após verificação de integridade, a visualização detalhada da equipa expande as funcionalidades de associação, filtrando o diretório com base nos parâmetros demográficos exigidos pelo escalão em causa.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US26, US31 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um payload para criação de uma entidade de escalão omitindo as constantes de valor de quota e mensalidade, e subsequentemente submeter a criação de uma equipa com uma nomenclatura já persistida no mesmo ramo. O teste PASSA se o SGBD rejeitar a primeira transação por ausência de métricas financeiras estruturais e abortar a segunda gravação por violação da regra de unicidade no motor relacional.

**Justificação / Dependências:** Exigido pelo Diretor Armando Silva, este requisito é a âncora arquitetural do sistema. Ao centralizar a definição de limites desportivos e a matriz financeira (Base vs. Sócio) no Escalão, erradica-se a dispersão de dados e garante-se que o Motor de Provisão [RF-29] possua uma base de cálculo determinística, eliminando a arbitrariedade na faturação.

**Fontes de Origem:** US31, Ent. Armando, Auditoria Claude.

---

### [RF-07] — Alocação de Equipas Técnicas e Associação ao Plantel

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-07] — Alocação de Equipas Técnicas e Associação ao Plantel |
| **Área do Sistema** | Direção Técnica / Administração Desportiva |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- Deve ser implementada uma interface de gestão operativa de alocação, acessível através das propriedades da equipa pré-parametrizada no sistema ([RF-06]), segmentada em áreas de coordenação técnica e constituição do plantel.
- O utilizador processa a associação selecionando o funcionário pretendido e mapeando-o a um perfil de intervenção oficial. O sistema aplica regras restritivas de hierarquia (exclusividade de topo): existindo já a ocupação do cargo de responsabilidade primária na equipa, o sistema inibe a transação duplicada e emite uma notificação de falha arquitetural. A multiplicidade de funções noutras equipas, porém, é admitida.
- Na constituição do plantel desportivo, é garantida ao utilizador a extração do diretório central da plataforma. Atuam filtros sistémicos transversais (conforme [RF-06]), assegurando que apenas registos elegíveis em idade e livres de obrigações institucionais da mesma modalidade sejam passíveis de inclusão em lote.
- A persistência desta configuração funciona como o vetor de autorização Role-Based Access Control (RBAC). Os membros alocados da equipa técnica adquirem automaticamente credenciais de acesso condicionado aos módulos operacionais do relvado ([RF-01], [RF-03], [RF-04]), circunscritas logicamente apenas à gestão e visualização das entidades diretamente alocadas à sua responsabilidade desportiva.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US27 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma transação de mapeamento de um utilizador para o perfil de intervenção principal numa equipa onde a vaga de responsabilidade de topo já se encontra preenchida. O teste PASSA se o sistema inibir o mapeamento por falha arquitetural de exclusividade e, após uma alocação válida, o motor de autorização (RBAC) restringir a extração de dados do plantel ao contexto estrito do nó desportivo atribuído.

**Justificação / Dependências:** Este requisito materializa o princípio de segurança e necessidade operativa exigido pela Direção Técnica. Do ponto de vista arquitetural, é o motor de permissões do sistema (RBAC), garantindo o sigilo desportivo e clínico ao isolar a visibilidade de dados: assegura que um treinador apenas consiga visualizar, convocar e registar presenças [RF-01] dos atletas que pertencem ao seu nó hierárquico, bloqueando o acesso a dados de outros escalões.

**Fontes de Origem:** US27, Ent. Armando.

---

### [RF-08] — Mapeamento de Quadros Competitivos Oficiais e Associação de Calendários

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-08] — Mapeamento de Quadros Competitivos Oficiais e Associação de Calendários |
| **Área do Sistema** | Direção Técnica / Gestão de Competições |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- Deve prever-se um módulo de agregação para a parametrização de quadros de competição formais, diretamente invocável na base da administração do nó desportivo.
- O processo exige a injeção dos metadados contextuais relativos ao evento oficial, abarcando variáveis obrigatórias inerentes à designação, enquadramento logístico, formato estrutural e autoridade governativa organizadora.
- O ecossistema suporta ainda um módulo de planeamento cronológico e tático centralizado, em que se formaliza a submissão de eventos mediante a verificação de propriedades indissociáveis ao evento, tais como coordenadas horárias, dados logísticos e identidade da equipa adversária enquadrada.
- A perspetiva de validação do agendamento obriga a um cruzamento matricial entre as disponibilidades do calendário organizacional e do plano ocupacional do corpo técnico subscrito. A deteção de anomalias estruturais sobrepostas (equipas em choque) culmina em bloqueio inibitório da gravação, passo que anomalias em escala individual forçam um processo lógico não-bloqueante que emite alerta contextual de obrigatoriedade sobre a distribuição tática a delegar num substituto técnico para a liderança desportiva do jogo oficial.
- Verificada a salvaguarda operacional e arquitetural, a transação grava o planeamento e atualiza condicionalmente as credenciais e acessos futuros inerentes à manipulação de métricas e registos de ficha de jogo ([RF-09]) associados ao perfil hierarquicamente destacado.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US28 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter o agendamento de um evento desportivo injetando coordenadas horárias que sobreponham o planeamento ativo de uma equipa, e repetir a operação para um choque exclusivo de corpo técnico. O teste PASSA se o motor intercetar a primeira condição aplicando um bloqueio transacional inibitório (choque estrutural), mas permitir a persistência da segunda condição registando internamente um alerta lógico de substituição tática.

**Justificação / Dependências:** Respondendo à exigência do Diretor Técnico de contextualizar o rendimento coletivo, este módulo estabelece a ponte lógica entre a organização interna do clube e as competições externas. É uma peça chave da arquitetura, pois a criação formal destes eventos atua como o "recipiente" de base de dados obrigatório que permitirá a elaboração das listas de convocados [RF-04] e suportará a posterior submissão digital da ficha de jogo pelo delegado no relvado [RF-09].

**Fontes de Origem:** US28, Ent. Armando.

---

### [RF-09] — Submissão Digital de Ficha de Jogo Pós-Evento (Minutos, Golos e Cartões)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-09] — Submissão Digital de Ficha de Jogo Pós-Evento (Minutos, Golos e Cartões) |
| **Área do Sistema** | Gestão de Competições / Operações de Relvado |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Exige-se uma interface de digitalização de relatório de jogo, operável diretamente no dispositivo credenciado após validação contextual pelo plano de calendário configurado da plataforma [RF-08].
- Mediante inicialização da vista, o sistema restringe as variáveis de entrada, forçando o acesso a um subconjunto restrito inerente ao contexto: unicamente os registos ativos integrados e já atestados como convocados oficiais do módulo anterior [RF-04], proibindo integrações ad-hoc.
- A consolidação do preenchimento requer etapas lógicas: primeiramente a identificação do elenco titular, o qual é mapeado com preenchimento global de tempo desportivo condicionado pela carga tática da equipa (atribuindo ausência de minutos por omissão de campo).
- O fluxo de submissão deve permitir o registo individual de cada evento dinâmico da partida (substituição, golo, cartão).
- O cruzamento das substituições pelo tempo desportivo exige que o sistema recalcule e apresente os minutos em campo de todos os atletas.
- Submetidos os eventos e antes de gravar as informações num modelo persistente, impõem-se verificações exatas de tolerância (nomeadamente desvio face às configurações absolutas parametrizadas no [RF-06]). Evidências anómalas forçam rejeição imediata da transação, e o sistema expõe as instâncias inválidas através de uma notificação parametrizada contendo o detalhe estrutural da falha para reparação.
- Excluindo falhas condicionais, o bloqueio do documento efetua transação para um estado concluído e irreversível e reflete agregados da performance em perfis unificados e painéis sumários.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US29, US30 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um registo transacional de evento dinâmico (ex: golo) associando um identificador de atleta ausente da lista de convocados do módulo antecedente. O teste PASSA se o sistema rejeitar inserções ad-hoc, recalcular os vetores de tempo desportivo condicionado com base na equipa inicial e substituições, e transitar o modelo de dados para um estado logicamente irreversível após validar as tolerâncias.

**Justificação / Dependências:** Sendo o conversor primário de eventos de campo em dados de sistema, a digitalização parametrizada destes inputs elimina a transcrição humana e o uso de canais informais. O cálculo automático de minutos a partir da equipa inicial e das trocas garante uma excelente usabilidade (UX) ao treinador. Estabelece a dependência de dados essencial que atualizará as médias longitudinais dos atletas [RF-12] e alimentará o dashboard global de resultados [RF-13] consumido pela direção à segunda-feira.

**Fontes de Origem:** US29, US30, Ent. Armando, Ata 03.

---

### [RF-10] — Bloqueio Automático Temporal de Edição de Fichas de Jornada

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-10] — Bloqueio Automático Temporal de Edição de Fichas de Jornada |
| **Área do Sistema** | Gestão de Competições / Direção Técnica |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- É vital instituir uma rotina contínua baseada em processos sistémicos de validação temporal cruzada pelo fim inerente do modelo validado a cada evento na agenda planeada em [RF-08].
- O algoritmo determina de forma universal uma imposição impeditiva inquestionável a ocorrer num ciclo de vida exato de 24 horas consecutivas a contar sobre o fecho regulamentar do agendamento (base de cálculo configurada por metadados de herança em [RF-06]).
- Uma tentativa de reescrita manual no contexto digital após desvios condicionais por limitação desse bloqueio inibe todos os controlos no ambiente manipulável e despoleta no ato da comunicação um alarme sistémico indicando o encerramento do fecho dos eventos àquela unidade do tempo.
- As limitações descritas por fecho absoluto garantem imposições de revogação abrangente para todo o espetro da rede sem exceção condicional.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US31 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Tentar forçar a reescrita de dados numa entidade de ficha de jogo cuja base de cálculo de fecho indique o decurso de 24 horas consecutivas sobre o término do agendamento. O teste PASSA se a rotina de validação temporal intercetar a chamada, inibir as funções manipuláveis sobre o objeto na base de dados e devolver ao cliente uma anulação por limite de ciclo de vida fechado.

**Justificação / Dependências:** Constitui a barreira de consistência do módulo competitivo. Garante a imutabilidade estatística do sistema. Para efeitos do Painel de Performance de segunda-feira [RF-13], o sistema considerará como "Dados Consolidados" apenas as fichas já bloqueadas ou submetidas, assinalando como "Pendente" os jogos de domingo à tarde que ainda estejam dentro da janela legal de 24 horas.

**Fontes de Origem:** US31, Ent. Armando, Ata 03.

---

### [RF-11] — Sistema de Monitorização e Alertas por Incumprimento de Submissão de Dados Desportivos

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-11] — Sistema de Monitorização e Alertas por Incumprimento de Submissão de Dados Desportivos |
| **Área do Sistema** | Direção Técnica / Administração Desportiva |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve realizar uma auditoria automática e contínua ao estado das Fichas de Jogo agendadas no calendário oficial [RF-08].
- Sempre que um evento desportivo atinge o limite temporal regulamentar de 24 horas após o término e a respetiva ficha persiste num estado de ausência de submissão definitiva, o sistema despoleta internamente um evento de incumprimento.
- Para cada anomalia detetada, o motor de monitorização isola os metadados contextuais: equipa afetada, escalão hierárquico, entidade adversária e a identificação do membro do corpo técnico encarregue da responsabilidade da submissão.
- O evento de incumprimento deve ser persistido na base de dados e tornado visível no painel de monitorização da Direção Técnica.
- O alerta deve expor a anatomia do incumprimento de forma estruturada, detalhando as entidades envolvidas, a expiração do prazo e a responsabilização direta.
- O alerta deve permanecer com o estado de não lido até que um perfil de administração técnica execute uma ação explícita de reconhecimento ou arquivamento da ocorrência.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US32 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma simulação temporal de avanço de relógio, ultrapassando o limite regulamentar das 24 horas sobre um evento desportivo sem submissão definitiva registada. O teste PASSA se a rotina de auditoria despoletar e persistir no SGBD uma entidade de incumprimento com os metadados associados, mantendo o seu estado relacional bloqueado até à interceção de um comando explícito de reconhecimento.

**Justificação / Dependências:** Este requisito atua como o motor de controlo de qualidade da Direção Técnica. Em vez de uma auditoria manual passiva, o sistema oferece uma gestão por exceção, expondo apenas as falhas de fluxo de dados. É vital para garantir que a liderança do clube consiga identificar e corrigir comportamentos negligentes da equipa técnica, assegurando a integridade estatística da época.

**Fontes de Origem:** US32, Ent. Armando, Ata 03.

---

### [RF-12] — Dashboard de Rendimento Acumulado e Evolução Individual do Atleta

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-12] — Dashboard de Rendimento Acumulado e Evolução Individual do Atleta |
| **Área do Sistema** | Direção Técnica / Avaliação de Desempenho |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve existir um módulo de análise longitudinal, acessível a partir da vista de detalhe do perfil individual de cada atleta, na plataforma da Direção Técnica.
- O sistema compila sob demanda o histórico transacional da época ativa e apresenta os indicadores globais consolidados da entidade: totalizações de convocatórias, soma de utilização efetiva (minutos reais), produção de golos e acumulação de infrações disciplinares.
- O motor estatístico processa de forma autónoma as médias correspondentes ao escalão do atleta, gerando mapeamentos gráficos comparativos que sobrepõem a evolução da performance individual em relação à mediana da equipa.
- O painel deve incorporar o cálculo paramétrico da taxa de disponibilidade, traduzindo o rácio de tempo em que o atleta se encontrou clinicamente apto em oposição aos registos temporais de incapacidade no departamento médico ([RF-17]).
- Na eventualidade de ausência de matrizes avaliativas ou registos competitivos, o sistema inibe a renderização visual da componente gráfica e emite uma notificação informativa indicando insuficiência de dados consolidados para esse ciclo.
- A interface exige controlos de filtragem dimensional, permitindo ao utilizador aplicar parâmetros secundários para o recálculo do dashboard, isolando blocos analíticos por recuos no histórico da época ou estritamente por tipologia de competição oficial.
- Todos os componentes numéricos e gráficos operam com um impedimento estrito de edição, garantindo a natureza read-only inerente à salvaguarda da agregação dos dados brutos processados.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US33 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um pedido de compilação longitudinal de dados para um atleta sem matriz transacional e, de seguida, para um atleta com registos fechados na época. O teste PASSA se o motor estatístico abortar a extração no primeiro caso por insuficiência de matriz e, no segundo caso, calcular em modo estrito de leitura as totalizações absolutas e o rácio paramétrico de disponibilidade clínica face à equipa.

**Justificação / Dependências:** Direcionado para resolver o problema do Diretor Técnico Armando Silva, que perdia tempo a agregar dados fragmentados para justificar a subida de escalão de talentos, e respondendo aos 60% de inquiridos (Q12) que sentem falta de visibilidade sobre estatísticas oficiais. Arquitetonicamente, este painel atua como o principal consumidor de dados individuais, estabelecendo uma dependência direta com o motor de avaliação diária [RF-03] e as fichas de partida [RF-09], traduzindo dados brutos num perfil longitudinal imutável e estruturado.

**Fontes de Origem:** US33, Ent. Armando, Inquérito Q11, Q12.

---

### [RF-13] — Dashboard Consolidado de Resultados Globais e KPIs de Jornada

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-13] — Dashboard Consolidado de Resultados Globais e KPIs de Jornada |
| **Área do Sistema** | Direção Técnica / Administração Desportiva |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve existir um painel consolidado de análise desportiva, atuando como interface principal da plataforma ao nível do Diretor Técnico.
- Aquando da inicialização, o sistema despoleta um serviço de agregação de dados sobre os repositórios de relatórios de jogo do clube, assumindo por omissão um horizonte temporal balizado nos últimos 7 dias de atividade (fase equivalente à última jornada).
- O sistema expõe controlos de parametrização temporal, possibilitando ao utilizador a redefinição transversal do intervalo analítico (mensal, temporada acumulada ou limites flexíveis em calendário).
- Na extração das métricas, o motor estatístico restringe a amostra aos eventos consolidados com submissão validada [RF-09]. Existindo no universo filtrado partidas em decurso do prazo móvel de 24 horas [RF-10], o sistema evidencia na interface um indicador de pendência qualitativo, salvaguardando a natureza provisória do dataset consultado.
- Processada a filtragem, a interface renderiza uma matriz distributiva organizada por segmentação etária, refletindo as totalizações de vitórias, empates e derrotas do clube para aquele ciclo balizado.
- Integradas nesta visão, destacam-se rubricas de performance coletiva (KPIs), extraindo a média percentual de golos a favor e contra para a realidade global de cada escalão.
- O modelo da arquitetura da interface permite interações de aprofundamento de níveis contextuais (*drill-down*), viabilizando a navegação até ao detalhe da prestação da equipa de base subjacente aos números de topo consolidados na agregação.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US34 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um comando de extração de resultados filtrando um período que contenha eventos totalmente validados e eventos recém-concluídos ainda dentro da janela móvel de validação. O teste PASSA se o motor extrair e agregar os indicadores transacionais dos jogos fechados e injetar na estrutura de dados de resposta uma propriedade lógica sinalizando a natureza provisória do vetor avaliado.

**Justificação / Dependências:** Exigido pelo Diretor Técnico para avaliar a saúde competitiva de toda a academia sem depender de comunicações isoladas, este requisito é o cume da pirâmide de agregação de dados do sistema. Arquiteturalmente, a fiabilidade e honestidade deste painel dependem da sinergia com o bloqueio temporal móvel de 24 horas [RF-10], garantindo que a matriz de resultados apresentada é um espelho validado da realidade, informando proativamente a Direção sempre que existam dados em trânsito.

**Fontes de Origem:** US34, Ent. Armando.

---

### [RF-14] — Monitorização e Emissão de Alertas Preventivos de Caducidade Documental (EMD e Documentos Civis)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-14] — Monitorização e Emissão de Alertas Preventivos de Caducidade Documental (EMD e Documentos Civis) |
| **Área do Sistema** | Departamento Médico / Motor de Comunicações |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema integra rotinas de varrimento assíncrono programado, avaliando sistematicamente a matriz de atributos temporais referentes ao ciclo de vida do EMD e às entidades documentais civis mapeadas aos perfis do corpo desportivo ativo.
- O motor do sistema deve emitir alertas preventivos de caducidade quando a data de expiração do EMD ou documento civil estiver a 30 dias ou menos da data atual. Este limiar temporal deve ser um parâmetro de configuração global, editável exclusivamente por perfis de Administração de Sistema, assumindo o valor por defeito de 30 dias. Qualquer alteração a este parâmetro deve ser registada no histórico de auditoria [RF-24].
- A deteção desta condição resulta na formulação e expedição de alertas automatizados por intermédio dos canais subscritos pelos Encarregados de Educação, adaptando o contexto comunicacional à tipologia de documento focado, como forma de apelo institucional para correção administrativa e mitigação de interrupções futuras.
- O processamento injeta concomitantemente propriedades de anomalia no registo operacional dos perfis expostos nas interfaces do corpo técnico, sinalizando a iminência de caducidade com indicadores visuais no contexto dos módulos de convocatória e listas de presenças.
- O sistema assegura o recálculo diário e regressivo dessa indicação na camada de apresentação, persistindo o estado de aviso até que um processo orgânico de renovação revalide o documento, ou até à transição crítica de expiração do prazo global.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US35 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter na base de dados uma alteração à data de expiração de um EMD para igualar o limiar paramétrico de 30 dias. O teste PASSA se o motor assíncrono intercetar a condição no ciclo de varrimento, enfileirar uma instrução preventiva no serviço de comunicações e injetar uma propriedade de anomalia no registo operacional do atleta.

**Justificação / Dependências:** Suportado pelos 40% de utilizadores que reportaram surpresa com as caducidades e pelos 33% que exigiram alertas automáticos (Q13/Q14), este módulo atua como a primeira linha de mitigação de risco do clube (US35). Arquiteturalmente, cria um ciclo de automação proativo que antecipa o bloqueio absoluto do sistema, descentralizando a carga administrativa do departamento médico e transferindo a responsabilidade da renovação atempada para as famílias.

**Fontes de Origem:** US35, Ent. Nuno, Ata 01, Inquérito Q13, Q14.

---

### [RF-15] — Bloqueio Sistémico Intransponível de Utilização Desportiva por EMD Caducado

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-15] — Bloqueio Sistémico Intransponível de Utilização Desportiva por EMD Caducado |
| **Área do Sistema** | Departamento Médico / Operações de Relvado |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- A matriz relacional impõe a avaliação contínua do atributo de expiração sobre os documentos clínicos mandatórios. Verificada a transgressão da barreira temporal, o sistema altera e força unilateralmente o estado da entidade desportiva correspondente para um contexto de inaptidão documental.
- Aquando da solicitação por perfis técnicos de vistas dedicadas ao consumo de plantel de ação ([RF-01] e [RF-04]), o motor interceta a invocação de carregamento, ativando restrições rigorosas baseadas nestas variáveis de saúde clínica em falta.
- Qualquer perfil que se denote num contexto de anomalia de conformidade perde, na resposta apresentada, as capacidades funcionais associadas. O sistema revoga propriedades interativas de seleção, anulando a hipótese sistémica de vinculação dessa entidade à submissão do evento transacional associado.
- Aplica-se no interface um identificador rigoroso, inibindo visualmente a confusão com ausências temporais ligeiras e marcando o bloqueio da entidade como restrição inultrapassável à luz dos regulamentos de prática.
- Na premissa extrema de manipulação ou submissão indevida que contorne as restrições da interface, o motor lógico central aplica recusa estrita à operação, gerando o retorno de código fatal fundamentado pelo pressuposto jurídico desportivo inviabilizado.
- O estado gerador deste bloqueio é hermético e requer intervenção de exceção privilegiada, convertendo-se em permissão apenas mediante a validação formal de documentação clínica operada através das credenciais de perfil associadas à equipa de medicina no portal do clube.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US03, US20, US36 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Tentar forçar, via injeção direta de carga na API, a associação de um identificador de atleta com um estado documental caducado a um evento de convocatória transacional. O teste PASSA se o motor lógico intercetar a anomalia estrutural e devolver um código de falha fatal com recusa estrita de persistência, exigindo validação de credencial médica para transição de estado.

**Justificação / Dependências:** Respondendo à exigência crítica do Dr. Nuno Ramos por proteção legal imediata, conforme deliberado na Ata 01, este requisito é a "trava de segurança" máxima da plataforma. Funciona como uma barreira arquitetural cega que se sobrepõe a qualquer permissão desportiva, garantindo a conformidade com a lei desportiva ao tornar informaticamente impossível a inclusão de um atleta não certificado nas atividades de campo.

**Fontes de Origem:** US36, Ent. Nuno, Ata 01.

---

### [RF-16] — Motor de Tradução de Prontidão e Máscara de Dados (Semáforo Clínico)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-16] — Motor de Tradução de Prontidão e Máscara de Dados (Semáforo Clínico) |
| **Área do Sistema** | Departamento Médico / Operações de Relvado |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O sistema deve calcular continuamente o estado de prontidão desportiva de cada atleta, derivando-o de forma estrita e automática do seu processo clínico atual (ocorrências ativas transacionadas no [RF-17]).
- Por predefinição, na ausência de ocorrências clínicas ativas e garantida a conformidade de validação do EMD, o motor do sistema atribui o estado de aptidão total, garantindo ao utilizador técnico liberdade sistémica de alocação desportiva.
- Sempre que um perfil clínico procede à abertura ou atualização de uma ocorrência, o sistema invoca internamente um motor de mascaramento de dados (*Data Masking* — RGPD). Este algoritmo converte o grau de gravidade médica num mapeamento funcional padronizado (identificador de prontidão clínica) transposto para as vistas do corpo técnico, omitindo categoricamente qualquer propriedade semântica de diagnóstico (patologias, sintomas).
- Exigindo a patologia um estado de interrupção absoluta (paragem), o sistema atua como barreira arquitetural bloqueante nas instâncias de Convocatória [RF-04] e listas de presença [RF-01], revogando a capacidade de seleção do Treinador e emitindo um indicador de inaptidão retida.
- Ditando a ocorrência um cenário de condicionamento relativo, o motor concede a manutenção da propriedade de convocatória e marcação, injetando todavia um marcador de condicionamento de esforço (estado cautelar) mapeado à entidade. A interação com este indicador confere ao Treinador acesso exclusivo à componente não-patológica das indicações (plano tático terapêutico ou restrição de movimentos).
- Em cenário de sobreposição sistémica de estados de indisponibilidade (ex: conflito entre baixa médica e falta justificada na escola), o motor clínico exerce precedência lógica. Não obstante, o vetor clínico subordina-se de forma hierárquica às interdições legais burocráticas: um estado de inaptidão decretado pela Secretaria (ex: expiração de identificação civil) invalida de forma imediata o estado clínico de aptidão, assegurando a conformidade legal do clube através da primazia do bloqueio burocrático na interface técnica.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US04, US37 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma transação de atualização clínica que imponha um estado de interrupção absoluta a um atleta. O teste PASSA se o algoritmo de mascaramento abstrair a patologia da resposta estruturada, transitar a entidade desportiva para um estado de inaptidão retida e o SGBD revogar as propriedades lógicas de seleção nos vetores transacionais de presença e convocatória.

**Justificação / Dependências:** Nascido do consenso mediado na Ata 01 para resolver o conflito entre o sigilo médico e a necessidade de planeamento tático, este módulo atua como uma camada de abstração de dados (*Data Masking*). É arquiteturalmente vital pois garante o cumprimento estrito do RGPD, removendo a intervenção manual na alteração de "cores" e garantindo que o Treinador vê o reflexo informático em tempo real do que o Médico documentou legalmente, controlando as regras de negócio binárias (bloquear/permitir).

**Fontes de Origem:** US37, Ent. Miguel, Ent. Nuno, Ata 01.

---

### [RF-17] — Abertura e Evolução Estruturada de Ocorrências Clínicas

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-17] — Abertura e Evolução Estruturada de Ocorrências Clínicas |
| **Área do Sistema** | Departamento Médico |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Deve constar na arquitetura uma interface reservada a dossiês médicos, exposta exclusivamente aos identificadores de sessão providos de privilégios clínicos, operável a partir da visualização da entidade.
- A iniciação do processo clínico exige o fornecimento paramétrico obrigatório de metadados: marcação cronológica de início, tipificação normalizada da ocorrência, região afetada, indicação terapêutica narrativa, horizonte de retoma e a taxonomia de gravidade incidente sobre a capacidade desportiva (interrupção total ou restrição condicionada).
- O sistema suporta o ciclo de vida evolutivo da ocorrência através de um registo cronológico de entradas. Cada atualização gera uma nova submissão de evolução no histórico, preservando integralmente os estados anteriores e permitindo registar alterações no grau de restrição, no prognóstico temporal e no protocolo de recuperação.
- A transação das submissões (criação ou novas entradas de evolução) encontra-se sujeita à avaliação dos requisitos de preenchimento. A deteção de propriedades obrigatórias omitidas força o cancelamento da escrita e aciona uma notificação validatória expondo a falha.
- Após validação, o motor persiste a nova entrada no histórico clínico de forma imutável, vinculando indissociavelmente a marcação temporal ao identificador do profissional clínico responsável. O sistema assegura que todas as iterações da ocorrência são preservadas para fins de auditoria, comunicando síncronamente o estado de gravidade mais recente ao Motor de Prontidão [RF-16].

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US38 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um payload para abertura de ocorrência clínica omitindo os metadados de taxonomia de gravidade desportiva, seguido de uma transação com preenchimento paramétrico completo. O teste PASSA se a API rejeitar a primeira operação por anomalia estrutural e, na segunda, o motor persistir a evolução clínica de forma imutável vinculada ao identificador do profissional, sincronizando o registo com o motor de prontidão.

**Justificação / Dependências:** Exigido pelo Dr. Nuno Ramos para suportar a eventual ativação de seguros desportivos, este módulo converte o reporte informal de sintomas num processo clínico estruturado e rastreável. Arquiteturalmente, este ecrã assume o papel de "Génesis de Dados": ao embutir a decisão de gravidade dentro do formulário médico, garante que nenhuma interdição ou condicionamento desportivo [RF-16] possa existir no sistema sem um diagnóstico clínico legalmente preenchido e assinado a suportá-la.

**Fontes de Origem:** US38, Ent. Nuno.

---

### [RF-18] — Interdição Sistémica de Utilização Desportiva para Atletas em Baixa Médica

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-18] — Interdição Sistémica de Utilização Desportiva para Atletas em Baixa Médica |
| **Área do Sistema** | Operações de Relvado / Departamento Médico |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- O sistema estabelece uma rotina de monitorização permanente dependente do mapeamento de estados da camada clínica associados a cada registo ativo de praticante.
- No momento em que o modelo relacional de um atleta assume um estado de suspensão de prática formal ([RF-17]), a arquitetura desencadeia um mecanismo de barreira transversal que revoga todas as aptidões competitivas e propriedades de escalonamento operacionais do indivíduo.
- No contexto das interfaces táticas (ex. registo presencial [RF-01]), o algoritmo anula as operações standard inerentes ao atleta, preenchendo esse espaço transacional com um identificador de visualização restritiva apontando um enquadramento de retenção pelo núcleo clínico.
- No módulo de definição formal de competição ([RF-04]), a camada restritiva suprime qualquer funcionalidade de integração no elenco oficial, desativando a capacidade de seleção e enfatizando o bloqueio no ecrã do responsável técnico.
- Ocorrendo tentativas lógicas que procurem o contorno das suspensões do frontend e operem atribuições de participação desportiva, a barreira do backend assegura proteção absoluta abortando o processo de alocação e escalando um erro crítico descritivo da intransponibilidade do estado de baixa clínica.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US39 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter via injeção direta de payload a alocação de um identificador de atleta com estado relacional de suspensão clínica ativa a uma matriz formal de competição. O teste PASSA se a barreira transversal intercetar o comando no backend, abortar a consolidação lógica no SGBD e devolver um código de erro crítico fundamentando a intransponibilidade normativa do registo clínico.

**Justificação / Dependências:** Refletindo o consenso estabelecido na Ata 01 para mitigação de risco e proteção da saúde dos praticantes, este requisito atua como a firewall central de operações. Estabelece a supremacia da avaliação médica sobre as necessidades técnicas, garantindo de forma automatizada e inflexível que um jogador lesionado fica invisível para a gestão de esforço do Treinador.

**Fontes de Origem:** US39, Ent. Nuno, Ata 01.

---

### [RF-19] — Encerramento de Processo Clínico e Emissão de Alta Médica

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-19] — Encerramento de Processo Clínico e Emissão de Alta Médica |
| **Área do Sistema** | Departamento Médico |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- Deve existir na interface um mecanismo de transição de estado terminal de alta clínica, adstrito a instâncias de autorização rigorosa pertencentes ao grupo clínico, operável a partir de eventos já transacionados e abertos em dossiê ativo [RF-17].
- A consolidação do fecho do processo está intrinsecamente vinculada ao provimento mandatório de um relatório sintetizado (parecer descritivo).
- O processamento obriga o sistema a atestar a fidelidade da permissão do autor perante o modelo RBAC: a não identificação no token associado ao perfil de saúde despoleta a recusa instantânea da operação via interdição explícita de segurança arquitetural.
- Simultaneamente, o avaliador da requisição recusa qualquer prosseguimento enquanto o corpo explicativo formal associado à liberação for nulo ou omisso.
- Satisfeitas as condicionantes operacionais e autoritativas, o motor altera definitivamente o estado relacional da ocorrência para o contexto de conclusão, delegando as consequências e propagação informativa no módulo conversor de restrições [RF-16].
- O referido motor ([RF-16]) varre condicionalmente a entidade. Excluindo instâncias paralelas de diagnóstico ainda ativas, restabelece a premissa de aptidão de prática, mantendo-se refém da reavaliação transversal do requisito [RF-15]: se os prazos de documentos atestativos exibirem perdas de conformidade, o praticante salta contiguamente da inaptidão fisiológica para inaptidão civil, barrando contornos burocráticos pela simples libertação da estrutura de saúde.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US40 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um pedido de transição para estado terminal de alta médica omitindo o corpo explicativo associado ou utilizando um token RBAC desprovido de privilégios de saúde. O teste PASSA se o motor intercetar a falha de premissas rejeitando a operação instantaneamente; e se, com validação positiva, o modelo transitar para conclusão delegando o recálculo de aptidão no motor associado.

**Justificação / Dependências:** Garantindo a exigência médica de rastreabilidade inalterável, este requisito atua como o "Fecho da Pasta" da ocorrência. A validação estrita do perfil no momento do clique vincula informaticamente o ato da alta ao profissional de saúde, assegurando um rasto de auditoria legal. A sua delegação de estado para o Motor [RF-16] garante que o sistema nunca entra em conflito com outras regras de negócio (como a falta de EMD ou outras lesões simultâneas).

**Fontes de Origem:** US40, Ent. Nuno.

---

### [RF-20] — Portal Centralizado do Utilizador

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-20] — Portal Centralizado do Utilizador |
| **Área do Sistema** | Portal do Utilizador |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- O modelo central de apresentação focado no cliente externo (Encarregados de Educação e praticantes associados) assenta num ponto analítico de convergência consolidado após credenciação no sistema.
- A organização do espaço virtual obedece a uma divisão lógica de acesso à base transacional, segmentada na apresentação formal do envolvimento técnico/burocrático perante a administração de fluxo contributivo.
- Na visão técnica, a plataforma processa a leitura não destrutiva do espelho orgânico da instituição: renderização das integrações nos espetros competitivos e compilações longitudinais da relação temporal consumida em dinâmica desportiva.
- Incorporado nesta estrutura contextual existe um gestor paramétrico de ativos passivos (entregas de assets), facultando o envio regulamentado de instâncias digitais de formalização desportiva. O preenchimento da taxonomia obriga ao mapeamento do ficheiro num leque restritivo de definições admitidas na arquitetura administrativa.
- Esta dinâmica modela as necessidades de input baseadas no catálogo. Por exemplo: invocando o cenário do ficheiro inerente à medicina desportiva, o motor estende o limite da requisição paramétrica de modo a obrigar à transação explícita do metadado de validade legal por intermédio da submissão cronológica paralela à imagem.
- O módulo de upload deve aceitar a submissão de documentos. Ficheiros inválidos devem ser rejeitados, antes do envio ao servidor, devolvendo uma mensagem de erro identificando a falha exata (formato inválido ou tamanho excedido).
- Após receção certificada, a instância do documento persiste num limbo operacional de bloqueio sistémico (aguardando certificação humana), operando em simultâneo como gatilho no motor de recados, gerando requisições aos canais de avaliação.
- Na lógica das relações financeiras enquadrada no portal, instaura-se de forma irreversível uma filosofia estática e referencial. O consumo restringe-se a sumários consolidados do modelo contributivo (documentação de obrigações assumidas e passadas e cópias de evidência faturada geradas pelos serviços administrativos).
- Em conformidade, todos os controlos que insiram lógicas transacionais puras neste domínio estão sumariamente extirpados deste painel. O ambiente impõe bloqueio sistémico absoluto e preventivo a lógicas interativas de liquidação remota, acautelando unicamente as instâncias analíticas sobre o repositório consolidado.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US20 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter o carregamento documental de um EMD omitindo a transação do metadado de validade legal, e em seguida injetar uma instrução remota de liquidação financeira. O teste PASSA se a arquitetura recusar a primeira instância por insuficiência paramétrica e aplicar bloqueio absoluto à segunda tentativa, mantendo o consumo do domínio financeiro num contexto inviolável de estrita leitura.

**Justificação / Dependências:** Este requisito elimina a fratura de experiência entre o consumo de informação desportiva/documental e a consulta financeira, concentrando num único ponto autenticado toda a experiência de *front-office*. Arquiteturalmente, o Portal do Utilizador fecha o ciclo de dados ao expor de forma passiva a informação gerada pelos Treinadores [RF-01, RF-09], atuar como ponto de entrada para dados externos (justificações [RF-02] e exames [RF-14]) e assegurar transparência contributiva sem abrir canais transacionais remotos.

**Fontes de Origem:** Inquérito Q6, Q7, Q11, Q15, Q17, Q18, US20.

---

### [RF-21] — Gestão Centralizada e Validação de Documentos Oficiais

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-21] — Gestão Centralizada e Validação de Documentos Oficiais |
| **Área do Sistema** | Secretaria / Departamento Médico |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Deve existir um módulo transacional de verificação documental, acessível a partir da base operacional da Secretaria e do Departamento Médico.
- O sistema compila sob demanda as filas de processamento pendentes, expondo os carregamentos digitais promovidos pelos utilizadores externos através do Portal do Utilizador [RF-20] que carecem de certificação formal.
- A interação com o registo documental aciona a renderização da instância do ficheiro. O motor da aplicação impõe uma segregação estrita de privilégios suportada pelo RBAC: a atribuição de visibilidade e deliberação sobre o EMD encontra-se blindada estritamente aos perfis da esfera clínica, ocultando ativamente a sua existência aos perfis administrativos. Concomitantemente, a Secretaria assume a delegação para consumo e validação do foro civil e institucional (identificação e protocolos).
- O avaliador competente (Médico ou perfil de Secretaria) analisa a integridade da submissão e regista a sua deliberação formal (certificação ou invalidação). Nos cenários de invalidação documental, a arquitetura exige a injunção de um parecer deliberativo obrigatório (justificação de inconformidade), sob pena de rejeição sistémica da transação.
- Confirmando-se a certificação, o sistema atualiza autonomamente as entidades relacionais (ex: validade temporal no perfil base do atleta), desativa as interdições operativas vigentes associadas àquela omissão documental e atua como gatilho para notificação de fecho do fluxo ao requerente.
- Consolidando-se a invalidação, o sistema reverte a submissão, arquiva a justificação de falha para memória futura e aciona o motor de comunicações central, disparando um alerta instrucional estruturado que incorpora o parecer técnico e canaliza o utilizador a reiterar a sua submissão no Portal do Utilizador [RF-20].

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US20 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma transação de invalidação documental omitindo a injeção do parecer deliberativo obrigatório, e subsequentemente submeter a mesma invalidação com a justificação preenchida. O teste PASSA se o sistema rejeitar a primeira operação por anomalia de conformidade e, na segunda, o motor reverter a submissão no SGBD, arquivar a justificação estruturada e acionar o gatilho de notificação para o requerente.

**Justificação / Dependências:** Este requisito fecha o ciclo de digitalização documental e resolve o buraco lógico entre o portal do cliente e a autoridade médica. Em vez de a base de dados ser apenas um repositório passivo de ficheiros, o sistema cria um fluxo de trabalho (workflow) onde a secretaria/médico atua como filtro de qualidade. Isto garante que ficheiros inválidos ou ilegíveis submetidos pelos pais não corrompem a integridade dos bloqueios automáticos de segurança.

**Fontes de Origem:** US20, Inquérito Q15.

---

### [RF-22] — Sistema de Autenticação, Gestão de Sessões e Controlo de Acessos Baseado em Funções (RBAC)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-22] — Sistema de Autenticação, Gestão de Sessões e Controlo de Acessos Baseado em Funções (RBAC) |
| **Área do Sistema** | Segurança / Administração de Sistema |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- O sistema deve implementar um mecanismo de autenticação centralizado (Gateway), exigindo credenciais de acesso para a entrada na plataforma.
- O modelo associa a sessão ao mapeamento hierárquico das funções (RBAC) do utilizador, adaptando dinamicamente a renderização das interfaces e ocultando componentes interditos ao perfil atuante.
- Em operações que requeiram leitura controlada ou persistência de transações, atua um validador de integridade de sessão em background, garantindo o cruzamento entre as permissões base e a propriedade sobre a entidade alvo.
- A constatação de qualquer tentativa de adulteração nas regras do perfil RBAC despoleta o corte imediato na execução, retornando falha por inexistência de privilégios sobre a operação solicitada.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US11 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma requisição de leitura controlada ou persistência transacional utilizando um identificador de sessão ativo acoplado a um perfil RBAC desprovido de privilégios sobre a entidade alvo. O teste PASSA se o validador de integridade intercetar a falta de permissões em background, cortar a execução da operação no backend e retornar uma falha arquitetural por ausência de privilégios.

**Justificação / Dependências:** Derivado das necessidades de isolamento de equipas (US27) e exclusividade de decisões clínicas (Ata 01), este mecanismo é a fundação da segurança operacional do clube. Arquiteturalmente, este controlo de acessos por função (RBAC) substitui a necessidade de passwords específicas para cada ação, garantindo que o Treinador apenas atua sobre o plantel que lhe foi alocado [RF-07] e bloqueando sistemicamente a possibilidade de qualquer perfil não-médico alterar estados de lesão.

**Fontes de Origem:** Engenharia/Segurança deduzida de US11, Ata 01.

---

### [RF-23] — Motor de Mascaramento de Dados Sensíveis e Conformidade com RGPD

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-23] — Motor de Mascaramento de Dados Sensíveis e Conformidade com RGPD |
| **Área do Sistema** | Segurança / Privacidade de Dados |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- O sistema operacionaliza uma camada controladora de abstração aplicada aos registos classificados como Informação de Identificação Pessoal (PII), indexada condicionalmente aos privilégios do utilizador (RBAC).
- Exige-se a supressão ativa da exibição de propriedades PII (contactos, moradas e identificação tributária) perante perfis do enquadramento desportivo e técnico, garantindo acesso livre apenas aos dados do próprio perfil ou por hierarquias legalmente justificáveis.
- O tratamento de atributos clínicos suporta-se num redirecionamento lógico onde a inibição da taxonomia médica nos canais generalistas é delegada para tradução interativa conforme as regras do motor clínico.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US12, US39 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um pedido de extração de uma entidade desportiva contendo PII e taxonomia clínica detalhada através de uma credencial estritamente técnica. O teste PASSA se a camada controladora de abstração suprimir ativamente os atributos PII do payload de resposta e converter os dados médicos brutos em propriedades limitadas pelo motor de prontidão, prevenindo a exposição de dados sensíveis.

**Justificação / Dependências:** Respondendo à exigência estrita de sigilo ético e legal (Ata 01) e ao cumprimento do RGPD, este motor atua como a última linha de defesa jurídica do clube. Ao blindar os dados pessoais nas vistas dos treinadores, previne a exposição acidental de dados de menores em ecrãs partilhados ou acessos indevidos, mitigando riscos de responsabilidade civil.

**Fontes de Origem:** US39, Ata 01, Ent. Nuno.

---

### [RF-24] — Motor Global de Auditoria (Audit Trail)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-24] — Motor Global de Auditoria (Audit Trail) |
| **Área do Sistema** | Segurança / Administração de Sistema |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- A base de dados requer a instauração incondicional de um serviço registador estruturado de eventos cruciais transacionados na plataforma, englobando sem limitações os contextos operacional, administrativo, médico e transacional.
- Compõem de forma basilar as instâncias passíveis de indexação as conversões de propriedades clínicas e burocráticas sensíveis, finalizações logísticas (concessão e validação formal de documentação técnica desportiva [EMD] ou financeira), alterações nas referências estruturais de acesso organizacional e deliberações documentadas por alteração unilateral do contexto base.
- Cada iteração é processada através de um registo granular hermético contendo por definição: chave única descritiva do ator, o timestamp exato sincronizado, a fonte modular, o tipo intrínseco do delta relacional focado e os vetores da variável em formato bruto (estados antecedentes e transformados), coabitando ainda com as impressões digitais de acesso de rede sempre que passível.
- Qualquer tentativa de modificação deve ser rejeitada sistemicamente pela camada de dados com erro explícito.
- O escrutínio sobre o painel global exige acessos providos sob a premissa hierárquica suprema enquadrada à manutenção do sistema, gerindo derivações permissivas para consulta de entidades de fiscalização.
- Na consulta à entidade relacional, o sistema promove a interseção multidimensional (cruzamento dinâmico paramétrico perante origens e tipos) garantindo extrações absolutas estruturadas no formato cronológico certificado à prova de adulteração fiscal.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US14, US41 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma alteração a uma entidade relacional no sistema e, em seguida, injetar um comando direto na base de dados com vista a expurgar a respetiva entrada gerada no histórico de auditoria. O teste PASSA se o SGBD consolidar a primeira ação registando a chave do ator, o timestamp e o delta dos vetores (antes/depois), e rejeitar sistemicamente a segunda operação devolvendo um erro por violação de imutabilidade relacional.

**Justificação / Dependências:** Este requisito estabelece o cofre único de rastreabilidade da plataforma e elimina a fragmentação entre trilhos clínicos, desportivos e financeiros. Funciona como uma blindagem legal, operacional e contabilística da instituição, assegurando que todas as decisões críticas — desde a elegibilidade clínica até à anulação de faturas ou liquidações manuais — fiquem formalmente vinculadas ao seu autor de forma auditável, íntegra e definitiva.

**Fontes de Origem:** US41, Entrevista CEO, US14, Engenharia/Segurança deduzida de Ent. Nuno, Ata 01.

---

### [RF-25] — Integração com Gateway de Comunicações (Push e Email)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-25] — Integração com Gateway de Comunicações (Push e Email) |
| **Área do Sistema** | Infraestrutura / Comunicações |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O modelo central institui um motor distribuidor acionado sob invocação estruturada oriunda de gatilhos operacionais, como a publicação de convocatórias [RF-05], ou eventos autogerados nas varreduras administrativas [RF-14].
- O processamento e envio de notificações devem ser executados em segundo plano (background), de forma assíncrona, garantindo que a interface do utilizador emissor não é bloqueada ou afetada por latência durante a expedição das mensagens.
- O sistema deve adaptar os dados recebidos a matrizes preestabelecidas (templates), assegurando a formatação concisa para notificações Push e a injeção estruturada de conteúdo para e-mails institucionais.
- O sistema deve prever um mecanismo de tolerância a falhas face ao gateway de envio externo. Em caso de anomalia na comunicação, o motor deve intercetar a recusa e transitar o registo da notificação para um estado de falha persistente.
- Os eventos de falha na expedição devem ser indexados no histórico oficial e disponibilizados no painel de administração, permitindo a deteção atempada de e-mails inválidos e viabilizando o reenvio manual ou correção de dados.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US07, US35 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter o acionamento de um gatilho de notificação forçando uma simulação de rejeição pelo gateway de envio externo. O teste PASSA se o motor executar a transação de forma assíncrona, intercetar o erro de comunicação sem bloquear o fluxo do sistema e alterar o estado do registo para falha no indexador administrativo.

**Justificação / Dependências:** Este motor garante que a comunicação oficial do clube é profissional, escalável e auditável. A remoção de lógicas transacionais bloqueantes em favor da execução em background assegura a fluidez da aplicação principal. A introdução de uma política de reenvio automático protege a instituição, permitindo auditar se os alertas de segurança e obrigações desportivas foram entregues ou retidos, fechando o ciclo de contacto com as famílias sem esforço humano constante.

**Fontes de Origem:** US07, US35, Inquérito Q14.

---

### [RF-26] — Gestor de Tarefas Agendadas (Automação de Background)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-26] — Gestor de Tarefas Agendadas (Automação de Background) |
| **Área do Sistema** | Infraestrutura / Automação |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O sistema deve integrar um motor de agendamento capaz de executar rotinas em background de forma assíncrona e paralela, sem necessidade de estímulos de sessão de utilizador.
- O motor deve permitir a configuração de janelas temporais (horários e periodicidade) para a invocação automática das rotinas de auditoria administrativa, desportiva e financeira definidas no catálogo de requisitos.
- Compete ao motor disparar a rotina de varrimento de caducidades documentais, delegando a lógica de validação e emissão de alertas ao módulo [RF-14].
- O sistema deve atuar como gatilho cronológico para o fecho de ciclos de vida de eventos desportivos, invocando as regras de bloqueio de escrita definidas no [RF-10].
- O gestor de tarefas deve invocar periodicamente os serviços de auditoria de saldos e incumprimento, processando as regras lógicas de provisão e notificação financeira conforme os requisitos [RF-25] e [RF-29].
- Perante a deteção de falhas de submissão dentro dos prazos, o motor deve registar autonomamente as anomalias no painel de monitorização técnica [RF-11].
- O resultado de cada execução (sucesso ou *stack trace* de falha) deve ser persistido de forma imutável no motor de auditoria [RF-24].

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US21, US31, US32, US35 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter a invocação paramétrica do motor de tarefas agendadas num cenário de base de dados contendo instâncias de documentos médicos caducados e fichas de jogo ativas para lá do prazo de 24 horas. O teste PASSA se a rotina executar assincronamente sem estímulo de sessão, transitar o estado relacional das fichas transacionais para bloqueado, acionar as diretivas no motor de comunicações e persistir o registo formal de execução no módulo de auditoria.

**Justificação / Dependências:** A substituição da monitorização humana por rigor computacional responde à urgência de proatividade exigida por 67% dos utentes (Q18) e alivia o stress operacional da Secretaria, garantindo que as regras de negócio críticas — desde o bloqueio legal de exames até à recuperação de crédito — sejam cumpridas sem falhas. Arquiteturalmente, este gestor assegura a integridade absoluta da base de dados e a segurança jurídica do clube ao automatizar a disciplina administrativa e financeira do ecossistema.

**Fontes de Origem:** US21, US31, US32, US35, Inquérito Q18.

---

### [RF-27] — Cessação de Vínculo e Arquivamento Histórico de Atletas

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-27] — Cessação de Vínculo e Arquivamento Histórico de Atletas |
| **Área do Sistema** | Direção Técnica / Administração Desportiva |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Obriga-se à existência de uma funcionalidade lógica de interrupção de contrato/vínculo desportivo, operacionalizada a partir do modelo de dados focado na entidade do atleta dentro do domínio da Direção.
- O processamento altera categoricamente o domínio da propriedade de estado da entidade ativa, migrando o seu referencial para um estado persistente inativo/arquivado, vinculando imperativamente à transação o preenchimento das metainformações explicativas da cisão e o timestamp da eficácia.
- Efetuada a transição orgânica, a estrutura promove de forma propagada uma suspensão transversal nas dependências operacionais em tempo real: o ID da entidade deixa de ser enumerado e passível de integração pelos Treinadores em todas as áreas transacionais da época ativa (ex: interfaces de controlo de chamadas [RF-01], alocação técnica em convocatórias [RF-04] e grelhas de Prontidão Médica [RF-16]).
- A rotina aplica regras restritas que inibem em absoluto processos de delete cascade, conservando rigorosamente o somatório histórico de atuações, avaliações transversais, assiduidade e produção de infrações preexistentes, mantendo os seus ponderadores ativos no cálculo analítico dos modelos transversais de equipa do ano base desportivo [RF-13].
- No contexto de leitura e listagem, o acesso à referida entidade processa-se doravante estritamente através do mapeamento num subdiretório em arquivo fechado unicamente suportado por leitura analítica.
- Adicionalmente, a referida ação instiga a quebra técnica de propriedades transacionais no painel do parceiro cliente [RF-20], barrando inserções submetidas como justificações ou provas médicas para as datas compreendidas após a fixação da marca do desvínculo.
- A cessação do vínculo implica a anulação sistémica de todas as obrigações financeiras futuras (não vencidas) associadas ao atleta no motor de provisão [RF-29]. As obrigações que já se encontrem em estado vencido no momento da interrupção permanecem ativas e associadas ao perfil histórico da família para efeitos de cobrança pendente.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US26, US34 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um payload de cessação de vínculo para o identificador de um atleta ativo. O teste PASSA se o SGBD transitar o estado da entidade para inativo sem corromper as relações analíticas preexistentes, anular as faturas futuras não vencidas, mantendo intactas as dívidas vencidas, e aplicar bloqueio de rejeição estrutural a novas inserções oriundas do portal do cliente.

**Justificação / Dependências:** Essencial para manter a integridade referencial da base de dados e a memória histórica do clube, este requisito evita a corrupção de dados estatísticos que ocorreria com uma eliminação definitiva de registos. Arquiteturalmente, permite que o sistema mantenha relatórios de época fidedignos e coerentes, ao mesmo tempo que limpa as interfaces operacionais das equipas técnicas, garantindo que o fluxo de trabalho no relvado não é obstruído por atletas que já não pertencem à estrutura ativa.

**Fontes de Origem:** US26, US34.

---

### [RF-28] — Planeamento e Agendamento Recorrente de Sessões de Treino

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-28] — Planeamento e Agendamento Recorrente de Sessões de Treino |
| **Área do Sistema** | Direção Técnica / Operações de Relvado |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- É vital instituir uma componente paramétrica designada por matriz de plano de treinos operada sob a hierarquia de equipa, dotando os gestores e orientadores técnicos de controlo sobre o micro e meso ciclo desportivo.
- A componente arquitetónica do motor integra algoritmos de submissão por lote (Batch Creation), aliviando inserções singulares ao requerer mapeamentos transversais: indicação das repetições em padrão nos dias, vetor horário transversal standardizado e os limites fixos de início e fecho calendárico do padrão.
- Durante o processamento em lote, o sistema implementa validações rigorosas de colisão de calendário: caso um slot temporal gerado colida com um evento desportivo oficial já agendado no mesmo escalão [RF-08], o motor descarta autonomamente a criação dessa instância específica.
- Finalizada a operação, a aplicação instaura ciclos iterativos persistindo as instâncias desportivas válidas, assegurando que o processo global não sofre bloqueio transacional devido às omissões. Em simultâneo, exibe um relatório de conflitos detalhando as datas ignoradas, populando de imediato a infraestrutura da agenda consumível pela equipa.
- Prevê-se a manipulação pontual de isolados: o motor isola identificadores das instâncias de sessão, garantindo que modificações singulares à grelha tática ou suspensões de determinado evento operem na exclusividade desse evento não induzindo anomalias à coleção paramétrica de origem.
- A existência do mapeamento da sessão no modelo de dados consubstancia a dependência mestre para os registos dinâmicos dos sistemas adjacentes: só existindo a instância gerada se abrem os horizontes para extração tática [RF-01] e para o reconhecimento orgânico que autoriza a solicitação de justificação pelo parente [RF-02].

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US01, US02 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter um payload de processamento em lote para agendamento recorrente, no qual um dos vetores temporais gerados colida com um evento desportivo oficial já consolidado no SGBD para a mesma hierarquia. O teste PASSA se o algoritmo de validação descartar exclusivamente a instância em colisão, persistir as restantes iterações válidas na base de dados e devolver um relatório estruturado de omissões sem provocar bloqueio transacional na cadeia global.

**Justificação / Dependências:** Preenche a lacuna arquitetural de criação de eventos primários para o micro-ciclo desportivo. A implementação de um motor de agendamento em massa erradica a carga administrativa da criação manual de centenas de sessões por época. A injeção da lógica de resolução de conflitos protege a integridade da agenda face a eventos oficiais competitivos. Mais importante ainda, garante a fundação temporal estrita e obrigatória para que os módulos de assiduidade e avaliação de rendimento possam operar com total integridade relacional.

**Fontes de Origem:** Engenharia/Arquitetura deduzida da dependência estrutural da US01 e US02, Auditoria Claude.

---

### [RF-29] — Motor de Provisão Anual de Quotas e Mensalidades

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-29] — Motor de Provisão Anual de Quotas e Mensalidades |
| **Área do Sistema** | Gestão de Débitos |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- A arquitetura engloba uma rotina de geração de espelho de dívida provável, invocável sistemicamente na transição de época ou desencadeada de forma reativa a integrações de novas adesões no diretório consolidado.
- Sob a identificação paramétrica das propriedades do utilizador, o algoritmo gera as referências faturáveis. Para inscrições no início da época, gera 12 registos mensais e 1 quota; para atletas inscritos com a época em curso, o motor gera exclusivamente os registos correspondentes aos meses remanescentes até ao fecho da época ativa [RF-42], calculados a partir do mês de inscrição inclusive.
- Ao executar a partição lógica da obrigação financeira, o motor audita o estado da ficha do Encarregado de Educação associado [RF-36]. Caso o responsável detenha o estatuto ativo de Sócio, o algoritmo aplica a Mensalidade de Sócio; caso contrário, aplica por defeito a Mensalidade Base estipulada na matriz do Escalão.
- O processador obriga à verificação prévia de colisões na base, aplicando interdições rigorosas contra a geração de duplicação: a identificação paramétrica idêntica num par contendo cliente/mês anula submissões paralelas, prevenindo corrupção ou exigências duplicadas.
- Finda a execução, a série assume um estado de dívida futura, convertendo a informação em matriz para leitura interativa da administração e do sujeito devedor, servindo como a variável quantificadora base para todos os dashboards de performance financeira.
- O sistema garante que as dívidas vencidas e não liquidadas transitam como obrigações ativas e exigíveis na conta corrente do Encarregado de Educação, independentemente do encerramento cronológico ou arquivamento da época desportiva [RF-42].

**Critérios de Verificação:**

1. **Delegação de Negócio:** Regras transacionais validadas por Requisito de Arquitetura/Engenharia.
2. **Teste Sistémico de QA:** Submeter a invocação do motor de provisão financeira sobre uma entidade acoplada a um perfil ativo de Sócio. O teste PASSA se o algoritmo processar os registos de obrigação aplicando os montantes da Mensalidade de Sócio configurados no Escalão [RF-06], e o motor relacional rejeitar incondicionalmente a segunda submissão por colisão nas propriedades de identificação do cliente e período.

**Justificação / Dependências:** A fragilidade gerada pela incerteza contributiva (Q7) e a exigência de modernização (Q18) impõem este alicerce funcional. Ao consumir os valores definidos na estrutura hierárquica [RF-06] e cruzar com o estatuto associativo do Encarregado de Educação [RF-36], o motor assegura a distinção exata entre receita esperada, cobrada e em dívida, automatizando a política de preços do clube e garantindo a fiabilidade total da governação executiva.

**Fontes de Origem:** Inquérito Q7, Inquérito Q18, Requisito Derivado (Integridade com RF-06 e RF-36).

---

### [RF-30] — Painel de Bordo Estratégico de Indicadores de Tesouraria e Incumprimento

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-30] — Painel de Bordo Estratégico de Indicadores de Tesouraria e Incumprimento |
| **Área do Sistema** | Direção Executiva (Dashboard Financeiro) |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Deve existir uma interface agregadora principal focada no controlo de gestão, condicionada a acessos de privilégio executivo, atuando como recetáculo analítico primário após a autenticação.
- A arquitetura dispõe de controlos paramétricos de segmentação temporal e de tipologia de rubricas financeiras, permitindo a calibragem ativa da amostra extraída.
- O sistema aciona um motor de agregação síncrono que consolida na interface componentes analíticos de síntese, refletindo volumes exatos de disponibilidade financeira, rácios de capital captado e métricas globais de incumprimento.
- Perante a deteção de ciclos temporais ou paramétricos desprovidos de transações consolidadas, o motor interrompe o processamento de visualização de dados gráficos e emite uma notificação de sistema indicando insuficiência amostral para o período focado.
- O sistema suporta interações de aprofundamento contextual (drill-down) sobre os indicadores compostos, desencadeando a renderização de matrizes pormenorizadas onde a dívida é categorizada por tipologia ou vetor demográfico afetado.
- A resolução das submissões de filtragem obriga à aplicação de processos de atualização assíncrona do frontend (via comunicações em background), garantindo fluidez transacional sem induzir recarregamento global do contexto aplicacional.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US08, US15 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma requisição de agregação analítica aplicando parâmetros temporais rigorosos associados a um ciclo desprovido de matrizes de transações financeiras consolidadas. O teste PASSA se o motor síncrono intercetar o vazio amostral, interromper de imediato o cálculo dos indicadores compostos e devolver uma propriedade de erro não destrutiva atestando a insuficiência de dados para o vetor temporal submetido.

**Justificação / Dependências:** Para mitigar a fragilidade do controlo estratégico e a gestão "às cegas" num cenário de reestruturação financeira (PER), e face aos 73% de Encarregados de Educação que desconhecem a sua situação contributiva, este painel atua como vértice analítico da plataforma, cuja fiabilidade técnica depende estritamente da consolidação arquitetural dos fluxos financeiros registados de forma rigorosa na Secretaria.

**Fontes de Origem:** Entrevista CEO, US08, US15.

---

### [RF-31] — Monitorização Transversal de Ativos Sociais e Desportivos

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-31] — Monitorização Transversal de Ativos Sociais e Desportivos |
| **Área do Sistema** | Direção Executiva (Dashboard Operacional) |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- A plataforma prevê um módulo segmentado para escrutínio métrico da base demográfica corporativa, acessível às hierarquias de governação central.
- O motor algorítmico aciona autonomamente a extração primária de dados populacionais aquando da inicialização do componente, prescindindo de estímulos paramétricos iniciais pelo requerente.
- O sistema processa uma varredura integral ao diretório de entidades ativas e expõe indicadores quantitativos destacando a volumetria exata da regularidade associativa e a amplitude total de praticantes em contexto de validação estrita.
- Na formação da amostra, atua uma filtragem excludente inegociável que expurga da contagem estatística qualquer registo assinalado com inatividade, suspensão cautelar ou sob cativação de processamento documental, garantindo a integridade dos rácios.
- É disponibilizada uma matriz de controlos de filtragem multidimensional, providenciando ao utilizador ferramentas de segmentação demográfica (idade, escalão tático).
- Adicionalmente à exibição de métricas e disposições gráficas, o módulo providencia um mecanismo de extração física dos dados consolidados, viabilizando o transporte transacional para formatos analíticos padronizados (e.g., estrutura tabular e CSV).

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US09 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter a inicialização do componente de monitorização numa base de dados contendo registos ativos, suspensos e com pendências documentais. O teste PASSA se o motor algorítmico realizar a varrimento integral, expurgando os registos irregulares da contagem quantitativa final e viabilizando a extração do dataset consolidado em formato tabular (CSV).

**Justificação / Dependências:** A opacidade dos processos burocráticos e as filas morosas que impedem o CEO de obter dados exatos sobre a base social exigem uma solução de monitorização automatizada, que constitui a base para a avaliação estrutural do clube ao criar uma dependência arquitetural da integridade do master data unificado da Secretaria para a propagação imediata de alterações de perfis para os cálculos executivos.

**Fontes de Origem:** Entrevista CEO, US09.

---

### [RF-32] — Análise de Rentabilidade por Centro de Responsabilidade (Clube vs. SAD/Formação)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-32] — Análise de Rentabilidade por Centro de Responsabilidade (Clube vs. SAD/Formação) |
| **Área do Sistema** | Direção Executiva (Controlo de Gestão) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Obriga-se à existência de uma perspetiva restrita para auditoria de centros financeiros, enquadrada de forma exclusiva em níveis de autorização mestre orientados ao controlo de gestão.
- O interface faculta componentes de seleção estruturada, permitindo circunscrever o vetor temporal da consulta e isolar a entidade jurídica específica alvo de escrutínio.
- O sistema garante o processamento estanque pela aplicação de segregação transacional (filtros lógicos de domínio e segregação ao nível da aplicação/SGBD), separando os movimentos de caixa, dívida consolidada e fluxos operacionais dependendo do titular institucional do produto cobrado.
- Ultrapassada a fase de consolidação de dados, a interface devolve painéis agregadores independentes que espelham o rigor matemático inerente à relação de liquidez transacionada por esse centro jurídico.
- A componente integra a exibição em tempo real do indicador relativo de eficiência financeira (rácio de cobertura operacional), libertando recursivamente as capacidades métricas para instâncias de reconfiguração temporal sucessiva.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US10 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma consulta de auditoria de rentabilidade filtrando um centro de responsabilidade jurídico específico. O teste PASSA se o motor de persistência e a camada de negócio aplicarem a segregação transacional via filtros lógicos estritos, isolando os movimentos de caixa e dívida consolidada pertencentes exclusivamente ao titular institucional selecionado.

**Justificação / Dependências:** A confusão dos utilizadores perante a separação de cobranças e a necessidade estratégica de isolar o fluxo financeiro entre o Clube e a SAD tornam este requisito central para o cumprimento legal da autonomia financeira, introduzindo uma dependência arquitetural de isolamento lógico ao nível da aplicação e do SGBD, que assegura a transparência da transação monetária desde a origem.

**Fontes de Origem:** Entrevista CEO, US10.

---

### [RF-33] — Desdobramento Lógico de Receita por Entidade (*Internal Split*)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-33] — Desdobramento Lógico de Receita por Entidade (*Internal Split*) |
| **Área do Sistema** | Tesouraria e Faturação (Motor de Regras) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Jorge Barbosa |

**Descrição do Requisito:**

- O sistema deve integrar um motor de separação lógica de fundos acionado automaticamente no momento da liquidação de faturas [RF-38].
- Aquando da consolidação de um pagamento, o motor deve identificar o titular de proveito de cada rubrica de forma unívoca, consultando o mapeamento jurídico explícito (Associação vs. SAD) previamente parametrizado no [RF-06] para o respetivo Escalão.
- O sistema deve imputar os montantes correspondentes aos saldos contabilísticos das entidades respetivas de forma atómica e em tempo real, garantindo a integridade dos saldos independentes.
- Em caso de falha na categorização ou identificação da entidade jurídica destinatária, o sistema deve interromper a sequência operatória e abortar a transação financeira, impedindo a entrada de valores sem destino jurídico validado.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US17 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma transação de pagamento contendo rubricas mistas (Clube e SAD). O teste PASSA se o motor realizar o desdobramento automático, creditando os valores exatos nos respetivos centros de responsabilidade e atualizando o estado dos documentos para liquidado no SGBD.

**Justificação / Dependências:** Para garantir a segregação financeira entre Clube e SAD exigida pelo CFO, sem reintroduzir a complexidade operacional manual, este requisito constrói um motor arquitetural de regras que injeta o recebimento de numerário no saldo virtual da entidade legal correta no ato da liquidação em secretaria, protegendo a integridade dos dados mestres e garantindo a autonomia contabilística.

**Fontes de Origem:** Entrevista CFO, Entrevista CEO, Ata-02, US17.

---

### [RF-34] — Painel de Monitorização de Fluxos de Caixa em Numerário

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-34] — Painel de Monitorização de Fluxos de Caixa em Numerário |
| **Área do Sistema** | Direção Financeira (Tesouraria Operacional) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- É vital instituir um módulo de escrutínio para os proveitos operacionais materializados fora da órbita digital direta, condicionado exclusivamente a tokens com perfil de autorização em domínios de contabilidade superior e de chefia de caixa.
- Mediante indicação paramétrica do espaço temporal de focagem, o sistema despoleta uma rotina de agregação sobre a massa total de liquidações formalizadas fisicamente na Secretaria, operando de forma nativa a desagregação métrica inerente ao titular empresarial associado àquela receção de valor.
- A recolha é estritamente vinculada à totalização dos identificadores transacionais que se validaram para um estado consumado (pagos) nesse intervalo balizado, distribuindo obrigatória e analiticamente a expressão final consoante os vetores dos canais de captação operados na tesouraria de balcão.
- O processamento origina uma matriz descritiva evidenciando somas efetivas retidas com desagregação baseada nos recetáculos de canal, dotando as chefias de funcionalidades de transição formal dos outputs para extensões regulamentadas nas rotinas tradicionais de prestação contabilística fora de sistema.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US18 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma rotina de agregação de liquidações presenciais para um intervalo temporal definido. O teste PASSA se o sistema extrair exclusivamente os identificadores transacionais em estado de pagamento consumado e desagregar analiticamente os totais financeiros conforme o titular empresarial associado a cada transação na base de dados.

**Justificação / Dependências:** Num modelo de pivotagem sem bancos, e face à urgência de modernização requerida por 67% dos Encarregados de Educação (Q18), a estabilidade da tesouraria do Clube passa a depender arquiteturalmente do cruzamento em tempo real entre a dívida processada pelo motor de provisão e as confirmações de "PAGO" submetidas ao balcão, garantindo à Direção Financeira uma ferramenta executiva blindada para avaliar desvios operacionais, validar o numerário em caixa e auditar taxas diárias de liquidação.

**Fontes de Origem:** Entrevista CFO, Entrevista CEO, Inquérito Q18, US18.

---

### [RF-35] — Motor de Pesquisa Unificada de Encarregados de Educação com Indicadores Visuais de Estado

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-35] — Motor de Pesquisa Unificada de Encarregados de Educação com Indicadores Visuais de Estado |
| **Área do Sistema** | Secretaria (Atendimento Front-Office) |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Média |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- A arquitetura da interface do operador requer a integração de um componente global de pesquisa unificada para localização rápida de perfis consolidados.
- O sistema deve iniciar a rotina de pesquisa apenas após o fornecimento de um mínimo de 3 caracteres alfanuméricos consecutivos equivalentes ao perfil biográfico ou tributário do indivíduo (NIF, ID).
- Para evitar a sobrecarga do servidor, a consulta à base de dados apenas deve ser disparada, impedindo o envio de chamadas autónomas a cada tecla pressionada.
- O sistema deve processar a consulta, devolver e apresentar os resultados na interface.
- A resposta devolve as instâncias encontradas, acoplando à entidade os identificadores lógicos de estado que atestam sumariamente a conformidade regular, a presença de passivos financeiros suspensos ou a existência de pendências documentais.
- A seleção unitária sobre o resultado processa a navegação orientada, alocando o ecrã à entidade alvo e evidenciando sistemicamente na sua entrada os vetores prioritários da gestão de bloqueios associados.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US19 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma consulta de pesquisa utilizando uma cadeia de 3 caracteres alfanuméricos (NIF ou identificador biográfico). O teste PASSA se o motor de pesquisa disparar a consulta à base de dados, retornar os registos correspondentes associados às suas propriedades lógicas de estado financeiro, clínico e burocrático, e permitir a alocação da sessão à entidade selecionada.

**Justificação / Dependências:** O estrangulamento do front-office causado pela alternância entre múltiplas aplicações de legado reflete-se na frustração de 39% dos inquiridos devido à lentidão presencial (Q6), impondo o desenvolvimento arquitetural de um ponto único de convergência de navegação altamente responsivo que, ao agregar instantaneamente o estado financeiro, clínico e burocrático na pesquisa, devolve fluidez crítica ao ritmo de atendimento do balcão.

**Fontes de Origem:** Entrevista Secretaria, US19.

---

### [RF-36] — Gestão Centralizada de Fichas de Encarregado de Educação e Hierarquias Familiares (Master Data)

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-36] — Gestão Centralizada de Fichas de Encarregado de Educação e Hierarquias Familiares (Master Data) |
| **Área do Sistema** | Secretaria (Gestão de Identidade e Perfis) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Deve operar uma área transacional primária agregada na entidade matricial familiar, consumível como ponto de navegação convergente para a gestão de dados administrativos e financeiros.
- O modelo permite atualizações à metainformação residencial e de contacto do Encarregado de Educação, impondo simultaneamente a manutenção das relações de filiação/tutela com os perfis de atletas dependentes [RF-41].
- No decurso da gravação, o sistema executa uma validação estrita de atributos únicos (NIF/ID Civil), impedindo a submissão de duplicados e garantindo a integridade do diretório biográfico.
- O algoritmo monitoriza a validade do vínculo associativo do Encarregado de Educação. Caso se verifique uma alteração no estado de Sócio que anule benefícios financeiros aplicados aos dependentes, o sistema emite uma notificação automática através do Gateway [RF-25].
- Finda a gravação, o sistema consolida o mapeamento hierárquico entre o Encarregado de Educação e os seus atletas associados. Esta ligação disponibiliza obrigatoriamente o estado de "Sócio" do responsável como parâmetro de decisão para o Motor de Provisão [RF-29], permitindo a aplicação diferenciada de mensalidades.
- O sistema deve invocar a recalibração das obrigações pendentes no motor de provisão [RF-29] sempre que o estatuto associativo do responsável seja alterado, garantindo a atualização imediata das tabelas de mensalidades aplicáveis face ao novo perfil do Encarregado de Educação.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US22, US24, US25 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma requisição de gravação de um perfil familiar partilhando um ID Civil já indexado no diretório base, seguida da alteração paramétrica de perda de vínculo associativo (Sócio) de um Encarregado ativo. O teste PASSA se a arquitetura inibir a primeira transação por quebra de atributo único, e, na segunda, consolidar a nova matriz relacional nos dependentes, acionando de imediato a ordem de recalibragem de faturas e o gatilho automático de notificação externa.

**Justificação / Dependências:** Este requisito estabelece a base de dados mestre necessária para unificar o histórico fiscal e operacional da família. Ao centralizar a gestão de contactos e a prova de vínculo associativo (Sócio) num único ponto, elimina-se a redundância de dados e assegura-se que o sistema financeiro [RF-29] saiba sempre qual a tabela de preços a aplicar, sem necessidade de intervenção manual ou cálculos retroativos complexos.

**Fontes de Origem:** Entrevista Secretaria, US22, US24, US25, Auditoria Claude.

---

### [RF-37] — Controlo, Validação e Bloqueio por Inconformidade Documental

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-37] — Controlo, Validação e Bloqueio por Inconformidade Documental |
| **Área do Sistema** | Secretaria (Gestão Burocrática e Inscrições) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Requisita-se a disponibilização analítica segmentada num componente visual agregado ao referencial do titular e ativado de forma sequencial com a exposição fidedigna da sua representação na view singular após submissão de busca.
- O agente institucional processa a verificação sistémica desencadeando a ação de auditoria parametrizada e indexada sobre as obrigações da inscrição daquela entidade no ano base transacional em curso.
- O motor algorítmico procede transversalmente na arquitetura cruzando obrigações predefinidas do quadro desportivo com o diretório e validade orgânica dos repositórios burocráticos associados.
- Perante um vácuo no preenchimento do storage parametrizado ou validade de selo cronológico sobreposta pelo período ativo, a rotina força rollback da transação bloqueando o fluxo do operador administrativo e realçando através de uma notificação intrusiva de barreira a inviabilidade orgânica subjacente de aprovação institucional.
- Resolvendo afirmativamente o rastreio da conformidade cruzada, o sistema converte permanentemente o parâmetro de identidade desportiva para um referencial legal de aptidão, originando capacidade matricial para alocação transacional posterior e emitindo formalmente os referidos identificadores da academia.

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US20, US36 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma instrução de certificação formal de identidade desportiva para uma entidade cujo histórico de preenchimento denota sobreposição do prazo de validade orgânica ativa. O teste PASSA se o motor de validação acionar um rollback à transação de aprovação e emitir uma notificação estrutural de barreira, impedindo a alocação do atleta na arquitetura desportiva.

**Justificação / Dependências:** Para eliminar a sobrecarga administrativa e o elevado risco de erro humano na verificação manual de documentos, este requisito implementa uma barreira sistémica de defesa legal que protege o clube contra coimas e responsabilidade civil, assegurando que apenas atletas em plena conformidade regulamentar sejam operacionalizados pelas equipas técnicas e médicas.

**Fontes de Origem:** Entrevista Secretaria, US20.

---

### [RF-38] — Registo de Pagamento ao Balcão e Geração de Fatura-Recibo em PDF

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-38] — Registo de Pagamento ao Balcão e Geração de Fatura-Recibo em PDF |
| **Área do Sistema** | Secretaria (Ponto de Atendimento e Cobrança) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Rafael Silva |

**Descrição do Requisito:**

- Requer a parametrização de um módulo front-office exclusivo a transações de recebimento físico ou imediato, apresentando num layout segmentado a listagem parametrizada de propriedades a liquidar providas do repositório pendente, permitindo controlos de seleção de arranjo condicional.
- A interação progressiva sob a matriz gera um mecanismo algorítmico subjacente focado na consolidação iterativa do quantitativo balizado, acompanhado sequencialmente por um discriminativo visual associado aos titulares proprietários das instâncias geradas (estruturas de centro de exploração ou dependentes).
- Processos de finalização sobre o subconjunto alvo colidem perante inconsistência interna em submissões alheias a instâncias categorizadas ativas de falha na cobrança prévia, ou ainda falha resolutiva por corrupção dos IDs de titularidade base a atribuir transação monetária.
- Exigência intrínseca na consolidação da gravação da receção implica alocação formal aos vetores definidos pela gateway orgânica presencial (formas tradicionais e monetárias de retenção). A ação de submissão declarativa transita status do produto e processa invocação síncrona aos predicados do repartidor orgânico estipulado no referencial do fluxo monetário legal subjacente.
- Confirmando e validando as instâncias referidas no repositório, efetiva-se uma ordem de publicação assíncrona orientada à biblioteca geradora documental para instanciar instantaneamente um documento descritivo final (*Fatura-Recibo*), preparado estritamente para conversão no posto de materialização da transação (print/download).

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US16, US23 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter uma instrução de recebimento transacional selecionando instâncias com ID de titularidade base corrompido, e, de seguida, um agrupamento válido de faturas pendentes. O teste PASSA se o módulo rejeitar a primeira operação com interrupção de consistência e, na submissão válida, transacionar sincronamente o status dos produtos, invocando os predicados lógicos do motor e ordenando a instanciação assíncrona do descritivo Fatura-Recibo formatado para impressão no recetáculo local.

**Justificação / Dependências:** Atuando diretamente na mitigação das filas morosas e na frustração operacional reportada por 39% dos Encarregados de Educação (Q6), este requisito reorganiza o fluxo de balcão para garantir rapidez e rigor financeiro, introduzindo uma dependência arquitetural entre a interface humana e a geração automática de comprovativos que assegura transparência total no ato da liquidação presencial.

**Fontes de Origem:** Entrevista Secretaria, Inquérito Q6, Ata-02, US23.

---

### [RF-39] — Emissão e Disponibilização de Cartão de Sócio/Atleta 100% Digital

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-39] — Emissão e Disponibilização de Cartão de Sócio/Atleta 100% Digital |
| **Área do Sistema** | Portal do Utilizador (Identidade e Acessos) |
| **Data** | 22 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Nuno Mendes |

**Descrição do Requisito:**

- Exige-se uma componente de acesso contínuo indexada prioritariamente aos fluxos móveis de front-office externo, possibilitando o acesso iminente à identificação digital e estado institucional do requerente.
- A renderização deste painel obedece ao consumo direto de credenciais originadas pela validação estrita da variável de sessão em memória, dispensando loops repetitivos de parametrização da credencial.
- O estado do cartão digital deve ser recalculado de forma reativa a cada carregamento da vista, auditando a grelha de atributos consolidados, nomeadamente a validade de repositórios financeiros e submissões clínico-legais.
- O cartão digital deve exibir estado bloqueado, suprimindo a geração do QR code e emitindo um marcador de estado de inaptidão associativa, sempre que o atleta registar 2 ou mais mensalidades em estado de dívida vencida há mais de 30 dias, ou apresentar qualquer interdição documental ou clínica ativa [RF-15, RF-37].
- No pressuposto da certificação normativa sem anomalia no histórico auditado, o sistema devolve um compilado de propriedades estruturadas do perfil e numeração oficial da associação, integrando adicionalmente a rotina geradora do código QR.
- O sistema deve gerar um QR code dinâmico com validade temporal para verificação de identidade.
- O processamento confere viabilidade tecnológica na conversão estritamente unida nos endpoints da arquitetura física das dependências associativas (postos de controlo, verificação externa e barreiras de catraca).

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** Regras transacionais validadas por Requisito de Arquitetura/Engenharia.
2. **Teste Sistémico de QA:** Submeter o carregamento da entidade digital de identificação utilizando uma sessão de utilizador que detém instâncias de dívida consolidada há mais de 30 dias. O teste PASSA se a propriedade da vista extrair a informação paramétrica do SGBD, suprimir ativamente a rotina geradora do QR code por recálculo de impedimentos e devolver um status desportivo blindado na matriz visual providenciada ao cliente externo.

**Justificação / Dependências:** Para mitigar o atrito físico e administrativo gerado pelo esquecimento do cartão tradicional (Q16) e responder à forte exigência por soluções mobile (Q18), a virtualização da identidade desportiva impõe uma arquitetura que cruza o estado financeiro e documental em tempo real, utilizando a emissão dinâmica do código QR como um poderoso mecanismo implícito de bloqueio por incumprimento.

**Fontes de Origem:** Inquérito Q16, Q18.

---

### [RF-40] — Controlo de Acessos Dinâmico Baseado em Perfis (RBAC) com Ocultação de Contexto Sensível

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-40] — Controlo de Acessos Dinâmico Baseado em Perfis (RBAC) com Ocultação de Contexto Sensível |
| **Área do Sistema** | Segurança e Gestão de Identidades (IAM) |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Crítica |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- Deve existir um validador central, do tipo *middleware*, acionado automaticamente como ponto de entrada em cada submissão ou requisição de navegação despoletada pela entidade autenticada.
- O sistema inibe o fornecimento direto de autorizações pelo cliente; a arquitetura extrai intrinsecamente a taxonomia de acesso embutida no token de sessão e cruza-a com o domínio alvo da requisição.
- O sistema impõe rejeição liminar da operação caso a entidade não demonstre delegação explícita na matriz de privilégios, bloqueando a comunicação com resposta padronizada de interdição de acesso e registando o desvio no audit trail.
- A camada de apresentação força a avaliação prévia das permissões, suprimindo proativamente componentes de interação, vistas de dados ou contentores de navegação categorizados fora do escopo do ator.
- Ultrapassada a avaliação matricial, a plataforma autoriza o consumo ao nível da base de dados, introduzindo filtros lógicos de negócio.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US11, US12, US13 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Injetar uma submissão de gravação transacional sobre um endpoint específico da API omitindo as permissões matriciais necessárias na taxonomia do token de acesso do utilizador. O teste PASSA se o middleware intercetar o desvio, aplicar bloqueio transacional liminar recusando o consumo à base de dados, instanciar a quebra no histórico de auditoria e forçar o corte da requisição antes da sua progressão na plataforma.

**Justificação / Dependências:** A imposição diretiva e médica de proteger ativamente o sigilo de dados operacionais exige uma fundação arquitetural de segurança incontornável no backend (*middleware*) que, validando tokens de sessão a cada pedido e filtrando nativamente os retornos da base de dados, assegura o cumprimento do RGPD e suprime a tensão interdepartamental ao garantir que cada perfil apenas manipula o contexto da sua competência legal.

**Fontes de Origem:** Entrevista CEO, Requisito Implícito de Engenharia, US11, US12, US13.

---

### [RF-41] — Gestão de Perfis de Atletas e Cadastro Biográfico Centralizado

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-41] — Gestão de Perfis de Atletas e Cadastro Biográfico Centralizado |
| **Área do Sistema** | Administração Desportiva / Secretaria |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve disponibilizar uma interface centralizada na Secretaria que permita a criação, consulta e edição de perfis individuais de atletas, servindo como o diretório biográfico principal da plataforma.
- A formalização do registo exige o preenchimento obrigatório da matriz biográfica (nome completo, data de nascimento, fotografia de identificação) e a associação incondicional a uma ficha de Encarregado de Educação/Responsável Financeiro [RF-36].
- Para atletas em situação de maioridade civil ou emancipação financeira, a associação obrigatória é suprida através da criação de uma ficha de Encarregado de Educação em nome do próprio atleta, garantindo a integridade do fluxo de faturação.
- No momento da criação do perfil, o sistema gera de forma automática um identificador único interno (UUID) para efeitos de integridade relacional na base de dados. O campo "Número de Sócio" é tratado como uma propriedade alfanumérica secundária, preenchida condicionalmente pela Secretaria apenas nos casos em que se verifique a efetivação do vínculo associativo do atleta.
- A edição de campos biográficos críticos (nome e data de nascimento) é restrita a utilizadores com privilégios de Administração de Sistema, sendo cada modificação obrigatoriamente registada no histórico de auditoria [RF-24].
- Após a gravação com sucesso, o perfil atua como repositório mestre de informação, ficando disponível para os processos de alocação a equipas [RF-07], verificação de elegibilidade clínica [RF-16] e processamento de obrigações contributivas [RF-29].

**Critérios de Verificação:**

1. **Delegação de Negócio:** O sistema deve cumprir integralmente os Critérios de Aceitação definidos na US22 (consultar Documento Principal).
2. **Teste Sistémico de QA:** Submeter a criação de um perfil de atleta desprovido da matriz de referência à ficha do Responsável Financeiro, e, simultaneamente, tentar alterar um campo biográfico crítico utilizando uma credencial ausente de privilégios superiores de sistema. O teste PASSA se o sistema inibir de imediato a persistência da criação por falha estrutural de hierarquia e intercetar a adulteração da data de nascimento com bloqueio de segurança e notificação correspondente.

**Justificação / Dependências:** Respondendo diretamente ao enunciado do projeto que exige o registo de atletas, este requisito materializa a operação CRUD fundamental de todo o ecossistema. Arquiteturalmente, estabelece a "Entidade Mestre": sem um perfil centralizado, a separação rigorosa entre utilizador desportivo (identificador único) e sócio pagante não seria possível, e os módulos dependentes de faturação e assiduidade não teriam um alvo de persistência.

**Fontes de Origem:** Entrevista Secretaria, US22.

---

### [RF-42] — Gestão, Configuração e Ativação de Época Desportiva

| Campo | Valor |
|---|---|
| **ID & Nome** | [RF-42] — Gestão, Configuração e Ativação de Época Desportiva |
| **Área do Sistema** | Administração / Secretaria |
| **Data** | 23 de Abril de 2026 |
| **Tipo** | Funcional |
| **Prioridade** | Alta |
| **Analista** | Diogo Moreira |

**Descrição do Requisito:**

- O sistema deve disponibilizar um módulo que permita a instanciação da entidade mestre da época desportiva, exigindo a injeção obrigatória de uma nomenclatura descritiva e dos limites cronológicos exatos (data de início e data de fecho).
- A entidade deve operar sob uma máquina de estados lógica estrita, contemplando três fases: *Em Planeamento*, *Ativa* e *Encerrada*.
- A criação de uma época futura aloca-a, por defeito, ao estado *Em Planeamento*. Este estado isolado permite configurações administrativas prévias sem interferir com o normal processamento transacional do ano letivo em curso.
- O sistema deve validar preventivamente a integridade cronológica da requisição. Em caso de sobreposição de datas com uma época já registada, a gravação deve ser liminarmente abortada.
- A arquitetura impõe que apenas uma única instância possa deter o estado *Ativa* em simultâneo.
- A transição deliberada de uma época de *Em Planeamento* para *Ativa* atua como um gatilho sistémico absoluto: encerra automaticamente a época transata, transitando os seus dados operacionais pendentes para o estado histórico de leitura estrita (*Encerrada*).
- A consolidação do estado *Ativa* instiga a plataforma a invocar autonomamente o motor de provisão [RF-29], passando o sistema a utilizar as datas recém-configuradas para a geração da partição lógica das obrigações mensais.

*Nota: As restrições transversais de desempenho, segurança e usabilidade estão especificadas na Secção 3.2.*

**Critérios de Verificação:**

1. **Delegação de Negócio:** Regras transacionais validadas por Requisito de Arquitetura/Engenharia.
2. **Teste Sistémico de QA:** Submeter uma época com coordenadas sobrepostas a uma época existente. O teste PASSA se o SGBD abortar a transação. Submetendo coordenadas válidas e forçando a transição de estado da nova época para "Ativa", o teste PASSA se o motor relacional transitar automaticamente a época anterior para "Encerrada" (leitura estrita) e inicializar as sub-rotinas de faturação com base nos novos limites.

**Justificação / Dependências:** Preenche uma falha crítica de abstração temporal no sistema. É a entidade âncora que permite simular os ciclos anuais competitivos através de parâmetros dinâmicos. Sem este módulo, o sistema de faturação [RF-29] não possuiria limites de início e fim para as provisões mensais, e os dashboards analíticos [RF-12, 13] careceriam de segmentação longitudinal face ao passado histórico.

**Fontes de Origem:** Requisito Implícito de Engenharia, Entrevista Secretaria.

---

## 3.2 Requisitos Não-Funcionais

Os Requisitos Não-Funcionais (RNF) estipulam as métricas de qualidade, as restrições arquiteturais e as diretrizes de conformidade regulamentar a que o SIGD está estritamente subordinado. Estes atributos transversais não descrevem processos de negócio, mas definem a resiliência, a segurança e a viabilidade tecnológica da infraestrutura subjacente.

---

### Desempenho

Métricas focadas na capacidade de resposta do sistema, definindo tempos máximos de latência, tolerância a picos de carga e limites de eficiência no processamento de dados, por forma a garantir uma experiência fluida mesmo sob stress operacional.

---

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