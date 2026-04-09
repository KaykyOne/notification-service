// import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS } from "./whatsapp/baileys";
import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS, state, destruirSessao, getBotStatus } from "./whatsapp/whatsapp_web.ts";

import transporter from "./email/email.ts";

const whatsapp = { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS, state, destruirSessao, getBotStatus }
const email = transporter;

export { whatsapp, email };
