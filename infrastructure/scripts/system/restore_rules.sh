#!/bin/bash
echo "🔄 Restoring all rules from backup..."
rm -rf ".kilocode/rules"
cp -r ".kilocode/backup_rules_20250710_170601" ".kilocode/rules"
echo "✅ Rules restored successfully!"
