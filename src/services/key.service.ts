import crypto from 'crypto';
import { sendRootEmailService } from './email.service.ts';
import { prismaManager } from "../../prisma/prisma.ts";
import { logger } from '../logs/logger.ts';

async function generateKey() {
    try {
        const apiKey = crypto.randomBytes(32).toString('hex');
        const message = `Nova chave de API gerada: ${apiKey}`;
        await sendRootEmailService(message);
        if (apiKey && message) {
            await prismaManager.keys.create({
                data: {
                    value: apiKey,
                    createdAt: new Date(),
                    valid: true
                }
            });
        }
        return "Chave de API gerada e enviada para o administrador.";
    } catch (error) {
        logger.error(`Erro ao gerar chave de API: ${error.message}`);
        throw new Error("Erro ao gerar chave de API.");
    }
}

export { generateKey };