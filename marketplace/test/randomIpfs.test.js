const { assert, expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("randomIPFS", function () {
  let RandomIpfs;
  beforeEach(async () => {
    const signer = await ethers.getSigners();
    await deployments.fixture(["all"]);
    RandomIpfs = await ethers.getContract("RandomIpfs");
  });

  it("should initialize correctly with constructor", async () => {
    const tokenID = await RandomIpfs.getTokenId();
    assert.equal(tokenID, "0");
  });

  describe("requestNft", function () {
    it("reverts if not enough funds are sent", async function () {
      await expect(RandomIpfs.requestNft()).to.be.revertedWith(
        "RandomIpfs_notEnoughEthSent"
      );
    });
  });
});
