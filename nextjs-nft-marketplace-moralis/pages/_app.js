import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Head from "next/head";
import { NotificationProvider } from "@web3uikit/core";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NotificationProvider>
        <Head>
          <title>Nft Marketplace</title>
          <meta name="description" content="Nft Marketplace" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MoralisProvider
          appId={process.env.NEXT_PUBLIC_APP_ID}
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
        >
          <Header />
          <Component {...pageProps} />
        </MoralisProvider>
      </NotificationProvider>
    </>
  );
}

export default MyApp;
