const { publicRuntimeConfig } = require("../../next.config");

const getConfig = () => ({
	publicRuntimeConfig,
	serverRuntimeConfig: publicRuntimeConfig,
});

export default getConfig;
