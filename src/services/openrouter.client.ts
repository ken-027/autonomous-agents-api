/* eslint-disable @typescript-eslint/no-explicit-any */
import { OPENROUTER_API_KEY } from "@/config/env";

type OpenRouter = any;
let client: OpenRouter | undefined;
let OpenRouterClass: any;

async function getOpenRouterClass() {
    if (!OpenRouterClass) {
        const module = await import("@openrouter/sdk");
        OpenRouterClass = module.OpenRouter;
    }
    return OpenRouterClass;
}

export async function getOpenRouter(): Promise<OpenRouter> {
    if (!client) {
        const OpenRouterConstructor = await getOpenRouterClass();
        client = new OpenRouterConstructor({
            apiKey: OPENROUTER_API_KEY ?? "",
        });
    }
    return client;
}
