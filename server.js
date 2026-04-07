import "./src/logic/app.js";
import { startCli } from "./src/cli/App.js";

startCli().catch((error) => {
	console.error("Erro ao iniciar CLI:", error);
});
