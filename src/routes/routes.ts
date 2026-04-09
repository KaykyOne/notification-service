import { Router } from "express";
import whatsappRoutes from "./whatsapp.route.ts";
import emailRoutes from "./email.route.ts";

const router = Router();

router.use("/whatsapp", whatsappRoutes);
router.use("/email", emailRoutes);
router
  .get("/ping", (req, res) => {
    res.send("Pong");
  })
  .get("/", (req, res) => {
    res.send("API is running");
  });

export default router;
