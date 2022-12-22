import "../styles/globals.css";
import type { AppProps } from "next/app";

// try @next/font package for font optimization

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
