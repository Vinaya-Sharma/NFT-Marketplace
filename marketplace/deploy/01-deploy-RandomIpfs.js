const { ethers, network } = require("hardhat");
const { developmentChains, config } = require("../hardhat-helper-config");
const { storeNFTs } = require("../utils/realUploadToStorage");
const { verify } = require("../utils/verify");

async function getDogUris(imageLocation) {
  const dogUris = await storeNFTs(imageLocation);
  const result = [];
  for (dog in dogUris) {
    result.push(dogUris[dog].url);
  }
  console.log(result);
  return result;
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  let vrfCoordinatorAddress, subscriptionId;
  const imageLocation = "./images";
  let dogUris;

  if (process.env.UPLOADTOSTORAGE) {
    dogUris = await getDogUris(imageLocation);
  } else {
    dogUris = [
      "ipfs://bafyreiflh4wjd2shgk2kguff5gl5uv6ifpdszfgfep2itve3tdzqugx7mu/metadata.json",
      "ipfs://bafyreifto6b6mnmdldfgjdnl7s4xtqiy2y3sxdzeofto4t7kabirethnqa/metadata.json",
      "ipfs://bafyreiba3gghrjx7tyxlomgt3y772wdnts5sz4hrf5esddkka42w7o22be/metadata.json",
    ];
  }
  if (developmentChains.includes(chainId)) {
    const vrfCoordinator = await ethers.getContract("mockVrfCoordinator");
    const tx = await vrfCoordinator.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    vrfCoordinatorAddress = vrfCoordinator.address;
  } else {
    vrfCoordinatorAddress = config[chainId].vrfCoordinator;
    subscriptionId = config[chainId].subscriptionId;
  }
  log("-----------------------------------------");
  const args = [
    vrfCoordinatorAddress,
    config[chainId].keyHash,
    subscriptionId,
    config[chainId].callbackGasLimit,
    dogUris,
  ];

  const RandomIpfs = await deploy("RandomIpfs", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.waitConfirmations || 1,
  });

  if (!developmentChains.includes(chainId)) {
    verify(RandomIpfs.address, args);
  }
};

module.exports.tags = ["all", "deploy"];
