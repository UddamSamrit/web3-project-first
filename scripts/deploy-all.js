const hre = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🚀 Deploying All Contracts");
  console.log("═══════════════════════════════════════════════════════════\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy SimpleStorage
  console.log("📦 Deploying SimpleStorage...");
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment();
  const storageAddress = await simpleStorage.getAddress();
  console.log("✅ SimpleStorage deployed to:", storageAddress, "\n");

  // Deploy Counter
  console.log("📦 Deploying Counter...");
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  const counterAddress = await counter.getAddress();
  console.log("✅ Counter deployed to:", counterAddress);
  console.log("   Initial count:", (await counter.count()).toString(), "\n");

  // Deploy MessageBoard
  console.log("📦 Deploying MessageBoard...");
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();
  await messageBoard.waitForDeployment();
  const messageBoardAddress = await messageBoard.getAddress();
  console.log("✅ MessageBoard deployed to:", messageBoardAddress);
  console.log("   Total messages:", (await messageBoard.getTotalMessages()).toString(), "\n");

  // Deploy Token
  console.log("📦 Deploying Token...");
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed to:", tokenAddress);
  console.log("   Token name:", await token.name());
  console.log("   Token symbol:", await token.symbol());
  console.log("   Total supply:", (await token.totalSupply()).toString());
  console.log("   Deployer balance:", (await token.balanceOf(deployer.address)).toString(), "\n");

  // Deploy Voting
  console.log("📦 Deploying Voting...");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("✅ Voting deployed to:", votingAddress, "\n");

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅ All Contracts Deployed!");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("📋 Contract Addresses:");
  console.log("   SimpleStorage:", storageAddress);
  console.log("   Counter:", counterAddress);
  console.log("   MessageBoard:", messageBoardAddress);
  console.log("   Token:", tokenAddress);
  console.log("   Voting:", votingAddress);
  console.log("\n💡 You can now interact with these contracts!");
  console.log("   Use the web app or scripts to play with them.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

