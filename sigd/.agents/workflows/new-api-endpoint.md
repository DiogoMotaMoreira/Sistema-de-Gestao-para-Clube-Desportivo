---
name: new-api-endpoint
description: Cria um endpoint REST completo no backend Spring Boot.
---

# Workflow: Criar Endpoint API

## Input: Verbo + Path + Descrição (ex: "POST /api/v1/clinica/exames — Upload EMD")

## Passos:

### 1. Contexto
- Consultar skill `architecture` para padrões de API
- Consultar skill `srs-knowledge` para regras de negócio do RF

### 2. Model (se necessário)
- Criar/atualizar @Entity em `com.sigd.{dominio}.model`
- Relações JPA (@OneToMany, @ManyToOne, etc.)
- Enums em package separado

### 3. DTO
- Record Java para Request e Response em `com.sigd.{dominio}.dto`
- Jakarta validations (@NotNull, @NotBlank, @Size, @Future)
- NUNCA expor a @Entity

### 4. Repository
- Interface extends JpaRepository em `com.sigd.{dominio}.repository`
- Custom queries com @Query se necessário

### 5. Service
- Lógica de negócio em `com.sigd.{dominio}.service`
- @Transactional em operações de escrita
- Validações de negócio (ex: data futura, elegibilidade)
- Integração com AuditService para logging

### 6. Controller
- @RestController em `com.sigd.{dominio}.controller`
- @PreAuthorize("hasRole('ROLE_X')")
- @Valid nos @RequestBody
- ResponseEntity com códigos corretos (200, 201, 400, 403, 404)

### 7. Teste
- JUnit 5 + Mockito no Service
- Testar happy path + edge cases do RF
