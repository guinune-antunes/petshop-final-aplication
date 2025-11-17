<link rel="stylesheet" href="style.css">

<aside class="sidebar">
    <div class="sidebar-header">
        <i class="fas fa-paw"></i>
        <span>PetCRM</span>
    </div>
    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-item <?php echo ($paginaAtiva === 'dashboard') ? 'active' : ''; ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
        <a href="agenda.php" class="nav-item <?php echo ($paginaAtiva === 'agenda') ? 'active' : ''; ?>"><i class="fas fa-calendar-alt"></i> Agenda</a>
        <a href="clientes.php" class="nav-item <?php echo ($paginaAtiva === 'clientes') ? 'active' : ''; ?>"><i class="fas fa-users"></i> Clientes</a>
        <a href="#" class="nav-item"><i class="fas fa-dog"></i> Pets</a>
        <a href="vendas.php" class="nav-item"><i class="fas fa-shopping-cart"></i> Vendas (PDV)</a>
        <a href="estoque.php" class="nav-item"><i class="fas fa-box-open"></i> Estoque</a>
        <a href="#" class="nav-item"><i class="fas fa-chart-line"></i> Relatórios</a>
        <a href="#" class="nav-item"><i class="fas fa-cog"></i> Configurações</a>
    </nav>
</aside>