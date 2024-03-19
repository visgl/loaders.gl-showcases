import userEvent from "@testing-library/user-event";
import { ActiveButton } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { MainToolsPanel } from "./main-tools-panel";
import { type RenderResult } from "@testing-library/react";

const onChangeMock = jest.fn();
const onShowBookmarksChangeMock = jest.fn();

const callRender = (renderFunc, props = {}): RenderResult => {
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
  it("Should render Main Tools Panel and show layers options by default", async () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const layersButton = document.querySelector("#layers-options-tab")!;

    expect(layersButton).toBeInTheDocument();
    await userEvent.click(layersButton);

    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.options);
  });

  it("Should render Main Tools Panel with all possible buttons", async () => {
    const { container } = callRender(renderWithTheme, {
      showComparisonSettings: true,
      showBookmarks: true,
      showDebug: true,
      showValidator: true,
      bookmarksActive: true,
    });

    expect(container).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const layersButton = document.querySelector("#layers-options-tab")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const settingsButton = document.querySelector("#settings-tab")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const memoryButton = document.querySelector("#memory-usage-tab")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validatorButton = document.querySelector("#validator-tab")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const debugButton = document.querySelector("#debug-panel-tab")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const bookmarksButton = document.querySelector("#bookmarks-tab")!;

    expect(layersButton).toBeInTheDocument();

    await userEvent.click(layersButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.options);

    await userEvent.click(settingsButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.settings);

    await userEvent.click(memoryButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.memory);

    await userEvent.click(validatorButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.validator);

    await userEvent.click(debugButton);
    expect(onChangeMock).toHaveBeenCalledWith(ActiveButton.debug);

    await userEvent.click(bookmarksButton);
    expect(onShowBookmarksChangeMock).toHaveBeenCalled();
  });
});
