import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Slider } from "./slider";

const TEST_BOOKMARKS = [
  {
    id: "testId1",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    viewState: {},
  },
  {
    id: "testId2",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    viewState: {},
  },
  {
    id: "testId3",
    imageUrl: "testUrl",
    layersLeftSide: [],
    layersRightSide: [],
    viewState: {},
  },
];

const onSelectBookmark = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Slider
      bookmarks={TEST_BOOKMARKS}
      editingMode={false}
      onSelectBookmark={onSelectBookmark}
      {...props}
    />
  );
};

describe("Slider", () => {
  it("Should render slider", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    for (const item of container.childNodes[1].childNodes) {
      expect(item).toHaveStyle("transform: translateX(0px)");
    }
  });

  it("Should click arrow right", () => {
    const { container } = callRender(renderWithTheme);
    const arrowRight = container.lastChild;
    userEvent.click(arrowRight);

    for (const item of container.childNodes[1].childNodes) {
      expect(item).toHaveStyle("transform: translateX(-144px)");
    }
  });

  it("Should click arrow left", () => {
    const { container } = callRender(renderWithTheme);
    const arrowRight = container.lastChild;
    const arrowLeft = container.firstChild;
    userEvent.click(arrowRight);
    userEvent.click(arrowRight);
    userEvent.click(arrowRight);
    userEvent.click(arrowLeft);

    for (const item of container.childNodes[1].childNodes) {
      expect(item).toHaveStyle("transform: translateX(-112px)");
    }
  });

  it("Should select slider item", () => {
    const { container } = callRender(renderWithTheme);
    const sliderItem = container.childNodes[1].firstChild;

    userEvent.click(sliderItem);
    expect(onSelectBookmark).toHaveBeenCalled();
  });
});
