<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Metodo nao permitido.'
    ], 405);
}

try {
    $data = request_json();
    $db = (new Database())->connect();

    $columns = [];
    $columnsStmt = $db->query('SHOW COLUMNS FROM usuarios');
    foreach ($columnsStmt->fetchAll(PDO::FETCH_ASSOC) as $column) {
        $columns[$column['Field']] = true;
    }

    if (!isset($columns['reset_token_hash'])) {
        $db->exec('ALTER TABLE usuarios ADD COLUMN reset_token_hash VARCHAR(64) NULL');
    }
    if (!isset($columns['reset_token_expires_at'])) {
        $db->exec('ALTER TABLE usuarios ADD COLUMN reset_token_expires_at DATETIME NULL');
    }

    $token = trim((string)($data['token'] ?? ''));
    if ($token !== '') {
        $novaSenha = (string)($data['nova_senha'] ?? '');
        $confirmarSenha = (string)($data['confirmar_senha'] ?? '');

        if ($novaSenha === '' || $confirmarSenha === '') {
            json_response([
                'success' => false,
                'message' => 'Preencha a nova senha e a confirmacao.'
            ], 422);
        }

        if (strlen($novaSenha) < 4) {
            json_response([
                'success' => false,
                'message' => 'A nova senha deve ter pelo menos 4 caracteres.'
            ], 422);
        }

        if ($novaSenha !== $confirmarSenha) {
            json_response([
                'success' => false,
                'message' => 'As senhas nao coincidem.'
            ], 422);
        }

        $stmt = $db->prepare(
            'SELECT id
             FROM usuarios
             WHERE reset_token_hash = :token_hash
               AND reset_token_expires_at >= NOW()
             LIMIT 1'
        );
        $stmt->execute([':token_hash' => hash('sha256', $token)]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            json_response([
                'success' => false,
                'message' => 'Link invalido ou expirado. Solicite um novo link.'
            ], 400);
        }

        $update = $db->prepare(
            'UPDATE usuarios
             SET senha = :senha,
                 reset_token_hash = NULL,
                 reset_token_expires_at = NULL
             WHERE id = :id'
        );
        $update->execute([
            ':senha' => password_hash($novaSenha, PASSWORD_DEFAULT),
            ':id' => (int)$user['id']
        ]);

        json_response([
            'success' => true,
            'message' => 'Senha atualizada com sucesso.'
        ]);
    }

    $email = trim((string)($data['email'] ?? ''));
    if ($email === '') {
        json_response([
            'success' => false,
            'message' => 'Informe o email institucional.'
        ], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response([
            'success' => false,
            'message' => 'Informe um email valido.'
        ], 422);
    }

    $stmt = $db->prepare('SELECT id, nome, email FROM usuarios WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Do not reveal whether the email exists.
    $genericMessage = 'Se o email existir na plataforma, enviaremos um link para recuperar a senha.';
    if (!$user) {
        json_response([
            'success' => true,
            'message' => $genericMessage
        ]);
    }

    $plainToken = bin2hex(random_bytes(32));
    $expiresAt = (new DateTimeImmutable('+30 minutes'))->format('Y-m-d H:i:s');
    $update = $db->prepare(
        'UPDATE usuarios
         SET reset_token_hash = :token_hash,
             reset_token_expires_at = :expires_at
         WHERE id = :id'
    );
    $update->execute([
        ':token_hash' => hash('sha256', $plainToken),
        ':expires_at' => $expiresAt,
        ':id' => (int)$user['id']
    ]);

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    $basePath = preg_replace('#/backend/php/routes/[^/]+$#', '', $scriptName);
    $basePath = rtrim((string)$basePath, '/');
    $resetLink = $scheme . '://' . $host . $basePath . '/frontend/html/recuperar-acesso.html?token=' . urlencode($plainToken);

    $subject = 'Recuperacao de senha - AvaliaDocente';
    $body = "Ola, {$user['nome']}.\n\nUse este link para definir uma nova senha:\n{$resetLink}\n\nO link expira em 30 minutos.";
    $headers = 'From: noreply@avaliadocente.local';
    $sent = @mail($user['email'], $subject, $body, $headers);

    $response = [
        'success' => true,
        'message' => $sent
            ? 'Enviamos um link de recuperacao para o seu email.'
            : $genericMessage
    ];

    if (!$sent) {
        $response['reset_link'] = $resetLink;
    }

    json_response($response);
} catch (Throwable $e) {
    json_response([
        'success' => false,
        'message' => 'Nao foi possivel recuperar o acesso agora.'
    ], 500);
}
