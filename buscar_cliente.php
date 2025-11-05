<?php
// Define que a resposta será em JSON
header('Content-Type: application/json');

// --- 1. INCLUIR SUA CONEXÃO ---
// (Assumindo que seu arquivo é 'conexao.php' e ele cria a variável $conn)
require 'conexao.php'; 

// Verifica se a conexão (vindo do conexao.php) foi bem-sucedida
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Erro ao carregar a conexão do banco de dados (conexao.php).']);
    exit;
}

// --- 2. VERIFICAR SE O ID FOI ENVIADO ---
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID do cliente não fornecido na URL.']);
    exit;
}

$clientId = (int)$_GET['id']; // Converte o ID para um inteiro por segurança

// --- 3. PREPARAR A RESPOSTA ---
$response = [
    'success' => false,
    'cliente' => null,
    'pets' => []
];

// --- 4. BUSCAR DADOS DO CLIENTE ---
//
// !!! ATENÇÃO AQUI: ESTE É O PONTO MAIS IMPORTANTE !!!
//
// O seu JavaScript espera por: nome_completo, telefone, email, cep, logradouro, numero, bairro, cidade, estado
// Se as suas colunas no banco de dados tiverem nomes DIFERENTES (ex: 'nome' ou 'rua'), 
// você DEVE usar um "alias" (apelido) com 'AS'.
//
// Exemplo: Se sua coluna se chama 'nome', mude a linha para: nome AS nome_completo,
// Exemplo: Se sua coluna se chama 'rua', mude a linha para:  rua AS logradouro,
//
$sql_cliente = "SELECT 
                    id, 
                    nome_completo,  -- !!! Se a sua coluna for 'nome', mude para: nome AS nome_completo,
                    telefone, 
                    email, 
                    cep, 
                    logradouro,     -- !!! Se a sua coluna for 'rua', mude para: rua AS logradouro,
                    numero, 
                    bairro, 
                    cidade, 
                    estado 
                FROM 
                    clientes        -- !!! Verifique se o nome da sua tabela é 'clientes'
                WHERE 
                    id = ?";

if ($stmt_cliente = $conn->prepare($sql_cliente)) {
    $stmt_cliente->bind_param("i", $clientId); // "i" significa que é um Inteiro
    $stmt_cliente->execute();
    $result_cliente = $stmt_cliente->get_result();

    if ($result_cliente->num_rows > 0) {
        // Cliente foi encontrado
        $response['cliente'] = $result_cliente->fetch_assoc();
        $response['success'] = true; 

        // --- 5. BUSCAR OS PETS ASSOCIADOS (SE O CLIENTE FOI ENCONTRADO) ---
        //
        // !!! ATENÇÃO AQUI TAMBÉM !!!
        //
        $sql_pets = "SELECT 
                        nome, 
                        especie, 
                        raca, 
                        nascimento 
                     FROM 
                        pets           -- !!! Verifique se o nome da sua tabela é 'pets'
                     WHERE 
                        cliente_id = ?"; // !!! Verifique se a coluna que liga o pet ao cliente é 'cliente_id'
        
        if ($stmt_pets = $conn->prepare($sql_pets)) {
            $stmt_pets->bind_param("i", $clientId);
            $stmt_pets->execute();
            $result_pets = $stmt_pets->get_result();

            // Adiciona todos os pets encontrados ao array
            while ($pet = $result_pets->fetch_assoc()) {
                $response['pets'][] = $pet;
            }
            $stmt_pets->close();
        }
        // Se a consulta de pets falhar, ela simplesmente retornará um array de pets vazio,
        // o que geralmente não quebra o JavaScript.

    } else {
        // Cliente não foi encontrado com esse ID
        $response['message'] = 'Cliente não encontrado (ID: ' . $clientId . ')';
    }
    $stmt_cliente->close();

} else {
    // Se a preparação do SQL falhar (ex: nome da tabela errada, nome da coluna errada)
    $response['message'] = 'Erro de SQL ao buscar cliente: ' . $conn->error;
}

// --- 6. FECHAR A CONEXÃO E ENVIAR A RESPOSTA JSON ---
$conn->close(); // Fecha a conexão que foi aberta no 'conexao.php'
echo json_encode($response);

?>