import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import Tasks, { getServerSideProps } from "./index.page";

import { server } from "@mocks/server";
import StatusCodes from "@core/http/status-codes";
import { apiBase } from "@core/config";

import { init, getContext } from "@core/test-utils";

const setup = init(Tasks, {
	pathname: "/en/tasks",
});

describe("getServerSideProps", () => {
	const defaultContext = getContext("/en/tasks");

	it("with fallback data", async () => {
		const ssrProps = await getServerSideProps(defaultContext);

		// show fallback data
		expect(ssrProps).toMatchSnapshot();
	});

	it("without fallback data", async () => {
		server.use(
			rest.get(apiBase("/tasks"), async (_, res, ctx) =>
				res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR))
			)
		);

		const ssrProps = await getServerSideProps(defaultContext);

		// empty fallback
		expect(ssrProps).toMatchSnapshot();
	});

	// for default ssrLangProps utility
	it("without locale", async () => {
		const customContext = {
			...defaultContext,
			locale: undefined,
		};

		const ssrProps = await getServerSideProps(customContext);

		// show fallback data
		expect(ssrProps).toMatchSnapshot();
	});
});

const fallback = {
	'"@"http://localhost:3080/tasks","': {
		data: [
			{
				id: "63b8bb76-cf6a-4972-a65a-b5730b69ba27",
				title: "quidem expedita labore",
			},
			{
				id: "b86a4d7b-b95b-465a-9533-4fac1c606272",
				title: "dolores veritatis voluptatum",
			},
			{
				id: "e6cebf88-7991-4457-aade-4177f3869c17",
				title: "vel inventore quaerat",
			},
			{
				id: "48650456-bade-4487-a49d-94a8d215ce32",
				title: "assumenda quod unde",
			},
			{
				id: "56034668-b8f0-45ac-890b-e246c355d80a",
				title: "fugiat quibusdam expedita",
			},
			{
				id: "2e57a3d4-8dd8-46a5-85d2-6d0578899840",
				title: "quos beatae adipisci",
			},
			{
				id: "e5384784-e4f9-44b9-8c56-abd229fd5fd1",
				title: "repudiandae doloribus animi",
			},
			{
				id: "3e7e8310-4de3-4907-9c7b-806b4d62ccc4",
				title: "quae vel alias",
			},
		],
		error: null,
		status: "ok",
	},
};

describe("Tasks", () => {
	const globalConsole = {
		...global.console,
	};

	beforeAll(() => {
		global.console = {
			...global.console,
			// disable console.error to print up error in unit test
			error: jest.fn(),
		};
	});

	afterAll(() => {
		global.console = {
			...globalConsole,
		};
	});

	it("renders title", () => {
		setup();

		expect(screen.getByText("To Do List")).toBeInTheDocument();
	});

	it("renders with fallback data", async () => {
		setup({
			pageProps: {
				fallback,
			},
		});

		await waitFor(() => {
			expect(screen.getByText("quidem expedita labore")).toBeInTheDocument();
			expect(screen.getAllByText("delete")).toHaveLength(8);
		});
	});

	it("renders error boundary", async () => {
		server.use(
			rest.get(apiBase("/tasks"), async (_, res, ctx) =>
				res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR))
			)
		);

		setup();

		await waitFor(() => {
			expect(
				screen.getByText(/Error Caught by ErrorBoundary/)
			).toBeInTheDocument();
		});
	});

	describe("delete", () => {
		it("succeed", async () => {
			const { userEvent } = setup();

			await waitFor(() => {
				expect(screen.getByText("quidem expedita labore")).toBeInTheDocument();
				expect(screen.getAllByText("delete")).toHaveLength(8);
			});

			await userEvent.click(screen.getAllByText("delete")[0]);

			await waitFor(() => {
				expect(
					screen.queryByText("quidem expedita labore")
				).not.toBeInTheDocument();
				expect(screen.getAllByText("delete")).toHaveLength(7);
			});
		});

		it("failed", async () => {
			server.use(
				rest.delete(apiBase("/tasks/:id"), async (_, res, ctx) =>
					res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR))
				)
			);

			const { userEvent } = setup();

			await waitFor(() => {
				expect(screen.getAllByText("delete")).toHaveLength(8);
				expect(screen.getByText("quidem expedita labore")).toBeInTheDocument();
			});

			await userEvent.click(screen.getAllByText("delete")[0]);

			await waitFor(() => {
				expect(screen.getByText("quidem expedita labore")).toBeInTheDocument();
				expect(screen.getAllByText("delete")).toHaveLength(8);
				expect(console.error).toHaveBeenCalled();
			});
		});
	});

	describe("add", () => {
		it("succeed", async () => {
			const { userEvent } = setup();

			userEvent.type(
				screen.getByPlaceholderText("Enter task name"),
				"Swimming"
			);

			await waitFor(() => {
				expect(screen.getByPlaceholderText("Enter task name")).toHaveValue(
					"Swimming"
				);
			});

			await userEvent.click(screen.getByText("Add Task"));

			await waitFor(() => {
				expect(screen.getByText("Swimming")).toBeInTheDocument();
				expect(screen.getAllByText("delete")).toHaveLength(9);
				expect(screen.getByPlaceholderText("Enter task name")).toHaveValue("");
			});
		});

		it("failed", async () => {
			server.use(
				rest.post(apiBase("/tasks"), async (_, res, ctx) =>
					res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR))
				)
			);

			const { userEvent } = setup();

			userEvent.type(
				screen.getByPlaceholderText("Enter task name"),
				"Swimming"
			);

			await waitFor(() => {
				expect(screen.getByPlaceholderText("Enter task name")).toHaveValue(
					"Swimming"
				);
			});

			await userEvent.click(screen.getByText("Add Task"));

			await waitFor(() => {
				expect(screen.queryByText("Swimming")).not.toBeInTheDocument();
				expect(screen.getAllByText("delete")).toHaveLength(8);
				expect(screen.getByPlaceholderText("Enter task name")).toHaveValue(
					"Swimming"
				);
			});
		});
	});
});
