-- ============================================================
-- SEED MASTER DEMO — SIGD Boavista FC
-- Versão: 3.0 | Data: 27/05/2026
-- Uso: docker exec -i sigd-mysql mysql -u sigd_user -psigd_password_dev sigd_dev < seed_master_demo.sql
-- Password de todos os utilizadores: Sigd@2025
-- Hash BCrypt de "Sigd@2025": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- LIMPAR DADOS EXISTENTES (preserva estrutura e flyway)
-- ============================================================
TRUNCATE TABLE audit_log;
TRUNCATE TABLE avaliacao_rendimento;
TRUNCATE TABLE registo_assiduidade;
TRUNCATE TABLE convocatoria_atletas;
TRUNCATE TABLE convocatoria;
TRUNCATE TABLE ficha_jogo;
TRUNCATE TABLE ocorrencia_evolucao;
TRUNCATE TABLE ocorrencia;
TRUNCATE TABLE obrigacao_financeira;
TRUNCATE TABLE evento_desportivo;
TRUNCATE TABLE sessao_treino;
TRUNCATE TABLE atleta;
TRUNCATE TABLE encarregado_educacao;
TRUNCATE TABLE equipa;
TRUNCATE TABLE escalao;
TRUNCATE TABLE modalidade;
TRUNCATE TABLE epoca_desportiva;
DELETE FROM utilizador WHERE username NOT IN ('admin','ceo','secretaria','medico','treinador','cfo','diretor');
UPDATE utilizador SET
    tentativas_falhadas = 0,
    bloqueado_ate = NULL,
    ativo = 1
WHERE username IN ('admin','ceo','secretaria','medico','treinador','cfo','diretor');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SECÇÃO 1 — MODALIDADES
-- ============================================================
INSERT INTO modalidade (id, nome) VALUES
(1, 'Futebol'),
(2, 'Futsal');

-- ============================================================
-- SECÇÃO 2 — ESCALÕES
-- ============================================================
INSERT INTO escalao (id, designacao, limite_idade_min, limite_idade_max, quota_anual, mensalidade_base, mensalidade_socio, teto_convocatoria, modalidade_id) VALUES
(1, 'Sub-13',        9,  13, 100.00,  30.00, 24.00, 16, 1),
(2, 'Sub-15',       11,  15, 120.00,  35.00, 28.00, 18, 1),
(3, 'Sub-17',       13,  17, 140.00,  38.00, 30.00, 20, 1),
(4, 'Sub-19',       15,  19, 160.00,  42.00, 33.00, 22, 1),
(5, 'Seniores',     18,  99, 200.00,  50.00, 40.00, 25, 1),
(6, 'Sub-15 Futsal',11,  15, 100.00,  30.00, 24.00, 14, 2);

-- ============================================================
-- SECÇÃO 3 — EQUIPAS
-- ============================================================
INSERT INTO equipa (id, nome, escalao_id, modalidade_id, ativa) VALUES
(1, 'Sub-13 A',      1, 1, 1),
(2, 'Sub-15 A',      2, 1, 1),
(3, 'Sub-17 A',      3, 1, 1),
(4, 'Sub-19 A',      4, 1, 1),
(5, 'Seniores A',    5, 1, 1),
(6, 'Sub-15 Futsal', 6, 2, 1);

-- ============================================================
-- SECÇÃO 4 — ÉPOCA DESPORTIVA
-- ============================================================
INSERT INTO epoca_desportiva (id, nome, data_inicio, data_fim, estado) VALUES
(1, '2024/2025', '2024-09-01', '2025-06-30', 'ENCERRADA'),
(2, '2025/2026', '2025-09-01', '2026-06-30', 'ATIVA');

-- ============================================================
-- SECÇÃO 2 — ENCARREGADOS DE EDUCAÇÃO (15)
-- ============================================================
INSERT INTO encarregado_educacao (id, nome, nif, email, telemovel, morada) VALUES
(1,  'João Silva',          '123456789', 'ee@sigd.pt',                '912345678', 'Rua das Flores 10, Porto'),
(2,  'Maria Santos',        '987654321', 'maria.santos@email.com',    '923456789', 'Av. da Liberdade 50, Porto'),
(3,  'Carlos Ferreira',     '456789123', 'carlos.ferreira@email.com', '934567890', 'Rua do Boavista 5, Porto'),
(4,  'Ana Costa',           '321654987', 'ana.costa@email.com',       '945678901', 'Rua de Santa Catarina 20, Porto'),
(5,  'Rui Oliveira',        '654321098', 'rui.oliveira@email.com',    '956789012', 'Av. dos Aliados 100, Porto'),
(6,  'Sofia Pereira',       '789012345', 'sofia.pereira@email.com',   '967890123', 'Rua do Almada 30, Porto'),
(7,  'Miguel Gomes',        '234567890', 'miguel.gomes@email.com',    '978901234', 'Rua de Cedofeita 15, Porto'),
(8,  'Cristina Lopes',      '890123456', 'cristina.lopes@email.com',  '989012345', 'Rua do Campo Alegre 8, Porto'),
(9,  'António Martins',     '345678901', 'antonio.martins@email.com', '990123456', 'Av. Marechal Gomes 22, Porto'),
(10, 'Helena Rodrigues',    '901234567', 'helena.rodrigues@email.com','901234560', 'Rua de São Bento 40, Porto'),
(11, 'Paulo Carvalho',      '456789012', 'paulo.carvalho@email.com',  '912340001', 'Rua das Antas 12, Porto'),
(12, 'Teresa Alves',        '567890123', 'teresa.alves@email.com',    '923451112', 'Rua do Heroísmo 7, Porto'),
(13, 'Fernando Cunha',      '678901234', 'fernando.cunha@email.com',  '934562223', 'Rua do Bonfim 33, Porto'),
(14, 'Margarida Sousa',     '789012346', 'margarida.sousa@email.com', '945673334', 'Rua de Vilar 18, Porto'),
(15, 'Ricardo Nunes',       '890123457', 'ricardo.nunes@email.com',   '956784445', 'Rua de Fernandes Tomás 9, Porto');

-- ============================================================
-- SECÇÃO 2B — UTILIZADORES DO SISTEMA (7 roles)
-- ============================================================
INSERT IGNORE INTO utilizador (id, username, email, password_hash, role, ativo, tentativas_falhadas, bloqueado_ate) VALUES
(1, 'admin',      'admin@sigd.local',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_ADMIN',           1, 0, NULL),
(2, 'ceo',        'ceo@boavista.pt',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_CEO',             1, 0, NULL),
(3, 'secretaria', 'secretaria@boavista.pt', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_SECRETARIA',      1, 0, NULL),
(4, 'medico',     'medico@boavista.pt',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_MEDICO',          1, 0, NULL),
(5, 'treinador',  'treinador@boavista.pt',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_TREINADOR',       1, 0, NULL),
(6, 'cfo',        'cfo@boavista.pt',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_CFO',             1, 0, NULL),
(7, 'diretor',    'diretor@boavista.pt',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_DIRETOR_TECNICO', 1, 0, NULL);

-- ============================================================
-- SECÇÃO 2C — UTILIZADORES EE (um por encarregado)
-- ============================================================
INSERT INTO utilizador (username, email, password_hash, role, ativo, tentativas_falhadas, bloqueado_ate) VALUES
('ee_joao',      'ee@sigd.pt',                '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_maria',     'maria.santos@email.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_carlos',    'carlos.ferreira@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_ana',       'ana.costa@email.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_rui',       'rui.oliveira@email.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_sofia',     'sofia.pereira@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_miguel',    'miguel.gomes@email.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_cristina',  'cristina.lopes@email.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_antonio',   'antonio.martins@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_helena',    'helena.rodrigues@email.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_paulo',     'paulo.carvalho@email.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_teresa',    'teresa.alves@email.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_fernando',  'fernando.cunha@email.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_margarida', 'margarida.sousa@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL),
('ee_ricardo',   'ricardo.nunes@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1, 0, NULL);

-- ============================================================
-- SECÇÃO 3 — ATLETAS (50 distribuídos por 6 equipas)
-- Campos: id, nome_completo, data_nascimento, nif,
--         numero_socio, posicao, estado_elegibilidade,
--         encarregado_id, equipa_id, federado, data_validade_emd
-- Estados: APTO | CONDICIONADO | INAPTO | PENDENTE_EMD
-- ============================================================

-- Sub-13 A (equipa 1) — 12 atletas
-- Equipa do treinador — cenários variados para demo completa
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id, federado, data_validade_emd) VALUES
(1,  'Afonso Teixeira',   '2013-02-10', '100000001', 'S101', 'Guarda-Redes', 'APTO',         1,  1, 1, '2027-06-30'),
(2,  'Bernardo Faria',    '2013-05-22', '100000002', 'S102', 'Defesa',       'APTO',         2,  1, 1, '2027-06-30'),
(3,  'Dinis Carvalho',    '2013-08-14', '100000003', 'S103', 'Defesa',       'APTO',         3,  1, 1, '2027-06-30'),
(4,  'Eduardo Pinto',     '2013-11-03', '100000004', 'S104', 'Medio',        'APTO',         4,  1, 1, '2027-06-30'),
(5,  'Filipe Monteiro',   '2014-01-19', '100000005', 'S105', 'Medio',        'APTO',         5,  1, 1, '2027-06-30'),
(6,  'Gonçalo Reis',      '2013-04-07', '100000006', 'S106', 'Avancado',     'CONDICIONADO', 6,  1, 1, '2027-06-30'),
(7,  'Hugo Azevedo',      '2013-07-25', '100000007', 'S107', 'Avancado',     'APTO',         7,  1, 1, '2027-06-30'),
(8,  'Ivan Soares',       '2014-02-11', '100000008', 'S108', 'Defesa',       'APTO',         8,  1, 1, '2027-06-30'),
(9,  'Joaquim Brito',     '2013-09-30', '100000009', 'S109', 'Medio',        'PENDENTE_EMD', 9,  1, 0, NULL),
(10, 'Kevin Dias',        '2014-03-16', '100000010', 'S110', 'Avancado',     'APTO',         10, 1, 1, '2027-06-30'),
(11, 'Leandro Costa',     '2013-06-08', '100000011', 'S111', 'Medio',        'INAPTO',       11, 1, 1, '2027-06-30'),
(12, 'Martim Rocha',      '2014-04-20', '100000012', 'S112', 'Defesa',       'APTO',         12, 1, 1, DATE_ADD(CURDATE(), INTERVAL 20 DAY));

-- Sub-15 A (equipa 2) — 15 atletas
-- Equipa demo principal — EE joao tem atletas aqui
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id, federado, data_validade_emd) VALUES
(13, 'Tomas Silva',       '2011-03-15', '111222333', 'S201', 'Avancado',     'CONDICIONADO', 1,  2, 1, '2027-06-30'),
(14, 'Andre Costa',       '2011-09-14', '555666777', 'S202', 'Defesa',       'APTO',         1,  2, 1, '2027-06-30'),
(15, 'Ricardo Ferreira',  '2011-11-08', '333444555', 'S203', 'Medio',        'INAPTO',       2,  2, 1, '2027-06-30'),
(16, 'Diogo Martins',     '2011-06-20', '444555666', 'S204', 'Guarda-Redes', 'APTO',         2,  2, 1, '2027-06-30'),
(17, 'Miguel Oliveira',   '2012-01-30', '666777888', 'S205', 'Medio',        'APTO',         3,  2, 1, '2027-06-30'),
(18, 'Pedro Ferreira',    '2011-11-05', '777888999', 'S206', 'Avancado',     'APTO',         4,  2, 1, '2027-06-30'),
(19, 'Joao Pereira',      '2011-04-12', '888990001', 'S207', 'Defesa',       'APTO',         5,  2, 1, '2027-06-30'),
(20, 'Rui Gomes',         '2012-03-08', '999001112', 'S208', 'Medio',        'APTO',         6,  2, 1, '2027-06-30'),
(21, 'Francisco Lopes',   '2011-07-25', '000111223', 'S209', 'Avancado',     'APTO',         7,  2, 1, '2027-06-30'),
(22, 'Henrique Silva',    '2011-12-01', '112233446', 'S210', 'Guarda-Redes', 'PENDENTE_EMD', 8,  2, 0, NULL),
(23, 'Bruno Santos',      '2012-02-14', '223344557', 'S211', 'Defesa',       'APTO',         9,  2, 1, '2027-06-30'),
(24, 'Carlos Martins',    '2011-08-30', '334455668', 'S212', 'Medio',        'APTO',         10, 2, 1, '2027-06-30'),
(25, 'Luis Costa',        '2012-05-18', '445566779', 'S213', 'Avancado',     'APTO',         11, 2, 1, '2027-06-30'),
(26, 'Antonio Ferreira',  '2011-10-22', '556677880', 'S214', 'Defesa',       'APTO',         12, 2, 1, '2027-06-30'),
(27, 'Sergio Oliveira',   '2012-04-05', '667788991', 'S215', 'Medio',        'APTO',         13, 2, 1, DATE_ADD(CURDATE(), INTERVAL 25 DAY));

-- Sub-17 A (equipa 3) — 10 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id, federado, data_validade_emd) VALUES
(28, 'Alexandre Lima',    '2009-01-12', '200000001', 'S301', 'Guarda-Redes', 'APTO',         1,  3, 1, '2027-06-30'),
(29, 'Bruno Rocha',       '2009-04-23', '200000002', 'S302', 'Defesa',       'CONDICIONADO', 2,  3, 1, '2027-06-30'),
(30, 'Claudio Vieira',    '2009-07-08', '200000003', 'S303', 'Defesa',       'APTO',         3,  3, 1, '2027-06-30'),
(31, 'Daniel Marques',    '2009-10-17', '200000004', 'S304', 'Medio',        'APTO',         4,  3, 1, '2027-06-30'),
(32, 'Elias Ribeiro',     '2010-02-28', '200000005', 'S305', 'Medio',        'INAPTO',       5,  3, 1, '2027-06-30'),
(33, 'Fabio Correia',     '2009-06-14', '200000006', 'S306', 'Avancado',     'APTO',         6,  3, 1, '2027-06-30'),
(34, 'Gabriel Neves',     '2009-11-03', '200000007', 'S307', 'Avancado',     'APTO',         7,  3, 1, '2027-06-30'),
(35, 'Helio Campos',      '2010-03-21', '200000008', 'S308', 'Defesa',       'APTO',         8,  3, 1, '2027-06-30'),
(36, 'Igor Freitas',      '2009-08-09', '200000009', 'S309', 'Medio',        'PENDENTE_EMD', 9,  3, 0, NULL),
(37, 'Joel Barbosa',      '2010-01-05', '200000010', 'S310', 'Avancado',     'APTO',         10, 3, 1, '2027-06-30');

-- Sub-19 A (equipa 4) — 8 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id, federado, data_validade_emd) VALUES
(38, 'Leandro Pires',     '2007-05-14', '300000001', 'S401', 'Guarda-Redes', 'APTO',         11, 4, 1, '2027-06-30'),
(39, 'Marco Simoes',      '2007-08-27', '300000002', 'S402', 'Defesa',       'APTO',         12, 4, 1, '2027-06-30'),
(40, 'Nuno Macedo',       '2007-11-19', '300000003', 'S403', 'Defesa',       'CONDICIONADO', 13, 4, 1, '2027-06-30'),
(41, 'Oscar Tavares',     '2008-02-06', '300000004', 'S404', 'Medio',        'APTO',         14, 4, 1, '2027-06-30'),
(42, 'Pedro Guedes',      '2007-07-23', '300000005', 'S405', 'Medio',        'APTO',         15, 4, 1, '2027-06-30'),
(43, 'Quim Andrade',      '2008-04-11', '300000006', 'S406', 'Avancado',     'APTO',         1,  4, 1, '2027-06-30'),
(44, 'Rafael Esteves',    '2007-09-30', '300000007', 'S407', 'Avancado',     'INAPTO',       2,  4, 1, '2027-06-30'),
(45, 'Samuel Baptista',   '2008-01-17', '300000008', 'S408', 'Defesa',       'APTO',         3,  4, 1, '2027-06-30');

-- Seniores A (equipa 5) — 5 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id, federado, data_validade_emd) VALUES
(46, 'Tiago Moutinho',    '2003-03-10', '400000001', 'S501', 'Guarda-Redes', 'APTO',         4,  5, 1, '2027-06-30'),
(47, 'Ulisses Fonseca',   '2002-07-18', '400000002', 'S502', 'Defesa',       'APTO',         5,  5, 1, '2027-06-30'),
(48, 'Vasco Henriques',   '2001-11-25', '400000003', 'S503', 'Medio',        'APTO',         6,  5, 1, '2027-06-30'),
(49, 'Xavier Magalhaes',  '2000-04-03', '400000004', 'S504', 'Avancado',     'CONDICIONADO', 7,  5, 1, '2027-06-30'),
(50, 'Yuri Nascimento',   '2003-08-14', '400000005', 'S505', 'Avancado',     'APTO',         8,  5, 1, '2027-06-30');

-- ============================================================
-- SECÇÃO 4 — SESSÕES DE TREINO
-- Estados: PLANEADA | CONCLUIDA | CANCELADA
-- Tipos: TREINO | TATICO | AQUECIMENTO | FISICO
-- ============================================================

INSERT INTO sessao_treino (id, equipa_id, data, hora_inicio, hora_fim, tipo, estado) VALUES

-- Sub-13 A (equipa 1) — sessões hoje e futuras
(1,  1, CURDATE(),                              '08:30:00', '10:00:00', 'TREINO',      'PLANEADA'),
(2,  1, DATE_ADD(CURDATE(), INTERVAL 2 DAY),    '08:30:00', '10:00:00', 'TATICO',      'PLANEADA'),
(3,  1, DATE_ADD(CURDATE(), INTERVAL 4 DAY),    '08:30:00', '10:00:00', 'TREINO',      'PLANEADA'),

-- Sub-13 A — sessões passadas (para histórico e estatísticas)
(4,  1, DATE_SUB(CURDATE(), INTERVAL 1 DAY),    '08:30:00', '10:00:00', 'TREINO',      'CONCLUIDA'),
(5,  1, DATE_SUB(CURDATE(), INTERVAL 3 DAY),    '08:30:00', '10:00:00', 'FISICO',      'CONCLUIDA'),
(6,  1, DATE_SUB(CURDATE(), INTERVAL 6 DAY),    '08:30:00', '10:00:00', 'TREINO',      'CONCLUIDA'),
(7,  1, DATE_SUB(CURDATE(), INTERVAL 8 DAY),    '08:30:00', '10:00:00', 'TATICO',      'CONCLUIDA'),
(8,  1, DATE_SUB(CURDATE(), INTERVAL 10 DAY),   '08:30:00', '10:00:00', 'TREINO',      'CONCLUIDA'),

-- Sub-15 A (equipa 2) — sessões hoje e futuras
(9,  2, CURDATE(),                              '09:00:00', '10:30:00', 'TREINO',      'PLANEADA'),
(10, 2, CURDATE(),                              '16:00:00', '17:30:00', 'TATICO',      'PLANEADA'),
(11, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY),    '09:00:00', '10:30:00', 'TREINO',      'PLANEADA'),
(12, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY),    '16:00:00', '17:30:00', 'AQUECIMENTO', 'PLANEADA'),
(13, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY),    '09:00:00', '10:30:00', 'FISICO',      'PLANEADA'),

-- Sub-15 A — sessões passadas (para histórico, avaliações e estatísticas)
(14, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY),    '09:00:00', '10:30:00', 'TREINO',      'CONCLUIDA'),
(15, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY),    '16:00:00', '17:30:00', 'TATICO',      'CONCLUIDA'),
(16, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY),    '09:00:00', '10:30:00', 'TREINO',      'CONCLUIDA'),
(17, 2, DATE_SUB(CURDATE(), INTERVAL 7 DAY),    '16:00:00', '17:30:00', 'FISICO',      'CONCLUIDA'),
(18, 2, DATE_SUB(CURDATE(), INTERVAL 9 DAY),    '09:00:00', '10:30:00', 'TREINO',      'CONCLUIDA'),

-- Sub-17 A (equipa 3) — sessões hoje e futuras
(19, 3, CURDATE(),                              '10:00:00', '11:30:00', 'TREINO',      'PLANEADA'),
(20, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY),    '10:00:00', '11:30:00', 'TATICO',      'PLANEADA'),
(21, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY),    '10:00:00', '11:30:00', 'TREINO',      'PLANEADA'),

-- Sub-17 A — sessões passadas
(22, 3, DATE_SUB(CURDATE(), INTERVAL 2 DAY),    '10:00:00', '11:30:00', 'TREINO',      'CONCLUIDA'),
(23, 3, DATE_SUB(CURDATE(), INTERVAL 5 DAY),    '10:00:00', '11:30:00', 'FISICO',      'CONCLUIDA'),

-- Sub-19 A (equipa 4)
(24, 4, CURDATE(),                              '17:00:00', '18:30:00', 'TREINO',      'PLANEADA'),
(25, 4, DATE_ADD(CURDATE(), INTERVAL 2 DAY),    '17:00:00', '18:30:00', 'TATICO',      'PLANEADA'),
(26, 4, DATE_SUB(CURDATE(), INTERVAL 3 DAY),    '17:00:00', '18:30:00', 'TREINO',      'CONCLUIDA'),

-- Seniores A (equipa 5)
(27, 5, CURDATE(),                              '18:30:00', '20:00:00', 'TREINO',      'PLANEADA'),
(28, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY),    '18:30:00', '20:00:00', 'FISICO',      'PLANEADA'),
(29, 5, DATE_SUB(CURDATE(), INTERVAL 2 DAY),    '18:30:00', '20:00:00', 'TREINO',      'CONCLUIDA');

-- ============================================================
-- SECÇÃO 5 — EVENTOS DESPORTIVOS
-- Tipos: JOGO_OFICIAL | TREINO
-- Estados: AGENDADO | CONCLUIDO | CANCELADO
-- ============================================================

INSERT INTO evento_desportivo (id, equipa_id, tipo, data, hora_inicio, adversario, local, estado) VALUES

-- ============================================================
-- Sub-13 A (equipa 1) — equipa do treinador
-- ============================================================

-- Jogos futuros (para criar convocatórias)
(1,  1, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 3  DAY), '15:00:00', 'Vitória SC B Sub-13',    'Estádio do Bessa',        'AGENDADO'),
(2,  1, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 10 DAY), '11:00:00', 'FC Porto B Sub-13',      'Campo de Treinos',        'AGENDADO'),
(3,  1, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 17 DAY), '15:00:00', 'Sporting CP B Sub-13',   'Academia Sporting',       'AGENDADO'),
(4,  1, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 24 DAY), '14:00:00', 'Braga B Sub-13',         'Estádio Municipal Braga', 'AGENDADO'),

-- Jogo passado COM ficha (resultado já registado)
(5,  1, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 7  DAY), '15:00:00', 'Académica B Sub-13',     'Campo de Treinos',        'CONCLUIDO'),

-- Jogo passado SEM ficha (para testar submissão de ficha)
(6,  1, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 14 DAY), '11:00:00', 'Rio Ave B Sub-13',       'Estádio dos Arcos',       'CONCLUIDO'),

-- Jogo passado SEM ficha (segundo teste)
(7,  1, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 21 DAY), '15:00:00', 'Paços Ferreira B Sub-13','Estádio da Capital',      'CONCLUIDO'),

-- ============================================================
-- Sub-15 A (equipa 2)
-- ============================================================

-- Jogos futuros
(8,  2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 4  DAY), '15:00:00', 'FC Porto B Sub-15',      'Estádio do Bessa',        'AGENDADO'),
(9,  2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 9  DAY), '11:00:00', 'Sporting CP B Sub-15',   'Campo de Treinos',        'AGENDADO'),
(10, 2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 16 DAY), '16:00:00', 'Vitória SC B Sub-15',    'Estádio D. Afonso',       'AGENDADO'),
(11, 2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 23 DAY), '14:00:00', 'Benfica B Sub-15',       'Estádio da Luz',          'AGENDADO'),

-- Jogo passado COM ficha
(12, 2, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 7  DAY), '15:00:00', 'Académica B Sub-15',     'Campo de Treinos',        'CONCLUIDO'),

-- Jogo passado SEM ficha
(13, 2, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 14 DAY), '11:00:00', 'Leixões SC B Sub-15',    'Estádio do Mar',          'CONCLUIDO'),

-- ============================================================
-- Sub-17 A (equipa 3)
-- ============================================================

-- Jogos futuros
(14, 3, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 5  DAY), '14:00:00', 'Benfica B Sub-17',       'Estádio da Luz',          'AGENDADO'),
(15, 3, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 12 DAY), '11:00:00', 'Rio Ave B Sub-17',       'Estádio dos Arcos',       'AGENDADO'),
(16, 3, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 19 DAY), '15:00:00', 'Famalicão B Sub-17',     'Estádio Municipal',       'AGENDADO'),

-- Jogo passado COM ficha
(17, 3, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 5  DAY), '15:00:00', 'Paços Ferreira B Sub-17','Estádio da Capital',      'CONCLUIDO'),

-- Jogo passado SEM ficha
(18, 3, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 12 DAY), '14:00:00', 'Gil Vicente B Sub-17',   'Estádio Cidade de Barcelos','CONCLUIDO'),

-- ============================================================
-- Sub-19 A (equipa 4)
-- ============================================================

-- Jogo futuro
(19, 4, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 6  DAY), '16:00:00', 'Famalicão B Sub-19',     'Estádio Municipal',       'AGENDADO'),
(20, 4, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 13 DAY), '14:00:00', 'Moreirense B Sub-19',    'Campo do Moreirense',     'AGENDADO'),

-- Jogo passado COM ficha
(21, 4, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 8  DAY), '15:00:00', 'Esposende B Sub-19',     'Campo Municipal',         'CONCLUIDO'),

-- ============================================================
-- Seniores A (equipa 5)
-- ============================================================

-- Jogo futuro
(22, 5, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 4  DAY), '16:00:00', 'Leixões SC',             'Estádio do Mar',          'AGENDADO'),
(23, 5, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 11 DAY), '15:00:00', 'Felgueiras FC',          'Estádio Municipal',       'AGENDADO'),

-- Jogo passado COM ficha
(24, 5, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 6  DAY), '16:00:00', 'Gondomar SC',            'Estádio do Bessa',        'CONCLUIDO');

-- ============================================================
-- SECÇÃO 6 — FICHAS DE JOGO
-- Apenas para eventos CONCLUIDO marcados COM ficha
-- Eventos SEM ficha ficam propositadamente sem registo
-- para permitir testar a submissão durante a demo
-- ============================================================

INSERT INTO ficha_jogo (evento_id, golos_marcados, golos_sofridos, resultado, observacoes, estado_submissao) VALUES

-- Sub-13 A vs Académica B Sub-13 (evento 5) — VITÓRIA
(5,  3, 1, 'VITORIA',
 'Excelente prestacao colectiva. Primeiro golo aos 12 min, segundo aos 34 min e terceiro de penalti aos 67 min. Equipa demonstrou grande intensidade defensiva.',
 'SUBMETIDA'),

-- Sub-15 A vs Académica B Sub-15 (evento 12) — EMPATE
(12, 2, 2, 'EMPATE',
 'Jogo equilibrado. Boavista marcou cedo mas sofreu empate antes do intervalo. Segundo golo aos 71 min igualado nos descontos. Necessario melhorar concentracao final.',
 'SUBMETIDA'),

-- Sub-17 A vs Paços Ferreira B Sub-17 (evento 17) — DERROTA
(17, 0, 2, 'DERROTA',
 'Derrota frente a equipa fisicamente superior. Dificuldades nas transicoes defensivas. Trabalho a desenvolver nas proximas sessoes.',
 'SUBMETIDA'),

-- Sub-19 A vs Esposende B Sub-19 (evento 21) — VITÓRIA
(21, 4, 0, 'VITORIA',
 'Goleada convincente. Equipa em grande forma. Destaque para a solidez defensiva e eficacia na finalizacao.',
 'SUBMETIDA'),

-- Seniores A vs Gondomar SC (evento 24) — VITÓRIA
(24, 1, 0, 'VITORIA',
 'Vitoria sofrida mas justa. Golo solitario aos 88 min em livre direto. Boa organizacao tatica ao longo do jogo.',
 'SUBMETIDA');

-- Nota: Eventos 6, 7 (Sub-13), 13 (Sub-15), 18 (Sub-17)
-- ficam SEM ficha para testar submissao durante a demo.

-- ============================================================
-- SECÇÃO 6B — CONVOCATÓRIAS
-- ============================================================

-- Convocatória publicada: Sub-13 A vs Vitória SC B (evento 1)
INSERT INTO convocatoria (id, evento_id, hora_concentracao, local_concentracao, estado, publicada_em) VALUES
(1, 1, '14:00:00', 'Balneário Principal — Estádio do Bessa', 'PUBLICADA', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Atletas convocados Sub-13 A (APTO e CONDICIONADO, excluindo INAPTO e PENDENTE_EMD)
INSERT INTO convocatoria_atletas (convocatoria_id, atleta_id) VALUES
(1, 1),  -- Afonso Teixeira — Guarda-Redes APTO
(1, 2),  -- Bernardo Faria — Defesa APTO
(1, 3),  -- Dinis Carvalho — Defesa APTO
(1, 4),  -- Eduardo Pinto — Medio APTO
(1, 5),  -- Filipe Monteiro — Medio APTO
(1, 6),  -- Gonçalo Reis — Avancado CONDICIONADO
(1, 7),  -- Hugo Azevedo — Avancado APTO
(1, 8),  -- Ivan Soares — Defesa APTO
(1, 10), -- Kevin Dias — Avancado APTO
(1, 12); -- Martim Rocha — Defesa APTO
-- Nota: Joaquim Brito (9) PENDENTE_EMD excluído
-- Nota: Leandro Costa (11) INAPTO excluído

-- Convocatória publicada: Sub-15 A vs FC Porto B (evento 8)
INSERT INTO convocatoria (id, evento_id, hora_concentracao, local_concentracao, estado, publicada_em) VALUES
(2, 8, '14:00:00', 'Balneário Principal — Estádio do Bessa', 'PUBLICADA', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Atletas convocados Sub-15 A
INSERT INTO convocatoria_atletas (convocatoria_id, atleta_id) VALUES
(2, 13), -- Tomas Silva — CONDICIONADO
(2, 14), -- Andre Costa — APTO
(2, 16), -- Diogo Martins — APTO
(2, 17), -- Miguel Oliveira — APTO
(2, 18), -- Pedro Ferreira — APTO
(2, 19), -- Joao Pereira — APTO
(2, 20), -- Rui Gomes — APTO
(2, 21), -- Francisco Lopes — APTO
(2, 23), -- Bruno Santos — APTO
(2, 24), -- Carlos Martins — APTO
(2, 25), -- Luis Costa — APTO
(2, 26), -- Antonio Ferreira — APTO
(2, 27); -- Sergio Oliveira — APTO
-- Nota: Ricardo Ferreira (15) INAPTO excluído
-- Nota: Henrique Silva (22) PENDENTE_EMD excluído

-- Convocatória publicada: Sub-17 A vs Benfica B (evento 14)
INSERT INTO convocatoria (id, evento_id, hora_concentracao, local_concentracao, estado, publicada_em) VALUES
(3, 14, '13:00:00', 'Balneário Norte — Campo de Treinos', 'PUBLICADA', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Atletas convocados Sub-17 A
INSERT INTO convocatoria_atletas (convocatoria_id, atleta_id) VALUES
(3, 28), -- Alexandre Lima — APTO
(3, 29), -- Bruno Rocha — CONDICIONADO
(3, 30), -- Claudio Vieira — APTO
(3, 31), -- Daniel Marques — APTO
(3, 33), -- Fabio Correia — APTO
(3, 34), -- Gabriel Neves — APTO
(3, 35), -- Helio Campos — APTO
(3, 37); -- Joel Barbosa — APTO
-- Nota: Elias Ribeiro (32) INAPTO excluído
-- Nota: Igor Freitas (36) PENDENTE_EMD excluído

-- Eventos SEM convocatória (para testar criação durante demo):
-- Evento 2: Sub-13 A vs FC Porto B Sub-13 (10 dias)
-- Evento 9: Sub-15 A vs Sporting CP B Sub-15 (9 dias)
-- Evento 19: Sub-19 A vs Famalicão B Sub-19 (6 dias)
-- Evento 22: Seniores A vs Leixões SC (4 dias)

-- ============================================================
-- SECÇÃO 7 — REGISTOS DE ASSIDUIDADE
-- Apenas para sessões CONCLUIDA
-- Estados: PRESENTE | AUSENTE | ATRASADO
-- ============================================================

-- Sub-13 A — sessão de ontem (id=4)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(4, 1,  'PRESENTE'),
(4, 2,  'PRESENTE'),
(4, 3,  'PRESENTE'),
(4, 4,  'PRESENTE'),
(4, 5,  'ATRASADO'),
(4, 6,  'AUSENTE'),   -- CONDICIONADO
(4, 7,  'PRESENTE'),
(4, 8,  'PRESENTE'),
(4, 10, 'PRESENTE'),
(4, 12, 'PRESENTE');
-- Nota: 9 PENDENTE_EMD e 11 INAPTO não participam

-- Sub-13 A — sessão há 3 dias (id=5)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(5, 1,  'PRESENTE'),
(5, 2,  'AUSENTE'),
(5, 3,  'PRESENTE'),
(5, 4,  'PRESENTE'),
(5, 5,  'PRESENTE'),
(5, 6,  'AUSENTE'),
(5, 7,  'ATRASADO'),
(5, 8,  'PRESENTE'),
(5, 10, 'PRESENTE'),
(5, 12, 'PRESENTE');

-- Sub-13 A — sessão há 6 dias (id=6)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(6, 1,  'PRESENTE'),
(6, 2,  'PRESENTE'),
(6, 3,  'ATRASADO'),
(6, 4,  'PRESENTE'),
(6, 5,  'PRESENTE'),
(6, 6,  'AUSENTE'),
(6, 7,  'PRESENTE'),
(6, 8,  'AUSENTE'),
(6, 10, 'PRESENTE'),
(6, 12, 'PRESENTE');

-- Sub-13 A — sessão há 8 dias (id=7)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(7, 1,  'PRESENTE'),
(7, 2,  'PRESENTE'),
(7, 3,  'PRESENTE'),
(7, 4,  'AUSENTE'),
(7, 5,  'PRESENTE'),
(7, 6,  'AUSENTE'),
(7, 7,  'PRESENTE'),
(7, 8,  'PRESENTE'),
(7, 10, 'ATRASADO'),
(7, 12, 'PRESENTE');

-- Sub-13 A — sessão há 10 dias (id=8)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(8, 1,  'PRESENTE'),
(8, 2,  'PRESENTE'),
(8, 3,  'PRESENTE'),
(8, 4,  'PRESENTE'),
(8, 5,  'AUSENTE'),
(8, 6,  'AUSENTE'),
(8, 7,  'PRESENTE'),
(8, 8,  'PRESENTE'),
(8, 10, 'PRESENTE'),
(8, 12, 'ATRASADO');

-- Sub-15 A — sessão de ontem (id=14)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(14, 13, 'PRESENTE'),  -- CONDICIONADO
(14, 14, 'PRESENTE'),
(14, 16, 'PRESENTE'),
(14, 17, 'PRESENTE'),
(14, 18, 'PRESENTE'),
(14, 19, 'ATRASADO'),
(14, 20, 'PRESENTE'),
(14, 21, 'PRESENTE'),
(14, 23, 'AUSENTE'),
(14, 24, 'PRESENTE'),
(14, 25, 'PRESENTE'),
(14, 26, 'PRESENTE'),
(14, 27, 'PRESENTE');

-- Sub-15 A — sessão há 3 dias (id=15)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(15, 13, 'AUSENTE'),
(15, 14, 'PRESENTE'),
(15, 16, 'PRESENTE'),
(15, 17, 'ATRASADO'),
(15, 18, 'PRESENTE'),
(15, 19, 'PRESENTE'),
(15, 20, 'PRESENTE'),
(15, 21, 'AUSENTE'),
(15, 23, 'PRESENTE'),
(15, 24, 'PRESENTE'),
(15, 25, 'PRESENTE'),
(15, 26, 'ATRASADO'),
(15, 27, 'PRESENTE');

-- Sub-15 A — sessão há 5 dias (id=16)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(16, 13, 'PRESENTE'),
(16, 14, 'PRESENTE'),
(16, 16, 'AUSENTE'),
(16, 17, 'PRESENTE'),
(16, 18, 'PRESENTE'),
(16, 19, 'PRESENTE'),
(16, 20, 'ATRASADO'),
(16, 21, 'PRESENTE'),
(16, 23, 'PRESENTE'),
(16, 24, 'AUSENTE'),
(16, 25, 'PRESENTE'),
(16, 26, 'PRESENTE'),
(16, 27, 'PRESENTE');

-- Sub-15 A — sessão há 7 dias (id=17)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(17, 13, 'PRESENTE'),
(17, 14, 'PRESENTE'),
(17, 16, 'PRESENTE'),
(17, 17, 'PRESENTE'),
(17, 18, 'AUSENTE'),
(17, 19, 'PRESENTE'),
(17, 20, 'PRESENTE'),
(17, 21, 'PRESENTE'),
(17, 23, 'ATRASADO'),
(17, 24, 'PRESENTE'),
(17, 25, 'PRESENTE'),
(17, 26, 'PRESENTE'),
(17, 27, 'AUSENTE');

-- Sub-15 A — sessão há 9 dias (id=18)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(18, 13, 'PRESENTE'),
(18, 14, 'ATRASADO'),
(18, 16, 'PRESENTE'),
(18, 17, 'PRESENTE'),
(18, 18, 'PRESENTE'),
(18, 19, 'AUSENTE'),
(18, 20, 'PRESENTE'),
(18, 21, 'PRESENTE'),
(18, 23, 'PRESENTE'),
(18, 24, 'PRESENTE'),
(18, 25, 'ATRASADO'),
(18, 26, 'PRESENTE'),
(18, 27, 'PRESENTE');

-- Sub-17 A — sessão há 2 dias (id=22)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(22, 28, 'PRESENTE'),
(22, 29, 'AUSENTE'),   -- CONDICIONADO
(22, 30, 'PRESENTE'),
(22, 31, 'PRESENTE'),
(22, 33, 'ATRASADO'),
(22, 34, 'PRESENTE'),
(22, 35, 'PRESENTE'),
(22, 37, 'PRESENTE');

-- Sub-17 A — sessão há 5 dias (id=23)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(23, 28, 'PRESENTE'),
(23, 29, 'AUSENTE'),
(23, 30, 'ATRASADO'),
(23, 31, 'PRESENTE'),
(23, 33, 'PRESENTE'),
(23, 34, 'PRESENTE'),
(23, 35, 'AUSENTE'),
(23, 37, 'PRESENTE');

-- Sub-19 A — sessão há 3 dias (id=26)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(26, 38, 'PRESENTE'),
(26, 39, 'PRESENTE'),
(26, 40, 'AUSENTE'),   -- CONDICIONADO
(26, 41, 'PRESENTE'),
(26, 42, 'ATRASADO'),
(26, 43, 'PRESENTE'),
(26, 45, 'PRESENTE');

-- Seniores A — sessão há 2 dias (id=29)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado) VALUES
(29, 46, 'PRESENTE'),
(29, 47, 'PRESENTE'),
(29, 48, 'ATRASADO'),
(29, 49, 'AUSENTE'),   -- CONDICIONADO
(29, 50, 'PRESENTE');

-- ============================================================
-- SECÇÃO 7B — AVALIAÇÕES DE RENDIMENTO
-- Apenas para atletas PRESENTE ou ATRASADO
-- Notas de 1.0 a 5.0 com 1 casa decimal
-- ============================================================

-- Sub-13 A — sessão de ontem (id=4)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(4, 1,  4.5),
(4, 2,  3.5),
(4, 3,  4.0),
(4, 4,  3.0),
(4, 5,  3.5),  -- ATRASADO mas avaliado
(4, 7,  4.5),
(4, 8,  3.0),
(4, 10, 4.0),
(4, 12, 3.5);

-- Sub-13 A — sessão há 3 dias (id=5)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(5, 1,  4.0),
(5, 3,  3.5),
(5, 4,  4.5),
(5, 5,  4.0),
(5, 7,  3.0),
(5, 8,  4.0),
(5, 10, 3.5),
(5, 12, 4.5);

-- Sub-13 A — sessão há 6 dias (id=6)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(6, 1,  5.0),
(6, 2,  4.0),
(6, 3,  3.5),
(6, 4,  4.0),
(6, 5,  4.5),
(6, 7,  4.0),
(6, 10, 3.0),
(6, 12, 4.0);

-- Sub-13 A — sessão há 8 dias (id=7)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(7, 1,  3.5),
(7, 2,  4.0),
(7, 3,  4.5),
(7, 5,  3.5),
(7, 7,  4.0),
(7, 8,  3.5),
(7, 10, 3.0),
(7, 12, 4.0);

-- Sub-13 A — sessão há 10 dias (id=8)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(8, 1,  4.0),
(8, 2,  4.5),
(8, 3,  4.0),
(8, 4,  3.5),
(8, 7,  4.0),
(8, 8,  4.5),
(8, 10, 4.0),
(8, 12, 3.5);

-- Sub-15 A — sessão de ontem (id=14)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(14, 13, 3.5),
(14, 14, 4.5),
(14, 16, 4.0),
(14, 17, 3.5),
(14, 18, 4.0),
(14, 19, 3.0),
(14, 20, 4.5),
(14, 21, 4.0),
(14, 24, 3.5),
(14, 25, 4.0),
(14, 26, 4.5),
(14, 27, 3.5);

-- Sub-15 A — sessão há 3 dias (id=15)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(15, 14, 4.0),
(15, 16, 4.5),
(15, 17, 3.5),
(15, 18, 4.0),
(15, 19, 4.5),
(15, 20, 3.5),
(15, 23, 4.0),
(15, 24, 4.5),
(15, 25, 3.5),
(15, 26, 3.0),
(15, 27, 4.0);

-- Sub-15 A — sessão há 5 dias (id=16)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(16, 13, 4.0),
(16, 14, 3.5),
(16, 17, 4.5),
(16, 18, 4.0),
(16, 19, 3.5),
(16, 20, 3.0),
(16, 21, 4.0),
(16, 23, 4.5),
(16, 25, 3.5),
(16, 26, 4.0),
(16, 27, 4.5);

-- Sub-15 A — sessão há 7 dias (id=17)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(17, 13, 3.0),
(17, 14, 4.0),
(17, 16, 4.5),
(17, 17, 4.0),
(17, 19, 3.5),
(17, 20, 4.0),
(17, 21, 4.5),
(17, 23, 3.5),
(17, 24, 4.0),
(17, 25, 4.5),
(17, 26, 3.5),
(17, 27, 3.0);

-- Sub-15 A — sessão há 9 dias (id=18)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(18, 13, 4.5),
(18, 14, 3.5),
(18, 16, 4.0),
(18, 17, 4.5),
(18, 18, 4.0),
(18, 20, 3.5),
(18, 21, 4.0),
(18, 23, 4.5),
(18, 24, 3.5),
(18, 25, 3.0),
(18, 26, 4.0),
(18, 27, 4.5);

-- Sub-17 A — sessão há 2 dias (id=22)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(22, 28, 4.5),
(22, 30, 4.0),
(22, 31, 3.5),
(22, 33, 3.0),
(22, 34, 4.5),
(22, 35, 4.0),
(22, 37, 3.5);

-- Sub-17 A — sessão há 5 dias (id=23)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(23, 28, 4.0),
(23, 30, 3.5),
(23, 31, 4.5),
(23, 33, 4.0),
(23, 34, 3.5),
(23, 37, 4.0);

-- Sub-19 A — sessão há 3 dias (id=26)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(26, 38, 4.0),
(26, 39, 4.5),
(26, 41, 3.5),
(26, 42, 3.0),
(26, 43, 4.5),
(26, 45, 4.0);

-- Seniores A — sessão há 2 dias (id=29)
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota) VALUES
(29, 46, 4.0),
(29, 47, 4.5),
(29, 48, 3.5),
(29, 50, 4.0);

-- ============================================================
-- SECÇÃO 8 — OCORRÊNCIAS CLÍNICAS
-- Tipos: LESAO | DOENCA | TRAUMA
-- Graus: AMARELO (CONDICIONADO) | VERMELHO (INAPTO)
-- Estados: ATIVA | RESOLVIDA
-- ============================================================

INSERT INTO ocorrencia (id, atleta_id, data_ocorrencia, tipo, diagnostico, grau_restricao, data_reavaliacao, estado_emd, estado, medico_id) VALUES

-- Sub-13 A
-- Gonçalo Reis (id=6) — CONDICIONADO ATIVA
(1,  6,  '2026-05-18', 'LESAO',
 'Distensao muscular na coxa direita. Restricao parcial por 2 semanas. Fisioterapia recomendada.',
 'AMARELO', '2026-06-01', 'EM_AVALIACAO', 'ATIVA', 4),

-- Leandro Costa (id=11) — INAPTO ATIVA
(2,  11, '2026-05-20', 'TRAUMA',
 'Contusao grave no joelho esquerdo apos colisao em treino. Possivel lesao nos ligamentos. Aguarda exames.',
 'VERMELHO', '2026-06-20', 'EM_AVALIACAO', 'ATIVA', 4),

-- Sub-15 A
-- Tomas Silva (id=13) — CONDICIONADO ATIVA
(3,  13, '2026-05-10', 'LESAO',
 'Entorse do tornozelo direito grau II. Recomendado repouso e fisioterapia durante 3 semanas.',
 'AMARELO', '2026-06-10', 'EM_AVALIACAO', 'ATIVA', 4),

-- Ricardo Ferreira (id=15) — INAPTO ATIVA
(4,  15, '2026-05-15', 'TRAUMA',
 'Contusao grave no joelho esquerdo apos colisao em jogo. Cirurgia descartada. Gesso por 4 semanas.',
 'VERMELHO', '2026-07-01', 'EM_AVALIACAO', 'ATIVA', 4),

-- Beatriz Santos (id=12) — RESOLVIDA (historico clínico)
(5,  12, '2026-04-01', 'DOENCA',
 'Gripe sazonal com recuperacao completa. Afastamento de 5 dias.',
 'AMARELO', '2026-04-10', 'DELIBERADO', 'RESOLVIDA', 4),

-- Sub-17 A
-- Bruno Rocha (id=29) — CONDICIONADO ATIVA
(6,  29, '2026-05-20', 'DOENCA',
 'Sindrome gripal com febre alta. Afastamento temporario de 7 dias recomendado.',
 'AMARELO', '2026-05-27', 'DELIBERADO', 'ATIVA', 4),

-- Elias Ribeiro (id=32) — INAPTO ATIVA
(7,  32, '2026-05-12', 'TRAUMA',
 'Fratura parcial no metacarpo da mao direita. Cirurgia descartada. Gesso por 4 semanas.',
 'VERMELHO', '2026-06-12', 'EM_AVALIACAO', 'ATIVA', 4),

-- Igor Freitas (id=36) — PENDENTE_EMD sem ocorrência ativa
-- (sem ocorrência — estado definido apenas pelo campo estado_elegibilidade)

-- Sub-19 A
-- Nuno Macedo (id=40) — CONDICIONADO ATIVA
(8,  40, '2026-05-22', 'LESAO',
 'Tendinite no joelho direito. Fisioterapia 3 vezes por semana. Restricao de carga.',
 'AMARELO', '2026-06-05', 'EM_AVALIACAO', 'ATIVA', 4),

-- Rafael Esteves (id=44) — INAPTO ATIVA
(9,  44, '2026-05-08', 'TRAUMA',
 'Rotura parcial dos ligamentos do tornozelo esquerdo. Cirurgia marcada. Afastamento prolongado.',
 'VERMELHO', '2026-07-15', 'EM_AVALIACAO', 'ATIVA', 4),

-- Seniores A
-- Xavier Magalhaes (id=49) — CONDICIONADO ATIVA
(10, 49, '2026-05-19', 'LESAO',
 'Contractura muscular nas costas. Repouso recomendado por 10 dias. Sem fisioterapia necessaria.',
 'AMARELO', '2026-05-29', 'EM_AVALIACAO', 'ATIVA', 4),

-- Ocorrência RESOLVIDA adicional (Sub-19) para historico rico
(11, 41, '2026-03-15', 'DOENCA',
 'Faringite bacteriana com antibioterapia. Recuperacao total em 7 dias.',
 'AMARELO', '2026-03-22', 'DELIBERADO', 'RESOLVIDA', 4);

-- ============================================================
-- SECÇÃO 8B — EVOLUÇÕES DE OCORRÊNCIAS
-- Registam agravamento ou melhoria ao longo do tempo
-- ============================================================

INSERT INTO ocorrencia_evolucao (ocorrencia_id, grau_restricao, descricao, registado_em, medico_id) VALUES

-- Ocorrência 3 (Tomas Silva) — evolução de AMARELO para VERMELHO e de volta
(3, 'VERMELHO',
 'Agravamento apos treino de segunda-feira. Dor intensa ao apoio. Recomendado repouso total.',
 DATE_SUB(NOW(), INTERVAL 5 DAY), 4),

(3, 'AMARELO',
 'Melhoria significativa. Atleta retoma fisioterapia. Restricao parcial mantida.',
 DATE_SUB(NOW(), INTERVAL 2 DAY), 4),

-- Ocorrência 4 (Ricardo Ferreira) — agravamento
(4, 'VERMELHO',
 'Exames confirmam lesao nos ligamentos cruzados. Cirurgia marcada para proximo mes.',
 DATE_SUB(NOW(), INTERVAL 3 DAY), 4),

-- Ocorrência 7 (Elias Ribeiro) — melhoria
(7, 'AMARELO',
 'Gesso removido. Inicio de fisioterapia de recuperacao. Restricao parcial por mais 2 semanas.',
 DATE_SUB(NOW(), INTERVAL 1 DAY), 4),

-- Ocorrência 9 (Rafael Esteves) — evolucao pos-cirurgia
(9, 'VERMELHO',
 'Pos-cirurgia. Atleta em recuperacao. Sem previsao de retorno ao treino.',
 DATE_SUB(NOW(), INTERVAL 7 DAY), 4),

-- Ocorrência 1 (Gonçalo Reis) — melhoria ligeira
(1, 'AMARELO',
 'Melhoria registada. Fisioterapia a decorrer. Atleta pode participar em treinos leves.',
 DATE_SUB(NOW(), INTERVAL 1 DAY), 4);

 -- ============================================================
-- SECÇÃO 9 — OBRIGAÇÕES FINANCEIRAS
-- Tipos: QUOTA_ANUAL | MENSALIDADE | INSCRICAO
-- Estados: PAGO | PENDENTE | EM_ATRASO
-- Entidades: CLUBE | SAD
-- ============================================================

-- ============================================================
-- EE 1 — João Silva (atletas 13=Tomas, 14=Andre)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
-- Tomas Silva — quota anual paga
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 1, 13, '2025-10-05'),
-- Tomas Silva — mensalidades
(35.00,  '2026-01-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 1, 13, '2026-01-03'),
(35.00,  '2026-02-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 1, 13, '2026-02-02'),
(35.00,  '2026-03-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 1, 13, '2026-03-04'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 1, 13, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 1, 13, NULL),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 1, 13, NULL),
-- Andre Costa — quota anual paga
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 1, 14, '2025-10-05'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 1, 14, '2026-04-03'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 1, 14, NULL);

-- ============================================================
-- EE 2 — Maria Santos (atletas 15=Ricardo, 16=Diogo)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 2, 15, '2025-10-10'),
(35.00,  '2026-01-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 2, 15, '2026-01-08'),
(35.00,  '2026-02-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 2, 15, '2026-02-06'),
(35.00,  '2026-03-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 2, 15, NULL),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 2, 15, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 2, 15, NULL),
-- Diogo Martins
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 2, 16, '2025-10-10'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 2, 16, '2026-05-03'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 2, 16, NULL);

-- ============================================================
-- EE 3 — Carlos Ferreira (atleta 17=Miguel)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 3, 17, '2025-10-08'),
(35.00,  '2026-01-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 3, 17, '2026-01-05'),
(35.00,  '2026-02-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 3, 17, '2026-02-04'),
(35.00,  '2026-03-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 3, 17, '2026-03-03'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 3, 17, '2026-04-02'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 3, 17, '2026-05-01'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 3, 17, NULL);

-- ============================================================
-- EE 4 — Ana Costa (atleta 18=Pedro)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 4, 18, '2025-10-12'),
(35.00,  '2026-03-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 4, 18, '2026-03-05'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 4, 18, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 4, 18, NULL);

-- ============================================================
-- EE 5 — Rui Oliveira (atleta 19=Joao)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 5, 19, '2025-10-15'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 5, 19, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 5, 19, NULL),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 5, 19, NULL);

-- ============================================================
-- EE 6 — Sofia Pereira (atleta 20=Rui, 6=Gonçalo Sub-13)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 6, 20, '2025-10-20'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 6, 20, '2026-05-02'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 6, 20, NULL),
(100.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 6, 6,  '2025-10-20'),
(30.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 6, 6,  '2026-05-02');

-- ============================================================
-- EE 7 — Miguel Gomes (atleta 21=Francisco)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 7, 21, '2025-10-18'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 7, 21, NULL),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 7, 21, NULL);

-- ============================================================
-- EE 8 — Cristina Lopes (atleta 22=Henrique)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 8, 22, '2025-10-22'),
(35.00,  '2026-03-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 8, 22, NULL),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 8, 22, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 8, 22, NULL);

-- ============================================================
-- EE 9 — António Martins (atleta 23=Bruno)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 9, 23, '2025-10-25'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 9, 23, '2026-04-04'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 9, 23, '2026-05-08'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 9, 23, NULL);

-- ============================================================
-- EE 10 — Helena Rodrigues (atleta 24=Carlos)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 10, 24, '2025-10-28'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 10, 24, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 10, 24, NULL);

-- ============================================================
-- EE 11 — Paulo Carvalho (atleta 25=Luis, 38=Leandro Sub-19)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 11, 25, '2025-10-30'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 11, 25, '2026-05-05'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 11, 25, NULL),
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 11, 38, '2025-10-30'),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 11, 38, '2026-05-05');

-- ============================================================
-- EE 12 — Teresa Alves (atleta 26=Antonio, 39=Marco Sub-19)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 12, 26, '2025-10-15'),
(35.00,  '2026-04-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 12, 26, '2026-04-10'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 12, 26, NULL),
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 12, 39, '2025-10-15'),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 12, 39, NULL);

-- ============================================================
-- EE 13 — Fernando Cunha (atleta 27=Sergio, 40=Nuno Sub-19)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 13, 27, '2025-10-18'),
(35.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 13, 27, '2026-05-03'),
(35.00,  '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 13, 27, NULL),
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 13, 40, '2025-10-18'),
(42.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 13, 40, NULL),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 13, 40, NULL);

-- ============================================================
-- EE 14 — Margarida Sousa (atleta 41=Oscar, 42=Pedro Sub-19)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 14, 41, '2025-10-22'),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 14, 41, '2026-05-06'),
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 14, 42, '2025-10-22'),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 14, 42, NULL);

-- ============================================================
-- EE 15 — Ricardo Nunes (atleta 43=Quim, 44=Rafael Sub-19)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 15, 43, '2025-10-25'),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PAGO',      'CLUBE', 15, 43, '2026-05-08'),
(160.00, '2025-10-01', 'QUOTA_ANUAL', 'PAGO',      'CLUBE', 15, 44, '2025-10-25'),
(42.00,  '2026-03-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 15, 44, NULL),
(42.00,  '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'CLUBE', 15, 44, NULL),
(42.00,  '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'CLUBE', 15, 44, NULL);

-- ============================================================
-- Obrigações SAD (para testar segregação CFO)
-- ============================================================
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(28.00, '2026-01-01', 'MENSALIDADE', 'PAGO',      'SAD', 1, 13, '2026-01-05'),
(28.00, '2026-02-01', 'MENSALIDADE', 'PAGO',      'SAD', 1, 13, '2026-02-03'),
(28.00, '2026-03-01', 'MENSALIDADE', 'PAGO',      'SAD', 1, 13, '2026-03-04'),
(28.00, '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'SAD', 1, 13, NULL),
(28.00, '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'SAD', 1, 13, NULL),
(28.00, '2026-01-01', 'MENSALIDADE', 'PAGO',      'SAD', 2, 16, '2026-01-08'),
(28.00, '2026-02-01', 'MENSALIDADE', 'PAGO',      'SAD', 2, 16, '2026-02-06'),
(28.00, '2026-03-01', 'MENSALIDADE', 'PAGO',      'SAD', 2, 16, '2026-03-05'),
(28.00, '2026-04-01', 'MENSALIDADE', 'PAGO',      'SAD', 2, 16, '2026-04-04'),
(28.00, '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'SAD', 2, 16, NULL),
(28.00, '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'SAD', 3, 17, NULL),
(28.00, '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'SAD', 3, 17, NULL),
(28.00, '2026-05-01', 'MENSALIDADE', 'PAGO',      'SAD', 4, 18, '2026-05-02'),
(28.00, '2026-06-01', 'MENSALIDADE', 'PENDENTE',  'SAD', 4, 18, NULL),
(28.00, '2026-04-01', 'MENSALIDADE', 'EM_ATRASO', 'SAD', 5, 19, NULL),
(28.00, '2026-05-01', 'MENSALIDADE', 'PENDENTE',  'SAD', 5, 19, NULL);

-- ============================================================
-- SECÇÃO 10 — AUDIT LOG (demo rico e variado)
-- ============================================================
INSERT INTO audit_log (ator, acao, entidade, entidade_id, detalhes, timestamp, ip_address) VALUES
-- Logins do sistema
('admin',      'LOGIN',   'Utilizador', 1,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 3  DAY),    '127.0.0.1'),
('secretaria', 'LOGIN',   'Utilizador', 3,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.10'),
('medico',     'LOGIN',   'Utilizador', 4,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.15'),
('treinador',  'LOGIN',   'Utilizador', 5,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.20'),
('ceo',        'LOGIN',   'Utilizador', 2,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.30'),
('cfo',        'LOGIN',   'Utilizador', 6,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.31'),
('diretor',    'LOGIN',   'Utilizador', 7,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.32'),
-- Criação de atletas pela secretaria
('secretaria', 'CRIAR',   'Atleta',     13, 'Atleta Tomás Silva registado na Sub-15 A',              DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.10'),
('secretaria', 'CRIAR',   'Atleta',     15, 'Atleta Ricardo Ferreira registado na Sub-15 A',         DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.10'),
('secretaria', 'CRIAR',   'Atleta',     6,  'Atleta Gonçalo Reis registado na Sub-13 A',             DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.10'),
('secretaria', 'CRIAR',   'Atleta',     32, 'Atleta Elias Ribeiro registado na Sub-17 A',            DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.10'),
-- Criação de encarregados
('secretaria', 'CRIAR',   'Encarregado', 1, 'Encarregado João Silva registado',                      DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.10'),
('secretaria', 'CRIAR',   'Encarregado', 2, 'Encarregado Maria Santos registado',                    DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.10'),
-- Validações documentais
('secretaria', 'EDITAR',  'Atleta',     1,  'Documentos validados para Afonso Teixeira',             DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.10'),
('secretaria', 'EDITAR',  'Atleta',     14, 'Documentos validados para André Costa',                 DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.10'),
-- Ocorrências clínicas
('medico',     'CRIAR',   'Ocorrencia', 1,  'Ocorrência de lesão registada para Gonçalo Reis',       DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.15'),
('medico',     'CRIAR',   'Ocorrencia', 2,  'Trauma registado para Leandro Costa',                   DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.15'),
('medico',     'CRIAR',   'Ocorrencia', 3,  'Lesão registada para Tomás Silva',                      DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.15'),
('medico',     'CRIAR',   'Ocorrencia', 4,  'Trauma grave registado para Ricardo Ferreira',          DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.15'),
('medico',     'CRIAR',   'Ocorrencia', 7,  'Fratura registada para Elias Ribeiro',                  DATE_SUB(NOW(), INTERVAL 1  DAY),    '192.168.1.15'),
-- Evoluções clínicas
('medico',     'EDITAR',  'Ocorrencia', 3,  'Evolução registada: AMARELO -> VERMELHO para Tomás',    DATE_SUB(NOW(), INTERVAL 5  DAY),    '192.168.1.15'),
('medico',     'EDITAR',  'Ocorrencia', 3,  'Evolução registada: VERMELHO -> AMARELO para Tomás',    DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.15'),
('medico',     'EDITAR',  'Ocorrencia', 4,  'Agravamento registado para Ricardo Ferreira',           DATE_SUB(NOW(), INTERVAL 3  DAY),    '192.168.1.15'),
('medico',     'EDITAR',  'Ocorrencia', 7,  'Melhoria registada para Elias Ribeiro',                 DATE_SUB(NOW(), INTERVAL 1  DAY),    '192.168.1.15'),
-- Deliberações EMD
('medico',     'EDITAR',  'EMD',        5,  'EMD aprovado para Beatriz Santos. Válido até 2027-06-30', DATE_SUB(NOW(), INTERVAL 1 DAY),   '192.168.1.15'),
('medico',     'EDITAR',  'EMD',        28, 'EMD aprovado para Alexandre Lima. Válido até 2027-06-30', DATE_SUB(NOW(), INTERVAL 1 DAY),   '192.168.1.15'),
-- Altas médicas
('medico',     'EDITAR',  'Ocorrencia', 5,  'Alta médica emitida para Beatriz Santos. Atleta apto.', DATE_SUB(NOW(), INTERVAL 20 DAY),   '192.168.1.15'),
('medico',     'EDITAR',  'Ocorrencia', 11, 'Alta médica emitida para Óscar Tavares.',               DATE_SUB(NOW(), INTERVAL 10 DAY),   '192.168.1.15'),
-- Convocatórias
('treinador',  'CRIAR',   'Convocatoria', 1, 'Convocatória publicada: Sub-13 A vs Vitória SC B',     DATE_SUB(NOW(), INTERVAL 2  DAY),    '192.168.1.20'),
('treinador',  'CRIAR',   'Convocatoria', 2, 'Convocatória publicada: Sub-15 A vs FC Porto B',       DATE_SUB(NOW(), INTERVAL 1  DAY),    '192.168.1.20'),
('treinador',  'CRIAR',   'Convocatoria', 3, 'Convocatória publicada: Sub-17 A vs Benfica B',        DATE_SUB(NOW(), INTERVAL 1  DAY),    '192.168.1.20'),
-- Fichas de jogo
('treinador',  'CRIAR',   'FichaJogo',  1,  'Ficha de jogo submetida: Sub-13 A 3-1 Académica B',    DATE_SUB(NOW(), INTERVAL 7  DAY),    '192.168.1.20'),
('treinador',  'CRIAR',   'FichaJogo',  2,  'Ficha de jogo submetida: Sub-15 A 2-2 Académica B',    DATE_SUB(NOW(), INTERVAL 7  DAY),    '192.168.1.20'),
('treinador',  'CRIAR',   'FichaJogo',  3,  'Ficha de jogo submetida: Sub-17 A 0-2 Paços Ferreira', DATE_SUB(NOW(), INTERVAL 5  DAY),    '192.168.1.20'),
-- Pagamentos e obrigações
('secretaria', 'CRIAR',   'ObrigacaoFinanceira', 1, 'Pagamento quota anual registado para João Silva',    DATE_SUB(NOW(), INTERVAL 2 DAY), '192.168.1.10'),
('secretaria', 'EDITAR',  'ObrigacaoFinanceira', 4, 'Pagamento de mensalidade confirmado via MBWay',       DATE_SUB(NOW(), INTERVAL 1 DAY), '192.168.1.10'),
('secretaria', 'EDITAR',  'ObrigacaoFinanceira', 8, 'Pagamento de quota anual confirmado via Multibanco',  DATE_SUB(NOW(), INTERVAL 1 DAY), '192.168.1.10'),
-- Gestão de utilizadores pelo admin
('admin',      'CRIAR',   'Utilizador', 8,  'Novo utilizador ee_joao criado com role ROLE_EE',       DATE_SUB(NOW(), INTERVAL 3  DAY),    '127.0.0.1'),
('admin',      'EDITAR',  'Utilizador', 5,  'Utilizador treinador reativado',                        DATE_SUB(NOW(), INTERVAL 1  DAY),    '127.0.0.1'),
('admin',      'LOGIN',   'Utilizador', 1,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 1  HOUR),   '127.0.0.1'),
('secretaria', 'LOGIN',   'Utilizador', 3,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 30 MINUTE), '192.168.1.10'),
('medico',     'LOGIN',   'Utilizador', 4,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 20 MINUTE), '192.168.1.15'),
('treinador',  'LOGIN',   'Utilizador', 5,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 15 MINUTE), '192.168.1.20'),
('ceo',        'LOGIN',   'Utilizador', 2,  'Login efetuado com sucesso',                            DATE_SUB(NOW(), INTERVAL 10 MINUTE), '192.168.1.30');

-- ============================================================
-- SECÇÃO 11 — VERIFICAÇÃO FINAL
-- ============================================================
SELECT '========================================' AS '';
SELECT 'SEED MASTER DEMO v3.0 — CONCLUÍDO'       AS '';
SELECT '========================================'  AS '';
SELECT
    CONCAT('Modalidades:   ', (SELECT COUNT(*) FROM modalidade))            AS contagem UNION ALL SELECT
    CONCAT('Escalões:      ', (SELECT COUNT(*) FROM escalao))               UNION ALL SELECT
    CONCAT('Equipas:       ', (SELECT COUNT(*) FROM equipa))                UNION ALL SELECT
    CONCAT('Épocas:        ', (SELECT COUNT(*) FROM epoca_desportiva))      UNION ALL SELECT
    CONCAT('Encarregados:  ', (SELECT COUNT(*) FROM encarregado_educacao))  UNION ALL SELECT
    CONCAT('Utilizadores:  ', (SELECT COUNT(*) FROM utilizador))            UNION ALL SELECT
    CONCAT('Atletas:       ', (SELECT COUNT(*) FROM atleta))                UNION ALL SELECT
    CONCAT('Sessões:       ', (SELECT COUNT(*) FROM sessao_treino))         UNION ALL SELECT
    CONCAT('Assiduidades:  ', (SELECT COUNT(*) FROM registo_assiduidade))   UNION ALL SELECT
    CONCAT('Avaliações:    ', (SELECT COUNT(*) FROM avaliacao_rendimento))  UNION ALL SELECT
    CONCAT('Eventos:       ', (SELECT COUNT(*) FROM evento_desportivo))     UNION ALL SELECT
    CONCAT('Fichas jogo:   ', (SELECT COUNT(*) FROM ficha_jogo))            UNION ALL SELECT
    CONCAT('Convocatórias: ', (SELECT COUNT(*) FROM convocatoria))          UNION ALL SELECT
    CONCAT('Convocados:    ', (SELECT COUNT(*) FROM convocatoria_atletas))  UNION ALL SELECT
    CONCAT('Ocorrências:   ', (SELECT COUNT(*) FROM ocorrencia))            UNION ALL SELECT
    CONCAT('Evoluções:     ', (SELECT COUNT(*) FROM ocorrencia_evolucao))   UNION ALL SELECT
    CONCAT('Obrigações:    ', (SELECT COUNT(*) FROM obrigacao_financeira))  UNION ALL SELECT
    CONCAT('Audit logs:    ', (SELECT COUNT(*) FROM audit_log));
SELECT '========================================' AS '';
SELECT 'Password de todos: Sigd@2025'             AS '';
SELECT 'Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu' AS '';
SELECT '========================================' AS '';

