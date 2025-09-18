#!/bin/bash
# Install Cypress dependencies for WSL/Ubuntu
echo "Installing Cypress dependencies for WSL/Ubuntu..."

# Update package list
sudo apt-get update

# Install required dependencies
sudo apt-get install -y \
  libgtk2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb

echo "Dependencies installed successfully!"
echo "Now try: npm run cypress:verify"