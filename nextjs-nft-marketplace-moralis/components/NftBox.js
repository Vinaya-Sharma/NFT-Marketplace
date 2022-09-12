import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftMarketplaceAbi.json";
import basicNftAbi from "../constants/basicNftAbi.json";
import Image from "next/image";
import { ethers } from "ethers";
import UpdateModal from "./UpdateModal";
import { useNotification } from "@web3uikit/core";

const NftBox = ({ price, nftAddress, token, markerplaceAddress, seller }) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modal, setModal] = useState(false);

  const { runContractFunction: buyListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: markerplaceAddress,
    msgValue: price,
    params: {
      nftAddress,
      token,
    },
    functionName: "buyItem",
  });

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    //provide arguments + test putting box on the page
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: token,
    },
  });

  async function updateUi() {
    const tokenUri = await getTokenURI();
    console.log(`Your token URL is ${tokenUri}`);
    if (tokenUri) {
      //change ipfs server link -> https server -> viewable by all
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io:/ipfs/");
      const tokenResp = await (await fetch(requestUrl)).json();
      const imageUri = tokenResp.image;
      const imageUriUrl = imageUri.replace("ipfs://", "https://ipfs.io:/ipfs/");
      setImage(imageUriUrl);
      setTitle(tokenResp.name);
      setDescription(tokenResp.description);
      console.log(image);
    }
  }

  const dispatch = useNotification();
  const handlePurchase = async (tx) => {
    await tx.wait(1);
    dispatch({
      title: "Purchase Succesfull",
      type: "success",
      message: "Item Bought",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  const handleClick = () => {
    if (seller == account) {
      setModal(true);
    } else {
      buyListing({
        onSuccess: handlePurchase,
        onError: (e) => {
          console.log(e);
        },
      });
    }
  };

  return (
    <div>
      <div className="absolute w-screen h-screen flex justify-center ">
        {modal && (
          <UpdateModal
            setModal={setModal}
            marketplaceAddress={markerplaceAddress}
            nftAddress={nftAddress}
            token={token}
          />
        )}
      </div>
      <div
        onClick={handleClick}
        className="w-[300px] flex flex-col justify-center h-[300px] p-10 bg-blue-100 border-2 border-blue-300 rounded-3xl "
      >
        <div className=" flex flex-col">
          <div className="mt-5 flex w-full justify-between">
            <p className="text-sm">Token Id: {token}</p>
            <p className="text-sm">
              By:{" "}
              {seller == account
                ? "you"
                : `${seller.toString().slice(0, 10)}...`}
            </p>
          </div>

          {Image && (
            <Image
              loader={() => image}
              height="200"
              width="200"
              src={
                image ||
                "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
              }
            />
          )}
        </div>
        <p className="flex underline italic justify-end">
          {ethers.utils.formatUnits(price, "ether")}ETH
        </p>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold ">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default NftBox;
