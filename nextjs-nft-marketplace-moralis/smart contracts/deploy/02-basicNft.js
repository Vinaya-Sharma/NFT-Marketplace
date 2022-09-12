const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const BasicNft = await deploy("BasicNft", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.waitConfirmations || "1",
  });

  if (!developmentChains.includes(network.name)) {
    console.log("verifying...");
    await verify(BasicNft.address, []);
  }
  log("___________________");
};

module.exports.tags = ["main", "marketplace", "nft"];
