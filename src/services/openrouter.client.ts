import { OpenRouter } from "@openrouter/sdk";
import { OPENROUTER_API_KEY } from "@/config/env";

let client: OpenRouter | undefined;

export function getOpenRouter(): OpenRouter {
    if (!client) {
        client = new OpenRouter({
            apiKey: OPENROUTER_API_KEY ?? "",
        });
    }
    return client;
}
