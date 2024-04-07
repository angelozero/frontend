let currentPage = 1;
let totalPages = 1;

// Função para exibir o pop-up com a mensagem
function exibirPopup(message, success) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.backgroundColor = success ? '#4CAF50' : '#f44336';
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

// Função para carregar os funcionários e informações de paginação
function carregarFuncionarios(page, total, departamento, nome, email) {
    const url = `http://127.0.0.1:8080/funcionarios?pagina=${page}&total=${total}&departamento=${departamento}&nome=${nome}&email=${email}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Preencher a lista de funcionários
            const funcionariosList = document.getElementById('funcionarios-list');
            funcionariosList.innerHTML = ''; // Limpar a lista antes de preencher

            data.results.forEach(funcionario => {
                const listItem = document.createElement('div');
                listItem.classList.add('list-item');
                listItem.innerHTML = `
                    <div>${funcionario.id}</div>
                    <div>${funcionario.name}</div>
                    <div>${funcionario.email}</div>
                    <div>${funcionario.department.name}</div>
                    <div class="action-buttons">
                        <button class="info-button">Info</button>
                        <button class="delete-button" data-id="${funcionario.id}">Deletar</button>
                    </div>
                `;
                funcionariosList.appendChild(listItem);
            });

            // Atualizar informações de paginação
            const paginationText = document.getElementById('pagination-text');
            currentPage = data.page;
            totalPages = data.total_pages;
            paginationText.innerText = `Página ${currentPage} de ${totalPages}`;

            // Habilitar ou desabilitar os botões Anterior e Próximo conforme necessário
            const anteriorBtn = document.getElementById('anterior-btn');
            const proximoBtn = document.getElementById('proximo-btn');
            anteriorBtn.disabled = currentPage === 1;
            proximoBtn.disabled = currentPage === totalPages;

            // Adicionar event listener para o botão "Deletar" de cada funcionário
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const funcionarioId = button.dataset.id;
                    deletarFuncionario(funcionarioId);
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar funcionários:', error.message);
        });
}

// Função para carregar os departamentos
function carregarDepartamentos() {
    fetch('http://127.0.0.1:8080/departamentos')
        .then(response => response.json())
        .then(data => {
            const departamentoSelect = document.getElementById('departamento');
            const departamentoEditSelect = document.getElementById('departamento-edit');
            departamentoSelect.innerHTML = '';
            departamentoEditSelect.innerHTML = '';
            data.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.id;
                option.textContent = `${departamento.id} - ${departamento.name}`;
                departamentoSelect.appendChild(option);

                const editOption = document.createElement('option');
                editOption.value = departamento.id;
                editOption.textContent = `${departamento.id} - ${departamento.name}`;
                departamentoEditSelect.appendChild(editOption);
            });
        })
        .catch(error => {
            console.log(error);
            console.error('Erro ao carregar departamentos:', error);
        });
}

// Função para abrir a janela de edição do funcionário
function abrirJanelaEdicao(id) {
    currentEditingId = id; // Armazenar o ID do funcionário sendo editado
    const editWindow = document.getElementById('edit-window');
    editWindow.style.display = 'block';

    // Carregar dados do funcionário para edição
    fetch(`http://127.0.0.1:8080/funcionario/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('nome-edit').value = data.name;
            document.getElementById('sobrenome-edit').value = data.second_name;
            document.getElementById('email-edit').value = data.email;

            // Obter o ID do departamento vinculado ao funcionário
            const departamentoVinculadoId = data.department.id;

            // Preencher dropdown do departamento com todos os departamentos
            fetch(`http://127.0.0.1:8080/departamentos`)
                .then(response => response.json())
                .then(departamentos => {
                    const departamentoEditSelect = document.getElementById('departamento-edit');
                    departamentoEditSelect.innerHTML = ''; // Limpar dropdown antes de preencher

                    departamentos.forEach(departamento => {
                        const option = document.createElement('option');
                        option.value = departamento.id;
                        option.textContent = `${departamento.id} - ${departamento.name}`;
                        departamentoEditSelect.appendChild(option);

                        // Selecionar o departamento vinculado ao funcionário
                        if (departamento.id === departamentoVinculadoId) {
                            option.selected = true;
                        }
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar departamentos:', error.message);
                });
        })
        .catch(error => {
            console.error('Erro ao carregar dados do funcionário:', error.message);
        });
}

// Função para deletar um funcionário
function deletarFuncionario(id) {
    fetch(`http://127.0.0.1:8080/funcionario/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar funcionário');
            }
            exibirPopup('Funcionário deletado com sucesso!', true);
            // Recarregar a lista após a exclusão
            carregarFuncionarios(currentPage, 10, '', '', '');
        })
        .catch(error => {
            console.error(error);
            exibirPopup('Erro ao deletar funcionário', false);
        });
}

// Função para verificar se existem itens ou páginas a serem exibidos após a exclusão do último registro
function verificarItensEPaginas(page, total, departamento, nome, email) {
    fetch(`http://127.0.0.1:8080/funcionarios?pagina=${page}&total=${total}&departamento=${departamento}&nome=${nome}&email=${email}`)
        .then(response => response.json())
        .then(data => {
            const anteriorBtn = document.getElementById('anterior-btn');
            const proximoBtn = document.getElementById('proximo-btn');

            anteriorBtn.disabled = data.page === 1;
            proximoBtn.disabled = data.page === data.total_pages;
        })
        .catch(error => {
            console.error('Erro ao verificar itens e páginas:', error.message);
        });
}

// Função para exibir o pop-up com a mensagem
function exibirPopup(message, success) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.backgroundColor = success ? '#4CAF50' : '#f44336';
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

// Função para enviar o formulário de cadastro
function cadastrarFuncionario() {
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const departamentoSelecionado = document.getElementById('departamento').value;

    // Extrair apenas o nome do departamento
    const nomeDepartamento = parseInt(departamentoSelecionado.split(' ')[0]);

    fetch('http://127.0.0.1:8080/funcionario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            department_id: nomeDepartamento, // Enviar apenas o nome do departamento
            email: email,
            name: nome,
            second_name: sobrenome
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
            exibirPopup('Funcionário cadastrado com sucesso!', true);
            document.getElementById('nome').value = '';
            document.getElementById('sobrenome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('departamento').value = '';
            // Recarregar a lista após o cadastro
            carregarFuncionarios(currentPage, 10, '', '', '');
        })
        .catch(error => {
            console.error(error);
            exibirPopup(`${error.message}`, false);
        });
}

// Estado dos campos de filtro
let filtroNome = '';
let filtroEmail = '';
let filtroDepartamento = '';

// Função para lidar com a alteração nos campos de filtro
function handleFilterChange() {
    const novoFiltroNome = document.getElementById('filtro-nome').value;
    const novoFiltroEmail = document.getElementById('filtro-email').value;
    const novoFiltroDepartamento = document.getElementById('filtro-departamento').value;

    // Verificar se houve alguma alteração nos filtros
    if (novoFiltroNome !== filtroNome || novoFiltroEmail !== filtroEmail || novoFiltroDepartamento !== filtroDepartamento) {
        // Atualizar os estados dos filtros
        filtroNome = novoFiltroNome;
        filtroEmail = novoFiltroEmail;
        filtroDepartamento = novoFiltroDepartamento;

        // Carregar os funcionários com os novos filtros
        carregarFuncionarios(1, 10, filtroDepartamento, filtroNome, filtroEmail);
    }
}

// Adicionar event listeners para os campos de filtro
document.getElementById('filtro-nome').addEventListener('input', handleFilterChange);
document.getElementById('filtro-email').addEventListener('input', handleFilterChange);
document.getElementById('filtro-departamento').addEventListener('change', handleFilterChange);

// Carregar a lista inicial de funcionários
carregarFuncionarios(1, 10, '', '', '');


// Event listener para o botão de editar na lista de funcionários
document.getElementById('funcionarios-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('info-button')) {
        const listItem = event.target.closest('.list-item');
        const funcionarioId = listItem.querySelector('div:first-child').textContent;
        abrirJanelaEdicao(funcionarioId);
    }
});

// Event listener para o botão de cadastrar
document.getElementById('cadastrar-btn').addEventListener('click', () => {
    cadastrarFuncionario();
});

// Event listener para o botão Voltar na janela de edição
document.getElementById('voltar-btn').addEventListener('click', () => {
    const editWindow = document.getElementById('edit-window');
    editWindow.style.display = 'none';
});

let currentEditingId = null; // Variável global para armazenar o ID do funcionário sendo editado

// Event listener para o botão de editar na lista de funcionários
document.getElementById('funcionarios-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('info-button')) {
        const listItem = event.target.closest('.list-item');
        currentEditingId = parseInt(listItem.querySelector('div:first-child').textContent);
        abrirJanelaEdicao(currentEditingId);
    }
});

// Event listener para o botão de editar na janela de edição
document.getElementById('editar-btn').addEventListener('click', () => {
    const id = currentEditingId;
    const nome = document.getElementById('nome-edit').value;
    const sobrenome = document.getElementById('sobrenome-edit').value;
    const email = document.getElementById('email-edit').value;
    const departamento = document.getElementById('departamento-edit').value;

    // Extrai apenas o número do departamento
    const departamentoNumero = parseInt(departamento.split(' ')[0]);

    fetch(`http://127.0.0.1:8080/funcionario/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            department_id: departamentoNumero,
            email: email,
            name: nome,
            second_name: sobrenome
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
            exibirPopup('Funcionário atualizado com sucesso!', true);
            // Recarregar a lista após a edição
            carregarFuncionarios(currentPage, 10, '', '', '');
        })
        .catch(error => {
            console.error(error);
            exibirPopup(`${error.message}`, false);
        });

    // Fechar a janela de edição após clicar em Editar
    const editWindow = document.getElementById('edit-window');
    editWindow.style.display = 'none';
});


// Carregar os departamentos quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarDepartamentos();
    carregarFuncionarios(1, 10, '', '', '');
});

// Event listener para o botão Anterior
document.getElementById('anterior-btn').addEventListener('click', () => {
    carregarFuncionarios(currentPage - 1, 10, '', '', '');
});

// Event listener para o botão Próximo
document.getElementById('proximo-btn').addEventListener('click', () => {
    carregarFuncionarios(currentPage + 1, 10, '', '', '');
});
