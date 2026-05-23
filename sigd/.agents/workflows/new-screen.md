---
name: new-screen
description: Cria um novo ecrã do SIGD seguindo specs de UI, requisitos e design system.
---

# Workflow: Criar Novo Ecrã

## Input: Nome do ecrã + módulo (ex: "FilaEMDsScreen do módulo Clínica")

## Passos:

### 1. Recolher Contexto
- Abrir skill `ui-specs` → ler o ficheiro do módulo (ex: MEDICO.md)
- Localizar a ABA e NÍVEL do ecrã pedido
- Abrir skill `srs-knowledge` → ler os RFs referenciados
- Abrir skill `use-cases` → ler os UCs que mapeiam para este ecrã
- Ler DESIGN.md para tokens de design

### 2. Criar Screen
- Ficheiro: `apps/mobile/src/screens/{modulo}/{NomeScreen}.tsx`
- Implementar layout descrito no spec de UI
- Usar cores de `@/constants/colors`
- `Platform.select()` onde web/mobile divergem
- TypeScript strict em tudo

### 3. Criar Componentes de Suporte
- Domain components em `components/domain/` (ex: SemaforoBadge, CardEquipa)
- Modais em `components/modals/` (ex: ModalNovaOcorrencia)
- Reutilizar componentes de `components/ui/`

### 4. Criar/Atualizar Service
- Verificar se `services/{dominio}Service.ts` existe
- Adicionar métodos API com tipos request/response
- Consultar skill `architecture` para endpoints corretos

### 5. Integrar na Navegação
- Adicionar ao Stack do módulo em `navigation/stacks/`
- Tipar na ParamList

### 6. Verificar
- Todas as regras de negócio do RF implementadas?
- Fluxos alternativos e de exceção dos UCs cobertos?
- Loading states e error handling presentes?
- Responsive (web vs mobile) correto?
