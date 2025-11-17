<?php
header('Content-Type: application/json');
require 'conexao.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['itens'])) {
    echo json_encode(['success' => false, 'message' => 'Carrinho vazio.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Salva a Venda
    // ATENÇÃO: Usando 'agendamentos_id' conforme sua estrutura corrigida
    $sql_venda = "INSERT INTO vendas 
        (cliente_id, total_venda, desconto, forma_pagamento, status, agendamentos_id) 
        VALUES (?, ?, ?, ?, 'Finalizada', NULL)";
    
    $stmt = $pdo->prepare($sql_venda);
    $stmt->execute([
        $data['cliente_id'],
        $data['total_venda'],
        $data['desconto'],
        $data['forma_pagamento']
    ]);
    
    $venda_id = $pdo->lastInsertId();

    // 2. Salva os Itens e Baixa Estoque
    $sql_item = "INSERT INTO itens_venda 
        (venda_id, produto_id, nome_item, quantidade, preco_unitario, subtotal) 
        VALUES (?, ?, ?, ?, ?, ?)";
    
    $sql_estoque = "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?";
    
    $stmt_item = $pdo->prepare($sql_item);
    $stmt_estoque = $pdo->prepare($sql_estoque);

    foreach ($data['itens'] as $item) {
        $produto_id = ($item['id'] > 0) ? $item['id'] : null;
        $subtotal = $item['qtd'] * $item['preco'];

        $stmt_item->execute([
            $venda_id,
            $produto_id,
            $item['nome'],
            $item['qtd'],
            $item['preco'],
            $subtotal
        ]);

        // Só baixa estoque se for produto cadastrado (ID > 0)
        if ($produto_id) {
            $stmt_estoque->execute([$item['qtd'], $produto_id]);
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Venda salva!']);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erro: ' . $e->getMessage()]);
}
?>