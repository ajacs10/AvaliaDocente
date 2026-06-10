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
        $hostFinal = $this->host;
        $passwordFinal = $this->password;
        if (gethostbyname($this->hostDocker) !== $this->hostDocker) {
            $hostFinal = $this->hostDocker;
            $passwordFinal = $this->passwordDocker;
        }

        try {
            $dsn = "mysql:host=" . $hostFinal . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $passwordFinal, $options);
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