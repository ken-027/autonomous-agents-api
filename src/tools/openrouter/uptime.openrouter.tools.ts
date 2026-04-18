import { getWebsiteContent } from "@/tools/uptime-monitoring.tools";
import { ToolType } from "@openrouter/sdk";
import * as z from "zod/v4";

export const uptimeOpenRouterTools = [
    {
        type: ToolType.Function,
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
