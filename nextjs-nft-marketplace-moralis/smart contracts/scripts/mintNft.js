const { ethers, network } = require("hardhat");
const { moveBlocks } = require("./moveBlocks");

async function mintNft() {
  const basicNft = await ethers.getContract("BasicNft");

  console.log("minting nft...");
  const mintTx = await basicNft.mintNft();
  const mintReciept = await mintTx.wait(1);
  const tokenId = mintReciept.events[0].args.tokenId;

  console.log(`token id is ${tokenId}`);
  console.log(`nft address is ${basicNft.address}`);
}

mintNft()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
