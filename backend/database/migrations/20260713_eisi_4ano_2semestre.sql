-- Atualiza uma base de dados já existente sem remover avaliações.
-- Executar uma única vez na base avaliadocente.
START TRANSACTION;

SET @curso_eisi := (SELECT id FROM cursos WHERE sigla = 'EISI' LIMIT 1);

-- Mantém a disciplina existente e atualiza a designação para ASI II.
UPDATE disciplinas
SET nome = 'Análise de Sistemas II', sigla = 'ASI II'
WHERE curso_id = @curso_eisi
  AND ano_academico = 4
  AND semestre = 2
  AND (nome = 'Análise de Sistemas de Informação' OR sigla = 'ASI');

-- Garante as cinco cadeiras curriculares do 4.º ano, 2.º semestre.
INSERT INTO disciplinas (nome, sigla, curso_id, ano_academico, semestre, status)
SELECT 'Análise de Sistemas II', 'ASI II', @curso_eisi, 4, 2, 'Regulamentar'
WHERE @curso_eisi IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM disciplinas WHERE curso_id = @curso_eisi AND ano_academico = 4 AND semestre = 2 AND sigla = 'ASI II');

INSERT INTO disciplinas (nome, sigla, curso_id, ano_academico, semestre, status)
SELECT 'Computação Gráfica', 'CG', @curso_eisi, 4, 2, 'Regulamentar'
WHERE @curso_eisi IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM disciplinas WHERE curso_id = @curso_eisi AND ano_academico = 4 AND semestre = 2 AND sigla = 'CG');

INSERT INTO disciplinas (nome, sigla, curso_id, ano_academico, semestre, status)
SELECT 'Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', @curso_eisi, 4, 2, 'Regulamentar'
WHERE @curso_eisi IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM disciplinas WHERE curso_id = @curso_eisi AND ano_academico = 4 AND semestre = 2 AND sigla = 'PROG IV');

INSERT INTO disciplinas (nome, sigla, curso_id, ano_academico, semestre, status)
SELECT 'Redes de Computadores', 'RC', @curso_eisi, 4, 2, 'Regulamentar'
WHERE @curso_eisi IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM disciplinas WHERE curso_id = @curso_eisi AND ano_academico = 4 AND semestre = 2 AND sigla = 'RC');

INSERT INTO disciplinas (nome, sigla, curso_id, ano_academico, semestre, status)
SELECT 'Sistemas Operativos II', 'SO II', @curso_eisi, 4, 2, 'Regulamentar'
WHERE @curso_eisi IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM disciplinas WHERE curso_id = @curso_eisi AND ano_academico = 4 AND semestre = 2 AND sigla = 'SO II');

INSERT INTO professores (nome, departamento, foto_perfil)
SELECT 'Prof. Edilson Cruz', 'Engenharia de Computação', '../assets/images/professores/edilson-cruz.svg'
WHERE NOT EXISTS (SELECT 1 FROM professores WHERE nome = 'Prof. Edilson Cruz');

-- Associa um professor a cada cadeira.
INSERT IGNORE INTO professor_disciplinas (professor_id, disciplina_id)
SELECT p.id, d.id
FROM professores p
INNER JOIN disciplinas d ON d.curso_id = @curso_eisi AND d.ano_academico = 4 AND d.semestre = 2
WHERE (p.nome = 'Professor Doutor Yoelkis Victor' AND d.sigla IN ('ASI II', 'PROG IV'))
   OR (p.nome = 'Wilson Paiva' AND d.sigla = 'CG')
   OR (p.nome = 'Prof. Miguel Telecom' AND d.sigla = 'RC')
   OR (p.nome = 'Prof. Edilson Cruz' AND d.sigla = 'SO II');

-- Matricula todos os estudantes EISI do 4.º ano nas cinco cadeiras do 2.º semestre ativo.
INSERT IGNORE INTO matriculas (usuario_id, disciplina_id, calendario_id)
SELECT u.id, d.id, cs.id
FROM usuarios u
INNER JOIN cursos c ON c.id = u.curso_id AND c.sigla = 'EISI'
INNER JOIN disciplinas d ON d.curso_id = c.id AND d.ano_academico = 4 AND d.semestre = 2
INNER JOIN calendario_semestres cs ON cs.semestre = 2 AND cs.ativo = TRUE
WHERE u.tipo = 'aluno' AND u.ano_academico = 4;

COMMIT;
