# Task: Update Architect Profile Task Path Reference

**Priority**: MEDIUM
**Created by**: Architect
**Created on**: 2025-07-10
**Status**: PENDING
**Assigned to**: Code

## Objective
Update the Architect agent profile's customInstructions to reference the correct path for task storage.

## Context
According to our directory structure documentation, the tasks directory has been moved from `.kilocode/tasks/` to `context_portal/tasks/`. However, the Architect profile's customInstructions still reference the old path. This inconsistency could cause confusion and incorrect task storage locations.

From the Architect profile's customInstructions:
```
5. Once the user confirms the plan, write it to a markdown file inside .kilocode/tasks.
```

This should be updated to:
```
5. Once the user confirms the plan, write it to a markdown file inside context_portal/tasks/active/ with the appropriate priority folder.
```

## Requirements
1. Update the Architect profile's customInstructions to reference the correct task storage path
2. Maintain all other instructions and functionality of the Architect profile
3. Ensure the reference includes guidance on storing tasks in the correct priority subfolder

## Constraints
- Do not modify other parts of the Architect profile unnecessarily
- Ensure the YAML structure remains valid
- Maintain compatibility with the existing agent handover rules

## Dependencies
- Fix agent profile structure task should be completed first to ensure valid YAML structure

## Timeline
Should be completed within the next development cycle

## Acceptance Criteria
- Architect profile customInstructions reference `context_portal/tasks/active/` instead of `.kilocode/tasks`
- The profile loads without validation errors
- The task workflow is clearly explained with the correct directory structure
- New tasks created by the Architect are stored in the correct location

## Updates
- 2025-07-10 - Task created

## Related Tasks
- 2025-07-10_fix-agent-profile-structure_architect.md (HIGH priority)
- Task directory structure implementation