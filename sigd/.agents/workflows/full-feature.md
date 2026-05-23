---
name: full-feature
description: Implementa uma feature completa end-to-end (backend + frontend) a partir de um RF ou UC.
---

# Workflow: Feature Completa (Full-Stack)

## Input: ID do RF ou UC (ex: "RF-17" ou "UC-12.1")

## Passos:

### 1. Análise
- Ler RF/UC na skill correspondente
- Identificar: entidades, endpoints, ecrãs afetados
- Listar dependências (outros RFs que precisam de existir)
- Verificar no project-context.md se dependências já estão implementadas

### 2. Backend (invocar /new-api-endpoint para cada endpoint)
- Model → DTO → Repository → Service → Controller → Test

### 3. Frontend (invocar /new-screen para cada ecrã)
- Screen → Components → Service → Navigation

### 4. Integração
- Testar fluxo: UI → API → Service → DB → Response → UI
- Verificar RBAC (role errada = 403)
- Verificar validações client + server side
- Atualizar project-context.md com checkbox da feature

### 5. Code Review Checklist
- [ ] TypeScript strict, sem `any`
- [ ] Cores via constants, não hardcoded
- [ ] Loading states em todas as chamadas
- [ ] Error handling com feedback visual
- [ ] accessibilityLabel nos touchables
- [ ] Responsivo (web vs mobile testado)
- [ ] Backend: @Valid, @PreAuthorize, @Transactional
- [ ] Testes unitários no service
