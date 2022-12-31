import getConfig from "next/config";

interface PublicRuntimeConfig {
	environment: string;
	apiHost: string;
	mockAPI: boolean;
}

const {
	publicRuntimeConfig: env,
}: { publicRuntimeConfig: PublicRuntimeConfig } = getConfig();

const apiBase = (pathname: string) => {
	return new URL(pathname, env.apiHost).toString();
};

const staticPath = (filename: string) => {
	if (filename.startsWith("/")) {
		filename = filename.substring(1);
	}

	return `/static/${filename}`;
};

export { env, apiBase, staticPath };
