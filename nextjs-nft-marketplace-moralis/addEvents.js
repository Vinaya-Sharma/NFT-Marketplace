const Moralis = require("moralis-v1/node");
require("dotenv").config();

const contractAddresses = require("./constants/networkMapping.json");
const chainId = process.env.chainId || "31337";
let moralisChainId = chainId.toString() == "31337" ? "1337" : chainId;
const contractAddress = contractAddresses[chainId]["nftMarketplace"][0];
const appId = process.env.NEXT_PUBLIC_APP_ID;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const masterKey = process.env.masterKey;

async function Main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log("working with contract ", contractAddress);

  const itemListedOptions = {
    address: contractAddress,
    tableName: "itemListed",
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemListed(address,address, uint256, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "token",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
  };

  const itemBoughtOptions = {
    address: contractAddress,
    tableName: "itemBought",
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemBought(address,address, uint256, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "token",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
  };

  const itemCancelledOptions = {
    address: contractAddress,
    tableName: "itemCancelled",
    chainId: moralisChainId,
    sync_historical: true,
    topic: "ItemCancelled(address, uint256, address)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "token",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
      ],
      name: "ItemCancelled",
      type: "event",
    },
  };

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    { useMasterKey: true }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    { useMasterKey: true }
  );
  const cancelledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCancelledOptions,
    { useMasterKey: true }
  );

  if (
    listedResponse.success &&
    boughtResponse.success &&
    cancelledResponse.success
  ) {
    console.log("successfully watching events");
  } else {
    console.log("Oh no, something went wrong. Not watching events");
  }
}

Main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
