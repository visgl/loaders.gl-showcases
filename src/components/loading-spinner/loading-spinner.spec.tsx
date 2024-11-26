import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { LoadingSpinner } from "./loading-spinner";

describe("Loading Spinner", () => {
  it("Should render spinner", () => {
    const { container } = renderWithTheme(<LoadingSpinner />) ?? {};
    expect(container).not.toBeUndefined();
    const spinner = screen.getByTestId("loading-spinner");
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle("animation: rotation 2s infinite linear");
  });
});
