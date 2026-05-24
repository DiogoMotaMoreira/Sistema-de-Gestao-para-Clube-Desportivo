-- =====================================================================
-- SIGD — Schema Inicial
-- Versão: V1
-- Data: 2026-05-24
-- =====================================================================

-- === CORE TABLES ===

-- Tabela de Modalidades (criada primeiro por dependências FK)
CREATE TABLE IF NOT EXISTS `modalidade` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Escalões
CREATE TABLE IF NOT EXISTS `escalao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `designacao` VARCHAR(255) NOT NULL,
  `limite_idade_min` INT,
  `limite_idade_max` INT,
  `quota_anual` DECIMAL(10, 2),
  `mensalidade_base` DECIMAL(10, 2),
  `mensalidade_socio` DECIMAL(10, 2),
  `teto_convocatoria` INT,
  UNIQUE KEY `uk_escalao_designacao` (`designacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Utilizadores (autenticação)
CREATE TABLE IF NOT EXISTS `utilizador` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_role` (`role`),
  INDEX `idx_ativo` (`ativo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Equipas
CREATE TABLE IF NOT EXISTS `equipa` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `escalao_id` BIGINT NOT NULL,
  `modalidade_id` BIGINT NOT NULL,
  `ativa` BOOLEAN NOT NULL DEFAULT TRUE,
  `criada_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_escalao` (`escalao_id`),
  INDEX `idx_modalidade` (`modalidade_id`),
  CONSTRAINT `fk_equipa_escalao` FOREIGN KEY (`escalao_id`) REFERENCES `escalao` (`id`),
  CONSTRAINT `fk_equipa_modalidade` FOREIGN KEY (`modalidade_id`) REFERENCES `modalidade` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Encarregados de Educação
CREATE TABLE IF NOT EXISTS `encarregado_educacao` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `nif` VARCHAR(20) UNIQUE,
  `email` VARCHAR(255),
  `telemovel` VARCHAR(20),
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ee_nif` (`nif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Atletas
CREATE TABLE IF NOT EXISTS `atleta` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome_completo` VARCHAR(255) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `nif` VARCHAR(20) UNIQUE,
  `numero_socio` VARCHAR(50),
  `posicao` VARCHAR(100),
  `estado_elegibilidade` VARCHAR(50) NOT NULL DEFAULT 'APTO',
  `equipa_id` BIGINT,
  `encarregado_id` BIGINT,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_estado` (`estado_elegibilidade`),
  INDEX `idx_atleta_nif` (`nif`),
  CONSTRAINT `fk_atleta_equipa` FOREIGN KEY (`equipa_id`) REFERENCES `equipa` (`id`),
  CONSTRAINT `fk_atleta_encarregado` FOREIGN KEY (`encarregado_id`) REFERENCES `encarregado_educacao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Audit Log (append-only — NUNCA DELETE/UPDATE)
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` BIGINT,
  `usuario_role` VARCHAR(50),
  `acao` VARCHAR(255) NOT NULL,
  `entidade` VARCHAR(255) NOT NULL,
  `entidade_id` BIGINT,
  `payload_antes` LONGTEXT,
  `payload_depois` LONGTEXT,
  INDEX `idx_audit_timestamp` (`timestamp`),
  INDEX `idx_audit_entidade` (`entidade`),
  INDEX `idx_audit_usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
-- SEED DATA
-- =====================================================================
-- Passwords: todas as contas usam a password "Sigd@2025"
-- Hash BCrypt gerado com cost factor 10

INSERT INTO `utilizador` (`username`, `email`, `password_hash`, `role`, `ativo`) VALUES
('admin',      'admin@sigd.local',         '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_ADMIN',      TRUE),
('ceo',        'ceo@boavista.pt',          '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_CEO',        TRUE),
('secretaria', 'secretaria@boavista.pt',   '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_SECRETARIA', TRUE),
('medico',     'medico@boavista.pt',       '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_MEDICO',     TRUE),
('treinador',  'treinador@boavista.pt',    '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_TREINADOR',  TRUE);

INSERT INTO `modalidade` (`nome`) VALUES ('Futebol'), ('Futsal');

INSERT INTO `escalao` (`designacao`, `limite_idade_min`, `limite_idade_max`, `quota_anual`, `mensalidade_base`, `mensalidade_socio`, `teto_convocatoria`) VALUES
('Seniores', 18, NULL,  500.00, 100.00, 80.00, 25),
('Sub-19',   17, 19,    300.00,  80.00, 60.00, 22),
('Sub-17',   15, 17,    250.00,  70.00, 50.00, 20),
('Sub-15',   13, 15,    200.00,  60.00, 40.00, 18);
