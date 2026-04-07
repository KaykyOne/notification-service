import inquirer from "inquirer";

async function epserar(tempo) {
    await new Promise(resolve => setTimeout(resolve, tempo));
}

async function Menu(resposta) {
    const valor = parseInt(resposta);
    switch (valor) {
        case 0:
            console.log("Desligando tudo...");
            await epserar(1000);
            process.exit(0);

        case 1:
            console.log("Reiniciando terminal do servidor...");
            console.clear();
            console.log("Servidor rodando em http://0.0.0.0:3012");
            await epserar(1000);
            break;
    }
}

async function MainMenu() {
    let resposta = "";
    await epserar(2000);
    while (true) {
        console.log("--MICRO SERVIÇO DE MENSAGERIA--\n")
        console.log("1 - Limpar CLI")
        console.log("2 - Adicionar Mensagem")
        console.log("3 - Parar Bot Whatsapp")
        console.log("4 - Iniciar Bot Whatsapp")
        console.log("0 - Desligar tudo")

        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "response",
                message: "Digite:"
            }
        ]);

        resposta = answer.response;
        console.log(answer.response);
        await Menu(resposta);

    }

}

export default MainMenu;