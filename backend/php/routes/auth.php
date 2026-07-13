<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../helpers/json.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Metodo nao permitido.'
    ], 405);
}

try {

    $data = request_json();

    $studentId = trim((string)($data['student_id'] ?? ''));
    $password  = trim((string)($data['password'] ?? ''));

    if ($studentId === '') {
        json_response([
            'success' => false,
            'message' => 'Informe o número de estudante, email ou nome.'
        ], 422);
    }

    if ($password === '') {
        json_response([
            'success' => false,
            'message' => 'Informe a senha.'
        ], 422);
    }

    if (mb_strlen($password) < 4) {
        json_response([
            'success' => false,
            'message' => 'A senha deve ter pelo menos 4 caracteres.'
        ], 422);
    }

    if (strpos($studentId, '@') !== false) {
        if (!filter_var($studentId, FILTER_VALIDATE_EMAIL)) {
            json_response([
                'success' => false,
                'message' => 'Email inválido.'
            ], 422);
        }
    } elseif (ctype_digit($studentId)) {
        $studentLength = strlen($studentId);
        if ($studentLength < 4 || $studentLength > 12) {
            json_response([
                'success' => false,
                'message' => 'Número de estudante inválido.'
            ], 422);
        }
    } elseif (mb_strlen($studentId) < 2) {
        json_response([
            'success' => false,
            'message' => 'Nome inválido.'
        ], 422);
    }

    $db = (new Database())->connect();

    // verifica colunas
    $columnsStmt = $db->query("SHOW COLUMNS FROM usuarios");
    $userColumns = [];

    foreach ($columnsStmt->fetchAll() as $column) {
        $userColumns[$column['Field']] = true;
    }

    $professorIdSelect = isset($userColumns['professor_id'])
        ? ", professor_id"
        : ", NULL AS professor_id";

    $stmt = $db->prepare("
        SELECT u.id, u.nome, u.email, u.telefone, u.foto_perfil, u.curso_id, c.nome AS curso, u.ano_academico, u.senha, u.tipo {$professorIdSelect}
        FROM usuarios u
        LEFT JOIN cursos c ON u.curso_id = c.id
        WHERE u.id = :id OR u.email = :email OR u.nome = :nome
        ORDER BY
            CASE
                WHEN u.id = :id_exact THEN 0
                WHEN u.email = :email_exact THEN 1
                WHEN u.nome = :nome_exact THEN 2
                ELSE 3
            END,
            CASE
                WHEN u.tipo = 'professor' THEN 0
                WHEN u.tipo = 'aluno' THEN 1
                ELSE 2
            END
        LIMIT 1
    ");

    $stmt->execute([
        ':id' => ctype_digit($studentId) ? (int)$studentId : 0,
        ':email' => $studentId,
        ':nome' => $studentId,
        ':id_exact' => ctype_digit($studentId) ? (int)$studentId : -1,
        ':email_exact' => $studentId,
        ':nome_exact' => $studentId
    ]);

    $user = $stmt->fetch();
    if (!$user) 
        {
        $altInput = mb_strtolower($studentId);
        $altStmt = $db->prepare("SELECT u.id, u.nome, u.email, u.telefone, u.foto_perfil, u.curso_id, c.nome AS curso, u.ano_academico, u.senha, u.tipo {$professorIdSelect} FROM usuarios u LEFT JOIN cursos c ON u.curso_id = c.id WHERE LOWER(u.email) = :email_lower OR LOWER(u.nome) LIKE :nome_like LIMIT 1");
        $altStmt->execute([
            ':email_lower' => $altInput,
            ':nome_like' => '%' . $altInput . '%'
        ]);
        $user = $altStmt->fetch();

        if (!$user) {
            json_response([
                'success' => false,
                'message' => 'Credenciais invalidas.'
            ]);
        }
    }

    $validPassword =
        password_verify($password, $user['senha']) ||
        hash_equals((string)$user['senha'], $password);

    if (!$validPassword) {
        json_response([
            'success' => false,
            'message' => 'Credenciais invalidas.'
        ]);
    }

    $professorId = null;

    if (($user['tipo'] ?? '') === 'professor') {

        if (!empty($user['professor_id'])) {
            $professorId = (int)$user['professor_id'];
        } else {

            $profStmt = $db->prepare("
                SELECT id FROM professores WHERE nome = :nome LIMIT 1
            ");

            $profStmt->execute([
                ':nome' => $user['nome']
            ]);

            $professor = $profStmt->fetch();
            $professorId = $professor ? (int)$professor['id'] : null;
        }
    }

    json_response([
        'success' => true,
        'data' => [
            'id' => (int)$user['id'],
            'nome' => $user['nome'],
            'email' => $user['email'],
            'telefone' => $user['telefone'],
            'foto_perfil' => $user['foto_perfil'],
            'curso' => $user['curso'],
            'ano_academico' => $user['ano_academico'],
            'tipo' => $user['tipo'],
            'professor_id' => $professorId
        ]
    ]);

} catch (Throwable $e) {

    json_response([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ], 500);
}
