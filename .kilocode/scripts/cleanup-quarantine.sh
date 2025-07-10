#!/bin/bash
# .kilocode/scripts/cleanup-quarantine.sh
# Clean up expired quarantine batches (30+ days old)

echo "🗑️  Cleaning up expired quarantine batches..."

if [ ! -d ".kilocode/quarantine" ]; then
    echo "📁 No quarantine directory found - nothing to clean up"
    exit 0
fi

# Find quarantine batches older than 30 days
EXPIRED_COUNT=0
find .kilocode/quarantine/ -name "20*" -type d -mtime +30 2>/dev/null | while read dir; do
    if [ -d "$dir" ]; then
        echo "🗑️  Deleting expired quarantine: $(basename "$dir")"
        rm -rf "$dir"
        EXPIRED_COUNT=$((EXPIRED_COUNT + 1))
    fi
done

# Count current quarantine batches
CURRENT_COUNT=$(find .kilocode/quarantine/ -name "20*" -type d 2>/dev/null | wc -l)

echo ""
echo "✅ Quarantine cleanup complete!"
echo "📊 Current quarantine batches: $CURRENT_COUNT"
echo ""
echo "💡 To manually review quarantine batches:"
echo "   ls -la .kilocode/quarantine/"
echo ""
echo "🔄 To recover a quarantined item:"
echo "   ./.kilocode/scripts/quarantine.sh --help"