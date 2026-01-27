import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS } from "./whatsapp/baileys.js";
import transporter from "./email/email.js";

const whatsapp = { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS }
const email = transporter;

export { whatsapp, email };