/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// https://nextjs.org/docs/advanced-features/i18n-routing
	i18n,
	pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
	output: "standalone",
};

module.exports = nextConfig;
