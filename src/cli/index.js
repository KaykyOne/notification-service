import inquirer from "inquirer";

async function startCli() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "testInput",
      message: "Teste CLI: digite qualquer valor para continuar"
    }
  ]);

  console.log(`Resposta recebida: ${answer.testInput}`);
}

export { startCli };