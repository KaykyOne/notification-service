import { Router } from "express";
import whatsappRoutes from "./whatsapp.route.js";

const router = Router();

router.use("/whatsapp", whatsappRoutes);
router.get("/ping", (req, res) => {
  res.send("Pong");
});

export default router;
