const { ethers } = require("hardhat");

/**
 * STEP-BY-STEP GUIDE: Sending Transactions Between Accounts
 * 
 * This script demonstrates how to send ETH transactions between accounts
 * with detailed explanations at each step.
 */

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Sending Transactions Between Accounts - Step by Step");
  console.log("═══════════════════════════════════════════════════════════\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 1: Get Accounts (Signers)
  // ──────────────────────────────────────────────────────────────────────
  console.log("📋 STEP 1: Getting Accounts (Signers)");
  console.log("───────────────────────────────────────────────────────────");
  
  // Get signers - these are accounts that can sign transactions
  const signers = await ethers.getSigners();
  const sender = signers[0];    // Account that will send ETH
  const receiver = signers[1];  // Account that will receive ETH
  
  console.log("✓ Sender address:", sender.address);
  console.log("✓ Receiver address:", receiver.address);
  console.log("✓ Total accounts available:", signers.length, "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 2: Check Initial Balances
  // ──────────────────────────────────────────────────────────────────────
  console.log("💰 STEP 2: Checking Initial Balances");
  console.log("───────────────────────────────────────────────────────────");
  
  // Get balances in wei (smallest unit of ETH)
  const senderBalanceBefore = await ethers.provider.getBalance(sender.address);
  const receiverBalanceBefore = await ethers.provider.getBalance(receiver.address);
  
  // Convert from wei to ETH for display (1 ETH = 10^18 wei)
  const senderBalanceETH = ethers.formatEther(senderBalanceBefore);
  const receiverBalanceETH = ethers.formatEther(receiverBalanceBefore);
  
  console.log("✓ Sender balance:", senderBalanceETH, "ETH");
  console.log("✓ Receiver balance:", receiverBalanceETH, "ETH", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 3: Prepare Transaction
  // ──────────────────────────────────────────────────────────────────────
  console.log("📝 STEP 3: Preparing Transaction");
  console.log("───────────────────────────────────────────────────────────");
  
  // Amount to send (in ETH)
  const amountToSend = "1.5"; // Sending 1.5 ETH
  
  // Convert ETH to wei (the format blockchain uses)
  const amountInWei = ethers.parseEther(amountToSend);
  
  console.log("✓ Amount to send:", amountToSend, "ETH");
  console.log("✓ Amount in wei:", amountInWei.toString(), "wei");
  console.log("   (1 ETH = 1,000,000,000,000,000,000 wei)", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 4: Estimate Gas (Optional but Recommended)
  // ──────────────────────────────────────────────────────────────────────
  console.log("⛽ STEP 4: Estimating Gas Cost");
  console.log("───────────────────────────────────────────────────────────");
  
  // Estimate how much gas the transaction will cost
  const gasEstimate = await ethers.provider.estimateGas({
    to: receiver.address,
    value: amountInWei,
    from: sender.address
  });
  
  // Get current gas price
  const gasPrice = await ethers.provider.getFeeData();
  
  // Calculate total transaction cost
  const totalCost = gasEstimate * gasPrice.gasPrice;
  const totalCostETH = ethers.formatEther(totalCost);
  
  console.log("✓ Estimated gas:", gasEstimate.toString());
  console.log("✓ Gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
  console.log("✓ Estimated transaction cost:", totalCostETH, "ETH", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 5: Send the Transaction
  // ──────────────────────────────────────────────────────────────────────
  console.log("🚀 STEP 5: Sending Transaction");
  console.log("───────────────────────────────────────────────────────────");
  
  // Create and send the transaction
  // This creates a transaction object but doesn't wait for confirmation yet
  const transaction = await sender.sendTransaction({
    to: receiver.address,      // Where to send
    value: amountInWei,        // How much to send
    // Optional: You can specify gas limit and gas price here
    // gasLimit: gasEstimate,
    // gasPrice: gasPrice.gasPrice
  });
  
  console.log("✓ Transaction sent!");
  console.log("✓ Transaction hash:", transaction.hash);
  console.log("   (This is like a receipt number - you can track the transaction with this)", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 6: Wait for Transaction Confirmation
  // ──────────────────────────────────────────────────────────────────────
  console.log("⏳ STEP 6: Waiting for Transaction Confirmation");
  console.log("───────────────────────────────────────────────────────────");
  console.log("   Waiting for transaction to be mined into a block...\n");
  
  // Wait for the transaction to be confirmed (mined into a block)
  const receipt = await transaction.wait();
  
  console.log("✓ Transaction confirmed!");
  console.log("✓ Block number:", receipt.blockNumber);
  console.log("✓ Block hash:", receipt.blockHash);
  console.log("✓ Gas used:", receipt.gasUsed.toString());
  console.log("✓ Transaction status:", receipt.status === 1 ? "Success ✅" : "Failed ❌", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 7: Verify Final Balances
  // ──────────────────────────────────────────────────────────────────────
  console.log("✅ STEP 7: Verifying Final Balances");
  console.log("───────────────────────────────────────────────────────────");
  
  // Get balances after the transaction
  const senderBalanceAfter = await ethers.provider.getBalance(sender.address);
  const receiverBalanceAfter = await ethers.provider.getBalance(receiver.address);
  
  const senderBalanceAfterETH = ethers.formatEther(senderBalanceAfter);
  const receiverBalanceAfterETH = ethers.formatEther(receiverBalanceAfter);
  
  // Calculate changes
  const senderChange = senderBalanceAfter - senderBalanceBefore;
  const receiverChange = receiverBalanceAfter - receiverBalanceBefore;
  
  console.log("📊 BALANCE CHANGES:");
  console.log("───────────────────────────────────────────────────────────");
  console.log("Sender:");
  console.log("  Before:", ethers.formatEther(senderBalanceBefore), "ETH");
  console.log("  After: ", senderBalanceAfterETH, "ETH");
  console.log("  Change:", ethers.formatEther(senderChange), "ETH");
  console.log("  (Negative because sender paid amount + gas fees)");
  console.log();
  console.log("Receiver:");
  console.log("  Before:", ethers.formatEther(receiverBalanceBefore), "ETH");
  console.log("  After: ", receiverBalanceAfterETH, "ETH");
  console.log("  Change:", ethers.formatEther(receiverChange), "ETH");
  console.log("  (Positive because receiver received the amount)", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // STEP 8: Verify Transaction Details
  // ──────────────────────────────────────────────────────────────────────
  console.log("🔍 STEP 8: Getting Transaction Details");
  console.log("───────────────────────────────────────────────────────────");
  
  // Get full transaction details
  const txDetails = await ethers.provider.getTransaction(transaction.hash);
  
  console.log("Transaction Details:");
  console.log("  From:", txDetails.from);
  console.log("  To:", txDetails.to);
  console.log("  Value:", ethers.formatEther(txDetails.value), "ETH");
  console.log("  Gas Limit:", txDetails.gasLimit.toString());
  console.log("  Gas Price:", ethers.formatUnits(txDetails.gasPrice, "gwei"), "gwei");
  console.log("  Nonce:", txDetails.nonce, "(transaction number for this account)", "\n");

  // ──────────────────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅ Transaction Complete!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("\n📚 Key Concepts Learned:");
  console.log("  1. Signers = Accounts that can sign transactions");
  console.log("  2. Wei = Smallest unit of ETH (1 ETH = 10^18 wei)");
  console.log("  3. Gas = Fee paid to miners for processing transaction");
  console.log("  4. Transaction hash = Unique ID to track transaction");
  console.log("  5. Block confirmation = Transaction added to blockchain");
  console.log("  6. Nonce = Sequential number for each account's transactions");
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error occurred:");
    console.error(error);
    process.exit(1);
  });

