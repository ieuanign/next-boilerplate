import { env } from "@core/config";

const initMocks = async () => {
	if (["development", "test"].includes(env.environment)) {
		if (typeof window === "undefined") {
			const { server } = await import("./server");
			server.listen();
		} else {
			const { worker } = require("./browser");

			worker.start({
				onUnhandledRequest(
					request: { url: { pathname: string } },
					print: { warning: () => void }
				) {
					// don't need to warn these unhandled URLs
					if (
						request.url.pathname.startsWith("/_next") ||
						request.url.pathname.startsWith("/static")
					) {
						return;
					}

					print.warning();
				},
			});
		}
	}
};

export { initMocks };
