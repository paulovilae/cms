#!/bin/bash

echo "🔄 Applying fixed profile files..."

# Counter for applied files
APPLIED_COUNT=0

# Process each fixed file
for fixed_file in .kilocode/profiles/*-properly-fixed.yaml; do
    # Get the original filename by removing -properly-fixed suffix
    original_file="${fixed_file%-properly-fixed.yaml}.yaml"
    
    # Extract just the filename for display
    fixed_filename=$(basename "$fixed_file")
    original_filename=$(basename "$original_file")
    
    echo "📄 Replacing $original_filename with fixed version"
    
    # Rename fixed file to the original filename (overwriting the original)
    mv "$fixed_file" "$original_file"
    
    # Count the applied file
    ((APPLIED_COUNT++))
done

echo "✨ Done! Applied fixes to $APPLIED_COUNT profile files."
echo "🔄 The original files were backed up in the backups directory created by the previous script."