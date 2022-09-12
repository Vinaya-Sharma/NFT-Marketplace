const { network } = require("hardhat");

async function sleep(sleepAmount) {
  await new Promise((resolve) => setTimeout(resolve, sleepAmount));
}

async function moveBlocks(ammount, sleepAmount) {
  console.log("moving blocks");
  for (let i = 0; i < ammount; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
    if (sleepAmount) {
      console.log("sleeping for ", sleepAmount);
      await sleep(sleepAmount);
    }
  }
}

module.exports = {
  moveBlocks,
  sleep,
};
