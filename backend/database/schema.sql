CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(30),
    foto_perfil VARCHAR(255),
    curso VARCHAR(120),
    ano_academico VARCHAR(20),
    senha VARCHAR(255),
    tipo ENUM('aluno','professor','admin') DEFAULT 'aluno',
    professor_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    departamento VARCHAR(100),
    foto_perfil VARCHAR(255),
    disciplina_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(160) NOT NULL,
    sigla VARCHAR(40),
    ano_academico VARCHAR(20) NOT NULL,
    semestre VARCHAR(30) NOT NULL,
    status VARCHAR(40) DEFAULT 'Regulamentar',
    curso VARCHAR(120) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE professor_disciplinas (
    professor_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (professor_id, disciplina_id),
    FOREIGN KEY (professor_id) REFERENCES professores(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT,
    professor_id INT,
    disciplina_id INT,
    clareza INT,
    dinamismo INT,
    recursos INT,
    criterios_avaliacao INT,
    retorno INT,
    disponibilidade INT,
    respeito INT,
    pontualidade INT,
    metodologia INT,
    didatica INT,
    assiduidade INT,
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
    FOREIGN KEY (professor_id) REFERENCES professores(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
