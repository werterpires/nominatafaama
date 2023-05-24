# nominatafaama

## Backend

- Instale as dependências: 
> `npm install`

- Crie o arquivo `backend/.env` e preencha o valor das variáveis abaixo:
```shell
MYSQL_ROOT_PASSWORD=VALOR
MYSQL_DATABASE=VALOR
MYSQL_USER=VALOR
MYSQL_PASSWORD=VALOR
MYSQL_HOST=VALOR
JWT_SECRET=VALOR
```

- Inicie o MySQL:
> `docker-compose up`

- Inicie as Migrations:
> `npx knex migrate:latest`

- Inicie a aplicação:
> `npm run dev`

## Frontend

- Instale as dependências:
> `npm install`

- Inicie a aplicação:
> `npm start`

- Crie um usuário:
> Navegue até `http://localhost:4200/logon`

- Ative seu usuário no banco de dados:
> Abra seu aplicativo de conexão com MySQL e na tabela `users`, coloque '1' nas colunas `user_approved`, `consent_term` e `cookies`

- Faça login:
> Navegue até `http://localhost:4200/login` e preencha com os dados de login