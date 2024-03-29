import { GetServerSidePropsContext } from "next";
import { SWRConfig } from "swr";
import { Router } from "next/router";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@pages/_app.page";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

jest.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: any) => key }),
}));

export const init = (Component: Function, defaultRouter?: Partial<Router>) => {
	let mockRouter = {
		pathname: "/",
		query: {},
		locales: ["en", "id"],
		...defaultRouter,
		push: jest.fn(),
		// prefetch: jest.fn(() => Promise.resolve(true)),
	};

	const withProps = (props?: any) => {
		const {
			hostname = "http://localhost:3000",
			pageProps = {},
			router,
			...rest
		} = props || {};

		mockRouter = { ...mockRouter, ...router };

		useRouter.mockReturnValue(mockRouter);

		const Comp = render(
			<SWRConfig value={{ provider: () => new Map() }}>
				<App
					pageProps={pageProps}
					hostname={hostname}
					router={mockRouter}
					{...rest}
					Component={Component}
				/>
			</SWRConfig>
		);

		return {
			router: mockRouter,
			userEvent: userEvent.setup(),
			...Comp,
		};
	};

	return withProps;
};

export const getContext = (
	pathname: string,
	config?: any
): GetServerSidePropsContext =>
	({
		query: {},
		locale: "en",
		...config,
		resolvedUrl: pathname,
		req: {
			...config?.req,
			cookies: {
				...config?.req?.cookies,
			},
		},
	} as GetServerSidePropsContext);

export const ssrLangTest = (
	context: GetServerSidePropsContext,
	getServerSideProps: Function
) => {
	it("without locale", async () => {
		const customContext = {
			...context,
			locale: undefined,
		};

		const ssrProps = await getServerSideProps(customContext);

		// show fallback data
		expect(ssrProps).toMatchSnapshot();
	});
};
