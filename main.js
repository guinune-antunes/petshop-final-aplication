document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODO ESCURO (GLOBAL) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // ... (código do modo escuro, como antes) ...
    }

    // --- LÓGICA DO MODAL DA AGENDA (SÓ RODA NA PÁGINA DA AGENDA) ---
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        // ... (código do modal da agenda, como antes) ...
    }

    // --- LÓGICA DA PÁGINA DE CLIENTES E PETS ---
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) { // Este IF garante que o código abaixo só rode na página de clientes

        const clientModal = document.getElementById('client-modal');
        const clientTableBody = document.getElementById('clientTableBody'); // Busca o corpo da tabela

        if (clientModal && clientTableBody) { // Garante que ambos existem
            const petForm = document.getElementById('pet-form');
            const clientForm = document.getElementById('client-form');
            const petList = document.getElementById('pet-list');
            const saveClientBtn = document.getElementById('saveClientBtn');
            const modalTitle = document.getElementById('client-modal-title');
            let petsArray = [];
            let editingClientId = null; // Variável para guardar o ID do cliente em edição

            // Abrir/Fechar Modal Principal
            clientModal.querySelector('.close-modal-btn').addEventListener('click', () => clientModal.style.display = 'none');
            clientModal.querySelector('.cancel-btn').addEventListener('click', () => clientModal.style.display = 'none');

            // Abrir Modal para NOVO Cliente
            addClientBtn.addEventListener('click', () => {
                editingClientId = null; // Garante que não estamos editando
                modalTitle.textContent = 'Novo Cliente';
                clientForm.reset();
                petForm.reset();
                petList.innerHTML = '';
                petsArray = [];
                document.getElementById('pet-breed').innerHTML = '<option value="">Selecione a espécie primeiro</option>';
                document.getElementById('pet-breed').disabled = true;
                clientModal.style.display = 'flex';
            });

            // --- Funcionalidade: Raças Dinâmicas ---
            const petSpeciesSelect = document.getElementById('pet-species');
            const petBreedSelect = document.getElementById('pet-breed');
            const breeds = {
                'Cão': ['SRD (Vira-lata)', 'Poodle', 'Golden Retriever', 'Labrador', 'Shih Tzu', 'Bulldog', 'Yorkshire', 'Outro'],
                'Gato': ['SRD (Vira-lata)', 'Siamês', 'Persa', 'Angorá', 'Sphynx', 'Outro']
            };
            petSpeciesSelect.addEventListener('change', function() { /* ... código das raças dinâmicas ... */ });

             // --- Funcionalidade: Adicionar Pet à Lista Temporária ---
            petForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const petData = { nome: document.getElementById('pet-name').value.trim(), especie: petSpeciesSelect.value, raca: petBreedSelect.value, nascimento: document.getElementById('pet-birthdate').value };
                if (petData.nome === '') { alert('O nome do pet é obrigatório.'); return; }
                petsArray.push(petData); // Adiciona ao array de dados
                renderPetList(); // Re-renderiza a lista visual
                petForm.reset();
                petBreedSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
                petBreedSelect.disabled = true;
            });

            // --- Funcionalidade: Remover Pet da Lista Temporária ---
            petList.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.remove-pet-btn');
                if (removeBtn) {
                    const itemToRemove = removeBtn.closest('.pet-list-item');
                    const indexToRemove = parseInt(itemToRemove.dataset.index, 10);
                    if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < petsArray.length) {
                        petsArray.splice(indexToRemove, 1); // Remove do array de dados
                        renderPetList(); // Re-renderiza a lista visual
                    } else {
                        // Se não tem índice (veio do BD na edição), apenas remove visualmente
                        itemToRemove.remove();
                    }
                }
            });

            // --- Função para renderizar a lista de pets (usada ao adicionar/remover/editar) ---
            function renderPetList() {
                petList.innerHTML = ''; // Limpa a lista atual
                petsArray.forEach((petData, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'pet-list-item';
                    listItem.dataset.index = index; // Adiciona o índice para remoção
                    listItem.innerHTML = `
                        <div class="pet-list-item-info">
                            <strong>${petData.nome}</strong>
                            <small>${petData.especie || 'Espécie?'} - ${petData.raca || 'Raça?'}</small>
                        </div>
                        <button type="button" class="remove-pet-btn" title="Remover Pet"><i class="fas fa-times"></i></button>
                    `;
                    petList.appendChild(listItem);
                });
            }


            // --- Ação Principal: Salvar Cliente e Pets (CRIAR ou EDITAR) ---
            saveClientBtn.addEventListener('click', function() {
                const clienteData = {
                    id: editingClientId, // Envia o ID se estiver editando, ou null se for novo
                    nome: document.getElementById('client-name').value.trim(),
                    telefone: document.getElementById('client-phone').value.trim(),
                    email: document.getElementById('client-email').value.trim(),
                    cep: document.getElementById('client-cep').value.trim(),
                    rua: document.getElementById('client-street').value.trim(),
                    numero: document.getElementById('client-number').value.trim(),
                    bairro: document.getElementById('client-neighborhood').value.trim(),
                    cidade: document.getElementById('client-city').value.trim(),
                    estado: document.getElementById('client-state').value.trim().toUpperCase()
                };
                if (clienteData.nome === '') { alert('O nome do cliente é obrigatório.'); return; }

                const dataToSend = { cliente: clienteData, pets: petsArray };

                // A URL do fetch continua a mesma, o PHP decidirá se é INSERT ou UPDATE
                fetch('salvar_cliente.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataToSend)
                    })
                    .then(res => res.json())
                    .then(result => {
                        alert(result.message);
                        if (result.success) location.reload();
                    }).catch(err => { console.error('Fetch error:', err); alert('Erro de comunicação.'); });
            });

            // --- Funcionalidade: Filtro de Busca Dinâmica ---
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                 const tableRows = clientTableBody.getElementsByTagName('tr');
                 searchInput.addEventListener('input', function() { /* ... código da busca ... */ });
            }

            // --- NOVA FUNCIONALIDADE: Delegação de Eventos para Editar e Excluir ---
            clientTableBody.addEventListener('click', function(event) {
                const targetButton = event.target.closest('button'); // Encontra o botão clicado

                if (!targetButton) return; // Sai se o clique não foi em um botão

                const clientId = targetButton.dataset.id;

                // --- Ação de EXCLUIR ---
                if (targetButton.classList.contains('btn-delete')) {
                    if (confirm(`Tem certeza que deseja excluir o cliente ID ${clientId}? Os pets associados também serão excluídos.`)) {
                        fetch(`excluir_cliente.php?id=${clientId}`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(result => {
                            alert(result.message);
                            if (result.success) {
                                const rowToRemove = clientTableBody.querySelector(`tr[data-id="${clientId}"]`);
                                if (rowToRemove) rowToRemove.remove();
                            }
                        })
                        .catch(error => { console.error('Erro ao excluir:', error); alert('Erro de comunicação ao excluir.'); });
                    }
                }

                // --- Ação de EDITAR ---
                if (targetButton.classList.contains('btn-edit')) {
                    editingClientId = clientId; // Define que estamos editando
                    loadClientDataForEdit(clientId); // Chama a função para buscar e preencher os dados
                }
            });

            // --- Função para buscar dados do cliente para edição ---
            function loadClientDataForEdit(clientId) {
                fetch(`buscar_cliente.php?id=${clientId}`) // Chama o novo script PHP
                .then(response => {
                    if (!response.ok) throw new Error('Cliente não encontrado ou erro no servidor');
                    return response.json();
                })
                .then(data => {
                    if (data.success && data.cliente) {
                        const cliente = data.cliente;
                        // Preenche o formulário do cliente
                        document.getElementById('client-name').value = cliente.nome_completo || '';
                        document.getElementById('client-phone').value = cliente.telefone || '';
                        document.getElementById('client-email').value = cliente.email || '';
                        document.getElementById('client-cep').value = cliente.cep || '';
                        document.getElementById('client-street').value = cliente.logradouro || '';
                        document.getElementById('client-number').value = cliente.numero || '';
                        document.getElementById('client-neighborhood').value = cliente.bairro || '';
                        document.getElementById('client-city').value = cliente.cidade || '';
                        document.getElementById('client-state').value = cliente.estado || '';

                        // Preenche a lista de pets (limpa o array e a lista visual antes)
                        petsArray = data.pets || [];
                        renderPetList();

                        // Ajusta o modal para o modo de edição
                        modalTitle.textContent = `Editando Cliente: ${cliente.nome_completo}`;
                        clientModal.style.display = 'flex';

                    } else {
                        alert(data.message || 'Erro ao buscar dados do cliente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar cliente:', error);
                    alert('Não foi possível carregar os dados do cliente para edição.');
                });
            }

        } // Fim do if(clientModal && clientTableBody)
    } // Fim do if (addClientBtn) - Lógica da Página de Clientes
});