# AI Package Migration Plan

## Current State

### Current Implementation
- **Framework**: LangChain with Universal Chat Model
- **Provider**: OpenAI GPT-4o-mini
- **Usage Pattern**: `initChatModel("openai:gpt-4o-mini")`
- **Dependencies**:
  - `langchain`: ^0.3.29
  - `@langchain/core`: ^0.3.60
  - `@langchain/langgraph`: ^0.3.4
  - `openai`: ^4.97.0

### Current Agent Structure
```typescript
// Current pattern in all agents
import { initChatModel } from "langchain/chat_models/universal";

export const SomeAgent = async () => {
    const llm = await initChatModel("openai:gpt-4o-mini");
    return createReactAgent({ llm, tools, prompt });
};
```

## Migration Strategy

### Phase 1: Package Evaluation

#### Option 1: OpenRouter (Recommended)
- **Package**: `openrouter` npm package
- **Benefits**:
  - Multi-provider support (OpenAI, Anthropic, Cohere, etc.)
  - Cost optimization
  - Model fallback capabilities
  - Unified API interface
- **Configuration**:
  ```typescript
  import OpenRouter from 'openrouter';
  const client = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultModel: 'openai/gpt-4o-mini'
  });
  ```

#### Option 2: Direct OpenAI SDK
- **Package**: Current `openai` package
- **Benefits**:
  - Direct integration
  - Full OpenAI feature support
  - Better performance
- **Configuration**:
  ```typescript
  import OpenAI from 'openai';
  const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
  });
  ```

#### Option 3: Anthropic SDK
- **Package**: `@anthropic-ai/sdk`
- **Benefits**:
  - Claude model access
  - Better reasoning capabilities
  - Cost-effective for complex tasks
- **Configuration**:
  ```typescript
  import Anthropic from '@anthropic-ai/sdk';
  const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
  });
  ```

### Phase 2: Architecture Design

#### AI Provider Abstraction Layer
Create `src/config/ai-provider.ts`:
```typescript
interface AIProvider {
    generateResponse(prompt: string, options?: any): Promise<string>;
    generateStructuredResponse<T>(prompt: string, schema: any): Promise<T>;
}

class OpenRouterProvider implements AIProvider {
    // Implementation
}

class OpenAIProvider implements AIProvider {
    // Implementation
}

export const createAIProvider = (type: 'openrouter' | 'openai' | 'anthropic') => {
    // Factory pattern implementation
};
```

### Phase 3: Migration Steps

#### Step 1: Install New Dependencies
```bash
npm install openrouter
# OR
npm install @anthropic-ai/sdk
```

#### Step 2: Create Provider Configuration
- Environment variable setup
- Provider factory implementation
- Error handling and fallback logic

#### Step 3: Agent Migration
1. **Portfolio Agent**: Update to use new provider while maintaining LangChain tools
2. **GitHub Agent**: Migrate provider and test repository operations
3. **Uptime Monitoring Agent**: Update provider and add missing prompt

#### Step 4: Testing Strategy
- Unit tests for each provider
- Integration tests for agent functionality
- Performance benchmarking
- Cost analysis

### Phase 4: Implementation Details

#### Environment Configuration
```env
# OpenRouter
OPENROUTER_API_KEY=your_key_here
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o-mini

# OpenAI (fallback)
OPENAI_API_KEY=your_key_here

# Anthropic (optional)
ANTHROPIC_API_KEY=your_key_here
```

#### Migration Timeline
- **Week 1**: Provider abstraction layer and OpenRouter integration
- **Week 2**: Portfolio agent migration and testing
- **Week 3**: GitHub and uptime monitoring agent migration
- **Week 4**: Testing, optimization, and documentation

### Benefits of Migration

1. **Cost Optimization**: OpenRouter provides competitive pricing across providers
2. **Flexibility**: Easy switching between AI providers based on use case
3. **Reliability**: Fallback options if primary provider is unavailable
4. **Performance**: Direct API calls instead of LangChain abstraction overhead
5. **Feature Access**: Provider-specific features and optimizations

### Risk Mitigation

1. **Backward Compatibility**: Maintain LangChain integration during transition
2. **Gradual Migration**: Migrate one agent at a time
3. **Monitoring**: Add logging and error tracking for new providers
4. **Rollback Plan**: Keep existing implementation as fallback

### Success Metrics

1. **Performance**: Response time improvements
2. **Cost**: Reduction in AI API costs
3. **Reliability**: Uptime and error rate monitoring
4. **Functionality**: All existing features work correctly