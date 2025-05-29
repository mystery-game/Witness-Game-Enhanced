#!/bin/bash

# GUILTY Game Quick Start Script for Mac/Linux
# This script sets up and runs the GUILTY detective game

echo "🔍 GUILTY Game Quick Start 🔍"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check if npm is installed
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    echo "npm usually comes with Node.js. Please reinstall Node.js."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

# Check if all required files exist
echo ""
echo "Checking for game files..."
REQUIRED_FILES=("index.html" "server.js" "package.json")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required files:${NC}"
    printf '%s\n' "${MISSING_FILES[@]}"
    echo "Please ensure all game files are in the current directory."
    exit 1
fi

echo -e "${GREEN}✓ All required files found${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo "Please check the error messages above."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file from template${NC}"
    else
        echo "PORT=3000" > .env
        echo "NODE_ENV=development" >> .env
        echo -e "${GREEN}✓ Created default .env file${NC}"
    fi
else
    echo -e "${YELLOW}! .env file already exists${NC}"
fi

# Check if port 3000 is available
PORT=${PORT:-3000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}! Port $PORT is already in use${NC}"
    echo "You can either:"
    echo "  1. Stop the process using port $PORT"
    echo "  2. Change the PORT in .env file"
    echo "  3. The game might already be running!"
else
    echo -e "${GREEN}✓ Port $PORT is available${NC}"
fi

# Start the game
echo ""
echo "========================================"
echo -e "${GREEN}🚀 Starting GUILTY game server...${NC}"
echo "========================================"
echo ""
echo "The game will be available at:"
echo -e "${GREEN}http://localhost:$PORT${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the server
npm start 