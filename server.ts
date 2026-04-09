import "./src/app.ts";
import { startCli } from "./src/cli/App.ts";

startCli().catch((error) => {
	console.error("Erro ao iniciar CLI:", error);
});
