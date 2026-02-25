import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrCodeGerator from 'qrcode-terminal';
import pino from 'pino';
import fs from "fs";
import { logger } from '../../../logs/logger.js';
import { send } from '../../services/email.service.js';

const TEMPO_ENTRE_MENSAGENS = 20000;
let sock;
let iniciado = false;

// ---- Process handlers (fora de tudo) ----
process.on('unhandledRejection', logger.error);
process.on('uncaughtException', logger.error);

const emailWarning = process.env.EMAIL_WARNING;

let tentativasReinicio = 0;

async function startSession() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions/whatsapp-baileys');

    sock = makeWASocket({
        printQRInTerminal: false,
        logger: pino({ level: 'error' }),
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);
    console.log('Sessão iniciada!');
}

async function startBot(tentativasReinicioParam = 0) {
    await startSession();

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrCodeGerator.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('✅ Conectado com sucesso!');
            iniciado = true;
        }

        if (connection === 'close') {
            iniciado = false;
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log('❌ Conexão fechada, tentando reconectar...');
            tentativasReinicio = tentativasReinicioParam;
            if (shouldReconnect && tentativasReinicio < 4) {
                console.log(`🔄 Tentativa de reinício ${tentativasReinicio}/4`);
                tentativasReinicio++;
                await sock.ws.close();
                startBot(tentativasReinicio);
                return;
            }
            else {
                console.log('🚫 Logout detectado, não será possível reconectar.');
                await sock.ws.close();
                logger.error('Logout detectado, reinício do bot falhou após 4 tentativas. Verifique a sessão do WhatsApp.');
                if(emailWarning) {     
                    await send('Logout detectado, reinício do bot falhou após 4 tentativas. Verifique a sessão do WhatsApp.', emailWarning);
                }
                await fs.rmSync('./sessions/whatsapp-baileys', { recursive: true, force: true });
                console.clear();
                return;
            }
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

    return { com9: with9, sem9: without9 };
}

async function enviarMensagem(texto, numero) {
    console.log(`Enviando mensagem para ${numero}`);

    const { com9, sem9 } = await normalizeWhatsAppNumber(numero);
    if (!com9 && !sem9) {
        console.log(`Número inválido: ${numero}`);
        return;
    }

    for (const n of [com9, sem9]) {
        if (!n) continue;

        const jid = n + '@s.whatsapp.net';

        try {
            await sock.sendPresenceUpdate('composing', jid);
            await new Promise(r => setTimeout(r, 1500));
            await sock.sendMessage(jid, { text: texto });
            await sock.sendPresenceUpdate('paused', jid);

            continue;
        } catch (err) {
            console.log(`❌ Falhou com ${jid}, tentando outro formato...`);
        }
    }

    console.log(`✅ Mensagem enviada para ${numero}`);
    logger.info(`Mensagem enviada para ${numero}`);
}


export { startBot, enviarMensagem, TEMPO_ENTRE_MENSAGENS, iniciado };
