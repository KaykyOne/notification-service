import { prismaManager } from "../../prisma/prisma.js";
import { logger } from '../../logs/logger.js'
import { whatsapp } from "../infra/index.js";

whatsapp.startBot();

let enviando = false;

const formatNumber = (phone) => {
    let phoneFormated = phone;
    phoneFormated = phone.includes('@s.whatsapp.net') ? phone : `${phone}@s.whatsapp.net`;
    return phoneFormated.startsWith('55') ? phoneFormated : `55${phoneFormated}`;
}

async function sendMessageService({ text, phone }) {
    const numeroFormatado = formatNumber(phone);
    try {
        await prismaManager.message.create({
            data: {
                text,
                phone: numeroFormatado,
                status: 'PENDING',
                type: 'WHATSAPP',
            }
        })
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        logger.error(`Erro ao enviar mensagem para ${phone}: ${error.message}`);
        throw new Error('Falha ao enviar mensagem');
    }
}

const updateStatus = async (id, status) => {
    await prismaManager.message.update({
        where: { id },
        data: { status }
    });
}

const seeBD = async () => {
    if (enviando) return;
    console.log('Verificando mensagens pendentes...');
    try {
        enviando = true;
        const messages = await prismaManager.message.findMany({
            where: {
                status: 'PENDING'
            }
        });
        // console.log(messages);

        if (messages.length === 0) {
            enviando = false;
            return;
        }
        console.log(`Encontradas ${messages.length} mensagens pendentes.`);
        for (const message of messages) {
            await whatsapp.enviarMensagem(message.text, message.phone);
            await updateStatus(message.id, 'SENT');
            logger.info(`Mensagem ID ${message.id} enviada com sucesso para ${message.phone}`);
            await new Promise(r => setTimeout(r, 30000));
        }
    } catch (error) {
        logger.error(`Erro ao processar mensagens pendentes: ${error.message}`);
    } finally {
        enviando = false;
    }
}

const clearBD = async () => {
    await prismaManager.message.deleteMany({
        where:{
            status:'PENDING'
        }
    });
}

setInterval(seeBD, 10000);

export { sendMessageService, clearBD };