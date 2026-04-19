import { getWebsiteContent } from "@/tools/uptime-monitoring.tools";
import * as z from "zod/v4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ToolType: any;

async function getToolType() {
    if (!ToolType) {
        const module = await import("@openrouter/sdk");
        ToolType = module.ToolType;
    }
    return ToolType;
}

export async function getUptimeOpenRouterTools() {
    const toolType = await getToolType();

    return [
    {
        type: toolType.Function,
        function: {
            name: "fetch_html_content",
            description: "tool to fetch html content of a website",
            inputSchema: z.object({
                url: z.string().trim().url().describe("url link of the website"),
            }),
            execute: async (params: { url: string }) =>
                getWebsiteContent.invoke(params),
        },
    },
    ] as const;
}
