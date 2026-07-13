<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $professorId = isset($_GET['professor_id']) ? (int)$_GET['professor_id'] : 0;

    if ($professorId <= 0) {
        json_response(['success' => false, 'message' => 'professor_id ausente'], 400);
    }

    $pstmt = $db->prepare('SELECT nome FROM professores WHERE id = :id LIMIT 1');
    $pstmt->execute([':id' => $professorId]);
    $profRow = $pstmt->fetch(PDO::FETCH_ASSOC);

    if (!$profRow) {
        $ustmt = $db->prepare("SELECT nome FROM usuarios WHERE id = :id AND tipo = 'professor' LIMIT 1");
        $ustmt->execute([':id' => $professorId]);
        $profRow = $ustmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$profRow) {
        json_response(['success' => false, 'message' => 'Professor nao encontrado'], 404);
    }
    $profName = $profRow['nome'];

    $columns = [];
    $columnsStmt = $db->query('SHOW COLUMNS FROM avaliacoes');
    foreach ($columnsStmt->fetchAll(PDO::FETCH_ASSOC) as $column) {
        $columns[$column['Field']] = true;
    }

    $resolveMetricExpr = static function (array $availableColumns, array $preferred) {
        $parts = [];
        foreach ($preferred as $column) {
            if (isset($availableColumns[$column])) {
                $parts[] = 'a.' . $column;
            }
        }

        return $parts ? 'COALESCE(' . implode(', ', $parts) . ', 0)' : '0';
    };

    $exprClareza = $resolveMetricExpr($columns, ['clareza', 'metodologia']);
    $exprDinamismo = $resolveMetricExpr($columns, ['dinamismo', 'metodologia']);
    $exprRecursos = $resolveMetricExpr($columns, ['recursos', 'metodologia']);
    $exprCriterios = $resolveMetricExpr($columns, ['criterios_avaliacao', 'didatica']);
    $exprRetorno = $resolveMetricExpr($columns, ['retorno', 'didatica']);
    $exprDisponibilidade = $resolveMetricExpr($columns, ['disponibilidade', 'assiduidade']);
    $exprRespeito = $resolveMetricExpr($columns, ['respeito', 'assiduidade']);
    $exprPontualidade = $resolveMetricExpr($columns, ['pontualidade', 'assiduidade']);

    $sql = "
        SELECT
            p.id AS professor_row_id,
            d.id AS disciplina_id,
            d.nome AS disciplina_nome,
            COUNT(a.id) AS total_avaliacoes,
            ROUND(AVG({$exprClareza}), 1) AS media_clareza,
            ROUND(AVG({$exprDinamismo}), 1) AS media_dinamismo,
            ROUND(AVG({$exprRecursos}), 1) AS media_recursos,
            ROUND(AVG({$exprCriterios}), 1) AS media_criterios,
            ROUND(AVG({$exprRetorno}), 1) AS media_retorno,
            ROUND(AVG({$exprDisponibilidade}), 1) AS media_disponibilidade,
            ROUND(AVG({$exprRespeito}), 1) AS media_respeito,
            ROUND(AVG({$exprPontualidade}), 1) AS media_pontualidade
        FROM professores p
        LEFT JOIN professor_disciplinas pd ON pd.professor_id = p.id
        LEFT JOIN disciplinas d ON d.id = pd.disciplina_id
        LEFT JOIN avaliacoes a ON a.professor_id = p.id AND a.disciplina_id = d.id
        WHERE p.id = :professor_id
        GROUP BY p.id, d.id, d.nome
        ORDER BY d.nome ASC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([':professor_id' => $professorId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($rows as $r) {
        $total = (int)($r['total_avaliacoes'] ?? 0);

        $medias = [
            'clareza' => $total === 0 ? 0.0 : (float)($r['media_clareza'] ?? 0.0),
            'dinamismo' => $total === 0 ? 0.0 : (float)($r['media_dinamismo'] ?? 0.0),
            'recursos' => $total === 0 ? 0.0 : (float)($r['media_recursos'] ?? 0.0),
            'criterios' => $total === 0 ? 0.0 : (float)($r['media_criterios'] ?? 0.0),
            'retorno' => $total === 0 ? 0.0 : (float)($r['media_retorno'] ?? 0.0),
            'disponibilidade' => $total === 0 ? 0.0 : (float)($r['media_disponibilidade'] ?? 0.0),
            'respeito' => $total === 0 ? 0.0 : (float)($r['media_respeito'] ?? 0.0),
            'pontualidade' => $total === 0 ? 0.0 : (float)($r['media_pontualidade'] ?? 0.0),
        ];

        $commentsStmt = $db->prepare("\n            SELECT a.comentario, a.created_at\n            FROM avaliacoes a\n            INNER JOIN usuarios u ON u.id = a.aluno_id\n            WHERE a.professor_id = :professor_id\n              AND a.disciplina_id = :disciplina_id\n              AND a.comentario IS NOT NULL\n              AND TRIM(a.comentario) <> ''\n              AND u.tipo = 'aluno'\n            ORDER BY a.created_at DESC\n            LIMIT 6\n        ");
        $commentsStmt->execute([
            ':professor_id' => (int)$r['professor_row_id'],
            ':disciplina_id' => (int)$r['disciplina_id']
        ]);
        $comentarios = $commentsStmt->fetchAll(PDO::FETCH_ASSOC);

        $result[] = [
            'professor_row_id' => (int)$r['professor_row_id'],
            'disciplina_id' => $r['disciplina_id'] !== null ? (int)$r['disciplina_id'] : null,
            'disciplina_nome' => $r['disciplina_nome'] ?? 'Sem disciplina',
            'professor_nome' => $profName,
            'total_avaliacoes' => $total,
            'comentarios' => $comentarios,
            'medias' => $medias
        ];
    }

    json_response(['success' => true, 'data' => $result]);

} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Nao foi possivel carregar o relatorio por disciplinas.'], 500);
}
