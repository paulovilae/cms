# Task: Fix Agent Profile YAML Structure

**Priority**: HIGH
**Created by**: Architect
**Created on**: 2025-07-10
**Status**: COMPLETED
**Assigned to**: Code

## Objective
Fix the incorrect structure in the agent profile YAML files that is causing the "Array must contain at most 2 element(s)" error.

## Context
Multiple agent profile YAML files in the `.kilocode/profiles/` directory have an incorrect format in the `groups` section, specifically for the `edit` permissions. The incorrect format uses brackets and a closing bracket (`["edit", ... ]`) instead of the double dash notation (`- - edit`). This is causing validation errors when loading certain profiles.

## Requirements
1. Fix all agent profile YAML files to use the correct double dash structure
2. Preserve all existing permission settings (file patterns and directories)
3. Ensure profiles can be loaded without validation errors
4. Create backups of original files before modifying them

## Constraints
- Do not modify the semantics of any permissions
- Maintain the same set of permissions for each agent
- Only fix the structure, not the content of the profiles

## Dependencies
None

## Timeline
Urgent - should be completed immediately as it's blocking agent functionality

## Acceptance Criteria
- All profile files use the correct double dash structure
- No validation errors when loading any profile
- The performance-engineer profile loads successfully
- All agent permissions remain functionally equivalent

## Sample Fix
The following shows the required change for a sample profile:

**Incorrect Structure**:
```yaml
groups:
  - read
  - ["edit",
    - fileRegex: \.(md|json)$
      description: Performance reports and configuration
    - directory: ./reports/performance/
      description: Performance reports directory
]
  - browser
  - command
  - mcp
```

**Correct Structure**:
```yaml
groups:
  - read
  - - edit
    - fileRegex: \.(md|json)$
      description: Performance reports and configuration
    - directory: ./reports/performance/
      description: Performance reports directory
  - browser
  - command
  - mcp
```

## Updates
- 2025-07-10 - Task created
- 2025-07-10 - Initial script created to identify affected files and create backups
- 2025-07-10 - Attempted fix with `["edit", ... ]` format was incorrect
- 2025-07-10 - Created new plan to use the correct `- - edit` format from working examples
- 2025-07-10 - Successfully fixed the stray bracket in architect-export.yaml
- 2025-07-10 - Created cleanup_profiles.sh to organize profile files
- 2025-07-10 - Created documentation in reports/documentation/agent-profiles-fix-summary.md
- 2025-07-10 - All profiles now have correct structure and no stray brackets
- 2025-07-10 - Task completed

## Related Tasks
- Revision of agent profile documentation
- Update of Architect agent customInstructions to reference the correct task directory (context_portal/tasks/ instead of .kilocode/tasks/)