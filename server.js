import "./src/logic/app.js";
import { startCli } from "./src/cli/index.js";

startCli().catch((error) => {
	console.error("Erro ao iniciar CLI:", error);
});
