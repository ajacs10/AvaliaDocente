<?php

/**
 * Envia uma resposta JSON estruturada para o frontend com os cabeçalhos de CORS necessários.
 * * @param mixed $data Dados a serem convertidos em JSON.
 * @param int $status Código de status HTTP (Padrão: 200 OK).
 * @return void
 */
function json_response($data, int $status = 200): void {
    // Define o código de status HTTP na resposta
    http_response_code($status);
    
    // Configura o tipo de conteúdo com encoding correto para português
    header('Content-Type: application/json; charset=utf-8');
    
    // Configurações de CORS: Permite que o seu frontend se comunique com a API sem bloqueios do navegador
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    // Envia o JSON limpo e encerra a execução para blindar o output
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Captura, decodifica e sanitiza o payload JSON enviado pelo método POST/PUT do frontend.
 * * @return array Retorna o corpo da requisição decodificado em array associativo.
 */
function request_json(): array {
    // Lê o fluxo de entrada de dados brutos da requisição HTTP
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    // Decodifica a string JSON transformando-a em um array associativo
    $data = json_decode($raw, true);
    
    // Garante o contrato de retorno: sempre entrega um array válido
    return is_array($data) ? $data : [];
}
?>