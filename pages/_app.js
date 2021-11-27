import "../styles/globals.css";
import { GeistProvider, CssBaseline, Button } from "@geist-ui/react";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { Moon, Sun, Home  } from "@geist-ui/react-icons";
import Head from "next/head";
import {useRouter} from 'next/router'
import dynamic from "next/dynamic";

function App({ Component, pageProps }) {
  const [themeType, setThemeType] = useState(false);
  const router = useRouter();
  return (
    <GeistProvider themeType={themeType ? "dark" : "light"}>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </Head>
      <Button
        iconRight={<Home />}
        auto
        scale={2 / 3}
        px={0.6}
        onClick={() => router.push('/')}
        className={styles.fixed}
      />
      <Button
        iconRight={themeType ? <Moon /> : <Sun />}
        auto
        scale={2 / 3}
        px={0.6}
        onClick={() => setThemeType(!themeType)}
        className={styles.fixed2}
      />
      <CssBaseline>
        <Component {...pageProps} />
      </CssBaseline>
    </GeistProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
