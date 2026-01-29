import { Router } from "express";
import { sendMessage, clearMessages, startWhatsappBot, deleteScheduledMessagesForPhone } from "../controller/whatsapp.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/start", startWhatsappBot);
router.delete("/clearAll", clearMessages);
router.delete("/clearScheduled/:phone", deleteScheduledMessagesForPhone);

export default router;
