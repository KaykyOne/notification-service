import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrCodeGerator from 'qrcode-terminal';
import pino from 'pino';

const TEMPO_ENTRE_MENSAGENS = 20000;
let sock;

// ---- Process handlers (fora de tudo) ----
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

async function startSession() {
    const { state, saveCreds } = await useMultiFileAuthState('/sessions/whatsapp-baileys');

    sock = makeWASocket({
        printQRInTerminal: false,
        logger: pino({ level: 'error' }),
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);
    console.log('Sessão iniciada!');
}

async function startBot() {
    await startSession();

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrCodeGerator.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('✅ Conectado com sucesso!');
        }

        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log('❌ Conexão fechada, tentando reconectar...');
            if (shouldReconnect) startBot();
            else console.log('🚫 Logout detectado, não será possível reconectar.');
        }
    });
}

async function normalizeWhatsAppNumber(phone) {
    let clean = phone.replace(/\D/g, '');
    if (!clean.startsWith('55')) clean = '55' + clean;

    const with9 = clean.length === 12
        ? clean.slice(0, 4) + '9' + clean.slice(4)
        : clean;

    const without9 = with9.replace(/^(\d{4})9/, '$1');

    const r1 = await sock.onWhatsApp(with9 + '@s.whatsapp.net');
    if (r1?.length) return with9;

    const r2 = await sock.onWhatsApp(without9 + '@s.whatsapp.net');
    if (r2?.length) return without9;

    return null;
}

async function enviarMensagem(texto, numero) {
    console.log(`Enviando mensagem para ${numero}`);

    const numeroNormalizado = await normalizeWhatsAppNumber(numero);
    if (!numeroNormalizado) {
        console.log(`Número inválido: ${numero}`);
        return;
    }

    const jid = numeroNormalizado + '@s.whatsapp.net';

    await sock.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, 1500));
    await sock.sendMessage(jid, { text: texto });
    await sock.sendPresenceUpdate('paused', jid);
}

export { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS };
