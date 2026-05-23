---
name: srs-knowledge
description: >
  Requisitos Funcionais (RF) e Não-Funcionais (RNF) do sistema SIGD, extraídos do
  documento SRS IEEE 830. Usar quando precisar de saber PORQUÊ uma funcionalidade
  existe, quais as regras de negócio obrigatórias, critérios de verificação/teste,
  ou validações que o sistema DEVE implementar. Cada RF tem: ID, descrição detalhada,
  critérios de QA e dependências com outros RFs.
---

# Requisitos do Sistema SIGD

O ficheiro PDF `RF-RNF.pdf` na pasta references/ contém a especificação completa
de todos os Requisitos Funcionais (RF-01 a RF-31+) e Requisitos Não-Funcionais.

## Domínios cobertos:
- **Relvado (RF-01 a RF-05):** Assiduidade, Justificações, Avaliações, Convocatórias, Confrontos
- **Direção Técnica (RF-06 a RF-13):** Hierarquia, Plantéis, Quadros, Fichas Jogo, Dashboards
- **Clínica (RF-14 a RF-19):** EMDs, Bloqueio, Semáforo, Ocorrências, Altas
- **Portal (RF-20):** Portal B2C do utilizador
- **Transversais (RF-21 a RF-25):** Documentos, Auth/RBAC, Notificações, Audit Trail
- **Tesouraria (RF-26+):** Faturação, Quotas, Split financeiro

Ao implementar qualquer feature, CONSULTAR o RF correspondente para garantir
que TODAS as validações, regras de negócio e critérios de QA estão cobertos.
