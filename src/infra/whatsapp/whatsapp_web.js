import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrCodeGerator from 'qrcode-terminal';
import { logger } from '../../../logs/logger.js';
import { send } from '../../services/email.service.js';

const TEMPO_ENTRE_MENSAGENS = 20000;
let client;

const state = {
    iniciado: false
};

// ---- Process handlers (fora de tudo) ----
process.on('unhandledRejection', logger.error);
process.on('uncaughtException', logger.error);

const emailWarning = process.env.EMAIL_WARNING;

let tentativasReinicio = 0;

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

    console.log('Sessão iniciada!');
}

async function startBot(tentativasReinicioParam = 0) {
    await startSession();

    client.on('qr', (qr) => {
        qrCodeGerator.generate(qr, { small: true });
        console.log('📱 Escaneie o código QR acima para conectar');
    });

    client.on('ready', () => {
        console.log('✅ Cliente conectado com sucesso!');
        state.iniciado = true;
        tentativasReinicio = 0;
    });

    client.on('authenticated', () => {
        console.log('✅ Autenticado com sucesso!');
    });

    client.on('auth_failure', (msg) => {
        console.log('❌ Falha na autenticação:', msg);
        logger.error('Falha na autenticação: ' + msg);
    });

    client.on('disconnected', async (reason) => {
        state.iniciado = false;
        console.log('❌ Conexão fechada, motivo:', reason);
        tentativasReinicio = tentativasReinicioParam;
        if (tentativasReinicio < 4) {
            console.log(`🔄 Tentativa de reinício ${tentativasReinicio + 1}/4`);
            tentativasReinicio++;
            setTimeout(() => {
                startBot(tentativasReinicio);
            }, 5000);
        } else {
            console.log('🚫 Reconexão falhou após 4 tentativas');
            logger.error('Reconexão falhou após 4 tentativas. Verifique a sessão do WhatsApp.');
            if (emailWarning) {
                await send('Reconexão falhou após 4 tentativas. Verifique a sessão do WhatsApp.', emailWarning);
            }
        }
    });

    client.on('message', async (message) => {
        console.log(`📨 Mensagem recebida de ${message.from}: ${message.body}`);
    });

    try {
        await client.initialize();
        console.log('🚀 Bot iniciado com whatsapp-web');
    } catch (err) {
        console.error('Erro ao inicializar o cliente:', err);
        logger.error('Erro ao inicializar o cliente: ' + err.message);
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
        console.log('❌ Cliente não está conectado');
        logger.error('Tentativa de envio quando cliente não estava conectado');
        return false;
    }

    const { com9, sem9 } = await normalizeWhatsAppNumber(numero);
    if (!com9 && !sem9) {
        console.log(`Número inválido: ${numero}`);
        return false;
    }

    for (const n of [com9, sem9]) {
        if (!n) continue;

        const chatId = n + '@c.us';

        try {
            // Aguarda um pequeno delay para simular humanização
            await new Promise(r => setTimeout(r, 1500));
            
            await client.sendMessage(chatId, texto);
            
            console.log(`✅ Mensagem enviada para ${numero}`);
            logger.info(`Mensagem enviada para ${numero}`);
            return true;
        } catch (err) {
            console.log(`❌ Falhou com ${chatId}, tentando outro formato...`);
            logger.error(`Erro ao enviar mensagem para ${chatId}: ${err.message}`);
        }
    }

    return false;
}

async function destruirSessao() {
    try {
        if (client) {
            await client.destroy();
            console.log('Sessão destruída');
        }
    } catch (err) {
        console.error('Erro ao destruir sessão:', err);
        logger.error('Erro ao destruir sessão: ' + err.message);
    }
}

export { startBot, enviarMensagem, normalizeWhatsAppNumber, destruirSessao, TEMPO_ENTRE_MENSAGENS, state };
