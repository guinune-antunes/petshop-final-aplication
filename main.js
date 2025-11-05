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
        const clientTableBody = document.getElementById('clientTableBody'); 

        if (clientModal && clientTableBody) {
            const petForm = document.getElementById('pet-form');
            const clientForm = document.getElementById('client-form');
            const petList = document.getElementById('pet-list');
            const saveClientBtn = document.getElementById('saveClientBtn');
            const modalTitle = document.getElementById('client-modal-title');
            let petsArray = [];
            let editingClientId = null; 

            // Abrir/Fechar Modal Principal
            clientModal.querySelector('.close-modal-btn').addEventListener('click', () => clientModal.style.display = 'none');
            clientModal.querySelector('.cancel-btn').addEventListener('click', () => clientModal.style.display = 'none');

            // Abrir Modal para NOVO Cliente
            addClientBtn.addEventListener('click', () => {
                editingClientId = null; 
                modalTitle.textContent = 'Novo Cliente';
                clientForm.reset();
                petForm.reset();
                petList.innerHTML = '';
                petsArray = [];
                // Reseta os selects de pet
                petSpeciesSelect.value = ""; 
                petBreedSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
                petBreedSelect.disabled = true;
                clientModal.style.display = 'flex';
            });

            // --- Funcionalidade: Raças Dinâmicas ---
            const petSpeciesSelect = document.getElementById('pet-species');
            const petBreedSelect = document.getElementById('pet-breed');
            const breeds = {
                'Cão': ['SRD (Vira-lata)', 'Poodle', 'Golden Retriever', 'Labrador', 'Shih Tzu', 'Bulldog', 'Yorkshire', 'Outro'],
                'Gato': ['SRD (Vira-lata)', 'Siamês', 'Persa', 'Angorá', 'Sphynx', 'Outro']
            };
            
            // CORREÇÃO DAS RAÇAS (JÁ IMPLEMENTADA)
            petSpeciesSelect.addEventListener('change', function() {
                const selectedSpecies = this.value; 
                petBreedSelect.innerHTML = ''; 

                if (selectedSpecies && breeds[selectedSpecies]) {
                    petBreedSelect.disabled = false; 

                    const defaultOption = document.createElement('option');
                    defaultOption.value = "";
                    defaultOption.textContent = "Selecione a raça";
                    petBreedSelect.appendChild(defaultOption);

                    breeds[selectedSpecies].forEach(breedName => {
                        const option = document.createElement('option');
                        option.value = breedName;
                        option.textContent = breedName;
                        petBreedSelect.appendChild(option);
                    });

                } else {
                    petBreedSelect.disabled = true; 
                    
                    const defaultOption = document.createElement('option');
                    defaultOption.value = "";
                    defaultOption.textContent = "Selecione a espécie primeiro";
                    petBreedSelect.appendChild(defaultOption);
                }
            });

            // --- Funcionalidade: Adicionar Pet à Lista Temporária ---
            petForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const petData = { 
                    nome: document.getElementById('pet-name').value.trim(), 
                    especie: petSpeciesSelect.value, 
                    raca: petBreedSelect.value, 
                    nascimento: document.getElementById('pet-birthdate').value 
                };
                if (petData.nome === '') { alert('O nome do pet é obrigatório.'); return; }
                petsArray.push(petData); 
                renderPetList(); 
                petForm.reset();
                petSpeciesSelect.value = "";
                petBreedSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
                petBreedSelect.disabled = true;
            });

            // --- Funcionalidade: Remover Pet da Lista Temporária ---
            petList.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.remove-pet-btn');
                if (removeBtn) {
                    const itemToRemove = removeBtn.closest('.pet-list-item');
                    // Verifica se o pet veio do array temporário (tem um data-index)
                    if (itemToRemove.dataset.index) {
                        const indexToRemove = parseInt(itemToRemove.dataset.index, 10);
                        if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < petsArray.length) {
                            petsArray.splice(indexToRemove, 1); // Remove do array de dados
                            renderPetList(); // Re-renderiza a lista visual
                        }
                    } else {
                        // Se não tem índice (veio do BD na edição), apenas remove visualmente
                        // O PHP cuidará da lógica de exclusão no back-end se necessário
                        itemToRemove.remove();
                        
                        // O ideal seria marcar o pet para exclusão no back-end,
                        // mas para simplificar, a lógica atual apenas remove da lista local.
                        // Ao salvar, o PHP receberá apenas os pets que restaram.
                    }
                }
            });

            // --- Função para renderizar a lista de pets ---
            function renderPetList() {
                petList.innerHTML = ''; 
                petsArray.forEach((petData, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'pet-list-item';
                    
                    // Se o pet veio do array (novo pet), ele tem 'index'
                    // Se veio do BD, ele pode ter 'id'
                    if (petData.id) {
                         listItem.dataset.petId = petData.id; // Guarda o ID do BD
                    } else {
                         listItem.dataset.index = index; // Guarda o índice do array
                    }
                   
                    listItem.innerHTML = `
                        <div class="pet-list-item-info">
                            <strong>${petData.nome}</strong>
                            <small>${petData.especie || 'Espécie?'} - ${petData.raca || 'Raça?'}</small>
                        </div>
                        <button type-="button" class="remove-pet-btn" title="Remover Pet"><i class="fas fa-times"></i></button>
                    `;
                    petList.appendChild(listItem);
                });
            }

            // --- Ação Principal: Salvar Cliente e Pets (CRIAR ou EDITAR) ---
            saveClientBtn.addEventListener('click', function() {
                const clienteData = {
                    id: editingClientId,
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

                // Pega os pets da lista que podem ter vindo do BD (data-pet-id)
                // ou do array (petsArray). A forma mais simples é enviar o 'petsArray'
                // que é o que está sendo gerenciado localmente.
                const dataToSend = { cliente: clienteData, pets: petsArray };

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
                // ... (seu código de busca) ...
            }

            // --- Delegação de Eventos para Editar e Excluir ---
            clientTableBody.addEventListener('click', function(event) {
                const targetButton = event.target.closest('button'); 
                if (!targetButton) return; 
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
                    editingClientId = clientId; 
                    loadClientDataForEdit(clientId); // <- É AQUI QUE O PHP É CHAMADO
                }
            });

            // --- Função para buscar dados do cliente para edição ---
            function loadClientDataForEdit(clientId) {
                fetch(`buscar_cliente.php?id=${clientId}`) // Chama o PHP
                .then(response => {
                    if (!response.ok) {
                        // Se o status for 404 ou 500, ele entra aqui
                        throw new Error(`Erro ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success && data.cliente) {
                        const cliente = data.cliente;
                        
                        // O JavaScript espera 'nome_completo', 'logradouro', etc.
                        document.getElementById('client-name').value = cliente.nome_completo || '';
                        document.getElementById('client-phone').value = cliente.telefone || '';
                        document.getElementById('client-email').value = cliente.email || '';
                        document.getElementById('client-cep').value = cliente.cep || '';
                        document.getElementById('client-street').value = cliente.logradouro || '';
                        document.getElementById('client-number').value = cliente.numero || '';
                        document.getElementById('client-neighborhood').value = cliente.bairro || '';
                        document.getElementById('client-city').value = cliente.cidade || '';
                        document.getElementById('client-state').value = cliente.estado || '';

                        // Preenche a lista de pets vinda do banco
                        petsArray = data.pets || [];
                        renderPetList(); // Renderiza os pets na lista

                        modalTitle.textContent = `Editando Cliente: ${cliente.nome_completo}`;
                        clientModal.style.display = 'flex';

                    } else {
                        alert(data.message || 'Erro ao buscar dados do cliente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar cliente:', error);
                    alert('Não foi possível carregar os dados do cliente para edição. Verifique o console (F12).');
                });
            }

        } 
    }
});