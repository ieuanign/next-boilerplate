import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { nanoid } from "nanoid";
import { getCookie } from "cookies-next";

import { DEFAULT_TIMEOUT_MS, TOKEN_KEY } from "@core/const";
import StatusCodes from "./status-codes";
import { Methods, SWRKeyType } from "./types";
import { unstable_serialize } from "swr";

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

export const authHeaders = () => {
	const token = getCookie(TOKEN_KEY);

	return {
		Authorization: `Bearer ${token}`,
	};
};

/**
 * use fetcher.interceptors.request to intercept the request
 * and do something like refresh token
 */
const instance = axios.create();

instance.defaults.timeout = DEFAULT_TIMEOUT_MS;

/**
 * The following will be considered as an error:
 *  - Responses without status code: 200
 *  - Any runtime error that is not fetch realted.
 *
 * X-Request-ID header is a random ID that will be passed onto the server
 * that will able to track error by including the ID in the bug report.
 */
export const baseRequest = (url: string, init: AxiosRequestConfig) => {
	return instance
		.request({
			url,
			...init,
			headers: {
				...jsonHeaders,
				...init.headers,
				// why we need it: https://stackoverflow.com/questions/25433258/what-is-the-x-request-id-http-header
				// "X-Request-Id": nanoid(),
			},
		})
		.then(async (res: AxiosResponse) => res.data)
		.catch((res) => {
			if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
				throw new HttpError(res.status, res.statusText, res);
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
export const get = (
	url: string,
	init?: AxiosRequestConfig
): Promise<Response> => baseRequest(url, { ...init, method: Methods.GET });

export const post = (
	url: string,
	init?: AxiosRequestConfig
): Promise<Response> => baseRequest(url, { ...init, method: Methods.POST });

export const put = (
	url: string,
	init?: AxiosRequestConfig
): Promise<Response> => baseRequest(url, { ...init, method: Methods.PUT });

export const del = (
	url: string,
	init?: AxiosRequestConfig
): Promise<Response> => baseRequest(url, { ...init, method: Methods.DELETE });

/**
 * For Server-Side Rendering (SSR), you need to implement
 * fallback.
 * https://swr.vercel.app/blog/swr-v1#fallback-data
 */

export const getServerSideFallbacks = async (requests: SWRKeyType[]) => {
	const results = await Promise.allSettled(
		requests.map(([url, init]) => {
			if (url) {
				return get(url, {
					...init,
					headers: {
						...init?.headers,
					},
				});
			}
		})
	);

	return results.reduce(
		(prev, result, index) => ({
			...prev,
			...(result.status === "fulfilled"
				? { [unstable_serialize(requests[index])]: result.value }
				: undefined),
		}),
		{}
	);
};
