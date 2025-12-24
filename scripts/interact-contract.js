const { ethers } = require("hardhat");

async function main() {
  // Contract address from deployment
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  try {
    console.log("Connecting to contract at:", contractAddress);
    
    // Connect to localhost
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:3045");
    
    // Get signer (first account)
    const accounts = await provider.listAccounts();
    const signer = await ethers.getSigner(accounts[0]);
    
    // Get contract ABI (simple version)
    const abi = [
      "function getValue() view returns (uint256)",
      "function setValue(uint256 _value)",
      "function getOwner() view returns (address)",
      "event ValueChanged(uint256 newValue, address indexed changedBy)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    // Read current value
    const currentValue = await contract.getValue();
    console.log("✓ Current value:", currentValue.toString());
    
    // Read owner
    const owner = await contract.getOwner();
    console.log("✓ Owner:", owner);
    
    // Set a new value
    console.log("\nSetting value to 42...");
    const tx = await contract.setValue(42);
    console.log("✓ Transaction hash:", tx.hash);
    
    await tx.wait();
    console.log("✓ Transaction confirmed!");
    
    // Read new value
    const newValue = await contract.getValue();
    console.log("✓ New value:", newValue.toString());
    
  } catch (error) {
    console.error("✗ Error:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\nMake sure Hardhat node is running:");
      console.error("  npm run node");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

