# Agentic API Implementation Plans

This directory contains detailed implementation plans for the agentic API system.

## Overview

The agentic API provides AI-powered agents for portfolio management, GitHub integration, and uptime monitoring. This plans directory documents the implementation strategy for:

- AI package migration from LangChain to more flexible providers
- Prompt standardization across all agents
- System architecture improvements

## Plans

1. **[AI Migration Plan](./ai-migration-plan.md)** - Migration strategy from LangChain to OpenRouter/other AI providers
2. **[Prompt Standardization](./prompt-standardization.md)** - Standardizing prompts across all agents
3. **[Package Evaluation](./package-evaluation.md)** - Evaluation of different AI packages and providers

## Current Agents

### Portfolio Agent
- **Purpose**: Provides information about Kenneth Andales' portfolio, skills, experience, and services
- **Prompts**: Portfolio, Email, Cover Letter, Supervisor templates
- **Tools**: Skills, experience, services, projects, certificates, contact resources

### GitHub Agent
- **Purpose**: Provides information about GitHub repositories and activities
- **Prompts**: GitHub template
- **Tools**: Repository operations, activities, commits, branches

### Uptime Monitoring Agent
- **Purpose**: Monitors website status and performance
- **Prompts**: Uptime template (needs enhancement)
- **Tools**: Website content analysis

## Implementation Status

- [x] Initial analysis of current system
- [x] Plan creation and documentation
- [ ] AI package migration
- [ ] Prompt standardization
- [ ] Testing and validation