import { GITHUB_TEMPLATE } from "@/config/agents_prompt/github.prompt";
import { getGithubOpenRouterTools } from "@/tools/openrouter/github.openrouter.tools";
import { getOpenRouter } from "@/services/openrouter.client";
import { stepCountIs } from "@/utils/openrouter-stop";
import type { OpenRouterThreadMessage } from "@/types";
import {
    defaultOpenRouterModel,
    sliceThreadForModel,
    threadToInput,
} from "./openrouter.shared";

export async function runGithubOpenRouterAgent(thread: OpenRouterThreadMessage[]) {
    const client = await getOpenRouter();
    const tools = await getGithubOpenRouterTools();
    const sliced = sliceThreadForModel(thread);
    return client.callModel({
        model: defaultOpenRouterModel(),
        instructions: GITHUB_TEMPLATE,
        input: threadToInput(sliced),
        tools,
        stopWhen: stepCountIs(12),
    });
}
