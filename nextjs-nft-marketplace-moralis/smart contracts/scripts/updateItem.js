const { ethers, network } = require("hardhat");
const { moveBlocks } = require("./moveBlocks");

const TOKEN = 0;
const PRICE = ethers.utils.parseEther("0.05");

async function updateItem() {
  const basicNft = await ethers.getContract("BasicNft");
  const nftMarketplace = await ethers.getContract("nftMarketplace");

  const tx = await nftMarketplace.updateListing(basicNft.address, TOKEN, PRICE);
  await tx.wait(1);

  if (network.config.chainId == "31337") {
    await moveBlocks(2, 1000);
  }
}

updateItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
