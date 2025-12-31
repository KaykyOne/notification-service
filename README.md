# Service Mensagens

API de serviço para envio de mensagens (Email, SMS, WhatsApp).

## Instalação

1. Instale as dependências:
```bash
npm install
```

## Configuração do Banco de Dados

Este projeto usa **Prisma ORM** com **SQLite**.

### Gerar o Banco de Dados

Execute este comando uma única vez para criar o banco:

```bash
npx prisma migrate dev --name init
```

Isso vai:
- Criar o arquivo do banco SQLite (`prisma/dev.db`)
- Gerar as tabelas conforme definido em `prisma/schema.prisma`
- Gerar o Prisma Client automaticamente

### Ver os Dados do Banco

Para visualizar e gerenciar os dados no banco:

```bash
npx prisma studio
```

Abre uma interface web onde você consegue ver e editar todos os registros.


## Executar o Projeto

```bash
npm start
```

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Pino** - Logger
