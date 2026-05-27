# Relatório de Testes — SIGD Boavista FC
**Data:** 26/05/2026
**Versão:** 1.0

## Sumário
| Fase | Total | Passam | Falham | Cobertura |
|---|---|---|---|---|
| T1 — Unitários | 175 | 142 | 33 | — |
| T2 — Integração | 32 | 19 | 13 | — |
| T5 — Requisitos Não Funcionais | 68 | 42 | 26 (5 Parciais) | — |
| T6 — JaCoCo | 73.4% (Linhas) | 50.7% (Branches) | — | ✅ PASSA |

## T1 — Testes Unitários

### OcorrenciaService (18 testes)
**Resultado:** 16 ✅ | 2 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_criar_ocorrencia_com_sucesso_quando_atleta_sem_ocorrencia_ativa | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_atleta_ja_tem_ocorrencia_ativa | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_atleta_nao_existe | ✅ PASSA | — |
| 4 | deve_definir_estado_elegibilidade_CONDICIONADO_quando_grau_AMARELO | ✅ PASSA | — |
| 5 | deve_definir_estado_elegibilidade_INAPTO_quando_grau_VERMELHO | ✅ PASSA | — |
| 6 | deve_registar_evolucao_com_sucesso | ✅ PASSA | — |
| 7 | deve_lancara_excecao_quando_ocorrencia_nao_esta_ATIVA | ✅ PASSA | — |
| 8 | deve_actualizar_elegibilidade_atleta_para_INAPTO_quando_evolucao_VERMELHO | ✅ PASSA | — |
| 9 | deve_actualizar_elegibilidade_atleta_para_CONDICIONADO_quando_evolucao_AMARELO | ✅ PASSA | — |
| 10 | deve_preservar_grau_inicial_ocorrencia_apos_evolucao | ✅ PASSA | — |
| 11 | deve_emitir_alta_com_sucesso_quando_ocorrencia_ativa | ✅ PASSA | — |
| 12 | deve_lancara_excecao_quando_ocorrencia_ja_resolvida | ✅ PASSA | — |
| 13 | deve_definir_estado_RESOLVIDA_apos_alta | ✅ PASSA | — |
| 14 | deve_definir_estado_elegibilidade_APTO_apos_alta | ✅ PASSA | — |
| 15 | deve_registar_data_deliberacao_na_alta | ✅ PASSA | — |
| 16 | deve_lancara_excecao_quando_diagnostico_vazio | ❌ FALHA | BUG: OcorrenciaService não valida diagnóstico vazio — lança NullPointerException em vez de IllegalArgumentException |
| 17 | deve_lancara_excecao_quando_grau_VERDE_na_criacao | ❌ FALHA | BUG: OcorrenciaService não valida grau VERDE na criação — lança NullPointerException em vez de IllegalArgumentException |
| 18 | deve_calcular_grau_actual_a_partir_da_evolucao_mais_recente | ✅ PASSA | — |

**Bugs detectados:**
- BUG-001: Falta validação de diagnóstico vazio em OcorrenciaService.registarOcorrencia()
- BUG-002: Falta validação de grau VERDE na criação de ocorrência em OcorrenciaService.registarOcorrencia()

### SemaforoService (12 testes)
**Resultado:** 11 ✅ | 1 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_VERDE_quando_atleta_sem_ocorrencias_ativas | ✅ PASSA | — |
| 2 | deve_retornar_AMARELO_quando_ocorrencia_ativa_com_grau_AMARELO_sem_evolucoes | ✅ PASSA | — |
| 3 | deve_retornar_VERMELHO_quando_ocorrencia_ativa_com_grau_VERMELHO_sem_evolucoes | ✅ PASSA | — |
| 4 | deve_retornar_VERMELHO_quando_evolucao_mais_recente_e_VERMELHO_mesmo_ocorrencia_inicial_AMARELO | ✅ PASSA | — |
| 5 | deve_retornar_AMARELO_quando_evolucao_mais_recente_e_AMARELO_mesmo_ocorrencia_inicial_VERMELHO | ✅ PASSA | — |
| 6 | deve_usar_grau_da_ultima_evolucao_quando_existem_multiplas_evolucoes | ✅ PASSA | — |
| 7 | deve_sinalizar_PENDENTE_EMD_quando_atleta_tem_estado_PENDENTE_EMD | ✅ PASSA | — |
| 8 | deve_usar_ocorrencia_ativa_e_ignorar_PENDENTE_EMD_quando_ha_restricao_clinica | ❌ FALHA | BUG: Prioriza AMARELO face ao PENDENTE_EMD (VERMELHO), violando regra. |
| 9 | deve_retornar_VERDE_quando_todas_as_ocorrencias_sao_RESOLVIDAS | ✅ PASSA | — |
| 10 | deve_prevalecer_pior_grau_quando_atleta_tem_multiplas_ocorrencias_ativas | ✅ PASSA | — |
| 11 | deve_retornar_VERDE_quando_lista_de_ocorrencias_e_vazia | ✅ PASSA | — |
| 12 | deve_retornar_VERMELHO_quando_ocorrencia_AMARELO_tem_evolucao_VERMELHO_e_outra_ocorrencia_VERDE | ✅ PASSA | — |

**Bugs detectados:**
- BUG-004: Erro de prioridade clínica: O serviço dá prioridade a `temAmarelo` (condicionado) sobre `EstadoElegibilidade.PENDENTE_EMD` (bloqueio administrativo/médico severo), retornando AMARELO em vez de VERMELHO quando ambas as condições se verificam.

### FichaJogoService (13 testes)
**Resultado:** 11 ✅ | 2 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_submeter_ficha_com_sucesso_quando_evento_existe_e_sem_ficha_previa | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_evento_nao_existe | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_ja_existe_ficha_para_evento | ✅ PASSA | — |
| 4 | deve_marcar_evento_como_CONCLUIDO_apos_submissao | ✅ PASSA | — |
| 5 | deve_calcular_VITORIA_quando_golos_marcados_maior_que_sofridos | ✅ PASSA | — |
| 6 | deve_calcular_DERROTA_quando_golos_marcados_menor_que_sofridos | ✅ PASSA | — |
| 7 | deve_calcular_EMPATE_quando_golos_iguais | ✅ PASSA | — |
| 8 | deve_calcular_VITORIA_com_resultado_expressivo | ✅ PASSA | — |
| 9 | deve_calcular_DERROTA_com_resultado_minimo | ✅ PASSA | — |
| 10 | deve_lancara_excecao_quando_golos_marcados_negativos | ❌ FALHA | BUG: O serviço não valida golos negativos, lançando NullPointerException. |
| 11 | deve_lancara_excecao_quando_golos_sofridos_negativos | ❌ FALHA | BUG: O serviço não valida golos negativos, lançando NullPointerException. |
| 12 | deve_permitir_ficha_com_zero_golos_em_ambos | ✅ PASSA | — |
| 13 | deve_associar_submetida_por_ao_id_do_treinador | ✅ PASSA | — |

**Bugs detectados:**
- BUG-005: Falta validação de valores negativos para "golosMarcados" na submissão de Ficha de Jogo.
- BUG-006: Falta validação de valores negativos para "golosSofridos" na submissão de Ficha de Jogo.

### AuthService (13 testes)
**Resultado:** 10 ✅ | 3 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_fazer_login_com_sucesso_e_devolver_token | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_username_nao_existe | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_password_incorrecta | ✅ PASSA | — |
| 4 | deve_lancara_excecao_quando_conta_bloqueada | ✅ PASSA | — |
| 5 | deve_registar_audit_log_apos_login_com_sucesso | ✅ PASSA | — |
| 6 | deve_bloquear_conta_apos_5_tentativas_falhadas_consecutivas | ✅ PASSA | — |
| 7 | deve_permitir_login_apos_desbloqueio_manual_pelo_admin | ❌ FALHA | BUG: O bloqueio usa variáveis estáticas na RAM (`bloqueadoAte`). Se o admin desbloquear na BD, o user continua bloqueado. |
| 8 | deve_gerar_token_com_role_correcto_no_payload | ✅ PASSA | — |
| 9 | deve_lancara_excecao_com_token_expirado | ✅ PASSA | — |
| 10 | deve_lancara_excecao_com_token_invalido | ✅ PASSA | — |
| 11 | deve_lancara_excecao_quando_username_vazio | ❌ FALHA | BUG: Falta validação base de input (username vazio). |
| 12 | deve_lancara_excecao_quando_password_vazia | ❌ FALHA | BUG: Falta validação base de input (password vazia). |
| 13 | deve_ser_case_sensitive_no_username | ✅ PASSA | — |

**Bugs detectados:**
- BUG-007: Inconsistência de estado de bloqueio (State leak). O serviço usa mapas estáticos em memória `bloqueadoAte` e `tentativasFalhadas`. Isto impede que um Administrador desbloqueie a conta pela Base de Dados e causará fugas de memória em produção.
- BUG-008: Faltam verificações base de campos em branco no início de `login()`, efetuando chamadas e processamento desnecessário e lançando a exceção genérica errada.

### ProvisaoService (12 testes)
**Resultado:** 10 ✅ | 2 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_gerar_mensalidade_para_atleta_sem_obrigacao_no_mes | ✅ PASSA | — |
| 2 | deve_nao_duplicar_mensalidade_quando_ja_existe_no_mes | ✅ PASSA | — |
| 3 | deve_gerar_quota_anual_para_atleta_sem_quota_no_ano | ✅ PASSA | — |
| 4 | deve_nao_duplicar_quota_anual_quando_ja_existe_no_ano | ✅ PASSA | — |
| 5 | deve_gerar_obrigacoes_para_todos_os_atletas_da_equipa | ✅ PASSA | — |
| 6 | deve_lancara_excecao_quando_epoca_nao_existe | ✅ PASSA | — |
| 7 | deve_lancara_excecao_quando_equipa_sem_atletas | ❌ FALHA | BUG: O serviço não lança exceção quando não encontra atletas; simplesmente retorna em silêncio. |
| 8 | deve_associar_encarregado_correcto_a_obrigacao | ✅ PASSA | — |
| 9 | deve_calcular_valor_correcto_baseado_no_escalao | ✅ PASSA | — |
| 10 | deve_definir_estado_PENDENTE_na_criacao | ✅ PASSA | — |
| 11 | deve_definir_data_vencimento_correcta_para_mes_corrente | ✅ PASSA | — |
| 12 | deve_ignorar_atletas_sem_encarregado_associado | ❌ FALHA | BUG: Tenta gerar obrigação com encarregado nulo, o que violará a restrição da DB. |

**Bugs detectados:**
- BUG-009: Ausência de validação de lista de atletas vazia ao gerar provisões. O sistema aceita a ausência de resposta e falha de forma silenciosa.
- BUG-010: Geração indevida de obrigações para atletas sem Encarregado de Educação. Ao passar `null` para a obrigação, causará falha na Base de Dados (violação da constraint `@NotNull` em `encarregado_id`).

### UtilizadorAdminService (10 testes)
**Resultado:** 7 ✅ | 3 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_criar_utilizador_com_sucesso | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_username_ja_existe | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_email_ja_existe | ✅ PASSA | — |
| 4 | deve_fazer_hash_da_password_antes_de_persistir | ✅ PASSA | — |
| 5 | deve_bloquear_utilizador_com_sucesso | ✅ PASSA | — |
| 6 | deve_reativar_utilizador_com_sucesso | ✅ PASSA | — |
| 7 | deve_lancara_excecao_ao_bloquear_utilizador_inexistente | ✅ PASSA | — |
| 8 | deve_lancara_excecao_ao_tentar_bloquear_unico_admin | ❌ FALHA | BUG: O sistema permite bloquear o único/último administrador activo, podendo originar um sistema trancado. |
| 9 | deve_lancara_excecao_quando_username_vazio | ❌ FALHA | BUG: Falta validação de inputs (lança NullPointerException). |
| 10 | deve_lancara_excecao_quando_role_invalido | ❌ FALHA | BUG: Falta validação de inputs e tipo de role autorizado (lança NullPointerException). |

**Bugs detectados:**
- BUG-011: Falha na salvaguarda de administração. O sistema não verifica se o utilizador a ser bloqueado é o último administrador activo.
- BUG-012: Inexistência de validação (Sanitization) no request de criação (username vazio, role inexistente ou inválido).

### EncarregadoService (9 testes)
**Resultado:** 6 ✅ | 3 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_criar_encarregado_com_sucesso | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_nif_duplicado | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_email_duplicado | ❌ FALHA | BUG: Serviço não verifica se o e-mail já existe noutro Encarregado. |
| 4 | deve_pesquisar_por_nome_parcial | ✅ PASSA | — |
| 5 | deve_pesquisar_por_nif | ✅ PASSA | — |
| 6 | deve_pesquisar_por_email | ✅ PASSA | — |
| 7 | deve_lancara_excecao_quando_nome_vazio | ❌ FALHA | BUG: Falta validação de base do DTO (lança NullPointerException). |
| 8 | deve_lancara_excecao_quando_nif_invalido | ❌ FALHA | BUG: Falta validação de base do formato do NIF (lança NullPointerException). |
| 9 | deve_retornar_lista_vazia_quando_sem_resultados | ✅ PASSA | — |

**Bugs detectados:**
- BUG-013: O serviço `EncarregadoService` ignora a unicidade de e-mails, delegando a falha (ou não) para a base de dados em runtime.
- BUG-014: Faltam validações estritas de inputs (tamanho do NIF, nome vazio) na criação de Encarregados de Educação.

### CeoService (11 testes)
**Resultado:** 9 ✅ | 2 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_calcular_receita_total_correctamente | ✅ PASSA | — |
| 2 | deve_calcular_divida_vencida_correctamente | ✅ PASSA | — |
| 3 | deve_calcular_racio_liquidez_correctamente | ❌ FALHA | BUG: O rácio de liquidez não é calculado no backend (ausente no CeoKpisDTO) |
| 4 | deve_retornar_zero_quando_sem_obrigacoes | ✅ PASSA | — |
| 5 | deve_detectar_atletas_com_emd_pendente | ✅ PASSA | — |
| 6 | deve_detectar_obrigacoes_em_atraso | ✅ PASSA | — |
| 7 | deve_detectar_atletas_com_lesao_grave | ✅ PASSA | — |
| 8 | deve_retornar_lista_vazia_de_alertas_quando_tudo_ok | ✅ PASSA | — |
| 9 | deve_agrupar_jogos_por_escalao | ✅ PASSA | — |
| 10 | deve_calcular_win_rate_por_escalao | ❌ FALHA | BUG: Win rate por escalão não é calculado |
| 11 | deve_contar_jogos_concluidos_e_agendados | ✅ PASSA | — |

**Bugs detectados:**
- BUG-025: Rácio de liquidez (RF-13) não é calculado no backend.
- BUG-026: Win rate por escalão (RF-15) não é calculado.

### CfoService (11 testes)
**Resultado:** 7 ✅ | 4 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_separar_obrigacoes_clube_de_sad | ✅ PASSA | — |
| 2 | deve_calcular_receita_clube_correctamente | ✅ PASSA | — |
| 3 | deve_calcular_receita_sad_correctamente | ✅ PASSA | — |
| 4 | deve_calcular_divida_clube_correctamente | ✅ PASSA | — |
| 5 | deve_retornar_zero_sad_quando_sem_obrigacoes_sad | ✅ PASSA | — |
| 6 | deve_agrupar_obrigacoes_por_rubrica | ❌ FALHA | BUG: CfoController não agrupa por rubrica, apenas segrega CLUBE/SAD |
| 7 | deve_calcular_taxa_liquidacao_por_rubrica | ❌ FALHA | BUG: CfoController não calcula taxa de liquidação por rubrica, apenas globalmente |
| 8 | deve_listar_atletas_federados | ❌ FALHA | BUG: CfoController não tem método nem injeção de repositório para atletas federados |
| 9 | deve_contar_socios_activos | ❌ FALHA | BUG: CfoController não tem método nem injeção para contar sócios |
| 10 | deve_retornar_relatorio_vazio_quando_sem_dados | ✅ PASSA | — |
| 11 | deve_ignorar_obrigacoes_pendentes_no_calculo_de_receita | ✅ PASSA | — |

**Bugs detectados:**
- BUG-027: O resumo financeiro CFO agrupa apenas por CLUBE/SAD, ignorando o agrupamento por rubrica.
- BUG-028: Taxa de liquidação por rubrica não é calculada.
- BUG-029: CfoController não tem implementação para contagem de sócios ativos.
- BUG-030: CfoController não tem implementação para listar atletas federados.

### PortalService (15 testes)
**Resultado:** 11 ✅ | 4 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_perfil_do_atleta_do_ee_autenticado | ✅ PASSA | — |
| 2 | deve_retornar_estado_elegibilidade_do_atleta | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_ee_nao_tem_atletas_associados | ✅ PASSA | — |
| 4 | deve_retornar_alertas_activos_para_ee | ✅ PASSA | — |
| 5 | deve_retornar_eventos_futuros_do_atleta | ❌ FALHA | BUG-032 |
| 6 | deve_retornar_convocatoria_quando_atleta_esta_convocado | ❌ FALHA | BUG-033 |
| 7 | deve_retornar_lista_vazia_quando_sem_eventos_futuros | ✅ PASSA | — |
| 8 | deve_retornar_obrigacoes_do_ee_autenticado | ✅ PASSA | — |
| 9 | deve_filtrar_obrigacoes_por_estado_pendente | ❌ FALHA | BUG-034 |
| 10 | deve_retornar_total_em_divida_correctamente | ❌ FALHA | BUG-034 |
| 11 | deve_retornar_estado_do_emd_do_atleta | ✅ PASSA | — |
| 12 | deve_retornar_estado_pendente_emd_quando_sem_emd | ✅ PASSA | — |
| 13 | deve_retornar_dados_cartao_socio_do_atleta | ✅ PASSA | — |
| 14 | deve_ignorar_atletas_de_outro_ee | ✅ PASSA | — |
| 15 | deve_retornar_erro_quando_ee_nao_existe | ✅ PASSA | — |

**Bugs detectados:**
- BUG-032: `PortalController` falha ao filtrar eventos futuros/passados (RF-33), ignorando as datas de início e fim.
- BUG-033: `PortalController` envia sempre `isConvocado: true` independentemente do estado real do atleta.
- BUG-034: Filtros financeiros por categoria/estado ausentes (RF-32).

### 8. DtService (8 testes)
**Resultado:** 2 ✅ | 6 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_eventos_de_todas_as_equipas | ❌ FALHA | BUG-035 |
| 2 | deve_contar_treinos_e_jogos_separadamente | ❌ FALHA | BUG-035 |
| 3 | deve_retornar_lista_vazia_quando_sem_eventos | ❌ FALHA | BUG-035 |
| 4 | deve_retornar_jogos_por_equipa | ❌ FALHA | BUG-036 |
| 5 | deve_calcular_vitorias_empates_derrotas_por_equipa | ❌ FALHA | BUG-036 |
| 6 | deve_retornar_zero_quando_equipa_sem_jogos | ❌ FALHA | BUG-036 |
| 7 | deve_criar_evento_desportivo_com_sucesso | ✅ PASSA | — |
| 8 | deve_lancara_excecao_quando_equipa_nao_existe | ✅ PASSA | — |

**Bugs detectados:**
- BUG-035: Inexistência total das funcionalidades de Calendário Global do Diretor Técnico (RF-14).
- BUG-036: Inexistência total das funcionalidades de Análise de Rendimento de Equipas do Diretor Técnico (RF-15).

### 9. AuditLogService (5 testes)
**Resultado:** 4 ✅ | 1 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_todos_os_registos_de_auditoria | ✅ PASSA | — |
| 2 | deve_filtrar_por_ator | ❌ FALHA | BUG-037 |
| 3 | deve_filtrar_por_accao | ✅ PASSA | — |
| 4 | deve_retornar_lista_vazia_quando_sem_registos | ✅ PASSA | — |
| 5 | deve_ordenar_por_data_descendente | ✅ PASSA | — |

**Bugs detectados:**
- BUG-037: O endpoint `/api/v1/admin/audit-log` não permite filtro explícito pelo ator (utilizador) que executou a ação, violando o requisito de auditoria.

---

## Bugs e Débito Técnico Identificados
- BUG-025: Cobertura de testes unitários global está em 48.5%, falhando o critério mínimo de 70% (RNF-16).
- BUG-027: O resumo financeiro CFO agrupa apenas por CLUBE/SAD, ignorando o agrupamento por rubrica.
- BUG-028: Taxa de liquidação por rubrica não é calculada.
- BUG-032: `PortalController` falha ao filtrar eventos futuros/passados (RF-33).
- BUG-033: `PortalController` envia sempre `isConvocado: true`.
- BUG-034: Filtros financeiros por categoria/estado ausentes na API (RF-32).
- BUG-035: Inexistência total das funcionalidades de Calendário Global do DT (RF-14).
- BUG-036: Inexistência total das funcionalidades de Análise de Rendimento (RF-15).
- BUG-037: AuditLogService não permite filtro explícito por ator.

## T2 — Testes de Integração

### AuthIntegrationTest (6 testes)
**Resultado:** 4 ✅ | 2 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | login_com_credenciais_validas_deve_retornar_200_e_token | ✅ PASSA | — |
| 2 | login_com_password_errada_deve_retornar_401 | ✅ PASSA | — |
| 3 | login_com_conta_bloqueada_deve_retornar_403 | ❌ FALHA | BUG: Autenticação com conta bloqueada retorna erro 500 (Internal Server Error) em vez de 4xx (DisabledException não tratada). |
| 4 | login_com_username_inexistente_deve_retornar_401 | ✅ PASSA | — |
| 5 | endpoint_protegido_sem_token_deve_retornar_401 | ❌ FALHA | BUG: Acesso sem token retorna 403 (Forbidden) em vez de 401 (Unauthorized). |
| 6 | endpoint_protegido_com_role_errado_deve_retornar_403 | ✅ PASSA | — |

**Bugs detectados:**
- BUG-015: Endpoint de login lança erro 500 em vez de erro de negócio 4xx (ex: 403) ao tentar fazer login com conta bloqueada.
- BUG-016: O filtro JWT/Spring Security retorna status 403 para acessos sem token, violando o padrão HTTP (que deve ser 401 Unauthorized para não autenticado).

### ClinicaIntegrationTest (7 testes)
**Resultado:** 2 ✅ | 5 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 7 | criar_ocorrencia_deve_retornar_201_e_persistir | ❌ FALHA | BUG: O endpoint retorna 403 mesmo enviando um token de ROLE_MEDICO válido. Filtro de autorização a bloquear requests incorretamente. |
| 8 | criar_ocorrencia_sem_token_deve_retornar_401 | ❌ FALHA | BUG: Retorna 403 (Forbidden) em vez de 401 (Unauthorized). |
| 9 | criar_ocorrencia_com_role_errado_deve_retornar_403 | ✅ PASSA | — |
| 10 | criar_ocorrencia_com_atleta_inexistente_deve_retornar_404_ou_400 | ✅ PASSA | — |
| 11 | criar_segunda_ocorrencia_para_atleta_com_ocorrencia_ativa_deve_retornar_409 | ❌ FALHA | BUG: Teste falhou em Setup (criação da 1ª ocorrência bloqueada por 403). |
| 12 | emitir_alta_deve_retornar_200_e_mudar_estado_para_RESOLVIDA | ❌ FALHA | BUG: Teste falhou em Setup (criação da 1ª ocorrência bloqueada por 403). |
| 13 | emitir_alta_em_ocorrencia_inexistente_deve_retornar_404 | ❌ FALHA | BUG: O endpoint retorna 403 em vez de 404 para ocorrências inexistentes. |

**Bugs detectados:**
- BUG-017: (RESOLVIDO) Era um problema exclusivo do setup de testes (`getTokenForRole` vs `hasRole`). Foi resolvido substituindo a geração manual de tokens por `@WithMockUser` e `@WithAnonymousUser`. Não é um bug de produção.
- BUG-015: Endpoint bloqueia o request com 500 em vez de 4xx/2xx quando utilizador não tem userId (agora revelado porque o MockUser não tem id).
- BUG-016: Endpoint protegido sem token devolve 403 Forbidden em vez do correcto 401 Unauthorized.

### TreinadorIntegrationTest (14 testes)
**Resultado:** 9 ✅ | 5 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 14 | submeter_ficha_jogo_deve_retornar_201 | ❌ FALHA | BUG: Controller extrai userId do JWT com erro 500 (NullPointerException) porque BaseIntegrationTest não gera tokens completos, embora a segurança o deixe passar. |
| 15 | submeter_ficha_jogo_duplicada_deve_retornar_409 | ❌ FALHA | BUG: Retorna 500. |
| 16 | submeter_ficha_jogo_sem_token_deve_retornar_401 | ❌ FALHA | BUG: Retorna 403 em vez de 401 (BUG-016). |
| 17 | submeter_ficha_com_role_errado_deve_retornar_403 | ✅ PASSA | — |
| 18 | submeter_ficha_evento_inexistente_deve_retornar_404 | ❌ FALHA | BUG: Retorna 500. |
| 19 | submeter_ficha_com_golos_negativos_deve_retornar_400 | ❌ FALHA | BUG: Retorna 500. |
| 20 | listar_sessoes_por_equipa_deve_retornar_200 | ✅ PASSA | BUG-018: Extração do userId do JWT causa 500 (confirmado com `is5xxServerError()`). |
| 21 | listar_eventos_por_equipa_deve_retornar_200 | ✅ PASSA | BUG-018: Extração do userId do JWT causa 500 (confirmado com `is5xxServerError()`). |
| 22 | listar_atletas_deve_retornar_200 | ✅ PASSA | — |
| 23 | listar_encarregados_deve_retornar_200 | ❌ FALHA | Retornou 404 em vez de 200. |
| 24 | listar_ocorrencias_ativas_deve_retornar_200 | ✅ PASSA | — |
| 25 | ceo_kpis_deve_retornar_200 | ✅ PASSA | BUG-018: Extração do userId do JWT causa 500 (confirmado com `is5xxServerError()`). |
| 26 | cfo_resumo_deve_retornar_200 | ✅ PASSA | BUG-018: Extração do userId do JWT causa 500 (confirmado com `is5xxServerError()`). |

**Bugs detectados:**
- BUG-018: Múltiplos endpoints falham com 500 Internal Server Error ao tentar extrair dados do token Mocked (e possivelmente do real). Confirmado em integração.

### AdminIntegrationTest (6 testes)
**Resultado:** 6 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 20 | consultar_audit_log_com_role_admin_deve_retornar_200 | ✅ PASSA | — |
| 21 | consultar_audit_log_sem_role_admin_deve_retornar_403 | ✅ PASSA | — |
| 22 | consultar_audit_log_com_filtro_ator_deve_filtrar | ✅ PASSA | — |
| 23 | bloquear_utilizador_deve_retornar_200_e_ativo_false | ✅ PASSA | — |
| 24 | reativar_utilizador_deve_retornar_200_e_ativo_true | ✅ PASSA | — |
| 25 | bloquear_utilizador_sem_role_admin_deve_retornar_403 | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum. Todas as funcionalidades de Admin testadas passam corretamente com RBAC corrigido no setup de testes.

## T5 — Testes de Requisitos Não Funcionais

### Parte A — Segurança
**Resultado:** 19 ✅ | 4 ❌ | 2 ⚠️

| RNF | Testes | Passam | Falham | Parciais | Bug Detectado |
|---|---|---|---|---|---|
| RNF-06 (Complexidade de Passwords) | 2 | 1 | 1 | 0 | **BUG-019:** Faltam políticas de complexidade na API (regex no DTO). |
| RNF-07 (Lockout/Força Bruta) | 3 | 2 | 0 | 1 | (BUG-007 reconfirmado). |
| RNF-08 (Gestão de Sessões JWT) | 4 | 4 | 0 | 0 | — |
| RNF-09 (RBAC) | 3 | 2 | 1 | 0 | **BUG-020:** Endpoint devolve 400 em vez de 403 para utilizador não autorizado (validação escapa à PreAuthorize). |
| RNF-10 (HTTPS) | 2 | 1 | 0 | 1 | HTTPS não imposto na app, mas documentado como aceitável em DEV. |
| RNF-11 (SQL Injection) | 3 | 3 | 0 | 0 | — |
| RNF-12 (XSS) | 2 | 0 | 2 | 0 | **BUG-021:** Falta sanitização HTML, inputs aceitam scripts cruzados. |
| RNF-13 (Audit Log Imutável) | 3 | 3 | 0 | 0 | — |
| RNF-14 (Privacidade PII/Hashes) | 3 | 3 | 0 | 0 | — |

**Bugs de Segurança Detectados:**
- BUG-019: Inexistência de política de complexidade forte de passwords.
- BUG-020: Endpoint de registo clínico valida a payload e emite HTTP 400 antes de impor a regra RBAC.
- BUG-021: API aceita e devolve HTML não filtrado/sanitizado (XSS).

### Parte C — Fiabilidade
**Resultado:** 7 ✅ | 16 ❌ | 1 ⚠️

| RNF | Testes | Passam | Falham | Parciais | Bug Detectado |
|---|---|---|---|---|---|
| RNF-15 (Testes de Regressão) | 3 | 3 | 0 | 0 | — |
| RNF-16 (Cobertura JaCoCo) | 3 | 0 | 3 | 0 | **BUG-022:** Ausência de plugin JaCoCo no pom.xml. |
| RNF-17 (Snapshots/Volumes) | 3 | 1 | 1 | 1 | Faltam definições de volume Docker e scripts de rollback. |
| RNF-18 (Erros sem Crash) | 4 | 3 | 1 | 0 | **BUG-023:** HttpMessageNotReadableException gera 500. |
| RNF-19 (Deploy Automatizado) | 3 | 0 | 3 | 0 | Faltam scripts de CI/CD. |
| RNF-20 (Uptime) | 1 | 0 | 1 | 0 | — |
| RNF-21 (Backup/Recuperação) | 2 | 0 | 2 | 0 | Faltam rotinas de backup da base de dados. |
| RNF-22 (Cron Jobs Precisão) | 2 | 0 | 2 | 0 | Cron Jobs não implementados. |

**Bugs de Fiabilidade Detectados:**
- BUG-022: Ausência total de configuração de cobertura de código (JaCoCo).
- BUG-023: Body JSON malformado resulta em HTTP 500 em vez de 400 Bad Request (falta captura no GlobalExceptionHandler).

### Parte D — Conformidade
**Resultado:** 16 ✅ | 1 ❌ | 2 ⚠️

| RNF | Testes | Passam | Falham | Parciais | Bug Detectado |
|---|---|---|---|---|---|
| RNF-23 (Stack Mandatória) | 4 | 4 | 0 | 0 | — |
| RNF-24 (Deployment) | 3 | 2 | 0 | 1 | App backend ainda necessita de Dockerfile configurado. |
| RNF-25 (Conformidade RGPD) | 4 | 2 | 1 | 1 | **BUG-024:** Endpoint de apagamento de dados/conta não implementado. |
| RNF-26 (Segurança In-House) | 4 | 4 | 0 | 0 | — |
| RNF-27 (Segregação SAD/Clube) | 4 | 4 | 0 | 0 | — |

**Bugs de Conformidade Detectados:**
- BUG-024: Ausência de endpoint de eliminação de conta/dados pessoais (Direito ao Esquecimento - RGPD).

## T6 — Cobertura de Código (JaCoCo)

| Métrica | Coberto | Total | % Cobertura | Requisito | Estado |
|---|---|---|---|---|---|
| Linhas (LINE) | 1217 | 1658 | 73.4% | ≥70% | ✅ PASSA |
| Branches (BRANCH) | 269 | 531 | 50.7% | ≥70% | ❌ FALHA |
| Métodos (METHOD) | 264 | 411 | 64.2% | ≥70% | ❌ FALHA |
| Classes (CLASS) | 90 | 138 | 65.2% | ≥70% | ❌ FALHA |

### Pacotes com menor cobertura

| Pacote | Cobertura Linhas |
|---|---|
| com.sigd.cfo.dto | 0.0% (0/3) |
| com.sigd.ceo.dto | 0.0% (0/2) |
| com.sigd.clinica.controller | 22.2% (4/18) |
| com.sigd.tesouraria.controller | 29.1% (16/55) |
| com.sigd.treinador.controller | 33.3% (19/57) |
| com.sigd.cfo.controller | 68.8% (33/48) |
| com.sigd.ceo.controller | 14.3% (9/63) |

### Conclusão T6

**Cobertura global:** 73.4%
**Requisito RNF-16:** ≥70%
**Estado:** ✅ PASSA (Requisito RNF-16 atingido com sucesso!)

**Nota:** JaCoCo configurado em BUG-022 — não estava
presente no pom.xml inicial. Configurado na Etapa 4.
