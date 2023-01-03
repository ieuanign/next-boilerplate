import { GetServerSidePropsContext } from "next";
import { Router } from "next/router";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "@pages/_app.page";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

jest.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: any) => key }),
}));

export const setup = (Component: Function, defaultRouter?: Partial<Router>) => {
	let mockRouter = {
		pathname: "/",
		query: {},
		...defaultRouter,
		push: jest.fn(),
		prefetch: jest.fn(() => Promise.resolve(true)),
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
			<App
				pageProps={pageProps}
				hostname={hostname}
				router={mockRouter}
				{...rest}
				Component={Component}
			/>
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
