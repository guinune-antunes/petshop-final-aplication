<?php
require_once 'conexao.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['cliente']['nome'])) {
    echo json_encode(['success' => false, 'message' => 'O nome do cliente é obrigatório.']);
    exit;
}

$pdo->beginTransaction();
try {
    // SQL ATUALIZADO com os novos campos de endereço
    $sqlCliente = "INSERT INTO clientes (nome_completo, telefone, email, logradouro, numero, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtCliente = $pdo->prepare($sqlCliente);
    
    $stmtCliente->execute([
        $data['cliente']['nome'],
        $data['cliente']['telefone'],
        $data['cliente']['email'],
        $data['cliente']['rua'],
        $data['cliente']['numero'],
        $data['cliente']['bairro'],
        $data['cliente']['cidade'],
        $data['cliente']['estado'],
        $data['cliente']['cep']
    ]);
    
    $clienteId = $pdo->lastInsertId();

    if (!empty($data['pets']) && is_array($data['pets'])) {
        $sqlPet = "INSERT INTO pets (cliente_id, nome, especie, raca, data_nascimento) VALUES (?, ?, ?, ?, ?)";
        $stmtPet = $pdo->prepare($sqlPet);

        foreach ($data['pets'] as $pet) {
            $stmtPet->execute([
                $clienteId,
                $pet['nome'],
                $pet['especie'],
                $pet['raca'],
                empty($pet['nascimento']) ? null : $pet['nascimento']
            ]);
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Cliente e pets salvos com sucesso!']);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar: ' . $e->getMessage()]);
}