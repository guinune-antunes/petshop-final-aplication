<?php
    // Define o título da página e qual item do menu deve ficar ativo
    $pageTitle = 'Agenda';
    $paginaAtiva = 'agenda';

    // Inclui o cabeçalho do HTML
    include 'includes/_head.php';
?>
<?php include 'includes/_sidebar.php'; // Inclui a barra lateral de navegação ?>
    <div class="main-area">
        
        

        <div class="content-wrapper">
            <?php include 'includes/_header.php'; // Inclui o cabeçalho superior ?>

            <main class="main-content">
                <div class="page-header">
                    <h1 class="main-title">Agenda</h1>
                    <div class="calendar-controls">
                        <div class="view-toggles">
                            <button class="btn btn-secondary">Mês</button>
                            <button class="btn btn-secondary active">Semana</button>
                            <button class="btn btn-secondary">Dia</button>
                        </div>
                        <div class="date-nav">
                             <button class="btn btn-icon"><i class="fas fa-chevron-left"></i></button>
                             <button class="btn btn-secondary">Hoje</button>
                             <button class="btn btn-icon"><i class="fas fa-chevron-right"></i></button>
                        </div>
                        <span class="current-date-range">15 Set - 21 Set, 2025</span>
                        <button class="btn btn-primary" id="add-appointment-btn"><i class="fas fa-plus"></i> Adicionar Agendamento</button>
                    </div>
                </div>

                <div class="calendar-grid-container">
                    <div class="time-column">
                        <div class="time-slot">08:00</div>
                        <div class="time-slot">09:00</div>
                        <div class="time-slot">10:00</div>
                        <div class="time-slot">11:00</div>
                        <div class="time-slot">12:00</div>
                        <div class="time-slot">13:00</div>
                        <div class="time-slot">14:00</div>
                        <div class="time-slot">15:00</div>
                        <div class="time-slot">16:00</div>
                        <div class="time-slot">17:00</div>
                        <div class="time-slot">18:00</div>
                    </div>
                    <div class="calendar-grid">
                        <div class="day-column">
                            <div class="day-header">SEG 16</div>
                            <div class="appointments">
                                <div class="appointment-card service-bath" style="top: 60px; height: 120px;">
                                    <p class="pet-name">Max</p>
                                    <p class="service-name">Banho e Tosa</p>
                                    <small>Tutor: Ricardo</small>
                                </div>
                            </div>
                        </div>
                        <div class="day-column">
                            <div class="day-header current">TER 17</div>
                             <div class="appointments">
                                <div class="appointment-card service-vet" style="top: 120px; height: 60px;">
                                    <p class="pet-name">Luna</p>
                                    <p class="service-name">Consulta</p>
                                    <small>Tutor: Ana P.</small>
                                </div>
                                 <div class="appointment-card service-grooming" style="top: 180px; height: 90px;">
                                    <p class="pet-name">Bolinha</p>
                                    <p class="service-name">Tosa Higiênica</p>
                                    <small>Tutor: Mariana</small>
                                </div>
                            </div>
                        </div>
                        <div class="day-column"><div class="day-header">QUA 18</div><div class="appointments"></div></div>
                        <div class="day-column"><div class="day-header">QUI 19</div><div class="appointments"></div></div>
                        <div class="day-column"><div class="day-header">SEX 20</div><div class="appointments"></div></div>
                        <div class="day-column"><div class="day-header">SÁB 21</div><div class="appointments"></div></div>
                        <div class="day-column weekend"><div class="day-header">DOM 15</div><div class="appointments"></div></div>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <div class="modal-overlay" id="appointment-modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Novo Agendamento</h2>
                <button class="close-modal-btn" id="close-modal-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form class="appointment-form">
                    <div class="form-group">
                        <label for="client">Cliente</label>
                        <input type="text" id="client" placeholder="Pesquisar nome do tutor...">
                    </div>
                    <div class="form-group">
                        <label for="pet">Pet</label>
                        <select id="pet" disabled>
                            <option>Selecione um cliente primeiro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="service">Serviço</label>
                        <select id="service">
                            <option>Banho</option>
                            <option>Banho e Tosa</option>
                            <option>Tosa Higiênica</option>
                            <option>Consulta Veterinária</option>
                            <option>Vacina</option>
                        </select>
                    </div>
                     <div class="form-group-row">
                        <div class="form-group">
                            <label for="date">Data</label>
                            <input type="date" id="date" value="2025-09-17">
                        </div>
                        <div class="form-group">
                            <label for="time">Horário</label>
                            <input type="time" id="time" value="10:00">
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="professional">Profissional</label>
                        <select id="professional">
                            <option>Qualquer um</option>
                            <option>Maria (Tosadora)</option>
                            <option>Dr. Roberto (Veterinário)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="notes">Observações</label>
                        <textarea id="notes" rows="3" placeholder="Ex: Pet alérgico a shampoo comum"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                <button class="btn btn-primary">Salvar Agendamento</button>
            </div>
        </div>
    </div>

<?php 
    // Inclui o final do HTML
    include 'includes/_footer.php'; 
?>