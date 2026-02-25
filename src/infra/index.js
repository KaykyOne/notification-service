// import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS } from "./whatsapp/baileys.js";
import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS, state } from "./whatsapp/whatsapp_web.js";

import transporter from "./email/email.js";

const whatsapp = { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS, state }
const email = transporter;

export { whatsapp, email };