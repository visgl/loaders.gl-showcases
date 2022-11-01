import { HelpPanel } from "./help-panel";
import { DesktopHelpPanel } from "./desktop-help-panel";
import { NonDesktopHelpPanel } from "./non-desktop-help-panel";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";

jest.mock("./desktop-help-panel");
jest.mock("./non-desktop-help-panel");
jest.mock("./shotrcuts-config", () => ({
  getShortcuts: jest.fn().mockImplementation(() => ({
    0: [],
    1: [],
    2: [],
  })),
}));

const DesktopHelpPanelMock = DesktopHelpPanel as unknown as jest.Mocked<any>;
const NonDesktopHelpPanelMock =
  NonDesktopHelpPanel as unknown as jest.Mocked<any>;

jest.mock("../../utils/hooks/layout", () => ({
  getCurrentLayoutProperty: jest.fn(),
  useAppLayout: jest
    .fn()
    .mockImplementationOnce(() => {
      return "desktop";
    })
    .mockImplementationOnce(() => {
      return "mobile";
    }),
}));

beforeAll(() => {
  DesktopHelpPanelMock.mockImplementation(() => <div></div>);
  NonDesktopHelpPanelMock.mockImplementation(() => <div></div>);
});

describe("Help Panel", () => {
  it("Should render Desktop Help Panel", () => {
    const onClose = jest.fn();
    const { container } = renderWithTheme(<HelpPanel onClose={onClose} />);

    expect(container).toBeInTheDocument();
    expect(DesktopHelpPanelMock).toHaveBeenCalled();
    expect(NonDesktopHelpPanelMock).not.toHaveBeenCalled();
  });

  it("Should render Mobile Help Panel", () => {
    const onClose = jest.fn();
    renderWithTheme(<HelpPanel onClose={onClose} />);
    expect(NonDesktopHelpPanelMock).toHaveBeenCalled();
    expect(DesktopHelpPanelMock).not.toHaveBeenCalled();
  });
});
