const { ethers, deployments, network } = require("hardhat");
const { moveBlocks } = require("./moveBlocks");

const TOKEN = 5;

async function cancel() {
  const basicNft = await ethers.getContract("BasicNft");
  const nftMarketplace = await ethers.getContract("nftMarketplace");

  console.log("cancelling...token: ", TOKEN);
  const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN);
  const txReceipt = await tx.wait(1);
  console.log("cancelled");

  if (network.config.chainId == "31337") {
    await moveBlocks(2, 1000);
  }
}

cancel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
