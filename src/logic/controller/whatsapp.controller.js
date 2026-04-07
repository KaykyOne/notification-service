import { sendMessageService, stopWhatsappBotService, clearBD, start, deleteScheduledMessagesForPhone } from "../services/whatsapp.service.js";
import { logger } from "../logs/logger.js";

async function sendMessage(req, res) {
    const { text, phone, forAt } = req.body;

    if (!text || !phone) {
        res.status(400).json({ message: "As propriedades text ou phone não foram encontradas!" });
    }
    logger.info(`Recebida requisição para enviar mensagem para ${phone}`);
    try {
        await sendMessageService({ text, phone, forAt });
        res.status(200).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao enviar mensagem",
            error: error.message
        });
    }
};

async function clearMessages(req, res) {
    await clearBD();
    res.status(200).json({ message: "Todas as mensagens foram excluidas com sucesso!" })
};

async function startWhatsappBot(req, res) {
    await start();
    res.status(200).json({ message: "Bot do WhatsApp iniciado com sucesso!" });
};

async function stopWhatsappBot(req, res) {
    await stopWhatsappBotService();
    res.status(200).json({ message: "Bot do WhatsApp parado com sucesso!" });
};

async function deleteScheduledMessages(req, res) {
    const { phone } = req.params;
    await deleteScheduledMessagesForPhone(phone);
    res.status(200).json({ message: `Mensagens agendadas para o telefone ${phone} foram excluídas com sucesso!` });
};

export { sendMessage, clearMessages, startWhatsappBot, deleteScheduledMessages, stopWhatsappBot }