#!/bin/bash
# Quick Start Script for FakeStore Cart App with Authentication

echo "================================"
echo "FakeStore Cart App - Setup Guide"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Setting up Backend${NC}"
echo "Installing backend dependencies..."
cd server
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo "Creating .env file from template..."
if [ -f .env ]; then
    echo -e "${YELLOW}⚠ .env already exists${NC}"
else
    cp .env.example .env
    echo -e "${GREEN}✓ .env created${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Update server/.env with your MongoDB URI${NC}"
fi

cd ..
echo ""

echo -e "${BLUE}Step 2: Setting up Frontend${NC}"
echo "Installing frontend dependencies..."
cd client
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo "Creating .env file from template..."
if [ -f .env ]; then
    echo -e "${YELLOW}⚠ .env already exists${NC}"
else
    cp .env.example .env
    echo -e "${GREEN}✓ .env created${NC}"
fi

cd ..
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Start MongoDB (if using local):"
echo "   ${YELLOW}mongod${NC}"
echo ""
echo "2. Start the backend server:"
echo "   ${YELLOW}cd server && npm run dev${NC}"
echo "   (Server runs on http://localhost:5000)"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   ${YELLOW}cd client && npm run dev${NC}"
echo "   (App runs on http://localhost:5173)"
echo ""
echo -e "${BLUE}Demo Credentials:${NC}"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "See README_AUTH.md for complete documentation"
