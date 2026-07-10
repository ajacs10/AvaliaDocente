SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Remover tabelas na ordem correta para evitar erros de dependência
DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS professor_disciplinas;
DROP TABLE IF EXISTS calendario_semestres;
DROP TABLE IF EXISTS disciplinas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS anos_letivos;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- CRIAÇÃO DAS TABELAS
-- =============================================

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(180) NOT NULL,
    sigla VARCHAR(60) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE anos_letivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano_inicio INT NOT NULL,
    ano_fim INT NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ano_letivo (ano_inicio, ano_fim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    departamento VARCHAR(120),
    foto_perfil VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefone VARCHAR(30),
    foto_perfil VARCHAR(255),
    curso_id INT NOT NULL,
    ano_academico TINYINT NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('aluno','professor','admin') DEFAULT 'aluno',
    professor_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE RESTRICT,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(180) NOT NULL,
    sigla VARCHAR(30),
    curso_id INT NOT NULL,
    ano_academico TINYINT NOT NULL,
    semestre TINYINT NOT NULL,
    status ENUM('Regulamentar','Opcional','Concluída') DEFAULT 'Regulamentar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_disciplina (nome, curso_id, ano_academico, semestre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE professor_disciplinas (
    professor_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    PRIMARY KEY (professor_id, disciplina_id),
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calendario_semestres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano_letivo_id INT NOT NULL,
    semestre TINYINT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ano_letivo_id) REFERENCES anos_letivos(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_calendario (ano_letivo_id, semestre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    calendario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    FOREIGN KEY (calendario_id) REFERENCES calendario_semestres(id) ON DELETE CASCADE,
    UNIQUE KEY uk_matricula (usuario_id, disciplina_id, calendario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    professor_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    calendario_id INT NOT NULL,
    clareza TINYINT NOT NULL CHECK (clareza BETWEEN 1 AND 5),
    dinamismo TINYINT NOT NULL CHECK (dinamismo BETWEEN 1 AND 5),
    recursos TINYINT NOT NULL CHECK (recursos BETWEEN 1 AND 5),
    criterios_avaliacao TINYINT NOT NULL CHECK (criterios_avaliacao BETWEEN 1 AND 5),
    retorno TINYINT NOT NULL CHECK (retorno BETWEEN 1 AND 5),
    disponibilidade TINYINT NOT NULL CHECK (disponibilidade BETWEEN 1 AND 5),
    respeito TINYINT NOT NULL CHECK (respeito BETWEEN 1 AND 5),
    pontualidade TINYINT NOT NULL CHECK (pontualidade BETWEEN 1 AND 5),
    metodologia TINYINT NOT NULL CHECK (metodologia BETWEEN 1 AND 5),
    didatica TINYINT NOT NULL CHECK (didatica BETWEEN 1 AND 5),
    assiduidade TINYINT NOT NULL CHECK (assiduidade BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE RESTRICT,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE RESTRICT,
    FOREIGN KEY (calendario_id) REFERENCES calendario_semestres(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_avaliacao (aluno_id, professor_id, disciplina_id, calendario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- =============================================
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_tipo ON usuarios(tipo);
CREATE INDEX idx_usuario_curso ON usuarios(curso_id);
CREATE INDEX idx_professor_nome ON professores(nome);
CREATE INDEX idx_disciplina_curso ON disciplinas(curso_id);
CREATE INDEX idx_disciplina_semestre ON disciplinas(semestre);
CREATE INDEX idx_avaliacao_professor ON avaliacoes(professor_id);
CREATE INDEX idx_avaliacao_aluno ON avaliacoes(aluno_id);