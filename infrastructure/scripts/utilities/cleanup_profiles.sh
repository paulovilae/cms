#!/bin/bash

# Script to clean up the profile directory by removing duplicate files
# and keeping only the most recent backup

echo "Cleaning up .kilocode/profiles directory..."

# Create a directory for any files we want to save temporarily
mkdir -p .kilocode/profiles/temp_archive

# Move fixed and duplicate versions to temp_archive
echo "Moving fixed and duplicate versions to temporary archive..."
find .kilocode/profiles -maxdepth 1 -name "*-fixed*.yaml" -exec mv {} .kilocode/profiles/temp_archive/ \;
find .kilocode/profiles -maxdepth 1 -name "*-export2.yaml" -exec mv {} .kilocode/profiles/temp_archive/ \;
find .kilocode/profiles -maxdepth 1 -name "*-fixed.yaml" -exec mv {} .kilocode/profiles/temp_archive/ \;
find .kilocode/profiles -maxdepth 1 -name "performance-engineer-fixed.yaml" -exec mv {} .kilocode/profiles/temp_archive/ \;

# Find the most recent backup directory
LATEST_BACKUP=$(find .kilocode/profiles -maxdepth 1 -type d -name "backups_*" | sort | tail -n 1)
echo "Latest backup directory: $LATEST_BACKUP"

# Move older backup directories to temp_archive
for backup_dir in $(find .kilocode/profiles -maxdepth 1 -type d -name "backups_*" | sort); do
    if [ "$backup_dir" != "$LATEST_BACKUP" ]; then
        echo "Moving older backup directory: $backup_dir"
        mv "$backup_dir" .kilocode/profiles/temp_archive/
    fi
done

# Create a README in the temp_archive to explain what's there
cat > .kilocode/profiles/temp_archive/README.md << EOF
# Temporary Archive

This directory contains temporary archive of profile files that were created during the profile fixing process. 
These files are kept here temporarily in case they are needed for reference, but can be safely deleted.

Contents:
- Fixed versions of profiles (*-fixed*.yaml)
- Duplicate profile files (*-export2.yaml)
- Older backup directories

Created: $(date)
EOF

echo "Clean-up complete. The following files remain in the main directory:"
ls -la .kilocode/profiles/*.yaml | wc -l
echo "The temporary archive can be found at: .kilocode/profiles/temp_archive/"
echo "You can delete this directory if you no longer need these files."