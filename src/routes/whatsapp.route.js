import { Router } from "express";
import { sendMessageService } from "../services/send.service.js";
import { logger } from "../../logs/logger.js";

const router = Router();

router.post("/send-message", async (req, res) => {
    const { text, phone } = req.body;
    logger.info(`Recebida requisição para enviar mensagem para ${phone}`);
    try {
        await sendMessageService(text, phone);
        res.status(200).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao enviar mensagem",
            error: error.message
        });
    }
});

export default router;
