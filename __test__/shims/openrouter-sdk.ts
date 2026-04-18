/**
 * Jest runs in CommonJS and cannot load ESM-only `@openrouter/sdk` from node_modules.
 * Map `@openrouter/sdk` to this file so the app module graph loads; v1 e2e tests do not call OpenRouter.
 */
export enum ToolType {
    Function = "function",
}

export class OpenRouter {
    constructor(_options: { apiKey?: string }) {}
}
