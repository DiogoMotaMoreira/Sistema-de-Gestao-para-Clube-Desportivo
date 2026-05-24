-- =====================================================================
-- SIGD — Módulo Secretaria / Tesouraria
-- Versão: V2
-- Data: 2026-05-24
-- Descrição: Adiciona tabela obrigacao_financeira + alterações em
--            encarregado_educacao (morada) e escalao (modalidade_id)
-- =====================================================================

-- === ALTERAÇÕES EM TABELAS EXISTENTES ===

-- Adicionar campo morada ao encarregado de educação
ALTER TABLE `encarregado_educacao` ADD COLUMN `morada` VARCHAR(500) AFTER `telemovel`;

-- Adicionar FK modalidade_id ao escalão (nullable para compatibilidade com V1 seed data)
ALTER TABLE `escalao` ADD COLUMN `modalidade_id` BIGINT AFTER `teto_convocatoria`;
ALTER TABLE `escalao` ADD CONSTRAINT `fk_escalao_modalidade`
    FOREIGN KEY (`modalidade_id`) REFERENCES `modalidade` (`id`);

-- === NOVA TABELA ===

-- Tabela de Obrigações Financeiras (quotas, mensalidades, inscrições)
CREATE TABLE IF NOT EXISTS `obrigacao_financeira` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `valor` DECIMAL(10, 2) NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `tipo` VARCHAR(30) NOT NULL COMMENT 'QUOTA_ANUAL | MENSALIDADE | INSCRICAO',
  `estado` VARCHAR(30) NOT NULL DEFAULT 'PENDENTE' COMMENT 'PENDENTE | PAGO | EM_ATRASO',
  `entidade_juridica` VARCHAR(10) COMMENT 'CLUBE | SAD — segregação financeira obrigatória',
  `data_pagamento` DATE,
  `encarregado_id` BIGINT NOT NULL,
  `atleta_id` BIGINT,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_obf_encarregado` (`encarregado_id`),
  INDEX `idx_obf_estado` (`estado`),
  INDEX `idx_obf_entidade` (`entidade_juridica`),
  CONSTRAINT `fk_obf_encarregado` FOREIGN KEY (`encarregado_id`) REFERENCES `encarregado_educacao` (`id`),
  CONSTRAINT `fk_obf_atleta` FOREIGN KEY (`atleta_id`) REFERENCES `atleta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
