import { type RenderResult, screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { NonDesktopHeaderContent } from "./non-desktop-header-content";
import userEvent from "@testing-library/user-event";
import type { ReactChildren } from "react";

jest.mock("../../constants/common", () => ({
  GITHUB_LINK: "https://git-hub-test",
}));
jest.mock("./theme-toggler", () => ({
  ThemeToggler: ({ setTheme }: { setTheme: () => void }) => {
    const ToggleMock = "theme-toggle-non-desktop";
    return (
      // @ts-expect-error - mock component
      <ToggleMock onClick={setTheme} data-testid="theme-toggler-non-desktop" />
    );
  },
}));

jest.mock("react-router-dom", () => ({
  Link: ({
    children,
    active,
  }: {
    children: ReactChildren;
    active: boolean;
  }) => {
    const LinkMock = "desktop-link-mock";

    return (
      // @ts-expect-error - mock component
      <LinkMock style={{ color: active ? "rgb(96, 194, 164)" : "black" }}>
        {children}
      </LinkMock>
    );
  },
}));

const setThemeMock = jest.fn();
const onHelpClickMock = jest.fn();

const callRender = (renderFunc, props = {}): RenderResult => {
  return renderFunc(
    <NonDesktopHeaderContent
      onHelpClick={onHelpClickMock}
      theme={0}
      setTheme={setThemeMock}
      pathname={"/dashboard"}
      githubIcon={"GithubIcon"}
      {...props}
    />
  );
};

describe("Non Desktop header content", () => {
  it("Should render Header", async () => {
    const { container } = callRender(renderWithTheme);

    const burger = screen.getByTestId("burger-menu-non-desktop");

    expect(container).toBeInTheDocument();
    expect(burger).toBeInTheDocument();

    await userEvent.click(burger);
    const closeIcon = screen.getByTestId("close-header-menu-non-desktop");
    expect(closeIcon).toBeInTheDocument();

    const menuItems = [
      screen.getByText("Home"),
      screen.getByText("Viewer"),
      screen.getByText("Debug"),
      screen.getByText("Compare"),
      screen.getByText("GitHub"),
      screen.getByText("Help"),
      screen.getByText("Theme"),
      screen.getByTestId("theme-toggler-non-desktop"),
    ];

    menuItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("theme-toggler-non-desktop"));
    expect(setThemeMock).toBeCalled();

    await userEvent.click(screen.getByText("Compare"));

    const across = screen.getByText("Across Layers");
    const within = screen.getByText("Within a Layer");

    expect(across).toBeInTheDocument();
    expect(within).toBeInTheDocument();

    await userEvent.click(screen.getByText("Help"));
    expect(onHelpClickMock).toBeCalled();

    await userEvent.click(closeIcon);
  });

  it("Should change active link to /viewer", async () => {
    const { container } = callRender(renderWithTheme, {
      pathname: "/viewer",
      theme: 1,
    });
    expect(container).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("burger-menu-non-desktop"));
    expect(screen.getByText("Viewer")).toHaveStyle("color: rgb(96, 194, 164)");
  });

  it("Should change active link to /debug", async () => {
    const { container } = callRender(renderWithTheme, {
      pathname: "/debug",
      theme: 0,
    });
    expect(container).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("burger-menu-non-desktop"));
    expect(screen.getByText("Debug")).toHaveStyle("color: rgb(96, 194, 164)");
  });

  it("Should change active link to /compare-across-layers", async () => {
    const { container } = callRender(renderWithTheme, {
      pathname: "/compare-across-layers",
      theme: 1,
    });
    expect(container).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("burger-menu-non-desktop"));
    expect(screen.getByText("Compare")).toHaveStyle("color: rgb(96, 194, 164)");

    await userEvent.click(screen.getByText("Compare"));
    expect(screen.getByText("Across Layers")).toHaveStyle(
      "color: rgb(96, 194, 164)"
    );
  });

  it("Should change active link to /compare-within-layer", async () => {
    const { container } = callRender(renderWithTheme, {
      pathname: "/compare-within-layer",
      theme: 0,
    });
    expect(container).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("burger-menu-non-desktop"));
    expect(screen.getByText("Compare")).toHaveStyle("color: rgb(96, 194, 164)");
    await userEvent.click(screen.getByText("Compare"));
    expect(screen.getByText("Within a Layer")).toHaveStyle(
      "color: rgb(96, 194, 164)"
    );
  });
});
