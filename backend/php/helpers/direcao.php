<?php

function calcular_media_geral(array $avaliacoes): float {
    if (!$avaliacoes) {
        return 0.0;
    }

    $soma = 0.0;
    foreach ($avaliacoes as $avaliacao) {
        $soma += (float)($avaliacao['media_geral'] ?? 0.0);
    }

    return round($soma / count($avaliacoes), 2);
}

function resumir_avaliacoes_direcao(array $avaliacoes, ?int $totalEstudantesRegistados = null): array {
    $por_professor = [];
    $por_curso = [];
    $por_ano = [];
    $por_semestre = [];
    $estudantes = [];

    foreach ($avaliacoes as $avaliacao) {
        $professorId = (int)($avaliacao['professor_id'] ?? 0);
        $curso = (string)($avaliacao['curso'] ?? 'Sem curso');
        $ano = (string)($avaliacao['ano_academico'] ?? 'Sem ano');
        $semestre = (string)($avaliacao['semestre'] ?? 'Sem semestre');
        $professorNome = (string)($avaliacao['professor_nome'] ?? 'Professor');
        $alunoId = (int)($avaliacao['aluno_id'] ?? 0);
        $media = (float)($avaliacao['media_geral'] ?? 0.0);

        if ($professorId > 0) {
            if (!isset($por_professor[$professorId])) {
                $por_professor[$professorId] = [
                    'professor_id' => $professorId,
                    'professor_nome' => $professorNome,
                    'total_avaliacoes' => 0,
                    'soma_medias' => 0.0,
                    'cursos' => []
                ];
            }
            $por_professor[$professorId]['total_avaliacoes']++;
            $por_professor[$professorId]['soma_medias'] += $media;
            $por_professor[$professorId]['cursos'][$curso] = ($por_professor[$professorId]['cursos'][$curso] ?? 0) + 1;
        }

        $por_curso[$curso] = ($por_curso[$curso] ?? 0) + 1;
        $por_ano[$ano] = ($por_ano[$ano] ?? 0) + 1;
        $por_semestre[$semestre] = ($por_semestre[$semestre] ?? 0) + 1;
        if ($alunoId > 0) {
            $estudantes[$alunoId] = true;
        }
    }

    $ranking = array_values(array_map(static function (array $item): array {
        $item['media_geral'] = $item['total_avaliacoes'] > 0 ? round($item['soma_medias'] / $item['total_avaliacoes'], 2) : 0.0;
        return $item;
    }, $por_professor));

    usort($ranking, static function (array $left, array $right): int {
        if ($left['media_geral'] === $right['media_geral']) {
            return $left['professor_nome'] <=> $right['professor_nome'];
        }
        return $right['media_geral'] <=> $left['media_geral'];
    });

    return [
        'total_avaliacoes' => count($avaliacoes),
        'total_estudantes' => $totalEstudantesRegistados ?? count($estudantes),
        'media_geral' => calcular_media_geral($avaliacoes),
        'ranking_professores' => array_slice($ranking, 0, 5),
        'por_curso' => $por_curso,
        'por_ano' => $por_ano,
        'por_semestre' => $por_semestre,
    ];
}
