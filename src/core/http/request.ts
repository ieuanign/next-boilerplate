import { nanoid } from "nanoid";
// import { getCookies } from "cookies-next";

import StatusCodes from "./status-codes";
import { Methods } from "./types";

export class HttpError extends Error {
	status: number;
	details: unknown;

	constructor(status: number, message: string, details?: unknown) {
		super(message);
		this.name = "HttpError";
		this.status = status;
		this.details = details;
	}
}

export const jsonHeaders = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

// const authHeaders = (token: string) => ({
// 	Authorization: `Bearer ${token}`,
// });

const toJSON = (res: Response) => res.json();

/**
 * The following will be considered as an error:
 *  - Responses without status code: 200
 *  - Any runtime error that is not fetch realted.
 *
 * X-Request-ID header is a random ID that will be passed onto the server
 * that will able to track error by including the ID in the bug report.
 */
export const baseRequest = (url: RequestInfo, init: RequestInit) => {
	return fetch(url, {
		...init,
		headers: {
			...jsonHeaders,
			...init?.headers,
			"X-Request-ID": nanoid(),
		},
	}).then(async (res: Response) => {
		if (res.ok) {
			return res;
		}

		if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
			throw new HttpError(res.status, res.statusText, await toJSON(res));
		}

		throw new HttpError(res.status, res.statusText);
	});
};

/**
 * GET/POST/PUT/DEL helper methods.
 *
 * Throws error by HTTP status codes.
 *
 * @returns JSON response if success; del method returns nothing.
 */
export const get = (url: RequestInfo, init?: RequestInit) =>
	baseRequest(url, { ...init, method: Methods.GET }).then(toJSON);

export const post = (url: RequestInfo, init?: RequestInit) =>
	baseRequest(url, { ...init, method: Methods.POST }).then(toJSON);

export const put = (url: RequestInfo, init?: RequestInit) =>
	baseRequest(url, { ...init, method: Methods.PUT }).then(toJSON);

export const del = (url: RequestInfo, init?: RequestInit) =>
	baseRequest(url, { ...init, method: Methods.DELETE });

export const getWithToken = (url: RequestInfo, init?: RequestInit) =>
	get(url, {
		...init,
		headers: {
			...init?.headers,
		},
	});
