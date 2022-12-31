import { ReactElement, ReactNode } from "react";
import type { AppContext, AppProps } from "next/app";
import type { NextPage } from "next";
import { appWithTranslation } from "next-i18next";

import Head from "@components/Head";
import { StandardLayout } from "@components/Layout";
import ErrorBoundary from "@components/ErrorBoundary";

import { initMocks } from "@mocks/init";
import { env } from "@core/config";

import "../styles/globals.scss";

// try @next/font package for font optimization

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
	hostname: string;
};

if (env.mockAPI) {
	initMocks();
}

function App({ Component, pageProps, hostname }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || StandardLayout;

	return (
		<>
			<ErrorBoundary fallback={<>Error Caught by ErrorBoundary</>}>
				<Head hostname={hostname} />
				{getLayout(<Component {...pageProps} />)}
			</ErrorBoundary>
		</>
	);
}

/**
 * This will disable Automatic Static Optimization in pages without Static Generation
 * https://nextjs.org/docs/advanced-features/automatic-static-optimization
 */
App.getInitialProps = async (appContext: AppContext) => {
	const req = appContext.ctx.req;
	const hostname = req?.headers.host;

	return {
		hostname,
	};
};

export default appWithTranslation(App);
