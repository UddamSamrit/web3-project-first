const { ethers } = require("hardhat");

/**
 * SIMPLE VERSION: Sending Transactions Between Accounts
 * 
 * This is a simplified version showing the essential steps only.
 */

async function main() {
  console.log("Sending Transaction - Simple Version\n");

  // Step 1: Get accounts
  const [sender, receiver] = await ethers.getSigners();
  console.log("Sender:", sender.address);
  console.log("Receiver:", receiver.address, "\n");

  // Step 2: Check balances before
  const balanceBefore = await ethers.provider.getBalance(receiver.address);
  console.log("Receiver balance before:", ethers.formatEther(balanceBefore), "ETH\n");

  // Step 3: Send transaction
  const amount = ethers.parseEther("1.0"); // Send 1 ETH
  console.log("Sending 1 ETH...");
  
  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: amount
  });
  
  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...\n");

  // Step 4: Wait for confirmation
  await tx.wait();
  console.log("✅ Transaction confirmed!\n");

  // Step 5: Check balances after
  const balanceAfter = await ethers.provider.getBalance(receiver.address);
  console.log("Receiver balance after:", ethers.formatEther(balanceAfter), "ETH");
  console.log("Change:", ethers.formatEther(balanceAfter - balanceBefore), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

