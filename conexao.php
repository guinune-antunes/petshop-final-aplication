<?php

// --- INFORMAÇÕES PARA CONEXÃO ---
// Substitua pelas suas informações, se forem diferentes
define('DB_HOST', 'localhost'); // O servidor onde o banco de dados está
define('DB_NAME', 'petcrm');      // O nome do seu banco de dados
define('DB_USER', 'root');      // O usuário do banco de dados (padrão do XAMPP é 'root')
define('DB_PASS', '');          // A senha do banco de dados (padrão do XAMPP é em branco)

// --- CRIAÇÃO DA CONEXÃO PDO ---
try {
    // A string de conexão (DSN)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    
    // Opções do PDO
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lança exceções em caso de erro
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna resultados como arrays associativos
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Usa prepares nativos do DB para mais segurança
    ];

    // Cria a instância do PDO
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    // Se a conexão falhar, exibe uma mensagem de erro e interrompe o script
    // Em um ambiente de produção, você logaria este erro em vez de exibi-lo na tela
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}