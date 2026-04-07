import { Router } from "express";
import { sendTestEmailController } from "../controller/email.controller.js";

const router = Router();

router.get("/test", sendTestEmailController);
export default router;
