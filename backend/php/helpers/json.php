<?php

function json_response($data, int $status = 200): void 
{
    http_response_code($status);

    header('Content-Type: application/json; charset=utf-8');
    
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function request_json(): array 
{

    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $data = json_decode($raw, true);
    
    return is_array($data) ? $data : [];
}
?>