import { Router } from "express";
import { sendTestEmailController } from "../controller/email.controller.ts";

const router = Router();

router.get("/test", sendTestEmailController);
export default router;
