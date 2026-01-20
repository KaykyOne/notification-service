import { Router } from "express";
import { sendMessage, clearMessages } from "../controller/whatsapp.controller.js";

const router = Router();

router.post("/", sendMessage);
      // .delete("/", clearMessages);

export default router;
