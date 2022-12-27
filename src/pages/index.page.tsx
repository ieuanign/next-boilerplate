import { GetServerSideProps } from "next";
import { SWRConfig } from "swr";
import { getServerSideFallbacks } from "@core/http/request";

import { PageProps } from "@pages/type";
import useSWR from "@hooks/useSWR";

export const getServerSideProps: GetServerSideProps = async () => {
	const fallback = await getServerSideFallbacks([
		["https://pokeapi.co/api/v2/pokemon/ditto"],
	]);
	return {
		props: {
			fallback,
		},
	};
};

const Home = () => {
	const { data } = useSWR("https://pokeapi.co/api/v2/pokemon/ditto");

	// there should be no `undefined` state
	console.log("data", data); // intentional logger

	return <section>content</section>;
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
