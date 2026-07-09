SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS professor_disciplinas;
DROP TABLE IF EXISTS calendario_semestres;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS disciplinas;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(120) NOT NULL,

    email VARCHAR(120) NOT NULL UNIQUE,

    telefone VARCHAR(30),

    foto_perfil VARCHAR(255),

    curso VARCHAR(120) NOT NULL,

    ano_academico TINYINT NOT NULL,

    senha VARCHAR(255) NOT NULL,

    tipo ENUM(
        'aluno',
        'professor',
        'admin'
    ) DEFAULT 'aluno',

    professor_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE professores (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(120) NOT NULL,

    departamento VARCHAR(120),

    foto_perfil VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE disciplinas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(180) NOT NULL,

    sigla VARCHAR(30),

    curso VARCHAR(120) NOT NULL,

    ano_academico TINYINT NOT NULL,

    semestre TINYINT NOT NULL,

    status ENUM(
        'Regulamentar',
        'Opcional',
        'Concluída'
    ) DEFAULT 'Regulamentar',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE professor_disciplinas (

    professor_id INT NOT NULL,

    disciplina_id INT NOT NULL,

    PRIMARY KEY (
        professor_id,
        disciplina_id
    ),

    FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE,

    FOREIGN KEY (disciplina_id)
        REFERENCES disciplinas(id)
        ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE calendario_semestres (

    id INT AUTO_INCREMENT PRIMARY KEY,

    ano INT NOT NULL,

    semestre TINYINT NOT NULL,

    data_inicio DATE NOT NULL,

    data_fim DATE NOT NULL,

    ativo BOOLEAN DEFAULT FALSE,

    UNIQUE (
        ano,
        semestre
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE matriculas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    disciplina_id INT NOT NULL,

    calendario_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (disciplina_id)
        REFERENCES disciplinas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (calendario_id)
        REFERENCES calendario_semestres(id)
        ON DELETE CASCADE,

    UNIQUE (
        usuario_id,
        disciplina_id,
        calendario_id
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE avaliacoes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    aluno_id INT NOT NULL,

    professor_id INT NOT NULL,

    disciplina_id INT NOT NULL,

    calendario_id INT NOT NULL,

    clareza TINYINT NOT NULL,

    dinamismo TINYINT NOT NULL,

    recursos TINYINT NOT NULL,

    criterios_avaliacao TINYINT NOT NULL,

    retorno TINYINT NOT NULL,

    disponibilidade TINYINT NOT NULL,

    respeito TINYINT NOT NULL,

    pontualidade TINYINT NOT NULL,

    metodologia TINYINT NOT NULL,

    didatica TINYINT NOT NULL,

    assiduidade TINYINT NOT NULL,

    comentario TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (aluno_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE,

    FOREIGN KEY (disciplina_id)
        REFERENCES disciplinas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (calendario_id)
        REFERENCES calendario_semestres(id)
        ON DELETE CASCADE,

    UNIQUE (
        aluno_id,
        professor_id,
        disciplina_id,
        calendario_id
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


ALTER TABLE usuarios
ADD CONSTRAINT fk_usuario_professor
FOREIGN KEY (professor_id)
REFERENCES professores(id)
ON DELETE SET NULL;

CREATE INDEX idx_usuario_email
ON usuarios(email);

CREATE INDEX idx_usuario_tipo
ON usuarios(tipo);

CREATE INDEX idx_professor_nome
ON professores(nome);

CREATE INDEX idx_disciplina_curso
ON disciplinas(curso);

CREATE INDEX idx_disciplina_semestre
ON disciplinas(semestre);

CREATE INDEX idx_avaliacao_professor
ON avaliacoes(professor_id);

CREATE INDEX idx_avaliacao_aluno
ON avaliacoes(aluno_id);

CREATE INDEX idx_avaliacao_calendario
ON avaliacoes(calendario_id);