<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    $availableColumns = [];
    $columnsStmt = $db->query('SHOW COLUMNS FROM avaliacoes');
    foreach ($columnsStmt->fetchAll(PDO::FETCH_ASSOC) as $column) {
        $availableColumns[] = $column['Field'];
    }

    $avaliacaoColumns = [
        'clareza',
        'dinamismo',
        'recursos',
        'criterios_avaliacao',
        'retorno',
        'disponibilidade',
        'respeito',
        'pontualidade',
        'metodologia',
        'didatica',
        'assiduidade',
        'comentario'
    ];

    if ($method === 'GET') {
        $alunoId = isset($_GET['aluno_id']) ? (int) $_GET['aluno_id'] : 0;

        $scoreColumnsSql = [];
        foreach ($avaliacaoColumns as $column) {
            if (in_array($column, $availableColumns, true)) {
                $scoreColumnsSql[] = 'a.' . $column;
                continue;
            }
            $scoreColumnsSql[] = 'NULL AS ' . $column;
        }

        $sql = 'SELECT a.id, a.aluno_id, a.professor_id,
                       ' . implode(', ', $scoreColumnsSql) . ',
                       a.created_at, p.nome AS professor_nome,
                       p.departamento,
                       d.id AS disciplina_id,
                       d.nome AS disciplina_nome,
                       d.sigla AS disciplina_sigla,
                       d.ano_academico,
                       d.semestre
                FROM avaliacoes a
                INNER JOIN professores p ON p.id = a.professor_id
                LEFT JOIN disciplinas d ON d.id = a.disciplina_id';
        $params = [];

        if ($alunoId > 0) {
            $sql .= ' WHERE a.aluno_id = :aluno_id';
            $params[':aluno_id'] = $alunoId;
        }

        $sql .= ' ORDER BY a.created_at DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        json_response([
            'success' => true,
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
    }

    if ($method === 'POST') {
        $data = request_json();
        $alunoId = (int)($data['aluno_id'] ?? 0);
        $professorId = (int)($data['professor_id'] ?? 0);
        $disciplinaId = (int)($data['disciplina_id'] ?? 0);
        $clareza = (int)($data['clareza'] ?? -1);
        $dinamismo = (int)($data['dinamismo'] ?? -1);
        $recursos = (int)($data['recursos'] ?? -1);
        $criteriosAvaliacao = (int)($data['criterios_avaliacao'] ?? -1);
        $retorno = (int)($data['retorno'] ?? -1);
        $disponibilidade = (int)($data['disponibilidade'] ?? -1);
        $respeito = (int)($data['respeito'] ?? -1);
        $pontualidade = (int)($data['pontualidade'] ?? -1);
        $metodologia = (int)($data['metodologia'] ?? -1);
        $didatica = (int)($data['didatica'] ?? -1);
        $assiduidade = (int)($data['assiduidade'] ?? -1);
        $comentario = trim((string)($data['comentario'] ?? ''));

        $requiredScores = [
            $clareza, $dinamismo, $recursos, $criteriosAvaliacao, $retorno,
            $disponibilidade, $respeito, $pontualidade
        ];

        if ($alunoId <= 0 || $professorId <= 0 || $disciplinaId <= 0) {
            if ($alunoId > 0 && $professorId > 0 && $disciplinaId <= 0) {
                $resolveDisciplina = $db->prepare('
                    SELECT disciplina_id
                    FROM professor_disciplinas
                    WHERE professor_id = :professor_id
                    ORDER BY disciplina_id ASC
                    LIMIT 2
                ');
                $resolveDisciplina->execute([':professor_id' => $professorId]);
                $professorDisciplinas = $resolveDisciplina->fetchAll(PDO::FETCH_COLUMN);

                if (count($professorDisciplinas) === 1) {
                    $disciplinaId = (int)$professorDisciplinas[0];
                }
            }
        }

        if ($alunoId <= 0 || $professorId <= 0 || $disciplinaId <= 0) {
            json_response([
                'success' => false,
                'message' => 'Selecione um professor e uma disciplina válidos.'
            ], 422);
        }

        foreach ($requiredScores as $score) {
            if ($score < 1 || $score > 5) {
                json_response([
                    'success' => false,
                    'message' => 'Dados de avaliação inválidos.'
                ], 422);
            }
        }

        if ($metodologia < 1 || $metodologia > 5 || $didatica < 1 || $didatica > 5 || $assiduidade < 1 || $assiduidade > 5) {
            json_response([
                'success' => false,
                'message' => 'Dados de avaliação inválidos.'
            ], 422);
        }

        $stmt = $db->prepare(
            'SELECT a.id
             FROM avaliacoes a
             WHERE a.aluno_id = :aluno_id
               AND a.professor_id = :professor_id
               AND a.disciplina_id = :disciplina_id
             LIMIT 1'
        );
        $stmt->execute([
            ':aluno_id' => $alunoId,
            ':professor_id' => $professorId,
            ':disciplina_id' => $disciplinaId
        ]);

        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            json_response([
                'success' => false,
                'message' => 'Já avaliou este professor nesta disciplina.'
            ], 409);
        }

        $metodologiaMedia = (int)round(($clareza + $dinamismo + $recursos) / 3);
        $didaticaMedia = (int)round(($criteriosAvaliacao + $retorno) / 2);
        $assiduidadeMedia = (int)round(($disponibilidade + $respeito + $pontualidade) / 3);

        $insertData = [
            'aluno_id' => $alunoId,
            'professor_id' => $professorId,
            'disciplina_id' => $disciplinaId,
            'clareza' => $clareza,
            'dinamismo' => $dinamismo,
            'recursos' => $recursos,
            'criterios_avaliacao' => $criteriosAvaliacao,
            'retorno' => $retorno,
            'disponibilidade' => $disponibilidade,
            'respeito' => $respeito,
            'pontualidade' => $pontualidade,
            'metodologia' => $metodologiaMedia,
            'didatica' => $didaticaMedia,
            'assiduidade' => $assiduidadeMedia,
            'comentario' => $comentario
        ];

        $insertColumns = [];
        $insertPlaceholders = [];
        $insertParams = [];
        foreach ($insertData as $column => $value) {
            if (!in_array($column, $availableColumns, true)) {
                continue;
            }
            $insertColumns[] = $column;
            $insertPlaceholders[] = ':' . $column;
            $insertParams[':' . $column] = $value;
        }

        $stmt = $db->prepare(
            'INSERT INTO avaliacoes (' . implode(', ', $insertColumns) . ') VALUES (' . implode(', ', $insertPlaceholders) . ')'
        );
        $stmt->execute($insertParams);

        json_response([
            'success' => true,
            'message' => 'Avaliacao registada com sucesso.',
            'id' => (int)$db->lastInsertId()
        ], 201);
    }

    json_response([
        'success' => false,
        'message' => 'Metodo nao permitido.'
    ], 405);
} catch (Throwable $e) {
    error_log('Erro na rota avaliacao.php: ' . $e->getMessage());
    json_response([
        'success' => false,
        'message' => 'Nao foi possivel processar a avaliacao.'
    ], 500);
}
