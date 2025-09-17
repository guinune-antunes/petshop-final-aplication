<?php
    // Define o título da página e qual item do menu deve ficar ativo
    $pageTitle = 'Clientes';
    $paginaAtiva = 'clientes';

    // Inclui o cabeçalho do HTML
    include 'includes/_head.php';
?>

    <div class="main-area">
        
        <?php include 'includes/_sidebar.php'; // Inclui a barra lateral de navegação ?>

        <div class="content-wrapper">
            <?php include 'includes/_header.php'; // Inclui o cabeçalho superior ?>

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
                            <tr>
                                <td>Carlos Souza</td>
                                <td>(11) 98765-4321</td>
                                <td>carlos.s@example.com</td>
                                <td>1</td>
                                <td class="action-buttons">
                                    <button class="btn-icon btn-edit" title="Editar Cliente"><i class="fas fa-pencil-alt"></i></button>
                                    <button class="btn-icon btn-delete" title="Excluir Cliente"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Ana Pereira</td>
                                <td>(21) 91234-5678</td>
                                <td>ana.pereira@example.com</td>
                                <td>2</td>
                                <td class="action-buttons">
                                    <button class="btn-icon btn-edit" title="Editar Cliente"><i class="fas fa-pencil-alt"></i></button>
                                    <button class="btn-icon btn-delete" title="Excluir Cliente"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <div class="modal-overlay" id="client-modal" style="display: none;">
        <div class="modal-content modal-lg">
            <div class="modal-header">
                <h2 id="client-modal-title">Novo Cliente</h2>
                <button class="close-modal-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="client-form-section">
                    <h4>Dados do Tutor</h4>
                    <form class="appointment-form">
                        <div class="form-group">
                            <label for="client-name">Nome Completo *</label>
                            <input type="text" id="client-name" placeholder="Nome completo do tutor">
                        </div>
                        <div class="form-group-row">
                            <div class="form-group"><label for="client-phone">Telefone</label><input type="tel" id="client-phone" placeholder="(99) 99999-9999"></div>
                            <div class="form-group"><label for="client-email">Email</label><input type="email" id="client-email" placeholder="email@exemplo.com"></div>
                        </div>
                        <div class="form-group"><label for="client-address">Endereço</label><textarea id="client-address" rows="2" placeholder="Rua, Número, Bairro, Cidade..."></textarea></div>
                    </form>
                </div>
                <div class="pet-management-section">
                    <h4>Pets do Tutor</h4>
                    <div class="pet-list-container"><ul id="pet-list"></ul></div>
                    <form class="pet-form" id="pet-form">
                        <h5>Adicionar Novo Pet</h5>
                        <div class="form-group-row">
                            <div class="form-group"><label for="pet-name">Nome do Pet *</label><input type="text" id="pet-name"></div>
                            <div class="form-group"><label for="pet-species">Espécie</label><input type="text" id="pet-species" placeholder="Cão, Gato..."></div>
                        </div>
                         <div class="form-group-row">
                            <div class="form-group"><label for="pet-breed">Raça</label><input type="text" id="pet-breed" placeholder="Ex: SRD, Poodle..."></div>
                            <div class="form-group"><label for="pet-birthdate">Data de Nascimento</label><input type="date" id="pet-birthdate"></div>
                        </div>
                        <button type="submit" class="btn btn-secondary" style="width: auto; font-size: 0.8rem; padding: 6px 12px;"><i class="fas fa-plus"></i> Adicionar Pet à Lista</button>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary cancel-btn">Cancelar</button>
                <button class="btn btn-primary">Salvar Cliente e Pets</button>
            </div>
        </div>
    </div>
<?php 
    // Inclui o final do HTML
    include 'includes/_footer.php'; 
?>