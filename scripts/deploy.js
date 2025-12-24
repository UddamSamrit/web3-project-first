const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleStorage contract...");

  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();

  const address = await simpleStorage.getAddress();
  console.log("SimpleStorage deployed to:", address);
  console.log("Owner:", await simpleStorage.getOwner());
  console.log("Initial value:", await simpleStorage.getValue().then(v => v.toString()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

