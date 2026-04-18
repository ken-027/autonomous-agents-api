import { Chat, UptimeAgent } from "@/validations/chat.validation";
import type { SessionMessages } from "@/types";
import { Request, Response } from "express";

import { CoverLetter } from "@/validations/cover-letter.validation";
import { OpenRouterAgentsListing } from "@/agents/openrouter";
import { runGithubOpenRouterAgent } from "@/agents/openrouter/github.openrouter.agent";
import { runPortfolioOpenRouterAgent } from "@/agents/openrouter/portfolio.openrouter.agent";
import { runCoverLetterOpenRouterAgent } from "@/agents/openrouter/cover-letter.openrouter.agent";
import { invokeUptimeStructured } from "@/agents/openrouter/uptime.openrouter.agent";

/**
 * @swagger
 * /api/v2/agents:
 *   get:
 *     summary: Get list of agents (OpenRouter)
 *     tags: [Agents]
 */
export function agents(_req: Request, response: Response) {
    return response.json({
        agents: Object.keys(OpenRouterAgentsListing).map((name) => ({
            name,
            description:
                OpenRouterAgentsListing[
                    name as keyof typeof OpenRouterAgentsListing
                ].description,
        })),
    });
}

/**
 * @swagger
 * /api/v2/agents/{agent}:
 *   post:
 *     summary: Post message (OpenRouter streaming)
 *     tags: [Agents]
 */
export async function agent(
    request: Request<{ agent: "portfolio" | "github" }, unknown, Chat> & {
        session: SessionMessages;
    },
    response: Response,
) {
    const { agent: agentName } = request.params;
    const { message } = request.body;

    const messages = request.session.openrouterMessages ?? [];
    messages.push({ role: "user", content: message });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agents: Record<string, any> = {
        github: runGithubOpenRouterAgent(messages),
        portfolio: runPortfolioOpenRouterAgent(messages),
    };

    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    const selectedAgent = agents[agentName];
    let aiResponse = "";
    for await (const delta of selectedAgent.getTextStream()) {
        response.write(delta);
        aiResponse += delta;
    }

    messages.push({ role: "assistant", content: aiResponse });
    request.session.openrouterMessages = messages;
    response.end();
}

export async function coverLetterAgent(
    request: Request<unknown, unknown, CoverLetter> & {
        session: SessionMessages;
    },
    response: Response,
) {
    const { company, job_description, background } = request.body;

    const message = `
        Company: ${company}\n
        Background: ${background}\n
        Job Description: ${job_description}
    `;

    const messages = request.session.openrouterMessages ?? [];
    messages.push({ role: "user", content: message });

    const result = runCoverLetterOpenRouterAgent(messages);

    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    let aiResponse = "";
    for await (const delta of result.getTextStream()) {
        response.write(delta);
        aiResponse += delta;
    }

    messages.push({ role: "assistant", content: aiResponse });
    request.session.openrouterMessages = messages;
    response.end();
}

/**
 * @swagger
 * /api/v2/agents/uptime-monitoring:
 *   post:
 *     summary: Uptime analysis (OpenRouter)
 *     tags: [Agents]
 */
export async function uptimeMonitoringAgent(
    request: Request<unknown, unknown, UptimeAgent> & {
        session: SessionMessages;
    },
    response: Response,
) {
    const { url } = request.body;

    const messages = request.session.openrouterMessages ?? [];
    messages.push({ role: "user", content: url });

    const result = await invokeUptimeStructured(messages);
    request.session.openrouterMessages = messages;

    return response.json(result);
}
