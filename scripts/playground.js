const hre = require("hardhat");

/**
 * 🎮 Interactive Playground Script
 * 
 * This script lets you play with all the contracts interactively!
 * Run: npx hardhat run scripts/playground.js --network localhost
 */

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🎮 Web3 Playground - Interactive Contract Testing");
  console.log("═══════════════════════════════════════════════════════════\n");

  const [user1, user2, user3] = await hre.ethers.getSigners();
  console.log("👤 Available accounts:");
  console.log("   User 1:", user1.address);
  console.log("   User 2:", user2.address);
  console.log("   User 3:", user3.address, "\n");

  // ========================================================================
  // 1. COUNTER CONTRACT
  // ========================================================================
  console.log("🔢 Playing with Counter Contract");
  console.log("───────────────────────────────────────────────────────────");
  
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  const counterAddress = await counter.getAddress();
  console.log("✅ Counter deployed to:", counterAddress);
  
  console.log("\n📊 Counter Operations:");
  console.log("   Initial count:", (await counter.count()).toString());
  
  await counter.increment();
  console.log("   After increment:", (await counter.count()).toString());
  
  await counter.increment();
  console.log("   After increment:", (await counter.count()).toString());
  
  await counter.add(5);
  console.log("   After adding 5:", (await counter.count()).toString());
  
  await counter.decrement();
  console.log("   After decrement:", (await counter.count()).toString());
  
  await counter.connect(user2).increment();
  console.log("   User2 increments:", (await counter.count()).toString(), "\n");

  // ========================================================================
  // 2. MESSAGE BOARD CONTRACT
  // ========================================================================
  console.log("💬 Playing with MessageBoard Contract");
  console.log("───────────────────────────────────────────────────────────");
  
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();
  await messageBoard.waitForDeployment();
  const messageBoardAddress = await messageBoard.getAddress();
  console.log("✅ MessageBoard deployed to:", messageBoardAddress);
  
  console.log("\n📝 Posting Messages:");
  await messageBoard.postMessage("Hello Web3! 🌐");
  console.log("   ✅ User1 posted: 'Hello Web3! 🌐'");
  
  await messageBoard.connect(user2).postMessage("This is so cool! 🚀");
  console.log("   ✅ User2 posted: 'This is so cool! 🚀'");
  
  await messageBoard.connect(user3).postMessage("Learning blockchain is fun! 💡");
  console.log("   ✅ User3 posted: 'Learning blockchain is fun! 💡'");
  
  const totalMessages = await messageBoard.getTotalMessages();
  console.log("\n   Total messages:", totalMessages.toString());
  
  const latest = await messageBoard.getLatestMessage();
  console.log("   Latest message:", latest.content);
  console.log("   By:", latest.author);
  console.log("   At:", new Date(Number(latest.timestamp) * 1000).toLocaleString(), "\n");

  // ========================================================================
  // 3. TOKEN CONTRACT
  // ========================================================================
  console.log("🪙 Playing with Token Contract");
  console.log("───────────────────────────────────────────────────────────");
  
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed to:", tokenAddress);
  console.log("   Token:", await token.name(), "(", await token.symbol(), ")");
  
  const user1Balance = await token.balanceOf(user1.address);
  const totalSupply = await token.totalSupply();
  console.log("\n💰 Initial Balances:");
  console.log("   User1 balance:", hre.ethers.formatEther(user1Balance), "MTT");
  console.log("   Total supply:", hre.ethers.formatEther(totalSupply), "MTT");
  
  console.log("\n💸 Transferring Tokens:");
  await token.transfer(user2.address, hre.ethers.parseEther("100"));
  console.log("   ✅ User1 sent 100 MTT to User2");
  
  await token.transfer(user3.address, hre.ethers.parseEther("50"));
  console.log("   ✅ User1 sent 50 MTT to User3");
  
  const user2Balance = await token.balanceOf(user2.address);
  const user3Balance = await token.balanceOf(user3.address);
  console.log("\n💰 Updated Balances:");
  console.log("   User1:", hre.ethers.formatEther(await token.balanceOf(user1.address)), "MTT");
  console.log("   User2:", hre.ethers.formatEther(user2Balance), "MTT");
  console.log("   User3:", hre.ethers.formatEther(user3Balance), "MTT");
  
  console.log("\n🔄 Testing Approve & TransferFrom:");
  await token.connect(user2).approve(user3.address, hre.ethers.parseEther("25"));
  console.log("   ✅ User2 approved User3 to spend 25 MTT");
  
  await token.connect(user3).transferFrom(user2.address, user3.address, hre.ethers.parseEther("25"));
  console.log("   ✅ User3 transferred 25 MTT from User2 to User3");
  console.log("   User2 balance:", hre.ethers.formatEther(await token.balanceOf(user2.address)), "MTT");
  console.log("   User3 balance:", hre.ethers.formatEther(await token.balanceOf(user3.address)), "MTT", "\n");

  // ========================================================================
  // 4. VOTING CONTRACT
  // ========================================================================
  console.log("🗳️  Playing with Voting Contract");
  console.log("───────────────────────────────────────────────────────────");
  
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("✅ Voting deployed to:", votingAddress);
  
  console.log("\n👥 Adding Candidates:");
  await voting.addCandidate("Alice");
  console.log("   ✅ Added candidate: Alice");
  
  await voting.addCandidate("Bob");
  console.log("   ✅ Added candidate: Bob");
  
  await voting.addCandidate("Charlie");
  console.log("   ✅ Added candidate: Charlie");
  
  const candidateCount = await voting.getCandidateCount();
  console.log("\n   Total candidates:", candidateCount.toString());
  
  console.log("\n🗳️  Casting Votes:");
  await voting.vote(0); // Vote for Alice
  console.log("   ✅ User1 voted for Alice");
  
  await voting.connect(user2).vote(1); // Vote for Bob
  console.log("   ✅ User2 voted for Bob");
  
  await voting.connect(user3).vote(0); // Vote for Alice
  console.log("   ✅ User3 voted for Alice");
  
  console.log("\n📊 Current Results:");
  for (let i = 0; i < Number(candidateCount); i++) {
    const candidate = await voting.getCandidate(i);
    console.log(`   ${candidate.name}: ${candidate.voteCount.toString()} votes`);
  }
  
  console.log("\n🏁 Ending Voting:");
  await voting.endVoting();
  console.log("   ✅ Voting ended");
  
  const winner = await voting.getWinner();
  console.log("\n🏆 Winner:");
  console.log("   Name:", winner.winnerName);
  console.log("   Votes:", winner.votes.toString());
  console.log("   Index:", winner.winnerIndex.toString(), "\n");

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅ Playground Complete!");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("📋 Contract Addresses:");
  console.log("   Counter:", counterAddress);
  console.log("   MessageBoard:", messageBoardAddress);
  console.log("   Token:", tokenAddress);
  console.log("   Voting:", votingAddress);
  console.log("\n💡 You can interact with these contracts using:");
  console.log("   - Web app at http://localhost:3045");
  console.log("   - Hardhat console: npx hardhat console --network localhost");
  console.log("   - Custom scripts\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

