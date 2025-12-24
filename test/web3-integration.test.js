const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Web3 Integration Tests", function () {
  let simpleStorage;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
  });

  describe("Multi-user Contract Interaction", function () {
    it("Should handle multiple users setting values", async function () {
      await simpleStorage.connect(user1).setValue(100);
      expect(await simpleStorage.getValue()).to.equal(100);

      await simpleStorage.connect(user2).setValue(200);
      expect(await simpleStorage.getValue()).to.equal(200);

      await simpleStorage.connect(owner).setValue(300);
      expect(await simpleStorage.getValue()).to.equal(300);
    });

    it("Should track events from multiple users", async function () {
      await expect(simpleStorage.connect(user1).setValue(50))
        .to.emit(simpleStorage, "ValueChanged")
        .withArgs(50, user1.address);

      await expect(simpleStorage.connect(user2).setValue(75))
        .to.emit(simpleStorage, "ValueChanged")
        .withArgs(75, user2.address);
    });
  });

  describe("Gas Estimation", function () {
    it("Should estimate gas for setValue", async function () {
      const gasEstimate = await simpleStorage.setValue.estimateGas(42);
      expect(gasEstimate).to.be.a("bigint");
      expect(gasEstimate).to.be.gt(0);
    });

    it("Should execute transaction with gas limit", async function () {
      const gasEstimate = await simpleStorage.setValue.estimateGas(42);
      const tx = await simpleStorage.setValue(42, {
        gasLimit: gasEstimate * 2n,
      });
      await tx.wait();
      expect(await simpleStorage.getValue()).to.equal(42);
    });
  });

  describe("Error Handling", function () {
    it("Should revert on invalid operations if contract had restrictions", async function () {
      // This test demonstrates error handling pattern
      // SimpleStorage doesn't have restrictions, but we can test the pattern
      const contract = simpleStorage.connect(user1);
      
      // Valid operation should succeed
      await expect(contract.setValue(999)).to.not.be.reverted;
    });
  });

  describe("Contract State Persistence", function () {
    it("Should maintain state across multiple transactions", async function () {
      await simpleStorage.setValue(10);
      expect(await simpleStorage.getValue()).to.equal(10);

      await simpleStorage.setValue(20);
      expect(await simpleStorage.getValue()).to.equal(20);

      await simpleStorage.setValue(30);
      expect(await simpleStorage.getValue()).to.equal(30);
    });
  });
});

