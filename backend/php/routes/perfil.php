<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

function profile_payload(array $user): array {
    return [
        'id' => (int)$user['id'],
        'nome' => $user['nome'],
        'email' => $user['email'],
        'telefone' => $user['telefone'],
        'foto_perfil' => $user['foto_perfil'],
        'curso' => $user['curso'],
        'ano_academico' => $user['ano_academico'],
        'tipo' => $user['tipo'],
        'created_at' => $user['created_at'] ?? null
    ];
}

try {
    $db = (new Database())->connect();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Usuario nao identificado.'], 422);
        }

        $stmt = $db->prepare('SELECT u.id, u.nome, u.email, u.telefone, u.foto_perfil, c.nome AS curso, u.ano_academico, u.tipo, u.created_at FROM usuarios u LEFT JOIN cursos c ON u.curso_id = c.id WHERE u.id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            json_response(['success' => false, 'message' => 'Usuario nao encontrado.'], 404);
        }

        json_response(['success' => true, 'data' => profile_payload($user)]);
    }

    if ($method !== 'POST') {
        json_response(['success' => false, 'message' => 'Metodo nao permitido.'], 405);
    }

    $action = $_POST['action'] ?? '';
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

    if ($id <= 0) {
        json_response(['success' => false, 'message' => 'Usuario nao identificado.'], 422);
    }

    if ($action === 'profile') {
        $email = trim((string)($_POST['email'] ?? ''));
        $telefone = trim((string)($_POST['telefone'] ?? ''));
        $fotoPerfil = null;

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['success' => false, 'message' => 'Informe um email valido.'], 422);
        }

        $telefone = preg_replace('/\D+/', '', $telefone);
        if ($telefone !== '' && !preg_match('/^9\d{8}$/', $telefone)) {
            json_response(['success' => false, 'message' => 'Telefone inválido. Deve ter 9 dígitos e começar com 9.' ], 422);
        }

        if (isset($_FILES['foto']) && $_FILES['foto']['error'] !== UPLOAD_ERR_NO_FILE) {
            if ($_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
                json_response(['success' => false, 'message' => 'Nao foi possivel receber a foto.'], 422);
            }

            $allowed = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp'
            ];
            $mime = mime_content_type($_FILES['foto']['tmp_name']);
            if (!isset($allowed[$mime])) {
                json_response(['success' => false, 'message' => 'Use uma foto JPG, PNG ou WEBP.'], 422);
            }

            if ($_FILES['foto']['size'] > 2 * 1024 * 1024) {
                json_response(['success' => false, 'message' => 'A foto deve ter ate 2 MB.'], 422);
            }

            $uploadDir = realpath(__DIR__ . '/../../../frontend/assets/uploads/profiles');
            if ($uploadDir === false) {
                $uploadDir = __DIR__ . '/../../../frontend/assets/uploads/profiles';
                mkdir($uploadDir, 0775, true);
            }

            $filename = 'user-' . $id . '-' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
            $target = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;

            if (!move_uploaded_file($_FILES['foto']['tmp_name'], $target)) {
                json_response(['success' => false, 'message' => 'Nao foi possivel guardar a foto.'], 500);
            }

            $fotoPerfil = '/frontend/assets/uploads/profiles/' . $filename;
        }

        if ($fotoPerfil) {
            $stmt = $db->prepare('UPDATE usuarios SET email = :email, telefone = :telefone, foto_perfil = :foto_perfil WHERE id = :id');
            $stmt->execute([
                ':email' => $email,
                ':telefone' => $telefone,
                ':foto_perfil' => $fotoPerfil,
                ':id' => $id
            ]);
        } else {
            $stmt = $db->prepare('UPDATE usuarios SET email = :email, telefone = :telefone WHERE id = :id');
            $stmt->execute([
                ':email' => $email,
                ':telefone' => $telefone,
                ':id' => $id
            ]);
        }

        $stmt = $db->prepare('SELECT u.id, u.nome, u.email, u.telefone, u.foto_perfil, c.nome AS curso, u.ano_academico, u.tipo, u.created_at FROM usuarios u LEFT JOIN cursos c ON u.curso_id = c.id WHERE u.id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        json_response(['success' => true, 'data' => profile_payload($stmt->fetch(PDO::FETCH_ASSOC))]);
    }

    if ($action === 'password') {
        $password = (string)($_POST['password'] ?? '');
        $confirm = (string)($_POST['confirm_password'] ?? '');

        if (strlen($password) < 4) {
            json_response(['success' => false, 'message' => 'A senha deve ter pelo menos 4 caracteres.'], 422);
        }

        if ($password !== $confirm) {
            json_response(['success' => false, 'message' => 'As senhas nao coincidem.'], 422);
        }

        $stmt = $db->prepare('UPDATE usuarios SET senha = :senha WHERE id = :id');
        $stmt->execute([
            ':senha' => password_hash($password, PASSWORD_DEFAULT),
            ':id' => $id
        ]);

        json_response(['success' => true, 'message' => 'Senha atualizada com sucesso.']);
    }

    json_response(['success' => false, 'message' => 'Acao invalida.'], 422);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        json_response(['success' => false, 'message' => 'Este email ja esta em uso.'], 409);
    }

    json_response(['success' => false, 'message' => 'Nao foi possivel atualizar o perfil.'], 500);
} catch (Throwable $e) {
    json_response(['success' => false, 'message' => 'Nao foi possivel atualizar o perfil.'], 500);
}
