document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODO ESCURO (SEMPRE PRESENTE) ---
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
        // ... (código do modal da agenda, que já funciona) ...
    }

    // --- LÓGICA DA PÁGINA DE CLIENTES E PETS ---
    const clientPageContainer = document.getElementById('add-client-btn');
    if (clientPageContainer) {
        const clientModal = document.getElementById('client-modal');
        const petForm = document.getElementById('pet-form');
        const clientForm = document.getElementById('client-form');
        const petList = document.getElementById('pet-list');
        const saveClientBtn = document.getElementById('saveClientBtn');
        let petsArray = [];

        // Lógica para abrir modal e resetar


        // --- NOVA FUNCIONALIDADE: RAÇAS DINÂMICAS ---
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

        // --- Lógica CORRIGIDA para adicionar pet na lista ---
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
        
        // Lógica para remover o pet
        petList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-pet-btn');
            if (removeBtn) {
                // Futuramente, podemos adicionar uma lógica mais complexa para remover do array
                removeBtn.closest('.pet-list-item').remove();
            }
        });

        // --- Lógica ATUALIZADA para salvar cliente ---
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
                if (result.success) location.reload();
            })
            .catch(error => {
                console.error('Erro na requisição fetch:', error);
                alert('Ocorreu um erro de comunicação. Verifique o console (F12).');
            });
        });

        // Lógica da busca dinâmica (já implementada)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // ... (código da busca, como antes) ...
        }
    }
});