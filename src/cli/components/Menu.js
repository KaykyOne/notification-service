import inquirer from "inquirer";

const mainMenuChoices = [
  { name: "1 - Limpar CLI", value: "CLEAR_CONSOLE" },
  { name: "2 - Adicionar Mensagem", value: "ADD_MESSAGE" },
  { name: "3 - Parar Bot Whatsapp", value: "STOP_WHATSAPP_BOT" },
  { name: "4 - Iniciar Bot Whatsapp", value: "START_WHATSAPP_BOT" },
  new inquirer.Separator(),
  { name: "0 - Desligar tudo", value: "SHUTDOWN" },
];

async function askForMainMenuAction() {
  const { action } = await inquirer.prompt([
    {
      type: "select", // 👈 novo tipo
      name: "action",
      message: "O que você quer fazer?",
      choices: mainMenuChoices,
    },
  ]);

  return action;
}

export { askForMainMenuAction };