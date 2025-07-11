#!/bin/bash

echo "🔍 Checking all profile files for issues..."

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
  if [[ "$filename" == *"-fixed.yaml" ]]; then
    continue
  fi
  
  # Create backup
  cp "$profile" "$BACKUP_DIR/$filename"
  
  # Manual check for the problematic nested edit structure
  if grep -q "^[[:space:]]*- - edit" "$profile"; then
    echo "🔧 Fixing $filename (found nested edit structure)"
    
    # Create a fixed version with simplified structure
    fixed_file="${profile%.yaml}-fixed.yaml"
    cp "$profile" "$fixed_file"
    
    # Extract slug from the file to create the correct filename pattern
    slug=$(grep -A1 "slug:" "$profile" | tail -n1 | sed 's/.*slug: //' | tr -d ' ')
    
    # Read the file line by line and fix the groups section
    awk '
      BEGIN { in_groups = 0; skip_nested = 0; }
      /^[[:space:]]*groups:/ { in_groups = 1; print; next; }
      /^[[:space:]]*- - edit/ { 
        if (in_groups) {
          print "      - edit"; 
          skip_nested = 1;
          next;
        }
      }
      /^[[:space:]]*- (browser|command|mcp)/ { 
        if (skip_nested) {
          skip_nested = 0;
        }
        if (in_groups) {
          print;
          next;
        }
      }
      /^[[:space:]]*- file/ { if (skip_nested) next; }
      /^[[:space:]]*description:/ { if (skip_nested) next; }
      /^[[:space:]]*- directory:/ { if (skip_nested) next; }
      { if (!skip_nested) print; }
    ' "$profile" > "$fixed_file"
    
    echo "✅ Created fixed version: $fixed_file"
    
    # Count the fixed file
    ((FIXED_COUNT++))
  else
    echo "✅ $filename already has the correct structure"
  fi
done

echo "✨ Done! Fixed $FIXED_COUNT profile files."
echo "📦 Backups saved to $BACKUP_DIR"
echo ""
echo "🔄 If you need to restore the original files, you can copy them from the backup directory."