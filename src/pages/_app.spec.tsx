import { screen, waitFor } from "@testing-library/react";

import { EmptyLayout } from "@components/Layout";

import { init } from "@core/test-utils";

const DefaultLayoutComponent = ({ text }: { text: string }) => {
	return <div>fake component: {text}</div>;
};

const EmptyLayoutComponent = ({ text }: { text: string }) => {
	return <div>fake component: {text}</div>;
};

EmptyLayoutComponent.getLayout = EmptyLayout;

const defaultLayout = init(DefaultLayoutComponent);
const emptyLayout = init(EmptyLayoutComponent);

describe("_app", () => {
	describe("Layout", () => {
		it("should render with default layout", async () => {
			defaultLayout({
				pageProps: {
					text: "Default Layout",
				},
			});

			await waitFor(() => {
				expect(screen.getByText("header")).toBeInTheDocument();
				expect(screen.getByText("nav")).toBeInTheDocument();
				expect(screen.getByText("footer")).toBeInTheDocument();
				expect(screen.getByText(/Default Layout/i)).toBeInTheDocument();
			});
		});
		it("should render with empty layout", async () => {
			emptyLayout({
				pageProps: {
					text: "Empty Layout",
				},
			});

			await waitFor(() => {
				expect(screen.queryByText("header")).not.toBeInTheDocument();
				expect(screen.queryByText("nav")).not.toBeInTheDocument();
				expect(screen.queryByText("footer")).not.toBeInTheDocument();
				expect(screen.getByText(/Empty Layout/i)).toBeInTheDocument();
			});
		});
	});
});
