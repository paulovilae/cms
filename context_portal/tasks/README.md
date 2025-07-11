# Tasks Management Directory

This directory contains project tasks created by various agents, organized to maintain clear ownership and support the agent handover process.

## Directory Structure

```
tasks/
├── README.md                # This documentation file
├── active/                  # Currently active tasks
│   ├── high/                # High priority tasks
│   ├── medium/              # Medium priority tasks
│   └── low/                 # Low priority tasks
├── completed/               # Tasks that have been completed
├── blocked/                 # Tasks that are blocked by dependencies or issues
└── templates/               # Task templates for consistent formatting
```

## Task File Naming Convention

Task files should follow this naming convention:
```
YYYY-MM-DD_task-name_agent-slug.md
```

Example: `2025-07-10_implement-search-api_architect.md`

## Task Creation Permissions

According to our agent handover rules:

1. **Primary Task Creators**:
   - Architect
   - Orchestrator
   
   These roles have the broadest view of the project and can create tasks for any agent.

2. **Technical Task Creators**:
   - Code
   - Debug
   - Security Expert
   - Performance Engineer
   - Database Engineer
   - Test Engineer
   - DevOps Engineer
   
   These roles can create technical tasks that fall within their domain of expertise.

3. **Specialized Task Creators**:
   - UX Expert (UX/UI-related tasks)
   - Analyst (analytical tasks)
   - Content Creator (content-related tasks)
   - Graphic Designer (design-related tasks)
   - Documentor (documentation tasks)
   - Localization Expert (localization tasks)
   
   These roles can create specialized tasks within their domains but should coordinate with Architect or Orchestrator for tasks that have broader implications.

## Task File Template

Every task file should follow this structure:

```markdown
# Task: [Task Title]

**Priority**: [HIGH/MEDIUM/LOW]
**Created by**: [Agent Role]
**Created on**: [YYYY-MM-DD]
**Status**: [PENDING/IN_PROGRESS/COMPLETED/BLOCKED/NEEDS_REVIEW]
**Assigned to**: [Agent Role]

## Objective
[Concise description of what needs to be accomplished]

## Context
[Background information necessary to understand the task]

## Requirements
[Specific criteria that must be met]

## Constraints
[Any limitations or restrictions]

## Dependencies
[Any prerequisite tasks or resources]

## Timeline
[Expected completion timeframe]

## Acceptance Criteria
[How success will be measured]

## Updates
- [YYYY-MM-DD] - [Status change or progress update]

## Related Tasks
- [Links to related tasks]
```

## Task Workflow

1. **Task Creation**: 
   - Agent creates a task file in the appropriate priority folder under `active/`
   - Agent documents all necessary details using the template

2. **Task Assignment**:
   - Tasks are assigned according to the agent handover rules
   - Assignment should be documented in the task file

3. **Task Progress**:
   - The assigned agent updates the task file with progress
   - Status changes and significant updates are logged in the "Updates" section

4. **Task Completion/Blocking**:
   - Completed tasks are moved to the `completed/` directory
   - Blocked tasks are moved to the `blocked/` directory with clear documentation of the blocking issues

5. **Task Review**:
   - Completed tasks may need review before being marked as fully completed
   - Review comments and approvals are documented in the task file

## Integration with ConPort

All task management is integrated with the ConPort system:

1. Tasks created in this directory are also logged in ConPort
2. Updates to tasks trigger updates in ConPort
3. The ConPort `log_progress` tool can be used to track task status changes

## Note for Architect Mode

**Important**: The Architect profile currently references `.kilocode/tasks` as the task storage location in its instructions. This needs to be updated to reference `context_portal/tasks/active/` instead.