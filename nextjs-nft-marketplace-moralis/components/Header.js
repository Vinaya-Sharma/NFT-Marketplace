import React from "react";
import ConnectButton from "./ConnectButton";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="p-5 border-black border-b flex flex-row justify-between items-center">
      <h1 className=" font-bold py-4 px-16 text-3xl ">Nft Marketplace</h1>
      <div className="space-x-6  items-center px-5 flex flex-row ">
        <Link href={"/"}>
          <a>Nft Marketplace</a>
        </Link>
        <Link href={"/sell"}>
          <a>Sell Nft</a>
        </Link>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Header;
