const { ethers, network, deployments } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const log = deployments.log;
module.exports = async function () {
  log("----");
  if (process.env.UPDATE_FRONTEND == "true") {
    await updateFrontend();
    await writeAbi();
  }
};

async function writeAbi() {
  const ABILOCATION = "../nextjs-nft-marketplace-moralis/constants/";
  const nftMarketplace = await ethers.getContract("nftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");

  fs.writeFileSync(
    `${ABILOCATION}/nftMarketplaceAbi.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );
  fs.writeFileSync(
    `${ABILOCATION}/basicNftAbi.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateFrontend() {
  const frontendFile =
    "../nextjs-nft-marketplace-moralis/constants/networkMapping.json";

  log("updaying");
  const nftMarketplace = await ethers.getContract("nftMarketplace");

  const chainId = network.config.chainId.toString();

  const networkMapping = JSON.parse(fs.readFileSync(frontendFile, "utf-8"));

  if (chainId in networkMapping) {
    if (
      !networkMapping[chainId]["nftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      log("updating entry");
      networkMapping[chainId]["nftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    log("adding new entry");
    networkMapping[chainId] = { nftMarketplace: [nftMarketplace.address] };
  }

  fs.writeFileSync(frontendFile, JSON.stringify(networkMapping));
  log("done");
}

module.exports.tags = ["all", "frontend"];
