# Email e Ambiente

## Variaveis de ambiente

Arquivo base:

- `.env.example`

Campos atuais:

```env
DATABASE_URL=
JWT_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_WARNING=
EMAIL_PASS=
EMAIL_REMETENTE=
```

## O que cada variavel faz

- `DATABASE_URL`: caminho do banco SQLite usado pelo Prisma
- `JWT_SECRET`: reservado para autenticacao futura
- `EMAIL_HOST`: servidor SMTP
- `EMAIL_PORT`: porta do SMTP
- `EMAIL_USER`: usuario SMTP
- `EMAIL_PASS`: senha SMTP
- `EMAIL_REMETENTE`: nome exibido no remetente
- `EMAIL_WARNING`: email que recebe alertas operacionais

## Comportamento do email

O projeto tem uma integracao simples com Nodemailer.

Uso atual:

- enviar email de teste pela rota `/email/test`
- enviar alerta quando a reconexao do WhatsApp falha varias vezes
- enviar alerta ao parar o bot, quando configurado

## Observacao importante

Quando `NODE_ENV=development`, o envio de email e ignorado no codigo atual.
