# Development Standards

## Clean Code Philosophy

**"Every line of code is a liability until proven to be an asset."**

### Core Principles

1. **Minimal Surface Area**
   - Each file must justify its existence
   - One clear purpose per file/function/component
   - Don't build for imaginary future requirements
   - Consider what can be removed when adding new code

2. **Zero Tolerance for Dead Code**
   - Remove unused imports immediately
   - Delete unreferenced functions
   - Remove components not used in any route
   - Delete commented code blocks (use git history)

3. **Aggressive Deduplication**
   - Extract common patterns to shared utilities
   - Merge similar components with props/variants
   - Consolidate similar configuration files

## Debugging Methodology

**"Always find the root cause, never apply quick dirty fixes."**

### Debugging Workflow

1. **Observation and Evidence Gathering**
   - Reproduce the issue consistently
   - Gather evidence from all relevant sources
   - Document symptoms precisely

2. **Hypothesis and Testing**
   - Form multiple possible explanations
   - Test one hypothesis at a time
   - Document what you rule out

3. **Root Cause Analysis**
   - Identify the exact source of the problem
   - Understand why it happens, not just where
   - Trace the full impact

4. **Clean Solution Implementation**
   - Address the root cause, not symptoms
   - Avoid workarounds or quick patches
   - Consider side effects of your solution
   - Test thoroughly

### Anti-Patterns to Avoid

- Adding flags/guards without understanding why
- Wrapping in try-catch without handling errors
- Adding delays to "fix" race conditions
- Duplicating logic instead of fixing the original
- Assuming the problem is in recently changed code
- Stopping investigation after finding a workaround

## Safe Deletion Policy

**"Never delete code immediately - quarantine first, delete later."**

### Quarantine Process

1. **Move to Quarantine** - Relocate to `.kilocode/quarantine/[date]-[name]/`
2. **Document Original Location** - Record where files came from
3. **Create Quarantine Log** - Document reason and recovery steps
4. **Monitor Period** - Wait 30 days for issues to surface
5. **Final Deletion** - Remove only after quarantine period

### Pre-Quarantine Checklist
- Search entire codebase for references
- Check git history for recent usage
- Run full test suite to ensure no dependencies
- Create git commit before moving anything
- Document reasoning for quarantine decision

### What to Quarantine
- Suspected unused code
- Experimental features that didn't launch
- Duplicate functionality
- Old versions of migrated code

### What NOT to Quarantine
- Core system files
- Recently modified files (< 30 days)
- Files with clear dependencies
- Configuration files for build/deployment