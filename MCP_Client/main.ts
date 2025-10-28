
import { MCPClient } from "./index.js";

class Main {

    public async main(): Promise<void> {

        if (process.argv.length < 3) {
            console.log("Usage: node index.ts <path_to_server_script>");
            return;
        }

        const mcpClient = new MCPClient();
        try {
            await mcpClient.connectToMCPServer(process.argv[2]);
            await mcpClient.chatLoop();
        } finally {
            await mcpClient.cleanup();
            process.exit(0);
        }
    }

}

new Main().main().catch(err => { console.error(err); process.exit(1); });
