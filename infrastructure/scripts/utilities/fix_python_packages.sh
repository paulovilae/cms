#!/bin/bash

echo "🐍 Fixing deprecated Python egg packages..."

# List of packages to reinstall
PACKAGES=(
  "safetensors==0.5.3"
  "progressbar==2.5"
  "rotary_embedding_torch==0.8.6"
  "librosa==0.11.0"
  "einops==0.8.1"
  "huggingface_hub==0.16.4"
)

# Use uv to reinstall the packages
echo "📦 Reinstalling packages using uv..."
for package in "${PACKAGES[@]}"; do
  echo "  - Installing $package"
  uv pip install --force-reinstall "$package"
done

echo "✅ All packages have been reinstalled!"
echo "📝 Note: You may need to restart any running Python applications for changes to take effect."