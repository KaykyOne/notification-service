import {
    clearConsoleAction,
    shutdownAction,
    startWhatsappBotAction,
    stopWhatsappBotAction,
    submitMessageAction,
} from "./actions/index.js";
import {
    printCliHeader,
    printSuccess,
    printError,
} from "./components/Feedback.js";
import { askForMainMenuAction } from "./components/Menu.js";

const actionHandlers = {
    CLEAR_CONSOLE: clearConsoleAction,
    ADD_MESSAGE: submitMessageAction,
    STOP_WHATSAPP_BOT: stopWhatsappBotAction,
    START_WHATSAPP_BOT: startWhatsappBotAction,
    SHUTDOWN: shutdownAction,
};

async function startCli() {
    printCliHeader();

    while (true) {
        const action = await askForMainMenuAction();
        const handler = actionHandlers[action];

        if (!handler) {
            printError("Opção inválida.");
            continue;
        }

        try {
            const result = await handler();

            if (result?.message) {
                printSuccess(result.message);
            }

            if (result?.shouldExit) {
                return;
            }
        } catch (error) {
            printError(error.message || "Erro ao executar a ação.");
        }
    }
}

export { startCli };
