import { Router } from "express";
import {
    sendMessage,
    listMessages,
    deleteMessage,
    clearMessages,
    startWhatsappBot,
    stopWhatsappBot,
    deleteScheduledMessages,
    connectWhatsappBot,
    getWhatsappBotStatus
} from "../controller/whatsapp.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/messages", listMessages);
router.delete("/messages/:id", deleteMessage);
router.get("/start", startWhatsappBot);
router.post("/start", startWhatsappBot);
router.get("/status", getWhatsappBotStatus);
router.post("/connect", connectWhatsappBot);
router.delete("/stop", stopWhatsappBot);
router.post("/disconnect", stopWhatsappBot);
router.delete("/clearAll", clearMessages);
router.delete("/clearScheduled/:phone", deleteScheduledMessages);

export default router;
