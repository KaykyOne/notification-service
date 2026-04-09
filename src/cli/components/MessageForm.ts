import inquirer from "inquirer";

function validateRequiredField(value, fieldName) {
    if (!value?.trim()) {
        return `${fieldName} é obrigatório.`;
    }

    return true;
}

function validateDate(value) {
    if (!value?.trim()) {
        return true;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Informe uma data válida.";
    }

    return true;
}

async function askForMessagePayload() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "phone",
            message: "Telefone do destinatário:",
            validate: (value) => validateRequiredField(value, "Telefone"),
        },
        {
            type: "editor",
            name: "text",
            message: "Mensagem:",
            validate: (value) => validateRequiredField(value, "Mensagem"),
        },
        {
            type: "confirm",
            name: "hasSchedule",
            message: "Deseja agendar o envio?",
            default: false,
        },
        {
            type: "input",
            name: "forAt",
            message: "Data/hora do envio (ISO ou formato reconhecido pelo Node):",
            when: (answers) => answers.hasSchedule,
            validate: validateDate,
        },
    ]);

    return {
        phone: answers.phone.trim(),
        text: answers.text.trim(),
        forAt: answers.forAt?.trim() || undefined,
    };
}

export { askForMessagePayload };
