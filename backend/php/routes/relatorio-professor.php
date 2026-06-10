<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $professorId = isset($_GET['professor_id']) ? (int)$_GET['professor_id'] : 0;

    if ($professorId <= 0) {
        json_response([
            'success' => false,
            'message' => 'professor_id ausente'
        ], 400);
    }

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
    $exprMetodologia = $resolveMetricExpr($columns, ['metodologia']);
    $exprDidatica = $resolveMetricExpr($columns, ['didatica']);
    $exprAssiduidade = $resolveMetricExpr($columns, ['assiduidade']);

    $profStmt = $db->prepare('SELECT nome FROM professores WHERE id = :id LIMIT 1');
    $profStmt->execute([':id' => $professorId]);
    $profRow = $profStmt->fetch(PDO::FETCH_ASSOC);

    if (!$profRow) {
        $userStmt = $db->prepare("SELECT nome FROM usuarios WHERE id = :id AND tipo = 'professor' LIMIT 1");
        $userStmt->execute([':id' => $professorId]);
        $profRow = $userStmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$profRow) {
        json_response([
            'success' => false,
            'message' => 'Professor nao encontrado'
        ], 404);
    }

    $where = 'WHERE p.id = :professor_id';
    $params = [':professor_id' => $professorId];

    $sql = "
        SELECT
            COUNT(*) AS total_avaliacoes,
            ROUND(AVG({$exprClareza}), 1) AS media_clareza,
            ROUND(AVG({$exprDinamismo}), 1) AS media_dinamismo,
            ROUND(AVG({$exprRecursos}), 1) AS media_recursos,
            ROUND(AVG({$exprCriterios}), 1) AS media_criterios,
            ROUND(AVG({$exprRetorno}), 1) AS media_retorno,
            ROUND(AVG({$exprDisponibilidade}), 1) AS media_disponibilidade,
            ROUND(AVG({$exprRespeito}), 1) AS media_respeito,
            ROUND(AVG({$exprPontualidade}), 1) AS media_pontualidade,
            ROUND(AVG({$exprMetodologia}), 1) AS media_metodologia,
            ROUND(AVG({$exprDidatica}), 1) AS media_didatica,
            ROUND(AVG({$exprAssiduidade}), 1) AS media_assiduidade
        FROM avaliacoes a
        INNER JOIN professores p ON p.id = a.professor_id
        {$where}
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

    $commentsSql = "
        SELECT a.comentario
        FROM avaliacoes a
        INNER JOIN professores p ON p.id = a.professor_id
        INNER JOIN usuarios u ON u.id = a.aluno_id
        {$where}
          AND a.comentario IS NOT NULL
          AND TRIM(a.comentario) <> ''
          AND u.tipo = 'aluno'
        ORDER BY a.created_at DESC
        LIMIT 6
    ";
    $commentsStmt = $db->prepare($commentsSql);
    $commentsStmt->execute($params);
    $comments = $commentsStmt->fetchAll(PDO::FETCH_ASSOC);

    $total = (int)($summary['total_avaliacoes'] ?? 0);

    $metricSources = [
        'clareza' => ['clareza', 'metodologia'],
        'dinamismo' => ['dinamismo', 'metodologia'],
        'recursos' => ['recursos', 'metodologia'],
        'criterios' => ['criterios_avaliacao', 'didatica'],
        'retorno' => ['retorno', 'didatica'],
        'disponibilidade' => ['disponibilidade', 'assiduidade'],
        'respeito' => ['respeito', 'assiduidade'],
        'pontualidade' => ['pontualidade', 'assiduidade'],
        'metodologia' => ['metodologia'],
        'didatica' => ['didatica'],
        'assiduidade' => ['assiduidade']
    ];


    $medias = [];
    foreach ($metricSources as $metricKey => $preferredCols) {
        $hasAnySource = false;
        foreach ($preferredCols as $sourceColumn) {
            if (isset($columns[$sourceColumn])) {
                $hasAnySource = true;
                break;
            }
        }
        $summaryKey = 'media_' . ($metricKey === 'criterios' ? 'criterios' : $metricKey);

        if ($total === 0) {
            $medias[$metricKey] = null;
        } else {
            $value = isset($summary[$summaryKey]) ? (float)$summary[$summaryKey] : null;
            $medias[$metricKey] = $hasAnySource ? $value : null;
        }
    }

    json_response([
        'success' => true,
        'data' => [
            'total_avaliacoes' => $total,
            'medias' => $medias,
            'comentarios' => $comments
        ]
    ]);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'message' => 'Nao foi possivel carregar o relatorio.'
    ], 500);
}
