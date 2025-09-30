document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODO ESCURO (GLOBAL) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const body = document.body;
        const applyTheme = (theme) => {
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.remove('dark-mode');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        };

        // Aplica o tema salvo no localStorage ou o padrão 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        themeToggleBtn.addEventListener('click', () => {
            let newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- LÓGICA DO MODAL DA AGENDA (SÓ RODA NA PÁGINA DA AGENDA) ---
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    if (addAppointmentBtn) {
        const appointmentModal = document.getElementById('appointment-modal');
        if (appointmentModal) {
            const closeModalBtn = appointmentModal.querySelector('.close-modal-btn');
            const cancelBtn = appointmentModal.querySelector('.cancel-btn');

            addAppointmentBtn.addEventListener('click', () => appointmentModal.style.display = 'flex');
            closeModalBtn.addEventListener('click', () => appointmentModal.style.display = 'none');
            cancelBtn.addEventListener('click', () => appointmentModal.style.display = 'none');
            appointmentModal.addEventListener('click', (event) => {
                if (event.target === appointmentModal) appointmentModal.style.display = 'none';
            });
        }
    }

    // --- LÓGICA DA PÁGINA DE CLIENTES E PETS ---
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) { // Este IF garante que o código abaixo só rode na página de clientes
        
        // --- Seleção de Elementos ---
        const clientModal = document.getElementById('client-modal');
        const petForm = document.getElementById('pet-form');
        const clientForm = document.getElementById('client-form');
        const petList = document.getElementById('pet-list');
        const saveClientBtn = document.getElementById('saveClientBtn');
        let petsArray = []; // Array para guardar os dados dos pets

        // --- Abrir/Fechar Modal Principal ---
        if (clientModal) {
            clientModal.querySelector('.close-modal-btn').addEventListener('click', () => clientModal.style.display = 'none');
            clientModal.querySelector('.cancel-btn').addEventListener('click', () => clientModal.style.display = 'none');

            addClientBtn.addEventListener('click', () => {
                // Reseta tudo ao abrir o modal para um novo cadastro
                clientForm.reset();
                petForm.reset();
                petList.innerHTML = '';
                petsArray = [];
                document.getElementById('pet-breed').innerHTML = '<option value="">Selecione a espécie primeiro</option>';
                document.getElementById('pet-breed').disabled = true;
                clientModal.style.display = 'flex';
            });
        }

        // --- Funcionalidade: Raças Dinâmicas ---
        const petSpeciesSelect = document.getElementById('pet-species');
        const petBreedSelect = document.getElementById('pet-breed');
        const breeds = {
            'Cão': ['SRD (Vira-lata)', 'Poodle', 'Golden Retriever', 'Labrador', 'Shih Tzu', 'Bulldog', 'Yorkshire', 'Outro'],
            'Gato': ['SRD (Vira-lata)', 'Siamês', 'Persa', 'Angorá', 'Sphynx', 'Outro']
        };
        petSpeciesSelect.addEventListener('change', function() {
            const selectedSpecies = this.value;
            petBreedSelect.innerHTML = '';
            petBreedSelect.disabled = true;
            if (selectedSpecies && breeds[selectedSpecies]) {
                petBreedSelect.disabled = false;
                petBreedSelect.innerHTML = '<option value="">Selecione a raça</option>';
                breeds[selectedSpecies].forEach(function(breed) {
                    const option = document.createElement('option');
                    option.value = breed;
                    option.textContent = breed;
                    petBreedSelect.appendChild(option);
                });
            } else {
                 petBreedSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
            }
        });

        // --- Funcionalidade: Adicionar Pet à Lista Temporária ---
        petForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const petData = {
                nome: document.getElementById('pet-name').value.trim(),
                especie: document.getElementById('pet-species').value,
                raca: document.getElementById('pet-breed').value,
                nascimento: document.getElementById('pet-birthdate').value
            };
            if (petData.nome === '') { alert('O nome do pet é obrigatório.'); return; }
            
            petsArray.push(petData);
            
            const listItem = document.createElement('li');
            listItem.className = 'pet-list-item';
            listItem.dataset.index = petsArray.length - 1;
            listItem.innerHTML = `
                <div class="pet-list-item-info">
                    <strong>${petData.nome}</strong>
                    <small>${petData.especie || 'Espécie?'} - ${petData.raca || 'Raça?'}</small>
                </div>
                <button type="button" class="remove-pet-btn" title="Remover Pet"><i class="fas fa-times"></i></button>
            `;
            petList.appendChild(listItem);
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
                
                // Remove do array de dados
                if (!isNaN(indexToRemove) && indexToRemove < petsArray.length) {
                    petsArray.splice(indexToRemove, 1);
                }
                // Remove da lista visual
                itemToRemove.remove();
            }
        });

        // --- Ação Principal: Salvar Cliente e Pets via Fetch ---
        saveClientBtn.addEventListener('click', function() {
            const clienteData = {
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

            if (clienteData.nome === '') {
                alert('O nome do cliente é obrigatório.');
                return;
            }

            const dataToSend = { cliente: clienteData, pets: petsArray };

            fetch('salvar_cliente.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            })
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
                return response.json();
            })
            .then(result => {
                alert(result.message);
                if (result.success) {
                    location.reload(); // Recarrega a página para mostrar o novo cliente
                }
            })
            .catch(error => {
                console.error('Erro na requisição fetch:', error);
                alert('Ocorreu um erro de comunicação. Verifique o console (F12) para mais detalhes.');
            });
        });

        // --- Funcionalidade: Filtro de Busca Dinâmica ---
        const searchInput = document.getElementById('searchInput');
        const clientTableBody = document.getElementById('clientTableBody');
        if(searchInput && clientTableBody) {
            const tableRows = clientTableBody.getElementsByTagName('tr');
            searchInput.addEventListener('input', function() {
                const searchText = searchInput.value.toLowerCase();
                for (let i = 0; i < tableRows.length; i++) {
                    const row = tableRows[i];
                    const rowText = row.textContent.toLowerCase();
                    if (rowText.includes(searchText)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        }
    }
});