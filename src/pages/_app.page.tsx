import { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";

import Head from "@components/Head";
import { StandardLayout } from "@components/Layout";

import "../styles/globals.scss";

// try @next/font package for font optimization

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || StandardLayout;

	return (
		<>
			<Head />
			{getLayout(<Component {...pageProps} />)}
		</>
	);
}
