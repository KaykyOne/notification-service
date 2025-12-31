import { prismaManager } from "../../prisma/prisma.js";
import { logger } from '../../logs/logger.js'
import { whatsapp } from "../infra/index.js";

whatsapp.startBot();

async function sendMessageService(text, phone) {
    const numeroFormatado = phone.includes('@s.whatsapp.net') ? phone : `${phone}@s.whatsapp.net`;
    try {
        await whatsapp.enviarMensagem(text, numeroFormatado);
        logger.info(`Mensagem enviada para ${phone}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        logger.error(`Erro ao enviar mensagem para ${phone}: ${error.message}`);
        throw new Error('Falha ao enviar mensagem');
    }
}


export { sendMessageService };