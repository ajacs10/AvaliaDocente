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
            $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $conn;

        } catch (PDOException $e) {

            // NÃO usar die (quebra JSON e causa loop no frontend)
            throw new Exception("Erro de conexão com MySQL: " . $e->getMessage());
        }
    }
}