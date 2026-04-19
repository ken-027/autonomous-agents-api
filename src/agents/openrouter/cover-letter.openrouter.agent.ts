import { COVER_LETTER_TEMPLATE } from "@/config/agents_prompt/portfolio.prompt";
import { coverLetterOpenRouterTools } from "@/tools/openrouter/portfolio.openrouter.tools";
import { getOpenRouter } from "@/services/openrouter.client";
import { stepCountIs } from "@/utils/openrouter-stop";
import type { OpenRouterThreadMessage } from "@/types";
import {
    defaultOpenRouterModel,
    sliceThreadForModel,
    threadToInput,
} from "./openrouter.shared";

export async function runCoverLetterOpenRouterAgent(thread: OpenRouterThreadMessage[]) {
    const client = await getOpenRouter();
    const sliced = sliceThreadForModel(thread);
    return client.callModel({
        model: defaultOpenRouterModel(),
        instructions: COVER_LETTER_TEMPLATE,
        input: threadToInput(sliced),
        tools: coverLetterOpenRouterTools,
        stopWhen: stepCountIs(12),
    });
}
