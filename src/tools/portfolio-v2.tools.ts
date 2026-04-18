import { NODE_ENV } from "@/config/env";
import {
    Certificate,
    Experience,
    Project,
    ProjectName,
    Skill,
} from "@/types";
import EmailJS from "@/utils/email-js";
import PushoverNotificationUtil from "@/utils/pushover-notification.util";
import { ToolType } from "@openrouter/sdk";
import axios from "axios";
import * as z from "zod/v4";

/** Same live portfolio API as `portfolio.tools.ts` (dashboard host paths 404). */
const apiUrl = "https://portfolio-api.kdevtech.com/api/v1/portfolio";

const servicesPageUrl = "https://services.kdevtech.com";

const publicProfileUrl =
    "https://dashboard.kdevtech.com/api/auth/public-profile";

const emptyInput = z.object({});

async function skillsListExecute(): Promise<string> {
    const { data } = await axios.get(`${apiUrl}/skills`);

    const skills = (data.skills as Skill[]).map(({ name, items }) => ({
        name,
        items: items.map(({ name, proficiency }) => ({
            name,
            proficiency,
        })),
    }));

    return `
            Skills\n
            ${JSON.stringify(skills)}
        `;
}

export const skillsListTool = {
    type: ToolType.Function,
    function: {
        name: "skills_list",
        description:
            "developer skills and it's category, name of the skill and proficiency only",
        inputSchema: emptyInput,
        execute: async () => skillsListExecute(),
    },
} as const;

async function servicesListExecute(): Promise<string> {
    const { data } = await axios.get<string>(servicesPageUrl, {
        responseType: "text",
        headers: { Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8" },
    });

    return `<!-- Source: ${servicesPageUrl} -->\n${data}`;
}

export const servicesListTool = {
    type: ToolType.Function,
    function: {
        name: "services_list",
        description:
            "Kenneth's development services as HTML from the live services page (services.kdevtech.com). Use for offerings, pricing context, and service descriptions.",
        inputSchema: emptyInput,
        execute: async () => servicesListExecute(),
    },
} as const;

async function publicProfileExecute(): Promise<string> {
    const { data } = await axios.get<{
        success: boolean;
        data: Record<string, unknown>;
    }>(publicProfileUrl);

    if (!data.success || data.data == null) {
        return JSON.stringify(data);
    }

    return JSON.stringify(data.data, null, 2);
}

export const publicProfileTool = {
    type: ToolType.Function,
    function: {
        name: "public_profile",
        description:
            "Kenneth's public profile: contact and social links (LinkedIn, GitHub, email, etc.), title, bio, location, resume, education, achievements, and developer platform links (npm, Docker Hub, etc.). Use for how to reach him, online presence, and background.",
        inputSchema: emptyInput,
        execute: async () => publicProfileExecute(),
    },
} as const;

async function projectsPortfolioExecute(): Promise<string> {
    const { data } = await axios.get(`${apiUrl}/projects`);

    const projects = data.projects as Record<ProjectName, Project>;
    const projectKeys = Object.keys(projects);

    return `
            Project:
            ${JSON.stringify(projectKeys.map((name) => ({ ...projects[name as ProjectName], thumbnailLink: undefined, type: undefined })))}
        `;
}

export const projectsPortfolioTool = {
    type: ToolType.Function,
    function: {
        name: "projects_portfolio",
        description:
            "developers projects/portfolios, skills used, demos and documentation of the projects",
        inputSchema: emptyInput,
        execute: async () => projectsPortfolioExecute(),
    },
} as const;

async function certificatesListExecute(): Promise<string> {
    const { data } = await axios.get(`${apiUrl}/certificates`);

    const certificates = (data.certificates as Certificate[]).map(
        ({ certificateImage: _a, ...item }) => ({ ...item }),
    );

    return `
            Certificates:
            ${JSON.stringify(certificates)}
        `;
}

export const certificatesListTool = {
    type: ToolType.Function,
    function: {
        name: "certificates_list",
        description:
            "developers certificate list. don't return images link of the certificate.",
        inputSchema: emptyInput,
        execute: async () => certificatesListExecute(),
    },
} as const;

async function experienceListExecute(): Promise<string> {
    const { data } = await axios.get(`${apiUrl}/experiences`);

    const experiences = (data.experiences as Experience[]).map(
        ({
            title,
            company,
            descriptions,
            location,
            startDate,
            endDate,
            projects,
        }) =>
            `
                Title: ${title}
                Company: ${company}
                Location: ${location}
                Description:
                    ${descriptions.join(", ")}
                Term: ${startDate} - ${endDate}
                Projects:
                    ${projects
                        .map(
                            ({
                                title,
                                description,
                                liveDemo,
                                screenshot,
                                category,
                                aiPowered,
                                dockerLink,
                                technologies,
                                type,
                            }) =>
                                `
                        Title: ${title}
                        Description: ${description}
                        Demo: ${liveDemo}
                        Screenshots: ${screenshot}
                        Category: ${category}
                        AI Powered: ${aiPowered}
                        Docker: ${dockerLink}
                        Technologies: ${technologies.map(({ name, proficiency }) => `Name: ${name}, Proficiency: ${proficiency}`).join("\n")}
                        Type: ${type}
                        `,
                        )
                        .join("\n")}
            `,
    );

    return `
            Experiences:
            ${JSON.stringify(experiences)}
        `;
}

export const experienceListTool = {
    type: ToolType.Function,
    function: {
        name: "experience_list",
        description:
            "developers experiences and project and skills on each company",
        inputSchema: emptyInput,
        execute: async () => experienceListExecute(),
    },
} as const;

const pushoverInputSchema = z.object({
    inquiry: z.string().trim().describe("Unanswered user inquiry text"),
});

export const pushoverNotificationTool = {
    type: ToolType.Function,
    function: {
        name: "pushover_notification",
        description:
            "Send push notification to Kenneth about unknown inquiries, unanswered questions, or requests that fall outside the scope of Portfolio and Email agents. Use this when no other agent can properly handle the user's request.",
        inputSchema: pushoverInputSchema,
        execute: async (params: z.infer<typeof pushoverInputSchema>) => {
            if (NODE_ENV !== "production") {
                return "";
            }
            const pushover = new PushoverNotificationUtil();
            pushover.unknownInquiry(params.inquiry);
            return `Notification sent successfully to Kenneth - Unknown inquiry requiring attention`;
        },
    },
} as const;

const receiveEmailInputSchema = z.object({
    email: z.string().email().describe("email of a user who wants to contact"),
    subject: z
        .string()
        .trim()
        .describe("subject of the user who wants to send an email"),
    name: z
        .string()
        .trim()
        .describe("name of the user if provided")
        .nullable(),
    message: z.string().trim().describe("message of the user to the email"),
});

export const receiveEmailToDeveloperTool = {
    type: ToolType.Function,
    function: {
        name: "receive_email_to_developer",
        description: "tool to email developer about the inquiries",
        inputSchema: receiveEmailInputSchema,
        execute: async (params: z.infer<typeof receiveEmailInputSchema>) => {
            const sendEmail = new EmailJS(params.email);
            sendEmail.setSubject(params.subject);
            sendEmail.setMessage(params.message);
            sendEmail.setName(params.name || "anonymous");
            const { status, text } = await sendEmail.send();
            return `status: ${status}\ntext: ${text}`;
        },
    },
} as const;

const sendEmailBackInputSchema = z.object({
    email: z
        .string()
        .email()
        .describe(
            "email of a user who make request from receive_email_to_developer tool",
        ),
    subject: z
        .string()
        .trim()
        .describe(
            "constructed subject to response the inquires/request of the user from receive_email_to_developer tool",
        ),
    message: z
        .string()
        .trim()
        .describe(
            "constructed message to response the inquires/request of the user from receive_email_to_developer tool",
        ),
});

export const sendEmailBackToUserTool = {
    type: ToolType.Function,
    function: {
        name: "send_email_back_to_user",
        description:
            "tool to email back who send message to the receive_email_to_developer tool",
        inputSchema: sendEmailBackInputSchema,
        execute: async (params: z.infer<typeof sendEmailBackInputSchema>) => {
            const sendEmail = new EmailJS(params.email);
            sendEmail.setSubject(params.subject);
            sendEmail.setMessage(params.message);
            sendEmail.setName("Kenneth Andales Assistant");
            const { status, text } = await sendEmail.sendResponse();
            return `status: ${status}\ntext: ${text}`;
        },
    },
} as const;

/** Portfolio + email tools for supervisor-style OpenRouter agent */
export const portfolioSupervisorOpenRouterTools = [
    skillsListTool,
    experienceListTool,
    servicesListTool,
    projectsPortfolioTool,
    certificatesListTool,
    publicProfileTool,
    pushoverNotificationTool,
    receiveEmailToDeveloperTool,
    sendEmailBackToUserTool,
] as const;

/** Cover letter agent tool set */
export const coverLetterOpenRouterTools = [
    skillsListTool,
    experienceListTool,
    servicesListTool,
    projectsPortfolioTool,
    certificatesListTool,
    publicProfileTool,
] as const;
