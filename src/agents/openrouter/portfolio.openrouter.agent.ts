import {
    PORTFOLIO_TEMPLATE,
    SUPERVISOR_PORTFOLIO_TEMPLATE,
} from "@/config/agents_prompt/portfolio.prompt";
import { portfolioSupervisorOpenRouterTools } from "@/tools/openrouter/portfolio.openrouter.tools";
import { getOpenRouter } from "@/services/openrouter.client";
import { stepCountIs } from "@/utils/openrouter-stop";
import type { OpenRouterThreadMessage } from "@/types";
import {
    defaultOpenRouterModel,
    sliceThreadForModel,
    threadToInput,
} from "./openrouter.shared.js";

const mergedInstructions = `${SUPERVISOR_PORTFOLIO_TEMPLATE}

---

You have access to all portfolio and email tools in one session. Use portfolio tools (skills_list, projects_portfolio, public_profile, etc.) for technical, contact, and background questions. Use receive_email_to_developer and send_email_back_to_user for formal email flows. Use pushover_notification when the inquiry is unknown or out of scope per the supervisor rules above.

${PORTFOLIO_TEMPLATE}`;

export function runPortfolioOpenRouterAgent(thread: OpenRouterThreadMessage[]) {
    const client = getOpenRouter();
    const sliced = sliceThreadForModel(thread);
    return client.callModel({
        model: defaultOpenRouterModel(),
        instructions: mergedInstructions,
        input: threadToInput(sliced),
        tools: portfolioSupervisorOpenRouterTools,
        stopWhen: stepCountIs(15),
    });
}
