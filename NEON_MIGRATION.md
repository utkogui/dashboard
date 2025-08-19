# Migração para Neon PostgreSQL

Este documento contém instruções para migrar o banco de dados do SQLite para o Neon PostgreSQL.

## O que é o Neon?

[Neon](https://neon.tech) é uma plataforma de banco de dados PostgreSQL serverless que oferece:

- **Escalabilidade automática** - O banco de dados escala automaticamente conforme a demanda
- **Separação de armazenamento e computação** - Permite escalar independentemente
- **Ramificação instantânea** - Crie branches do seu banco de dados para testes
- **Modelo serverless** - Pague apenas pelo que usar

## Pré-requisitos

1. Conta no [Neon](https://neon.tech)
2. Node.js 18+ instalado
3. NPM 8+ instalado

## Passo 1: Criar um projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Dê um nome ao projeto (ex: "dash-ftd")
5. Escolha a região mais próxima de você
6. Clique em "Create Project"

## Passo 2: Obter a string de conexão

1. No dashboard do projeto, clique em "Connection Details"
2. Selecione "Node.js" na lista de linguagens
3. Copie a string de conexão (ela será algo como `postgresql://user:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require`)

## Passo 3: Configurar o arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
# Configuração do banco de dados Neon
DATABASE_URL="sua_string_de_conexao_aqui"
DIRECT_URL="sua_string_de_conexao_aqui"

# Configuração do servidor
PORT=3001

# Configuração do JWT
JWT_SECRET="seu_segredo_jwt_aqui_altere_em_producao"
JWT_EXPIRATION="24h"

# Configuração de CORS (separados por vírgula)
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"

# Ambiente
NODE_ENV="development"
```

Substitua `sua_string_de_conexao_aqui` pela string de conexão obtida no passo anterior.

## Passo 4: Configurar o schema.prisma para Neon

Execute o comando:

```bash
npm run neon:config
```

Este comando irá:
1. Fazer backup do schema.prisma atual para schema.sqlite.prisma
2. Atualizar o schema.prisma para usar PostgreSQL
3. Criar um arquivo .env.example com as configurações necessárias

## Passo 5: Migrar os dados para o Neon

Execute o comando:

```bash
npm run neon:setup
```

Este comando irá:
1. Configurar o schema.prisma para Neon PostgreSQL
2. Exportar os dados do SQLite
3. Criar as tabelas no Neon PostgreSQL
4. Importar os dados para o Neon PostgreSQL
5. Testar a conexão com o Neon PostgreSQL

## Passo 6: Executar a aplicação com Neon

Execute o comando:

```bash
npm run dev:full
```

A aplicação agora estará usando o banco de dados Neon PostgreSQL.

## Comandos úteis

- `npm run neon:config` - Configura o schema.prisma para Neon PostgreSQL
- `npm run neon:export` - Exporta os dados do SQLite
- `npm run neon:migrate` - Cria as tabelas no Neon PostgreSQL
- `npm run neon:import` - Importa os dados para o Neon PostgreSQL
- `npm run neon:test` - Testa a conexão com o Neon PostgreSQL
- `npm run neon:setup` - Executa todos os comandos acima em sequência
- `npm run sqlite:restore` - Restaura o schema.prisma para SQLite

## Solução de problemas

### Erro de conexão

Se você encontrar erros de conexão, verifique:

1. Se a string de conexão está correta
2. Se o IP do seu computador está na lista de IPs permitidos no Neon
3. Se o banco de dados está ativo

### Erro de migração

Se você encontrar erros ao executar as migrações:

1. Verifique se o diretório `prisma/migrations` está vazio
2. Execute `npx prisma migrate reset` para limpar o banco de dados
3. Execute `npm run neon:setup` novamente

### Voltar para SQLite

Se você precisar voltar a usar o SQLite:

```bash
npm run sqlite:restore
```

Este comando irá restaurar o schema.prisma para usar SQLite e regenerar o cliente Prisma.
