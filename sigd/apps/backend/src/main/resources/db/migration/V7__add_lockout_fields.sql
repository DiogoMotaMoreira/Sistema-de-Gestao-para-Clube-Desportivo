ALTER TABLE utilizador
  ADD COLUMN tentativas_falhadas INT NOT NULL DEFAULT 0,
  ADD COLUMN bloqueado_ate DATETIME NULL;
