<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $curso = trim((string)($_GET['curso'] ?? ''));
    $ano = trim((string)($_GET['ano'] ?? ''));
    $semestre = trim((string)($_GET['semestre'] ?? ''));
    $disciplina = trim((string)($_GET['disciplina'] ?? ''));
    $disciplina_id = trim((string)($_GET['disciplina_id'] ?? ''));
    $alunoId = (int)($_GET['aluno_id'] ?? 0);

    $sql = 'SELECT p.id, p.nome, p.departamento, p.foto_perfil, p.created_at,
                d.id AS disciplina_id,
                d.nome AS disciplina_nome, d.sigla, d.ano_academico, d.semestre, d.status,
                c.id AS curso_id, c.nome AS curso, c.nome AS curso_nome,
                COUNT(a.id) AS total_avaliacoes,
                ROUND(AVG((
                    COALESCE(a.metodologia, 0) +
                    COALESCE(a.didatica, 0) +
                    COALESCE(a.assiduidade, 0)
                ) / 3), 1) AS media_avaliacoes
         FROM professores p
         LEFT JOIN professor_disciplinas pd ON pd.professor_id = p.id
         LEFT JOIN disciplinas d ON d.id = pd.disciplina_id
         LEFT JOIN cursos c ON c.id = d.curso_id
         LEFT JOIN avaliacoes a ON a.professor_id = p.id AND a.disciplina_id = d.id';
    $params = [];
    $filters = [];

    if ($curso !== '') {
        $filters[] = '(c.nome = :curso_nome OR c.sigla = :curso_sigla)';
        $params[':curso_nome'] = $curso;
        $params[':curso_sigla'] = $curso;
    }

    if ($disciplina_id !== '') {
        $filters[] = 'd.id = :disciplina_id';
        $params[':disciplina_id'] = (int) $disciplina_id;
    }

    if ($disciplina !== '') {
        $filters[] = 'd.nome LIKE :disciplina';
        $params[':disciplina'] = '%' . $disciplina . '%';
    }

    // Only apply `ano` filter when no aluno_id is provided. When an
    // aluno_id is present we will restrict by the student's matriculas
    // instead (see aluno_id handling below).
    if ($ano !== '' && $alunoId === 0) {
        preg_match('/\d+/', $ano, $anoMatches);
        if (!empty($anoMatches[0])) {
            $params[':ano'] = (int)$anoMatches[0];
            $filters[] = 'd.ano_academico = :ano';
        }
    }

    // Only apply `semestre` filter when no aluno_id is provided.
    if ($semestre !== '' && $alunoId === 0) {
        preg_match('/\d+/', $semestre, $semestreMatches);
        if (!empty($semestreMatches[0])) {
            $params[':semestre'] = (int)$semestreMatches[0];
            $filters[] = 'd.semestre = :semestre';
        }
    }

    // If an aluno_id is provided, restrict results to the disciplines
    // that this student is enrolled in. This makes the frontend call
    // `?aluno_id=...` return only professors for the student's own
    // matriculated disciplines (avoids relying solely on ano/semestre).
    if ($alunoId > 0) {
        $filters[] = 'd.id IN (SELECT disciplina_id FROM matriculas WHERE usuario_id = :aluno_id)';
        $params[':aluno_id'] = $alunoId;
    }

    if ($filters) {
        $sql .= ' WHERE ' . implode(' AND ', $filters);
    }

    $sql .= ' GROUP BY p.id, p.nome, p.departamento, p.foto_perfil, p.created_at,
                    d.id,
                    d.nome, d.sigla, d.ano_academico, d.semestre, d.status,
                    c.id, c.nome
              ORDER BY d.ano_academico ASC, d.semestre ASC, d.nome ASC, p.nome ASC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    json_response([
        'success' => true,
        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'message' => 'Nao foi possivel carregar os professores.'
    ], 500);
}
