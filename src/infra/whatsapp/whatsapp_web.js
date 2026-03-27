import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrCodeGerator from 'qrcode-terminal';
import { createRequire } from 'module';
import { logger } from '../../../logs/logger.js';
import { send } from '../../services/email.service.js';

const require = createRequire(import.meta.url);
const QRCode = require('qrcode-terminal/vendor/QRCode');

const TEMPO_ENTRE_MENSAGENS = 20000;
let client;
let tentativasReinicio = 0;

const state = {
    iniciado: false,
    inicializando: false,
    autenticado: false,
    conectado: false,
    ultimoQr: null,
    qrMatrix: null,
    status: 'idle',
    ultimaRazaoDesconexao: null
};

process.on('unhandledRejection', logger.error);
process.on('uncaughtException', logger.error);

const emailWarning = process.env.EMAIL_WARNING;

function setState(partialState) {
    Object.assign(state, partialState);
}

function resetConnectionState(nextStatus = 'idle') {
    setState({
        iniciado: false,
        inicializando: false,
        autenticado: false,
        conectado: false,
        ultimoQr: null,
        qrMatrix: null,
        status: nextStatus
    });
}

function buildQrMatrix(qr) {
    const qrcode = new QRCode(-1, 'L');
    qrcode.addData(qr);
    qrcode.make();
    return qrcode.modules.map((row) => row.map(Boolean));
}

function getBotStatus() {
    return {
        iniciado: state.iniciado,
        inicializando: state.inicializando,
        autenticado: state.autenticado,
        conectado: state.conectado,
        status: state.status,
        ultimoQr: state.ultimoQr,
        qrMatrix: state.qrMatrix,
        ultimaRazaoDesconexao: state.ultimaRazaoDesconexao
    };
}

async function startSession() {
    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: './sessions/whatsapp-web',
            clientId: 'whatsapp-web-client'
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    console.log('Sessao iniciada!');
}

function registerClientEvents(tentativasReinicioParam = 0) {
    client.on('qr', (qr) => {
        qrCodeGerator.generate(qr, { small: true });
        console.log('Escaneie o codigo QR acima para conectar');
        setState({
            inicializando: false,
            autenticado: false,
            conectado: false,
            ultimoQr: qr,
            qrMatrix: buildQrMatrix(qr),
            status: 'qr'
        });
    });

    client.on('ready', () => {
        console.log('Cliente conectado com sucesso!');
        setState({
            iniciado: true,
            inicializando: false,
            autenticado: true,
            conectado: true,
            ultimoQr: null,
            qrMatrix: null,
            status: 'ready',
            ultimaRazaoDesconexao: null
        });
        tentativasReinicio = 0;
    });

    client.on('authenticated', () => {
        console.log('Autenticado com sucesso!');
        setState({
            autenticado: true,
            status: 'authenticated'
        });
    });

    client.on('auth_failure', (msg) => {
        console.log('Falha na autenticacao:', msg);
        logger.error('Falha na autenticacao: ' + msg);
        resetConnectionState('auth_failure');
        setState({
            ultimaRazaoDesconexao: msg
        });
    });

    client.on('disconnected', async (reason) => {
        console.log('Conexao fechada, motivo:', reason);
        resetConnectionState('disconnected');
        setState({
            ultimaRazaoDesconexao: String(reason ?? 'unknown')
        });
        tentativasReinicio = tentativasReinicioParam;
        if (tentativasReinicio < 4) {
            console.log(`Tentativa de reinicio ${tentativasReinicio + 1}/4`);
            tentativasReinicio++;
            setState({
                inicializando: true,
                status: 'restarting'
            });
            setTimeout(() => {
                startBot(tentativasReinicio).catch((error) => {
                    logger.error('Erro ao reiniciar bot: ' + error.message);
                });
            }, 5000);
        } else {
            console.log('Reconexao falhou apos 4 tentativas');
            logger.error('Reconexao falhou apos 4 tentativas. Verifique a sessao do WhatsApp.');
            if (emailWarning) {
                await send('Reconexao falhou apos 4 tentativas. Verifique a sessao do WhatsApp.', emailWarning);
            }
        }
    });

    client.on('message', async (message) => {
        console.log(`Mensagem recebida de ${message.from}: ${message.body}`);
    });
}

async function startBot(tentativasReinicioParam = 0) {
    if (state.inicializando || state.iniciado || state.status === 'qr' || state.status === 'authenticated') {
        return getBotStatus();
    }

    setState({
        inicializando: true,
        status: 'starting',
        ultimaRazaoDesconexao: null
    });

    await startSession();
    registerClientEvents(tentativasReinicioParam);

    try {
        await client.initialize();
        console.log('Bot iniciado com whatsapp-web');
        return getBotStatus();
    } catch (err) {
        console.error('Erro ao inicializar o cliente:', err);
        logger.error('Erro ao inicializar o cliente: ' + err.message);
        resetConnectionState('error');
        setState({
            ultimaRazaoDesconexao: err.message
        });
        throw err;
    }
}

async function normalizeWhatsAppNumber(phone) {
    let clean = phone.replace(/\D/g, '');
    if (!clean.startsWith('55')) clean = '55' + clean;

    const with9 = clean.length === 12
        ? clean.slice(0, 4) + '9' + clean.slice(4)
        : clean;

    const without9 = with9.replace(/^(\d{4})9/, '$1');

    return { com9: with9, sem9: without9 };
}

async function enviarMensagem(texto, numero) {
    console.log(`Enviando mensagem para ${numero}`);

    if (!state.iniciado) {
        console.log('Cliente nao esta conectado');
        logger.error('Tentativa de envio quando cliente nao estava conectado');
        return false;
    }

    const { com9, sem9 } = await normalizeWhatsAppNumber(numero);
    if (!com9 && !sem9) {
        console.log(`Numero invalido: ${numero}`);
        return false;
    }

    for (const n of [com9, sem9]) {
        if (!n) continue;

        const chatId = n + '@c.us';

        try {
            await new Promise(r => setTimeout(r, 1500));
            await client.sendMessage(chatId, texto);
            console.log(`Mensagem enviada para ${numero}`);
            logger.info(`Mensagem enviada para ${numero}`);
            return true;
        } catch (err) {
            console.log(`Falhou com ${chatId}, tentando outro formato...`);
            logger.error(`Erro ao enviar mensagem para ${chatId}: ${err.message}`);
        }
    }

    return false;
}

async function destruirSessao() {
    try {
        if (client) {
            await client.destroy();
            client = null;
            console.log('Sessao destruida');
        }
        resetConnectionState('stopped');
        setState({
            ultimaRazaoDesconexao: null
        });
    } catch (err) {
        console.error('Erro ao destruir sessao:', err);
        logger.error('Erro ao destruir sessao: ' + err.message);
        throw err;
    }
}

export { startBot, enviarMensagem, normalizeWhatsAppNumber, destruirSessao, TEMPO_ENTRE_MENSAGENS, state, getBotStatus };
