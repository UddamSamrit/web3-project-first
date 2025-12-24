# 🎮 Web3 Playground Guide

Welcome to your Web3 playground! Here are all the fun contracts you can play with:

## 📦 Available Contracts

### 1. 🔢 Counter Contract
A simple counter that can be incremented, decremented, and reset.

**Functions:**
- `increment()` - Add 1 to counter
- `decrement()` - Subtract 1 from counter
- `add(uint256)` - Add any number
- `subtract(uint256)` - Subtract any number
- `reset()` - Reset to 0 (owner only)
- `count()` - View current count

**Try it:**
```bash
npm run deploy:all
# Then use the Counter address in your web app or scripts
```

---

### 2. 💬 MessageBoard Contract
A decentralized message board where anyone can post messages (like Twitter on blockchain!).

**Functions:**
- `postMessage(string)` - Post a message (max 280 chars)
- `getMessage(uint256)` - Get message by index
- `getTotalMessages()` - Get total message count
- `getLatestMessage()` - Get the most recent message

**Try it:**
```bash
npm run playground
# Watch it post messages automatically!
```

---

### 3. 🪙 Token Contract
A simple ERC20-like token for learning how tokens work!

**Functions:**
- `transfer(address, uint256)` - Send tokens to someone
- `approve(address, uint256)` - Allow someone to spend your tokens
- `transferFrom(address, address, uint256)` - Transfer on behalf of someone
- `balanceOf(address)` - Check token balance
- `mint(address, uint256)` - Create new tokens (owner only)

**Features:**
- Name: "My Test Token"
- Symbol: "MTT"
- Initial Supply: 1,000,000 MTT (all to deployer)

**Try it:**
```bash
npm run playground
# See tokens being transferred between users!
```

---

### 4. 🗳️ Voting Contract
A simple voting system where users can vote for candidates!

**Functions:**
- `addCandidate(string)` - Add a candidate (owner only)
- `vote(uint256)` - Vote for a candidate by index
- `getCandidate(uint256)` - Get candidate info
- `getCandidateCount()` - Get total candidates
- `getWinner()` - Get the winner (after voting ends)
- `endVoting()` - End voting and declare winner (owner only)
- `hasUserVoted(address)` - Check if user voted

**Try it:**
```bash
npm run playground
# Watch a complete voting process!
```

---

## 🚀 Quick Start

### Option 1: Deploy All Contracts
```bash
# Make sure Hardhat node is running
npm run node

# In another terminal, deploy all contracts
npm run deploy:all
```

### Option 2: Interactive Playground
```bash
# Make sure Hardhat node is running
npm run node

# In another terminal, run the playground
npm run playground
```

This will automatically:
- Deploy all contracts
- Test Counter (increment, decrement, add, subtract)
- Post messages to MessageBoard
- Transfer tokens between users
- Run a complete voting process
- Show you all the results!

---

## 🎯 What You Can Learn

### Counter Contract
- ✅ State variables
- ✅ Basic arithmetic operations
- ✅ Events
- ✅ Access control (owner)

### MessageBoard Contract
- ✅ Arrays and structs
- ✅ String manipulation
- ✅ Timestamps
- ✅ Event emissions

### Token Contract
- ✅ Mappings (balances, allowances)
- ✅ Token transfers
- ✅ Approve/transferFrom pattern
- ✅ Minting tokens
- ✅ ERC20-like functionality

### Voting Contract
- ✅ Structs and arrays
- ✅ Voting logic
- ✅ Access control
- ✅ Winner determination
- ✅ State management

---

## 🔧 Interacting with Contracts

### Using Hardhat Console
```bash
npx hardhat console --network localhost

# Then in the console:
const Counter = await ethers.getContractFactory("Counter");
const counter = await Counter.deploy();
await counter.waitForDeployment();
await counter.increment();
(await counter.count()).toString();
```

### Using Scripts
Create your own script in `scripts/`:
```javascript
const hre = require("hardhat");

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.attach("CONTRACT_ADDRESS");
  
  await counter.increment();
  console.log("Count:", (await counter.count()).toString());
}

main();
```

Then run:
```bash
npx hardhat run scripts/your-script.js --network localhost
```

### Using Web App
Add contract interaction to `public/app.js` and `public/index.html`!

---

## 📚 Next Steps

1. **Modify Contracts**: Edit the `.sol` files to add new features
2. **Create Tests**: Write tests in `test/` directory
3. **Build UI**: Add web interface for each contract
4. **Combine Contracts**: Make contracts interact with each other
5. **Add Features**: 
   - Add time limits to voting
   - Add message likes to MessageBoard
   - Add token staking to Counter
   - Create your own contract!

---

## 🎨 Ideas for Experiments

1. **Counter + Token**: Reward users with tokens for incrementing counter
2. **MessageBoard + Voting**: Vote on messages
3. **Token + Voting**: Weight votes by token balance
4. **All Together**: Create a complete dApp!

---

## 💡 Tips

- Always test on local Hardhat network first
- Use `console.log` in Solidity for debugging
- Check gas costs with `estimateGas()`
- Read events to track contract activity
- Start simple, then add complexity

---

Have fun building! 🚀

