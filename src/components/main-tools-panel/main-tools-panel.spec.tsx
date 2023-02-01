import userEvent from "@testing-library/user-event";
import { ActiveButton } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MainToolsPanel } from "./main-tools-panel";

const onChangeMock = jest.fn();
const onShowBookmarksChangeMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <MainToolsPanel
      id={""}
      activeButton={ActiveButton.none}
      onChange={onChangeMock}
      onShowBookmarksChange={onShowBookmarksChangeMock}
      {...props}
    />
  );
};

describe("Main Tools Panel", () => {
  it("Should render Main Tools Panel and show layers options by default", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const layersButton = document.querySelector('#layers-options-tab')!;

    expect(layersButton).toBeInTheDocument();
    userEvent.click(layersButton);

    expect(onChangeMock).toBeCalledWith(ActiveButton.options);
  });

  it("Should render Main Tools Panel with all possible buttons", () => {
    const { container } = callRender(renderWithTheme, {
      showComparisonSettings: true,
      showBookmarks: true,
      showDebug: true,
      showValidator: true,
      bookmarksActive: true,
    });

    expect(container).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const layersButton = document.querySelector('#layers-options-tab')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const settingsButton = document.querySelector('#settings-tab')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const memoryButton = document.querySelector('#memory-usage-tab')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validatorButton = document.querySelector('#validator-tab')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const debugButton = document.querySelector('#debug-panel-tab')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const bookmarksButton = document.querySelector('#bookmarks-tab')!;

    expect(layersButton).toBeInTheDocument();

    userEvent.click(layersButton);
    expect(onChangeMock).toBeCalledWith(ActiveButton.options);

    userEvent.click(settingsButton);
    expect(onChangeMock).toBeCalledWith(ActiveButton.settings);

    userEvent.click(memoryButton);
    expect(onChangeMock).toBeCalledWith(ActiveButton.memory);

    userEvent.click(validatorButton);
    expect(onChangeMock).toBeCalledWith(ActiveButton.validator);

    userEvent.click(debugButton);
    expect(onChangeMock).toBeCalledWith(ActiveButton.debug);

    userEvent.click(bookmarksButton);
    expect(onShowBookmarksChangeMock).toHaveBeenCalled();
  });

});
