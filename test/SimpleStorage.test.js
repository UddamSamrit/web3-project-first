const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers (accounts)
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await simpleStorage.getOwner()).to.equal(owner.address);
    });

    it("Should initialize with value 0", async function () {
      expect(await simpleStorage.getValue()).to.equal(0);
    });
  });

  describe("Transactions", function () {
    it("Should allow owner to set value", async function () {
      await expect(simpleStorage.setValue(42))
        .to.emit(simpleStorage, "ValueChanged")
        .withArgs(42, owner.address);

      expect(await simpleStorage.getValue()).to.equal(42);
    });

    it("Should allow any address to set value", async function () {
      await simpleStorage.connect(addr1).setValue(100);
      expect(await simpleStorage.getValue()).to.equal(100);
    });

    it("Should update value correctly", async function () {
      await simpleStorage.setValue(10);
      expect(await simpleStorage.getValue()).to.equal(10);

      await simpleStorage.setValue(20);
      expect(await simpleStorage.getValue()).to.equal(20);
    });

    it("Should emit ValueChanged event", async function () {
      await expect(simpleStorage.setValue(99))
        .to.emit(simpleStorage, "ValueChanged")
        .withArgs(99, owner.address);
    });
  });
});

