#!/bin/bash

# Create a timestamp for the backup directory
BACKUP_DIR=".kilocode/profiles/backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# List all profile files
PROFILES=($(find .kilocode/profiles -name "*-export.yaml" -not -path "*/backups_*/*"))
FIXED_COUNT=0

for profile in "${PROFILES[@]}"; do
  # Get just the filename
  filename=$(basename "$profile")
  
  # Skip already fixed files
  if [[ "$filename" == *"-fixed"* ]]; then
    continue
  fi
  
  # Create a backup
  cp "$profile" "$BACKUP_DIR/$filename"
  
  # Check if the file has the incorrect format with brackets
  if grep -q '\["edit",' "$profile"; then
    echo "Fixing $filename (found bracket format)"
    
    # Create a new fixed file
    output_file="${profile%.yaml}-fixed-with-permissions.yaml"
    
    # Use sed to replace the bracket format with the double dash format
    # 1. Replace ["edit", with - - edit
    # 2. Remove the closing bracket ] after directory description
    cat "$profile" | \
      sed 's/\["edit",/- - edit/g' | \
      sed '/description: .*directory/,/^[[:space:]]*]/s/^[[:space:]]*]//g' > "$output_file"
    
    echo "Created fixed file: $output_file"
    ((FIXED_COUNT++))
  else
    echo "$filename already has the correct structure or doesn't have edit permissions"
  fi
done

echo "Fixed $FIXED_COUNT profile files"
echo "Backups saved to $BACKUP_DIR"