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
    tipo ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno',
    professor_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    departamento VARCHAR(120),
    foto_perfil VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(180) NOT NULL,
    sigla VARCHAR(30),
    curso VARCHAR(120) NOT NULL,
    ano_academico TINYINT NOT NULL,
    semestre TINYINT NOT NULL,
    status ENUM('Regulamentar', 'Opcional', 'Concluída') DEFAULT 'Regulamentar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    ano INT NOT NULL,
    semestre TINYINT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT FALSE,
    UNIQUE (ano, semestre)
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
    UNIQUE (usuario_id, disciplina_id, calendario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    FOREIGN KEY (calendario_id) REFERENCES calendario_semestres(id) ON DELETE CASCADE,
    UNIQUE (aluno_id, professor_id, disciplina_id, calendario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE usuarios ADD CONSTRAINT fk_usuario_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL;

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_tipo ON usuarios(tipo);
CREATE INDEX idx_professor_nome ON professores(nome);
CREATE INDEX idx_disciplina_curso ON disciplinas(curso);
CREATE INDEX idx_disciplina_semestre ON disciplinas(semestre);
CREATE INDEX idx_avaliacao_professor ON avaliacoes(professor_id);
CREATE INDEX idx_avaliacao_aluno ON avaliacoes(aluno_id);
CREATE INDEX idx_avaliacao_calendario ON avaliacoes(calendario_id);

INSERT INTO calendario_semestres (ano, semestre, data_inicio, data_fim, ativo) VALUES
(2025, 1, '2025-08-25', '2026-02-21', FALSE),
(2026, 2, '2026-02-23', '2026-07-26', TRUE);

INSERT INTO disciplinas (id, nome, sigla, curso, ano_academico, semestre, status) VALUES
(1, 'Álgebra Linear', 'AL', 'EISI', 1, 1, 'Regulamentar'),
(2, 'Análise Matemática I', 'AM I', 'EISI', 1, 1, 'Regulamentar'),
(3, 'Análise Matemática II', 'AM II', 'EISI', 1, 2, 'Regulamentar'),
(4, 'Física I', 'FIS I', 'EISI', 1, 1, 'Regulamentar'),
(5, 'Introdução aos Computadores e Programação', 'ICP', 'EISI', 1, 1, 'Regulamentar'),
(6, 'Métodos de Investigação Científica', 'MIC', 'EISI', 1, 1, 'Regulamentar'),
(7, 'Química Fundamental', 'QF', 'EISI', 1, 1, 'Regulamentar'),
(8, 'Química Orgânica', 'QO', 'EISI', 1, 2, 'Regulamentar'),
(9, 'Análise Matemática III', 'AM III', 'EISI', 2, 1, 'Regulamentar'),
(10, 'Análise Matemática IV', 'AM IV', 'EISI', 2, 2, 'Regulamentar'),
(11, 'Comunicação Pessoal e Empresarial', 'CPE', 'EISI', 2, 1, 'Regulamentar'),
(12, 'Física II', 'FIS II', 'EISI', 2, 1, 'Regulamentar'),
(13, 'Física III', 'FIS III', 'EISI', 2, 2, 'Regulamentar'),
(14, 'Introdução à Organização e à Gestão', 'IOG', 'EISI', 2, 1, 'Regulamentar'),
(15, 'Língua Inglesa I', 'ING I', 'EISI', 2, 1, 'Regulamentar'),
(16, 'Língua Inglesa II', 'ING II', 'EISI', 2, 2, 'Regulamentar'),
(17, 'Sistemas Digitais', 'SD', 'EISI', 2, 2, 'Regulamentar'),
(18, 'Análise Numérica Científica', 'ANC', 'EISI', 3, 1, 'Regulamentar'),
(19, 'Arquitectura de Computadores I', 'AC I', 'EISI', 3, 1, 'Regulamentar'),
(20, 'Base de Dados', 'BD', 'EISI', 3, 1, 'Regulamentar'),
(21, 'Fundamentos de Sistemas de Informação', 'FSI', 'EISI', 3, 1, 'Regulamentar'),
(22, 'Língua Inglesa III', 'ING III', 'EISI', 3, 1, 'Regulamentar'),
(23, 'Língua Inglesa IV', 'ING IV', 'EISI', 3, 2, 'Regulamentar'),
(24, 'Mecânica I', 'MEC I', 'EISI', 3, 1, 'Regulamentar'),
(25, 'Probabilidades e Estatística', 'PE', 'EISI', 3, 2, 'Regulamentar'),
(26, 'Programação I - Algoritmos e Estruturas de Dados', 'PROG I', 'EISI', 3, 1, 'Regulamentar'),
(27, 'Programação II', 'PROG II', 'EISI', 3, 2, 'Regulamentar'),
(28, 'Análise de Sistemas', 'AS', 'EISI', 4, 1, 'Regulamentar'),
(29, 'Arquitectura de Computadores II', 'AC II', 'EISI', 4, 1, 'Regulamentar'),
(30, 'Base de Dados II', 'BD II', 'EISI', 4, 1, 'Regulamentar'),
(31, 'Programação III (IA)', 'PROG III', 'EISI', 4, 1, 'Regulamentar'),
(32, 'Sistemas Operativos I', 'SO I', 'EISI', 4, 1, 'Regulamentar'),
(33, 'Análise de Sistemas de Informação', 'ASI', 'EISI', 4, 2, 'Regulamentar'),
(34, 'Computação Gráfica', 'CG', 'EISI', 4, 2, 'Regulamentar'),
(35, 'Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', 'EISI', 4, 2, 'Regulamentar'),
(36, 'Redes de Computadores', 'RC', 'EISI', 4, 2, 'Regulamentar'),
(37, 'Sistemas Operativos II', 'SO II', 'EISI', 4, 2, 'Regulamentar'),
(38, 'Auditoria Informática', 'AI', 'EISI', 5, 1, 'Regulamentar'),
(39, 'Computação Paralela e Distribuída', 'CPD', 'EISI', 5, 1, 'Regulamentar'),
(40, 'Diagnóstico e Intervenção nas Organizações', 'DIO', 'EISI', 5, 1, 'Regulamentar'),
(41, 'Engenharia de Software', 'ES', 'EISI', 5, 1, 'Regulamentar'),
(42, 'Estágio', 'EST', 'EISI', 5, 2, 'Regulamentar'),
(43, 'Metodologia de Desenvolvimento de Sistemas de Informação', 'MDSI', 'EISI', 5, 1, 'Regulamentar'),
(44, 'Qualidade de Sistemas de Informação', 'QSI', 'EISI', 5, 2, 'Regulamentar'),
(45, 'Segurança Informática em Redes e Sistemas', 'SIRS', 'EISI', 5, 1, 'Regulamentar'),
(46, 'Tecnologias Multimédia', 'TM', 'EISI', 5, 2, 'Regulamentar'),
(47, 'Trabalho de Conclusão do Curso', 'TCC', 'EISI', 5, 2, 'Regulamentar');

INSERT INTO professores (id, nome, departamento, foto_perfil) VALUES
(1, 'Professor Rouget', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/rouget.svg'),
(2, 'Professor Tawana', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_18.svg'),
(3, 'Wilson Paiva', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_21.svg'),
(4, 'Professor Doutor Yoelkis Victor', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/yoelkis-victor.svg'),
(5, 'Prof. Edilson Cruz', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/edilson-cruz.svg'),
(6, 'Professor Maximo', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_13.svg'),
(7, 'Professor Paulo Vieira', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_14.svg'),
(8, 'Professor Sanchez', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_15.svg'),
(9, 'Professor Afonso', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_16.svg'),
(10, 'Professor Conde', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/prof_conde.svg'),
(11, 'Prof. Augusto Antunes', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/augusto-antunes.svg');

INSERT INTO professor_disciplinas (professor_id, disciplina_id) VALUES
(1, 31),
(2, 7), (2, 8),
(3, 20), (3, 30),
(4, 33), (4, 35),
(5, 29), (5, 32),
(6, 2), (6, 4), (6, 12),
(7, 1), (7, 3), (7, 10), (7, 18),
(8, 13), (8, 21), (8, 26), (8, 27),
(9, 15), (9, 16), (9, 22),
(10, 25),
(11, 34);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo, professor_id) VALUES
(220429, 'Joaquim Herculano Joao', 'joaquim.herculano.joao@avaliadocente.local', '9465105', NULL, 'EISI', 4, '1234', 'aluno', NULL),
(220430, 'Liliana Guilherme', 'liliana.guilherme@avaliadocente.local', '9465106', NULL, 'EISI', 4, '1234', 'aluno', NULL),
(220431, 'Edmilson Alexandre', 'edmilson.alexandre@avaliadocente.local', '9465107', NULL, 'EISI', 2, '1234', 'aluno', NULL),
(220432, 'Caridade Herculano', 'caridade.herculano@avaliadocente.local', '9465108', NULL, 'EISI', 3, '1234', 'aluno', NULL),
(990001, 'Professor Rouget', 'rouget@avaliadocente.local', '000000000', '../assets/images/professores/rouget.svg', 'EISI', 0, '12345', 'professor', 1),
(990002, 'Professor Tawana', 'tawana@avaliadocente.local', '000000000', '../assets/images/professores/prof_18.svg', 'EISI', 0, '12345', 'professor', 2),
(990003, 'Wilson Paiva', 'wilson@avaliadocente.local', '000000000', '../assets/images/professores/prof_21.svg', 'EISI', 0, '12345', 'professor', 3),
(990004, 'Professor Doutor Yoelkis Victor', 'doutoryoelkisvictor@avaliadocente.local', '000000000', '../assets/images/professores/yoelkis-victor.svg', 'EISI', 0, '12345', 'professor', 4),
(990005, 'Prof. Edilson Cruz', 'edilsoncruz@avaliadocente.local', '000000000', '../assets/images/professores/edilson-cruz.svg', 'EISI', 0, '12345', 'professor', 5),
(990006, 'Professor Maximo', 'maximo@avaliadocente.local', '000000000', '../assets/images/professores/prof_13.svg', 'EISI', 0, '12345', 'professor', 6),
(990007, 'Professor Paulo Vieira', 'paulovieira@avaliadocente.local', '000000000', '../assets/images/professores/prof_14.svg', 'EISI', 0, '12345', 'professor', 7),
(990008, 'Professor Sanchez', 'sanchez@avaliadocente.local', '000000000', '../assets/images/professores/prof_15.svg', 'EISI', 0, '12345', 'professor', 8),
(990009, 'Professor Afonso', 'afonso@avaliadocente.local', '000000000', '../assets/images/professores/prof_16.svg', 'EISI', 0, '12345', 'professor', 9),
(990010, 'Professor Conde', 'conde@avaliadocente.local', '000000000', '../assets/images/professores/prof_conde.svg', 'EISI', 0, '12345', 'professor', 10);

INSERT INTO matriculas (usuario_id, disciplina_id, calendario_id) VALUES
(220429, 33, 2), (220429, 34, 2), (220429, 35, 2), (220429, 36, 2), (220429, 37, 2),
(220430, 33, 2), (220430, 34, 2), (220430, 35, 2), (220430, 36, 2), (220430, 37, 2),
(220431, 10, 2), (220431, 13, 2), (220431, 16, 2), (220431, 17, 2),
(220432, 23, 2), (220432, 25, 2), (220432, 27, 2);