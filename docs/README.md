# Notification Service

Documentacao simples do micro-servico de notificacoes.

## O que este servico faz

Hoje o projeto funciona principalmente como um micro-servico de envio e agendamento de mensagens WhatsApp.

Ele oferece:

- API HTTP com rotas para criar, listar e excluir mensagens
- Bot WhatsApp com sessao local
- Dashboard web para operar o bot e visualizar o QR code
- Fila de mensagens pendentes/agendadas salva em SQLite com Prisma
- Envio de emails de alerta em alguns eventos operacionais

## Stack

- Node.js
- Express
- Prisma
- SQLite
- whatsapp-web.js
- Nodemailer

## Estrutura rapida

- `app.js`: sobe a API e a rota do dashboard
- `src/routes`: rotas HTTP
- `src/controller`: camada de controllers
- `src/services`: regras de negocio
- `src/infra/whatsapp`: integracao com WhatsApp
- `src/views`: HTML, CSS e JS do dashboard
- `prisma/schema.prisma`: modelo do banco

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` com base no `.env.example`

Exemplo minimo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev"

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_WARNING=
EMAIL_PASS=
EMAIL_REMETENTE=
```

3. Inicie o servico:

```bash
npm run dev
```

ou

```bash
npm start
```

4. Acesse:

- API: `http://localhost:3012`
- Dashboard: `http://localhost:3012/dashboard`

## Banco de dados

O projeto usa SQLite via Prisma.

Modelo principal atual:

- `Message`
  - `id`
  - `text`
  - `type`
  - `createdAt`
  - `phone`
  - `autor`
  - `status`
  - `forAt`

Status mais usados:

- `PENDING`: pronta para envio
- `SCHEDULED`: agendada
- `SENT`: enviada
- `FAILED`: falhou

## Onde continuar

- [API](C:\Users\kayky\Desktop\notification-service\docs\api.md)
- [WhatsApp e Dashboard](C:\Users\kayky\Desktop\notification-service\docs\whatsapp.md)
- [Email e Ambiente](C:\Users\kayky\Desktop\notification-service\docs\email.md)
