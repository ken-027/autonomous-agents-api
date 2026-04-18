import { Router } from "express";
import {
    agent,
    agents,
    coverLetterAgent,
    uptimeMonitoringAgent,
} from "@/controllers/openrouter.agent.controller";
import { validateRequest } from "@/middlewares/validation.middleware";
import { Chat, Agent, UptimeAgent } from "@/validations/chat.validation";
import {
    chatResourceLimit,
    webAgentLimit,
} from "@/middlewares/rate-limiter.middleware";
import { CoverLetter } from "@/validations/cover-letter.validation";

const agentV2Router = Router();

agentV2Router.post(
    "/cover-letter",
    validateRequest(CoverLetter, "body"),
    chatResourceLimit,
    coverLetterAgent,
);
agentV2Router.post(
    "/uptime-monitoring",
    validateRequest(UptimeAgent, "body"),
    webAgentLimit,
    uptimeMonitoringAgent,
);
agentV2Router.post(
    "/:agent",
    validateRequest(Agent, "params"),
    validateRequest(Chat, "body"),
    chatResourceLimit,
    agent,
);
agentV2Router.get("/", agents);

export default agentV2Router;
