import { logger } from "./logs/logger.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./src/routes/routes.js";

const app = express();

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/notify", routes);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(3012, '0.0.0.0', () => {
    console.clear();
    console.log("Servidor rodando em http://0.0.0.0:3012");
});

export default app;
