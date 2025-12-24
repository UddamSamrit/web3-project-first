const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Testing connection to local Hardhat node...");
    
    // Connect to localhost
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:3045");
    
    // Test basic connection
    const blockNumber = await provider.getBlockNumber();
    console.log("✓ Connected! Current block number:", blockNumber);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("✓ Network chainId:", network.chainId.toString());
    
    // Get accounts
    const accounts = await provider.listAccounts();
    console.log("✓ Available accounts:", accounts.length);
    console.log("  First account:", accounts[0]);
    
    // Get balance
    const balance = await provider.getBalance(accounts[0]);
    console.log("✓ Balance:", ethers.formatEther(balance), "ETH");
    
    console.log("\n✓ All connection tests passed!");
    
  } catch (error) {
    console.error("✗ Connection error:", error.message);
    console.error("\nMake sure Hardhat node is running:");
    console.error("  npm run node");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

