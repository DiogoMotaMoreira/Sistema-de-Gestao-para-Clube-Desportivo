INSERT IGNORE INTO utilizador (username, email, password_hash, role, ativo, criado_em, atualizado_em) VALUES
('diretor', 'diretor@boavista.pt', '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_DIRETOR_TECNICO', true, NOW(), NOW()),
('cfo', 'cfo@boavista.pt', '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_CFO', true, NOW(), NOW()),
('ee_teste', 'ee@sigd.pt', '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_EE', true, NOW(), NOW()),
('atleta_teste', 'atleta@sigd.pt', '$2a$10$c.2O/7egF1XazYHIXSovuOhcqTdNk.GJh4n00tOCtlqkKNjI.WnM2', 'ROLE_ATLETA', true, NOW(), NOW());
