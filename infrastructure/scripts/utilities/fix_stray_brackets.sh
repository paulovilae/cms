#!/bin/bash

echo "🔍 Checking all profile files for stray closing brackets..."

# Create backup directory
BACKUP_DIR=".kilocode/profiles/backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"

# List of all profile files to check
PROFILES=(.kilocode/profiles/*-export.yaml)

# Counter for fixed files
FIXED_COUNT=0

for profile in "${PROFILES[@]}"; do
  filename=$(basename "$profile")
  
  # Skip if it's already a fixed version
  if [[ "$filename" == *"-fixed"* ]]; then
    continue
  fi
  
  # Create backup
  cp "$profile" "$BACKUP_DIR/$filename"
  
  # Check if the file has a stray closing bracket
  if grep -q "^[[:space:]]*]" "$profile"; then
    echo "🔧 Fixing $filename (found stray closing bracket)"
    
    # Remove stray closing brackets
    sed -i '/description: .*directory/,/^[[:space:]]*]/s/^[[:space:]]*]//g' "$profile"
    
    echo "✅ Fixed $filename"
    
    # Count the fixed file
    ((FIXED_COUNT++))
  else
    echo "✅ $filename has no stray brackets"
  fi
done

echo "✨ Done! Fixed $FIXED_COUNT profile files."
echo "📦 Backups saved to $BACKUP_DIR"
echo ""
echo "🔄 If you need to restore the original files, you can copy them from the backup directory."