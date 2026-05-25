-- Módulo Treinador

CREATE TABLE epoca_desportiva (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE sessao_treino (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipa_id BIGINT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_sessao_treino_equipa FOREIGN KEY (equipa_id) REFERENCES equipa(id) ON DELETE CASCADE
);

CREATE TABLE registo_assiduidade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sessao_id BIGINT NOT NULL,
    atleta_id BIGINT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    registado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_registo_assiduidade_sessao FOREIGN KEY (sessao_id) REFERENCES sessao_treino(id) ON DELETE CASCADE,
    CONSTRAINT fk_registo_assiduidade_atleta FOREIGN KEY (atleta_id) REFERENCES atleta(id) ON DELETE CASCADE,
    UNIQUE KEY uk_registo_assid_sess_atl (sessao_id, atleta_id)
);

CREATE TABLE avaliacao_rendimento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sessao_id BIGINT NOT NULL,
    atleta_id BIGINT NOT NULL,
    nota DECIMAL(2, 1) NOT NULL,
    registado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_avaliacao_rendimento_sessao FOREIGN KEY (sessao_id) REFERENCES sessao_treino(id) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacao_rendimento_atleta FOREIGN KEY (atleta_id) REFERENCES atleta(id) ON DELETE CASCADE,
    UNIQUE KEY uk_aval_rendim_sess_atl (sessao_id, atleta_id)
);

CREATE TABLE evento_desportivo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipa_id BIGINT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    adversario VARCHAR(150),
    local VARCHAR(200) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_evento_desportivo_equipa FOREIGN KEY (equipa_id) REFERENCES equipa(id) ON DELETE CASCADE
);

CREATE TABLE convocatoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id BIGINT NOT NULL,
    hora_concentracao TIME,
    local_concentracao VARCHAR(200),
    estado VARCHAR(50) NOT NULL,
    publicada_em TIMESTAMP NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_convocatoria_evento FOREIGN KEY (evento_id) REFERENCES evento_desportivo(id) ON DELETE CASCADE
);

CREATE TABLE convocatoria_atletas (
    convocatoria_id BIGINT NOT NULL,
    atleta_id BIGINT NOT NULL,
    PRIMARY KEY (convocatoria_id, atleta_id),
    CONSTRAINT fk_convocatoria_atletas_conv FOREIGN KEY (convocatoria_id) REFERENCES convocatoria(id) ON DELETE CASCADE,
    CONSTRAINT fk_convocatoria_atletas_atleta FOREIGN KEY (atleta_id) REFERENCES atleta(id) ON DELETE CASCADE
);
