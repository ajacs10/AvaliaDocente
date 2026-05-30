<?php

function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function request_json(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
