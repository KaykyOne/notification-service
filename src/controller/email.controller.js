import { sendTestEmailService } from "../services/email.service.js";

async function sendTestEmailController(req, res) {
    await sendTestEmailService();
    res.status(200).json({ message: "E-mail de teste enviado com sucesso!" });
}

export { sendTestEmailController };