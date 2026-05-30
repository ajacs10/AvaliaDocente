<?php

class Database {

    private $host = "mysql";
    private $dbname = "avaliadocente";
    private $user = "root";
    private $pass = "root";

    public function connect() {

        try {

            $conn = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4",
                $this->user,
                $this->pass
            );

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

            return $conn;

        } catch(PDOException $e) {

            die("Erro na conexão: " . $e->getMessage());

        }
    }
}
?>
