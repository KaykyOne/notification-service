import { email } from "../infra/index.js";

const remetente = process.env.EMAIL_REMETENTE || "teste";

async function sendTestEmailService() {
    await email.sendMail({
        from: `"${remetente}" <${process.env.EMAIL_USER}>`,
        to: "kaykyzioti@gmail.com",
        subject: "Teste SMTP",
        text: "Se chegou, funcionou.",
    });
    console.log("E-mail de teste enviado com sucesso!");
}

export { sendTestEmailService };


