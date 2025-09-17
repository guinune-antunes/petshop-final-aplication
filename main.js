document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODO ESCURO ... (continua a mesma) ---

    // --- LÓGICA DO MODAL DA AGENDA ... (continua a mesma) ---

    // --- LÓGICA DA PÁGINA DE CLIENTES E PETS ---
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
        // ... (código para abrir e fechar modais) ...
        const clientForm = document.getElementById('client-form');
        const petForm = document.getElementById('pet-form');
        const petList = document.getElementById('pet-list');
        const saveClientBtn = document.getElementById('saveClientBtn');
        let petsArray = [];

        // --- NOVA FUNCIONALIDADE: RAÇAS DINÂMICAS ---
        const petSpeciesSelect = document.getElementById('pet-species');
        const petBreedSelect = document.getElementById('pet-breed');
        const breeds = {
            'Cão': ['SRD (Vira-lata)', 'Poodle', 'Golden Retriever', 'Labrador', 'Shih Tzu', 'Bulldog', 'Yorkshire'],
            'Gato': ['SRD (Vira-lata)', 'Siamês', 'Persa', 'Angorá', 'Sphynx']
        };

        petSpeciesSelect.addEventListener('change', function() {
            const selectedSpecies = this.value;
            petBreedSelect.innerHTML = ''; // Limpa as opções atuais
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

        // --- Lógica para adicionar pet na lista ---
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
            // **BUG CORRIGIDO AQUI: MOSTRANDO NOME E RAÇA**
            listItem.innerHTML = `
                <div class="pet-list-item-info">
                    <strong>${petData.nome}</strong>
                    <small>${petData.especie} - ${petData.raca || 'Raça não definida'}</small>
                </div>
                <button type="button" class="remove-pet-btn" title="Remover Pet da Lista"><i class="fas fa-times"></i></button>
            `;
            petList.appendChild(listItem);
            petForm.reset();
            petBreedSelect.innerHTML = '<option value="">Selecione a espécie primeiro</option>';
            petBreedSelect.disabled = true;
        });

        // ... (código para remover pet da lista) ...
        
        // --- LÓGICA DE SALVAR CLIENTE ATUALIZADA ---
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
                estado: document.getElementById('client-state').value.trim()
            };

            const dataToSend = { cliente: clienteData, pets: petsArray };

            fetch('salvar_cliente.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            })
            .then(response => {
                if (!response.ok) { // Verifica se a resposta HTTP foi um erro (ex: 404, 500)
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                alert(result.message);
                if (result.success) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Erro na requisição fetch:', error);
                alert('Ocorreu um erro de comunicação. Verifique o console (F12) para mais detalhes.');
            });
        });
    }
});