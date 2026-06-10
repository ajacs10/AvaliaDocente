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

    $sql = 'SELECT p.id, p.nome, p.departamento, p.foto_perfil, p.created_at,
                d.id AS disciplina_id,
                d.nome AS disciplina_nome, d.sigla, d.ano_academico, d.semestre, d.status, d.curso,
                COUNT(a.id) AS total_avaliacoes,
                ROUND(AVG((
                    COALESCE(a.metodologia, 0) +
                    COALESCE(a.didatica, 0) +
                    COALESCE(a.assiduidade, 0)
                ) / 3), 1) AS media_avaliacoes
         FROM professores p
         LEFT JOIN professor_disciplinas pd ON pd.professor_id = p.id
         LEFT JOIN disciplinas d ON d.id = COALESCE(pd.disciplina_id, p.disciplina_id)
         LEFT JOIN avaliacoes a ON a.professor_id = p.id AND a.disciplina_id = d.id';
    $params = [];
    $filters = [];

    if ($curso !== '') {
        $filters[] = 'd.curso = :curso';
        $params[':curso'] = $curso;
    }

    if ($disciplina_id !== '') {
        $filters[] = 'd.id = :disciplina_id';
        $params[':disciplina_id'] = (int) $disciplina_id;
    }

    if ($disciplina !== '') {
        $filters[] = 'd.nome LIKE :disciplina';
        $params[':disciplina'] = '%' . $disciplina . '%';
    }

    if ($ano !== '') {
        preg_match('/\d+/', $ano, $anoMatches);
        if (!empty($anoMatches[0])) {
            $studentYear = (int)$anoMatches[0];
            if ($studentYear < 5) {
                $allowedYears = [];
                for ($year = 1; $year <= $studentYear; $year++) {
                    $allowedYears[] = sprintf('%d.º Ano', $year);
                }

                $yearClauses = [];
                foreach ($allowedYears as $index => $yearLabel) {
                    $placeholder = ':ano_' . $index;
                    $yearClauses[] = 'd.ano_academico = ' . $placeholder;
                    $params[$placeholder] = $yearLabel;
                }

                if ($yearClauses) {
                    $filters[] = '(' . implode(' OR ', $yearClauses) . ')';
                }
            }
        } else {
            $filters[] = 'd.ano_academico = :ano';
            $params[':ano'] = $ano;
        }
    }

    if ($semestre !== '') {
        preg_match('/\d+/', $semestre, $semestreMatches);
        if (!empty($semestreMatches[0])) {
            $filters[] = 'd.semestre LIKE :semestre';
            $params[':semestre'] = '%' . $semestreMatches[0] . '%';
        } else {
            $filters[] = 'd.semestre = :semestre';
            $params[':semestre'] = $semestre;
        }
    }

    if ($filters) {
        $sql .= ' WHERE ' . implode(' AND ', $filters);
    }

    $sql .= ' GROUP BY p.id, p.nome, p.departamento, p.foto_perfil, p.created_at,
                    d.id,
                    d.nome, d.sigla, d.ano_academico, d.semestre, d.status, d.curso
              ORDER BY d.ano_academico ASC, d.semestre ASC, p.nome ASC';
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
