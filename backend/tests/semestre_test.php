<?php
require_once __DIR__ . '/../php/helpers/semestre.php';

$cases = [
    ['2026-01-15', 1],
    ['2026-07-10', 2],
    ['2026-08-20', 2],
    ['2026-12-31', 1],
];

foreach ($cases as [$date, $expected]) {
    $actual = get_semestre_atual($date);
    if ($actual !== $expected) {
        fwrite(STDERR, "Falhou para {$date}: esperado {$expected}, obtido {$actual}\n");
        exit(1);
    }
}

fwrite(STDOUT, "Todos os testes de semestre passaram.\n");
