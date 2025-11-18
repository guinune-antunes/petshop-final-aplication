<?php
require 'includes/verifica_login.php';

// --- CORREÇÃO DO LOOP ---
// Apenas o Super Admin não pode ver essa tela. 
// Gerentes, Atendentes, Vets e Banho/Tosa PODEM ver (cada um com suas permissões visuais)
if ($_SESSION['usuario_cargo'] === 'super_admin') {
    header("Location: dashboard.php"); 
    exit;
}

$pageTitle = 'Dashboard da Loja';
$paginaAtiva = 'dashboard'; 
include 'includes/_head.php';
require 'conexao.php';

// --- LÓGICA DE MÉTRICAS EM TEMPO REAL (SaaS / Multi-inquilino) ---
$id_loja = $_SESSION['instituicao_id'];

// 1. Faturamento do Mês Atual
$sqlFat = "SELECT SUM(total_venda) FROM vendas 
           WHERE instituicao_id = ? AND MONTH(data_venda) = MONTH(CURRENT_DATE()) AND YEAR(data_venda) = YEAR(CURRENT_DATE())";
$stmtFat = $pdo->prepare($sqlFat);
$stmtFat->execute([$id_loja]);
$faturamento = $stmtFat->fetchColumn() ?: 0;

// 2. Agendamentos Hoje
$sqlAg = "SELECT COUNT(*) FROM agendamentos 
          WHERE instituicao_id = ? AND DATE(data_hora_inicio) = CURRENT_DATE() AND status != 'Cancelado'";
$stmtAg = $pdo->prepare($sqlAg);
$stmtAg->execute([$id_loja]);
$agendamentosHoje = $stmtAg->fetchColumn();

// 3. Total de Clientes da Loja
$sqlCli = "SELECT COUNT(*) FROM clientes WHERE instituicao_id = ?";
$stmtCli = $pdo->prepare($sqlCli);
$stmtCli->execute([$id_loja]);
$totalClientes = $stmtCli->fetchColumn();
?>

<?php include 'includes/_sidebar.php'; ?>

<div class="main-area">
    <div class="content-wrapper">
        <?php include 'includes/_header.php'; ?>

        <main class="main-content">
            <div class="page-header">
                <h1 class="main-title">Visão Geral - <?php echo date('F/Y'); ?></h1>
            </div>

            <div class="kpi-widgets">
                <div class="widget-card kpi-card">
                    <div class="card-icon green"><i class="fas fa-dollar-sign"></i></div>
                    <div class="card-content">
                        <span class="card-value">R$ <?php echo number_format($faturamento, 2, ',', '.'); ?></span>
                        <span class="card-label">Faturamento Mensal</span>
                    </div>
                </div>

                <div class="widget-card kpi-card">
                    <div class="card-icon blue"><i class="fas fa-calendar-check"></i></div>
                    <div class="card-content">
                        <span class="card-value"><?php echo $agendamentosHoje; ?></span>
                        <span class="card-label">Agendamentos Hoje</span>
                    </div>
                </div>

                <div class="widget-card kpi-card">
                    <div class="card-icon purple"><i class="fas fa-users"></i></div>
                    <div class="card-content">
                        <span class="card-value"><?php echo $totalClientes; ?></span>
                        <span class="card-label">Base de Clientes</span>
                    </div>
                </div>
            </div>
            
            </main>
    </div>
</div>
<?php include 'includes/_footer.php'; ?>