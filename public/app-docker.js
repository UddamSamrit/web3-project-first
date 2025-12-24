// Web3 Transaction App - Docker-compatible version
// This version can connect to Hardhat node via Docker service name

let provider;
let signer;
let userAddress;
let isConnected = false;

// Detect if running in Docker or locally
const HARDHAT_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8545'  // Local development
    : 'http://hardhat-node:8545';  // Docker (though browser can't access this directly)

// For browser, always use localhost (Docker port mapping)
const HARDHAT_NETWORK_URL = 'http://localhost:8545';

const HARDHAT_NETWORK = {
    chainId: '0x539', // 1337 in hex
    chainName: 'Hardhat Local',
    rpcUrls: [HARDHAT_NETWORK_URL],
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    }
};

// Rest of the code is the same as app.js
// (Copy the rest from app.js)

