import { AxiosRequestConfig } from "axios";

export enum Methods {
	OPTIONS = "OPTIONS",
	HEAD = "HEAD",
	GET = "GET",
	POST = "POST",
	PATCH = "PATCH",
	PUT = "PUT",
	DELETE = "DELETE",
}

/**
 * the first index must be a URL
 * the second index musst be axios config or undefined
 */
export type SWRKeyType = [
	string | null,
	AxiosRequestConfig?,
	...Array<unknown>
];
