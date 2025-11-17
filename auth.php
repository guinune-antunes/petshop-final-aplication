<?php
session_start();
require 'conexao.php';

$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$senha = $_POST['senha'];

if ($email && $senha) {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    // Verifica se usuário existe E se a senha bate com a hash
    if ($usuario && password_verify($senha, $usuario['senha'])) {
        
        // CRIA A SESSÃO
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome'];
        $_SESSION['usuario_cargo'] = $usuario['cargo'];

        // REDIRECIONA BASEADO NO CARGO (TIER)
        if ($usuario['cargo'] === 'admin') {
            header("Location: dashboard.php"); // Dashboard Geral/Admin
        } elseif ($usuario['cargo'] === 'gerente') {
            header("Location: dashboard.php"); // Por enquanto vai pro geral
        } elseif ($usuario['cargo'] === 'atendente') {
            header("Location: dashboard_atendente.php"); // Dashboard Personalizada
        }
        exit;

    } else {
        header("Location: login.php?erro=1");
        exit;
    }
} else {
    header("Location: login.php");
    exit;
}
?>