# Cleanup Scripts

This directory contains scripts for implementing and maintaining the Clean Minimal Code Policy.

## Available Scripts

### 🧹 Main Cleanup Script
```bash
./.kilocode/scripts/cleanup-codebase.sh
```
Comprehensive codebase cleanup that:
- Documents and quarantines ghost files
- Runs automated code analysis
- Formats and lints code
- Generates cleanup reports

### 🗂️ Quarantine Management
```bash
# Quarantine a file or directory
./.kilocode/scripts/quarantine.sh <path> <reason>

# Example
./.kilocode/scripts/quarantine.sh "src/old-component" "Replaced by new implementation"
```

### 🗑️ Quarantine Cleanup
```bash
./.kilocode/scripts/cleanup-quarantine.sh
```
Removes quarantine batches older than 30 days.

## Usage Examples

### Regular Maintenance
```bash
# Weekly cleanup
./.kilocode/scripts/cleanup-codebase.sh

# Monthly quarantine cleanup
./.kilocode/scripts/cleanup-quarantine.sh
```

### Safe File Removal
```bash
# Instead of deleting directly
rm src/suspicious-file.js

# Use quarantine system
./.kilocode/scripts/quarantine.sh "src/suspicious-file.js" "Appears unused after refactoring"
```

## Integration with Package.json

Add these scripts to your package.json:

```json
{
  "scripts": {
    "cleanup": "./.kilocode/scripts/cleanup-codebase.sh",
    "quarantine": "./.kilocode/scripts/quarantine.sh",
    "cleanup:quarantine": "./.kilocode/scripts/cleanup-quarantine.sh"
  }
}
```

Then run with:
```bash
pnpm cleanup
pnpm quarantine "path/to/file" "reason"
pnpm cleanup:quarantine
```

## Safety Features

- **30-day quarantine period** before permanent deletion
- **Detailed logging** of all quarantine actions
- **Easy recovery** with documented restore commands
- **Git history preservation** as ultimate backup
- **No immediate deletions** - everything goes through quarantine first

## Monitoring

The scripts generate reports in `.kilocode/cleanup-report-YYYY-MM-DD.md` with:
- File count analysis
- Large file identification
- Code duplication detection
- Import/export analysis
- Cleanup recommendations

## Recovery

If you need to recover quarantined files:

```bash
# Check quarantine directory
ls -la .kilocode/quarantine/

# Recover specific item (example)
mv ".kilocode/quarantine/2025-07-09-enhanced-media/enhanced-media" "src/plugins/enhanced-media"
```

## Best Practices

1. **Run cleanup weekly** to maintain code quality
2. **Review reports** to identify improvement opportunities
3. **Monitor quarantine** for any issues during the 30-day period
4. **Test thoroughly** after any cleanup operations
5. **Document decisions** when quarantining files

## Integration with Clean Code Policy

These scripts implement the Clean Minimal Code Policy by:
- Enforcing zero tolerance for dead code
- Maintaining minimal surface area
- Enabling aggressive deduplication
- Providing safe deletion mechanisms
- Automating code quality checks