# Autenticador de Senha em JavaScript

Este é um projeto de estudo que implementa um sistema autenticador de senha usando JavaScript. O projeto utiliza as seguintes dependências:

## Dependências

- **bcrypt** 
- **dotenv** 
- **express**
- **jsonwebtoken** 
- **mongoose** 

## Dependências de Desenvolvimento

- **nodemon** 

## Instalação

1. Clone o repositório para sua máquina local.


2. Navegue até o diretório do projeto.

    ```bash
    cd nome-do-repositorio
    ```

3. Instale as dependências.

    ```bash
    npm install
    ```

4. Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis .

    ```env
    DB_PASS:sua senha do mongoDB
    DB_USER=seu usuário mongoDB
    SECRET=sua-chave-secreta-jwt
    ```

## Execução

1. Inicie o servidor.

    ```bash
    npm start
    ```





**Nota:** Este projeto foi criado como parte de um estudo e não deve ser usado em ambientes de produção sem uma revisão adequada e implementação de práticas de segurança.