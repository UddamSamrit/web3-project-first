const { ethers } = require("hardhat");

/**
 * ADVANCED VERSION: Sending Transactions with Custom Options
 * 
 * This shows advanced features like:
 * - Custom gas limits
 * - Gas price control
 * - Multiple transactions
 * - Error handling
 */

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Advanced Transaction Sending");
  console.log("═══════════════════════════════════════════════════════════\n");

  const [sender, receiver1, receiver2] = await ethers.getSigners();

  // ──────────────────────────────────────────────────────────────────────
  // Example 1: Transaction with Custom Gas Limit
  // ──────────────────────────────────────────────────────────────────────
  console.log("📤 Example 1: Transaction with Custom Gas Limit");
  console.log("───────────────────────────────────────────────────────────");
  
  try {
    const tx1 = await sender.sendTransaction({
      to: receiver1.address,
      value: ethers.parseEther("0.5"),
      gasLimit: 21000  // Standard ETH transfer uses ~21,000 gas
    });
    
    await tx1.wait();
    console.log("✅ Transaction 1 confirmed:", tx1.hash, "\n");
  } catch (error) {
    console.error("❌ Transaction 1 failed:", error.message, "\n");
  }

  // ──────────────────────────────────────────────────────────────────────
  // Example 2: Multiple Transactions Sequentially
  // ──────────────────────────────────────────────────────────────────────
  console.log("📤 Example 2: Sending Multiple Transactions");
  console.log("───────────────────────────────────────────────────────────");
  
  const amounts = [
    ethers.parseEther("0.1"),
    ethers.parseEther("0.2"),
    ethers.parseEther("0.3")
  ];
  
  const transactions = [];
  
  for (let i = 0; i < amounts.length; i++) {
    console.log(`Sending transaction ${i + 1}...`);
    const tx = await sender.sendTransaction({
      to: receiver2.address,
      value: amounts[i]
    });
    transactions.push(tx);
    console.log(`  Hash: ${tx.hash}`);
  }
  
  console.log("\nWaiting for all transactions to confirm...");
  await Promise.all(transactions.map(tx => tx.wait()));
  console.log("✅ All transactions confirmed!\n");

  // ──────────────────────────────────────────────────────────────────────
  // Example 3: Transaction with Data (Message)
  // ──────────────────────────────────────────────────────────────────────
  console.log("📤 Example 3: Transaction with Data");
  console.log("───────────────────────────────────────────────────────────");
  
  // You can include data in a transaction (like a message)
  const message = "Hello from Web3!";
  const messageBytes = ethers.toUtf8Bytes(message);
  
  const tx3 = await sender.sendTransaction({
    to: receiver1.address,
    value: ethers.parseEther("0.01"),
    data: messageBytes  // Include data in transaction
  });
  
  await tx3.wait();
  console.log("✅ Transaction with data confirmed:", tx3.hash);
  console.log("   Message:", message, "\n");

  // ──────────────────────────────────────────────────────────────────────
  // Example 4: Check Transaction Status
  // ──────────────────────────────────────────────────────────────────────
  console.log("🔍 Example 4: Checking Transaction Status");
  console.log("───────────────────────────────────────────────────────────");
  
  const receipt = await ethers.provider.getTransactionReceipt(tx3.hash);
  
  if (receipt) {
    console.log("Transaction found in block:", receipt.blockNumber);
    console.log("Status:", receipt.status === 1 ? "Success ✅" : "Failed ❌");
    console.log("Gas used:", receipt.gasUsed.toString());
  } else {
    console.log("Transaction not yet mined");
  }
  console.log();

  // ──────────────────────────────────────────────────────────────────────
  // Example 5: Get Pending Transactions
  // ──────────────────────────────────────────────────────────────────────
  console.log("📋 Example 5: Account Nonce (Transaction Count)");
  console.log("───────────────────────────────────────────────────────────");
  
  const nonce = await ethers.provider.getTransactionCount(sender.address);
  console.log("Sender's transaction count (nonce):", nonce);
  console.log("   (Each transaction increments this number)", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅ All Examples Complete!");
  console.log("═══════════════════════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

