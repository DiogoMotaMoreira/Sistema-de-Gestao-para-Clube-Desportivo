# Relatório de Testes — SIGD Boavista FC
**Data:** 26/05/2026
**Versão:** 1.0

## Sumário
| Fase | Total | Passam | Falham | Cobertura |
|---|---|---|---|---|
| T1 — Unitários | 87 | 71 | 16 | — |
| T2 — Integração | 25 | 12 | 13 | — |
| T6 — JaCoCo | — | — | — | — |

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

### TreinadorIntegrationTest (6 testes)
**Resultado:** 1 ✅ | 5 ❌
| # | Teste | Resultado | Bug Detectado |
|---|---|---|---|
| 14 | submeter_ficha_jogo_deve_retornar_201 | ❌ FALHA | BUG: Retorna 500 Internal Server Error (provavelmente a tentar extrair userId do token Mocked). |
| 15 | submeter_ficha_jogo_duplicada_deve_retornar_409 | ❌ FALHA | BUG: Retorna 500. |
| 16 | submeter_ficha_jogo_sem_token_deve_retornar_401 | ❌ FALHA | BUG: Retorna 403 em vez de 401 (BUG-016). |
| 17 | submeter_ficha_com_role_errado_deve_retornar_403 | ✅ PASSA | — |
| 18 | submeter_ficha_evento_inexistente_deve_retornar_404 | ❌ FALHA | BUG: Retorna 500. |
| 19 | submeter_ficha_com_golos_negativos_deve_retornar_400 | ❌ FALHA | BUG: Retorna 500. |

**Bugs detectados:**
- BUG-018: Submissão de ficha jogo falha com 500 Internal Server Error ao processar o utilizador logado. (Semelhante ao BUG-015 de Clinica).

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
