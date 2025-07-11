#!/bin/bash
# Cleanup script for migrated files

echo "Starting cleanup of migrated files..."

# Memory Bank files
echo "Cleaning memory-bank files..."
rm -f .kilocode/backup_rules_20250710_170601/memory-bank/CONTEXT.md 2>/dev/null
rm -f .kilocode/backup_rules_20250710_170601/memory-bank/universal-search-architecture.md 2>/dev/null

# Project files
echo "Cleaning project files..."
rm -f .kilocode/backup_rules_20250710_170601/project/architecture.md 2>/dev/null
rm -f .kilocode/backup_rules_20250710_170601/project/brief.md 2>/dev/null

# Code files
echo "Cleaning code files..."
rm -f .kilocode/backup_rules_20250710_170601/code/best-practices.md 2>/dev/null

# Architect files
echo "Cleaning architect files..."
rm -f .kilocode/backup_rules_20250710_170601/architect/architecture-principles.md 2>/dev/null

# Task management file
echo "Cleaning task management file..."
rm -f .kilocode/backup_rules_20250710_170601/task-management.md 2>/dev/null

echo "Cleanup completed."