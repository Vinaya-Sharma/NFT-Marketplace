const { ethers, network } = require("hardhat");
const { moveBlocks } = require("./moveBlocks");

async function mintAndList() {
  const nftMarketplace = await ethers.getContract("nftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");

  console.log("minting nft...");
  const mintTx = await basicNft.mintNft();
  const mintReciept = await mintTx.wait(1);
  const tokenId = mintReciept.events[0].args.tokenId;

  console.log("approving nft...");
  const approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approveTx.wait(1);

  console.log("listing nft...");
  const price = ethers.utils.parseEther("0.01");
  const listTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    price
  );
  await listTx.wait(1);

  console.log("done!");

  if (network.config.chainId == "31337") {
    await moveBlocks(2, 1000);
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
