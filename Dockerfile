# Dockerfile for Web3 Testing Project
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose ports
# 8545 - Hardhat node JSON-RPC
# 3000 - Web app server
EXPOSE 8545 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "node"]

