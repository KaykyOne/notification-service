import { sendMessageService, start, stopWhatsappBotService } from "../../services/whatsapp.service.ts";
import { askForMessagePayload } from "../components/MessageForm.ts";
import {
    pause,
    printCliHeader,
    printInfo,
} from "../components/Feedback.ts";
import { generateKey } from "../../services/key.service.ts";

async function clearConsoleAction() {
    console.clear();
    printCliHeader();

    return { message: "CLI limpa." };
}

async function submitMessageAction() {
    const payload = await askForMessagePayload();

    await sendMessageService(payload);

    if (payload.forAt) {
        return { message: "Mensagem agendada com sucesso." };
    }

    return { message: "Mensagem adicionada na fila com sucesso." };
}

async function stopWhatsappBotAction() {
    await stopWhatsappBotService();
    return { message: "Bot do WhatsApp parado." };
}

async function startWhatsappBotAction() {
    await start();
    return { message: "Bot do WhatsApp iniciado." };
}

async function createAndSendKey() {
    await generateKey();
}

async function shutdownAction() {
    printInfo("Desligando CLI...");
    await pause(1000);
    process.exit(0);
}

export {
    clearConsoleAction,
    shutdownAction,
    startWhatsappBotAction,
    stopWhatsappBotAction,
    submitMessageAction,
    createAndSendKey,
};
