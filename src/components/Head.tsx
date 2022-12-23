import NextHead from "next/head";

const Head = () => {
	return (
		<NextHead>
			<title>NextJS Boilerplate</title>
			<meta
				name="description"
				content="Generated by create next app"
				key="description"
			/>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
				key="viewport"
			/>
			<link rel="icon" href="/favicon.ico" />
			<meta name="theme-color" content="#ffffff" />
		</NextHead>
	);
};

export default Head;