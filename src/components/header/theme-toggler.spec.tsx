import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { ThemeToggler } from "./theme-toggler";
import userEvent from "@testing-library/user-event";

const setThemeMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ThemeToggler theme={0} setTheme={setThemeMock} {...props} />
  );
};

describe("Theme Toggler", () => {
  it("Should render Dark Mode Toggler", async () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("toggle-theme-button"));
    expect(setThemeMock).toHaveBeenCalledWith(1);
  });

  it("Should render Light Mode Toggler", async () => {
    const { container } = callRender(renderWithTheme, { theme: 1 });
    expect(container).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("toggle-theme-button"));
    expect(setThemeMock).toHaveBeenCalledWith(0);
  });
});
