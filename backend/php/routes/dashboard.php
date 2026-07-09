<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

try {
    $db = (new Database())->connect();
    $userId = isset($_GET['usuario_id']) ? (int)$_GET['usuario_id'] : 0;

    if ($userId <= 0) {
        json_response(['success' => false, 'message' => 'Usuario nao identificado.'], 422);
    }

    $today = date('Y-m-d');
    $stmt = $db->prepare('
        SELECT id, semestre, ano FROM calendario_semestres 
        WHERE :today BETWEEN data_inicio AND data_fim 
        LIMIT 1
    ');
    $stmt->execute([':today' => $today]);
    $semestreAtivo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$semestreAtivo) {
        json_response(['success' => false, 'message' => 'Nenhum semestre ativo no momento.'], 404);
    }

    $stmt = $db->prepare('
        SELECT 
            p.id as professor_id,
            p.nome as professor_nome,
            p.email as professor_email,
            p.foto_perfil as professor_foto,
            d.id as disciplina_id,
            d.nome as disciplina_nome,
            d.sigla as disciplina_sigla,
            CASE 
                WHEN av.id IS NOT NULL THEN true 
                ELSE false 
            END as ja_avaliado
        FROM matriculas m
        JOIN disciplinas d ON m.disciplina_id = d.id
        JOIN profesores_disciplinas pd ON d.id = pd.disciplina_id
        JOIN professores p ON pd.professor_id = p.id
        LEFT JOIN avaliacoes av ON (
            av.usuario_id = m.usuario_id 
            AND av.professor_id = p.id 
            AND av.disciplina_id = d.id 
            AND av.calendario_id = m.calendario_id
        )
        WHERE m.usuario_id = :usuario_id 
        AND m.calendario_id = :calendario_id
        ORDER BY d.nome ASC
    ');
    $stmt->execute([
        ':usuario_id' => $userId,
        ':calendario_id' => $semestreAtivo['id']
    ]);
    $disciplinas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$disciplinas) {
        json_response(['success' => true, 'data' => [], 'message' => 'Nenhuma disciplina encontrada.']);
    }

    json_response([
        'success' => true,
        'semestre_ativo' => $semestreAtivo,
        'data_hoje' => $today,
        'disciplinas' => $disciplinas
    ]);

} catch (PDOException $e) {
    json_response(['success' => false, 'message' => 'Erro ao buscar disciplinas.'], 500);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Erro inesperado.'], 500);
}