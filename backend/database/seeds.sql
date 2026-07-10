SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS professor_disciplinas;
DROP TABLE IF EXISTS calendario_semestres;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS disciplinas;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS anos_letivos;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;


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
    tipo ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno',
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
    status ENUM('Regulamentar', 'Opcional', 'Concluída') DEFAULT 'Regulamentar',
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

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_tipo ON usuarios(tipo);
CREATE INDEX idx_usuario_curso ON usuarios(curso_id);
CREATE INDEX idx_professor_nome ON professores(nome);
CREATE INDEX idx_disciplina_curso ON disciplinas(curso_id);


INSERT INTO cursos (id, nome, sigla) VALUES
(1, 'Engenharia de Informática e Sistemas de Informação', 'EISI'),
(2, 'Direito', 'DIR'),
(3, 'Ciências Criminais', 'CC'),
(4, 'Hotelaria & Turismo', 'HT'),
(5, 'Logística e Gestão Comercial', 'LGC'),
(6, 'Gestão de Recursos Humanos', 'GRH'),
(7, 'Contabilidade & Finanças', 'CF'),
(8, 'Redes e Telecomunicações', 'RT');

INSERT INTO anos_letivos (id, ano_inicio, ano_fim, descricao, ativo) VALUES
(1, 2025, 2026, 'Ano Letivo 2025/2026', FALSE),
(2, 2026, 2027, 'Ano Letivo 2026/2027', TRUE);

INSERT INTO disciplinas (id, nome, sigla, curso_id, ano_academico, semestre, status) VALUES
(1, 'Álgebra Linear', 'AL', 1, 1, 1, 'Regulamentar'),
(2, 'Análise Matemática I', 'AM I', 1, 1, 1, 'Regulamentar'),
(5, 'Introdução aos Computadores e Programação', 'ICP', 1, 1, 1, 'Regulamentar'),
(31, 'Programação III (IA)', 'PROG III', 1, 4, 1, 'Regulamentar'),
(33, 'Análise de Sistemas de Informação', 'ASI', 1, 4, 2, 'Regulamentar'),
(34, 'Computação Gráfica', 'CG', 1, 4, 2, 'Regulamentar'),
(35, 'Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', 1, 4, 2, 'Regulamentar'),
(36, 'Redes de Computadores', 'RC', 1, 4, 2, 'Regulamentar'),
(48, 'Introdução ao Direito', 'DIR I', 2, 1, 1, 'Regulamentar'),
(49, 'Fundamentos de Ciências Criminais', 'CC I', 3, 1, 1, 'Regulamentar'),
(50, 'Gestão em Hotelaria e Turismo', 'HTG', 4, 1, 1, 'Regulamentar'),
(51, 'Logística e Gestão Comercial I', 'LGC I', 5, 1, 1, 'Regulamentar'),
(52, 'Recursos Humanos I', 'RRHH I', 6, 1, 1, 'Regulamentar'),
(53, 'Contabilidade e Finanças I', 'CF I', 7, 1, 1, 'Regulamentar'),
(54, 'Redes e Telecomunicações I', 'RT I', 8, 1, 1, 'Regulamentar');

INSERT INTO professores (id, nome, departamento, foto_perfil) VALUES
(1, 'Professor Rouget', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/rouget.svg'),
(2, 'Professor Tawana', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_18.svg'),
(4, 'Professor Doutor Yoelkis Victor', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/yoelkis-victor.svg'),
(12, 'Dra. Maria Santos', 'Direito', '../assets/images/professores/prof_direito.svg'),
(13, 'Prof. João Criminalista', 'Ciências Criminais', '../assets/images/professores/prof_cc.svg'),
(14, 'Prof. Helena Turismo', 'Hotelaria & Turismo', '../assets/images/professores/prof_ht.svg'),
(15, 'Prof. Carlos Logistica', 'Logística e Gestão Comercial', '../assets/images/professores/prof_lgc.svg'),
(16, 'Prof. Ana Recursos', 'Gestão de Recursos Humanos', '../assets/images/professores/prof_grh.svg'),
(17, 'Prof. Pedro Contabilidade', 'Contabilidade & Finanças', '../assets/images/professores/prof_cf.svg'),
(18, 'Prof. Miguel Telecom', 'Redes e Telecomunicações', '../assets/images/professores/prof_rt.svg');

INSERT INTO professor_disciplinas (professor_id, disciplina_id) VALUES
(1, 31), (2, 5), (4, 33), (4, 35),
(12, 48), (13, 49), (14, 50), (15, 51),
(16, 52), (17, 53), (18, 54);

INSERT INTO calendario_semestres (id, ano_letivo_id, semestre, data_inicio, data_fim, ativo) VALUES
(1, 1, 1, '2025-08-25', '2026-02-21', FALSE),
(2, 2, 2, '2026-02-23', '2026-07-26', TRUE);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso_id, ano_academico, senha, tipo, professor_id) VALUES
(220429, 'Joaquim Herculano Joao', 'joaquim.herculano.joao@avaliadocente.local', '9465105', NULL, 1, 4, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno', NULL),
(220430, 'Liliana Guilherme', 'liliana.guilherme@avaliadocente.local', '9465106', NULL, 1, 4, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno', NULL),
(990001, 'Professor Rouget', 'rouget@avaliadocente.local', NULL, '../assets/images/professores/rouget.svg', 1, 0, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professor', 1),
(990012, 'Dra. Maria Santos', 'maria.santos@avaliadocente.local', NULL, '../assets/images/professores/prof_direito.svg', 2, 0, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'professor', 12);

-- Coordenador (pode ver métricas agregadas mas não identifica avaliadores)
INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso_id, ano_academico, senha, tipo, professor_id) VALUES
(900000, 'Coordenador Local', 'coordenador@avaliadocente.local', '900000001', NULL, 1, 0, 'coord123', 'admin', NULL);

INSERT INTO matriculas (usuario_id, disciplina_id, calendario_id) VALUES
(220429, 33, 2), (220429, 35, 2), (220429, 36, 2);