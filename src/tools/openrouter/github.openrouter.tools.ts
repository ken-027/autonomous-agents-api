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
import { ToolType } from "@openrouter/sdk";
import * as z from "zod/v4";

const empty = z.object({});

export const githubOpenRouterTools = [
    {
        type: ToolType.Function,
        function: {
            name: "public_repositories_list",
            description: "list of public repositories",
            inputSchema: empty,
            execute: async () => getPublicRepositories.invoke({}),
        },
    },
    {
        type: ToolType.Function,
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
        type: ToolType.Function,
        function: {
            name: "contributed_repositories",
            description:
                "List of contributed repository to an open source projects",
            inputSchema: empty,
            execute: async () => listOfContributedRepo.invoke({}),
        },
    },
    {
        type: ToolType.Function,
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
        type: ToolType.Function,
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
        type: ToolType.Function,
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
        type: ToolType.Function,
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
        type: ToolType.Function,
        function: {
            name: "forked_repositories",
            description: "List of forked repositories",
            inputSchema: empty,
            execute: async () => listOfForkedRepo.invoke({}),
        },
    },
] as const;
