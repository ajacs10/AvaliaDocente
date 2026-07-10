<?php

function get_semestre_atual(string $data = null): int {
    $date = $data ? new DateTimeImmutable($data) : new DateTimeImmutable('today');
    $month = (int)$date->format('m');
    $day = (int)$date->format('d');
    $md = $month * 100 + $day;

    if ($md >= 1007 || $md <= 308) {
        return 1;
    }

    return 2;
}

function get_semestre_label(int $semestre): string {
    return $semestre === 1 ? '1.º Semestre' : '2.º Semestre';
}
