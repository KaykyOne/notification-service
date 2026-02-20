import { sendTestEmailService, send } from "../services/email.service.js";

async function sendTestEmailController(req, res) {
    await sendTestEmailService();
    res.status(200).json({ message: "E-mail de teste enviado com sucesso!" });
}

async function sendTestEmail(req, res) {
    const message = req.body.message || "Mensagem de teste do sistema.";
    const destinatario = req.body.destinatario || process.env.EMAIL_DESTINO;

    await send(message, destinatario);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
}

export { sendTestEmailController, sendTestEmail };