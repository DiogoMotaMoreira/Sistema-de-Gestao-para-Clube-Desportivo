---
description: Coding standards for the SIGD project. Enforced on all TypeScript, TSX, and Java files.
globs: ["**/*.ts", "**/*.tsx", "**/*.java"]
alwaysApply: true
---

# Coding Standards — SIGD

## TypeScript / React Native
- SEMPRE TypeScript strict. NUNCA `any`, `as any`, `@ts-ignore`, `@ts-expect-error`.
- Exportar componentes por default: `export default function NomeScreen() {}`
- Props tipadas com interface nomeada: `interface NomeScreenProps { ... }`
- Hooks custom prefixados com `use`: `useAuth()`, `useAtletas()`
- Máximo 300 linhas por ficheiro. Se ultrapassar, extrair sub-componentes.
- Cada screen num ficheiro próprio em src/screens/{modulo}/.
- Cada modal num ficheiro próprio em src/components/modals/.
- NUNCA `console.log` em código final — usar utilitário de logging.
- NUNCA fetch() direto — SEMPRE via src/services/{dominio}Service.ts.
- NUNCA hardcodar cores — importar de src/constants/colors.ts.
- NUNCA hardcodar endpoints — importar de src/constants/endpoints.ts.
- NUNCA usar Tailwind/NativeWind — SEMPRE StyleSheet.create().
- NUNCA usar emojis como indicadores visuais — SEMPRE Lucide icons + Soft Badges.
- Loading states OBRIGATÓRIOS em todas as chamadas API.
- Error handling com try/catch e feedback visual ao utilizador.

## React Navigation
- Cada role tem o seu Stack Navigator em src/navigation/stacks/.
- AppNavigator decide o stack com base no role do JWT decodificado.
- TODAS as rotas tipadas com ParamList: `type ClinicaStackParamList = { ... }`.

## Estilos React Native
- StyleSheet.create() no fundo de cada ficheiro.
- Tokens de cor via import: `import { colors } from '@/constants/colors'`.
- Espaçamento em múltiplos de 4: 4, 8, 12, 16, 24, 32.
- Border radius: inputs 8, cards 12, modais 16, avatares 9999.
- Platform.select() ou Platform.OS para diferenças web/mobile.

## Java / Spring Boot
- Package structure: `com.sigd.{dominio}.{camada}`.
- Controllers: apenas recebem requests, validam com @Valid, delegam para service, retornam ResponseEntity.
- Services: contêm TODA a lógica de negócio. Anotados com @Service e @Transactional onde necessário.
- Repositories: extends JpaRepository<Entity, Long>. Custom queries com @Query.
- DTOs: records Java (record RequestDto, record ResponseDto). NUNCA expor @Entity.
- Segurança: @PreAuthorize nos controllers. NUNCA confiar em validação só do frontend.
- Erros: throw custom exceptions (ex: AtletaNotFoundException) capturadas por @ControllerAdvice global.
