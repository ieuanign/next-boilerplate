import { useState } from "react";

/**
 * credit to: https://github.com/bvaughn/react-error-boundary/blob/master/src/index.tsx#L161-L165
 */

const useErrorHandler = (givenError?: unknown) => {
	const [error, setError] = useState(null);

	if (givenError != null) throw givenError;
	if (error != null) throw error;

	return setError;
};

export default useErrorHandler;
