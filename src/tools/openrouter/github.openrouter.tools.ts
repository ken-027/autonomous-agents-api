import {
    getPublicRepositories,
    getRepository,
    getRepositoryActivities,
    getRepositoryBranches,
    getRepositoryCommits,
    listOfContributedRepo,
    listOfForkedRepo,
    listOfRepoLanguages,
} from "@/tools/github.tools";
import * as z from "zod/v4";

const empty = z.object({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ToolType: any;

async function getToolType() {
    if (!ToolType) {
        const module = await import("@openrouter/sdk");
        ToolType = module.ToolType;
    }
    return ToolType;
}

export async function getGithubOpenRouterTools() {
    const toolType = await getToolType();

    return [
    {
        type: toolType.Function,
        function: {
            name: "public_repositories_list",
            description: "list of public repositories",
            inputSchema: empty,
            execute: async () => getPublicRepositories.invoke({}),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "repository_activities",
            description:
                "List of activities that the repository has, Limit its activities by top 2 sorting from latest",
            inputSchema: z.object({
                repository: z.string().trim().describe("github repository"),
            }),
            execute: async (params: { repository: string }) =>
                getRepositoryActivities.invoke(params),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "contributed_repositories",
            description:
                "List of contributed repository to an open source projects",
            inputSchema: empty,
            execute: async () => listOfContributedRepo.invoke({}),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "repository_programming_languages",
            description: "List of programming languages of a repository",
            inputSchema: z.object({
                repository: z.string().trim().describe("github repository"),
            }),
            execute: async (params: { repository: string }) =>
                listOfRepoLanguages.invoke(params),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "get_repository",
            description: "get repository details",
            inputSchema: z.object({
                repository: z.string().trim().describe("github repository"),
            }),
            execute: async (params: { repository: string }) =>
                getRepository.invoke(params),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "get_repository_commits",
            description:
                "get repository commits. return top 10 latest commits",
            inputSchema: z.object({
                repository: z.string().trim().describe("github repository"),
            }),
            execute: async (params: { repository: string }) =>
                getRepositoryCommits.invoke(params),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "get_repository_branches",
            description: "get list repository branches",
            inputSchema: z.object({
                repository: z.string().trim().describe("github repository"),
            }),
            execute: async (params: { repository: string }) =>
                getRepositoryBranches.invoke(params),
        },
    },
    {
        type: toolType.Function,
        function: {
            name: "forked_repositories",
            description: "List of forked repositories",
            inputSchema: empty,
            execute: async () => listOfForkedRepo.invoke({}),
        },
    },
    ] as const;
}
