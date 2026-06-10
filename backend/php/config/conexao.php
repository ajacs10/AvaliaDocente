<?php

class Database {
    // Configurações do ambiente local nativo (XAMPP / LAMP padrão)
    private string $host = 'localhost';
    private string $db_name = 'avaliadocente';
    private string $username = 'root';
    private string $password = ''; // Vazio para o padrão de apresentação local
    private ?PDO $conn = null;

    // Configuração da infraestrutura do Docker (para o seu ambiente atual)
    private string $hostDocker = 'sistema_avaliacao_mysql';
    private string $passwordDocker = 'root'; // Senha do seu container MySQL

    /**
     * Estabelece a conexão segura com o banco de dados via PDO.
     * Deteta dinamicamente o ambiente (Docker vs Localhost) para evitar falhas em apresentações.
     * * @return PDO
     * @throws Exception
     */
    public function connect(): PDO {
        // Padrão de Memoization: Se a conexão já existir, reaproveita a mesma instância
        if ($this->conn !== null) {
            return $this->conn;
        }

        // Determina o Host e a Senha com base na disponibilidade da rede Docker
        $hostFinal = $this->host;
        $passwordFinal = $this->password;

        // Se o DNS do container Docker estiver resolvível no sistema, assume o ambiente Docker
        if (gethostbyname($this->hostDocker) !== $this->hostDocker) {
            $hostFinal = $this->hostDocker;
            $passwordFinal = $this->passwordDocker;
        }

        try {
            $dsn = "mysql:host=" . $hostFinal . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Transforma erros SQL em Exceções PHP
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna dados puramente como arrays associativos
                PDO::ATTR_EMULATE_PREPARES   => false,                  // Desativa emulação para segurança real contra SQL Injection
            ];

            $this->conn = new PDO($dsn, $this->username, $passwordFinal, $options);
            return $this->conn;

        } catch (PDOException $e) {
            // Intercepta falhas críticas e responde em formato JSON estruturado padrão API REST
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(500);
            
            echo json_encode([
                'success' => false,
                'message' => 'Falha crítica na conexão com o banco de dados.',
                'debug'   => $e->getMessage() // Útil para debugar no console do navegador durante o desenvolvimento
            ], JSON_UNESCAPED_UNICODE);
            
            exit; // Interrompe a execução para não quebrar o fluxo com outputs corrompidos
        }
    }
}
?>