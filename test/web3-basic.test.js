const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Web3 Basic Operations", function () {
  let provider;
  let signers;

  beforeEach(async function () {
    provider = ethers.provider;
    signers = await ethers.getSigners();
  });

  describe("Wallet Operations", function () {
    it("Should create a wallet and get address", async function () {
      const wallet = ethers.Wallet.createRandom();
      expect(wallet.address).to.be.a("string");
      expect(wallet.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should get account balance", async function () {
      const balance = await provider.getBalance(signers[0].address);
      expect(balance).to.be.a("bigint");
      expect(balance).to.be.gt(0);
    });

    it("Should send ETH between accounts", async function () {
      const sender = signers[0];
      const receiver = signers[1];

      const initialBalance = await provider.getBalance(receiver.address);
      const amount = ethers.parseEther("1.0");

      const tx = await sender.sendTransaction({
        to: receiver.address,
        value: amount,
      });

      await tx.wait();

      const finalBalance = await provider.getBalance(receiver.address);
      expect(finalBalance - initialBalance).to.equal(amount);
    });
  });

  describe("Blockchain Info", function () {
    it("Should get current block number", async function () {
      const blockNumber = await provider.getBlockNumber();
      expect(blockNumber).to.be.a("number");
      expect(blockNumber).to.be.gte(0);
    });

    it("Should get block information", async function () {
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      
      expect(block).to.have.property("number");
      expect(block).to.have.property("hash");
      expect(block).to.have.property("timestamp");
    });

    it("Should get network information", async function () {
      const network = await provider.getNetwork();
      expect(network).to.have.property("chainId");
      expect(network.chainId).to.equal(1337n); // Hardhat default
    });
  });

  describe("Transaction Operations", function () {
    it("Should get transaction receipt", async function () {
      const tx = await signers[0].sendTransaction({
        to: signers[1].address,
        value: ethers.parseEther("0.1"),
      });

      const receipt = await tx.wait();
      expect(receipt).to.have.property("blockNumber");
      expect(receipt).to.have.property("hash");
      expect(receipt).to.have.property("status", 1);
    });

    it("Should estimate gas for transaction", async function () {
      const estimate = await provider.estimateGas({
        to: signers[1].address,
        value: ethers.parseEther("0.1"),
      });

      expect(estimate).to.be.a("bigint");
      expect(estimate).to.be.gt(0);
    });
  });
});

