import { email } from "../infra/index.ts";
import React from "react";
import { render } from "@react-email/render";
import BaseEmailTemplate from "../infra/email/templates/baseEmailTemplate.ts";
import env from "../env.ts";

const remetente = env.EMAIL_REMETENTE;
const dev = env.EMAIL_WARNING === "true";
const rootEmail = env.ROOT_EMAIL;

async function renderEmailTemplate({ title, message }) {
    return render(
        React.createElement(BaseEmailTemplate, {
            title,
            message,
        })
    );
}

async function sendRootEmailService(message: string) {
    const html = await renderEmailTemplate({
        title: "Mensagem para o Administrador",
        message,
    });

    await email.sendMail({
        from: `"${remetente}" <${process.env.EMAIL_USER}>`,
        to: rootEmail,
        subject: "Mensagem para o Administrador",
        text: message,
        html,
    });
}

async function sendTestEmailService() {
    if(dev) return;
    const html = await renderEmailTemplate({
        title: "Teste SMTP",
        message: "Se chegou, funcionou.",
    });

    await email.sendMail({
        from: `"${remetente}" <${process.env.EMAIL_USER}>`,
        to: rootEmail,
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

export { sendTestEmailService, send, sendRootEmailService };


