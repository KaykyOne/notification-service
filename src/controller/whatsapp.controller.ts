import {
    sendMessageService,
    listMessagesService,
    deleteMessageService,
    stopWhatsappBotService,
    clearBD,
    start,
    deleteScheduledMessagesForPhone,
    connectWhatsappBotService,
    getWhatsappBotStatusService
} from "../services/whatsapp.service.ts";
import { logger } from "../logs/logger.ts";

async function sendMessage(req, res) {
    const { text, phone, forAt } = req.body;

    if (!text || !phone) {
        return res.status(400).json({ message: "As propriedades text ou phone nao foram encontradas!" });
    }

    logger.info(`Recebida requisicao para enviar mensagem para ${phone}`);
    try {
        await sendMessageService({ text, phone, forAt });
        return res.status(200).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao enviar mensagem",
            error: error.message
        });
    }
}

async function clearMessages(req, res) {
    await clearBD();
    return res.status(200).json({ message: "Todas as mensagens foram excluidas com sucesso!" });
}

async function listMessages(req, res) {
    const messages = await listMessagesService();
    return res.status(200).json({ data: messages });
}

async function startWhatsappBot(req, res) {
    const status = await start();
    return res.status(200).json({ message: "Bot do WhatsApp iniciado com sucesso!", data: status });
}

async function connectWhatsappBot(req, res) {
    const status = await connectWhatsappBotService();
    return res.status(200).json({ message: "Fluxo de conexao iniciado com sucesso!", data: status });
}

async function stopWhatsappBot(req, res) {
    const status = await stopWhatsappBotService();
    return res.status(200).json({ message: "Bot do WhatsApp parado com sucesso!", data: status });
}

async function deleteScheduledMessages(req, res) {
    const { phone } = req.params;
    await deleteScheduledMessagesForPhone(phone);
    return res.status(200).json({ message: `Mensagens agendadas para o telefone ${phone} foram excluidas com sucesso!` });
}

async function deleteMessage(req, res) {
    const { id } = req.params;
    await deleteMessageService(id);
    return res.status(200).json({ message: "Mensagem excluida com sucesso!" });
}

function getWhatsappBotStatus(req, res) {
    const status = getWhatsappBotStatusService();
    return res.status(200).json({ data: status });
}

export {
    sendMessage,
    listMessages,
    deleteMessage,
    clearMessages,
    startWhatsappBot,
    connectWhatsappBot,
    deleteScheduledMessages,
    stopWhatsappBot,
    getWhatsappBotStatus
};
