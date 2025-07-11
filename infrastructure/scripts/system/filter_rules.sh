#!/bin/bash

# Create a backup directory with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".kilocode/backup_rules_$TIMESTAMP"
RULES_DIR=".kilocode/rules"
TEMP_DIR=".kilocode/rules_temp"

echo "📋 Creating temporary rules directory..."
mkdir -p "$TEMP_DIR"

echo "💾 Creating backup of all rules..."
mkdir -p "$BACKUP_DIR"
cp -r "$RULES_DIR"/* "$BACKUP_DIR"

echo "📋 Only keeping 'code' and 'project' rules..."
# Copy only the directories we want to keep
cp -r "$RULES_DIR/code" "$TEMP_DIR/"
cp -r "$RULES_DIR/project" "$TEMP_DIR/"

# Create a README file to explain what happened
cat > "$TEMP_DIR/README.md" << 'EOF'
# Filtered Rules

This directory contains a filtered subset of the rules, keeping only:
- code/
- project/

The complete set of rules is backed up in the `.kilocode/backup_rules_*` directory.

To restore all rules, run the `restore_rules.sh` script.
EOF

# Create a restore script
cat > "restore_rules.sh" << EOF
#!/bin/bash
echo "🔄 Restoring all rules from backup..."
rm -rf "$RULES_DIR"
cp -r "$BACKUP_DIR" "$RULES_DIR"
echo "✅ Rules restored successfully!"
EOF

chmod +x restore_rules.sh

echo "🔄 Replacing rules directory with filtered version..."
rm -rf "$RULES_DIR"
mv "$TEMP_DIR" "$RULES_DIR"

echo "✅ Done! Now only 'code' and 'project' rules are present."
echo "💡 If you want to restore all rules, run ./restore_rules.sh"