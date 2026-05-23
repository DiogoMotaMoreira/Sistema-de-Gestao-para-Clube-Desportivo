---
name: architecture
description: >
  Decisões arquiteturais (ADRs), especificação da API REST, modelo de dados e
  padrões técnicos do SIGD. Usar quando precisar de saber: como estruturar um
  endpoint, quais DTOs usar, como as entidades se relacionam, como implementar
  autenticação JWT, como funciona o RBAC, ou como configurar o Spring Boot.
---

# Arquitetura do SIGD

## Referências
- `DESIGN.md` — Design System (tokens, componentes, responsividade)
- Os ADRs estão documentados no ficheiro AGENTS.md (secção rules/project-context.md)

## Padrões de API REST
- Base: `/api/v1/{dominio}/{recurso}`
- Verbos: GET (listar/detalhe), POST (criar), PUT (update completo), PATCH (update parcial), DELETE (soft-delete)
- Auth: Header `Authorization: Bearer <jwt_token>` em todos os endpoints exceto /auth/login
- Paginação: `?page=0&size=20&sort=nome,asc`
- Filtros: query params (ex: `?estado=PENDENTE&escalao=Sub-19`)
- Respostas: JSON com envelope `{ data, pagination?, message? }`
- Erros: `{ status: 400, error: "Bad Request", message: "...", timestamp: "...", path: "/api/v1/..." }`

## Modelo de Dados (Entidades Principais)
- Utilizador (id, username, passwordHash, role, ativo)
- Atleta (id, nome, dataNascimento, nif, estadoElegibilidade, equipa, encarregado)
- Equipa (id, nome, escalao, modalidade, atletas, corpoTecnico)
- Escalao (id, designacao, limiteIdade, quotaAnual, mensalidadeBase, mensalidadeSocio)
- Modalidade (id, nome, escaloes)
- MembroCorpoTecnico (id, nome, funcao, equipa, utilizador)
- EncarregadoEducacao (id, nome, nif, email, telemovel, atletas, obrigacoes)
- ExameMedico (id, atleta, dataSubmissao, dataValidade, estado, ficheiro)
- OcorrenciaClinica (id, atleta, data, descricao, regiao, grauRestricao, estado)
- SessaoTreino (id, equipa, data, hora, infraestrutura, presencas)
- JogoOficial (id, equipa, data, local, adversario, quadroCompetitivo, convocatoria, fichaJogo)
- ObrigacaoFinanceira (id, encarregado, valor, entidadeJuridica, estado)
- AuditLog (id, timestamp, userId, role, acao, entidade, payloadAntes, payloadDepois)
