# Matriz de Rastreabilidade e Verificação SRS (SRS Verification)
**Projecto:** SIGD — Boavista FC
**Data:** 26/05/2026

Este documento cruza todos os Requisitos Funcionais (RF), Requisitos Não Funcionais (RNF), Casos de Uso (UC) e User Stories (US) com os testes unitários (T1), de integração (T2), de sistema (T3), de aceitação (T4) e testes de RNF (T5).

---

## SECÇÃO 1 — Matriz RF

| ID | Descrição | UC | US | Testes T1/T2 | Testes T3/T4 | Estado Global | Observações / Bugs |
|---|---|---|---|---|---|---|---|
| RF-01 | Registo de assiduidade | UC-05.1 | US01 | — | TS-21, AC-01 | ⚠️ PARCIAL | Faltam justificações de ausência. Avaliação não arquiva (AC-01). |
| RF-02 | Justificações de ausência EE→Treinador | UC-05.2 | — | — | — | ❌ NÃO SATISFEITO | Funcionalidade não implementada no Portal EE. |
| RF-03 | Avaliações pós-sessão arquivadas | UC-05.3 | US05 | — | AC-05 | ❌ NÃO SATISFEITO | Botão finalizar não funciona (AC-01). |
| RF-04 | Histórico de convocatórias | UC-06.2 | US06 | — | AC-06 | ❌ NÃO SATISFEITO | Convocatória não persiste (SYS-004, AC-06). |
| RF-05 | Limite máximo de convocados | — | — | — | — | ➖ NÃO TESTADO | Fluxo bloqueado antes desta verificação. |
| RF-06 | Criar convocatória | UC-06.1 | US06 | — | TS-22, AC-06 | ❌ NÃO SATISFEITO | Treinador não tem jogos (SYS-004), convocatória não persiste. |
| RF-07 | PDF de convocatória | — | US07 | — | AC-07 | ➖ NÃO TESTADO | Botão de partilha de PDF não funcional. |
| RF-08 | Histórico de resultados/jogos | — | — | — | TS-23 | ⚠️ PARCIAL | Jogo anterior visível mas ficha incompleta. |
| RF-09 | Ficha de jogo | UC-07 | US09 | FichaJogoService, TreinadorIntegrationTest | TS-23, AC-08, AC-09 | ⚠️ PARCIAL | Ficha básica funciona, mas onze inicial/cartões/substituições em falta. |
| RF-10 | Estatísticas acumuladas por atleta | — | — | — | — | ❌ NÃO SATISFEITO | Dados não representam época completa (UI mock). |
| RF-11 | Semáforo clínico | UC-08 | US03 | SemaforoService | TS-20, AC-03 | ⚠️ PARCIAL | BUG-004 (Prioriza AMARELO ao invés de VERMELHO para EMD pendente). |
| RF-12 | Dashboard CEO | UC-12.1 | US11-15 | CeoServiceTest | TS-32, AC-12 | ⚠️ PARCIAL | Dados preditivos em falta, estrutura da UI. |
| RF-13 | Análise financeira CEO | UC-12.2 | US11-15 | CeoServiceTest | TS-33, AC-10 | ⚠️ PARCIAL | BUG-025 (Rácio de liquidez não é calculado). |
| RF-14 | Calendário global DT | UC-12.3 | US34 | DtService | TS-35, AC-29 | ❌ NÃO SATISFEITO | BUG-035 (Inexistência das funcionalidades na API). |
| RF-15 | Análise rendimento DT | UC-12.4 | US34 | DtService | TS-36, AC-27, AC-28 | ❌ NÃO SATISFEITO | BUG-036 (Inexistência na API), UI mockup (AC-27). |
| RF-16 | Registar ocorrência | UC-09.1 | US38 | OcorrenciaService, ClinicaIntegrationTest | TS-14, TS-13, AC-23 | ⚠️ PARCIAL | BUG-001, BUG-002, BUG-017 (T2 setup). SYS-005. |
| RF-17 | Evolução ocorrência | UC-09.3 | US39 | OcorrenciaService | TS-15, TS-16, AC-24 | ⚠️ PARCIAL | SYS-006 (Grau inicial altera visualmente para o mais recente). |
| RF-18 | Alta médica | UC-09.4 | US40 | OcorrenciaService, ClinicaIntegrationTest | TS-17, AC-25 | ⚠️ PARCIAL | SYS-007 (Exige Data Efetiva extra). |
| RF-19 | Deliberação EMD com validade | UC-09.2 | — | — | — | ➖ NÃO TESTADO | Parcialmente em TS-18 mas sem validação de expiração explícita. |
| RF-20 | Fila EMDs | UC-10.1 | US35 | OcorrenciaService | TS-18, AC-20 | ✅ VERIFICADO | Contadores corretos, deliberação aprovada no frontend. |
| RF-21 | Monitorização preventiva | UC-11 | US35 | — | TS-19 | ✅ VERIFICADO | Separação de filtros Inaptos/Condicionados funcional. |
| RF-22 | Gestão atletas (listagem) | UC-01.1 | — | — | TS-07, TS-10 | ❌ NÃO SATISFEITO | SYS-001 (Secretaria sem botão Criar Novo Atleta). |
| RF-23 | CRUD completo de EE | UC-02.2 | US18-22 | — | — | ➖ NÃO TESTADO | UI não implementada para criar/editar. |
| RF-24 | Auditoria | UC-16.1 | US41 | AuditLogService, AdminIntegrationTest | TS-05, AC-26 | ⚠️ PARCIAL | BUG-037 (API não permite filtrar por ator via param). |
| RF-25 | Exportar logs de auditoria | — | — | — | — | ➖ NÃO TESTADO | Botão existe mas não foi testado explicitamente. |
| RF-26 | Motor de provisões automático | — | — | ProvisaoService | — | ⚠️ PARCIAL | BUG-009, BUG-010 na geração das provisões. |
| RF-27 | Geração de obrigações em lote | — | — | ProvisaoService | — | ⚠️ PARCIAL | Funcionalidade base implementada no service, não exposta no UI. |
| RF-28 | Relatórios financeiros detalhados | — | US16 | CfoServiceTest | AC-13 | ⚠️ PARCIAL | Tabela de Detalhe por Rubrica com mockups. BUG-027, BUG-028. |
| RF-29 | Segregação financeira CLUBE/SAD | — | US16 | CfoService | — | ⚠️ PARCIAL | Parcialmente em testes unitários. |
| RF-30 | Atendimento/pagamento | UC-04 | US17 | — | TS-09, AC-14 | ⚠️ PARCIAL | Recibos gerados, mas sem opção múltipla imediata na tab inicial. |
| RF-31 | Portal EE — estado atleta | UC-14.1 | — | PortalService | TS-27 | ⚠️ PARCIAL | SYS-008 (Alertas não atualizam com o selector). BUG-032. |
| RF-32 | Portal EE — agenda | UC-14.2 | US23 | PortalService | TS-28, AC-16 | ⚠️ PARCIAL | AC-10 (Treinos não aparecem, sem distinção visual de passados). BUG-033. |
| RF-33 | Portal EE — conta | UC-14.3 | US25 | PortalService | TS-29, AC-18 | ⚠️ PARCIAL | BUG-034 (Filtros financeiros da API). SYS-010. |
| RF-34 | Portal EE — documentos | UC-14.4 | — | PortalService | TS-31 | ✅ VERIFICADO | Todos os estados documentais são apresentados com sucesso. |
| RF-35 | Portal EE — cartão | UC-14.5 | — | PortalService | TS-30 | ⚠️ PARCIAL | SYS-009 (Cartão não atualiza dados ao trocar atleta). |
| RF-36 | Gestão EE (listagem) | UC-02.1 | — | EncarregadoService, TreinadorIntegrationTest | TS-08 | ❌ NÃO SATISFEITO | SYS-002 (Botão "Novo" ausente). BUG-013, BUG-014. |
| RF-37 | Dashboard CFO | UC-13 | US16 | CfoServiceTest | TS-34, AC-13 | ⚠️ PARCIAL | BUG-029, BUG-030 (Sem contagem de sócios/federados na API). |
| RF-38 | Gestão utilizadores | UC-15.1 | — | UtilizadorAdminService, AdminIntegrationTest | TS-06 | ⚠️ PARCIAL | Faltam opções Arquivar/Apagar no frontend. BUG-011, BUG-012. |
| RF-39 | Reset de password | — | — | — | — | ❌ NÃO SATISFEITO | Funcionalidade não implementada (Frontend nem Backend). |
| RF-40 | Autenticação | UC-15.1 | — | AuthService, AuthIntegrationTest | TS-01, TS-02, TS-03, TS-04 | ⚠️ PARCIAL | BUG-007, BUG-008, BUG-015, BUG-016. |
| RF-41 | Validação documental | UC-03 | — | — | TS-11 | ❌ NÃO SATISFEITO | SYS-003 (Botão de validar não faz nada). |
| RF-42 | Época desportiva | UC-15.3 | — | — | TS-12 | ⚠️ PARCIAL | Sem erro visual aquando de sobreposição de épocas. |

---

## SECÇÃO 2 — Matriz RNF

| ID | Descrição | Categoria | Testes T5 | Estado Global | Observações / Bugs |
|---|---|---|---|---|---|
| RNF-01 | Latência de Operações Síncronas (≤ 1,5s) | Performance | RNF-01-T1 a T6 | ❌ FALHA | T4 ERRO(404) no semáforo. |
| RNF-02 | Propagação de Alertas em Tempo Real (≤60s) | Performance | RNF-02-T1, T2 | ❌ FALHA | Apenas refresh manual. WebSockets/SSE não implementados. |
| RNF-03 | Eficiência na Geração de Documentos (≤30s) | Performance | RNF-03-T1, T2 | ❌ N/A | Geração de PDFs não implementada. |
| RNF-04 | Controlo de Sobrecarga de Pesquisa (Debounce) | Performance | RNF-04-T1 a T3 | ❌ FALHA | Debounce ausente em pesquisa de atletas. |
| RNF-05 | Responsividade a Eventos de Geometria | Performance | RNF-05-T1, T2 | ❌ N/A / FALHA | Rotação não testável no browser; estado perde-se no refresh. |
| RNF-06 | Política de Complexidade de Passwords | Segurança | RNF-06-T1, T2 | ❌ FALHA | BUG-019 (Apenas regex no DTO, sem validação profunda). |
| RNF-07 | Protecção contra Força Bruta (Lockout) | Segurança | RNF-07-T1 a T3 | ⚠️ PARCIAL | BUG-007 (Lockout mantido em memória, não persiste em BD). |
| RNF-08 | Gestão e Validade de Sessões (JWT) | Segurança | RNF-08-T1 a T4 | ✅ PASSA | JWT bem implementado e expirado via backend. |
| RNF-09 | Controlo de Acesso Baseado em Roles (RBAC) | Segurança | RNF-09-T1 a T3 | ❌ FALHA | BUG-020 (Valida payload antes do RBAC no endpoint clínico). |
| RNF-10 | HTTPS Obrigatório | Segurança | RNF-10-T1, T2 | ⚠️ PARCIAL | HTTP em dev aceitável, mas sem imposição de redirect documentada. |
| RNF-11 | Protecção contra SQL Injection | Segurança | RNF-11-T1 a T3 | ✅ PASSA | Resolvido adequadamente pelas features do JPA/Hibernate. |
| RNF-12 | Protecção contra XSS | Segurança | RNF-12-T1, T2 | ❌ FALHA | BUG-021 (Falta de @HtmlSafe e sanitização de scripts). |
| RNF-13 | Audit Log Imutável (Append-Only) | Segurança | RNF-13-T1 a T3 | ✅ PASSA | Apenas GETs permitidos na API, PUT/DELETE não existem. |
| RNF-14 | Dados Sensíveis Não Expostos | Segurança | RNF-14-T1 a T3 | ✅ PASSA | Hashes e PII de ocorrências devidamente protegidos/ocultados. |
| RNF-15 | Testes de Regressão Contínuos | Fiabilidade | RNF-15-T1 a T3 | ✅ PASSA | Unitários e Integração criados e correm localmente. |
| RNF-16 | Cobertura de Código ≥70% | Fiabilidade | RNF-16-T1 a T3 | ✅ PASSA | (Nota: Resolvido na Etapa 4 - Cobertura de Linhas alcançou 73.4%). |
| RNF-17 | Snapshots de BD antes de Alterações | Fiabilidade | RNF-17-T1 a T3 | ⚠️ PARCIAL | Volumes Docker presentes mas rollback Flyway manual. |
| RNF-18 | Recuperação de Erros sem Crash | Fiabilidade | RNF-18-T1 a T4 | ❌ FALHA | BUG-023 (JSON malformado resulta em 500 sem GlobalException capture). |
| RNF-19 | Relatórios de Deploy Automatizados | Fiabilidade | RNF-19-T1 a T3 | ❌ FALHA | Faltam CI/CD, scripts docker-compose isolados. |
| RNF-20 | Disponibilidade 99% (Uptime) | Fiabilidade | RNF-20-T1 | ❌ N/A | Impossível testar uptime em Localhost / DEV environment. |
| RNF-21 | Política de Backup e Recuperação | Fiabilidade | RNF-21-T1, T2 | ❌ FALHA | Sem scripts de backup de 30 dias na cron table. |
| RNF-22 | Precisão Temporal de Cron Jobs | Fiabilidade | RNF-22-T1, T2 | ❌ FALHA | Cronjobs (@Scheduled) completamente omissos na codebase. |
| RNF-23 | Stack Tecnológica Mandatória | Conformidade | RNF-23-T1 a T4 | ✅ PASSA | Stack estritamente cumprida (React/Spring/MySQL). |
| RNF-24 | Modelo de Deployment e Conectividade | Conformidade | RNF-24-T1 a T3 | ⚠️ PARCIAL | Aplicação não tem Dockerfile direto, compilável via Maven/Node. |
| RNF-25 | Conformidade RGPD | Conformidade | RNF-25-T1 a T4 | ❌ FALHA | BUG-024 (Sem "Direito ao esquecimento" - eliminação total de conta). |
| RNF-26 | Proibição de Algoritmos de Segurança In-House | Conformidade | RNF-26-T1 a T4 | ✅ PASSA | Utilizados JWT standard (jjwt) e BCrypt da Spring Security. |
| RNF-27 | Segregação Societária e Financeira | Conformidade | RNF-27-T1 a T4 | ✅ PASSA | Segregação SAD/Clube presente estruturalmente nos models (CFO). |

---

## SECÇÃO 3 — Sumário de Cobertura

### 3.1. Requisitos Funcionais (RF)
- **Total RFs:** 42
- **✅ VERIFICADOS:** 3 (7.1%)
- **⚠️ PARCIAIS:** 20 (47.6%)
- **❌ NÃO SATISFEITOS:** 12 (28.6%)
- **➖ NÃO TESTADOS:** 7 (16.7%)

### 3.2. Requisitos Não Funcionais (RNF)
- **Total RNFs:** 27
- **✅ VERIFICADOS:** 10 (37.0%)
- **⚠️ PARCIAIS:** 4 (14.8%)
- **❌ FALHA/N/A:** 13 (48.1%)

### 3.3. Requisitos Críticos (Alta/Crítica) NÃO Satisfeitos
1. **RF-09 / UC-07 (Ficha de jogo):** Bloqueio de submissão do onze inicial; erros severos ao avaliar golos negativos.
2. **RF-14 / RF-15 (Diretor Técnico):** Funcionalidades fulcrais de calendário global e análise de rendimento estão em puro mock visual, sem implementação na API.
3. **RF-22 / RF-36 (CRUD Entidades):** Criação de atletas e EEs não expostas adequadamente no frontend para os funcionários da Secretaria.
4. **RNF-12 (XSS):** API devolve tags de injeção HTML de forma perigosa (Falha severa de Segurança).
5. **RNF-25 (RGPD):** Falta capacidade de o utilizador apagar todos os seus dados.

---

## SECÇÃO 4 — Rastreabilidade Cruzada RF → UC → US → Teste

| RF | UC | US | Cenários T4 (Aceitação) | Estado |
|---|---|---|---|---|
| RF-01 | UC-05.1 | US01 | AC-01, AC-02 | ⚠️ PARCIAL |
| RF-03 | UC-05.3 | US05 | AC-05 | ❌ FALHA |
| RF-04 | UC-06.2 | US06 | AC-06 | ❌ FALHA |
| RF-06 | UC-06.1 | US06 | AC-06 | ❌ FALHA |
| RF-09 | UC-07 | US09 | AC-08, AC-09 | ❌ FALHA |
| RF-11 | UC-08 | US03 | AC-03 | ✅ PASSA |
| RF-12 | UC-12.1 | US11-15 | AC-12 | ⚠️ PARCIAL |
| RF-13 | UC-12.2 | US11-15 | AC-10 | ✅ PASSA |
| RF-14 | UC-12.3 | US34 | AC-29 | ⚠️ PARCIAL |
| RF-15 | UC-12.4 | US34 | AC-27, AC-28 | ❌ FALHA |
| RF-16 | UC-09.1 | US38 | AC-23 | ✅ PASSA |
| RF-17 | UC-09.3 | US37 | AC-22 | ✅ PASSA |
| RF-18 | UC-09.4 | US40 | AC-25 | ✅ PASSA |
| RF-20 | UC-10.1 | US35 | AC-20 | ✅ PASSA |
| RF-24 | UC-16.1 | US41 | AC-26 | ✅ PASSA |
| RF-30 | UC-04 | US17 | AC-14 | ✅ PASSA |
| RF-32 | UC-14.2 | US23 | AC-16 | ⚠️ PARCIAL |
| RF-33 | UC-14.3 | US25 | AC-18 | ✅ PASSA |
| RF-37 | UC-13 | US16 | AC-13 | ⚠️ PARCIAL |
