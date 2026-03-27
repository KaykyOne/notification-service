# API

Resumo simplificado das rotas principais do micro-servico.

Base local:

```txt
http://localhost:3012
```

## Health

### `GET /`

Retorna uma resposta simples indicando que a API esta no ar.

### `GET /ping`

Retorna `Pong`.

## Dashboard

### `GET /dashboard`

Entrega a pagina web usada para operar o bot e gerenciar mensagens.

## WhatsApp

### `POST /whatsapp`

Cria uma nova mensagem na fila.

Body:

```json
{
  "phone": "5511999999999",
  "text": "Mensagem de teste",
  "forAt": "2026-03-27T18:30:00.000Z"
}
```

Notas:

- `phone` e `text` sao obrigatorios
- `forAt` e opcional
- sem `forAt`, a mensagem entra como `PENDING`
- com `forAt`, a mensagem entra como `SCHEDULED`

### `GET /whatsapp/messages`

Lista as mensagens do tipo `WHATSAPP`.

### `DELETE /whatsapp/messages/:id`

Exclui uma mensagem especifica pelo `id`.

### `DELETE /whatsapp/clearAll`

Remove todas as mensagens com status `PENDING`.

### `DELETE /whatsapp/clearScheduled/:phone`

Remove mensagens agendadas de um telefone especifico.

## Bot WhatsApp

### `GET /whatsapp/status`

Retorna o estado atual do bot, incluindo:

- status
- autenticacao
- conexao
- QR code em matriz para o dashboard
- ultimo motivo de desconexao

### `POST /whatsapp/start`

Inicia o bot.

### `POST /whatsapp/connect`

Dispara o fluxo de conexao do WhatsApp.

### `POST /whatsapp/disconnect`

Desconecta a sessao atual.

Tambem existem rotas legadas:

- `GET /whatsapp/start`
- `DELETE /whatsapp/stop`

## Email

### `GET /email/test`

Dispara um email de teste quando o projeto nao esta em modo `development`.
