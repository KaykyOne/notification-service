import { Router } from "express";
import { sendMessage, clearMessages, startWhatsappBot } from "../controller/whatsapp.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/start", startWhatsappBot);
router.delete("/clearAll", clearMessages);

export default router;
