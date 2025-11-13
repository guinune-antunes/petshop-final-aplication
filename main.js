document.addEventListener('DOMContentLoaded', function() {

 // --- LÓGICA DO MODAL DA AGENDA ---
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentModal = document.getElementById('appointment-modal');
    
    if (addAppointmentBtn && appointmentModal) {
        
        // --- Pegamos o container da grade ---
        const calendarGrid = document.querySelector('.calendar-grid');
        
        // --- IDs dos campos do modal ---
        const modalTitle = appointmentModal.querySelector('.modal-header h2');
        const closeModalBtn = appointmentModal.querySelector('.close-modal-btn');
        const cancelBtn = document.getElementById('cancel-app-btn');
        const saveBtn = document.getElementById('save-app-btn');
        const clientSelect = document.getElementById('app-client');
        const petSelect = document.getElementById('app-pet');
        const appointmentForm = document.getElementById('appointment-form-content');

        // --- Variável de estado ---
        let modoModal = 'novo';
        let idAgendamentoAntigo = null;

        // --- Função para ABRIR modal (NOVO AGENDAMENTO) ---
        function openModalNovo() {
            modoModal = 'novo';
            idAgendamentoAntigo = null; // Limpa o ID
            
            modalTitle.textContent = 'Novo Agendamento'; // Título padrão
            appointmentForm.reset(); 
            petSelect.innerHTML = '<option value="">Selecione um cliente primeiro</option>';
            petSelect.disabled = true;
            appointmentModal.style.display = 'flex';
        }

        // --- Função para ABRIR modal (REMARCAR) ---
        function openModalRemarcar(card) {
            modoModal = 'remarcar';
            const dados = card.dataset;
            idAgendamentoAntigo = dados.id; // Armazena o ID do card clicado

            modalTitle.textContent = 'Editar / Remarcar Agendamento';

            // 1. Preenche os campos fáceis
            clientSelect.value = dados.clienteId;
            document.getElementById('app-service').value = dados.servico;
            document.getElementById('app-date').value = dados.date;
            document.getElementById('app-time').value = dados.time;
            document.getElementById('app-professional').value = dados.profissional;
            document.getElementById('app-notes').value = dados.obs;
            
            // 2. Preenche os pets (o campo mais difícil)
            petSelect.innerHTML = '<option value="">Carregando pets...</option>';
            petSelect.disabled = true;

            // Busca os pets daquele cliente
            fetch(`buscar_pets_cliente.php?cliente_id=${dados.clienteId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.pets.length > 0) {
                        petSelect.innerHTML = '<option value="">Selecione um pet...</option>';
                        data.pets.forEach(pet => {
                            const option = document.createElement('option');
                            option.value = pet.id;
                            option.textContent = pet.nome;
                            petSelect.appendChild(option);
                        });
                        
                        // 3. Seleciona o pet correto
                        petSelect.value = dados.petId; 
                        petSelect.disabled = false;
                    } else {
                        petSelect.innerHTML = '<option value="">Cliente sem pets</option>';
                    }
                })
                .catch(err => petSelect.innerHTML = '<option value="">Erro ao buscar pets</option>');

            // 4. Abre o modal
            appointmentModal.style.display = 'flex';
        }

        // --- Função para FECHAR o modal ---
        function closeModal() {
            appointmentModal.style.display = 'none';
        }

        // --- EVENTOS DE ABRIR/FECHAR ---

        // 1. Botão "Adicionar Agendamento"
        addAppointmentBtn.addEventListener('click', openModalNovo);
        
        // 2. Clicar em um Card existente (Delegação de evento)
        calendarGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.appointment-card');
            if (card) {
                // Não abre o modal se o card já foi remarcado
                if (card.classList.contains('status-remarcado')) {
                    return; 
                }
                openModalRemarcar(card);
            }
        });

        // 3. Botões de fechar
        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // --- Evento DINÂMICO: Buscar Pets (Sem mudanças) ---
        clientSelect.addEventListener('change', function() {
            // ... (seu código existente de buscar pets)...
            // (Este código continua funcionando perfeitamente)
            const clienteId = this.value;
            petSelect.innerHTML = '<option value="">Carregando...</option>';
            petSelect.disabled = true;

            if (!clienteId) {
                petSelect.innerHTML = '<option value="">Selecione um cliente primeiro</option>';
                return;
            }

            fetch(`buscar_pets_cliente.php?cliente_id=${clienteId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.pets.length > 0) {
                        petSelect.innerHTML = '<option value="">Selecione um pet...</option>';
                        data.pets.forEach(pet => {
                            const option = document.createElement('option');
                            option.value = pet.id;
                            option.textContent = pet.nome;
                            petSelect.appendChild(option);
                        });
                        petSelect.disabled = false;
                    } else if (data.success && data.pets.length === 0) {
                        petSelect.innerHTML = '<option value="">Este cliente não tem pets</option>';
                    } else {
                        petSelect.innerHTML = '<option value="">Erro ao buscar pets</option>';
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    petSelect.innerHTML = '<option value="">Erro de conexão</option>';
                });
        });

        // --- Evento: Botão SALVAR / REMARCAR (LÓGICA UNIFICADA) ---
        saveBtn.addEventListener('click', function() {
            // Pega os dados do formulário
            const dadosFormulario = {
                cliente_id: clientSelect.value,
                pet_id: petSelect.value,
                servico: document.getElementById('app-service').value,
                date: document.getElementById('app-date').value,
                time: document.getElementById('app-time').value,
                profissional: document.getElementById('app-professional').value,
                observacoes: document.getElementById('app-notes').value
            };

            // Validação
            if (!dadosFormulario.cliente_id || !dadosFormulario.pet_id || !dadosFormulario.servico || !dadosFormulario.date || !dadosFormulario.time) {
                alert('Por favor, preencha os campos obrigatórios (Cliente, Pet, Serviço, Data, Hora).');
                return;
            }
            
            let url = '';
            let body = {};

            // Decide qual script PHP chamar
            if (modoModal === 'remarcar') {
                url = 'remarcar_agendamento.php';
                body = {
                    id_antigo: idAgendamentoAntigo,
                    novos_dados: dadosFormulario
                };
            } else { // modoModal === 'novo'
                url = 'salvar_agendamento.php';
                body = dadosFormulario; // O script 'salvar_agendamento' espera os dados direto
            }

            // Envia para o PHP
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.success) {
                    closeModal();
                    location.reload(); // Recarrega a página
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                alert('Erro de comunicação ao salvar.');
            });
        });

    } // Fim do if (estamos na página da agenda)

    // ===================================================
    // --- LÓGICA DA PÁGINA DE ESTOQUE (PRODUTOS) ---
    // ===================================================
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) { // Este IF garante que o código abaixo só rode na página de estoque

        const productModal = document.getElementById('product-modal');
        const productTableBody = document.getElementById('productTableBody');
        const productSearchInput = document.getElementById('productSearchInput');
        
        if (productModal && productTableBody) {
            
            const productForm = document.getElementById('product-form');
            const saveProductBtn = document.getElementById('saveProductBtn');
            const modalTitle = document.getElementById('product-modal-title');
            let editingProductId = null;

            // --- Abrir/Fechar Modal ---
            const openModal = () => {
                editingProductId = null;
                modalTitle.textContent = 'Novo Produto';
                productForm.reset();
                productModal.style.display = 'flex';
            };
            const closeModal = () => {
                productModal.style.display = 'none';
            };

            addProductBtn.addEventListener('click', openModal);
            productModal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
            productModal.querySelector('.cancel-btn').addEventListener('click', closeModal);

            // --- Salvar (Novo ou Edição) ---
            saveProductBtn.addEventListener('click', function() {
                const produtoData = {
                    id: editingProductId,
                    nome: document.getElementById('product-nome').value.trim(),
                    marca: document.getElementById('product-marca').value.trim(),
                    quantidade: document.getElementById('product-quantidade').value,
                    unidade: document.getElementById('product-unidade').value,
                    data_chegada: document.getElementById('product-chegada').value,
                    data_vencimento: document.getElementById('product-vencimento').value
                    descricao: document.getElementById('product-descricao').value.trim(), // <-- ADICIONE ESTA LINHA
                };

                // Validação
                if (!produtoData.nome || !produtoData.quantidade || !produtoData.unidade || !produtoData.data_chegada) {
                    alert('Por favor, preencha os campos obrigatórios (*).');
                    return;
                }

                fetch('salvar_produto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produtoData)
                })
                .then(res => res.json())
                .then(result => {
                    alert(result.message);
                    if (result.success) {
                        location.reload(); // Recarrega a página
                    }
                }).catch(err => {
                    console.error('Fetch error:', err);
                    alert('Erro de comunicação.');
                });
            });
            
            // --- Delegação de Eventos (Editar e Excluir) ---
            productTableBody.addEventListener('click', function(event) {
                const targetButton = event.target.closest('button');
                if (!targetButton) return;

                const productId = targetButton.dataset.id;

                // --- Ação de EXCLUIR ---
                if (targetButton.classList.contains('btn-delete')) {
                    if (confirm(`Tem certeza que deseja excluir o produto ID ${productId}?`)) {
                        fetch(`excluir_produto.php?id=${productId}`)
                        .then(response => response.json())
                        .then(result => {
                            alert(result.message);
                            if (result.success) {
                                location.reload();
                            }
                        })
                        .catch(error => { console.error('Erro ao excluir:', error); alert('Erro de comunicação.'); });
                    }
                }

                // --- Ação de EDITAR (Carregar dados) ---
                if (targetButton.classList.contains('btn-edit')) {
                    fetch(`buscar_produto.php?id=${productId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.produto) {
                            const p = data.produto;
                            
                            // Preenche o formulário
                            editingProductId = p.id;
                            modalTitle.textContent = 'Editando Produto';
                            document.getElementById('product-nome').value = p.nome;
                            document.getElementById('product-marca').value = p.marca;
                            
                            // ===== LINHA ADICIONADA =====
                            document.getElementById('product-descricao').value = p.descricao || '';
                            // ============================
                            
                            document.getElementById('product-quantidade').value = p.quantidade;
                            document.getElementById('product-unidade').value = p.unidade;
                            document.getElementById('product-chegada').value = p.data_chegada;
                            document.getElementById('product-vencimento').value = p.data_vencimento;
                            
                            productModal.style.display = 'flex';
                        } else {
                            alert(data.message || 'Erro ao buscar dados do produto.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar produto:', error);
                        alert('Não foi possível carregar os dados do produto.');
                    });
                }
            });
            
            // --- Filtro de Busca Dinâmica ---
            if (productSearchInput) {
                const tableRows = productTableBody.getElementsByTagName('tr');
                productSearchInput.addEventListener('input', function() {
                    const searchTerm = productSearchInput.value.toLowerCase();
                    for (const row of tableRows) {
                        const rowText = row.textContent.toLowerCase();
                        if (rowText.includes(searchTerm)) {
                            row.style.display = "";
                        } else {
                            row.style.display = "none";
                        }
                    }
                });
            }
            
        } // Fim do if (modal e tabela existem)
    } // Fim do if (estamos na página de estoque)


    // --- LÓGICA DO MODO ESCURO (GLOBAL) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // ... (código do modo escuro, como antes) ...
    }
    
    // ===== BLOCO DUPLICADO REMOVIDO DAQUI =====

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
                    if (itemToRemove.dataset.index) {
                        const indexToRemove = parseInt(itemToRemove.dataset.index, 10);
                        if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < petsArray.length) {
                            petsArray.splice(indexToRemove, 1); // Remove do array de dados
                            renderPetList(); // Re-renderiza a lista visual
                        }
                    } else {
                        itemToRemove.remove();
                    }
                }
            });

            // --- Função para renderizar a lista de pets ---
            function renderPetList() {
                petList.innerHTML = ''; 
                petsArray.forEach((petData, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'pet-list-item';
                    
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
                    // Corrigido para 'nome_completo'
                    nome_completo: document.getElementById('client-name').value.trim(),
                    telefone: document.getElementById('client-phone').value.trim(),
                    email: document.getElementById('client-email').value.trim(),
                    cep: document.getElementById('client-cep').value.trim(),
                    // Corrigido para 'logradouro'
                    logradouro: document.getElementById('client-street').value.trim(),
                    numero: document.getElementById('client-number').value.trim(),
                    bairro: document.getElementById('client-neighborhood').value.trim(),
                    cidade: document.getElementById('client-city').value.trim(),
                    estado: document.getElementById('client-state').value.trim().toUpperCase()
                };

                // O JavaScript estava validando a chave 'nome', que agora não existe.
                // Devemos validar 'nome_completo'.
                if (clienteData.nome_completo === '') { 
                    alert('O nome do cliente é obrigatório.'); 
                    return; 
                }

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
                // Pega todas as linhas da tabela UMA VEZ
                const tableRows = clientTableBody.getElementsByTagName('tr');

                // Adiciona o "escutador" para o evento 'input'
                searchInput.addEventListener('input', function() {
                    
                    // 1. Pega o termo de busca e normaliza (minúsculas)
                    const searchTerm = searchInput.value.toLowerCase();

                    // 2. Itera (passa por) todas as linhas da tabela
                    for (const row of tableRows) {
                        
                        // 3. Pega todo o texto da linha e normaliza (minúsculas)
                        const rowText = row.textContent.toLowerCase();

                        // 4. Verifica se o texto da linha INCLUI o termo de busca
                        if (rowText.includes(searchTerm)) {
                            // Se incluir, mostra a linha
                            row.style.display = ""; // "" reseta para o padrão (table-row)
                        } else {
                            // Se NÃO incluir, esconde a linha
                            row.style.display = "none";
                        }
                    }
                });
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