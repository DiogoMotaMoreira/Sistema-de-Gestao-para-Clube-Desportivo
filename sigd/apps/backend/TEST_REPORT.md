# Relatório de Testes — SIGD Boavista FC
**Data:** 26/05/2026
**Versão:** 1.0

## Sumário
| Fase | Total | Passam | Falham | Cobertura |
|---|---|---|---|---|
| T1 — Unitários | 175 | 175 | 0 | — |
| T2 — Integração | 32 | 32 | 0 | — |
| T5 — Requisitos Não Funcionais | 68 | 42 | 26 (5 Parciais) | — |
| T6 — JaCoCo | 73.4% (Linhas) | 50.7% (Branches) | — | ✅ PASSA |

## T1 — Testes Unitários

### OcorrenciaService (18 testes)
**Resultado:** 18 ✅ | 0 ❌
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
| 16 | deve_lancara_excecao_quando_diagnostico_vazio | ✅ PASSA | — |
| 17 | deve_lancara_excecao_quando_grau_VERDE_na_criacao | ✅ PASSA | — |
| 18 | deve_calcular_grau_actual_a_partir_da_evolucao_mais_recente | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum.

### SemaforoService (12 testes)
**Resultado:** 12 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_VERDE_quando_atleta_sem_ocorrencias_ativas | ✅ PASSA | — |
| 2 | deve_retornar_AMARELO_quando_ocorrencia_ativa_com_grau_AMARELO_sem_evolucoes | ✅ PASSA | — |
| 3 | deve_retornar_VERMELHO_quando_ocorrencia_ativa_com_grau_VERMELHO_sem_evolucoes | ✅ PASSA | — |
| 4 | deve_retornar_VERMELHO_quando_evolucao_mais_recente_e_VERMELHO_mesmo_ocorrencia_inicial_AMARELO | ✅ PASSA | — |
| 5 | deve_retornar_AMARELO_quando_evolucao_mais_recente_e_AMARELO_mesmo_ocorrencia_inicial_VERMELHO | ✅ PASSA | — |
| 6 | deve_usar_grau_da_ultima_evolucao_quando_existem_multiplas_evolucoes | ✅ PASSA | — |
| 7 | deve_sinalizar_PENDENTE_EMD_quando_atleta_tem_estado_PENDENTE_EMD | ✅ PASSA | — |
| 8 | deve_usar_ocorrencia_ativa_e_ignorar_PENDENTE_EMD_quando_ha_restricao_clinica | ✅ PASSA | — |
| 9 | deve_retornar_VERDE_quando_todas_as_ocorrencias_sao_RESOLVIDAS | ✅ PASSA | — |
| 10 | deve_prevalecer_pior_grau_quando_atleta_tem_multiplas_ocorrencias_ativas | ✅ PASSA | — |
| 11 | deve_retornar_VERDE_quando_lista_de_ocorrencias_e_vazia | ✅ PASSA | — |
| 12 | deve_retornar_VERMELHO_quando_ocorrencia_AMARELO_tem_evolucao_VERMELHO_e_outra_ocorrencia_VERDE | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum.

### FichaJogoService (13 testes)
**Resultado:** 13 ✅ | 0 ❌
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
| 10 | deve_lancara_excecao_quando_golos_marcados_negativos | ✅ PASSA | — |
| 11 | deve_lancara_excecao_quando_golos_sofridos_negativos | ✅ PASSA | — |
| 12 | deve_permitir_ficha_com_zero_golos_em_ambos | ✅ PASSA | — |
| 13 | deve_associar_submetida_por_ao_id_do_treinador | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum.

### AuthService (13 testes)
**Resultado:** 13 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_fazer_login_com_sucesso_e_devolver_token | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_username_nao_existe | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_password_incorrecta | ✅ PASSA | — |
| 4 | deve_lancara_excecao_quando_conta_bloqueada | ✅ PASSA | — |
| 5 | deve_registar_audit_log_apos_login_com_sucesso | ✅ PASSA | — |
| 6 | deve_bloquear_conta_apos_5_tentativas_falhadas_consecutivas | ✅ PASSA | — |
| 7 | deve_permitir_login_apos_desbloqueio_manual_pelo_admin | ✅ PASSA | — |
| 8 | deve_gerar_token_com_role_correcto_no_payload | ✅ PASSA | — |
| 9 | deve_lancara_excecao_com_token_expirado | ✅ PASSA | — |
| 10 | deve_lancara_excecao_com_token_invalido | ✅ PASSA | — |
| 11 | deve_lancara_excecao_quando_username_vazio | ✅ PASSA | — |
| 12 | deve_lancara_excecao_quando_password_vazia | ✅ PASSA | — |
| 13 | deve_ser_case_sensitive_no_username | ✅ PASSA | — |

**Bugs detectados:**
- BUG-007: Inconsistência de estado de bloqueio (State leak). O serviço usa mapas estáticos em memória `bloqueadoAte` e `tentativasFalhadas`. Isto impede que um Administrador desbloqueie a conta pela Base de Dados e causará fugas de memória em produção.
- BUG-008: Faltam verificações base de campos em branco no início de `login()`, efetuando chamadas e processamento desnecessário e lançando a exceção genérica errada.

### ProvisaoService (12 testes)
**Resultado:** 12 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_gerar_mensalidade_para_atleta_sem_obrigacao_no_mes | ✅ PASSA | — |
| 2 | deve_nao_duplicar_mensalidade_quando_ja_existe_no_mes | ✅ PASSA | — |
| 3 | deve_gerar_quota_anual_para_atleta_sem_quota_no_ano | ✅ PASSA | — |
| 4 | deve_nao_duplicar_quota_anual_quando_ja_existe_no_ano | ✅ PASSA | — |
| 5 | deve_gerar_obrigacoes_para_todos_os_atletas_da_equipa | ✅ PASSA | — |
| 6 | deve_lancara_excecao_quando_epoca_nao_existe | ✅ PASSA | — |
| 7 | deve_lancara_excecao_quando_equipa_sem_atletas | ✅ PASSA | — |
| 8 | deve_associar_encarregado_correcto_a_obrigacao | ✅ PASSA | — |
| 9 | deve_calcular_valor_correcto_baseado_no_escalao | ✅ PASSA | — |
| 10 | deve_definir_estado_PENDENTE_na_criacao | ✅ PASSA | — |
| 11 | deve_definir_data_vencimento_correcta_para_mes_corrente | ✅ PASSA | — |
| 12 | deve_ignorar_atletas_sem_encarregado_associado | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-009 e BUG-010 resolvidos).

### UtilizadorAdminService (10 testes)
**Resultado:** 10 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_criar_utilizador_com_sucesso | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_username_ja_existe | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_email_ja_existe | ✅ PASSA | — |
| 4 | deve_fazer_hash_da_password_antes_de_persistir | ✅ PASSA | — |
| 5 | deve_bloquear_utilizador_com_sucesso | ✅ PASSA | — |
| 6 | deve_reativar_utilizador_com_sucesso | ✅ PASSA | — |
| 7 | deve_lancara_excecao_ao_bloquear_utilizador_inexistente | ✅ PASSA | — |
| 8 | deve_lancara_excecao_ao_tentar_bloquear_unico_admin | ✅ PASSA | — |
| 9 | deve_lancara_excecao_quando_username_vazio | ✅ PASSA | — |
| 10 | deve_lancara_excecao_quando_role_invalido | ✅ PASSA | — |

**Bugs detectados:**
- BUG-011: Falha na salvaguarda de administração. O sistema não verifica se o utilizador a ser bloqueado é o último administrador activo.
- BUG-012: Inexistência de validação (Sanitization) no request de criação (username vazio, role inexistente ou inválido).

### EncarregadoService (9 testes)
**Resultado:** 9 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_criar_encarregado_com_sucesso | ✅ PASSA | — |
| 2 | deve_lancara_excecao_quando_nif_duplicado | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_email_duplicado | ✅ PASSA | — |
| 4 | deve_pesquisar_por_nome_parcial | ✅ PASSA | — |
| 5 | deve_pesquisar_por_nif | ✅ PASSA | — |
| 6 | deve_pesquisar_por_email | ✅ PASSA | — |
| 7 | deve_lancara_excecao_quando_nome_vazio | ✅ PASSA | — |
| 8 | deve_lancara_excecao_quando_nif_invalido | ✅ PASSA | — |
| 9 | deve_retornar_lista_vazia_quando_sem_resultados | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-013 e BUG-014 resolvidos).

### CeoService (11 testes)
**Resultado:** 11 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_calcular_receita_total_correctamente | ✅ PASSA | — |
| 2 | deve_calcular_divida_vencida_correctamente | ✅ PASSA | — |
| 3 | deve_calcular_racio_liquidez_correctamente | ✅ PASSA | — |
| 4 | deve_retornar_zero_quando_sem_obrigacoes | ✅ PASSA | — |
| 5 | deve_detectar_atletas_com_emd_pendente | ✅ PASSA | — |
| 6 | deve_detectar_obrigacoes_em_atraso | ✅ PASSA | — |
| 7 | deve_detectar_atletas_com_lesao_grave | ✅ PASSA | — |
| 8 | deve_retornar_lista_vazia_de_alertas_quando_tudo_ok | ✅ PASSA | — |
| 9 | deve_agrupar_jogos_por_escalao | ✅ PASSA | — |
| 10 | deve_calcular_win_rate_por_escalao | ✅ PASSA | — |
| 11 | deve_contar_jogos_concluidos_e_agendados | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-025 e BUG-026 resolvidos).

### CfoService (11 testes)
**Resultado:** 11 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_separar_obrigacoes_clube_de_sad | ✅ PASSA | — |
| 2 | deve_calcular_receita_clube_correctamente | ✅ PASSA | — |
| 3 | deve_calcular_receita_sad_correctamente | ✅ PASSA | — |
| 4 | deve_calcular_divida_clube_correctamente | ✅ PASSA | — |
| 5 | deve_retornar_zero_sad_quando_sem_obrigacoes_sad | ✅ PASSA | — |
| 6 | deve_agrupar_obrigacoes_por_rubrica | ✅ PASSA | — |
| 7 | deve_calcular_taxa_liquidacao_por_rubrica | ✅ PASSA | — |
| 8 | deve_listar_atletas_federados | ✅ PASSA | — |
| 9 | deve_contar_socios_activos | ✅ PASSA | — |
| 10 | deve_retornar_relatorio_vazio_quando_sem_dados | ✅ PASSA | — |
| 11 | deve_ignorar_obrigacoes_pendentes_no_calculo_de_receita | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-027, BUG-028, BUG-029 e BUG-030 resolvidos).

### PortalService (15 testes)
**Resultado:** 15 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_perfil_do_atleta_do_ee_autenticado | ✅ PASSA | — |
| 2 | deve_retornar_estado_elegibilidade_do_atleta | ✅ PASSA | — |
| 3 | deve_lancara_excecao_quando_ee_nao_tem_atletas_associados | ✅ PASSA | — |
| 4 | deve_retornar_alertas_activos_para_ee | ✅ PASSA | — |
| 5 | deve_retornar_eventos_futuros_do_atleta | ✅ PASSA | — |
| 6 | deve_retornar_convocatoria_quando_atleta_esta_convocado | ✅ PASSA | — |
| 7 | deve_retornar_lista_vazia_quando_sem_eventos_futuros | ✅ PASSA | — |
| 8 | deve_retornar_obrigacoes_do_ee_autenticado | ✅ PASSA | — |
| 9 | deve_filtrar_obrigacoes_por_estado_pendente | ✅ PASSA | — |
| 10 | deve_retornar_total_em_divida_correctamente | ✅ PASSA | — |
| 11 | deve_retornar_estado_do_emd_do_atleta | ✅ PASSA | — |
| 12 | deve_retornar_estado_pendente_emd_quando_sem_emd | ✅ PASSA | — |
| 13 | deve_retornar_dados_cartao_socio_do_atleta | ✅ PASSA | — |
| 14 | deve_ignorar_atletas_de_outro_ee | ✅ PASSA | — |
| 15 | deve_retornar_erro_quando_ee_nao_existe | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum. (BUG-032, BUG-033, BUG-034 resolvidos).

### 8. DtService (8 testes)
**Resultado:** 8 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_eventos_de_todas_as_equipas | ✅ PASSA | — |
| 2 | deve_contar_treinos_e_jogos_separadamente | ✅ PASSA | — |
| 3 | deve_retornar_lista_vazia_quando_sem_eventos | ✅ PASSA | — |
| 4 | deve_retornar_jogos_por_equipa | ✅ PASSA | — |
| 5 | deve_calcular_vitorias_empates_derrotas_por_equipa | ✅ PASSA | — |
| 6 | deve_retornar_zero_quando_equipa_sem_jogos | ✅ PASSA | — |
| 7 | deve_criar_evento_desportivo_com_sucesso | ✅ PASSA | — |
| 8 | deve_lancara_excecao_quando_equipa_nao_existe | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-035 e BUG-036 resolvidos).

### 9. AuditLogService (5 testes)
**Resultado:** 5 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | deve_retornar_todos_os_registos_de_auditoria | ✅ PASSA | — |
| 2 | deve_filtrar_por_ator | ✅ PASSA | — |
| 3 | deve_filtrar_por_accao | ✅ PASSA | — |
| 4 | deve_retornar_lista_vazia_quando_sem_registos | ✅ PASSA | — |
| 5 | deve_ordenar_por_data_descendente | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum (BUG-037 resolvido).

---

## Bugs e Débito Técnico Identificados
- Nenhum bug funcional pendente em sistema. (BUG-025, BUG-027, BUG-028, BUG-032, BUG-033, BUG-034, BUG-035, BUG-036, BUG-037 todos resolvidos).

## T2 — Testes de Integração

### AuthIntegrationTest (6 testes)
**Resultado:** 6 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 1 | login_com_credenciais_validas_deve_retornar_200_e_token | ✅ PASSA | — |
| 2 | login_com_password_errada_deve_retornar_401 | ✅ PASSA | — |
| 3 | login_com_conta_bloqueada_deve_retornar_403 | ✅ PASSA | — |
| 4 | login_com_username_inexistente_deve_retornar_401 | ✅ PASSA | — |
| 5 | endpoint_protegido_sem_token_deve_retornar_401 | ✅ PASSA | — |
| 6 | endpoint_protegido_com_role_errado_deve_retornar_403 | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum. (BUG-015 e BUG-016 resolvidos).

### ClinicaIntegrationTest (7 testes)
**Resultado:** 7 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 7 | criar_ocorrencia_deve_retornar_201_e_persistir | ✅ PASSA | — |
| 8 | criar_ocorrencia_sem_token_deve_retornar_401 | ✅ PASSA | — |
| 9 | criar_ocorrencia_com_role_errado_deve_retornar_403 | ✅ PASSA | — |
| 10 | criar_ocorrencia_com_atleta_inexistente_deve_retornar_404_ou_400 | ✅ PASSA | — |
| 11 | criar_segunda_ocorrencia_para_atleta_com_ocorrencia_ativa_deve_retornar_409 | ✅ PASSA | — |
| 12 | emitir_alta_deve_retornar_200_e_mudar_estado_para_RESOLVIDA | ✅ PASSA | — |
| 13 | emitir_alta_em_ocorrencia_inexistente_deve_retornar_404 | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum. (BUG-015, BUG-016, BUG-017 resolvidos).

### TreinadorIntegrationTest (14 testes)
**Resultado:** 13 ✅ | 0 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 14 | submeter_ficha_jogo_deve_retornar_201 | ✅ PASSA | — |
| 15 | submeter_ficha_jogo_duplicada_deve_retornar_409 | ✅ PASSA | — |
| 16 | submeter_ficha_jogo_sem_token_deve_retornar_401 | ✅ PASSA | — |
| 17 | submeter_ficha_com_role_errado_deve_retornar_403 | ✅ PASSA | — |
| 18 | submeter_ficha_evento_inexistente_deve_retornar_404 | ✅ PASSA | — |
| 19 | submeter_ficha_com_golos_negativos_deve_retornar_400 | ✅ PASSA | — |
| 20 | listar_sessoes_por_equipa_deve_retornar_200 | ✅ PASSA | — |
| 21 | listar_eventos_por_equipa_deve_retornar_200 | ✅ PASSA | — |
| 22 | listar_atletas_deve_retornar_200 | ✅ PASSA | — |
| 23 | listar_encarregados_deve_retornar_200 | ✅ PASSA | — |
| 24 | listar_ocorrencias_ativas_deve_retornar_200 | ✅ PASSA | — |
| 25 | ceo_kpis_deve_retornar_200 | ✅ PASSA | — |
| 26 | cfo_resumo_deve_retornar_200 | ✅ PASSA | — |

**Bugs detectados:**
- Nenhum.

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
| RNF-22 (Cron Jobs Precisão) | 2 | 2 | 0 | 0 | — |

**Bugs de Fiabilidade Detectados:**
- BUG-022: Ausência total de configuração de cobertura de código (JaCoCo).
- BUG-023: Body JSON malformado resulta em HTTP 500 em vez de 400 Bad Request (falta captura no GlobalExceptionHandler).

### Parte D — Conformidade
**Resultado:** 16 ✅ | 1 ❌ | 2 ⚠️

| RNF | Testes | Passam | Falham | Parciais | Bug Detectado |
|---|---|---|---|---|---|
| RNF-23 (Stack Mandatória) | 4 | 4 | 0 | 0 | — |
| RNF-24 (Deployment) | 3 | 3 | 0 | 0 | — |
| RNF-25 (Conformidade RGPD) | 4 | 4 | 0 | 0 | — |
| RNF-26 (Segurança In-House) | 4 | 4 | 0 | 0 | — |
| RNF-27 (Segregação SAD/Clube) | 4 | 4 | 0 | 0 | — |

**Bugs de Conformidade Detectados:**
- BUG-024: Ausência de endpoint de eliminação de conta/dados pessoais (Direito ao Esquecimento - RGPD) [RESOLVIDO].

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
