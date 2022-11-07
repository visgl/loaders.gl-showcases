import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Slider } from "./slider";

const TEST_BOOKMARKS = [
  {
    id: "testId1",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
  {
    id: "testId2",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
  {
    id: "testId3",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    activeLayersIdsLeftSide: [],
    activeLayersIdsRightSide: [],
    viewState: {},
  },
];

const onSelectBookmark = jest.fn();
const onDeleteBookmark = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Slider
      selectedBookmarkId="testId2"
      bookmarks={TEST_BOOKMARKS}
      editingMode={false}
      onSelectBookmark={onSelectBookmark}
      onDeleteBookmark={onDeleteBookmark}
      {...props}
    />
  );
};

describe("Slider", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollBy = jest.fn();
  it("Should render slider", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();
    const item = container.childNodes[1].childNodes[1];
    expect(item).toHaveStyle("border: 2px solid #605DEC");
    expect(container.childNodes[1].childNodes.length).toBe(3);
  });

  it("Should click arrow right", () => {
    const { container } = callRender(renderWithTheme);
    const arrowRight = container.lastChild;
    userEvent.click(arrowRight);
    expect(onSelectBookmark).toHaveBeenCalled();
  });

  it("Should click arrow left", () => {
    const { container } = callRender(renderWithTheme);
    const arrowLeft = container.firstChild;
    userEvent.click(arrowLeft);
    expect(onSelectBookmark).toHaveBeenCalled();
  });

  it("Should select slider item", () => {
    const { container } = callRender(renderWithTheme);
    const sliderItem = container.childNodes[1].firstChild;

    userEvent.click(sliderItem);
    expect(onSelectBookmark).toHaveBeenCalled();
  });

  it("Should delete slider item", () => {
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const sliderItem = container.childNodes[1].firstChild;

    userEvent.hover(sliderItem);
    const deleteButton = sliderItem.firstChild;
    userEvent.click(deleteButton);
    const confirmButton = sliderItem.firstChild;
    userEvent.click(confirmButton);
    expect(onDeleteBookmark).toHaveBeenCalled();
  });
});
