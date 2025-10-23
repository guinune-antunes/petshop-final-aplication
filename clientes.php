<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    require_once 'conexao.php';

    $sql = "SELECT c.*, COUNT(p.id) AS total_pets 
            FROM clientes AS c 
            LEFT JOIN pets AS p ON c.id = p.cliente_id 
            GROUP BY c.id 
            ORDER BY c.nome_completo ASC";
            
    $stmt = $pdo->query($sql);
    $clientes = $stmt->fetchAll();

    $pageTitle = 'Clientes';
    $paginaAtiva = 'clientes';

    include 'includes/_head.php';
?>

    <div class="main-area">
        
        <?php include 'includes/_sidebar.php'; ?>

        <div class="content-wrapper">
            <?php include 'includes/_header.php'; ?>

            <main class="main-content">
                <div class="page-header">
                    <h1 class="main-title">Gerenciar Clientes</h1>
                    <div class="page-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Buscar por nome, telefone..." id="searchInput">
                        </div>
                        <button class="btn btn-primary" id="add-client-btn"><i class="fas fa-plus"></i> Novo Cliente</button>
                    </div>
                </div>

                <div class="table-container">
                    <table class="client-table">
                        <thead>
                            <tr>
                                <th>Nome Completo</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Nº de Pets</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="clientTableBody">
                            <?php if (count($clientes) > 0): ?>
                                <?php foreach ($clientes as $cliente): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($cliente['nome_completo']) ?></td>
                                        <td><?= htmlspecialchars($cliente['telefone']) ?></td>
                                        <td><?= htmlspecialchars($cliente['email']) ?></td>
                                        <td><?= $cliente['total_pets'] ?></td>
                                        <td class="action-buttons">
                                             <button class="btn-icon btn-edit" title="Editar Cliente" data-id="<?= $cliente['id'] ?>"><i class="fas fa-pencil-alt"></i></button>
                                             <button class="btn-icon btn-delete" title="Excluir Cliente" data-id="<?= $cliente['id'] ?>"><i class="fas fa-trash-alt"></i></button>
                                         </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="5" style="text-align:center;">Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <?php 
        // ESTA É A LINHA CRUCIAL QUE ESTAVA FALHANDO ANTES.
        // ELA INCLUI O HTML DO MODAL NO FINAL DA PÁGINA.
        include 'includes/_modal_cliente.php'; 
    ?>
    
<?php 
    include 'includes/_footer.php'; 
?>