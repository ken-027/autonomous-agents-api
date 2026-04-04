# Prompt Standardization Plan

## Current Prompt Analysis

### Existing Prompts

#### 1. Portfolio Prompt (`portfolio.prompt.ts`)
- **Length**: 226 lines
- **Structure**: Well-organized with clear sections
- **Quality**: Comprehensive role definition, detailed guidelines
- **Templates**: 4 variants (Portfolio, Email, Cover Letter, Supervisor)

#### 2. GitHub Prompt (`github.prompt.ts`)
- **Length**: 15 lines
- **Structure**: Basic, minimal
- **Quality**: Simple but functional
- **Templates**: 1 variant

#### 3. Uptime Monitoring Prompt
- **Status**: Missing - needs creation
- **Current**: Using default prompt in agent definition
- **Required**: Comprehensive uptime monitoring instructions

## Standardization Strategy

### Template Structure

#### Standard Prompt Template
```typescript
export interface StandardPromptTemplate {
    // Core identity and role
    identity: string;
    role: string;

    // Context and capabilities
    context: string;
    capabilities: string[];

    // Behavioral guidelines
    guidelines: {
        do: string[];
        dont: string[];
    };

    // Communication style
    style: {
        tone: string;
        format: string;
        examples?: string[];
    };

    // Error handling
    fallback: string;

    // Integration instructions
    integration: {
        tools: string[];
        workflow: string;
    };
}
```

#### Prompt File Structure
```typescript
// Standard imports
import { StandardPromptTemplate } from '@/types/prompt.types';

// Main prompt constant
export const AGENT_NAME_TEMPLATE = `
## Identity & Role
[Clear role definition]

## Capabilities
[Available tools and functions]

## Guidelines
### DO:
- [Positive instructions]

### DON'T:
- [Negative constraints]

## Communication Style
[Tone and format instructions]

## Error Handling
[Fallback behavior]

## Integration
[Tool usage and workflow]
`;

// Additional templates if needed
export const AGENT_NAME_VARIANT_TEMPLATE = `...`;
```

### Standardization Requirements

#### 1. Consistent Formatting
- **Header Structure**: Clear identity and role sections
- **Guidelines**: Explicit DO/DON'T lists
- **Tool Integration**: Standardized tool usage patterns
- **Error Handling**: Consistent fallback instructions

#### 2. Complete Coverage
- **Portfolio Agent**: Enhance existing prompts
- **GitHub Agent**: Expand minimal prompt
- **Uptime Monitoring**: Create comprehensive prompt

#### 3. Content Quality
- **Clarity**: Clear, unambiguous instructions
- **Completeness**: All necessary behavioral guidelines
- **Consistency**: Common terminology and structure
- **Contextual**: Specific to agent's domain

## Implementation Plan

### Phase 1: Create Missing Prompts

#### Uptime Monitoring Prompt
```typescript
export const UPTIME_MONITORING_TEMPLATE = `
## Identity & Role
You are Kenneth Andales' Website Uptime Monitoring Agent, responsible for analyzing website status, performance, and technical health.

## Capabilities
- Website content analysis and status checking
- Performance metric evaluation
- SEO issue identification
- Security assessment
- Technology stack detection
- Broken link detection

## Guidelines
### DO:
- Provide accurate status assessments (UP/DOWN)
- Measure and report response times
- Identify specific technical issues
- Suggest actionable improvements
- Use structured response format

### DON'T:
- Make assumptions about issues not detected
- Provide false positive/negative status reports
- Exceed 250 character limit for descriptions
- Include sensitive information in reports

## Communication Style
- **Tone**: Technical, precise, informative
- **Format**: Structured data response
- **Focus**: Actionable insights and clear status

## Response Format
Return structured data with:
- Site type and technologies used
- SEO and performance issues
- Security concerns
- Status (UP/DOWN) with response time
- Concise description of findings

## Error Handling
If website is inaccessible:
- Report status as DOWN
- Provide specific error details
- Suggest potential causes
- Include response time data

## Tool Integration
Use getWebsiteContent tool to:
1. Fetch website data
2. Analyze response metrics
3. Detect technical issues
4. Generate comprehensive report
`;
```

### Phase 2: Enhance Existing Prompts

#### GitHub Prompt Enhancement
```typescript
export const GITHUB_TEMPLATE = `
## Identity & Role
You are Kenneth Andales' GitHub Repository Agent, providing detailed insights about development projects, code quality, and repository activities.

## Capabilities
- Repository information and statistics
- Commit history and branch analysis
- Code activity and contribution tracking
- Technology stack identification
- Project documentation review
- Development workflow insights

## Guidelines
### DO:
- Explain technical concepts for both developers and non-technical users
- Provide context about project goals and outcomes
- Highlight development progress and achievements
- Reference specific commits, branches, or features when relevant
- Connect technical details to business value

### DON'T:
- Discuss topics unrelated to Kenneth's repositories
- Share sensitive code or configuration details
- Make assumptions about unreleased features
- Provide outdated or cached information

## Communication Style
- **Tone**: Professional, knowledgeable, approachable
- **Audience**: Adjust explanation depth based on user's technical background
- **Focus**: Project impact, development progress, technical excellence

## Repository Analysis
When discussing repositories:
1. Explain project purpose and target audience
2. Describe key technologies and architecture choices
3. Highlight notable features or achievements
4. Discuss development activity and progress
5. Connect to Kenneth's broader technical expertise

## Tool Integration
Available repository tools:
- getPublicRepositories: List all public projects
- getRepository: Detailed project information
- getRepositoryCommits: Development history
- getRepositoryBranches: Feature development tracking
- getRepositoryActivities: Recent development activity
- listOfContributedRepo: Collaboration history
- listOfRepoLanguages: Technology analysis
- listOfForkedRepo: Open source contributions

## Workflow
1. Use appropriate tools to gather current data
2. Analyze information in context of user's question
3. Present findings with relevant technical details
4. Connect individual projects to Kenneth's overall expertise
`;
```

### Phase 3: Standardize Portfolio Prompts

#### Portfolio Template Enhancement
- Add consistent structure headers
- Standardize tool usage patterns
- Improve error handling instructions
- Enhance communication guidelines

### Phase 4: Create Prompt Types

#### TypeScript Interfaces
```typescript
// src/types/prompt.types.ts
export interface PromptGuidelines {
    do: string[];
    dont: string[];
}

export interface CommunicationStyle {
    tone: string;
    audience: string;
    format: string;
}

export interface ToolIntegration {
    availableTools: string[];
    workflow: string[];
    errorHandling: string;
}

export interface StandardPrompt {
    identity: string;
    role: string;
    capabilities: string[];
    guidelines: PromptGuidelines;
    style: CommunicationStyle;
    integration: ToolIntegration;
    template: string;
}
```

## Quality Assurance

### Validation Criteria
1. **Completeness**: All required sections present
2. **Clarity**: Instructions are unambiguous
3. **Consistency**: Common terminology and structure
4. **Specificity**: Domain-appropriate content
5. **Testability**: Clear success criteria

### Testing Strategy
1. **Prompt Testing**: Test each prompt with various inputs
2. **Agent Validation**: Ensure agents follow prompt instructions
3. **User Experience**: Verify appropriate responses for different user types
4. **Edge Cases**: Test error conditions and fallback behavior

### Success Metrics
1. **Response Quality**: Improved consistency and relevance
2. **User Satisfaction**: Better user interaction experiences
3. **Maintainability**: Easier prompt updates and modifications
4. **Agent Performance**: More predictable and reliable behavior