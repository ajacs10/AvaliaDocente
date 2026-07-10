<?php

class Database 
{
    private string $host = 'localhost';
    private string $db_name = 'avaliadocente';
    private string $username = 'root';
    private string $password = '';
    private ?PDO $conn = null;

    private string $hostDocker = 'sistema_avaliacao_mysql';
    private string $passwordDocker = 'root';
    public function connect(): PDO 
    {
    
        if ($this->conn !== null) {
            return $this->conn;
        }
        // Allow overriding via environment variables when running php -S or outside Docker
        $envHost = getenv('DB_HOST');
        $envUser = getenv('DB_USER');
        $envPass = getenv('DB_PASS');
        $envName = getenv('DB_NAME');

        $hostFinal = $this->host;
        $passwordFinal = $this->password;
        $usernameFinal = $this->username;
        $dbNameFinal = $this->db_name;

        if ($envHost) {
            $hostFinal = $envHost;
        } else {
            if (gethostbyname($this->hostDocker) !== $this->hostDocker) {
                $hostFinal = $this->hostDocker;
                $passwordFinal = $this->passwordDocker;
            }
        }

        if ($envUser) $usernameFinal = $envUser;
        if ($envPass) $passwordFinal = $envPass;
        if ($envName) $dbNameFinal = $envName;

        try {
            $dsn = "mysql:host=" . $hostFinal . ";dbname=" . $dbNameFinal . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $this->conn = new PDO($dsn, $usernameFinal, $passwordFinal, $options);
            return $this->conn;

        } catch (PDOException $e) 
        {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(500);
            
            echo json_encode([
                'success' => false,
                'message' => 'Falha crítica na conexão com o banco de dados.',
                'debug'   => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            
            exit;
        }
    }
}
?>