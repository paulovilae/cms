# Blocked Tasks

This directory contains tasks that cannot proceed due to dependencies, technical limitations, or other blocking issues.

## Purpose

The blocked directory serves as a holding area for tasks that:
1. Are blocked by dependencies on other tasks that are not yet completed
2. Require technical capabilities or resources that are not currently available
3. Have been deferred due to shifting priorities
4. Cannot proceed due to external factors

## Task Management

When a task becomes blocked:
1. Move the task file from the `active` directory to this `blocked` directory
2. Update the task status to "BLOCKED" in the file
3. Document the blocking reason in the "Updates" section
4. If applicable, link to the tasks that need to be completed to unblock

## Regular Review

Blocked tasks should be reviewed regularly (at least bi-weekly) to:
1. Determine if blocking issues have been resolved
2. Re-evaluate priorities and determine if blocked tasks should be unblocked
3. Consider alternative approaches that might avoid the blocking issue
4. Decide if long-blocked tasks should be closed or redefined

## Relationship to ConPort

When tasks are moved to this directory, their status should also be updated in ConPort using the `update_progress` tool with status "BLOCKED" to maintain consistency between the file system and the ConPort database.

## Unblocking Process

When a task is unblocked:
1. Move the task file back to the appropriate priority folder in the `active` directory
2. Update the task status in the file
3. Add a new entry in the "Updates" section documenting that the task has been unblocked and why
4. Update the status in ConPort