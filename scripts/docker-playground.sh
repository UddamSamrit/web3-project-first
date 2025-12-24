#!/bin/bash

# 🎮 Docker Playground Script
# This script makes it easy to run the playground in Docker

echo "═══════════════════════════════════════════════════════════"
echo "  🐳 Docker Web3 Playground"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "📦 Starting Docker containers..."
    docker-compose up -d
    
    echo "⏳ Waiting for Hardhat node to be healthy..."
    sleep 10
fi

echo "✅ Containers are running!"
echo ""
echo "🔧 Compiling contracts..."
docker-compose exec -T hardhat-node npm run compile

echo ""
echo "🎮 Running playground..."
echo "═══════════════════════════════════════════════════════════"
docker-compose exec hardhat-node npm run playground

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Playground Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "💡 Tips:"
echo "   - Web app: http://localhost:3045"
echo "   - Hardhat node: http://localhost:8545"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop: docker-compose down"
echo ""

