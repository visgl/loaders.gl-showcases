import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Header } from "./header";
import { screen } from "@testing-library/react";
import { useAppLayout } from "../../utils/hooks/layout";

jest.mock("../../utils/hooks/layout");
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: "hellp-world",
  })),
  Link: ({ children }) => {
    const LinkMock = "desktop-link-mock";

    return (
      // @ts-expect-error - mock component
      <LinkMock>{children}</LinkMock>
    );
  },
}));
jest.mock("./desktop-header-content", () => ({
  __esModule: true,
  DesktopHeaderContent: () => {
    const DesktopHeader = "desktop-header-mock";
    // @ts-expect-error - mock component
    return <DesktopHeader>Desktop Header</DesktopHeader>;
  },
}));
jest.mock("./non-desktop-header-content", () => ({
  __esModule: true,
  NonDesktopHeaderContent: () => {
    const NonDesktopHeader = "non-desktop-header-mock";
    // @ts-expect-error - mock component
    return <NonDesktopHeader>Non Desktop Header</NonDesktopHeader>;
  },
}));

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const setThemeMock = jest.fn();
const onHelpClickMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Header
      theme={0}
      setTheme={setThemeMock}
      showHelp={false}
      onHelpClick={onHelpClickMock}
      {...props}
    />
  );
};

describe("Header", () => {
  it("Should render Desktop Header", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");

    const { container } = callRender(renderWithTheme);

    const logo = screen.getByText("I3S Explorer");
    const desktopHeader = screen.getByText("Desktop Header");
    const nonDesktopHeader = screen.queryByText("Non Desktop Header");

    expect(container).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(desktopHeader).toBeInTheDocument();
    expect(nonDesktopHeader).toBe(null);
  });

  it("Should render NonDesktop Header", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container } = callRender(renderWithTheme, { theme: 1 });
    const logo = screen.getByText("I3S Explorer");
    const desktopHeader = screen.queryByText("Desktop Header");
    const nonDesktopHeader = screen.getByText("Non Desktop Header");

    expect(container).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(desktopHeader).toBe(null);
    expect(nonDesktopHeader).toBeInTheDocument();
  });
});
