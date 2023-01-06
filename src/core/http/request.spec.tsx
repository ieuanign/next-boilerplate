import { rest } from "msw";
import {
	authHeaders,
	get,
	post,
	put,
	del,
	getServerSideFallbacks,
	HttpError,
} from "./request";

import { server } from "@mocks/server";
import StatusCodes from "@core/http/status-codes";
import { apiBase } from "@core/config";

describe("getServerSideFallbacks", () => {
	it("should only return the responses of successful requests", async () => {
		server.use(
			rest.get(apiBase("/api/success"), (req, res, ctx) =>
				res(ctx.status(StatusCodes.OK), ctx.json({ status: 200 }))
			)
		);
		server.use(
			rest.get(apiBase("/api/success-2"), (req, res, ctx) =>
				res(ctx.status(StatusCodes.OK), ctx.json({ status: 200 }))
			)
		);
		server.use(
			rest.get(apiBase("/api/fail"), (req, res, ctx) =>
				res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR))
			)
		);

		const res = await getServerSideFallbacks([
			[apiBase("/api/success")],
			[apiBase("/api/success-2")],
			[apiBase("/api/fail")],
		]);

		expect(res).toMatchSnapshot();
	});
});

describe("Request", () => {
	const methods: Record<string, Function> = { get, post, put, delete: del };

	describe.each(Object.keys(methods))("%s should", (key: string) => {
		const method = methods[key];
		const methodKey = key as "get" | "post" | "put" | "delete";
		it("return json response on success", async () => {
			server.use(
				rest[methodKey](apiBase("/api/success"), (req, res, ctx) =>
					res(ctx.status(StatusCodes.OK), ctx.json({ status: 200 }))
				)
			);
			const res = await method(apiBase("/api/success"));
			expect(res).toMatchSnapshot();
		});

		it("throw http error if response status is not success", async () => {
			server.use(
				rest[methodKey as "get"](apiBase("/api/fail"), (req, res, ctx) =>
					res(ctx.status(StatusCodes.BAD_REQUEST))
				)
			);

			const res = () => method(apiBase("/api/fail"));
			await expect(res).rejects.toThrow(
				new HttpError(StatusCodes.BAD_REQUEST, "Bad Request")
			);
		});
	});

	it("get with auth header should return response", async () => {
		server.use(
			rest.get(apiBase("/api/token"), (req, res, ctx) =>
				res(
					ctx.status(
						req.headers.get("Authorization")
							? StatusCodes.OK
							: StatusCodes.FORBIDDEN
					),
					ctx.json({
						status: req.headers.get("Authorization")
							? StatusCodes.OK
							: StatusCodes.FORBIDDEN,
					})
				)
			)
		);

		const res = await get(apiBase("/api/token"), {
			headers: authHeaders(),
		});

		expect(res.status).toEqual(StatusCodes.OK);
	});
});
