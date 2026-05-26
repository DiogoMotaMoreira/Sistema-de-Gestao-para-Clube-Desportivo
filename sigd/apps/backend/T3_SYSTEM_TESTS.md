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
| Bloco 1 — Auth + Admin | 6 | — | — | — |
| Bloco 2 — Secretaria | 6 | — | — | — |
| Bloco 3 — Médico/Clínica | 7 | — | — | — |
| Bloco 4 — Treinador | 7 | — | — | — |
| Bloco 5 — Portal EE | 5 | — | — | — |
| Bloco 6 — CEO/CFO/DT | 5 | — | — | — |
| **TOTAL** | **36** | **—** | **—** | **—** |

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
| 1 | Abre http://localhost:8082 | Ecrã de login aparece | | |
| 2 | Introduz username: `admin` password: `Sigd@2025` | Campos preenchidos | | |
| 3 | Clica "Entrar" | Redireccionado para dashboard Admin | | |
| 4 | Verifica que aparece "admin" no canto superior esquerdo | Nome do utilizador visível | | |

**Estado geral:** ___

---

### TS-02 — Login com credenciais inválidas

**RF:** RF-40 | **RNF:** RNF-07

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | No ecrã de login, introduz username: `admin` password: `errada123` | Campos preenchidos | | |
| 2 | Clica "Entrar" | Mensagem de erro visível (ex: "Credenciais inválidas") | | |
| 3 | Verifica que NÃO foi redireccionado para o dashboard | Permanece no ecrã de login | | |

**Estado geral:** ___

---

### TS-03 — Bloqueio de conta (conta inactiva)

**RF:** RF-40 | **RNF:** RNF-07 | **BUG a verificar:** BUG-015

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | | |
| 2 | Vai a Gestão de Acessos | Lista de utilizadores aparece | | |
| 3 | Clica "Bloquear" no utilizador `treinador` | Badge muda para "Inativo" | | |
| 4 | Faz logout | Volta ao ecrã de login | | |
| 5 | Tenta login com `treinador` / `Sigd@2025` | Mensagem "Conta bloqueada. Contacte o administrador." | | |
| 6 | Verifica que NÃO entrou no sistema | Permanece no ecrã de login | | |
| 7 | Login como `admin` e reactiva o `treinador` | Badge volta a "Ativo" | | |

**Estado geral:** ___

---

### TS-04 — Controlo de acesso por role (RBAC)

**RF:** RF-40 | **RNF:** RNF-09

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `treinador` / `Sigd@2025` | Dashboard Treinador | | |
| 2 | Tenta aceder directamente a http://localhost:8082 como se fosse Admin | Não mostra módulos de Admin na sidebar | | |
| 3 | Verifica que o menu só tem opções de Treinador (Hoje, Plantel, Jogos, etc.) | Só opções do Treinador visíveis | | |
| 4 | Faz logout | Volta ao login | | |
| 5 | Login como `medico` / `Sigd@2025` | Dashboard Médico | | |
| 6 | Verifica que o menu só tem opções de Médico (Fila EMDs, Dossiês, Monitorização) | Só opções do Médico visíveis | | |

**Estado geral:** ___

---

### TS-05 — Consulta de Auditoria

**RF:** RF-24 | **UC:** UC-16.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | | |
| 2 | Clica em "Auditoria e Segurança" | Lista de eventos de auditoria aparece | | |
| 3 | Verifica que há registos com usernames reais (admin, secretaria, etc.) | Usernames visíveis nas entradas | | |
| 4 | No campo de pesquisa, escreve `medico` | Lista filtra para mostrar só entradas do médico | | |
| 5 | Clica em "✕ Limpar" | Filtro é removido, lista volta ao estado inicial | | |
| 6 | Clica no cabeçalho "DATA/HORA" | Lista ordena por data (mais recente ou mais antiga) | | |

**Estado geral:** ___

---

### TS-06 — Criar novo utilizador

**RF:** RF-38 | **UC:** UC-15.1

| # | Acção | Resultado Esperado | Resultado Real | Estado |
|---|---|---|---|---|
| 1 | Login como `admin` / `Sigd@2025` | Dashboard Admin | | |
| 2 | Vai a Gestão de Acessos | Lista de utilizadores | | |
| 3 | Preenche formulário: username `testenovo`, email `teste@sigd.pt`, password `Teste@2026`, role `SECRETARIA` | Campos preenchidos | | |
| 4 | Clica "Criar Colaborador" | Novo utilizador aparece na lista | | |
| 5 | Faz logout e tenta login com `testenovo` / `Teste@2026` | Login bem-sucedido, dashboard Secretaria | | |
| 6 | Volta ao admin e apaga/bloqueia o utilizador de teste | Utilizador bloqueado | | |

**Estado geral:** ___

---

## Bloco 2 — Secretaria
*(A preencher após execução do Bloco 1)*

## Bloco 3 — Médico/Clínica
*(A preencher após execução do Bloco 1)*

## Bloco 4 — Treinador
*(A preencher após execução do Bloco 1)*

## Bloco 5 — Portal EE
*(A preencher após execução do Bloco 1)*

## Bloco 6 — CEO/CFO/DT
*(A preencher após execução do Bloco 1)*

---

## Bugs Confirmados em Sistema

| Bug ID | Descrição | Confirmado em Teste |
|---|---|---|
| BUG-015 | Conta bloqueada retorna 500 em vez de mensagem clara | TS-03 |
| BUG-016 | 403 em vez de 401 para requests sem token | — |
| (outros a confirmar) | | |
