# Sistema Cadastro de Funcionário
- Essa sistema proporciona um meio eficiente de gerenciar funcionários e departamentos em um sistema de RH ou em qualquer outro contexto organizacional.

## Para executar a aplicação
- ### Via Docker
    - A imagem Docker se encontra no [DockerHub](https://hub.docker.com/repository/docker/angelozero/cadastro-funcionario-app/general) ou no arquivo [Dockerfile](https://github.com/angelozero/frontend/blob/main/Dockerfile) da aplicação.
    - Acessar a rota `localhost` direto no navegaor.
- ### Via Docker Compose
    - **O arquivo ja contempla**:
        - Banco de Dados
        - Aplicação Backend
        - Aplicação Frontend
    - Acessar o arquivo [docker-compose.yml](https://github.com/angelozero/frontend/blob/main/docker-compose.yaml)
    - *Para sistemas operacionais MacOs execute o  seguinte comando antes de subir o container*
        ```shell
            export DOCKER_DEFAULT_PLATFORM=linux/amd64
        ```
- ### Local
    - Abrir o arquivo [cadastro-funcionario.html](https://github.com/angelozero/frontend/blob/main/cadastro-funcionario.html) diretamente no navador

## Fluxograma do Sistema
![fluxograma-frontend.drawio](./images/fluxograma-frontend.drawio.png)

## Integração API ViaCEP
- A api [ViaCEP](viacep.com.br/ws/13063000/json/) é uma api externa que suporta as seguintes funções:
    - Modo geral: Retorna dados de endereço de acordo com o cep informado
    - Frontend:
        - Serviço utilizado para validação do cep e auto preenchimento dos demais campos referente ao endereço do funcionário
    - Backend:
        - Serviço utilizado para validação do cep e auto preenchimento do campos
            - UF
            - Cidade
            - Estado
        - Serviço utilizado para validar fluxos:
            - POST: Criação de um funcionário vinculado a um endereço
            - PUT: Alteração de um funcionário vinculado a um endereço

## Integração com o backend
- Para a comunicação com o backend usar o projeto [GitHub - angelozero/backend](https://github.com/angelozero/backend)

- Para execução da API acessar [README.md](https://github.com/angelozero/backend/blob/main/README.md) 

## Info Cadastro de Funcionário

O sistema de Cadastro de Funcionários permite operações básicas de criação, atualização, listagem e exclusão de funcionários associados a um departamentos específico.

Cada funcionário é identificado por um nome, e-mail e está vinculado a um departamento.

Os principais recursos incluem:

- Listagem de Funcionários: Permite visualizar uma lista paginada de funcionários com opções de filtragem por nome, e-mail e departamento.
- Criação de Funcionários: Permite adicionar novos funcionários associados a um departamento específico.
- Detalhes do Funcionário: Oferece informações detalhadas sobre um funcionário específico com base no seu ID.
- Atualização de Funcionários: Permite modificar as informações de um funcionário existente, incluindo nome, sobrenome, e-mail, departamento e dados do endereço.
- Exclusão de Funcionários: Permite remover um funcionário com base no seu ID.

Além disso, o sistema oferece recursos relacionados a endereços e departamentos:

- Validação CEP: Consulta e validação do cep através da api [ViaCEP](viacep.com.br/ws/13063000/json/)
- Listagem de Departamentos: Permite visualizar uma lista de todos os departamentos disponíveis.

Imagens do sistema:
- Cadastro de um funcionário:
    ![layout](./images/layout.png)

- Edição de um funcionário:
    ![edit](./images/edit.png)

## Serviços

| DADO | Funcionalidade | Serviço | Detalhes |
| ---- | -------------- | ------- | ---------|
|Funcionario     |POST        |/api/funcionario        | Cria um novo funcionário|
|Funcionario     |DELETE      |/api/funcionario/{id}   | Exclui um funcionário existente|
|Funcionario     |GET ID      |/api/funcionario/{id}   | Detalhes do funcionário|
|Funcionario     |PUT         |/api/funcionario/{id}   | Atualiza um funcionário existente|
|Funcionario     |GET         |/api/funcionarios       | Listando funcionários|
|Departamento    |GET         |/api/departamentos      | Lista todos os departamentos|
|CEPT            |GET         |/viacep.com.br/ws/{CEP}/json/ | Consulta do cep|