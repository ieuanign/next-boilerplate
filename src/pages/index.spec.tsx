import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import Home, { getServerSideProps } from "./index.page";

import { init, getContext, ssrLangTest } from "@core/test-utils";

const pathname = "/en";

const setup = init(Home, {
	pathname,
});

describe("getServerSideProps", () => {
	const defaultContext = getContext(pathname);

	ssrLangTest(defaultContext, getServerSideProps);
});

describe("Home", () => {
	it("should render with tasks link", async () => {
		setup();

		await waitFor(() => {
			expect(screen.getByText(/tasks/i)).toBeInTheDocument();
		});
	});
});
