-- Ocorrências clínicas (usa atleta IDs 4, 5, 6 que existem na BD)
INSERT IGNORE INTO ocorrencia (atleta_id, data_ocorrencia, tipo, diagnostico, grau_restricao, data_reavaliacao, estado_emd, estado, medico_id, criado_em, atualizado_em)
VALUES 
(4, '2026-05-10', 'LESAO', 'Entorse do tornozelo direito grau II. Recomendado repouso e fisioterapia.', 'AMARELO', '2026-05-25', 'EM_AVALIACAO', 'ATIVA', 4, NOW(), NOW()),
(5, '2026-05-15', 'DOENCA', 'Síndrome gripal com febre. Afastamento temporário do treino.', 'VERDE', '2026-05-22', 'DELIBERADO', 'RESOLVIDA', 4, NOW(), NOW()),
(6, '2026-05-20', 'TRAUMA', 'Contusão no joelho esquerdo após colisão em treino. Sem fractura confirmada.', 'VERMELHO', '2026-06-05', 'EM_AVALIACAO', 'ATIVA', 4, NOW(), NOW());

-- Obrigações financeiras (usa encarregado IDs 1, 2, 3)
INSERT IGNORE INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, criado_em, atualizado_em)
VALUES
(120.00, '2026-04-30', 'QUOTA_ANUAL', 'PAGO', 'CLUBE', 1, 4, NOW(), NOW()),
(35.00, '2026-05-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 2, 5, NOW(), NOW()),
(35.00, '2026-05-01', 'MENSALIDADE', 'PENDENTE', 'CLUBE', 3, 6, NOW(), NOW()),
(35.00, '2026-06-01', 'MENSALIDADE', 'PENDENTE', 'CLUBE', 1, 4, NOW(), NOW());
