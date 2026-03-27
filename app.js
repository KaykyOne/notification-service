import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./src/routes/routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dashboardFilePath = path.resolve(__dirname, "./src/views/html/index.html");
const dashboardAssetsPath = path.resolve(__dirname, "./src/views");

const app = express();

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/dashboard-assets", express.static(dashboardAssetsPath));

app.use("/", routes);

app.get("/dashboard", (req, res) => {
  res.sendFile(dashboardFilePath);
});

app.listen(3012, '0.0.0.0', () => {
    console.clear();
    console.log("Servidor rodando em http://0.0.0.0:3012");
});

export default app;
