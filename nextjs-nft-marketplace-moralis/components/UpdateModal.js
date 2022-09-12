import React, { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import marketplaceAbi from "../constants/nftMarketplaceAbi.json";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";

const UpdateModal = ({ setModal, marketplaceAddress, nftAddress, token }) => {
  const [newPrice, setnewPrice] = useState("0");

  const dispatch = useNotification();
  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    params: {
      nftAddress: nftAddress,
      token: token,
      newPrice: ethers.utils.parseEther(newPrice || "0"),
    },
    functionName: "updateListing",
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Please refresh page",
      title: "Update Successfull",
      position: "topR",
    });
  };

  return (
    <div className="z-[99] relative flex-col mt-5 max-w-[370px] w-2/6 min-w-[250px] rounded-3xl h-[250px] bg-white border-2 border-black p-4 flex">
      <div
        onClick={() => {
          setModal(false);
        }}
        className="p-4 bg-red-500 flex items-center justify-center text-white rounded-full w-5 h-5"
      >
        x
      </div>
      <h1 className="mt-4 font-bold">
        Update listing price in L1 Currency Eth
      </h1>
      <input
        placeholder="new listing price"
        onChange={(e) => setnewPrice(e.target.value)}
        className="mt-2 w-full py-1 px-4 rounded-lg bg-white border-2 border-gray-500"
      ></input>
      <h1
        onClick={() => updateListing({ onSuccess: handleSuccess })}
        className="mt-2 w-full py-1 px-4 rounded-lg bg-green-300 flex justify-center border-2 border-gray-500"
      >
        Confirm
      </h1>
    </div>
  );
};

export default UpdateModal;
