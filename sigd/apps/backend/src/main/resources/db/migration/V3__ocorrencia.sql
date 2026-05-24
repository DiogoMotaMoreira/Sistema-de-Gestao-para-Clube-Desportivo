-- =====================================================================
-- SIGD — Módulo Clínica (RF-16)
-- Versão: V3
-- Data: 2026-05-24
-- =====================================================================

CREATE TABLE IF NOT EXISTS `ocorrencia` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `atleta_id` BIGINT NOT NULL,
  `data_ocorrencia` DATE NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `diagnostico` TEXT NOT NULL,
  `grau_restricao` VARCHAR(50) NOT NULL,
  `data_reavaliacao` DATE,
  `estado_emd` VARCHAR(50) NOT NULL DEFAULT 'EM_AVALIACAO',
  `estado` VARCHAR(50) NOT NULL DEFAULT 'ATIVA',
  `medico_id` BIGINT,
  `medico_deliberacao_id` BIGINT,
  `data_deliberacao` DATE,
  `obs_deliberacao` TEXT,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ocorrencia_atleta` (`atleta_id`),
  INDEX `idx_ocorrencia_estado_emd` (`estado_emd`),
  INDEX `idx_ocorrencia_estado` (`estado`),
  CONSTRAINT `fk_ocorrencia_atleta` FOREIGN KEY (`atleta_id`) REFERENCES `atleta` (`id`),
  CONSTRAINT `fk_ocorrencia_medico` FOREIGN KEY (`medico_id`) REFERENCES `utilizador` (`id`),
  CONSTRAINT `fk_ocorrencia_medico_deliberacao` FOREIGN KEY (`medico_deliberacao_id`) REFERENCES `utilizador` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
