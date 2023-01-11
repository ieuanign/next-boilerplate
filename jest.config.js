const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	testTimeout: 10000,
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	collectCoverageFrom: [
		"**/*.{ts,tsx}",
		"!**/node_modules/**",
		"!**/mocks/**/*",
		// should be replace with sentry ErrorBoundary component
		"!**/ErrorBoundary.tsx",
		// next.js files
		"!**/_document.page.tsx",
		"!**/middleware.page.ts",
		"!**/useSWR.ts",
	],
	coverageThreshold: {
		"**/*": {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	coveragePathIgnorePatterns: ["<rootDir>/node_modules/"],
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	// moduleDirectories: ["node_modules", "<rootDir>/"],
	testEnvironment: "jest-environment-jsdom",
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},
	moduleNameMapper: {
		"@components/(.*)": ["<rootDir>/src/components/$1"],
		"@core/(.*)": ["<rootDir>/src/core/$1"],
		"@hooks/(.*)": ["<rootDir>/src/hooks/$1"],
		"@mocks/(.*)": ["<rootDir>/src/mocks/$1"],
		"@pages/(.*)": ["<rootDir>/src/pages/$1"],
	},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
