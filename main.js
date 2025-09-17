document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODO ESCURO (DARK MODE) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // ... (código do modo escuro, como na resposta anterior) ...
    }

    // --- LÓGICA DO MODAL DA AGENDA (PÁGINA AGENDA) ---
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        // ... (código do modal da agenda, como na resposta anterior) ...
    }

    // --- LÓGICA DA PÁGINA DE CLIENTES E PETS ---
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
        // ... (código para abrir e fechar modais, como na resposta anterior) ...
        
        // --- NOVA LÓGICA DE BUSCA DINÂMICA ---
        const searchInput = document.getElementById('searchInput');
        const clientTableBody = document.getElementById('clientTableBody');
        const tableRows = clientTableBody.getElementsByTagName('tr');

        // Adiciona um "escutador" de eventos que dispara a cada tecla digitada
        searchInput.addEventListener('input', function() {
            // Pega o texto da busca e converte para minúsculas para não diferenciar maiúsculas/minúsculas
            const searchText = searchInput.value.toLowerCase();

            // Percorre cada linha <tr> da tabela
            for (let i = 0; i < tableRows.length; i++) {
                const row = tableRows[i];
                // Pega todo o texto contido na linha e também converte para minúsculas
                const rowText = row.textContent.toLowerCase();

                // Verifica se o texto da linha inclui o texto da busca
                if (rowText.includes(searchText)) {
                    // Se incluir, mostra a linha
                    row.style.display = ''; // '' redefine para o padrão (table-row)
                } else {
                    // Se não incluir, esconde a linha
                    row.style.display = 'none';
                }
            }
        });
    }

});