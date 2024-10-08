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
    const url = `http://127.0.0.1:8080/api/funcionarios?pagina=${page}&total=${total}&departamento=${departamento}&nome=${nome}&email=${email}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Preencher a lista de funcionários
            const funcionariosList = document.getElementById('funcionarios-list');
            funcionariosList.innerHTML = '';

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
    fetch('http://127.0.0.1:8080/api/departamentos')
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
    currentEditingId = id;
    const editWindow = document.getElementById('edit-window');
    editWindow.style.display = 'block';

    // Carregar dados do funcionário para edição
    fetch(`http://127.0.0.1:8080/api/funcionario/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('nome-edit').value = data.name;
            document.getElementById('sobrenome-edit').value = data.second_name;
            document.getElementById('email-edit').value = data.email;
            document.getElementById('cep-edit').value = data.address.zipcode;
            document.getElementById('rua-edit').value = data.address.street;
            document.getElementById('complemento-edit').value = data.address.complement;
            document.getElementById('numero-edit').value = data.address.number;
            document.getElementById('bairro-edit').value = data.address.neighborhood;
            document.getElementById('cidade-edit').value = data.address.city;
            document.getElementById('uf-edit').value = data.address.uf;

            // Obter o ID do departamento vinculado ao funcionário
            const departamentoVinculadoId = data.department.id;

            // Preencher dropdown do departamento com todos os departamentos
            fetch(`http://127.0.0.1:8080/api/departamentos`)
                .then(response => response.json())
                .then(departamentos => {
                    const departamentoEditSelect = document.getElementById('departamento-edit');
                    // Limpar dropdown antes de preencher
                    departamentoEditSelect.innerHTML = '';

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
    fetch(`http://127.0.0.1:8080/api/funcionario/${id}`, {
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
    fetch(`http://127.0.0.1:8080/api/funcionarios?pagina=${page}&total=${total}&departamento=${departamento}&nome=${nome}&email=${email}`)
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
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const complemento = document.getElementById('complemento').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const uf = document.getElementById('uf').value;

    // Extrair apenas o nome do departamento
    let nomeDepartamento = "";
    if (departamentoSelecionado){
        nomeDepartamento = parseInt(departamentoSelecionado.split(' ')[0]);
    }
    

    fetch('http://127.0.0.1:8080/api/funcionario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            department_id: nomeDepartamento, // Enviar apenas o nome do departamento
            email: email,
            name: nome,
            second_name: sobrenome,
            address: {
                zipcode: cep,
                street: rua,
                complement: complemento,
                number: numero,
                neighborhood: bairro,
                city: cidade,
                uf: uf
            }
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
            document.getElementById('cep').value = '';
            document.getElementById('rua').value = '';
            document.getElementById('complemento').value = '';
            document.getElementById('numero').value = '';
            document.getElementById('bairro').value = '';
            document.getElementById('cidade').value = '';
            document.getElementById('uf').value = '';
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
    const cep = document.getElementById('cep-edit').value;
    const rua = document.getElementById('rua-edit').value;
    const complemento = document.getElementById('complemento-edit').value;
    const numero = document.getElementById('numero-edit').value;
    const bairro = document.getElementById('bairro-edit').value;
    const cidade = document.getElementById('cidade-edit').value;
    const uf = document.getElementById('uf-edit').value;

    // Extrai apenas o número do departamento
    const departamentoNumero = parseInt(departamento.split(' ')[0]);

    fetch(`http://127.0.0.1:8080/api/funcionario/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            department_id: departamentoNumero,
            email: email,
            name: nome,
            second_name: sobrenome,
            address: {
                zipcode: cep,
                street: rua,
                complement: complemento,
                number: numero,
                neighborhood: bairro,
                city: cidade,
                uf: uf
            }
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

document.getElementById('predictionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('http://127.0.0.1:8080/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = `Predição de Satisfação: ${data.prediction}`;
        //console.log(JSON.stringify(data));
        //alert(`Predição de Satisfação: ${data.prediction}`)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});