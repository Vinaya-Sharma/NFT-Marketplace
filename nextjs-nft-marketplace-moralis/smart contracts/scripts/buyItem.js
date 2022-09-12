const { ethers, network } = require("hardhat");
const { moveBlocks } = require("./moveBlocks");

const TOKEN = 1;

async function buyItem() {
  const basicNft = await ethers.getContract("BasicNft");
  const nftMarketplace = await ethers.getContract("nftMarketplace");

  const listingTx = await nftMarketplace.getListing(basicNft.address, TOKEN);
  const listingprice = listingTx.price.toString();

  console.log(`purchasing token ${TOKEN}, for a cost of ${listingprice}`);
  const buyTx = await nftMarketplace.buyItem(basicNft.address, TOKEN, {
    value: listingprice,
  });
  await buyTx.wait(1);

  if (network.config.chainId == "31337") {
    await moveBlocks(2, 1000);
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
