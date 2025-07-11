# Development Mottos & Principles

## Core Mottos

### "Local Info for Local Problems"
**Principle**: Keep relevant information exactly where it's needed, not in distant centralized files.
- Each directory contains an `info.md` file with all relevant context for that specific area
- No need to hunt through massive documentation files
- Information is immediately accessible when working in that context
- Cross-references link to other directories' `info.md` files when needed

### "Context Over Centralization"
**Principle**: Distributed knowledge beats centralized documentation.
- Information lives where the work happens
- Agents find answers in the exact location they're working
- No cognitive overhead from unrelated information
- Natural information architecture that mirrors code structure

### "Growing Knowledge, Managed Size"
**Principle**: Let knowledge grow naturally, but manage it intelligently.
- `info.md` files grow with experience and learning
- When files reach optimal size, extract key learnings to specialized documentation
- Documentor agent manages knowledge consolidation and size optimization
- Keep the most relevant and recent information easily accessible

### "Link, Don't Duplicate"
**Principle**: Connect related information through links, not copies.
- Database info stays in database directory's `info.md`
- API info stays in API directory's `info.md`
- Cross-reference with clear links: "For database schema details, see `infrastructure/database/info.md`"
- Single source of truth for each domain

### "Experience-Driven Documentation"
**Principle**: Documentation emerges from real problem-solving, not theoretical planning.
- Code and Debug agents document actual solutions and patterns
- Real debugging sessions create the most valuable knowledge
- Theoretical documentation is less valuable than battle-tested solutions
- Every fix becomes institutional knowledge

## Implementation Principles

### File Structure
- **`info.md`**: Primary knowledge file in each directory
- **`debug.md`**: Specific debugging experiences and solutions (optional, merges into info.md)
- **`fixes.md`**: Record of fixes applied (optional, merges into info.md)
- **Cross-references**: Clear links to related directories' info files

### Content Structure
Each `info.md` should contain:
1. **Purpose**: What this directory/component does
2. **Key Patterns**: Important code patterns and conventions
3. **Common Issues**: Known problems and their solutions
4. **Dependencies**: What this component depends on (with links)
5. **Recent Learnings**: Latest discoveries and fixes
6. **Cross-References**: Links to related `info.md` files

### Size Management
- Target size: ~500-1000 lines per `info.md`
- When approaching limit: Call Documentor agent
- Documentor extracts key patterns to specialized docs
- Keep most recent and relevant information in `info.md`
- Archive historical information to specialized documentation

### Agent Responsibilities
- **Code Agent**: Updates `info.md` with new patterns and implementations
- **Debug Agent**: Documents solutions and debugging approaches in `info.md`
- **Documentor Agent**: Manages size optimization and knowledge extraction
- **All Agents**: Reference local `info.md` first, cross-reference as needed

## Revolutionary Benefits

### For Agents
- **Immediate Context**: All relevant information is right where they're working
- **No Information Overload**: Only see what's relevant to current task
- **Natural Discovery**: Information architecture matches mental model
- **Efficient Cross-Referencing**: Clear paths to related information

### For Development
- **Living Documentation**: Grows and evolves with the codebase
- **Problem-Solution Proximity**: Solutions are documented where problems occur
- **Reduced Cognitive Load**: No need to remember where information is stored
- **Faster Onboarding**: New agents can understand any area by reading its `info.md`

### For Maintenance
- **Self-Organizing**: Information naturally organizes around actual usage patterns
- **Automatic Relevance**: Most-used information stays prominent
- **Efficient Updates**: Changes are made where they're most relevant
- **Natural Archival**: Less relevant information naturally gets consolidated

## Success Metrics

- **Time to Information**: How quickly agents find relevant context
- **Information Accuracy**: How often local info solves the immediate problem
- **Cross-Reference Usage**: How effectively agents navigate between related areas
- **Knowledge Retention**: How well solutions are preserved and reused
- **Agent Satisfaction**: How much agents prefer this system over centralized docs

---

*"The best documentation is the one you don't have to search for - it's already where you need it."*