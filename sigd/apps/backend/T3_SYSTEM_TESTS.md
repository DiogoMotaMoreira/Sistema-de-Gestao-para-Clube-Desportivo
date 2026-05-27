# T3 — Testes de Sistema (E2E Manual)
**Projecto:** SIGD — Boavista FC
**Data:** 26/05/2026
**Executor:** Rafael Silva / Nuno Mendes
**Ambiente:** Backend localhost:8080 | Frontend localhost:8082
**Instruções:** Para cada teste, preenche "Resultado Real" e "Estado".
Estado: ✅ PASSA | ❌ FALHA | ⚠️ PARCIAL | ➖ NÃO TESTADO

---

## Sumário de Execução

| Bloco | Total | ✅ | ❌ | ⚠️ |
|---|---|---|---|---|
| Bloco 1 — Auth + Admin | 6 | 3 | 0 | 3 |
| Bloco 2 — Secretaria | 6 | 0 | 3 | 3 |
| Bloco 3 — Médico/Clínica | 7 | 4 | 0 | 3 |
| Bloco 4 — Treinador | 7 | 1 | 2 | 1 |
| Bloco 5 — Portal EE | 5 | 1 | 0 | 4 |
| Bloco 6 — CEO/CFO/DT | 5 | 2 | 0 | 3 |
| **TOTAL** | **36** | **11** | **5** | **17** |

---

## Bloco 1 — Autenticação e Administração

**Pré-condição:** Backend a correr em localhost:8080.
Frontend a correr em localhost:8082.
Abre o browser em http://localhost:8082.

---

### TS-01 — Login com credenciais válidas

**RF:** RF-40 | **UC:** UC-15.1 | **US:** US11

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Abre http://localhost:8082 | Ecrã de login aparece | Aparece ecrã login com ícone BFC. Logo abaixo "SIGD" e "Sistema Integrado de Gestão Desportiva. Campos para password e username e botão entrar. Não tem olho na password para mudar visibilidade."| ✅ |
| 2 | Introduz username: `admin` password: `Sigd@2025` | Campos preenchidos |Campos preenchidos com as credenciais | ✅ |
| 3 | Clica "Entrar" | Redireccionado para dashboard Admin | Redirecionado para dashboard admin. Primeira aba "Gestão de Acessos" | ✅ |
| 4 | Verifica que aparece "admin" no canto superior esquerdo | Nome do utilizador visível | Nome de Utilizador visível e role "Administrador" por baixo. Ícone de foto de perfil por cima | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-02 — Login com credenciais inválidas

**RF:** RF-40 | **RNF:** RNF-07

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | No ecrã de login, introduz username: `admin` password: `errada123` | Campos preenchidos | Campos preenchidos normalmente | ✅ |
| 2 | Clica "Entrar" | Mensagem de erro visível (ex: "Credenciais inválidas") | Mensagem de erro: "Utilizador ou password incorretos". | ✅ |
| 3 | Verifica que NÃO foi redireccionado para o dashboard | Permanece no ecrã de login | Permanece no ecrã | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-03 — Bloqueio de conta (conta inactiva)

**RF:** RF-40 | **RNF:** RNF-07 | **BUG a verificar:** BUG-015

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | Abre a aba "Gestão de Acessos" mostrando a lista ao lado. | ✅ |
| 2 | Vai a Gestão de Acessos | Lista de utilizadores aparece | Aparece imediatamente com o login. | ✅ |
| 3 | Clica "Bloquear" no utilizador `treinador` | Badge muda para "Inativo" | Se tentar bloquar administrador, nada acontece. Nos outros passa de "Ativo" para "Bloqueado" | ⚠️ |
| 4 | Faz logout | Volta ao ecrã de login | Volta ao ecrã de login | ✅ |
| 5 | Tenta login com `treinador` / `Sigd@2025` | Mensagem "Conta bloqueada. Contacte o administrador." | Aparece "Conta bloqueada. Contacte o administrador." | ✅ |
| 6 | Verifica que NÃO entrou no sistema | Permanece no ecrã de login | Permanece | ✅ |
| 7 | Login como `admin` e reactiva o `treinador` | Badge volta a "Ativo" | Volta | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-04 — Controlo de acesso por role (RBAC)

**RF:** RF-40 | **RNF:** RNF-09

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `treinador` / `Sigd@2025` | Dashboard Treinador | Não existe dashboard de treinador. Abre na 1ª aba "Bom dia, treinador".  Aparece opções de filtragem em cima consoante o escalão. Aparece os treinos marcados para Sub13 etc. Sub17 diz "Sem eventos para hoje" | ✅ |
| 2 | Tenta aceder directamente a http://localhost:8082 como se fosse Admin | Não mostra módulos de Admin na sidebar | Se eu só colar http://localhost:8082 no browser, abre a aba que estava ativa. Abriu o treinador. | ⚠️ |
| 3 | Verifica que o menu só tem opções de Treinador (Hoje, Plantel, Jogos, etc.) | Só opções do Treinador visíveis | "Bom dia, treinador", "Plantel", "Jogos" e "Eu" | ✅ |
| 4 | Faz logout | Volta ao login | Sim | ✅ |
| 5 | Login como `medico` / `Sigd@2025` | Dashboard Médico | Abre a "Fila de EMDs". Abre sempre a 1ª aba. | ✅ |
| 6 | Verifica que o menu só tem opções de Médico (Fila EMDs, Dossiês, Monitorização) | Só opções do Médico visíveis | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-05 — Consulta de Auditoria

**RF:** RF-24 | **UC:** UC-16.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | "Gestão de acessos" aberta. | ✅ |
| 2 | Clica em "Auditoria e Segurança" | Lista de eventos de auditoria aparece | Sim | ✅ |
| 3 | Verifica que há registos com usernames reais (admin, secretaria, etc.) | Usernames visíveis nas entradas | Sim | ✅ |
| 4 | No campo de pesquisa, escreve `medico` | Lista filtra para mostrar só entradas do médico | sim | ✅ |
| 5 | Clica em "✕ Limpar" | Filtro é removido, lista volta ao estado inicial | sim | ✅ |
| 6 | Clica no cabeçalho "DATA/HORA" | Lista ordena por data (mais recente ou mais antiga) | sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-06 — Criar novo utilizador

**RF:** RF-38 | **UC:** UC-15.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | "Gestão de Acessos" | ✅ |
| 2 | Vai a Gestão de Acessos | Lista de utilizadores | Sim | ✅ |
| 3 | Preenche formulário: username `testenovo`, email `teste@sigd.pt`, password `Teste@2026`, role `SECRETARIA` | Campos preenchidos | Clico botão "Novo Colaborador".  Campos preenchidos. (Tem também a opção "Obrigar a mudar password no próximo login". Mas no login não tem opção de esqueceu palavra passe)| ✅ |
| 4 | Clica "Criar Colaborador" | Novo utilizador aparece na lista | Sim | ✅ |
| 5 | Faz logout e tenta login com `testenovo` / `Teste@2026` | Login bem-sucedido, dashboard Secretaria | Login com sucesso. | ✅ |
| 6 | Volta ao admin e apaga/bloqueia o utilizador de teste | Utilizador bloqueado | Não tem a opção apagar nem arquivar. Bloquado. | ⚠️ |

**Estado geral:** ⚠️ PARCIAL

---

## Bloco 2 — Secretaria

**Pré-condição:** Backend e frontend a correr.
Login como `secretaria` / `Sigd@2025` antes de cada teste.

---

### TS-07 — Registar novo atleta

**RF:** RF-22 | **UC:** UC-01.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `secretaria` / `Sigd@2025` | Dashboard Secretaria | 1ª Aba "Atendimento" com a lista dos EE ao lado. | ✅ |
| 2 | Vai a Gestão de Entidades → tab Atletas | Lista de atletas aparece | Lista aparece. | ✅ |
| 3 | Clica "Novo Atleta" | Formulário de criação abre | Não existe opção "Novo Atleta" | ❌ |
| 4 | Preenche: nome `Teste Atleta`, data nascimento `2010-01-15`, NIF `999888777`, posição `Medio`, encarregado `João Silva` | Campos preenchidos | - | ➖ |
| 5 | Clica "Guardar" | Atleta aparece na lista com estado APTO | - | ➖ |
| 6 | Pesquisa "Teste Atleta" na barra de pesquisa | Atleta filtrado aparece | - | ➖ |
| 7 | Tenta criar outro atleta com o mesmo NIF `999888777` | Mensagem de erro "NIF já existe" ou similar | - | ➖ |

**Estado geral:** ❌ FALHA

---

### TS-08 — Registar encarregado de educação

**RF:** RF-36 | **UC:** UC-02.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Vai a Gestão de Entidades → tab Encarregados | Lista de EEs aparece | Sim | ✅ |
| 2 | Clica "Novo Encarregado" | Formulário abre | Não existe | ❌ |
| 3 | Preenche: nome `Teste EE`, NIF `111222333`, email `teste.ee@email.com`, telemóvel `910000001` | Campos preenchidos | - | ➖ |
| 4 | Clica "Guardar" | EE aparece na lista | - | ➖ |
| 5 | Pesquisa por email `teste.ee@email.com` | EE filtrado aparece | - | ➖ |
| 6 | Tenta criar EE com mesmo NIF `111222333` | Mensagem de erro de duplicado | - | ➖ |

**Estado geral:** ❌ FALHA

---

### TS-09 — Atendimento e registo de pagamento

**RF:** RF-30 | **UC:** UC-04

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Vai a Atendimento | Ecrã de pesquisa aparece | Sim | ✅ |
| 2 | Pesquisa por email `ee@sigd.pt` | João Silva aparece nos resultados | Sim | ✅ |
| 3 | Clica no resultado | Perfil do EE com lista de obrigações | Aparece no topo "Dados doEncarregadoNome: João SilvaNIF: 123456789Contacto: 912345678Email: ee@sigd.pt" assim tudo colado e as obrigações financeiras. | ✅ |
| 4 | Verifica que há obrigações EM_ATRASO ou PENDENTE visíveis | Obrigações com badge colorido aparecem | Sim, "Em_Atraso" vermelho e "Pendende" amarelo.| ✅ |
| 5 | Selecciona uma ou mais obrigações pendentes | Obrigações marcadas para pagamento | Não permite seleciona. Primeiro é preciso clicar no botão "Ir para Pagamento". Isso lista as pendentes ou em atraso. | ⚠️ |
| 6 | Selecciona método `MBWay` e clica "Confirmar Pagamento" | Ecrã de recibo aparece com dados do pagamento | Sim | ✅ |
| 7 | Verifica que o recibo mostra: EE, data, método, valor total | Recibo completo e correcto | Sim | ✅ |
| 8 | Clica "Novo Atendimento" | Volta ao ecrã de pesquisa | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-10 — Filtros e ordenação na lista de atletas

**RF:** RF-22 | **RNF:** RNF-01

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Vai a Gestão de Entidades → tab Atletas | Lista completa de atletas | Sim | ✅ |
| 2 | Clica toggle "CONDICIONADO" | Só atletas condicionados aparecem | Sim | ✅ |
| 3 | Clica toggle "INAPTO" | Só atletas inaptos aparecem | Sim | ✅ |
| 4 | Clica toggle "Todos" | Lista volta completa | Sim | ✅ |
| 5 | Clica em "✕ Limpar" | Filtros removidos | Sim | ✅ |
| 6 | Clica no cabeçalho "NOME" | Lista ordena alfabeticamente | Sim. Contudo parece texto. Não é um botão com sensação de ser clicável. | ⚠️ |
| 7 | Clica novamente em "NOME" | Ordem inverte (Z→A) | Sim mas há um terceiro estado que é com uma ordem sem grande lógica aparente. Alterna entre os 3| ⚠️ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-11 — Validação Documental

**RF:** RF-41 | **UC:** UC-03

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Vai a Validação Documental | Lista de atletas com estado documental | Lista de atletas com estado individual de "Cartão de Cidadão Fotografia Comprovativo Morada" e um estado global ao lado. A UI devia ser parecida com a do "Fila de EMDs". | ⚠️ |
| 2 | Verifica que há atletas com diferentes estados (EMD pendente, etc.) | Estados variados visíveis | Há 3 sem comprovativo de morada. | ✅ |
| 3 | Clica "Validar" num atleta | Confirmação pedida | "Marcar como Validado" não faz nada. | ❌ |
| 4 | Confirma a validação | Badge "Validado hoje" aparece | Não | ❌ |

**Estado geral:** ❌ FALHA

---

### TS-12 — Configurações — Época Desportiva

**RF:** RF-42 | **UC:** UC-15.3

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Vai a Configurações | Ecrã de configurações aparece | Sim | ✅ |
| 2 | Verifica que a época `2025/2026` aparece como ATIVA | Época activa visível | Sim | ✅ |
| 3 | Clica "Criar Nova Época" | Formulário com nome, data início e fim | Botão já aparece mas inativo. Preenchendo esses campos aparece o botão. | ✅ |
| 4 | Preenche: nome `2026/2027`, início `2026-09-01`, fim `2027-06-30` | Campos preenchidos | Sim | ✅ |
| 5 | Clica "Criar" | Nova época aparece com estado EM_PLANEAMENTO | Sim | ✅ |
| 6 | Tenta criar época com datas sobrepostas à actual | Mensagem de erro de sobreposição | Não aparece mensagem de erro mas não deixa criar. | ⚠️ |

**Estado geral:** ⚠️ PARCIAL

## Bloco 3 — Médico/Clínica

**Pré-condição:** Backend e frontend a correr.
Login como `medico` / `Sigd@2025` antes de cada teste.
Atleta de referência: Tomas Silva (Sub-15 A, CONDICIONADO).

---

### TS-13 — Consultar dossiê clínico de atleta

**RF:** RF-16 | **UC:** UC-09.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `medico` / `Sigd@2025` | Dashboard Médico (Fila de EMDs) | Sim | ✅ |
| 2 | Clica em "Dossiês Clínicos" | Lista de atletas com estado clínico | Lista atletas com disposição de boxes com o estado. | ✅ |
| 3 | Verifica que Tomas Silva aparece com badge CONDICIONADO | Badge amarelo visível | "CONDICIONADO - Restrição Parcial | ✅ |
| 4 | Verifica que Ricardo Ferreira aparece com badge INAPTO | Badge vermelho visível | Sim. "INAPTO - Lesão Ativa"| ✅ |
| 5 | Clica em "Ver Dossié" do Tomas Silva | Abre dossié com tab "Ocorrências Ativas" | Sim | ✅ |
| 6 | Verifica que a ocorrência activa aparece com diagnóstico e grau | Ocorrência visível com borda amarela | Sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-14 — Registar nova ocorrência clínica

**RF:** RF-16 | **UC:** UC-09.1 | **US:** US38

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | No dossié de um atleta APTO (ex: Diogo Martins) | Dossié aberto sem ocorrências ativas | Sim | ✅ |
| 2 | Clica "Nova Ocorrência" | Modal de criação abre | Sim | ✅ |
| 3 | Verifica que não existe opção VERDE no selector de grau | Só AMARELO e VERMELHO disponíveis | Sim | ✅ |
| 4 | Selecciona: tipo LESAO, grau AMARELO, diagnóstico "Entorse tornozelo direito grau I" | Campos preenchidos | Sim mas grau é Parcial ou Total (amarelo/vermelho) | ✅ |
| 5 | Clica "Registar Ocorrência" | Ocorrência aparece na lista, badge muda para CONDICIONADO | Sim, mas é "CONDICIONADO - Restrição Parcial" | ✅ |
| 6 | Navega de volta para a lista de dossiês | Diogo Martins aparece com badge CONDICIONADO | sim | ✅ |
| 7 | Tenta criar segunda ocorrência no mesmo atleta | Mensagem de erro "já tem ocorrência ativa" | Abre o modal para criar mas não cria. Contudo não aparece mensagem Botão só não faz nada. | ⚠️ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-15 — Registar evolução de ocorrência

**RF:** RF-17 | **UC:** UC-09.3

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Abre dossié do Tomas Silva | Ocorrência ativa com grau AMARELO visível | Sim | ✅ |
| 2 | Clica "Nova Evolução" na ocorrência ativa | Modal de evolução abre | Sim | ✅ |
| 3 | Verifica que só existem opções AMARELO e VERMELHO | Sem opção VERDE | Opções "Condicionada" amarelo e "Interrupção Total" vermelho | ✅ |
| 4 | Selecciona grau VERMELHO e escreve "Agravamento após treino — dor intensa" | Campos preenchidos | Sim | ✅ |
| 5 | Clica "Registar Evolução" | Evolução aparece na cadeia histórica abaixo da ocorrência | Sim | ✅ |
| 6 | Verifica que o badge do Tomas no topo do dossié mudou para INAPTO | Badge vermelho visível | Sim | ✅ |
| 7 | Navega de volta para lista de dossiês | Tomas Silva aparece com badge INAPTO | Sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-16 — Histórico de evoluções na cadeia clínica

**RF:** RF-17 | **UC:** UC-09.3

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Abre dossié do Tomas Silva | Ocorrência ativa visível | Sim | ✅ |
| 2 | Verifica a cadeia de evoluções: diagnóstico inicial (AMARELO) → evolução (VERMELHO) | Cadeia cronológica com graus correctos | Sim | ✅ |
| 3 | Verifica que o grau inicial da ocorrência mantém AMARELO | Borda amarela no diagnóstico inicial | A borda atualiza com o estado mais recente. Mas na data e informação da primeira ocorrência está bem, está amarela.| ⚠️ |
| 4 | Verifica que a evolução mostra VERMELHO | Badge vermelho na evolução | Sim e borda. | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-17 — Emitir alta médica

**RF:** RF-18 | **UC:** UC-09.4 | **US:** US40

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Abre dossié de atleta com ocorrência ativa | Ocorrência ativa visível com botão "Emitir Alta" | Sim | ✅ |
| 2 | Clica "Emitir Alta" | Modal de alta médica abre | Sim | ✅ |
| 3 | Preenche parecer: "Recuperação completa. Atleta apto para retomar actividade." | Campo preenchido | Sim | ✅ |
| 4 | Confirma a alta | Modal fecha, ocorrência desaparece da tab "Ocorrências Ativas" | Não. Obrigado a preencher "Data Efetiva de Encerramento* AAAA-MM-DD *Deve ser igual ou anterior à data de hoje.". Preenchido e o resto corre bem. | ⚠️ |
| 5 | Clica na tab "Histórico Clínico" | Ocorrência aparece como RESOLVIDA com data de alta | Sim | ✅ |
| 6 | Verifica a cadeia completa: diagnóstico → evoluções → alta | Cadeia completa e ordenada cronologicamente | Sim | ✅ |
| 7 | Navega de volta para lista de dossiês | Atleta aparece com badge APTO | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-18 — Fila de EMDs

**RF:** RF-20 | **UC:** UC-10.1 | **US:** US35

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Fila de EMDs" | Ecrã com contadores e lista de atletas | Sim. Ecrã dividido com isso e espaço em branco com "Selecione um EMD da lista para iniciar a deliberação." ao lado. | ✅ |
| 2 | Verifica contadores: Pendentes, Aprovados este mês, Rejeitados | Contadores com valores reais | 7 Pendentes · 0 Aprovados este mês · 0 Rejeitados| ✅ |
| 3 | Pesquisa por nome de atleta | Lista filtra correctamente | Sim | ✅ |
| 4 | Clica "Aprovar EMD" num atleta | Modal de deliberação abre (ou botão directo) | Clico sobre o retângulo com as informaçõs do atleta e abre ao lado placeholder do documento com as opções de motivo de rejeição, data e os botões aprovar e rejeitar. "Válido até* dd/mm/aaaa *Apenas datas futuras são permitidas Motivo de Rejeição* Indique o motivo clínico (mín. 10 caracteres) [0 / 500]"| ✅ |
| 5 | Confirma aprovação | Atleta sai da fila, contador actualiza | Sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-19 — Monitorização preventiva

**RF:** RF-21 | **UC:** UC-11

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Monitorização Preventiva" | Lista de atletas com ocorrências ativas | Sim | ✅ |
| 2 | Verifica que atletas INAPTO e CONDICIONADO aparecem | Atletas com restrições listados | Sim "Interrupção Total" e "Restrição Condicionada" | ✅ |
| 3 | Verifica que há separação entre "Apenas Inaptos/Lesionados" e "Todos os Atletas" | Filtro de visualização funciona | Sim. Opção "Todos" "Inaptos" e "Condicionados"| ✅ |
| 4 | Clica toggle "Apenas Inaptos / Lesionados" | Só atletas com restrição aparecem | sim | ✅ |

**Estado geral:** ✅ PASSA

## Bloco 4 — Treinador

**Pré-condição:** Backend e frontend a correr.
Login como `treinador` / `Sigd@2025` antes de cada teste.

---

### TS-20 — Consultar plantel e semáforo clínico

**RF:** RF-11 | **UC:** UC-08 | **US:** US03

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `treinador` / `Sigd@2025` | Dashboard Treinador | Sim | ✅ |
| 2 | Clica em "Plantel" | Lista de atletas com semáforo | Sim | ✅ |
| 3 | Verifica que Tomas Silva aparece com indicador CONDICIONADO/INAPTO | Badge colorido visível | Treinador não treina essa equipa, mas aparece Joaquim Brito com "EMD em falta"| ✅ |
| 4 | Verifica que Ricardo Ferreira aparece com indicador INAPTO | Badge vermelho | - | ➖ |
| 5 | Verifica que atletas APTO têm indicador verde | Badge verde | Sim | ✅ |
| 6 | Clica num atleta para ver perfil | Perfil com estatísticas reais (presenças, avaliações) | Sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-21 — Registar assiduidade numa sessão de treino

**RF:** RF-01 | **UC:** UC-05.1 | **US:** US01

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Bom dia, treinador" (tab inicial) | Lista de sessões de hoje | Não aparece porque Sub-13 A está selecionado. Tem outras opções: Sub-15 A Sub-17 A Sub-19 A Séniores A Sub-15 A. Não há distinção nos atletas que mostra na lista com base na seleção destes botões. Não tem estes botões na aba plantel sequer.| ⚠️ |
| 2 | Verifica que há sessões de treino agendadas para hoje | Sessões visíveis | No Sub-17 A sim. | ✅ |
| 3 | Clica numa sessão | Ecrã de assiduidade com lista de atletas | Sim | ✅ |
| 4 | Marca um atleta como "Presente" | Estado actualiza | Sim | ✅ |
| 5 | Marca um atleta como "Ausente" | Estado actualiza | Sim | ✅ |
| 6 | Verifica que atleta INAPTO tem restrição visual | Indicador de inaptidão visível | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-22 — Criar convocatória para jogo

**RF:** RF-06 | **UC:** UC-06.1 | **US:** US06

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Jogos" | Lista de jogos futuros | "Sem jogos agendados Os jogos são agendados pela Direção Técnica."| ❌ |
| 2 | Clica no jogo do Vitória SC B | Detalhe do jogo | - | ➖ |
| 3 | Verifica que aparece "Ficha disponível após o jogo" | Texto cinzento visível (jogo no futuro) | | ➖ |
| 4 | Clica "Criar Convocatória" | Ecrã de selecção de atletas | | ➖ |
| 5 | Verifica que atletas INAPTO não são seleccionáveis | Badge de impedimento visível | | ➖ |
| 6 | Selecciona 14 atletas APTO/CONDICIONADO | Atletas seleccionados | | ➖ |
| 7 | Define hora e local de concentração | Campos preenchidos | | ➖ |
| 8 | Clica "Publicar Convocatória" | Convocatória criada e visível | | ➖ |

**Estado geral:** ❌ FALHA

---

### TS-23 — Submeter ficha de jogo

**RF:** RF-09 | **UC:** UC-07 | **US:** US09

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Jogos" | Lista de jogos | - | ❌ |
| 2 | Verifica tab "Jogos Anteriores" | Jogo da Académica B aparece como CONCLUIDO | - | ➖ |

**Estado geral:** ❌ FALHA

---

### TS-24 a TS-26 — Testes omitidos (Sem jogos associados)
**Estado geral:** ➖ NÃO TESTADO

## Bloco 5 — Portal Encarregado de Educação

**Pré-condição:** Backend e frontend a correr.
Login como `ee_joao` / `Sigd@2025` antes de cada teste.
(João Silva — EE do Tomas Silva e outros atletas Sub-15)

---

### TS-27 — Consultar estado do atleta no Portal

**RF:** RF-31 | **UC:** UC-14.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `ee_joao` / `Sigd@2025` | Portal EE — ecrã inicial | Sim | ✅ |
| 2 | Verifica que aparece o nome do atleta e estado no topo | Nome e badge de elegibilidade | sim | ✅ |
| 3 | Verifica se há alertas visíveis (obrigações em atraso, estado clínico) | Cards de alerta coloridos | Sim treino e alerta de lesão | ✅ |
| 4 | Se há múltiplos atletas, verifica selector de atleta | Pode alternar entre atletas | sim. Alertas não mudam dependendo do alteta selecionado| ⚠️ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-28 — Consultar agenda do atleta

**RF:** RF-32 | **UC:** UC-14.2

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Agenda" | Lista de eventos do atleta | Sim | ✅ |
| 2 | Verifica que aparecem treinos e jogos futuros | Eventos com data e hora | Sim | ✅ |
| 3 | Verifica que jogo com convocatória mostra "Tomas Silva está CONVOCADO" | Indicador de convocatória | Botão "Ver Convocatória" e "Partilhar PDF" não estão funcionais| ⚠️ |
| 4 | Verifica que não há eventos duplicados | Cada evento aparece uma vez | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-29 — Consultar conta financeira

**RF:** RF-33 | **UC:** UC-14.3

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Conta" | Lista de obrigações financeiras | Sem obrigações, mas acho que sim. | ⚠️ |
| 2 | Verifica que há obrigações com estados diferentes (PAGO, EM_ATRASO, PENDENTE) | Badges coloridos correctos | Já foram pagos há bocado. | ⚠️ |
| 3 | Clica tab "Pendentes" | Só obrigações PENDENTE e EM_ATRASO aparecem | Tem botões mas não tem dados para testar | ⚠️ |
| 4 | Clica tab "Histórico" | Obrigações PAGO aparecem | Não existe tab histórico | ❌ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-30 — Consultar cartão de sócio digital

**RF:** RF-35 | **UC:** UC-14.5

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Eu" ou ícone de cartão | Cartão digital do atleta | É Cartão | ✅ |
| 2 | Verifica que aparece nome do atleta, número de sócio e QR code | Dados correctos | Sim mas não aparecem dados consoante o atleta selecionado nem dá para alternar aqui. | ⚠️ |
| 3 | Verifica que o QR code é gerado (mesmo que não seja scanável) | QR code visível | sim. | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-31 — Consultar documentos do atleta

**RF:** RF-34 | **UC:** UC-14.4

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Documentos" | Lista de documentos com estado | Sim | ✅ |
| 2 | Verifica estado do EMD (Aprovado/Em análise/Em falta) | Estado real do EMD visível | Sim mas é Recebido - Analisado - Aprovado| ✅ |
| 3 | Verifica estado do Cartão de Sócio | Estado visível | Sim | ✅ |
| 4 | Verifica estado dos Dados Pessoais | Estado visível |Sim  | ✅ |

**Estado geral:** ✅ PASSA

---

## Bloco 6 — CEO / CFO / Diretor Desportivo

**Pré-condição:** Backend e frontend a correr.

---

### TS-32 — CEO: Visão Executiva e alertas estratégicos

**RF:** RF-12 | **UC:** UC-12.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `ceo` / `Sigd@2025` | Dashboard CEO | Sim | ✅ |
| 2 | Verifica KPIs no topo: total atletas, total equipas | Valores reais da BD | Na "Visão Geral" não. Isso é na "Base Associativa"| ⚠️ |
| 3 | Verifica alertas estratégicos | Lista de alertas reais (EMD pendente, lesões, etc.) | Sim | ✅ |
| 4 | Clica em "Performance Desportiva" | Tabela com dados por escalão | Sim | ✅ |
| 5 | Verifica que a tabela mostra dados reais (não mock) | Jogos concluídos, agendados por escalão | Sim | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-33 — CEO: Análise Financeira

**RF:** RF-13 | **UC:** UC-12.2

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Análise Financeira" | Dashboard financeiro | Sim | ✅ |
| 2 | Verifica receita captada e dívida vencida | Valores reais (não zero) | Sim "1635,00 €" e "350,00 €"| ✅ |
| 3 | Verifica rácio de liquidez | Percentagem calculada | Sim "82.4%" | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-34 — CFO: Dashboard e Relatórios

**RF:** RF-37 | **UC:** UC-13

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `cfo` / `Sigd@2025` | Dashboard CFO | Sim | ✅ |
| 2 | Verifica KPIs: Receita Total, Passivo Pendente, Sócios Ativos, Atletas Federados | Valores reais | Sim | ✅ |
| 3 | Clica em "Relatórios Financeiros" | Dados Clube vs SAD | Sim | ✅ |
| 4 | Verifica que Receita e Dívida mostram valores reais | Não zero | Sim. Contudo, "Detalhe por Rubrica" que é uma tabela logo abaixo não tem dados reais. | ⚠️ |

**Estado geral:** ⚠️ PARCIAL

---

### TS-35 — Diretor Desportivo: Calendário Global

**RF:** RF-14 | **UC:** UC-12.3

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `diretor` / `Sigd@2025` | Dashboard Diretor | Sim | ✅ |
| 2 | Clica em "Calendário Global" | Calendário com eventos de todas as equipas | Sim | ✅ |
| 3 | Verifica que aparecem jogos e treinos de múltiplas equipas | Eventos de Sub-15, Sub-17, Sub-19 visíveis | Sim | ✅ |
| 4 | Verifica contadores: treinos, jogos, pendências | Valores reais | Sim | ✅ |

**Estado geral:** ✅ PASSA

---

### TS-36 — Diretor Desportivo: Análise de Rendimento

**RF:** RF-15 | **UC:** UC-12.4

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Clica em "Análise de Rendimento" | Dropdown de equipas | Não. Aparece um botão com as equipas mas clica e vai mudando de forma ciclica.| ⚠️ |
| 2 | Selecciona uma equipa | Atletas dessa equipa aparecem | Não. "Análise de Rendimento" está dividida em 3 abas "Visao Global - Coletivo Análise Individual Auditoria de Incumprimentos". A última sem implementação e a do meio diz "Selecione uma equipa no topo." mas nem dá que isso é só na primeira aba. Meio dispersas as coisas| ⚠️ |
| 3 | Verifica que os atletas são reais (nomes da BD) | Nomes correctos | - | ➖ |
| 4 | Clica em "Quadros Competitivos" | Tabela classificativa | Sim | ✅ |
| 5 | Selecciona equipa diferente | Tabela regenera com nova equipa no topo | Sim mas as estatísticas individuais das equipas do clube são sempre as mesmas. (Aqui assumimos que os dados vêm da federação? Não temos como ter isto tudo) | ✅ |

**Estado geral:** ⚠️ PARCIAL

---

## Cobertura de Requisitos Funcionais

### RF Cobertos nos Testes T3

| RF | Descrição | Teste(s) | Cobertura |
|---|---|---|---|
| RF-01 | Registo de assiduidade | TS-21 | ⚠️ PARCIAL |
| RF-06 | Criar convocatória | TS-22 | ❌ FALHA |
| RF-09 | Ficha de jogo | TS-23 | ❌ FALHA |
| RF-11 | Semáforo clínico | TS-20 | ✅ COBERTURA |
| RF-12 | Dashboard CEO | TS-32 | ⚠️ PARCIAL |
| RF-13 | Análise financeira CEO | TS-33 | ✅ COBERTURA |
| RF-14 | Calendário global DT | TS-35 | ✅ COBERTURA |
| RF-15 | Análise rendimento DT | TS-36 | ⚠️ PARCIAL |
| RF-16 | Registar ocorrência | TS-14 | ⚠️ PARCIAL |
| RF-17 | Evolução ocorrência | TS-15, TS-16 | ✅ COBERTURA |
| RF-18 | Alta médica | TS-17 | ⚠️ PARCIAL |
| RF-20 | Fila EMDs | TS-18 | ✅ COBERTURA |
| RF-21 | Monitorização preventiva | TS-19 | ✅ COBERTURA |
| RF-22 | Gestão atletas (listagem) | TS-07, TS-10 | ⚠️ PARCIAL |
| RF-24 | Auditoria | TS-05 | ✅ COBERTURA |
| RF-30 | Atendimento/pagamento | TS-09 | ⚠️ PARCIAL |
| RF-31 | Portal EE — estado atleta | TS-27 | ⚠️ PARCIAL |
| RF-32 | Portal EE — agenda | TS-28 | ⚠️ PARCIAL |
| RF-33 | Portal EE — conta | TS-29 | ⚠️ PARCIAL |
| RF-34 | Portal EE — documentos | TS-31 | ✅ COBERTURA |
| RF-35 | Portal EE — cartão | TS-30 | ⚠️ PARCIAL |
| RF-36 | Gestão EE (listagem) | TS-08 | ⚠️ PARCIAL |
| RF-37 | Dashboard CFO | TS-34 | ⚠️ PARCIAL |
| RF-38 | Gestão utilizadores | TS-06 | ⚠️ PARCIAL |
| RF-40 | Autenticação | TS-01, TS-02, TS-03, TS-04 | ⚠️ PARCIAL |
| RF-41 | Validação documental | TS-11 | ❌ FALHA |
| RF-42 | Época desportiva | TS-12 | ⚠️ PARCIAL |

### RF Não Cobertos — Justificação

| RF | Descrição | Motivo de Não Cobertura |
|---|---|---|
| RF-02 | Justificações de ausência EE→Treinador | Funcionalidade não implementada no Portal EE |
| RF-03 | Avaliações pós-sessão arquivadas | Bug detectado — botão finalizar não funciona (AC-01) |
| RF-04 | Histórico de convocatórias | Convocatória não persiste (SYS-004, AC-04) |
| RF-05 | Limite máximo de convocados | Não testado explicitamente — fluxo de convocatória bloqueado |
| RF-07 | PDF de convocatória | Botão "Partilhar PDF" não funcional no Portal |
| RF-08 | Histórico de resultados/jogos | Parcialmente coberto — jogo anterior visível mas ficha incompleta |
| RF-10 | Estatísticas acumuladas por atleta | UI mock — dados não representam época completa |
| RF-19 | Deliberação EMD com validade | Testado parcialmente em TS-18 — falta validação de expiração |
| RF-23 | CRUD completo de EE | Criar/editar EE não implementado no UI (SYS-002) |
| RF-25 | Exportar logs de auditoria | Botão existe mas não foi testado explicitamente |
| RF-26 | Motor de provisões automático | Não testado — sem trigger automático acessível no UI |
| RF-27 | Geração de obrigações em lote | Não testado — funcionalidade backend não exposta no UI |
| RF-28 | Relatórios financeiros detalhados | Dados mock na tabela "Detalhe por Rubrica" (SYS-012) |
| RF-29 | Segregação financeira CLUBE/SAD | Parcialmente testado — valores reais mas detalhe mock |
| RF-39 | Reset de password | Funcionalidade não implementada |

### UC Cobertos nos Testes T3

| UC | Descrição | Teste(s) | Cobertura |
|---|---|---|---|
| UC-01.1 | Registar perfil atleta | TS-07 | ❌ NÃO IMPLEMENTADO |
| UC-02.1 | Registar EE | TS-08 | ❌ NÃO IMPLEMENTADO |
| UC-03 | Validação documental | TS-11 | ❌ FALHA |
| UC-04 | Atendimento/pagamento | TS-09 | ⚠️ PARCIAL |
| UC-05.1 | Registo assiduidade | TS-21 | ⚠️ PARCIAL |
| UC-06.1 | Criar convocatória | TS-22 | ❌ FALHA |
| UC-07 | Ficha de jogo | TS-23 | ❌ FALHA |
| UC-08 | Semáforo plantel | TS-20 | ✅ COBERTURA |
| UC-09.1 | Registar ocorrência | TS-14 | ⚠️ PARCIAL |
| UC-09.3 | Evolução ocorrência | TS-15, TS-16 | ✅ COBERTURA |
| UC-09.4 | Alta médica | TS-17 | ⚠️ PARCIAL |
| UC-10.1 | Fila de EMDs | TS-18 | ✅ COBERTURA |
| UC-11 | Monitorização preventiva | TS-19 | ✅ COBERTURA |
| UC-12.1 | Dashboard CEO | TS-32 | ⚠️ PARCIAL |
| UC-12.2 | Análise financeira | TS-33 | ✅ COBERTURA |
| UC-12.3 | Calendário global DT | TS-35 | ✅ COBERTURA |
| UC-12.4 | Análise rendimento DT | TS-36 | ⚠️ PARCIAL |
| UC-13 | Dashboard CFO | TS-34 | ⚠️ PARCIAL |
| UC-14.1 | Portal — estado atleta | TS-27 | ⚠️ PARCIAL |
| UC-14.2 | Portal — agenda | TS-28 | ⚠️ PARCIAL |
| UC-14.3 | Portal — conta | TS-29 | ⚠️ PARCIAL |
| UC-14.4 | Portal — documentos | TS-31 | ✅ COBERTURA |
| UC-14.5 | Portal — cartão | TS-30 | ⚠️ PARCIAL |
| UC-15.1 | Gestão utilizadores | TS-06 | ⚠️ PARCIAL |
| UC-15.3 | Época desportiva | TS-12 | ⚠️ PARCIAL |
| UC-16.1 | Auditoria | TS-05 | ✅ COBERTURA |

### UC Não Cobertos — Justificação

| UC | Descrição | Motivo |
|---|---|---|
| UC-01.2 | Editar perfil atleta | UI não implementada |
| UC-02.2 | Editar EE | UI não implementada |
| UC-05.2 | Justificações de falta | Não implementado |
| UC-05.3 | Avaliações arquivadas | Bug — botão finalizar não funciona |
| UC-06.2 | Publicar e notificar convocatória | Convocatória não persiste |
| UC-09.2 | Deliberação EMD com validade | Testado parcialmente |
| UC-15.2 | Gerir permissões RBAC | Não testado explicitamente |

### Resumo de Cobertura

| Categoria | Total | Cobertos | Parciais | Não Cobertos |
|---|---|---|---|---|
| Requisitos Funcionais (RF) | 42 | 9 (21%) | 18 (43%) | 15 (36%) |
| Use Cases (UC) | 28 | 8 (29%) | 13 (46%) | 7 (25%) |

---

## Bugs Confirmados em Sistema

| Bug ID | Descrição | Confirmado em Teste | Severidade |
|---|---|---|---|
| BUG-015 | Conta bloqueada retorna 500 em vez de 4xx | TS-03 (não reproduzido em sistema — frontend mostra mensagem correcta) | Médio |
| BUG-016 | 403 em vez de 401 para requests sem token | T2 — testes integração | Baixo |
| SYS-001 | Secretaria não tem opção "Novo Atleta" na Gestão de Entidades | TS-07 | Alto |
| SYS-002 | Secretaria não tem opção "Novo Encarregado" na Gestão de Entidades | TS-08 | Alto |
| SYS-003 | Validação Documental — botão "Marcar como Validado" não funciona | TS-11 | Médio |
| SYS-004 | Treinador não tem jogos associados — seed associa treinador a Sub-13 mas jogos são Sub-15 | TS-22, TS-23 | Alto |
| SYS-005 | Mensagem de erro não aparece ao tentar criar segunda ocorrência ativa | TS-14 | Médio |
| SYS-006 | Borda lateral da ocorrência actualiza para estado mais recente em vez de manter grau inicial | TS-16 | Baixo |
| SYS-007 | Alta médica exige campo "Data Efetiva de Encerramento" não documentado | TS-17 | Baixo |
| SYS-008 | Alertas do Portal não actualizam ao trocar atleta seleccionado | TS-27 | Médio |
| SYS-009 | Cartão digital não actualiza ao trocar atleta | TS-30 | Médio |
| SYS-010 | Portal — tab "Histórico" financeiro não existe | TS-29 | Baixo |
| SYS-011 | Análise de Rendimento (DT) — UI confusa com abas desconexas | TS-36 | Baixo |
| SYS-012 | CFO — "Detalhe por Rubrica" sem dados reais | TS-34 | Baixo |
| SYS-013 | CEO — KPIs principais estão em "Base Associativa" não na "Visão Geral" | TS-32 | Baixo |

## Conclusão T3

**Total de testes executados:** 36
**Bugs de sistema confirmados:** 13 (SYS-001 a SYS-013)
**Funcionalidades críticas não implementadas:** 2 (criar atleta, criar EE)
**Funcionalidades parcialmente implementadas:** 8
**Funcionalidades completamente implementadas:** 7

**Taxa de sucesso por bloco:**
- Bloco 1 (Auth/Admin): 50% ✅ — RBAC funciona, nomenclatura inconsistente
- Bloco 2 (Secretaria): 0% ✅ — CRUD não implementado no UI
- Bloco 3 (Médico): 57% ✅ — Fluxo clínico core funciona
- Bloco 4 (Treinador): 33% ✅ — Problema de seed (sem jogos)
- Bloco 5 (Portal EE): 20% ✅ — Funcionalidades básicas funcionam
- Bloco 6 (CEO/CFO/DT): 40% ✅ — Dashboards com dados reais
