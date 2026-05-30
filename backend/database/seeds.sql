SET @curso_eisi = 'EISI';
SET @ano_quarto = '4.º Ano';
SET @semestre_primeiro = '1.º Semestre';
SET @semestre_atual = '2.º Semestre';
SET @departamento_eisi = 'Engenharia de Informática e Sistemas de Informação';

-- Ensure the client connection uses utf8mb4 to avoid mojibake on import
SET NAMES utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

CREATE TEMPORARY TABLE seed_disciplinas_eisi (
    nome VARCHAR(160) NOT NULL,
    sigla VARCHAR(40),
    ano_academico VARCHAR(20) NOT NULL,
    semestre VARCHAR(30) NOT NULL,
    status VARCHAR(40) NOT NULL,
    curso VARCHAR(120) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO seed_disciplinas_eisi (nome, sigla, ano_academico, semestre, status, curso) VALUES
('Álgebra Linear', 'AL', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Análise Matemática I', 'AM I', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Análise Matemática II', 'AM II', '1.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Física I', 'FIS I', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Introdução aos Computadores e Programação', 'ICP', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Métodos de Investigação Científica', 'MIC', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Química Fundamental', 'QF', '1.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Química Orgânica', 'QO', '1.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Análise Matemática III', 'AM III', '2.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Análise Matemática IV', 'AM IV', '2.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Comunicação Pessoal e Empresarial', 'CPE', '2.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Física II', 'FIS II', '2.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Física III', 'FIS III', '2.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Introdução à Organização e à Gestão', 'IOG', '2.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Língua Inglesa I', 'ING I', '2.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Língua Inglesa II', 'ING II', '2.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Sistemas Digitais', 'SD', '2.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Análise Numérica Científica', 'ANC', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Arquitectura de Computadores I', 'AC I', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Base de Dados', 'BD', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Fundamentos de Sistemas de Informação', 'FSI', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Língua Inglesa III', 'ING III', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Língua Inglesa IV', 'ING IV', '3.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Mecânica I', 'MEC I', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Probabilidades e Estatística', 'PE', '3.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Programação I - Algoritmos e Estruturas de Dados', 'PROG I', '3.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Programação II', 'PROG II', '3.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Análise de Sistemas', 'AS', '4.º Ano', @semestre_primeiro, 'Regulamentar', @curso_eisi),
('Arquitectura de Computadores II', 'AC II', '4.º Ano', @semestre_primeiro, 'Regulamentar', @curso_eisi),
('Base de Dados II', 'BD II', '4.º Ano', @semestre_primeiro, 'Regulamentar', @curso_eisi),
('Programação III (IA)', 'PROG III', '4.º Ano', @semestre_primeiro, 'Regulamentar', @curso_eisi),
('Sistemas Operativos I', 'SO I', '4.º Ano', @semestre_primeiro, 'Regulamentar', @curso_eisi),
('Análise de Sistemas de Informação', 'ASI', '4.º Ano', @semestre_atual, 'Regulamentar', @curso_eisi),
('Computação Gráfica', 'CG', '4.º Ano', @semestre_atual, 'Regulamentar', @curso_eisi),
('Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', '4.º Ano', @semestre_atual, 'Regulamentar', @curso_eisi),
('Redes de Computadores', 'RC', '4.º Ano', @semestre_atual, 'Regulamentar', @curso_eisi),
('Sistemas Operativos II', 'SO II', '4.º Ano', @semestre_atual, 'Regulamentar', @curso_eisi),
('Auditoria Informática', 'AI', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Computação Paralela e Distribuída', 'CPD', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Diagnóstico e Intervenção nas Organizações', 'DIO', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Engenharia de Software', 'ES', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Estágio', 'EST', '5.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Metodologia de Desenvolvimento de Sistemas de Informação', 'MDSI', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Qualidade de Sistemas de Informação', 'QSI', '5.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Segurança Informática em Redes e Sistemas', 'SIRS', '5.º Ano', '1.º Semestre', 'Regulamentar', @curso_eisi),
('Tecnologias Multimédia', 'TM', '5.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi),
('Trabalho de Conclusão do Curso', 'TCC', '5.º Ano', '2.º Semestre', 'Regulamentar', @curso_eisi);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT s.nome, s.sigla, s.ano_academico, s.semestre, s.status, s.curso
FROM seed_disciplinas_eisi s
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas d
    WHERE d.nome = s.nome
      AND d.ano_academico = s.ano_academico
      AND d.semestre = s.semestre
      AND d.curso = s.curso
);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT 'Computação Gráfica', 'CG', @ano_quarto, @semestre_atual, 'Regulamentar', @curso_eisi
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas
    WHERE nome = 'Computação Gráfica' AND ano_academico = @ano_quarto AND semestre = @semestre_atual AND curso = @curso_eisi
);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT 'Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', @ano_quarto, @semestre_atual, 'Regulamentar', @curso_eisi
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas
    WHERE nome = 'Programação IV - Linguagens e Tecnologias WEB' AND ano_academico = @ano_quarto AND semestre = @semestre_atual AND curso = @curso_eisi
);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT 'Sistemas Operativos II', 'SO II', @ano_quarto, @semestre_atual, 'Regulamentar', @curso_eisi
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas
    WHERE nome = 'Sistemas Operativos II' AND ano_academico = @ano_quarto AND semestre = @semestre_atual AND curso = @curso_eisi
);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT 'Análise de Sistemas de Informação', 'ASI', @ano_quarto, @semestre_atual, 'Regulamentar', @curso_eisi
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas
    WHERE nome = 'Análise de Sistemas de Informação' AND ano_academico = @ano_quarto AND semestre = @semestre_atual AND curso = @curso_eisi
);

INSERT INTO disciplinas (nome, sigla, ano_academico, semestre, status, curso)
SELECT 'Redes de Computadores', 'RC', @ano_quarto, @semestre_atual, 'Regulamentar', @curso_eisi
WHERE NOT EXISTS (
    SELECT 1 FROM disciplinas
    WHERE nome = 'Redes de Computadores' AND ano_academico = @ano_quarto AND semestre = @semestre_atual AND curso = @curso_eisi
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Prof. Augusto Antunes', @departamento_eisi, '../assets/images/professores/augusto-antunes.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Computação Gráfica' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_atual AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Prof. Augusto Antunes' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Doutor Yoelkis Victor', @departamento_eisi, '../assets/images/professores/yoelkis-victor.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Programação IV - Linguagens e Tecnologias WEB' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_atual AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Doutor Yoelkis Victor' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Rouget', @departamento_eisi, '../assets/images/professores/rouget.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Programação III (IA)' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_primeiro AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Rouget' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Prof. Edilson Cruz', @departamento_eisi, '../assets/images/professores/edilson-cruz.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Arquitectura de Computadores II' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_primeiro AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Prof. Edilson Cruz' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Prof. Edilson Cruz', @departamento_eisi, '../assets/images/professores/edilson-cruz.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Sistemas Operativos I' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_primeiro AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Prof. Edilson Cruz' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Doutor Yoelkis Victor', @departamento_eisi, '../assets/images/professores/yoelkis-victor.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Análise de Sistemas de Informação' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_atual AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Doutor Yoelkis Victor' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Doutor Yoelkis Victor', @departamento_eisi, '../assets/images/professores/yoelkis-victor.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Programação IV - Linguagens e Tecnologias WEB' AND d.ano_academico = @ano_quarto AND d.semestre = @semestre_atual AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Doutor Yoelkis Victor' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Maximo', @departamento_eisi, '../assets/images/professores/prof_13.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Análise Matemática I' AND d.ano_academico = '1.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Maximo' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Maximo', @departamento_eisi, '../assets/images/professores/prof_13.svg', d.id
FROM disciplinas d
WHERE d.nome IN ('Física I', 'Física II') AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Maximo' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Paulo Vieira', @departamento_eisi, '../assets/images/professores/prof_14.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Análise Matemática II' AND d.ano_academico = '1.º Ano' AND d.semestre = '2.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Paulo Vieira' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Paulo Vieira', @departamento_eisi, '../assets/images/professores/prof_14.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Álgebra Linear' AND d.ano_academico = '1.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Paulo Vieira' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Sanchez', @departamento_eisi, '../assets/images/professores/prof_15.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Programação I - Algoritmos e Estruturas de Dados' AND d.ano_academico = '3.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Sanchez' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Sanchez', @departamento_eisi, '../assets/images/professores/prof_15.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Física III' AND d.ano_academico = '2.º Ano' AND d.semestre = '2.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Sanchez' AND p.disciplina_id = d.id
);


INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Afonso', @departamento_eisi, '../assets/images/professores/prof_16.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Língua Inglesa II' AND d.ano_academico = '2.º Ano' AND d.semestre = '2.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Afonso' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Afonso', @departamento_eisi, '../assets/images/professores/prof_16.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Língua Inglesa III' AND d.ano_academico = '3.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Afonso' AND p.disciplina_id = d.id
);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 990001, 'Professor Rouget', 'rouget@avaliadocente.local', '000000000', NULL, 'EISI', '2020', '12345', 'professor'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE id = 990001 OR email = 'rouget@avaliadocente.local'
);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 220429, 'Joaquim Herculano Joao', 'joaquim.herculano.joao@avaliadocente.local', '9465105', NULL, 'Engenharia de Informática e Sistemas de Informação', '4.º Ano', '1234', 'aluno'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE id = 220429 OR email = 'joaquim.herculano.joao@avaliadocente.local'
);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 220430, 'Liliana Guilherme', 'liliana.guilherme@avaliadocente.local', '9465106', NULL, 'Engenharia de Informática e Sistemas de Informação', '4.º Ano', '1234', 'aluno'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE id = 220430 OR email = 'liliana.guilherme@avaliadocente.local'
);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 220431, 'Edmilson Alexandre', 'edmilson.alexandre@avaliadocente.local', '9465107', NULL, 'Engenharia de Informática e Sistemas de Informação', '2.º Ano', '1234', 'aluno'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE id = 220431 OR email = 'edmilson.alexandre@avaliadocente.local'
);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 220432, 'Caridade Herculano', 'caridade.herculano@avaliadocente.local', '9465108', NULL, 'Engenharia de Informática e Sistemas de Informação', '3.º Ano', '1234', 'aluno'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE id = 220432 OR email = 'caridade.herculano@avaliadocente.local'
);

UPDATE usuarios u
JOIN professores p ON p.nome = 'Professor Rouget'
JOIN disciplinas d ON d.id = p.disciplina_id
SET u.professor_id = p.id,
    u.foto_perfil = '../assets/images/professores/rouget.svg'
WHERE u.id = 990001
  AND d.nome = 'Programação III (IA)'
  AND d.ano_academico = @ano_quarto
  AND d.semestre = @semestre_primeiro
  AND d.curso = @curso_eisi;

-- Additional professor seeds to reflect manual mappings and provide reproducibility
-- Photo paths are NULL where no image exists; frontend uses initials as fallback.
INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Paulo Vieira', @departamento_eisi, '../assets/images/professores/prof_14.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Análise Numérica Científica' AND d.ano_academico = '3.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Paulo Vieira' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Sanchez', @departamento_eisi, '../assets/images/professores/prof_15.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Fundamentos de Sistemas de Informação' AND d.ano_academico = '3.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Sanchez' AND p.disciplina_id = d.id
);

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Afonso', @departamento_eisi, '../assets/images/professores/prof_16.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Língua Inglesa I' AND d.ano_academico = '2.º Ano' AND d.semestre = '1.º Semestre' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Afonso' AND p.disciplina_id = d.id
);

-- Professors created for chemistry and databases (no images available in repo)
INSERT INTO usuarios (nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 'Professor Tawana','tawana@avaliadocente.local','000000000',NULL,'EISI','2020','12345','professor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='tawana@avaliadocente.local');

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Tawana', @departamento_eisi, '../assets/images/professores/prof_18.svg', d.id
FROM disciplinas d
WHERE d.nome IN ('Química Fundamental','Química Orgânica') AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Tawana' AND p.disciplina_id = d.id
);

INSERT INTO usuarios (nome, email, telefone, foto_perfil, curso, ano_academico, senha, tipo)
SELECT 'Wilson Paiva','wilson@avaliadocente.local','000000000',NULL,'EISI','2020','12345','professor'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='wilson@avaliadocente.local');

INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Wilson Paiva', @departamento_eisi, '../assets/images/professores/prof_21.svg', d.id
FROM disciplinas d
WHERE d.nome IN ('Base de Dados','Base de Dados II') AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Wilson Paiva' AND p.disciplina_id = d.id
);

-- Add Professor Conde for Probabilidades e Estatística
INSERT INTO professores (nome, departamento, foto_perfil, disciplina_id)
SELECT 'Professor Conde', @departamento_eisi, '../assets/images/professores/prof_conde.svg', d.id
FROM disciplinas d
WHERE d.nome = 'Probabilidades e Estatística' AND d.curso = @curso_eisi
AND NOT EXISTS (
    SELECT 1 FROM professores p WHERE p.nome = 'Professor Conde' AND p.disciplina_id = d.id
);
