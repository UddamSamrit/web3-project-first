# Web3 Testing Project

A comprehensive web3 testing setup using Hardhat, Ethers.js, and Chai for testing Ethereum smart contracts and web3 operations.

## Features

- ✅ Hardhat development environment
- ✅ Local blockchain for testing
- ✅ Smart contract testing with Chai
- ✅ Web3 basic operations testing
- ✅ Integration testing examples
- ✅ Example SimpleStorage contract
- ✅ JSON-RPC connection examples
- ✅ Contract interaction scripts

## Quick Start

### Option 1: Using Docker (Recommended - Clean & Easy)

```bash
# Start everything with one command
docker-compose up
```

Then open `http://localhost:3000` in your browser!

**That's it!** Docker handles everything:
- ✅ Hardhat node (port 8545)
- ✅ Web app (port 3000)
- ✅ All dependencies

See [DOCKER-GUIDE.md](DOCKER-GUIDE.md) for detailed Docker instructions.

---

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Start local blockchain:**
   ```bash
   # Terminal 1: Start the node
   npm run node
   
   # Terminal 2: Start web app
   npm start
   
   # Then open http://localhost:3000
   ```

That's it! You're ready to test web3 functionality.

## Prerequisites

- Node.js v22
- npm or yarn

## Installation

```bash
npm install
```

## Available Scripts

### Testing
```bash
npm test                    # Run all Hardhat tests
npm run test:jest          # Run Jest tests (if configured)
```

### Development
```bash
npm run compile            # Compile smart contracts
npm run node              # Start local Hardhat node
```

### Deployment & Interaction
```bash
npm run deploy:local       # Deploy contract to local node
npm run test:connection   # Test connection to local node
npm run interact          # Interact with deployed contract
```

## Running Tests

### Run all Hardhat tests
```bash
npm test
```

**Important:** When running `npm test`, Hardhat uses its **built-in network** automatically. You **DO NOT need** to start the Hardhat node first. The tests run on Hardhat's internal blockchain.

**If you see `ECONNREFUSED 127.0.0.1:8545` error:**
- You might have run tests with `--network localhost` flag
- Or you're trying to test against a running node
- **Solution:** Just run `npm test` without any network flag (uses built-in network)

This will run all test files and show results for:

**SimpleStorage Contract Tests** (6 tests)
- Contract deployment and owner verification
- Value initialization
- Setting and getting values
- Event emissions
- Multi-account interactions

**Web3 Basic Operations** (7 tests)
- Wallet creation and address validation
- Account balance checking
- ETH transfers between accounts
- Block number and block information retrieval
- Network information
- Transaction receipt handling
- Gas estimation

**Web3 Integration Tests** (7 tests)
- Multi-user contract interactions
- Event tracking from multiple users
- Gas estimation for contract calls
- Transaction execution with custom gas limits
- Error handling patterns
- Contract state persistence across transactions

**Expected output:** 20 passing tests

### Run specific test file
```bash
npx hardhat test test/SimpleStorage.test.js
npx hardhat test test/web3-basic.test.js
npx hardhat test test/web3-integration.test.js
```

### Testing Against Running Node (Advanced)

If you want to test against a **running Hardhat node** (instead of the built-in network):

```bash
# Terminal 1: Start the node
npm run node

# Terminal 2: Run tests against localhost
npx hardhat test --network localhost
```

**Note:** This is usually not necessary. The default `npm test` uses Hardhat's built-in network which is faster and doesn't require a running node.

## Local Blockchain Node

### Start the Hardhat node
```bash
npm run node
```

This will:
- Start a local blockchain node on `http://127.0.0.1:8545`
- Create 20 test accounts pre-funded with 10,000 ETH each
- Display account addresses and private keys (for testing only!)

**⚠️ Why the Warning Appears:**

Hardhat shows this warning because:

1. **Deterministic Accounts**: Hardhat uses the same set of test accounts every time you start the node. These accounts are generated from well-known seed phrases, making their private keys publicly documented.

2. **Security Risk on Live Networks**: If someone uses these accounts on Ethereum Mainnet or any live network, anyone who knows the private keys (which are public) can steal all funds from those accounts.

3. **For Local Development Only**: These accounts are safe to use ONLY on your local Hardhat network because:
   - The local network is isolated from real blockchains
   - No real value exists on the local network
   - The accounts are meant for testing and development

**✅ Safe Usage:**
- ✅ Use on local Hardhat network (localhost:8545)
- ✅ Use for testing and development
- ✅ Use for learning web3 concepts

**❌ Never:**
- ❌ Import these accounts to MetaMask on Mainnet
- ❌ Use these accounts on any live/test network (Goerli, Sepolia, etc.)
- ❌ Send real ETH to these addresses
- ❌ Use these private keys in production applications

### Test the connection
```bash
npm run test:connection
```

This verifies:
- Connection to the node
- Current block number
- Available accounts
- Account balances

### Deploy a contract
```bash
# First, start the node in one terminal
npm run node

# Then in another terminal, deploy
npm run deploy:local
```

**Deployed contract address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Interact with deployed contract
```bash
npm run interact
```

This will:
- Connect to the deployed SimpleStorage contract
- Read the current value
- Set a new value
- Confirm the transaction

## Test Files

- **SimpleStorage.test.js**: Tests for the SimpleStorage smart contract
  - Deployment verification
  - Value setting and retrieval
  - Event emissions
  - Multi-user interactions

- **web3-basic.test.js**: Basic web3 operations
  - Wallet creation and validation
  - Account balance checking
  - ETH transfers between accounts
  - Block and network information
  - Transaction receipts
  - Gas estimation

- **web3-integration.test.js**: Integration tests
  - Multi-user contract interactions
  - Event tracking
  - Gas estimation for contract calls
  - Error handling patterns
  - State persistence

## Project Structure

```
.
├── contracts/                    # Smart contracts
│   └── SimpleStorage.sol        # Example storage contract
├── test/                        # Test files
│   ├── SimpleStorage.test.js    # Contract tests
│   ├── web3-basic.test.js       # Basic web3 operations
│   └── web3-integration.test.js # Integration tests
├── scripts/                     # Utility scripts
│   ├── deploy.js                # Deploy contract
│   ├── test-connection.js       # Test node connection
│   ├── interact-contract.js     # Interact with contract
│   └── jsonrpc-example.js       # JSON-RPC examples
├── hardhat.config.js            # Hardhat configuration
└── package.json                 # Dependencies and scripts
```

## Example Contract

The `SimpleStorage` contract is a simple example that:
- Stores a uint256 value
- Allows anyone to set and get the value
- Emits events when values change
- Tracks the contract owner

### Contract Functions
- `setValue(uint256 _value)`: Set a new value (emits `ValueChanged` event)
- `getValue()`: Get the current stored value
- `getOwner()`: Get the contract owner address

## JSON-RPC Connection Guide

### Understanding JSON-RPC Errors

If you see this error:
```json
{"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}}
```

**The problem:** The `id` field is `null` or missing. It must be a number.

### Correct JSON-RPC Request Format

```json
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}
```

**Required fields:**
- `jsonrpc`: Must be `"2.0"`
- `method`: The RPC method name (e.g., `"eth_blockNumber"`, `"eth_accounts"`)
- `params`: Array of parameters (can be empty `[]`)
- `id`: **Must be a number** (e.g., `1`), **NOT null**

### Common JSON-RPC Methods

```javascript
// Get block number
{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}

// Get accounts
{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":2}

// Get balance
{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x...","latest"],"id":3}

// Send transaction
{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"to":"0x...","value":"0x..."}],"id":4}
```

### Testing JSON-RPC Requests

See `scripts/jsonrpc-example.js` for working examples:
```bash
node scripts/jsonrpc-example.js
```

## Writing Your Own Tests

### Basic Test Structure

1. Create a new test file in the `test/` directory
2. Import necessary dependencies:
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");
```

3. Set up test accounts and deploy contracts:
```javascript
describe("MyContract", function () {
  let myContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const MyContract = await ethers.getContractFactory("MyContract");
    myContract = await MyContract.deploy();
    await myContract.waitForDeployment();
  });

  it("Should do something", async function () {
    // Your test here
    expect(await myContract.someFunction()).to.equal(expectedValue);
  });
});
```

### Common Test Patterns

**Testing transactions:**
```javascript
await expect(contract.setValue(42))
  .to.emit(contract, "ValueChanged")
  .withArgs(42, owner.address);
```

**Testing with different accounts:**
```javascript
await contract.connect(addr1).setValue(100);
```

**Testing gas estimation:**
```javascript
const gasEstimate = await contract.setValue.estimateGas(42);
expect(gasEstimate).to.be.gt(0);
```

## Troubleshooting

### Node Connection Issues

**Error:** `ECONNREFUSED 127.0.0.1:8545` when running tests
- **Cause:** Tests are trying to connect to localhost, but node isn't running
- **Solution 1 (Recommended):** Run tests without network flag: `npm test` (uses built-in network)
- **Solution 2:** If you need to test against running node, start it first: `npm run node`, then run `npx hardhat test --network localhost`

**Error:** `ECONNREFUSED` when running scripts
- **Solution:** Make sure Hardhat node is running: `npm run node`

**Error:** `Parse error: Unexpected end of JSON input`
- **Solution:** Check your JSON-RPC request format. The `id` field must be a number, not `null`

### Contract Deployment Issues

**Error:** Contract not found
- **Solution:** Compile contracts first: `npm run compile`

**Error:** Insufficient funds
- **Solution:** Use test accounts from Hardhat node (they have 10,000 ETH each)

### Test Failures

**Error:** Transaction reverted
- **Solution:** Check contract logic and test expectations match

**Error:** Event not found
- **Solution:** Ensure event is emitted in contract and test waits for transaction

## Connecting External Tools

### MetaMask / Wallet Connection

1. Start Hardhat node: `npm run node`
2. Add network to MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
3. Import one of the test accounts using the private key shown in node output

### Web3.js / Ethers.js Frontend

```javascript
// Using Ethers.js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);
```

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [JSON-RPC Specification](https://www.jsonrpc.org/specification)

