import { ssrLangProps } from "@core/utils";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	const transalations = await ssrLangProps(locale);

	return {
		props: transalations,
	};
};

const home = () => {
	return (
		<section>
			<p>
				go to <Link href="/tasks">tasks</Link>
			</p>
		</section>
	);
};

export default home;
