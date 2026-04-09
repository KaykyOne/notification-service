function pause(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function printCliHeader() {
    console.log("--MICRO SERVICO DE MENSAGERIA--");
    console.log("Servidor rodando em http://0.0.0.0:3012\n");
}

function printInfo(message) {
    console.log(message);
}

function printSuccess(message) {
    console.log(`\n[ok] ${message}\n`);
}

function printError(message) {
    console.error(`\n[erro] ${message}\n`);
}

export {
    pause,
    printCliHeader,
    printError,
    printInfo,
    printSuccess,
};
