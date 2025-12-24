# 🐳 Docker Guide for Web3 Playground

Complete guide to using Docker with your Web3 project and all the new contracts!

## 🚀 Quick Start

### Start Everything
```bash
docker-compose up
```

This starts:
- ✅ Hardhat node (blockchain) on port `8545`
- ✅ Web app on port `3045`
- ✅ All contracts compiled and ready

Then open: **http://localhost:3045**

---

## 📋 Docker Commands

### Basic Commands

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers (after code changes)
docker-compose build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f hardhat-node
docker-compose logs -f web-app
```

### Advanced Commands

```bash
# Restart a specific service
docker-compose restart hardhat-node
docker-compose restart web-app

# Execute commands inside containers
docker-compose exec hardhat-node npm run compile
docker-compose exec hardhat-node npm run deploy:all
docker-compose exec hardhat-node npm run playground

# Access container shell
docker-compose exec hardhat-node sh
docker-compose exec web-app sh

# Check container status
docker-compose ps

# Stop and remove everything (including volumes)
docker-compose down -v
```

---

## 🎮 Using New Contracts with Docker

### Option 1: Deploy All Contracts (Inside Docker)

```bash
# Make sure containers are running
docker-compose up -d

# Deploy all contracts
docker-compose exec hardhat-node npm run deploy:all
```

### Option 2: Run Playground (Inside Docker)

```bash
# Make sure containers are running
docker-compose up -d

# Run the interactive playground
docker-compose exec hardhat-node npm run playground
```

### Option 3: Run Individual Scripts

```bash
# Deploy SimpleStorage
docker-compose exec hardhat-node npm run deploy:local

# Test connection
docker-compose exec hardhat-node npm run test:connection

# Interact with contract
docker-compose exec hardhat-node npm run interact
```

---

## 🔧 Docker Architecture

### Services

1. **hardhat-node** (Port 8545)
   - Runs Hardhat local blockchain
   - Compiles contracts
   - Handles JSON-RPC requests
   - Health check ensures it's ready

2. **web-app** (Port 3045)
   - Serves web interface
   - Waits for hardhat-node to be healthy
   - Connects to blockchain via network

### Volumes (Shared Files)

- `./contracts` → Contract source files
- `./scripts` → Deployment/interaction scripts
- `./cache` → Hardhat cache
- `./artifacts` → Compiled contract artifacts
- `./public` → Web app files
- `./server.js` → Web server

**Changes to these files are reflected immediately!**

---

## 🎯 Common Workflows

### Workflow 1: Develop New Contract

```bash
# 1. Start Docker
docker-compose up -d

# 2. Create/edit contract in contracts/
# (File is automatically synced via volume)

# 3. Compile
docker-compose exec hardhat-node npm run compile

# 4. Deploy
docker-compose exec hardhat-node npm run deploy:all

# 5. Test in web app
# Open http://localhost:3045
```

### Workflow 2: Test Playground

```bash
# 1. Start Docker
docker-compose up -d

# 2. Run playground
docker-compose exec hardhat-node npm run playground

# 3. Watch the magic happen! ✨
```

### Workflow 3: Modify Web App

```bash
# 1. Start Docker
docker-compose up -d

# 2. Edit files in public/ or server.js
# (Changes are synced automatically)

# 3. Restart web app to see changes
docker-compose restart web-app

# 4. Refresh browser at http://localhost:3045
```

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs hardhat-node

# Rebuild containers
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up
```

### Contracts not compiling

```bash
# Compile manually
docker-compose exec hardhat-node npm run compile

# Check for errors
docker-compose logs hardhat-node
```

### Web app can't connect

```bash
# Check if hardhat-node is healthy
docker-compose ps

# Check hardhat-node logs
docker-compose logs hardhat-node

# Restart web-app
docker-compose restart web-app
```

### Port already in use

```bash
# Check what's using the port
lsof -i :8545
lsof -i :3045

# Stop conflicting services or change ports in docker-compose.yml
```

---

## 🔄 Updating Code

### After Adding New Contracts

```bash
# 1. Add contract to contracts/
# 2. Compile
docker-compose exec hardhat-node npm run compile

# 3. Deploy (if needed)
docker-compose exec hardhat-node npm run deploy:all
```

### After Modifying Scripts

```bash
# Scripts are in volumes, so changes are immediate!
# Just run:
docker-compose exec hardhat-node npm run playground
```

### After Changing package.json

```bash
# Rebuild containers
docker-compose build
docker-compose up -d
```

---

## 📊 Monitoring

### View Real-time Logs

```bash
# All services
docker-compose logs -f

# Just blockchain
docker-compose logs -f hardhat-node

# Just web app
docker-compose logs -f web-app
```

### Check Container Status

```bash
docker-compose ps

# Should show:
# - web3-hardhat-node (Up, Healthy)
# - web3-web-app (Up)
```

### Check Resource Usage

```bash
docker stats
```

---

## 🎨 Development Tips

### 1. Keep Containers Running
```bash
# Start in background
docker-compose up -d

# Work normally, containers stay running
```

### 2. Hot Reload
- Contract files: Auto-synced via volumes
- Scripts: Auto-synced via volumes
- Web app: Auto-synced via volumes
- **No need to rebuild for code changes!**

### 3. Clean Slate
```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose build
docker-compose up
```

### 4. Multiple Terminals
```bash
# Terminal 1: Watch logs
docker-compose logs -f

# Terminal 2: Run scripts
docker-compose exec hardhat-node npm run playground

# Terminal 3: Access shell
docker-compose exec hardhat-node sh
```

---

## 🚀 Quick Reference

| Task | Command |
|------|---------|
| Start everything | `docker-compose up` |
| Start in background | `docker-compose up -d` |
| Stop everything | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Compile contracts | `docker-compose exec hardhat-node npm run compile` |
| Deploy all contracts | `docker-compose exec hardhat-node npm run deploy:all` |
| Run playground | `docker-compose exec hardhat-node npm run playground` |
| Restart web app | `docker-compose restart web-app` |
| Rebuild containers | `docker-compose build` |
| Access shell | `docker-compose exec hardhat-node sh` |

---

## 💡 Pro Tips

1. **Use `-d` flag**: Run in background so you can use terminal for other things
2. **Watch logs**: Keep `docker-compose logs -f` running in a separate terminal
3. **Volume sync**: Your code changes are immediately available in containers
4. **Health checks**: Web app waits for blockchain to be ready automatically
5. **Network isolation**: Containers communicate via internal Docker network

---

## 🎯 Example: Complete Workflow

```bash
# 1. Start Docker
docker-compose up -d

# 2. Wait a few seconds for health check
sleep 5

# 3. Compile all contracts
docker-compose exec hardhat-node npm run compile

# 4. Deploy all contracts
docker-compose exec hardhat-node npm run deploy:all

# 5. Run playground to test everything
docker-compose exec hardhat-node npm run playground

# 6. Open web app
# http://localhost:3045

# 7. When done, stop everything
docker-compose down
```

---

Happy Dockerizing! 🐳🚀

