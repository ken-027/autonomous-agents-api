import { NODE_ENV, OPENROUTER_MODEL } from "@/config/env";
import type { OpenRouterThreadMessage } from "@/types";

export function sliceThreadForModel(
    messages: OpenRouterThreadMessage[],
): OpenRouterThreadMessage[] {
    const windowSize = NODE_ENV === "production" ? 10 : 1;
    return messages.slice(
        Math.max(0, messages.length - windowSize),
        messages.length,
    );
}

export function threadToInput(thread: OpenRouterThreadMessage[]) {
    return thread.map((m) => ({
        type: "message" as const,
        role: m.role,
        content: m.content,
    }));
}

export function defaultOpenRouterModel(): string {
    return OPENROUTER_MODEL;
}
