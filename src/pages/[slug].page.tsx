import { GetServerSideProps } from "next";
import { SWRConfig } from "swr";
import { getServerSideFallbacks } from "@core/http/request";

import { PageProps } from "@pages/type";

import { SWRKeyType } from "@core/http/types";
import useSWR from "@hooks/useSWR";
import { ssrLangProps } from "@core/utils";

const API: SWRKeyType = ["https://api.github.com/repos/vercel/swr"];

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	const fallback = await getServerSideFallbacks([API]);
	const transalations = await ssrLangProps(locale);

	return {
		props: {
			fallback,
			...transalations,
		},
	};
};

const Home = () => {
	/* const { data } =  */ useSWR(API);

	// there should be no `undefined` state
	// console.log("data", data); // intentional logger

	return (
		<section>
			<button
				onClick={() => {
					throw new Error("error onclick");
				}}
			>
				error onClick test
			</button>
			content
		</section>
	);
};

const Page = ({ fallback = {} }: PageProps) => {
	return (
		<SWRConfig
			value={{
				fallback,
			}}
		>
			<Home />
		</SWRConfig>
	);
};

export default Page;