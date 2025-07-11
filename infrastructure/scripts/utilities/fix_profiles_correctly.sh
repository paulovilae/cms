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
  if [[ "$filename" == *"-fixed"* ]]; then
    continue
  fi
  
  # Create backup
  cp "$profile" "$BACKUP_DIR/$filename"
  
  # Check if the file has the problematic nested edit structure
  if grep -q '\["edit",' "$profile"; then
    echo "🔧 Fixing $filename (found bracket format)"
    
    # Create a new fixed file
    output_file="${profile%.yaml}-properly-fixed.yaml"
    
    # Process the file in multiple steps to ensure correct format
    # 1. Create a temporary file
    temp_file="${profile%.yaml}.temp"
    
    # 2. Replace ["edit", with - - edit
    sed 's/\["edit",/- - edit/g' "$profile" > "$temp_file"
    
    # 3. Remove the closing bracket ] after directory description
    sed -i '/description: .*directory/,/^[[:space:]]*]/s/^[[:space:]]*]//g' "$temp_file"
    
    # 4. Fix any triple dash that might have been created
    sed -i 's/- - - edit/- - edit/g' "$temp_file"
    
    # 5. Move the temp file to the output file
    mv "$temp_file" "$output_file"
    
    echo "✅ Created fixed file: $output_file"
    
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