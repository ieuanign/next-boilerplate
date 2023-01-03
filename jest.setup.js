// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "whatwg-fetch";
import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/react";

import { server } from "./src/mocks/server";
import { db, seed, drop } from "./src/mocks/db";

configure({ asyncUtilTimeout: 5000 });

beforeAll(() => {
	server.listen();
});

beforeEach(() => {
	drop(db);
	seed(db);
});

afterEach(() => {
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
