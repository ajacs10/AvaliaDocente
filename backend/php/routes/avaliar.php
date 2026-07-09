<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'POST') {
        $userId = isset($_POST['usuario_id']) ? (int)$_POST['usuario_id'] : 0;
        $professorId = isset($_POST['professor_id']) ? (int)$_POST['professor_id'] : 0;
        $disciplinaId = isset($_POST['disciplina_id']) ? (int)$_POST['disciplina_id'] : 0;
        $nota = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
        $comentario = trim((string)($_POST['comentario'] ?? ''));

        // Validações básicas
        if ($userId <= 0 || $professorId <= 0 || $disciplinaId <= 0) {
            json_response(['success' => false, 'message' => 'Dados invalidos.'], 422);
        }

        if ($nota < 1 || $nota > 5) {
            json_response(['success' => false, 'message' => 'A nota deve ser entre 1 e 5.'], 422);
        }

        // 1. Verificar se o semestre ainda está ativo
        $today = date('Y-m-d');
        $stmt = $db->prepare('
            SELECT id FROM calendario_semestres 
            WHERE :today BETWEEN data_inicio AND data_fim 
            LIMIT 1
        ');
        $stmt->execute([':today' => $today]);
        $semestreAtivo = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$semestreAtivo) {
            json_response(['success' => false, 'message' => 'O periodo de avaliacao para este semestre ja encerrou.'], 403);
        }

        // 2. Verificar se o aluno está matriculado nesta disciplina NO SEMESTRE ATIVO
        $stmt = $db->prepare('
            SELECT m.id FROM matriculas m
            WHERE m.usuario_id = :usuario_id 
            AND m.disciplina_id = :disciplina_id 
            AND m.calendario_id = :calendario_id
            LIMIT 1
        ');
        $stmt->execute([
            ':usuario_id' => $userId,
            ':disciplina_id' => $disciplinaId,
            ':calendario_id' => $semestreAtivo['id']
        ]);
        $matricula = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$matricula) {
            json_response(['success' => false, 'message' => 'O periodo de avaliacao para este semestre ja encerrou.'], 403);
        }

        // 3. Verificar se o professor leciona esta disciplina
        $stmt = $db->prepare('
            SELECT id FROM disciplinas 
            WHERE id = :disciplina_id 
            AND professor_id = :professor_id 
            LIMIT 1
        ');
        $stmt->execute([
            ':disciplina_id' => $disciplinaId,
            ':professor_id' => $professorId
        ]);
        $disciplina = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$disciplina) {
            json_response(['success' => false, 'message' => 'O periodo de avaliacao para este semestre ja encerrou.'], 403);
        }

        // 4. Inserir ou atualizar avaliação
        $stmt = $db->prepare('
            INSERT INTO avaliacoes 
            (usuario_id, professor_id, disciplina_id, calendario_id, nota, comentario) 
            VALUES (:usuario_id, :professor_id, :disciplina_id, :calendario_id, :nota, :comentario)
            ON DUPLICATE KEY UPDATE 
            nota = :nota, comentario = :comentario
        ');
        $stmt->execute([
            ':usuario_id' => $userId,
            ':professor_id' => $professorId,
            ':disciplina_id' => $disciplinaId,
            ':calendario_id' => $semestreAtivo['id'],
            ':nota' => $nota,
            ':comentario' => $comentario ?: null
        ]);

        json_response(['success' => true, 'message' => 'Avaliacao registrada com sucesso.']);
    }

    json_response(['success' => false, 'message' => 'Metodo nao permitido.'], 405);

} catch (PDOException $e) {
    json_response(['success' => false, 'message' => 'Nao foi possivel registrar a avaliacao.'], 500);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Erro inesperado.'], 500);
}
