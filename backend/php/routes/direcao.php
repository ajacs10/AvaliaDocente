<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';
require_once __DIR__ . '/../helpers/direcao.php';

try {
    $db = (new Database())->connect();
    $sql = "
        SELECT 
            a.professor_id,
            p.nome AS professor_nome,
            d.curso,
            d.ano_academico,
            d.semestre,
            a.aluno_id,
            a.clareza,
            a.dinamismo,
            a.recursos,
            a.criterios_avaliacao,
            a.retorno,
            a.disponibilidade,
            a.respeito,
            a.pontualidade,
            a.metodologia,
            a.didatica,
            a.assiduidade,
            ROUND((
                COALESCE(a.clareza,0) + COALESCE(a.dinamismo,0) + COALESCE(a.recursos,0) +
                COALESCE(a.criterios_avaliacao,0) + COALESCE(a.retorno,0) +
                COALESCE(a.disponibilidade,0) + COALESCE(a.respeito,0) + COALESCE(a.pontualidade,0)
            ) / 8, 2) AS media_geral
        FROM avaliacoes a
        INNER JOIN professores p ON p.id = a.professor_id
        LEFT JOIN disciplinas d ON d.id = a.disciplina_id
        ORDER BY a.created_at DESC
    ";

    $stmt = $db->query($sql);
    $avaliacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        'success' => true,
        'data' => resumir_avaliacoes_direcao($avaliacoes)
    ]);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'message' => 'Nao foi possivel carregar o dashboard de direcao.'
    ], 500);
}
