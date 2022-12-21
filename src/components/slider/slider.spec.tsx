import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Slider } from "./slider";
import { SliderType } from "../../types";

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

const onSelect = jest.fn();
const onDeleteBookmark = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Slider
      selectedItemId="testId2"
      data={TEST_BOOKMARKS}
      editingMode={false}
      sliderType={SliderType.Bookmarks}
      onSelect={onSelect}
      onDelete={onDeleteBookmark}
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
    expect(onSelect).toHaveBeenCalled();
  });

  it("Should click arrow bottom", () => {
    const { container } = callRender(renderWithTheme, {
      sliderType: SliderType.Floors,
    });
    const arrowBottom = container.lastChild;
    userEvent.click(arrowBottom);
    expect(onSelect).toHaveBeenCalled();
  });

  it("Should click arrow left", () => {
    const { container } = callRender(renderWithTheme);
    const arrowLeft = container.firstChild;
    userEvent.click(arrowLeft);
    expect(onSelect).toHaveBeenCalled();
  });

  it("Should click arrow top", () => {
    const { container } = callRender(renderWithTheme, {
      sliderType: SliderType.Floors,
    });
    const arrowTop = container.firstChild;
    userEvent.click(arrowTop);
    expect(onSelect).toHaveBeenCalled();
  });

  it("Should select slider item", () => {
    const { container } = callRender(renderWithTheme);
    const sliderItem = container.childNodes[1].firstChild;

    userEvent.click(sliderItem);
    expect(onSelect).toHaveBeenCalled();
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
