import { GITHUB_TEMPLATE } from "@/config/agents_prompt/github.prompt";
import { githubOpenRouterTools } from "@/tools/openrouter/github.openrouter.tools";
import { getOpenRouter } from "@/services/openrouter.client";
import { stepCountIs } from "@/utils/openrouter-stop";
import type { OpenRouterThreadMessage } from "@/types";
import {
    defaultOpenRouterModel,
    sliceThreadForModel,
    threadToInput,
} from "./openrouter.shared.js";

export function runGithubOpenRouterAgent(thread: OpenRouterThreadMessage[]) {
    const client = getOpenRouter();
    const sliced = sliceThreadForModel(thread);
    return client.callModel({
        model: defaultOpenRouterModel(),
        instructions: GITHUB_TEMPLATE,
        input: threadToInput(sliced),
        tools: githubOpenRouterTools,
        stopWhen: stepCountIs(12),
    });
}
