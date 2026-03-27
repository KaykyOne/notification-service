# WhatsApp e Dashboard

## Como o fluxo funciona

O servico usa `whatsapp-web.js` com autenticacao local.

Quando o bot inicia:

1. a sessao local e carregada
2. se precisar autenticar, um QR code e gerado
3. o dashboard consulta o status do bot em intervalos curtos
4. quando o cliente fica pronto, a fila de mensagens comeca a ser processada

## Dashboard

URL local:

```txt
http://localhost:3012/dashboard
```

O dashboard possui duas abas.

### 1. Bot e QR code

Permite:

- iniciar o bot
- conectar
- desconectar
- acompanhar status
- visualizar o QR code para autenticar o WhatsApp

## 2. Mensagens

Permite:

- cadastrar mensagem nova
- agendar envio com data e hora
- listar mensagens salvas
- excluir mensagens individualmente

## Fila de mensagens

O processamento roda em intervalo e verifica:

- mensagens `PENDING`
- mensagens `SCHEDULED` cuja data ja chegou

Se o bot estiver conectado, o servico envia:

1. uma mensagem inicial de humanizacao
2. a mensagem cadastrada

Depois disso o status vira `SENT`.

## Pastas relacionadas

- `src/infra/whatsapp/whatsapp_web.js`
- `src/services/whatsapp.service.js`
- `src/views/html/index.html`
- `src/views/css/index.css`
- `src/views/js/index.js`

## Observacoes

- a sessao fica em `sessions/whatsapp-web`
- o QR code tambem e exibido no terminal
- o dashboard renderiza o QR code consumindo o status da API
