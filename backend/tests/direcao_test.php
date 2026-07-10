<?php
require_once __DIR__ . '/../php/helpers/direcao.php';

$avaliacoes = [
    [
        'professor_id' => 1,
        'professor_nome' => 'Prof. A',
        'curso' => 'EISI',
        'ano_academico' => '4.º Ano',
        'semestre' => 2,
        'aluno_id' => 10,
        'clareza' => 5,
        'dinamismo' => 4,
        'recursos' => 5,
        'criterios_avaliacao' => 4,
        'retorno' => 4,
        'disponibilidade' => 5,
        'respeito' => 5,
        'pontualidade' => 4,
    ],
    [
        'professor_id' => 1,
        'professor_nome' => 'Prof. A',
        'curso' => 'EISI',
        'ano_academico' => '4.º Ano',
        'semestre' => 2,
        'aluno_id' => 11,
        'clareza' => 3,
        'dinamismo' => 2,
        'recursos' => 4,
        'criterios_avaliacao' => 3,
        'retorno' => 3,
        'disponibilidade' => 4,
        'respeito' => 4,
        'pontualidade' => 3,
    ],
    [
        'professor_id' => 2,
        'professor_nome' => 'Prof. B',
        'curso' => 'Administração',
        'ano_academico' => '3.º Ano',
        'semestre' => 1,
        'aluno_id' => 12,
        'clareza' => 4,
        'dinamismo' => 4,
        'recursos' => 4,
        'criterios_avaliacao' => 4,
        'retorno' => 4,
        'disponibilidade' => 4,
        'respeito' => 4,
        'pontualidade' => 4,
    ],
];

$resumo = resumir_avaliacoes_direcao($avaliacoes);

if ($resumo['total_avaliacoes'] !== 3) {
    fwrite(STDERR, "Esperado 3 avaliações, obtido {$resumo['total_avaliacoes']}\n");
    exit(1);
}

if ($resumo['total_estudantes'] !== 3) {
    fwrite(STDERR, "Esperado 3 estudantes, obtido {$resumo['total_estudantes']}\n");
    exit(1);
}

if ($resumo['ranking_professores'][0]['professor_nome'] !== 'Prof. A') {
    fwrite(STDERR, "Professor principal incorreto\n");
    exit(1);
}

fwrite(STDOUT, "Todos os testes de direção passaram.\n");
