import { prismaManager } from "../../prisma/prisma.js";
import { logger } from '../../logs/logger.js'
import { whatsapp } from "../infra/index.js";
import { tempoHumano, iniciadorAleatorio } from "../common/humanization.js";
import { send } from "./email.service.js";

const { TEMPO_ENTRE_MENSAGENS, startBot, enviarMensagem } = whatsapp;
const emailWarning = process.env.EMAIL_WARNING;

let enviando = false;
let startet = false;

function formatNumber(phone) {
    let phoneFormated = phone;
    phoneFormated = phone.includes('@s.whatsapp.net') ? phone : `${phone}@s.whatsapp.net`;
    return phoneFormated.startsWith('55') ? phoneFormated : `55${phoneFormated}`;
}

async function sendMessageService({ text, phone, forAt }) {
    const numeroFormatado = formatNumber(phone);
    const dataFormatada = forAt ? new Date(forAt) : null;

    try {

        if (dataFormatada) {
            await prismaManager.message.create({
                data: {
                    text,
                    phone: numeroFormatado,
                    status: 'SCHEDULED',
                    type: 'WHATSAPP',
                    forAt: dataFormatada
                }
            });
            logger.info(`Mensagem agendada para ${numeroFormatado} com sucesso.`);

        } else {
            await prismaManager.message.create({
                data: {
                    text,
                    phone: numeroFormatado,
                    status: 'PENDING',
                    type: 'WHATSAPP'
                }
            });
            logger.info(`Mensagem enviada para ${numeroFormatado} com sucesso.`);
        }


    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        logger.error(`Erro ao enviar mensagem para ${phone}: ${error.message}`);
        throw new Error('Falha ao enviar mensagem');
    }
}

async function updateStatus(id, status) {
    await prismaManager.message.update({
        where: { id },
        data: { status }
    });
}

async function seeBD() {
    if (enviando) return;
    if (!startet) return;
    // console.log('Verificando mensagens pendentes...');
    try {
        enviando = true;
        const messagesPendentes = await prismaManager.message.findMany({
            where: {
                status: 'PENDING'
            }
        });
        // console.log(messagesPendentes);

        const messagesAgendadas = await prismaManager.message.findMany({
            where: {
                status: 'SCHEDULED',
                forAt: { lte: new Date() }
            },
            take: 5,
            orderBy: {
                forAt: 'asc'
            }
        });

        const messages = [...messagesPendentes, ...messagesAgendadas];
        // console.log(messages);

        if (messages.length === 0) {
            enviando = false;
            return;
        }
        console.log(`Encontradas ${messages.length} mensagens pendentes.`);
        for (const message of messages) {
            await enviarMensagem(iniciadorAleatorio(), message.phone);
            await new Promise(r => setTimeout(r, 2000)); // Espera 2 segundos antes de atualizar o status para 'SENT'
            await enviarMensagem(`${message.text}`, message.phone);
            await updateStatus(message.id, 'SENT');
            logger.info(`Mensagem ID ${message.id} enviada com sucesso para ${message.phone}`);

            const delay = tempoHumano();
            await new Promise(r => setTimeout(r, delay));
        }
    } catch (error) {
        logger.error(`Erro ao processar mensagens pendentes: ${error.message}`);
    } finally {
        enviando = false;
    }
}

async function clearBD() {
    await prismaManager.message.deleteMany({
        where: {
            status: 'PENDING'
        }
    });
}

async function start() {
    await send('Iniciando Bot', emailWarning);
    await startBot();
    startet = true;
    console.log('Bot do WhatsApp iniciado.');
}

async function deleteScheduledMessagesForPhone(phone) {
    await prismaManager.message.deleteMany({
        where: {
            status: 'SCHEDULED',
            phone: phone,
            forAt: { lt: new Date() }
        }
    });
}

setInterval(seeBD, 10000);


export { sendMessageService, clearBD, deleteScheduledMessagesForPhone, start };