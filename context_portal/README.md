# Context Portal Directory

This directory contains project-specific knowledge and context managed through ConPort.

## Purpose

- Centralized location for project knowledge and context
- Storage for project decisions and tasks
- Separation of project-specific knowledge from reusable configuration

## Subdirectories

- **decisions/** - Architecture and implementation decisions with rationales
- **tasks/** - Project tasks moved from .kilocode for better project-specific tracking
- **alembic/** - Database migration scripts for ConPort (automatically managed)
- **logs/** - ConPort logs for troubleshooting
- **conport_vector_data/** - Vector embeddings for semantic search (automatically managed)

## Usage Guidelines

- Use ConPort tools to manage this data rather than editing files directly
- Document architecture decisions with clear rationales
- Track tasks with appropriate metadata and status updates
- Ensure task descriptions include clear acceptance criteria
- Reference related documents and code when applicable
- Coordinate updates with the appropriate agent for each content type
- Use proper naming conventions and organization for consistency