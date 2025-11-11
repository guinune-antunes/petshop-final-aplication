<?php
header('Content-Type: application/json');
require 'conexao.php'; // Usa seu $pdo

// Pega os dados enviados pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

$cliente = $data['cliente'];
$pets = $data['pets'];

// --- 1. Validação Básica ---
// (Validando o nome_completo que o main.js está enviando)
if (empty($cliente['nome_completo'])) {
    echo json_encode(['success' => false, 'message' => 'O nome do cliente é obrigatório.']);
    exit;
}

// Inicia a transação para garantir que tudo funcione
$pdo->beginTransaction();

try {
    $cliente_id = null;

    // --- 2. Decide se é INSERT ou UPDATE ---
    if (empty($cliente['id'])) {
        // É um NOVO CLIENTE (INSERT)
        $sql = "INSERT INTO clientes 
                    (nome_completo, telefone, email, cep, logradouro, numero, bairro, cidade, estado) 
                VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $cliente['nome_completo'],
            $cliente['telefone'],
            $cliente['email'],
            $cliente['cep'],
            $cliente['logradouro'], // Nome corrigido
            $cliente['numero'],
            $cliente['bairro'],
            $cliente['cidade'],
            $cliente['estado']
        ]);
        
        // Pega o ID do cliente que acabamos de criar
        $cliente_id = $pdo->lastInsertId();
        $message = 'Cliente salvo com sucesso!';

    } else {
        // É um CLIENTE EXISTENTE (UPDATE)
        $cliente_id = $cliente['id'];
        
        $sql = "UPDATE clientes SET 
                    nome_completo = ?, 
                    telefone = ?, 
                    email = ?, 
                    cep = ?, 
                    logradouro = ?, 
                    numero = ?, 
                    bairro = ?, 
                    cidade = ?, 
                    estado = ? 
                WHERE 
                    id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $cliente['nome_completo'],
            $cliente['telefone'],
            $cliente['email'],
            $cliente['cep'],
            $cliente['logradouro'], // Nome corrigido
            $cliente['numero'],
            $cliente['bairro'],
            $cliente['cidade'],
            $cliente['estado'],
            $cliente_id // O ID do cliente para o WHERE
        ]);
        
        $message = 'Cliente atualizado com sucesso!';
    }

    // --- 3. Gerenciamento dos Pets ---
    // A forma mais segura de sincronizar é apagar os pets antigos 
    // e readicionar a lista que veio do JavaScript.
    
    // Apaga pets antigos
    $sql_delete_pets = "DELETE FROM pets WHERE cliente_id = ?";
    $stmt_delete = $pdo->prepare($sql_delete_pets);
    $stmt_delete->execute([$cliente_id]);
    
    // Insere os pets da lista
    if (!empty($pets)) {
        $sql_insert_pet = "INSERT INTO pets 
                                (cliente_id, nome, especie, raca, data_nascimento) 
                           VALUES 
                                (?, ?, ?, ?, ?)";
        $stmt_pet = $pdo->prepare($sql_insert_pet);
        
        foreach ($pets as $pet) {
            // Usa 'data_nascimento' (do banco) se 'nascimento' (do JS) existir
            $nascimento = !empty($pet['nascimento']) ? $pet['nascimento'] : null;
            
            $stmt_pet->execute([
                $cliente_id,
                $pet['nome'],
                $pet['especie'],
                $pet['raca'],
                $nascimento 
            ]);
        }
    }
    
    // Se tudo deu certo, confirma as mudanças
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => $message]);

} catch (PDOException $e) {
    // Se algo deu errado, desfaz tudo
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar no banco: ' . $e->getMessage()]);
}
?>