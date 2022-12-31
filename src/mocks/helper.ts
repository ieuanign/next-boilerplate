import { env } from "@core/config";
import { response, context } from "msw";

export const res = (...transformers: any[]) => {
	// to make unit test execute faster
	if (env.environment === "test") {
		return response(...transformers);
	}

	// A custom response composition chain that embeds
	// a random realistic server response delay to each `res()` call.
	return response(...transformers, context.delay());
};
