import useSWR, { SWRHook, useSWRConfig } from "swr";
import { AxiosRequestConfig } from "axios";

import { get } from "@core/http/request";

import useErrorHandler from "./useErrorHandler";
import { useCallback, useEffect, useRef } from "react";

/**
 * Take a look at the link below for more info about the parameters.
 * https://swr.vercel.app/docs/api
 *
 * To make it only fetch in server-side you must remove the fetcher in the 2nd arg.
 * https://swr.vercel.app/examples/ssr
 *
 * As default, it is set to be fetched in server-side and client-side.
 * https://swr.vercel.app/docs/with-nextjs#pre-rendering-with-default-data
 */
const useMutableData = (
	url: string | null,
	init?: AxiosRequestConfig,
	options?: Record<string, unknown>
) => {
	const key: [string | null, AxiosRequestConfig?] = [url];

	if (init) key.push(init);

	const swr = useSWR(
		!!url ? key : null,
		([url, init]: [string, AxiosRequestConfig?]) => get(url, init),
		options
	);

	useErrorHandler(swr.error);

	return swr;
};

// https://swr.vercel.app/docs/middleware#keep-previous-result
export function laggy(useSWRNext: SWRHook) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (key, fetcher, config) => {
		// Use a ref to store previous returned data.
		const laggyDataRef = useRef<Record<string, string> | undefined | null>();

		// Actual SWR hook.
		const swr = useSWRNext(key, fetcher, config);

		useEffect(() => {
			// Update ref if data is not undefined.
			if (swr.data !== undefined) {
				laggyDataRef.current = swr.data;
			}
		}, [swr.data]);

		// Expose a method to clear the laggy data, if any.
		const resetLaggy = useCallback(() => {
			laggyDataRef.current = undefined;
		}, []);

		// Fallback to previous data if the current data is undefined.
		const dataOrLaggyData =
			swr.data === undefined ? laggyDataRef.current : swr.data;

		// Is it showing previous data?
		const isLagging =
			swr.data === undefined && laggyDataRef.current !== undefined;

		// Also add a `isLagging` field to SWR.
		return Object.assign({}, swr, {
			data: dataOrLaggyData,
			isLagging,
			resetLaggy,
		});
	};
}

// https://swr.vercel.app/docs/advanced/cache#mutate-multiple-keys-from-regex
export function useMatchMutate() {
	const { cache, mutate } = useSWRConfig();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (matcher, ...args) => {
		if (!(cache instanceof Map)) {
			throw new Error(
				"matchMutate requires the cache provider to be a Map instance"
			);
		}

		const keys = [];

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		for (const key of cache.keys()) {
			if (matcher.test(key)) {
				keys.push(key);
			}
		}

		const mutations = keys.map((key) => mutate(key, ...args));
		return Promise.all(mutations);
	};
}

export default useMutableData;
