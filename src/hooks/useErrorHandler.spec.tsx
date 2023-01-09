import { render, screen, waitFor } from "@testing-library/react";
import useErrorHandler from "./useErrorHandler";
import ErrorBoundary from "@components/ErrorBoundary";
import { useEffect } from "react";

const fallback = ({ error }) => {
	return <div>error: {error.message}</div>;
};

const SetError = ({ mockError }: { mockError: any }) => {
	const handleError = useErrorHandler();

	useEffect(() => {
		handleError(mockError);
	}, [handleError, mockError]);

	return <div>error example</div>;
};

const GivenError = ({ mockError }: { mockError: any }) => {
	useErrorHandler(mockError);

	return <div>error example</div>;
};

describe("useErrorHandler", () => {
	it("should handle givenError", async () => {
		render(
			<ErrorBoundary FallbackComponent={fallback}>
				<GivenError mockError={new Error("given error")} />
			</ErrorBoundary>
		);

		await waitFor(() => {
			expect(screen.getByText("error: given error"));
		});
	});

	it("should handle setError", async () => {
		render(
			<ErrorBoundary FallbackComponent={fallback}>
				<SetError mockError={new Error("set error")} />
			</ErrorBoundary>
		);

		await waitFor(() => {
			expect(screen.getByText("error: set error"));
		});
	});
});
