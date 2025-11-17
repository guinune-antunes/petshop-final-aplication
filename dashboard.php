<?php
    // Define o título da página e qual item do menu deve ficar ativo
    $pageTitle = 'Dashboard';
    $paginaAtiva = 'dashboard';

    // Inclui o cabeçalho do HTML
    include 'includes/_head.php';
    require 'includes/verifica_login.php';
?>
<?php include 'includes/_sidebar.php'; // Inclui a barra lateral de navegação ?>
    <div class="main-area">
        
        

        <div class="content-wrapper">
            <?php include 'includes/_header.php'; // Inclui o cabeçalho superior ?>

            <main class="main-content">
                <h1 class="main-title">Dashboard</h1>

                <section class="widget-card">
                    <h3 class="card-title">Intensidade da Semana</h3>
                    <div class="week-calendar">
                        <div class="day-card">
                            <div class="day-name">DOM</div>
                            <div class="day-number">15</div>
                            <div class="intensity intensity-low"></div>
                        </div>
                        <div class="day-card">
                            <div class="day-name">SEG</div>
                            <div class="day-number">16</div>
                            <div class="intensity intensity-medium"></div>
                        </div>
                        <div class="day-card current-day">
                            <div class="day-name">TER</div>
                            <div class="day-number">17</div>
                            <div class="intensity intensity-high"></div>
                        </div>
                        <div class="day-card">
                            <div class="day-name">QUA</div>
                            <div class="day-number">18</div>
                            <div class="intensity intensity-medium"></div>
                        </div>
                        <div class="day-card">
                            <div class="day-name">QUI</div>
                            <div class="day-number">19</div>
                            <div class="intensity intensity-high"></div>
                        </div>
                        <div class="day-card">
                            <div class="day-name">SEX</div>
                            <div class="day-number">20</div>
                            <div class="intensity intensity-high"></div>
                        </div>
                        <div class="day-card">
                            <div class="day-name">SÁB</div>
                            <div class="day-number">21</div>
                            <div class="intensity intensity-low"></div>
                        </div>
                    </div>
                </section>
                
                <section class="kpi-widgets">
                    <div class="widget-card kpi-card">
                        <div class="card-icon blue"><i class="fas fa-calendar-check"></i></div>
                        <div class="card-content">
                            <span class="card-value">12</span>
                            <span class="card-label">Agendamentos Hoje</span>
                        </div>
                    </div>
                    <div class="widget-card kpi-card">
                        <div class="card-icon green"><i class="fas fa-dollar-sign"></i></div>
                        <div class="card-content">
                            <span class="card-value">R$ 875,50</span>
                            <span class="card-label">Faturamento do Dia</span>
                        </div>
                    </div>
                    <div class="widget-card kpi-card">
                        <div class="card-icon orange"><i class="fas fa-user-plus"></i></div>
                        <div class="card-content">
                            <span class="card-value">3</span>
                            <span class="card-label">Novos Clientes</span>
                        </div>
                    </div>
                    <div class="widget-card kpi-card">
                        <div class="card-icon purple"><i class="fas fa-birthday-cake"></i></div>
                        <div class="card-content">
                            <span class="card-value">5</span>
                            <span class="card-label">Aniversariantes (Pets)</span>
                        </div>
                    </div>
                </section>

                <section class="content-widgets">
                    <div class="widget-card large-card">
                        <h3 class="card-title">Próximos Agendamentos</h3>
                        <ul class="appointment-list">
                            <li>
                                <span class="time">09:00</span>
                                <span class="pet-name">Thor</span>
                                <span class="service">Banho e Tosa</span>
                                <span class="owner">Carlos Souza</span>
                                <span class="status scheduled">Agendado</span>
                            </li>
                            <li>
                                <span class="time">10:30</span>
                                <span class="pet-name">Luna</span>
                                <span class="service">Consulta Veterinária</span>
                                <span class="owner">Ana Pereira</span>
                                <span class="status confirmed">Confirmado</span>
                            </li>
                            <li>
                                <span class="time">11:00</span>
                                <span class="pet-name">Bolinha</span>
                                <span class="service">Tosa Higiênica</span>
                                <span class="owner">Mariana Costa</span>
                                <span class="status waiting">Aguardando</span>
                            </li>
                             <li>
                                <span class="time">14:00</span>
                                <span class="pet-name">Rex</span>
                                <span class="service">Vacina V10</span>
                                <span class="owner">João Martins</span>
                                <span class="status scheduled">Agendado</span>
                            </li>
                        </ul>
                    </div>
                    <div class="widget-card medium-card">
                         <h3 class="card-title">Notificações e Alertas</h3>
                         <ul class="notification-list">
                             <li class="notification-item warning">
                                 <div class="notification-icon"><i class="fas fa-shopping-bag"></i></div>
                                 <div class="notification-content">
                                     <p><strong>Recompra Sugerida:</strong> A ração do pet <strong>Max (Tutor: Ricardo)</strong> deve acabar em 3 dias.</p>
                                     <small>Compra anterior: 28/08/2025</small>
                                 </div>
                             </li>
                             <li class="notification-item info">
                                <div class="notification-icon"><i class="fas fa-birthday-cake"></i></div>
                                <div class="notification-content">
                                    <p>O pet <strong>Bolinha</strong> faz aniversário hoje! Envie uma mensagem para <strong>Mariana Costa</strong>.</p>
                                </div>
                            </li>
                             <li class="notification-item error">
                                <div class="notification-icon"><i class="fas fa-box-open"></i></div>
                                <div class="notification-content">
                                    <p><strong>Estoque Baixo:</strong> O produto "Shampoo Antipulgas 500ml" tem apenas 2 unidades restantes.</p>
                                </div>
                            </li>
                         </ul>
                    </div>
                </section>
            </main>
        </div>
    </div>

<?php 
    // Inclui o final do HTML
    include 'includes/_footer.php'; 
?>