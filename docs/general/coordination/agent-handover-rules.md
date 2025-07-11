# Agent Handover Rules

This document defines the proper workflows for task handover between different agent roles to ensure clear responsibilities, proper oversight, and effective collaboration.

## Core Principles

1. **Clear Ownership**: Each task should have a clear owner at any given time
2. **Proper Authorization**: Certain agents can only receive tasks from specific other agents
3. **Chain of Command**: Follow established handover paths to maintain oversight
4. **Appropriate Expertise**: Tasks should be handed over to agents with the right skills
5. **Documentation**: All handovers must include proper context and requirements

## Handover Matrix

The following matrix defines which agents can hand over tasks to which other agents:

| From ↓ / To → | Architect | Orchestrator | Code | Debug | UX Expert | Analyst | Content Creator | Security Expert | Performance Engineer | Database Engineer | Graphic Designer | Documentor | Test Engineer | DevOps Engineer | Localization Expert |
|---------------|:---------:|:------------:|:----:|:-----:|:---------:|:-------:|:---------------:|:---------------:|:--------------------:|:-----------------:|:----------------:|:----------:|:-------------:|:---------------:|:-------------------:|
| **Architect** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Orchestrator** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Code** | ✓ | ✓ | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **Debug** | ✓ | ✓ | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **UX Expert** | ✓ | ✓ | ❌ | ❌ | ✓ | ❌ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ❌ | ❌ | ❌ |
| **Analyst** | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ❌ | ❌ | ❌ | ✓ | ❌ | ✓ | ❌ | ❌ | ❌ |
| **Content Creator** | ✓ | ✓ | ❌ | ❌ | ✓ | ❌ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ❌ | ❌ | ✓ |
| **Security Expert** | ✓ | ✓ | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ❌ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **Performance Engineer** | ✓ | ✓ | ✓ | ✓ | ❌ | ✓ | ❌ | ❌ | ✓ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **Database Engineer** | ✓ | ✓ | ✓ | ✓ | ❌ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **Graphic Designer** | ✓ | ✓ | ❌ | ❌ | ✓ | ❌ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ❌ | ❌ | ❌ |
| **Documentor** | ✓ | ✓ | ❌ | ❌ | ❌ | ❌ | ✓ | ❌ | ❌ | ❌ | ❌ | ✓ | ❌ | ❌ | ✓ |
| **Test Engineer** | ✓ | ✓ | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ❌ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **DevOps Engineer** | ✓ | ✓ | ✓ | ✓ | ❌ | ❌ | ❌ | ✓ | ✓ | ✓ | ❌ | ✓ | ✓ | ✓ | ❌ |
| **Localization Expert** | ✓ | ✓ | ❌ | ❌ | ❌ | ❌ | ✓ | ❌ | ❌ | ❌ | ❌ | ✓ | ❌ | ❌ | ✓ |

## Key Handover Rules

1. **User to Any Agent**: The user (human) can assign tasks to any agent
2. **Architect & Orchestrator**: Can assign tasks to any agent
3. **Technical Specialists**: Code, Debug, Security, Performance, Database, DevOps, and Test Engineers can hand over to each other but NOT to non-technical agents
4. **Non-Technical Specialists**: UX, Content, Graphic, Documentor, and Localization cannot hand over to technical agents except through Architect or Orchestrator
5. **Analyst Restrictions**: Analysts must go through Architect or Orchestrator to reach coders or debuggers

## Special Rules

1. **Originating Agent Rule**: Any agent can always return a task to the agent who assigned it
2. **Escalation Rule**: Any agent can escalate to the Architect or Orchestrator if they need to hand over to an agent they're not directly connected to
3. **Expert Consultation**: Agents can consult with other agents without a formal handover
4. **Complex Task Rule**: For complex tasks involving multiple agents, always use the Orchestrator for coordination

## Handover Process

When handing over a task, the following information must be provided:

1. **Task Summary**: A concise description of what needs to be done
2. **Context**: Background information necessary to understand the task
3. **Requirements**: Specific criteria that must be met
4. **Constraints**: Any limitations or restrictions
5. **Dependencies**: Any prerequisite tasks or resources
6. **Timeline**: Expected completion timeframe
7. **Acceptance Criteria**: How success will be measured

## Implementation Guidelines

1. **Use switch_mode Tool**: When handing over, use the `switch_mode` tool to request the appropriate mode
2. **Clear Rationale**: Always provide a clear reason for the handover
3. **Complete Current Work**: Finish your current work before handing off
4. **Avoid Chain Handovers**: Don't hand over to an agent who will immediately need to hand over again
5. **Document Decisions**: Capture key decisions made during your work before handing over

## Examples

### Proper Handover (Analyst → Architect → Code)
1. Analyst performs data analysis and creates recommendations
2. Analyst hands over to Architect with findings and suggestions
3. Architect creates implementation plan with technical specifications
4. Architect hands over to Code agent for implementation

### Improper Handover (Avoided)
~~Analyst → Code~~: Analyst should not hand over directly to Code agent, as Code agent would lack proper architectural context and oversight.

## Monitoring and Enforcement

All agent handovers are logged in ConPort for tracking and analysis. Regular reviews should be conducted to ensure proper handover processes are being followed.