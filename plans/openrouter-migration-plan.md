# OpenRouter Migration & Agent Enhancement Plan

## Overview
Migrate from LangChain's OpenAI integration to OpenRouter API for multi-model support, create a reusable OpenRouter service class, and enhance agent prompts.

## 📦 Phase 1: Install OpenRouter Package
- Install `@openrouter/ai-sdk-provider` (latest: v2.3.3)
- Update package.json dependencies
- Remove or reduce dependency on OpenAI direct integration

## 🏗️ Phase 2: Create OpenRouter Service Class
Create `/src/services/openrouter.service.ts`:
- Reusable OpenRouter client wrapper similar to LangChain's approach
- Support for different models (Claude, GPT, etc.)
- Environment configuration management
- Error handling and fallback mechanisms
- Chat completion methods with streaming support
- Token usage tracking capabilities

## 🔄 Phase 3: Migrate Existing Agents
Update all agents to use OpenRouter service:

### GitHub Agent (`src/agents/github.agent.ts`)
- Replace `initChatModel("openai:gpt-4o-mini")` with OpenRouter service
- Maintain existing tool integration and prompt structure
- Update model to use OpenRouter model syntax (e.g., `anthropic/claude-sonnet-4`)

### Portfolio Agents (`src/agents/portfolio.agents.ts`)
- Migrate `PortfolioAgent`, `EmailAgent`, `CoverLetterAgent`
- Update `PortfolioSupervisor` to use OpenRouter
- Preserve existing tool integrations
- Maintain streaming capabilities in controller

### Uptime Monitoring Agent (`src/agents/uptime-monitoring.agents.ts`)
- Replace LangChain OpenAI integration with OpenRouter
- Maintain structured response format with Zod validation
- Keep existing tool and prompt structure

## ✨ Phase 4: Enhance Agent Prompts
Improve prompts in `/src/config/agents_prompt/`:

### GitHub Prompt (`github.prompt.ts`)
- Add more specific instructions for repository analysis
- Include code quality assessment capabilities
- Add project architecture analysis features

### Portfolio Prompt (`portfolio.prompt.ts`)
- Enhance professional presentation guidelines
- Add industry-specific customization instructions
- Improve client interaction scenarios

### Uptime Monitoring Prompt (`uptime-monitoring.prompt.ts`)
- Add more detailed technical analysis instructions
- Include security assessment guidelines
- Enhance performance evaluation criteria

## 📋 Phase 5: Update Configuration & Controller
- Update `AgentsConfig` in `src/agents/index.ts` to support new OpenRouter integration
- Modify `src/controllers/agent.controller.ts` to handle OpenRouter streaming responses
- Ensure session management remains functional
- Test all agent endpoints

## 🧪 Phase 6: Testing & Validation
- Test all agent endpoints with new OpenRouter integration
- Validate streaming functionality works correctly
- Ensure tool integrations remain functional
- Test different model options for optimal performance

## 📁 Files to Create/Modify

### New Files:
- `/plans/openrouter-migration-plan.md` - This plan document
- `/src/services/openrouter.service.ts` - Reusable OpenRouter client

### Modified Files:
- `package.json` - Add OpenRouter dependency
- `src/agents/github.agent.ts`
- `src/agents/portfolio.agents.ts`
- `src/agents/uptime-monitoring.agents.ts`
- `src/config/agents_prompt/*.prompt.ts` (all prompt files)
- `src/controllers/agent.controller.ts`

## 🎯 Benefits
- Access to 300+ AI models through single API
- Cost optimization through model selection
- Better model performance for specific use cases
- Improved fallback mechanisms
- Enhanced token usage tracking
- More sophisticated agent capabilities

## Implementation Status
- [x] Create migration plan document
- [ ] Install @openrouter/ai-sdk-provider package
- [ ] Create OpenRouter service class
- [ ] Migrate GitHub agent to use OpenRouter
- [ ] Migrate Portfolio agents to use OpenRouter
- [ ] Migrate Uptime Monitoring agent to use OpenRouter
- [ ] Enhance GitHub agent prompt
- [ ] Enhance Portfolio agent prompts
- [ ] Enhance Uptime Monitoring agent prompt
- [ ] Update agent controller for OpenRouter streaming
- [ ] Test all agent endpoints