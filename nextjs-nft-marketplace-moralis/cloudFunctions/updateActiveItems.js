Moralis.Cloud.afterSave("itemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("looking for confirm");

  if (confirmed) {
    logger.info("found item");
    const activeItem = Moralis.Object.extend("activeItem");

    const query = new Moralis.Query(activeItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("token", request.object.get("token"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("seller", request.object.get("sender"));
    const nftEntry = await query.first();

    if (nftEntry) {
      logger.info("nft already exists..deleting");
      await nftEntry.destroy();
      logger.info("destroyed now resetting...");
    } else {
      logger.info("same not found");
    }

    const newItem = new activeItem();
    newItem.set("marketplaceAddress", request.object.get("address"));
    newItem.set("nftAddress", request.object.get("nftAddress"));
    newItem.set("price", request.object.get("price"));
    newItem.set("token", request.object.get("token"));
    newItem.set("seller", request.object.get("sender"));
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )} TokenId: ${request.object.get("token")}`
    );
    logger.info("Saving...");
    await newItem.save();
  }
});

Moralis.Cloud.afterSave("itemCancelled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("looking got confirm");

  if (confirmed) {
    const activeItem = Moralis.Object.extend("activeItem");
    const query = new Moralis.Query(activeItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("token", request.object.get("token"));
    logger.info(`looking for item with query of: ${query}`);
    const cancelledItem = await query.first();

    if (cancelledItem) {
      logger.info(
        `deleting item with nft address of ${request.object.get(
          "nftAddress"
        )} and token of ${request.object.get("token")}`
      );
      await cancelledItem.destroy();
    } else {
      logger.info(
        `could not find item with nft address of ${request.object.get(
          "nftAddress"
        )}, and token of ${request.object.get("token")} `
      );
    }
  }
});

Moralis.Cloud.afterSave("itemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("waiting for bought confirm");

  if (confirmed) {
    const activeItem = Moralis.Object.extend("activeItem");
    const query = new Moralis.Query(activeItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("token", request.object.get("token"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    const bought = await query.first();

    if (bought) {
      logger.info(
        `deleting bought nft with marketplace address of ${request.object.get(
          "address"
        )}, and token of %${request.object.get("token")} `
      );
      await bought.destroy();
    } else {
      logger.info(
        `could not find nft with marketplace address of ${request.object.get(
          "address"
        )}, and token of ${request.object.get("token")}`
      );
    }
  }
});
