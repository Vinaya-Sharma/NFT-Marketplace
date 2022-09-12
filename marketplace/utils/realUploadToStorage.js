// Import the NFTStorage class and File constructor from the 'nft.storage' package
const { NFTStorage, File } = require("nft.storage");
const mime = require("mime");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZkNWQyMmZhZkM2NzA2RjA0Y0ZBQjBBYjEwMzk3MjdFQjhlMDA2QjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjEyODQwNTU4MCwibmFtZSI6InJhbmRvbU5mdCJ9.n--yN2CehXL3FMejc31_7_w9PhQLGeONL3lV70AS31M";

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFTs(imagesPath) {
  const fullImagesPath = path.resolve(imagesPath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];
  for (fileIndex in files) {
    const image = await fileFromPath(`${fullImagesPath}/${files[fileIndex]}`);
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    const dogName = files[fileIndex].replace(".png", "");
    const response = await nftstorage.store({
      image,
      name: dogName,
      description: `An adorable ${dogName}`,
    });
    responses.push(response);
  }
  return responses;
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

module.exports = {
  storeNFTs,
};
