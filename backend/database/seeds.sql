-- Dados iniciais. A estrutura das tabelas é definida exclusivamente em schema.sql.
SET NAMES utf8mb4;

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
(33, 'Análise de Sistemas II', 'ASI II', 1, 4, 2, 'Regulamentar'),
(34, 'Computação Gráfica', 'CG', 1, 4, 2, 'Regulamentar'),
(35, 'Programação IV - Linguagens e Tecnologias WEB', 'PROG IV', 1, 4, 2, 'Regulamentar'),
(36, 'Redes de Computadores', 'RC', 1, 4, 2, 'Regulamentar'),
(37, 'Sistemas Operativos II', 'SO II', 1, 4, 2, 'Regulamentar'),
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
(3, 'Wilson Paiva', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/placeholder.svg'),
(4, 'Professor Doutor Yoelkis Victor', 'Engenharia de Informática e Sistemas de Informação', '../assets/images/professores/yoelkis-victor.svg'),
(5, 'Prof. Edilson Cruz', 'Engenharia de Computação', '../assets/images/professores/placeholder.svg'),
(6, 'Professor Maximo', 'Ciências Exatas', '../assets/images/professores/placeholder.svg'),
(7, 'Professor Paulo Vieira', 'Matemática e Informática', '../assets/images/professores/placeholder.svg'),
(8, 'Professor Sanchez', 'Sistemas de Informação', '../assets/images/professores/placeholder.svg'),
(9, 'Professor Afonso', 'Línguas Estrangeiras', '../assets/images/professores/placeholder.svg'),
(10, 'Professor Conde', 'Matemática e Estatística', '../assets/images/professores/placeholder.svg'),
(12, 'Dra. Maria Santos', 'Direito', '../assets/images/professores/prof_direito.svg'),
(13, 'Prof. João Criminalista', 'Ciências Criminais', '../assets/images/professores/prof_cc.svg'),
(14, 'Prof. Helena Turismo', 'Hotelaria & Turismo', '../assets/images/professores/prof_ht.svg'),
(15, 'Prof. Carlos Logistica', 'Logística e Gestão Comercial', '../assets/images/professores/prof_lgc.svg'),
(16, 'Prof. Ana Recursos', 'Gestão de Recursos Humanos', '../assets/images/professores/prof_grh.svg'),
(17, 'Prof. Pedro Contabilidade', 'Contabilidade & Finanças', '../assets/images/professores/prof_cf.svg'),
(18, 'Prof. Miguel Telecom', 'Redes e Telecomunicações', '../assets/images/professores/prof_rt.svg');

INSERT INTO professor_disciplinas (professor_id, disciplina_id) VALUES
(1, 31), (2, 5), (4, 33), (4, 35), (3, 34), (18, 36), (5, 37),
(12, 48), (13, 49), (14, 50), (15, 51),
(16, 52), (17, 53), (18, 54);

INSERT INTO calendario_semestres (id, ano_letivo_id, semestre, data_inicio, data_fim, ativo) VALUES
(1, 1, 1, '2025-08-25', '2026-02-21', FALSE),
(2, 2, 2, '2026-02-23', '2026-07-26', TRUE);

INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso_id, ano_academico, senha, tipo, professor_id) VALUES
(220429, 'Joaquim Herculano Joao', 'joaquim.herculano.joao@avaliadocente.local', '9465105', NULL, 1, 4, '$2y$10$ZuvZZdsAcLYWxwhrS3yMd.mbdNUyBdHo7/EDL.uJl7VKaKOztIbmq', 'aluno', NULL),
(220430, 'Liliana Guilherme', 'liliana.guilherme@avaliadocente.local', '9465106', NULL, 1, 4, '$2y$10$ZuvZZdsAcLYWxwhrS3yMd.mbdNUyBdHo7/EDL.uJl7VKaKOztIbmq', 'aluno', NULL),
(220431, 'Edmilson Alexandre', 'edmilson.alexandre@avaliadocente.local', '9465107', NULL, 1, 2, '$2y$10$ZuvZZdsAcLYWxwhrS3yMd.mbdNUyBdHo7/EDL.uJl7VKaKOztIbmq', 'aluno', NULL),
(220432, 'Caridade Herculano', 'caridade.herculano@avaliadocente.local', '9465108', NULL, 1, 3, '$2y$10$ZuvZZdsAcLYWxwhrS3yMd.mbdNUyBdHo7/EDL.uJl7VKaKOztIbmq', 'aluno', NULL),
(990001, 'Professor Rouget', 'rouget@avaliadocente.local', NULL, '../assets/images/professores/rouget.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 1),
(990002, 'Professor Tawana', 'tawana@avaliadocente.local', NULL, '../assets/images/professores/prof_18.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 2),
(990003, 'Wilson Paiva', 'wilsonpaiva@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 3),
(990004, 'Professor Doutor Yoelkis Victor', 'doutoryoelkisvictor@avaliadocente.local', NULL, '../assets/images/professores/yoelkis-victor.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 4),
(990005, 'Prof. Edilson Cruz', 'edilsoncruz@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 5),
(990006, 'Professor Maximo', 'maximo@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 6),
(990007, 'Professor Paulo Vieira', 'paulovieira@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 7),
(990008, 'Professor Sanchez', 'sanchez@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 8),
(990009, 'Professor Afonso', 'afonso@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 9),
(990010, 'Professor Conde', 'conde@avaliadocente.local', NULL, '../assets/images/professores/placeholder.svg', 1, 0, '$2y$10$tTP71SuaXf3iEuTjgvbCcOyuFqU0vZNoV2tKkkV.5T28XiYGe16iK', 'professor', 10);

-- Coordenador (pode ver métricas agregadas mas não identifica avaliadores)
INSERT INTO usuarios (id, nome, email, telefone, foto_perfil, curso_id, ano_academico, senha, tipo, professor_id) VALUES
(900000, 'Coordenador Local', 'coordenador@avaliadocente.local', '900000001', NULL, 1, 0, 'coord123', 'admin', NULL);

INSERT INTO matriculas (usuario_id, disciplina_id, calendario_id) VALUES
(220429, 33, 2), (220429, 34, 2), (220429, 35, 2), (220429, 36, 2), (220429, 37, 2),
(220430, 33, 2), (220430, 34, 2), (220430, 35, 2), (220430, 36, 2), (220430, 37, 2);
