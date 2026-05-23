import { BaseLayout } from "@/components/layout/BaseLayout";
import { HotToastConfig } from "@/components/layout/HotToastConfig";
import GlobalStyles from "@/styles/GlobalStyles";
import { ChakraProvider, DarkMode } from "@chakra-ui/react";
import { cache } from "@emotion/css";
import { CacheProvider } from "@emotion/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

import MySorobanReactProvider from "../components/web3/MySorobanReactProvider";
import NavBar from "@/components/navbar/NavBar";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Function to clear localStorage
    const clearLocalStorage = () => {
      localStorage.clear();
    };

    // Add the event listener to clear localStorage before the window unloads
    window.addEventListener("beforeunload", clearLocalStorage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", clearLocalStorage);
    };
  }, []);

  return (
    <>
      <DefaultSeo
        defaultTitle="Dvilla Local Food Store"
        titleTemplate="%s | Dvilla Local Food Store"
        description="Purchase Whole Organic Fruits at Dvilla Local Food Store"
        openGraph={{
          type: "website",
          locale: "en",
          site_name: "Dvilla Local Food Store",
        }}
        twitter={{
          handle: "",
        }}
      />
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <MySorobanReactProvider>
        <CacheProvider value={cache}>
          <ChakraProvider>
            <DarkMode>
              <GlobalStyles />

              <BaseLayout>
                <NavBar />
                <Component {...pageProps} />
              </BaseLayout>

              <HotToastConfig />
            </DarkMode>
          </ChakraProvider>
        </CacheProvider>
      </MySorobanReactProvider>
    </>
  );
}

export default MyApp;
