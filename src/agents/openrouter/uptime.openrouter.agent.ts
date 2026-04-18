import { UPTIME_TEMPLATE } from "@/config/agents_prompt/uptime-monitoring.prompt";
import { AppStatus } from "@/enum/uptime.enum";
import { uptimeOpenRouterTools } from "@/tools/openrouter/uptime.openrouter.tools";
import { getOpenRouter } from "@/services/openrouter.client";
import { stepCountIs } from "@/utils/openrouter-stop";
import * as z from "zod/v4";
import type { OpenRouterThreadMessage } from "@/types";
import {
    defaultOpenRouterModel,
    sliceThreadForModel,
    threadToInput,
} from "./openrouter.shared";

const UptimeStructured = z.object({
    siteType: z.string(),
    techs: z.array(z.string()),
    seoIssue: z.string(),
    brokenLink: z.string(),
    performance: z.string(),
    security: z.string(),
    status: z.enum([AppStatus.DOWN, AppStatus.UP]),
    description: z.string().max(250),
    responseTime: z.number(),
});

const jsonFence = /^```(?:json)?\s*([\s\S]*?)```$/m;

function extractJsonObject(text: string): unknown {
    const trimmed = text.trim();
    const fenced = jsonFence.exec(trimmed);
    const body = (fenced ? fenced[1] : trimmed).trim();
    try {
        return JSON.parse(body);
    } catch {
        const start = body.indexOf("{");
        const end = body.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(body.slice(start, end + 1));
        }
        throw new Error("No JSON object in model output");
    }
}

export function runUptimeOpenRouterAgent(thread: OpenRouterThreadMessage[]) {
    const client = getOpenRouter();
    const sliced = sliceThreadForModel(thread);
    return client.callModel({
        model: defaultOpenRouterModel(),
        instructions: `${UPTIME_TEMPLATE}

Respond with a single JSON object only (no markdown) matching this shape:
{
  "siteType": string,
  "techs": string[],
  "seoIssue": string,
  "brokenLink": string,
  "performance": string,
  "security": string,
  "status": "DOWN" | "UP",
  "description": string (max 250 chars),
  "responseTime": number
}`,
        input: threadToInput(sliced),
        tools: uptimeOpenRouterTools,
        stopWhen: stepCountIs(8),
    });
}

export async function invokeUptimeStructured(
    thread: OpenRouterThreadMessage[],
): Promise<z.infer<typeof UptimeStructured>> {
    const result = runUptimeOpenRouterAgent(thread);
    const text = await result.getText();
    const raw = extractJsonObject(text);
    return UptimeStructured.parse(raw);
}
