import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DesktopHeaderContent } from "./desktop-header-content";

jest.mock("react-router-dom", () => ({
  Link: ({ children, active }) => {
    const LinkMock = "desktop-link-mock";

    return (
      // @ts-expect-error - mock component
      <LinkMock style={{ color: active ? "rgb(96, 194, 164)" : "black" }}>
        {children}
      </LinkMock>
    );
  },
}));

jest.mock("../../utils/hooks/use-click-outside-hook", () => ({
  useClickOutside: jest.fn(),
}));

jest.mock("../../constants/common", () => ({
  GITHUB_LINK: "https://git-hub-test",
}));

jest.mock("./theme-toggler", () => ({
  ThemeToggler: ({ setTheme }) => {
    const ToggleMock = "theme-toggle-desktop";
    return (
      // @ts-expect-error - mock component
      <ToggleMock onClick={setTheme} data-testid="theme-toggler-desktop" />
    );
  },
}));

const setThemeMock = jest.fn();
const onHelpClickMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <DesktopHeaderContent
      onHelpClick={onHelpClickMock}
      theme={0}
      setTheme={setThemeMock}
      pathname={"/dashboard"}
      githubIcon={"GithubIcon"}
      {...props}
    />
  );
};

describe("Desktop header content", () => {
  it("Should render Desktop Header", () => {
    const { container } = callRender(renderWithTheme);

    const home = screen.getByText("Home");
    const viewer = screen.getByText("Viewer");
    const debug = screen.getByText("Debug");
    const compare = screen.getByText("Compare");
    const gitHub = screen.getByText("GitHub");
    const helpButton = screen.getByText("Help");
    const themeToggler = screen.getByTestId("theme-toggler-desktop");

    expect(container).toBeInTheDocument();
    expect(home).toBeInTheDocument();
    expect(viewer).toBeInTheDocument();
    expect(debug).toBeInTheDocument();
    expect(compare).toBeInTheDocument();
    expect(gitHub).toBeInTheDocument();
    expect(helpButton).toBeInTheDocument();
    expect(themeToggler).toBeInTheDocument();

    userEvent.click(themeToggler);
    expect(setThemeMock).toBeCalled();

    userEvent.click(helpButton);
    expect(onHelpClickMock).toBeCalled();
  });

  it("Should show Compare Menu Items", () => {
    callRender(renderWithTheme, { theme: 1 });

    const compare = screen.getByText("Compare");
    userEvent.click(compare);

    const across = screen.getByText("Across Layers");
    const within = screen.getByText("Within a Layer");

    expect(across).toBeInTheDocument();
    expect(within).toBeInTheDocument();
  });

  it("Should show active Viewer mode", () => {
    callRender(renderWithTheme, { pathname: "/viewer" });
    const viewer = screen.getByText("Viewer");
    expect(viewer).toHaveStyle(`color: rgb(96, 194, 164)`);
  });

  it("Should show active Debug mode", () => {
    callRender(renderWithTheme, { pathname: "/debug" });
    const debug = screen.getByText("Debug");
    expect(debug).toHaveStyle(`color: rgb(96, 194, 164)`);
  });

  it("Should show active Across Layers mode", () => {
    callRender(renderWithTheme, { pathname: "/compare-across-layers" });
    const compare = screen.getByText("Compare");
    userEvent.click(compare);

    const across = screen.getByText("Across Layers");
    expect(across).toHaveStyle(`color: rgb(96, 194, 164)`);
  });

  it("Should show active Within a Layer mode", () => {
    callRender(renderWithTheme, { pathname: "/compare-within-layer" });
    const compare = screen.getByText("Compare");
    userEvent.click(compare);

    const within = screen.getByText("Within a Layer");
    expect(within).toHaveStyle(`color: rgb(96, 194, 164)`);
  });
});
