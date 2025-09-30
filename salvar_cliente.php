<?php
// Este arquivo será atualizado em breve para incluir os novos campos de endereço.
// Por enquanto, esta é a estrutura básica.
require_once 'conexao.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['cliente']['nome'])) {
    echo json_encode(['success' => false, 'message' => 'O nome do cliente é obrigatório.']);
    exit;
}
// Lógica para salvar os dados será adicionada aqui.
// Por enquanto, vamos retornar sucesso para testar a comunicação.
echo json_encode(['success' => true, 'message' => 'Comunicação com o servidor OK! (Dados não salvos ainda)']);