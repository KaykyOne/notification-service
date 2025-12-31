import { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS } from "./whatsapp/index.js";

const whatsapp = { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS }


export { whatsapp };