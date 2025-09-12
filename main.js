// Espera o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona os elementos do DOM que vamos usar
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentModal = document.getElementById('appointment-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Função para abrir o modal
    function openModal() {
        if (appointmentModal) {
            appointmentModal.style.display = 'flex';
        }
    }

    // Função para fechar o modal
    function closeModal() {
        if (appointmentModal) {
            appointmentModal.style.display = 'none';
        }
    }

    // Adiciona o evento de clique ao botão "Adicionar Agendamento"
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', openModal);
    }
    
    // Adiciona o evento de clique ao botão de fechar (o 'X')
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Adiciona o evento de clique ao botão "Cancelar"
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Opcional: Fecha o modal se o usuário clicar fora da área do conteúdo
    if (appointmentModal) {
        appointmentModal.addEventListener('click', function(event) {
            if (event.target === appointmentModal) {
                closeModal();
            }
        });
    }

});