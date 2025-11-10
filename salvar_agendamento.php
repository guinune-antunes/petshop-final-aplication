<?php
header('Content-Type: application/json');
require 'conexao.php'; // Usa seu $pdo

// Pega os dados enviados pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

try {
    // 1. Prepara os dados
    $cliente_id = $data['cliente_id'];
    $pet_id = $data['pet_id'];
    $servico = $data['servico'];
    $profissional = $data['profissional'];
    $observacoes = $data['observacoes'];
    
    // Constrói o DATETIME de início
    $data_hora_inicio = $data['date'] . ' ' . $data['time'] . ':00';
    
    // Calcula o DATETIME de fim (ex: 1 hora depois)
    $data_hora_fim_obj = new DateTime($data_hora_inicio);
    $data_hora_fim_obj->modify('+1 hour'); // Modifique se o serviço tiver durações diferentes
    $data_hora_fim = $data_hora_fim_obj->format('Y-m-d H:i:s');

    // 2. Insere no banco
    $sql = "INSERT INTO agendamentos 
                (cliente_id, pet_id, servico, profissional, data_hora_inicio, data_hora_fim, observacoes) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $cliente_id, 
        $pet_id, 
        $servico, 
        $profissional, 
        $data_hora_inicio, 
        $data_hora_fim, 
        $observacoes
    ]);

    // 3. Responde com sucesso
    echo json_encode(['success' => true, 'message' => 'Agendamento salvo com sucesso!']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar: ' . $e->getMessage()]);
}
?>