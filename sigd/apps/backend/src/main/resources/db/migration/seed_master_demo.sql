-- ============================================================
-- SEED MASTER DEMO — SIGD Boavista FC
-- Versão: 2.0 | Data: 26/05/2026
-- Corre em qualquer PC: docker exec -i sigd-mysql mysql -u sigd_user -psigd_password_dev sigd_dev < seed_master_demo.sql
-- Password de todos os utilizadores: Sigd@2025
-- Hash BCrypt de "Sigd@2025": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- LIMPAR DADOS EXISTENTES (preserva estrutura)
-- ============================================================
TRUNCATE TABLE ocorrencia_evolucao;
TRUNCATE TABLE registo_assiduidade;
TRUNCATE TABLE avaliacao_rendimento;
TRUNCATE TABLE convocatoria_atletas;
TRUNCATE TABLE convocatoria;
TRUNCATE TABLE ficha_jogo;
TRUNCATE TABLE obrigacao_financeira;
TRUNCATE TABLE ocorrencia;
TRUNCATE TABLE evento_desportivo;
TRUNCATE TABLE sessao_treino;
TRUNCATE TABLE atleta;
TRUNCATE TABLE encarregado_educacao;
TRUNCATE TABLE equipa;
TRUNCATE TABLE escalao;
TRUNCATE TABLE modalidade;
TRUNCATE TABLE epoca_desportiva;
TRUNCATE TABLE audit_log;
DELETE FROM utilizador WHERE role NOT IN ('ROLE_ADMIN','ROLE_CEO','ROLE_SECRETARIA','ROLE_MEDICO','ROLE_TREINADOR','ROLE_CFO','ROLE_DIRETOR_TECNICO');
DELETE FROM utilizador WHERE username NOT IN ('admin','ceo','secretaria','medico','treinador','cfo','diretor');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- MODALIDADES
-- ============================================================
INSERT INTO modalidade (id, nome) VALUES
(1, 'Futebol'),
(2, 'Futsal');

-- ============================================================
-- ESCALÕES
-- ============================================================
INSERT INTO escalao (id, designacao, limite_idade_min, limite_idade_max, quota_anual, mensalidade_base, mensalidade_socio, teto_convocatoria, modalidade_id) VALUES
(1, 'Sub-13', 9,  13, 100.00, 30.00, 24.00, 16, 1),
(2, 'Sub-15', 11, 15, 120.00, 35.00, 28.00, 18, 1),
(3, 'Sub-17', 13, 17, 140.00, 38.00, 30.00, 20, 1),
(4, 'Sub-19', 15, 19, 160.00, 42.00, 33.00, 22, 1),
(5, 'Seniores', 18, 99, 200.00, 50.00, 40.00, 25, 1),
(6, 'Sub-15 Futsal', 11, 15, 100.00, 30.00, 24.00, 14, 2);

-- ============================================================
-- EQUIPAS
-- ============================================================
INSERT INTO equipa (id, nome, escalao_id, modalidade_id, ativa) VALUES
(1, 'Sub-13 A',      1, 1, 1),
(2, 'Sub-15 A',      2, 1, 1),
(3, 'Sub-17 A',      3, 1, 1),
(4, 'Sub-19 A',      4, 1, 1),
(5, 'Seniores A',    5, 1, 1),
(6, 'Sub-15 Futsal', 6, 2, 1);

-- ============================================================
-- ÉPOCA DESPORTIVA
-- ============================================================
INSERT INTO epoca_desportiva (id, nome, data_inicio, data_fim, estado) VALUES
(1, '2024/2025', '2024-09-01', '2025-06-30', 'ENCERRADA'),
(2, '2025/2026', '2025-09-01', '2026-06-30', 'ATIVA');

-- ============================================================
-- ENCARREGADOS DE EDUCAÇÃO (15)
-- ============================================================
INSERT INTO encarregado_educacao (id, nome, nif, email, telemovel, morada) VALUES
(1,  'João Silva',         '123456789', 'ee@sigd.pt',              '912345678', 'Rua das Flores 10, Porto'),
(2,  'Maria Santos',       '987654321', 'maria.santos@email.com',  '923456789', 'Av. da Liberdade 50, Lisboa'),
(3,  'Carlos Ferreira',    '456789123', 'carlos.ferreira@email.com','934567890', 'Rua do Boavista 5, Porto'),
(4,  'Ana Costa',          '321654987', 'ana.costa@email.com',     '945678901', 'Rua de Santa Catarina 20, Porto'),
(5,  'Rui Oliveira',       '654321098', 'rui.oliveira@email.com',  '956789012', 'Av. dos Aliados 100, Porto'),
(6,  'Sofia Pereira',      '789012345', 'sofia.pereira@email.com', '967890123', 'Rua do Almada 30, Porto'),
(7,  'Miguel Gomes',       '234567890', 'miguel.gomes@email.com',  '978901234', 'Rua de Cedofeita 15, Porto'),
(8,  'Cristina Lopes',     '890123456', 'cristina.lopes@email.com','989012345', 'Rua do Campo Alegre 8, Porto'),
(9,  'António Martins',    '345678901', 'antonio.martins@email.com','990123456', 'Av. Marechal Gomes 22, Porto'),
(10, 'Helena Rodrigues',   '901234567', 'helena.rodrigues@email.com','901234567','Rua de São Bento 40, Porto'),
(11, 'Paulo Carvalho',     '456789012', 'paulo.carvalho@email.com', '912340000', 'Rua das Antas 12, Porto'),
(12, 'Teresa Alves',       '567890123', 'teresa.alves@email.com',  '923451111', 'Rua do Heroísmo 7, Porto'),
(13, 'Fernando Cunha',     '678901234', 'fernando.cunha@email.com','934562222', 'Rua do Bonfim 33, Porto'),
(14, 'Margarida Sousa',    '789012346', 'margarida.sousa@email.com','945673333','Rua de Vilar 18, Porto'),
(15, 'Ricardo Nunes',      '890123457', 'ricardo.nunes@email.com', '956784444', 'Rua de Fernandes Tomás 9, Porto');

-- ============================================================
-- UTILIZADORES — Roles de sistema
-- ============================================================
INSERT IGNORE INTO utilizador (id, username, email, password_hash, role, ativo) VALUES
(1, 'admin',      'admin@sigd.local',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_ADMIN',           1),
(2, 'ceo',        'ceo@boavista.pt',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_CEO',             1),
(3, 'secretaria', 'secretaria@boavista.pt',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_SECRETARIA',      1),
(4, 'medico',     'medico@boavista.pt',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_MEDICO',          1),
(5, 'treinador',  'treinador@boavista.pt',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_TREINADOR',       1),
(6, 'cfo',        'cfo@boavista.pt',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_CFO',             1),
(7, 'diretor',    'diretor@boavista.pt',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_DIRETOR_TECNICO', 1);

-- Utilizadores EE (um por encarregado — email tem de corresponder)
INSERT INTO utilizador (username, email, password_hash, role, ativo) VALUES
('ee_joao',      'ee@sigd.pt',               '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_maria',     'maria.santos@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_carlos',    'carlos.ferreira@email.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_ana',       'ana.costa@email.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_rui',       'rui.oliveira@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_sofia',     'sofia.pereira@email.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_miguel',    'miguel.gomes@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_cristina',  'cristina.lopes@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_antonio',   'antonio.martins@email.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_helena',    'helena.rodrigues@email.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu','ROLE_EE', 1),
('ee_paulo',     'paulo.carvalho@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_teresa',    'teresa.alves@email.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_fernando',  'fernando.cunha@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_margarida', 'margarida.sousa@email.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1),
('ee_ricardo',   'ricardo.nunes@email.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uZutLtVPu', 'ROLE_EE', 1);

-- ============================================================
-- ATLETAS (50 atletas distribuídos pelas 6 equipas)
-- ============================================================

-- Sub-13 A (equipa 1) — 10 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id) VALUES
(1,  'Afonso Teixeira',    '2013-02-10', '100000001', 'S101', 'Guarda-Redes', 'APTO',         1,  1),
(2,  'Bernardo Faria',     '2013-05-22', '100000002', 'S102', 'Defesa',       'APTO',         2,  1),
(3,  'Dinis Carvalho',     '2013-08-14', '100000003', 'S103', 'Defesa',       'APTO',         3,  1),
(4,  'Eduardo Pinto',      '2013-11-03', '100000004', 'S104', 'Medio',        'APTO',         4,  1),
(5,  'Filipe Monteiro',    '2014-01-19', '100000005', 'S105', 'Medio',        'APTO',         5,  1),
(6,  'Gonçalo Reis',       '2013-04-07', '100000006', 'S106', 'Avancado',     'CONDICIONADO', 6,  1),
(7,  'Hugo Azevedo',       '2013-07-25', '100000007', 'S107', 'Avancado',     'APTO',         7,  1),
(8,  'Ivan Soares',        '2014-02-11', '100000008', 'S108', 'Defesa',       'APTO',         8,  1),
(9,  'Joaquim Brito',      '2013-09-30', '100000009', 'S109', 'Medio',        'PENDENTE_EMD', 9,  1),
(10, 'Kevin Dias',         '2014-03-16', '100000010', 'S110', 'Avancado',     'APTO',         10, 1);

-- Sub-15 A (equipa 2) — 17 atletas (plantel principal demo)
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id) VALUES
(11, 'Tomas Silva',        '2011-03-15', '111222333', 'S001', 'Avancado',     'CONDICIONADO', 1,  2),
(12, 'Beatriz Santos',     '2009-07-22', '222333444', 'S002', 'Defesa',       'APTO',         2,  2),
(13, 'Ricardo Ferreira',   '2007-11-08', '333444555', 'S003', 'Medio',        'INAPTO',       3,  2),
(14, 'Diogo Martins',      '2011-06-20', '444555666', 'S004', 'Guarda-Redes', 'APTO',         1,  2),
(15, 'Andre Costa',        '2011-09-14', '555666777', 'S005', 'Defesa',       'APTO',         2,  2),
(16, 'Miguel Oliveira',    '2012-01-30', '666777888', 'S006', 'Medio',        'APTO',         3,  2),
(17, 'Pedro Ferreira',     '2011-11-05', '777888999', 'S007', 'Avancado',     'APTO',         4,  2),
(18, 'Joao Pereira',       '2011-04-12', '888999000', 'S008', 'Defesa',       'APTO',         5,  2),
(19, 'Rui Gomes',          '2012-03-08', '999000111', 'S009', 'Medio',        'APTO',         6,  2),
(20, 'Francisco Lopes',    '2011-07-25', '000111222', 'S010', 'Avancado',     'APTO',         7,  2),
(21, 'Henrique Silva',     '2011-12-01', '112233445', 'S011', 'Guarda-Redes', 'PENDENTE_EMD', 8,  2),
(22, 'Bruno Santos',       '2012-02-14', '223344556', 'S012', 'Defesa',       'APTO',         9,  2),
(23, 'Carlos Martins',     '2011-08-30', '334455667', 'S013', 'Medio',        'APTO',         10, 2),
(24, 'Luis Costa',         '2012-05-18', '445566778', 'S014', 'Avancado',     'APTO',         11, 2),
(25, 'Antonio Ferreira',   '2011-10-22', '556677889', 'S015', 'Defesa',       'APTO',         12, 2),
(26, 'Sergio Oliveira',    '2012-04-05', '667788990', 'S016', 'Medio',        'APTO',         13, 2),
(27, 'Paulo Pereira',      '2011-09-17', '778899001', 'S017', 'Avancado',     'APTO',         14, 2);

-- Sub-17 A (equipa 3) — 10 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id) VALUES
(28, 'Alexandre Lima',     '2009-01-12', '200000001', 'S201', 'Guarda-Redes', 'APTO',         1,  3),
(29, 'Bruno Rocha',        '2009-04-23', '200000002', 'S202', 'Defesa',       'CONDICIONADO', 2,  3),
(30, 'Claudio Vieira',     '2009-07-08', '200000003', 'S203', 'Defesa',       'APTO',         3,  3),
(31, 'Daniel Marques',     '2009-10-17', '200000004', 'S204', 'Medio',        'APTO',         4,  3),
(32, 'Elias Ribeiro',      '2010-02-28', '200000005', 'S205', 'Medio',        'INAPTO',       5,  3),
(33, 'Fábio Correia',      '2009-06-14', '200000006', 'S206', 'Avancado',     'APTO',         6,  3),
(34, 'Gabriel Neves',      '2009-11-03', '200000007', 'S207', 'Avancado',     'APTO',         7,  3),
(35, 'Hélio Campos',       '2010-03-21', '200000008', 'S208', 'Defesa',       'APTO',         8,  3),
(36, 'Igor Freitas',       '2009-08-09', '200000009', 'S209', 'Medio',        'PENDENTE_EMD', 9,  3),
(37, 'Joel Barbosa',       '2010-01-05', '200000010', 'S210', 'Avancado',     'APTO',         10, 3);

-- Sub-19 A (equipa 4) — 8 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id) VALUES
(38, 'Leandro Pires',      '2007-05-14', '300000001', 'S301', 'Guarda-Redes', 'APTO',         11, 4),
(39, 'Marco Simões',       '2007-08-27', '300000002', 'S302', 'Defesa',       'APTO',         12, 4),
(40, 'Nuno Macedo',        '2007-11-19', '300000003', 'S303', 'Defesa',       'CONDICIONADO', 13, 4),
(41, 'Óscar Tavares',      '2008-02-06', '300000004', 'S304', 'Medio',        'APTO',         14, 4),
(42, 'Pedro Guedes',       '2007-07-23', '300000005', 'S305', 'Medio',        'APTO',         15, 4),
(43, 'Quim Andrade',       '2008-04-11', '300000006', 'S306', 'Avancado',     'APTO',         1,  4),
(44, 'Rafael Esteves',     '2007-09-30', '300000007', 'S307', 'Avancado',     'INAPTO',       2,  4),
(45, 'Samuel Baptista',    '2008-01-17', '300000008', 'S308', 'Defesa',       'APTO',         3,  4);

-- Seniores A (equipa 5) — 5 atletas
INSERT INTO atleta (id, nome_completo, data_nascimento, nif, numero_socio, posicao, estado_elegibilidade, encarregado_id, equipa_id) VALUES
(46, 'Tiago Moutinho',     '2003-03-10', '400000001', 'S401', 'Guarda-Redes', 'APTO',         4,  5),
(47, 'Ulisses Fonseca',    '2002-07-18', '400000002', 'S402', 'Defesa',       'APTO',         5,  5),
(48, 'Vasco Henriques',    '2001-11-25', '400000003', 'S403', 'Medio',        'APTO',         6,  5),
(49, 'Xavier Magalhães',   '2000-04-03', '400000004', 'S404', 'Avancado',     'CONDICIONADO', 7,  5),
(50, 'Yuri Nascimento',    '2003-08-14', '400000005', 'S405', 'Avancado',     'APTO',         8,  5);

-- ============================================================
-- OCORRÊNCIAS CLÍNICAS
-- ============================================================
INSERT INTO ocorrencia (atleta_id, data_ocorrencia, tipo, diagnostico, grau_restricao, data_reavaliacao, estado_emd, estado, medico_id) VALUES
-- Tomas Silva (id=11) — CONDICIONADO (AMARELO)
(11, '2026-05-10', 'LESAO',   'Entorse do tornozelo direito grau II. Recomendado repouso e fisioterapia durante 3 semanas.', 'AMARELO', '2026-06-10', 'EM_AVALIACAO', 'ATIVA',     4),
-- Ricardo Ferreira (id=13) — INAPTO (VERMELHO)
(13, '2026-05-15', 'TRAUMA',  'Contusao grave no joelho esquerdo apos colisao em treino. Cirurgia possivel.', 'VERMELHO', '2026-07-01', 'EM_AVALIACAO', 'ATIVA',     4),
-- Gonçalo Reis (id=6) — Sub-13 CONDICIONADO
(6,  '2026-05-18', 'LESAO',   'Distensao muscular na coxa direita. Restricao parcial por 2 semanas.', 'AMARELO', '2026-06-01', 'EM_AVALIACAO', 'ATIVA',     4),
-- Henrique Silva (id=21) — PENDENTE_EMD (sem ocorrência activa)
-- Bruno Rocha (id=29) Sub-17 CONDICIONADO
(29, '2026-05-20', 'DOENCA',  'Sindrome gripal com febre alta. Afastamento temporario recomendado.', 'AMARELO', '2026-05-27', 'DELIBERADO',   'ATIVA',     4),
-- Elias Ribeiro (id=32) Sub-17 INAPTO
(32, '2026-05-12', 'TRAUMA',  'Fratura parcial no metacarpo da mao direita. Cirurgia descartada, gesso por 4 semanas.', 'VERMELHO', '2026-06-12', 'EM_AVALIACAO', 'ATIVA', 4),
-- Nuno Macedo (id=40) Sub-19 CONDICIONADO
(40, '2026-05-22', 'LESAO',   'Tendinite no joelho direito. Fisioterapia 3x semana.', 'AMARELO', '2026-06-05', 'EM_AVALIACAO', 'ATIVA',     4),
-- Rafael Esteves (id=44) Sub-19 INAPTO
(44, '2026-05-08', 'TRAUMA',  'Rotura parcial dos ligamentos do tornozelo esquerdo.', 'VERMELHO', '2026-07-15', 'EM_AVALIACAO', 'ATIVA',     4),
-- Xavier Magalhães (id=49) Seniores CONDICIONADO
(49, '2026-05-19', 'LESAO',   'Contractura muscular nas costas. Repouso recomendado por 10 dias.', 'AMARELO', '2026-05-29', 'EM_AVALIACAO', 'ATIVA',     4),
-- Ocorrência RESOLVIDA (histórico)
(12, '2026-04-01', 'DOENCA',  'Gripe sazonal com recuperação completa.', 'VERDE', '2026-04-10', 'DELIBERADO', 'RESOLVIDA', 4);

-- ============================================================
-- SESSÕES DE TREINO
-- ============================================================
INSERT INTO sessao_treino (equipa_id, data, hora_inicio, hora_fim, tipo, estado) VALUES
-- Hoje
(2, CURDATE(), '09:00:00', '10:30:00', 'TREINO',    'PLANEADA'),
(2, CURDATE(), '16:00:00', '17:30:00', 'TATICO',    'PLANEADA'),
(3, CURDATE(), '10:00:00', '11:30:00', 'TREINO',    'PLANEADA'),
(1, CURDATE(), '08:30:00', '10:00:00', 'TREINO',    'PLANEADA'),
-- Amanhã
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '10:30:00', 'TREINO', 'PLANEADA'),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '11:30:00', 'TREINO', 'PLANEADA'),
-- Depois de amanhã
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', '17:30:00', 'AQUECIMENTO', 'PLANEADA'),
-- Sessões passadas (para estatísticas)
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', '10:30:00', 'TREINO',    'CONCLUIDA'),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '16:00:00', '17:30:00', 'TATICO',    'CONCLUIDA'),
(2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '09:00:00', '10:30:00', 'TREINO',    'CONCLUIDA'),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '10:00:00', '11:30:00', 'TREINO',    'CONCLUIDA'),
(1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '08:30:00', '10:00:00', 'TREINO',    'CONCLUIDA');

-- ============================================================
-- REGISTOS DE ASSIDUIDADE (sessões passadas Sub-15 A)
-- ============================================================
-- Sessão de ontem (id=8 pela ordem de inserção — usamos subquery)
INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado)
SELECT s.id, a.id, 'PRESENTE'
FROM sessao_treino s, atleta a
WHERE s.equipa_id = 2 AND s.estado = 'CONCLUIDA' AND s.data = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
AND a.equipa_id = 2 AND a.estado_elegibilidade = 'APTO';

INSERT INTO registo_assiduidade (sessao_id, atleta_id, estado)
SELECT s.id, a.id, 'AUSENTE'
FROM sessao_treino s, atleta a
WHERE s.equipa_id = 2 AND s.estado = 'CONCLUIDA' AND s.data = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
AND a.equipa_id = 2 AND a.estado_elegibilidade IN ('CONDICIONADO', 'INAPTO', 'PENDENTE_EMD');

-- ============================================================
-- AVALIAÇÕES DE RENDIMENTO
-- ============================================================
INSERT INTO avaliacao_rendimento (sessao_id, atleta_id, nota)
SELECT s.id, a.id,
  ROUND(6.0 + (a.id % 4) * 0.5 + RAND() * 1.5, 1)
FROM sessao_treino s, atleta a
WHERE s.equipa_id = 2 AND s.estado = 'CONCLUIDA'
AND a.equipa_id = 2 AND a.estado_elegibilidade = 'APTO'
LIMIT 30;

-- ============================================================
-- EVENTOS DESPORTIVOS
-- ============================================================
INSERT INTO evento_desportivo (equipa_id, tipo, data, hora_inicio, adversario, local, estado) VALUES
-- Sub-15 A — jogos futuros
(2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 3  DAY), '15:00:00', 'FC Porto B',      'Estadio do Bessa',    'AGENDADO'),
(2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 7  DAY), '11:00:00', 'Sporting CP B',   'Campo de Treinos',    'AGENDADO'),
(2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 14 DAY), '16:00:00', 'Vitoria SC B',    'Campo de Treinos',    'AGENDADO'),
(2, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 21 DAY), '14:00:00', 'Braga B',         'Estadio Municipal',   'AGENDADO'),
-- Sub-15 A — jogo passado (com ficha)
(2, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 7  DAY), '15:00:00', 'Académica B',     'Campo de Treinos',    'CONCLUIDO'),
-- Sub-17 A — jogos futuros
(3, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 5  DAY), '14:00:00', 'Benfica B',       'Estadio da Luz',      'AGENDADO'),
(3, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 12 DAY), '11:00:00', 'Rio Ave B',       'Estadio dos Arcos',   'AGENDADO'),
-- Sub-17 A — jogo passado
(3, 'JOGO_OFICIAL', DATE_SUB(CURDATE(), INTERVAL 5  DAY), '15:00:00', 'Pacos Ferreira B','Estadio da Capital',  'CONCLUIDO'),
-- Sub-19 A
(4, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 6  DAY), '16:00:00', 'Famalicao B',     'Estadio Municipal',   'AGENDADO'),
-- Seniores
(5, 'JOGO_OFICIAL', DATE_ADD(CURDATE(), INTERVAL 4  DAY), '16:00:00', 'Leixoes SC',      'Estadio do Mar',      'AGENDADO'),
-- Treinos futuros Sub-15
(2, 'TREINO', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', NULL, 'Campo Principal',  'AGENDADO'),
(2, 'TREINO', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', NULL, 'Campo Principal',  'AGENDADO');

-- ============================================================
-- FICHAS DE JOGO (jogos passados)
-- ============================================================
INSERT INTO ficha_jogo (evento_id, golos_marcados, golos_sofridos, resultado, observacoes, estado_submissao)
SELECT id, 2, 1, 'VITORIA', 'Excelente prestacao colectiva. Primeiro golo aos 23 min, segundo de penalti aos 67 min.', 'SUBMETIDA'
FROM evento_desportivo WHERE adversario = 'Académica B' AND equipa_id = 2;

INSERT INTO ficha_jogo (evento_id, golos_marcados, golos_sofridos, resultado, observacoes, estado_submissao)
SELECT id, 0, 2, 'DERROTA', 'Derrota frente a equipa fisicamente superior. Necessario trabalhar transicoes defensivas.', 'SUBMETIDA'
FROM evento_desportivo WHERE adversario = 'Pacos Ferreira B' AND equipa_id = 3;

-- ============================================================
-- CONVOCATÓRIAS
-- ============================================================
-- Convocatória para próximo jogo Sub-15 (FC Porto B)
INSERT INTO convocatoria (evento_id, hora_concentracao, local_concentracao, estado, publicada_em)
SELECT id, '14:00:00', 'Balneario Principal', 'PUBLICADA', NOW()
FROM evento_desportivo WHERE adversario = 'FC Porto B' AND equipa_id = 2 LIMIT 1;

-- Atletas convocados (aptos e condicionados da Sub-15)
INSERT INTO convocatoria_atletas (convocatoria_id, atleta_id)
SELECT c.id, a.id
FROM convocatoria c
JOIN evento_desportivo e ON c.evento_id = e.id
JOIN atleta a ON a.equipa_id = e.equipa_id
WHERE e.adversario = 'FC Porto B' AND e.equipa_id = 2
AND a.estado_elegibilidade IN ('APTO', 'CONDICIONADO')
LIMIT 16;

-- Convocatória Sub-17 (Benfica B)
INSERT INTO convocatoria (evento_id, hora_concentracao, local_concentracao, estado, publicada_em)
SELECT id, '13:00:00', 'Balneario Norte', 'PUBLICADA', NOW()
FROM evento_desportivo WHERE adversario = 'Benfica B' AND equipa_id = 3 LIMIT 1;

INSERT INTO convocatoria_atletas (convocatoria_id, atleta_id)
SELECT c.id, a.id
FROM convocatoria c
JOIN evento_desportivo e ON c.evento_id = e.id
JOIN atleta a ON a.equipa_id = e.equipa_id
WHERE e.adversario = 'Benfica B' AND e.equipa_id = 3
AND a.estado_elegibilidade IN ('APTO', 'CONDICIONADO')
LIMIT 14;

-- ============================================================
-- OBRIGAÇÕES FINANCEIRAS
-- ============================================================
-- EE 1 (João Silva) — atletas 11, 14
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 1, 11, '2025-10-05'),
(35.00,  '2026-01-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 1, 11, '2026-01-03'),
(35.00,  '2026-02-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 1, 11, '2026-02-04'),
(35.00,  '2026-03-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 1, 11, '2026-03-02'),
(35.00,  '2026-04-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 1, 11, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 1, 14, NULL),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 1, 14, '2025-10-05');

-- EE 2 (Maria Santos) — atleta 12, 15
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 2, 12, '2025-10-10'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 2, 12, '2026-05-03'),
(35.00,  '2026-06-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 2, 15, NULL);

-- EE 3 (Carlos Ferreira) — atleta 13
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 3, 13, '2025-10-08'),
(35.00,  '2026-03-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 3, 13, NULL),
(35.00,  '2026-04-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 3, 13, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 3, 13, NULL);

-- EE 4-10 — obrigações variadas
INSERT INTO obrigacao_financeira (valor, data_vencimento, tipo, estado, entidade_juridica, encarregado_id, atleta_id, data_pagamento) VALUES
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 4, 17, '2025-10-12'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 4, 17, '2026-05-05'),
(35.00,  '2026-06-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 4, 17, NULL),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 5, 18, '2025-10-15'),
(35.00,  '2026-04-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 5, 18, NULL),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 5, 18, NULL),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 6, 19, '2025-10-20'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 6, 19, '2026-05-02'),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 7, 20, '2025-10-18'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 7, 20, NULL),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 8, 21, '2025-10-22'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PENDENTE', 'CLUBE', 8, 21, NULL),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 9, 22, '2025-10-25'),
(35.00,  '2026-05-01', 'MENSALIDADE',  'PAGO',     'CLUBE', 9, 22, '2026-05-08'),
(120.00, '2025-10-01', 'QUOTA_ANUAL',  'PAGO',     'CLUBE', 10, 23, '2025-10-28'),
(35.00,  '2026-04-01', 'MENSALIDADE',  'EM_ATRASO','CLUBE', 10, 23, NULL);

-- ============================================================
-- AUDIT LOG (demo rico)
-- ============================================================
INSERT INTO audit_log (ator, acao, entidade, entidade_id, detalhes, timestamp, ip_address) VALUES
('admin',      'LOGIN',   'Utilizador', 1,  'Login efectuado com sucesso',                    DATE_SUB(NOW(), INTERVAL 2  HOUR), '127.0.0.1'),
('secretaria', 'CRIAR',   'Atleta',     11, 'Atleta Tomas Silva registado',                   DATE_SUB(NOW(), INTERVAL 8  HOUR), '192.168.1.10'),
('secretaria', 'CRIAR',   'Atleta',     13, 'Atleta Ricardo Ferreira registado',              DATE_SUB(NOW(), INTERVAL 8  HOUR), '192.168.1.10'),
('medico',     'CRIAR',   'Ocorrencia', 1,  'Ocorrencia de lesao registada para Tomas Silva', DATE_SUB(NOW(), INTERVAL 6  HOUR), '192.168.1.15'),
('medico',     'CRIAR',   'Ocorrencia', 2,  'Trauma grave registado para Ricardo Ferreira',   DATE_SUB(NOW(), INTERVAL 6  HOUR), '192.168.1.15'),
('treinador',  'CRIAR',   'Convocatoria',1, 'Convocatoria publicada para FC Porto B',         DATE_SUB(NOW(), INTERVAL 4  HOUR), '192.168.1.20'),
('secretaria', 'CRIAR',   'ObrigacaoFinanceira', 1, 'Pagamento quota anual registado',        DATE_SUB(NOW(), INTERVAL 3  HOUR), '192.168.1.10'),
('admin',      'EDITAR',  'Utilizador', 2,  'Utilizador ceo reactivado',                      DATE_SUB(NOW(), INTERVAL 2  HOUR), '127.0.0.1'),
('treinador',  'LOGIN',   'Utilizador', 5,  'Login efectuado com sucesso',                    DATE_SUB(NOW(), INTERVAL 1  HOUR), '192.168.1.20'),
('medico',     'EDITAR',  'Ocorrencia', 1,  'Evolucao registada: AMARELO -> VERMELHO',        DATE_SUB(NOW(), INTERVAL 30 MINUTE), '192.168.1.15'),
('secretaria', 'LOGIN',   'Utilizador', 3,  'Login efectuado com sucesso',                    DATE_SUB(NOW(), INTERVAL 20 MINUTE), '192.168.1.10'),
('ceo',        'LOGIN',   'Utilizador', 2,  'Login efectuado com sucesso',                    DATE_SUB(NOW(), INTERVAL 10 MINUTE), '192.168.1.30'),
('treinador',  'CRIAR',   'FichaJogo',  1,  'Ficha de jogo submetida para Academica B',       DATE_SUB(NOW(), INTERVAL 5  MINUTE), '192.168.1.20');

-- ============================================================
-- FIM DO SEED
-- ============================================================
SELECT CONCAT('Seed concluido! Atletas: ', (SELECT COUNT(*) FROM atleta),
              ' | Utilizadores: ', (SELECT COUNT(*) FROM utilizador),
              ' | Ocorrencias: ', (SELECT COUNT(*) FROM ocorrencia),
              ' | Obrigacoes: ', (SELECT COUNT(*) FROM obrigacao_financeira)) AS resultado;
