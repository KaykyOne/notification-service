import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrCodeGerator from 'qrcode-terminal';

const TEMPO_ENTRE_MENSAGENS = 20000;
let sock;

async function startSession() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    sock =  makeWASocket({ printQRInTerminal: false, auth: state });
    sock.ev.on('creds.update', saveCreds)
    console.log('Sessão iniciada!')
}

async function startBot() {
    await startSession();


    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        process.on('unhandledRejection', console.error)
        process.on('uncaughtException', console.error)

        if (qr) {
            qrCodeGerator.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('✅ Conectado com sucesso!');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Conexão fechada, tentando reconectar...');
            if (shouldReconnect) startBot();
            else console.log('🚫 Erro crítico, não será possível reconectar.');
        }
    });
}

async function enviarMensagem(texto, numero) {
    console.log(`Enviando mensagem para ${numero}`);
    await sock.sendPresenceUpdate('composing', numero);
    await new Promise(r => setTimeout(r, 1500));
    await sock.sendMessage(numero, { text: texto });
    await sock.sendPresenceUpdate('paused', numero);
}

export { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS };