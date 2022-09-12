import styles from "../styles/Home.module.css";
import { useMoralis, useMoralisQuery } from "react-moralis";
import NftBox from "../components/NftBox";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  const {
    data: listedNfts,
    error,
    isLoading: listedNftsLoading,
  } = useMoralisQuery("activeItem", (query) =>
    query.descending("token").limit(10)
  );

  console.log(listedNfts);
  return isWeb3Enabled ? (
    <div className="px-20 py-10 ">
      <h1 className="text-2xl font-bold py-4 text-blue-400">Recently Listed</h1>
      {listedNftsLoading ? (
        <div>Loading... </div>
      ) : (
        <div className="flex space-x-5">
          {listedNfts.map((nft) => {
            const { marketplaceAddress, nftAddress, price, token, seller } =
              nft.attributes;
            return (
              <NftBox
                key={`${nftAddress}${token}`}
                price={price}
                nftAddress={nftAddress}
                token={token}
                markerplaceAddress={marketplaceAddress}
                seller={seller}
              />
            );
          })}
        </div>
      )}
    </div>
  ) : (
    <div className="px-20 py-10">
      Web 3 is not enabled...please connect an account
    </div>
  );
}
