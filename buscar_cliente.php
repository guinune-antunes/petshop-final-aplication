<?php
// Define que a resposta será em JSON
header('Content-Type: application/json');

// --- 1. INCLUIR SUA CONEXÃO (que cria a variável $pdo) ---
require 'conexao.php'; 

// --- 3. PREPARAR A RESPOSTA (JSON padrão) ---
$response = [
    'success' => false,
    'cliente' => null,
    'pets' => []
];

// --- 2. VERIFICAR SE O ID FOI ENVIADO ---
if (!isset($_GET['id']) || empty($_GET['id'])) {
    $response['message'] = 'ID do cliente não fornecido na URL.';
    echo json_encode($response);
    exit;
}

$clientId = (int)$_GET['id']; // Converte o ID para um inteiro por segurança

try {
    // --- 4. BUSCAR DADOS DO CLIENTE (Sintaxe PDO) ---
    $sql_cliente = "SELECT 
                        id, 
                        nome_completo, 
                        telefone, 
                        email, 
                        cep, 
                        logradouro, 
                        numero, 
                        bairro, 
                        cidade, 
                        estado 
                    FROM 
                        clientes 
                    WHERE 
                        id = ?";
    
    $stmt_cliente = $pdo->prepare($sql_cliente);
    $stmt_cliente->execute([$clientId]); // Passa o ID para o '?'
    $cliente = $stmt_cliente->fetch(); // Pega o primeiro resultado

    if ($cliente) {
        // Cliente foi encontrado
        $response['success'] = true;
        $response['cliente'] = $cliente;

        // --- 5. BUSCAR OS PETS ASSOCIADOS (Sintaxe PDO) ---
        $sql_pets = "SELECT 
                        nome, 
                        especie, 
                        raca, 
                        data_nascimento AS nascimento 
                     FROM 
                        pets 
                     WHERE 
                        cliente_id = ?";
        
        $stmt_pets = $pdo->prepare($sql_pets);
        $stmt_pets->execute([$clientId]); // Passa o ID para o '?'
        $pets = $stmt_pets->fetchAll(); // Pega TODOS os pets

        $response['pets'] = $pets;

    } else {
        // Cliente não foi encontrado com esse ID
        $response['message'] = 'Cliente não encontrado (ID: ' . $clientId . ')';
    }

} catch (PDOException $e) {
    // Se o SQL falhar, captura o erro e envia como JSON (NÃO mais como HTML)
    $response['message'] = 'Erro de SQL: ' . $e->getMessage();
}

// --- 6. FECHAR A CONEXÃO E ENVIAR A RESPOSTA JSON ---
// (O PDO não precisa de $pdo->close() aqui, ele fecha sozinho)
echo json_encode($response);

?>