import { MessageParam, Tool, } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import readline from "readline/promises";


class MCPService {
    async processQuery(query: string) {
        const messages: MessageParam[] = [
            {
                role: "user",
                content: query,
            },
        ];

        const response = await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            messages,
            tools: this.tools,
        });

        const finalText = [];

        for (const content of response.content) {
            if (content.type === "text") {
                finalText.push(content.text);
            } else if (content.type === "tool_use") {
                const toolName = content.name;
                const toolArgs = content.input as { [x: string]: unknown } | undefined;

                const result = await this.mcp.callTool({
                    name: toolName,
                    arguments: toolArgs,
                });
                finalText.push(
                    `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
                );

                messages.push({
                    role: "user",
                    content: result.content as string,
                });

                const response = await this.anthropic.messages.create({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1000,
                    messages,
                });

                finalText.push(
                    response.content[0].type === "text" ? response.content[0].text : ""
                );
            }
        }

        return finalText.join("\n");
    }
}