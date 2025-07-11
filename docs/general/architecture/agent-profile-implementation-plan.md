# Agent Profile Implementation Plan

This document outlines the implementation plan for updating the agent profiles based on the improvements defined in [agent-profile-improvements.md](agent-profile-improvements.md) and the directory structure defined in [complete-directory-structure.md](complete-directory-structure.md).

## Background

The Code and Debug agents have been experiencing recurring issues, including:
- Repeated bugs
- Difficulty solving problems efficiently
- Lack of structured approach to error prevention
- Insufficient learning from past mistakes
- Limited guidance on testing and verification

Additionally, there is confusion about file locations, especially for tasks, tests, and other artifacts, leading to inconsistent organization and difficulty locating resources.

## Implementation Steps

Since the Architect mode can only edit markdown files, we need to switch to Code mode to update the YAML profile files:

1. **Switch to Code Mode** - The Code agent has permission to edit the YAML profile files

2. **Add Directory Structure Reference to All Profiles**
   - Add a common section referencing `docs/general/architecture/complete-directory-structure.md`
   - Include specific file location guidance for each agent type
   - Emphasize that ALL tasks must be stored in `context_portal/tasks/`

3. **Update Code Agent Profile** - Update `.kilocode/profiles/code-export.yaml`:
   - Add structured approach with 7 phases (Understanding, Planning, Implementation, Testing, Documentation, Pre-submission, Knowledge Preservation)
   - Add common pitfalls to avoid
   - Add explicit references to directory structure:
     - Source code in `src/`
     - Tests in `tests/` (with business-specific subdirectories)
     - Infrastructure scripts in `infrastructure/scripts/`
   - Maintain existing permissions and role definitions

4. **Update Debug Agent Profile** - Update `.kilocode/profiles/debug-export.yaml`:
   - Add structured debugging workflow (Reproduce, Isolate, Root Cause Analysis, Fix Implementation, Verification, Prevention, Knowledge Transfer)
   - Add Docker-specific debugging section
   - Add Multi-tenant debugging section
   - Add explicit file location guidelines
   - Maintain existing warnings about not creating simplified versions

5. **Update Architect Agent Profile** - Update `.kilocode/profiles/architect-export-good.yaml`:
   - Add additional requirements sections (Initial Research, Risk Assessment, Testability)
   - Update task management references to use `context_portal/tasks/` exclusively
   - Add explicit instruction to store architecture documentation in `docs/general/architecture/` or `docs/{business}/architecture/`
   - Maintain existing process steps and permissions

6. **Update Orchestrator Agent Profile** - Update `.kilocode/profiles/orchestrator-export.yaml`:
   - Add comprehensive Agent Assignment Matrix
   - Add Task Type Decision Matrix
   - Add sections for Dependency Management, Failure Handling, and Knowledge Preservation
   - Add explicit instruction to store tasks in `context_portal/tasks/`
   - Add clear directory responsibility guidance for each agent
   - Maintain existing process steps and permissions

7. **Update Ask Agent Profile** - Update `.kilocode/profiles/ask-export.yaml`:
   - Add structured approach to answering questions
   - Enhance with multi-tenant considerations
   - Add reference to directory structure for consistent information
   - Maintain existing permissions

8. **Create Supporting Documentation**:
   - Create common pitfalls and best practices document
   - Create a troubleshooting guide for multi-tenant CMS issues

## Directory Structure Implementation

All agent profiles must reference the [Complete Directory Structure](complete-directory-structure.md) and include specific guidance for:

1. **Task Management**
   - ALL tasks must be stored in `context_portal/tasks/`
   - Tasks must follow the naming convention: `YYYY-MM-DD_task-name_agent.md`
   - Tasks must be organized by status (active/blocked/completed) and priority (high/medium/low)

2. **Documentation Organization**
   - All documentation must be stored in `docs/` with appropriate subdirectories
   - Business-specific documentation must be in `docs/{business}/`
   - Cross-business documentation must be in `docs/general/`

3. **Test Organization**
   - All tests must be stored in `tests/` with appropriate subdirectories
   - Unit tests must be organized by business unit in `tests/unit/{business}/`
   - Cross-business tests must be in `tests/unit/general/`

4. **Asset Organization**
   - All assets must be stored in `assets/` with appropriate subdirectories
   - Business-specific assets must be in `assets/{business}/`
   - Cross-business assets must be in `assets/general/`

## Code Mode Instructions

When switching to Code mode, provide the following instructions:

```
Please update the agent profiles according to the implementation plan in docs/general/architecture/agent-profile-implementation-plan.md, the detailed improvements in docs/general/architecture/agent-profile-improvements.md, and the directory structure in docs/general/architecture/complete-directory-structure.md.

Start with the following files:
1. .kilocode/profiles/code-export.yaml
2. .kilocode/profiles/debug-export.yaml
3. .kilocode/profiles/architect-export-good.yaml
4. .kilocode/profiles/orchestrator-export.yaml
5. .kilocode/profiles/ask-export.yaml

For each file:
1. Read the current content
2. Update with the improved instructions from agent-profile-improvements.md
3. Add explicit directory structure guidance from complete-directory-structure.md
4. Preserve all existing fields (slug, name, iconName, roleDefinition, whenToUse, description, groups, source)
5. Only update the customInstructions field

Ensure all profiles include explicit references to:
- Tasks must ALWAYS be stored in context_portal/tasks/
- Documentation must be stored in docs/ with appropriate subdirectories
- Tests must be stored in tests/ with appropriate subdirectories
- Assets must be stored in assets/ with appropriate subdirectories
```

## Validation

After the updates are applied, we should validate that:

1. All profiles load correctly
2. The structure and formatting of the YAML files is preserved
3. The improved instructions are correctly incorporated
4. No existing functionality is lost
5. Directory structure guidance is clear and consistent across all agents

## Expected Outcomes

Once implemented, these changes should result in:

1. More structured approach to coding and debugging
2. Better prevention of common errors
3. Improved documentation of solutions and patterns
4. Clearer task assignment for the Orchestrator
5. Better multi-tenant considerations across all agents
6. Consistent file organization across the entire project
7. Clear understanding of where each agent should store their work products

## Next Steps

After implementing these changes, we should:

1. Monitor agent performance to verify improvements
2. Collect feedback on the new structured approaches
3. Evaluate the effectiveness of the directory structure guidance
4. Update the migration checklist to reflect the directory structure implementation
5. Consider creating additional templates and examples for each directory