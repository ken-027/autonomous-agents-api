import { Agent } from "@/enum/agents.enum.js";
import { PortfolioSupervisor } from "./portfolio.agents.js";
import { GithubAgent } from "./github.agent.js";

export const AgentsConfig: Record<
    Agent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { agent: any; description: string; name: string }
> = {
    portfolio: {
        agent: PortfolioSupervisor,
        name: "Portfolio Assistant",
        description: "Handles portfolio inquires",
    },
    github: {
        agent: GithubAgent,
        name: "Github Assistant",
        description: "Handles github account of Kenneth Andales",
    },
} as const;
