const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("-------------------");
  log("Deploying...");
  const nftMarketplace = await deploy("nftMarketplace", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.waitConfirmations || "1",
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying");
    verify(nftMarketplace, []);
  }
  log("-------------------");
};

module.exports.tags = ["deploy", "main", "marketplace"];
