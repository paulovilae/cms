#!/bin/bash
# .kilocode/scripts/quarantine.sh
# Safe quarantine script following the Safe Deletion Policy

ITEM_PATH="$1"
REASON="$2"

if [ -z "$ITEM_PATH" ] || [ -z "$REASON" ]; then
    echo "Usage: ./quarantine.sh <path> <reason>"
    echo "Example: ./quarantine.sh src/plugins/enhanced-media 'Ghost files - exist in tabs but not filesystem'"
    exit 1
fi

# Create quarantine directory with date
QUARANTINE_DIR=".kilocode/quarantine/$(date +%Y-%m-%d)-$(basename "$ITEM_PATH")"
mkdir -p "$QUARANTINE_DIR"

# Document original location
echo "$ITEM_PATH" > "$QUARANTINE_DIR/original-location.txt"

# Create quarantine log
cat > "$QUARANTINE_DIR/QUARANTINE_LOG.md" << EOF
# Quarantine Log - $(basename "$ITEM_PATH")

**Date**: $(date)
**Quarantine Period**: 30 days (until $(date -d '+30 days' 2>/dev/null || date -v+30d 2>/dev/null || echo "$(date) + 30 days"))
**Original Location**: $ITEM_PATH

## Reason for Quarantine
$REASON

## Files Quarantined
- $(basename "$ITEM_PATH") ($(if [ -e "$ITEM_PATH" ]; then echo "moved from filesystem"; else echo "ghost files - existed in tabs only"; fi))

## Recovery Instructions
If needed within 30 days:
1. Move files back to original location: \`mv "$QUARANTINE_DIR/$(basename "$ITEM_PATH")" "$ITEM_PATH"\`
2. Update imports if necessary
3. Test functionality
4. Document why files were needed

## Monitoring Checklist
- [ ] Week 1: Check error logs
- [ ] Week 2: Verify build processes
- [ ] Week 3: Test all business functionality
- [ ] Week 4: Final verification before deletion

## Deletion Date
If no issues by the deletion date above, permanently delete this quarantine batch.

## Status Log
- $(date): Quarantined - $REASON
EOF

# Move files if they exist, otherwise document ghost files
if [ -e "$ITEM_PATH" ]; then
    mv "$ITEM_PATH" "$QUARANTINE_DIR/"
    echo "✅ Quarantined: $ITEM_PATH"
    echo "📁 Location: $QUARANTINE_DIR"
else
    echo "⚠️  Ghost files documented: $ITEM_PATH"
    echo "📝 These files existed in editor tabs but not on filesystem"
    echo "📁 Documentation: $QUARANTINE_DIR"
fi

echo ""
echo "📋 Quarantine log created: $QUARANTINE_DIR/QUARANTINE_LOG.md"
echo "🔄 To recover: mv \"$QUARANTINE_DIR/$(basename "$ITEM_PATH")\" \"$ITEM_PATH\""