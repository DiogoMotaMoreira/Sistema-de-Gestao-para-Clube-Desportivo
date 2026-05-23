---
description: Persistent project context — estado atual, decisões tomadas, e o que já foi implementado.
alwaysApply: true
---

# Contexto Persistente — SIGD

## Estado do Projeto
- Fase 1 (Requisitos): ✅ CONCLUÍDA — 46 User Stories, 43+ RF, SRS IEEE 830
- Fase 2 (Arquitetura): ✅ CONCLUÍDA — ADRs, API spec, diagramas UML, mockups Figma
- Fase 3 (Implementação): 🔄 EM CURSO
- Fase 4 (Testes/Validação): ⏳ Pendente

## O que JÁ foi implementado
(Atualizar esta secção à medida que features são concluídas)
- [ ] Setup Expo + TypeScript + React Navigation
- [ ] Sistema de Auth (Login, JWT, RBAC routing)
- [ ] Design System (componentes base: Button, Card, Badge, Input)
- [ ] Módulo Clínica
- [ ] Módulo Direção Técnica
- [ ] Módulo Treinador (Mobile)
- [ ] Módulo Secretaria
- [ ] Módulo Portal B2C (Mobile)
- [ ] Módulo CEO
- [ ] Módulo CFO
- [ ] Módulo Admin
- [ ] Backend API

## Decisões Arquiteturais Tomadas (ADRs)
- ADR-01: Layered Architecture, monólito modular Spring Boot
- ADR-02: React Native + Expo (Web + Mobile numa só codebase)
- ADR-03: JWT stateless + Spring Security RBAC
- ADR-04: Segregação SAD/Clube via coluna discriminadora (MySQL sem RLS nativo)
- ADR-05: Audit trail append-only com JPA EntityListener
- ADR-06: Cron jobs @Scheduled para alertas EMD e fecho fichas
- ADR-07: API REST JSON versionada /api/v1/, paginação Spring Data
