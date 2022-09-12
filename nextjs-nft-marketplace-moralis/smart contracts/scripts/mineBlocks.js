const { moveBlocks } = require("./moveBlocks");

const BLOCKS = 2;
const SLEEP = 1000;

async function mineBlocks() {
  await moveBlocks(BLOCKS, SLEEP);
}

mineBlocks()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
