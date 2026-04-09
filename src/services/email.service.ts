import { email } from "../infra/index.ts";
import React from "react";
import { render } from "@react-email/render";
import BaseEmailTemplate from "../infra/email/templates/baseEmailTemplate.ts";

const remetente = process.env.EMAIL_REMETENTE || "teste";
const dev = process.env.NODE_ENV === 'development';

async function renderEmailTemplate({ title, message }) {
    return render(
        React.createElement(BaseEmailTemplate, {
            title,
            message,
        })
    );
}

async function sendTestEmailService() {
    if(dev) return;
    const html = await renderEmailTemplate({
        title: "Teste SMTP",
        message: "Se chegou, funcionou.",
    });

    await email.sendMail({
        from: `"${remetente}" <${process.env.EMAIL_USER}>`,
        to: "kaykyzioti@gmail.com",
        subject: "Teste SMTP",
        text: "Se chegou, funcionou.",
        html,
    });
    console.log("E-mail de teste enviado com sucesso!");
}

async function send(message, destinatario) {
    if(dev) return;
    const html = await renderEmailTemplate({
        title: "Mensagem do Sistema",
        message,
    });

    await email.sendMail({
        from: `"${remetente}" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "Mensagem do Sistema",
        text: message,
        html,
    });
}

export { sendTestEmailService, send };


