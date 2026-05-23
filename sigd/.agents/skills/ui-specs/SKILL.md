---
name: ui-specs
description: >
  Especificações detalhadas de UI/UX por módulo do SIGD. Usar SEMPRE antes de
  implementar qualquer ecrã, componente ou modal. Cada ficheiro .md descreve com
  rigor: layout, dados exibidos, ações/botões, regras de negócio visuais, e
  navegação em 3 níveis (N1: vista principal, N2: drill-down, N3: modais/ações).
  Inclui também o DESIGN.md com o design system completo (tokens, componentes core,
  padrões responsivos).
---

# Especificações de Interface — SIGD

## Design System Global
- `DESIGN.md` — Paleta de cores, tipografia, espaçamento, componentes core,
  regras de responsividade (Desktop vs Mobile). CONSULTAR SEMPRE antes de
  estilizar qualquer componente.

## Módulos por Role
- `ADMIN.md` — Gestão de Acessos, Auditoria, Configurações Globais
- `CEO.md` — Dashboard Executivo (5 abas, read-only transversal)
- `CFO.md` — Dashboard Financeiro (4 abas, read-only)
- `DIRETOR_DESPORTIVO.md` — Calendário, Plantéis, Quadros, Análise (4 abas)
- `MEDICO.md` — Fila EMDs, Dossiês Clínicos, Monitorização (3 abas)
- `SECRETARIA.md` — Atendimento, Entidades, Validação Documental, Config (4 abas)
- `TREINADOR.md` — App Mobile: Assiduidade, Convocatórias, Fichas (Bottom Nav 4 itens)
- `PORTAL.md` — App Mobile B2C: Home, Financeiro, Documentos (Bottom Nav)

## REGRA OBRIGATÓRIA
Ao implementar qualquer ecrã:
1. Abrir o ficheiro UI do módulo correspondente
2. Localizar a ABA e o NÍVEL correto (N1/N2/N3)
3. Implementar EXATAMENTE o layout, dados e ações descritos
4. Cruzar com o RF correspondente (skill srs-knowledge) para validações
5. Aplicar tokens do DESIGN.md (cores, tipografia, espaçamento, componentes)
