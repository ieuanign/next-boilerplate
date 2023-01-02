import { render, screen } from "@testing-library/react";
import Tasks from "./index.page";

describe("Tasks", () => {
	it("renders title", () => {
		render(<Tasks fallback={{}} />);

		expect(screen.getByText("To Do List")).toBeInTheDocument();
	});
});
