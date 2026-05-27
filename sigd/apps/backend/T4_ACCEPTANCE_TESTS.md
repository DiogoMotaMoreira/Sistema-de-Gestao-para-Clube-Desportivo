# T4 — Testes de Aceitação (Baseados em User Stories)
**Projecto:** SIGD — Boavista FC
**Data:** 26/05/2026
**Método:** Gherkin (Dado/Quando/Então)
**Referência:** Catálogo de User Stories (US01–US41)
**Instruções:** Para cada cenário, executa manualmente e preenche Estado.
Estado: ✅ PASSA | ❌ FALHA | ⚠️ PARCIAL | ➖ NÃO TESTADO

---

## Sumário

| Grupo | US | Cenários | ✅ | ❌ | ⚠️ | ➖ |
|---|---|---|---|---|---|---|
| Módulo 1 — Treinador | US01–US09 | 9 | 1 | 1 | 5 | 2 |
| Módulo 2 — CEO / CFO | US08–US16 | 4 | 2 | 0 | 2 | 0 |
| Módulo 3 — Secretaria | US17–US30 | 2 | 1 | 0 | 0 | 1 |
| Módulo 4 — Portal EE | US23–US30 | 4 | 1 | 0 | 1 | 2 |
| Módulo 5 — Médico | US35–US41 | 7 | 7 | 0 | 0 | 0 |
| Módulo 6 — Diretor Técnico | US31–US34 | 3 | 0 | 2 | 1 | 0 |
| **TOTAL** | | **29** | **12** | **3** | **9** | **5** |

---

## Módulo 1 — Treinador (US01–US09)

### AC-01 — US01: Registo de Assiduidade

**Critério de Aceitação Original:**
> Dado que o Treinador acede à sessão de treino agendada,
> Quando seleciona o estado de presença para cada atleta,
> Então o sistema deve gravar o estado e a data/hora exata da marcação
> E atualizar o contador de presenças em tempo real.

**Cenário 1: Marcar atleta como Presente**
```
Dado que estou autenticado como treinador
E existe uma sessão de treino agendada para hoje na Sub-13 A
Quando acedo à sessão e marco "Afonso Teixeira" como Presente
Então o sistema grava o estado PRESENTE
E o atleta aparece com indicador verde na lista
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como treinador, acede à sessão de hoje | Sim | ✅ |
| Selecciona "Presente" para Afonso Teixeira | Sim | ✅ |
| Verifica indicador visual actualizado | Sim | ✅ |
| Verifica que o registo persiste após refresh | Se atualizar volta ao início então não. Mas se selecionar tudo e clicar "Avançar para Avaliação", ele regista. Há um problema contudo. Ao avançar, ele vai para as notas. Se clicar no botão de finalizar, não faz nada. Ele não sai daquela tela. Contudo, na lista de atletas, o perfil individual atualiza com os dados. O treino aparece como se não tivesse registo mas teve. Na vista dos atletas, sem ser perfil individual, os valores de média de treino e assiduidade não são atualizados. Só no peril individual. | ❌ |

**Estado do cenário:** ⚠️ PARCIAL

**Cenário 2: Atleta INAPTO não pode ser marcado Presente**
```
Dado que existe um atleta com estado INAPTO
Quando o Treinador tenta marcar esse atleta como Presente
Então o sistema deve mostrar indicador de inaptidão
E restringir visualmente a marcação
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Verifica que atleta INAPTO tem indicador visual diferente | Sim | ✅ |
| Tenta marcar como Presente | Não dá | ✅ |
| Verifica restrição aplicada | Sim | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-02 — US02: Justificação de Faltas
**Critério de Aceitação Original:**
> Dado que um EE submeteu uma justificação de falta via portal,
> Quando o Treinador abre a lista de assiduidade,
> Então o sistema deve exibir indicador "Falta Justificada"
> E permitir leitura do motivo sem sair do fluxo de chamada.

**Estado:** ➖ NÃO TESTADO
**Motivo:** Funcionalidade não existe no portal EE — submissão de justificações não implementada.

---

### AC-03 — US03: Visualização de Alertas de Inaptidão

**Critério de Aceitação Original:**
> Dado que o departamento médico registou uma baixa clínica,
> Quando o Treinador consulta a lista para a unidade de treino,
> Então o sistema deve exibir um indicador visual de alta prioridade
> E desativar a opção de marcar o atleta como Presente.

**Cenário: Alerta de inaptidão no plantel**
```
Dado que existe atleta com ocorrência VERMELHO (INAPTO)
Quando o treinador abre o Plantel
Então o atleta aparece com badge de inaptidão
E o perfil do atleta mostra o estado clínico
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Abre Plantel como treinador | Sim | ✅ |
| Verifica badge colorido por atleta | Sim | ✅ |
| Verifica que INAPTO tem destaque visual diferente de APTO | Sim | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-04 — US04: Restrições Técnicas de Condicionados

**Critério de Aceitação Original:**
> Dado que um atleta está em fase de recuperação (transição).
> Quando o Treinador seleciona o perfil do atleta na lista de treino.
> Então o sistema deve exibir as observações técnicas do fisioterapeuta
> sobre limitações de carga ou movimento.
> E garantir que estes dados são apenas de leitura para a equipa técnica.

**Cenário: Ver restrições de atleta condicionado**
```
Dado que estou autenticado como treinador
E existe atleta com estado CONDICIONADO e ocorrência ativa
Quando abro o perfil desse atleta no Plantel
Então vejo o estado CONDICIONADO visível
E vejo alguma indicação de restrição de treino
E não consigo editar essa informação (só leitura)
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como treinador | s | ✅ |
| Abre perfil de atleta CONDICIONADO no Plantel | s | ✅ |
| Verifica estado CONDICIONADO visível | s | ✅ |
| Verifica se aparecem observações de restrição de treino | não. Médico só dá diagnóstico. Não tem opção de adicionar notas ao treinador. Consequentemente não consegue ver| ❌ |
| Verifica que não pode editar (só leitura) |- | ➖ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-05 — US05: Atribuição de Métricas de Rendimento

**Critério de Aceitação Original:**
> Dado que a sessão de treino foi finalizada,
> Quando o Treinador seleciona a escala de avaliação para cada atleta,
> Então o sistema deve guardar a nota no histórico
> E impedir a edição após 24 horas.

**Cenário: Registar avaliação pós-sessão**
```
Dado que existe uma sessão de treino concluída
Quando o treinador abre a sessão e atribui nota a um atleta
Então a nota fica guardada no histórico do atleta
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Abre sessão de treino passada | Não existe nenhum lugar com sessão de treinos passadas. Nem existe secção dedicada aos treinos. Eles só são acessiveis por "Bom dia, treinador" | ⚠️ |
| Verifica se existe campo de avaliação | Existe numero com incrementos e decrementos | ✅ |
| Atribui nota a um atleta | sim | ✅ |
| Verifica nota no perfil do atleta (estatísticas) | sim, mas não funciona o botão de finalizar. Fica na tela. Embora atualize nunca arquiva o treino. | ❌ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-06 — US06: Elaboração de Lista de Convocados

**Critério de Aceitação Original:**
> Dado que o Treinador acede ao módulo de jogos,
> Quando seleciona os jogadores para a convocatória,
> Então o sistema deve validar se existem atletas inaptos
> E permitir a gravação do rascunho antes da publicação.

**Cenário: Criar convocatória com validação de inaptidão**
```
Dado que existe jogo agendado para a Sub-13 A
E existe atleta INAPTO na equipa
Quando o treinador tenta criar convocatória
Então o atleta INAPTO aparece com restrição visual
E não pode ser seleccionado
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Acede a Jogos → jogo agendado Sub-13 | sim | ✅ |
| Clica "Criar Convocatória" | sim | ✅ |
| Verifica atleta INAPTO com restrição | sim | ✅ |
| Selecciona atletas APTO | sim | ✅ |
| Publica convocatória | Antes aparece Hora de concentração e Local mas sim. Porém volta ao menú anterior "Publicar Convocatória" e não regista a convocatória realmente. Permite novo formulário e não atualiza. | ❌ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-07 — US07: Notificação push/SMS
**Critério de Aceitação Original:**
> Dado que a lista de convocados está finalizada,
> Quando o Treinador insere hora, local e clica "Publicar",
> Então o sistema deve enviar notificação Push ou SMS
> E gerar PDF institucional para arquivo.

**Estado:** ➖ NÃO TESTADO
**Motivo:** Sistema de notificações push/SMS não implementado. PDF de convocatória não implementado.

---

### AC-08 — US09: Submissão de Ficha de Jogo

**Critério de Aceitação Original:**
> Dado que o jogo foi disputado,
> Quando o Treinador submete o resultado,
> Então o sistema deve calcular automaticamente V/E/D
> E actualizar o estado do evento para CONCLUIDO.

**Cenário: Submeter ficha após jogo**
```
Dado que existe jogo CONCLUIDO da Sub-13 A (Académica B Sub-13)
Quando o treinador acede ao jogo e clica "Ver Ficha"
Então o resultado 3-1 VITÓRIA está registado
E o evento tem estado CONCLUIDO
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Acede a Jogos → Jogos Anteriores | sim | ✅ |
| Verifica jogo Académica B Sub-13 | sim | ✅ |
| Clica "Ver Ficha de Jogo" | sim | ✅ |
| Verifica resultado e estado CONCLUIDO | sim dados: Golos e Observações. Não tem ainda onze inicial (ou 5 inicial) nem substituições nem cartões. Ficha de jogo devia deixar selecionar primeiro o onze e depois registar eventos de golos, substituiçoes (calculava automaticamente com base nos titulares) e cartões. | ⚠️ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-09 — US09: Ficha de jogo completa
**Critério de Aceitação Original:**
> Dado que o jogo foi disputado,
> Quando o Treinador submete a ficha completa,
> Então o sistema regista onze inicial, golos, substituições
> e cartões de forma estruturada.

**Cenário: Ficha completa com onze e eventos**
| Passo | Resultado Real | Estado |
|---|---|---|
| Acede à ficha de jogo | s | ✅ |
| Verifica se existe campo para onze inicial | não, salta logo para registo | ❌ |
| Verifica se existe registo de golos por jogador | não. Apenas tem golos de equipa ou do adversário | ❌ |
| Verifica se existe registo de substituições | não tem | ❌ |
| Verifica se existe registo de cartões | não tem. Submeter a ficha de jogo altera o estado mas só é visível depois de atualizar a página. | ❌ |

**Estado do cenário:** ❌ FALHA

---

## Módulo 2 — CEO / CFO (US08–US16)

### AC-10 — US08: Dashboard de Tesouraria

**Critério de Aceitação Original:**
> Dado que o CEO acede ao dashboard,
> Quando visualiza os indicadores financeiros,
> Então deve ver saldo consolidado e cobranças reais.

**Cenário: KPIs financeiros reais**
```
Dado que estou autenticado como CEO
Quando acedo à Análise Financeira
Então vejo receita captada e dívida vencida com valores reais
E o rácio de liquidez é calculado automaticamente
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como ceo | sim | ✅ |
| Acede a Análise Financeira | sim | ✅ |
| Verifica receita não é zero | sim | ✅ |
| Verifica dívida não é zero | sim | ✅ |
| Verifica rácio calculado | sim | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-11 — US10: Alertas de Incumprimento Financeiro

**Critério de Aceitação Original:**
> Dado que existem mensalidades em atraso,
> Quando o CEO acede ao dashboard,
> Então deve ver alertas de incumprimento financeiro.

**Cenário: Alertas estratégicos reais**
```
Dado que existem obrigações EM_ATRASO na BD
Quando o CEO acede à Visão Executiva
Então vê alerta "X obrigações em atraso"
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como ceo | sim | ✅ |
| Acede a Visão Executiva | sim | ✅ |
| Verifica secção "Alertas Estratégicos" | sim | ✅ |
| Verifica alerta de obrigações em atraso | sim | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-12 — US11–US15: CEO análises avançadas
**Critério de Aceitação Original (US11-US15):**
> Dado que o CEO acede ao dashboard,
> Quando navega pelas diferentes secções de análise,
> Então vê análise preditiva de tesouraria, consolidação
> de fluxos, KPIs desportivos e alertas de risco operacional.

**Cenário: Secções avançadas CEO**
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como ceo | s | ✅ |
| Verifica secção "Base Associativa" com KPIs reais | Sim — mostra KPIs: 50 atletas, 6 equipas, dados reais | ✅ |
| Verifica secção "Performance Desportiva" por escalão | Sim — tabela com jogos concluídos/agendados por escalão | ✅ |
| Verifica se há análise preditiva ou projecções | Não existe — só dados históricos e win rate em desenvolvimento | ❌ |
| Verifica alertas de risco operacional | Sim — 3 EMD pendente, 5 obrigações em atraso, 3 lesões graves, 6 jogos sem convocatória | ✅ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-13 — US16: Relatório Financeiro CFO

**Critério de Aceitação Original:**
> Dado que o CFO acede aos relatórios,
> Quando seleciona o período,
> Então vê dados discriminados por Clube e SAD.

**Cenário: Relatórios Clube vs SAD**
```
Dado que estou autenticado como CFO
Quando acedo a Relatórios Financeiros
Então vejo dados separados para Clube e SAD
E os valores de receita e dívida são reais
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como cfo | sim | ✅ |
| Acede a Relatórios Financeiros | s | ✅ |
| Verifica secção CLUBE com valores reais | sim. Contudo dados da Detalhe por Rubrica são irreais. "RUBRICA
ESCALÃO
GERADO
EM DÍVIDA
TAXA LIQ.
Quota Associativa Anual
Seniores
36000.00 €
1500.00 €
95.8%
Mensalidade Ginástica
Todos
4500.00 €
1300.00 €
71.1%
Inscrição Sócio
-
850.00 €
0.00 €
100%"| ⚠️ |
| Verifica secção SAD com valores reais | sim (0,00 € DÍVIDA VENCIDA 0,00 € OBRIGAÇÕES 0). Contudo dados da Detalhe por Rubrica são irreais. "RUBRICA
ESCALÃO
GERADO
EM DÍVIDA
TAXA LIQ.
Mensalidade Sócio Sub-15
Sub-15
8575.00 €
1075.00 €
87.4%
Equipamento Formação
Todos
6000.00 €
900.00 €
85%
Mensalidade Sócio Sub-17
Sub-17
7200.00 €
2700.00 €
62.5%"| ⚠️ |

**Estado do cenário:** ⚠️ PARCIAL

---

## Módulo 3 — Secretaria (US17–US30)

### AC-14 — US17: Registo de Pagamento Presencial

**Critério de Aceitação Original:**
> Dado que o EE se apresenta na secretaria,
> Quando a secretaria regista o pagamento,
> Então o sistema emite recibo e actualiza o estado.

**Cenário: Fluxo completo de atendimento**
```
Dado que estou autenticado como secretaria
E o EE João Silva tem obrigações EM_ATRASO
Quando processo o pagamento via MBWay
Então o recibo é emitido com EE, valor e método
E a obrigação muda para PAGO
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como secretaria | sim | ✅ |
| Pesquisa João Silva no Atendimento | | ✅ |
| Clica "Ir para Pagamento" | s| ✅ |
| Selecciona método MBWay | s| ✅ |
| Confirma pagamento |s | ✅ |
| Verifica recibo com dados correctos | sim | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-15 — US18–US22: Secretaria documental
**Critério de Aceitação Original:**
> Gestão documental de atletas e EEs — criação, edição e arquivo de documentação.

**Estado:** ➖ NÃO TESTADO
**Motivo:** Funcionalidades de criar e editar atleta/EE não implementadas no UI (SYS-001, SYS-002).

---

## Módulo 4 — Portal EE (US23–US30)

### AC-16 — US23: Consulta de Agenda pelo EE

**Critério de Aceitação Original:**
> Dado que o EE acede ao portal,
> Quando consulta a agenda,
> Então vê os eventos do atleta com convocatória indicada.

**Cenário: Agenda com convocatória**
```
Dado que estou autenticado como ee_joao
E o atleta está convocado para um jogo
Quando acedo à Agenda
Então vejo o jogo com indicador de convocatória
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como ee_joao | s| ✅ |
| Acede a Agenda |s | ✅ |
| Verifica jogo futuro com "está CONVOCADO" |s. Aparece opção para vere jogos passados e jogos agendados. Contudo, não há uma diferenciação visual São todos com as bordas azul. No treinador tem as bordas cinzentas os que já passaram | ⚠️ |
| Verifica treinos listados | Não há treinos listados| ❌ |

**Estado do cenário:** ⚠️ PARCIAL

---

### AC-17 — US24: Histórico de pagamentos EE
**Critério de Aceitação Original:**
> EE consulta histórico completo de pagamentos efectuados.

**Estado:** ➖ NÃO TESTADO
**Motivo:** Tab de histórico não existe no Portal EE (SYS-010).

---

### AC-18 — US25: Consulta de Conta Financeira pelo EE

**Critério de Aceitação Original:**
> Dado que o EE acede ao portal,
> Quando consulta a conta,
> Então vê as obrigações com estado actualizado.

**Cenário: Estado financeiro no portal**
```
Dado que estou autenticado como ee_joao
Quando acedo à Conta
Então vejo obrigações com badges PAGO/EM_ATRASO/PENDENTE
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como ee_joao | s | ✅ |
| Acede a Conta |s | ✅ |
| Verifica badges de estado correctos | s| ✅ |
| Filtra por "Pendentes" | s| ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-19 — US26–US30: Notificações e justificações
**Critério de Aceitação Original:**
> EE recebe notificações push sobre convocatórias, EMD e pagamentos. EE submete justificações.

**Estado:** ➖ NÃO TESTADO
**Motivo:** Sistema de notificações e justificações não implementado.

---

## Módulo 5 — Médico (US35–US41)

### AC-20 — US35: Monitorização de Validade EMD

**Critério de Aceitação Original:**
> Dado que um atleta possui uma data de validade de EMD registada.
> Quando faltarem 30 dias para a expiração do documento.
> Então o sistema deve emitir um alerta visual no Dashboard do
> Departamento Médico.
> E enviar uma notificação automática à Secretaria e aos EEs.

**Cenário: Atletas com EMD pendente visíveis**
```
Dado que existem atletas com estado PENDENTE_EMD no sistema
Quando o médico acede à Fila de EMDs
Então vê contadores com atletas pendentes
E esses atletas aparecem na lista para deliberação
E o portal EE mostra alerta de EMD em falta
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como medico | s | ✅ |
| Verifica contadores na Fila de EMDs | s | ✅ |
| Verifica que atletas PENDENTE_EMD aparecem na fila | s | ✅ |
| Login como ee_joao — verifica alerta de EMD no Portal | s | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-21 — US36: Bloqueio por Caducidade de EMD

**Critério de Aceitação Original:**
> Dado que o EMD de um atleta atingiu a data de expiração.
> Quando o Treinador tenta selecionar o atleta para uma convocatória.
> Então o sistema deve destacar o nome do atleta com indicador
> visual de impedimento crítico.
> E impedir a ação de seleção com aviso de restrição legal.

**Cenário: PENDENTE_EMD bloqueado na convocatória**
```
Dado que estou autenticado como treinador
E existe atleta com estado PENDENTE_EMD (Joaquim Brito) na Sub-13
Quando acedo a Jogos e crio convocatória para jogo futuro
Então Joaquim Brito aparece com indicador de EMD em falta
E não consigo seleccioná-lo para a convocatória
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como treinador | inferido (s) | ✅ |
| Acede a Jogos → jogo futuro Sub-13 → Criar Convocatória | s | ✅ |
| Verifica Joaquim Brito com indicador EMD em falta | s | ✅ |
| Tenta seleccionar Joaquim Brito | s | ✅ |
| Verifica que não é seleccionável ou tem restrição visual | bloqueado pelo passo anterior | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-22 — US37: Gestão de Estados Clínicos

**Critério de Aceitação Original:**
> Dado que o Médico avalia um atleta,
> Quando altera o estado clínico,
> Então o sistema replica para a interface do Treinador
> E limita as funcionalidades de acordo com o estado.

**Cenário: Propagação do estado clínico**
```
Dado que André Costa está APTO no plantel do treinador
Quando o médico cria ocorrência VERMELHO para André Costa
Então o treinador vê André Costa como INAPTO no plantel
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Verifica André Costa APTO no plantel (treinador) | s| ✅ |
| Login como médico, cria ocorrência VERMELHO para André Costa |s | ✅ |
| Volta ao plantel como treinador |s | ✅ |
| Verifica André Costa INAPTO |s | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-23 — US38: Registo de Ocorrência Clínica

**Critério de Aceitação Original:**
> Dado que o Médico define estado "Paragem Total",
> Quando submete o formulário,
> Então o sistema valida campos obrigatórios
> E arquiva no histórico clínico.

**Cenário: Validação de campos obrigatórios**
```
Dado que estou autenticado como médico
Quando tento criar ocorrência com diagnóstico vazio
Então o sistema não submete
E mostra indicação de campo obrigatório
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Abre modal Nova Ocorrência | s| ✅ |
| Tenta submeter sem diagnóstico | s| ✅ |
| Verifica que não submete |s | ✅ |
| Verifica mensagem de validação |s | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-24 — US39: Interdição de Utilização Desportiva

**Critério de Aceitação Original:**
> Dado que atleta está em "Paragem Total",
> Quando o Treinador vê a lista de plantel,
> Então o atleta aparece com indicador de inaptidão
> E detalhes do diagnóstico estão ocultos (RGPD).

**Cenário: RGPD — diagnóstico oculto para treinador**
```
Dado que atleta tem ocorrência VERMELHO com diagnóstico detalhado
Quando o treinador abre o perfil do atleta
Então vê o estado INAPTO mas NÃO vê o diagnóstico médico
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como treinador |s | ✅ |
| Abre perfil de atleta INAPTO |s | ✅ |
| Verifica que estado INAPTO é visível | s| ✅ |
| Verifica que diagnóstico médico NÃO aparece | s| ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-25 — US40: Alta Médica

**Critério de Aceitação Original:**
> Dado que atleta concluiu recuperação,
> Quando o Médico valida a alta,
> Então o sistema muda estado para Apto
> E desbloqueia a disponibilidade na app técnica.

**Cenário: Alta médica e desbloqueio**
```
Dado que atleta tem ocorrência ATIVA
Quando médico emite alta com parecer
Então atleta muda para APTO
E treinador vê atleta disponível no plantel
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Médico emite alta para atleta com ocorrência activa | s| ✅ |
| Verifica estado APTO no dossié |s | ✅ |
| Login como treinador |s | ✅ |
| Verifica atleta APTO no plantel |s | ✅ |

**Estado do cenário:** ✅ PASSA

---

### AC-26 — US41: Rastreabilidade Clínica

**Critério de Aceitação Original:**
> Dado que ocorreu alteração de estado clínico,
> Quando o administrador consulta o audit trail,
> Então vê médico responsável, data/hora e estados anterior/novo.

**Cenário: Audit trail de alteração clínica**
```
Dado que o médico registou uma ocorrência
Quando o admin consulta a Auditoria
Então vê registo com ator "medico", acção "CRIAR", entidade "Ocorrencia"
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como admin |s | ✅ |
| Acede a Auditoria e Segurança | s| ✅ |
| Filtra por módulo "Ocorrencia" | s| ✅ |
| Verifica registo com ator medico | s| ✅ |

**Estado do cenário:** ✅ PASSA

---

## Módulo 6 — Diretor Técnico (US31–US34)

### AC-27 — US31/US32: Perfil longitudinal atleta
**Critério de Aceitação Original:**
> Dado que o DT consulta a ficha de um atleta,
> Quando seleciona "Acumulado de Época",
> Então vê gráficos de evolução de minutos, golos e presenças
> E comparação com média do escalão.

**Cenário: Perfil longitudinal de atleta**
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como diretor | s | ✅ |
| Acede a Análise de Rendimento → Análise Individual | Existe mas com dados mockup (velocidade máxima, eficácia passe, resistência) | ⚠️ |
| Selecciona um atleta | s | ✅ |
| Verifica se aparecem métricas acumuladas reais | Não (dados mockup confirmados) | ❌ |
| Verifica se há comparação com média do escalão | Não existe | ❌ |

**Estado do cenário:** ❌ FALHA

---

### AC-28 — US33: Análise de rendimento
**Critério de Aceitação Original:**
> Dado que o DT selecciona uma equipa,
> Quando acede à análise de rendimento colectivo,
> Então vê métricas reais da equipa (jogos, vitórias, golos)
> E pode comparar com outras equipas.

**Cenário: Análise colectiva por equipa**
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como diretor | s | ✅ |
| Acede a Análise de Rendimento → Visão Global Colectivo | s | ✅ |
| Selecciona equipa Sub-13 A | s | ✅ |
| Verifica métricas reais (não mockup) | Não ("Inclui dados provisórios" - mockup) | ❌ |
| Acede a Auditoria de Incumprimentos | s | ❌ |
| Verifica se está implementado | Não está implementado | ❌ |

**Estado do cenário:** ❌ FALHA

---

### AC-29 — US34: Dashboard de Resultados da Jornada (DT)

**Critério de Aceitação Original:**
> Dado que todas as fichas de jogo foram validadas ou trancadas.
> Quando o Diretor Técnico acede ao ecrã de Análise de Jornada.
> Então o sistema deve exibir o mapa de resultados (V/E/D) por escalão.
> E destacar os KPIs desportivos agregados de toda a formação.

**Cenário: Resultados por escalão no DT**
```
Dado que estou autenticado como diretor
E existem fichas de jogo submetidas na BD
Quando acedo a Performance Desportiva
Então vejo resultados agregados por escalão
E os KPIs desportivos mostram dados reais
```
| Passo | Resultado Real | Estado |
|---|---|---|
| Login como diretor | s | ✅ |
| Acede a Performance Desportiva ou Quadros Competitivos | s | ✅ |
| Verifica mapa de resultados V/E/D por escalão | s (mokups ou dados num geral e não de uma equipa)| ⚠️ |
| Verifica KPIs desportivos agregados | s | ✅ |

**Estado do cenário:** ⚠️ PARCIAL

---

## Bugs de Aceitação

| AC-ID | US | Critério Não Satisfeito | Severidade |
|---|---|---|---|
| AC-01 | US01 | Botão "Finalizar" sessão não funciona — sessão não arquiva | Alto |
| AC-01 | US01 | Botão "Seleccionar Todos" permite registar assiduidade sem selecção individual | Médio |
| AC-03 | US05 | Não existe vista de sessões de treino passadas para avaliação | Médio |
| AC-04 | US04 | Médico não tem campo para notas ao treinador — treinador não vê restrições específicas de treino | Médio |
| AC-06 | US06 | Convocatória publicada não é registada na BD | Alto |
| AC-05 | US09 | Ficha de jogo incompleta — sem onze inicial, golos, substituições, cartões | Médio |
| AC-08 | US16 | "Detalhe por Rubrica" com dados mock (36000€ irreais) | Baixo |
| AC-10 | US23 | Treinos não aparecem na agenda do Portal EE | Médio |
| AC-10 | US23 | Sem diferenciação visual entre eventos passados e futuros no Portal | Baixo |
| AC-29 | US34 | Dashboard DT mostra dados mockup gerais em vez de resultados reais por escalão | Baixo |
| AC-09 | US09 | Estado do evento não actualiza sem refresh após submissão de ficha | Baixo |
| AC-27 | US31 | Análise Individual do DT usa dados mockup (velocidade, eficácia de passe, resistência cardíaca) em vez de métricas reais da BD | Médio |
| AC-28 | US33 | Visão Colectiva usa dados provisórios/mockup | Médio |
| AC-28 | US33 | Auditoria de Incumprimentos não implementada | Alto |

## Conclusão T4

**Total de cenários:** 29
**Passam completamente:** 12 ✅
**Parcialmente satisfeitos:** 9 ⚠️
**Falham completamente:** 3 ❌

**Taxa de satisfação de critérios de aceitação:** 41% (12/29)

**User Stories completamente satisfeitas:**
US03, US08, US10, US17, US25, US35, US36, US37, US38, US39, US40, US41

**User Stories parcialmente satisfeitas:**
US01, US04, US05, US06, US09, US11, US12, US13, US14, US15, US16, US23, US31, US32, US33, US34

**Critérios críticos não satisfeitos:**
- UC-06.1: Convocatória não é persistida após publicação
- UC-05.1: Sessão de treino não é arquivada após conclusão
- US31/US33: Métricas de rendimento do DT são mockup
- US33: Auditoria de Incumprimentos não implementada

Não alteres STATUS.md nem AUDIT.md.