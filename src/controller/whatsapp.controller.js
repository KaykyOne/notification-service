import { sendMessageService, clearBD, clearSessions, start } from "../services/whatsapp.service.js";
import { logger } from "../../logs/logger.js";

const sendMessage = async (req, res) => {
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
}

const clearMessages = async (req, res) => {
    await clearBD();
    res.status(200).json({ message: "Todas as mensagens foram excluidas com sucesso!" })
}

const startWhatsappBot = async (req, res) => {
    await start();
    res.status(200).json({ message: "Bot do WhatsApp iniciado com sucesso!" });
}

const deleteScheduledMessagesForPhone = async (req, res) => {
    const { phone } = req.params;
    await deleteScheduledMessagesForPhone(phone);
    res.status(200).json({ message: `Mensagens agendadas para o telefone ${phone} foram excluídas com sucesso!` });
}

export { sendMessage, clearMessages, startWhatsappBot, deleteScheduledMessagesForPhone }