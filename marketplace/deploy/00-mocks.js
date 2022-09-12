const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("test net detected..deploying mocks");
    await deploy("mockVrfCoordinator", {
      from: deployer,
      log: true,
    });
  }
  log("Mocks Deployed!");
  log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
};

module.exports.tags = ["all", "mocks"];
