import userEvent from "@testing-library/user-event";
import { useAppLayout } from "../../utils/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BookmarksPanel } from "./bookmarks-panel";
import { dragAndDropText } from "./upload-panel";

jest.mock("../../utils/layout");

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

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onSelectBookmark = jest.fn();
const onClose = jest.fn();
const onCollapsed = jest.fn();
const onAddBookmark = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BookmarksPanel
      id="test-bookmarks"
      bookmarks={TEST_BOOKMARKS}
      onSelectBookmark={onSelectBookmark}
      onClose={onClose}
      onCollapsed={onCollapsed}
      onAddBookmark={onAddBookmark}
      {...props}
    />
  );
};

describe("BookmarksPanel", () => {
  it("Should render bookmarks", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();
  });

  it("Should render empty bookmarks panel", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText } = callRender(renderWithTheme, {
      bookmarks: [],
    });
    expect(getByText("Bookmarks list is empty")).toBeInTheDocument();
  });

  it("Should open option menu", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 1");
    const editOption = getByText("Edit Bookmark");
    userEvent.click(editOption);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 0.4");
  });

  it("Should render clear bookmarks dekstop content", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    expect(getAllByRole("button").length).toBe(2);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    expect(getAllByRole("button").length).toBe(3);
  });

  it("Should cancel clear bookmarks", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 0.4");
    const cancelClear = getAllByRole("button")[2];
    userEvent.click(cancelClear);
    expect(getAllByRole("button")[0]).toHaveStyle("opacity: 1");
  });

  it("Should render clear bookmarks mobile content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    const body = document.getElementsByTagName("body")[0];
    expect(body.childNodes[1]).toContainHTML(
      "Are you sure you  want to clear all  bookmarks?"
    );
  });

  it("Should render bookmarks unsaved warning content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    expect(popover).toContainHTML(
      "You have unsaved bookmarks. After uploading the file, they will be cleared."
    );
  });

  it("Should render bookmarks upload content", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const uploadButton = getByText("Upload");
    userEvent.click(uploadButton);
    expect(popover).toContainHTML(dragAndDropText);
  });

  it("Should close unsaved content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const cancelButton = getByText("Cancel");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML("Cancel");
  });

  it("Should close upload content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const uploadOption = getByText("Upload bookmarks");
    userEvent.click(uploadOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const uploadButton = getByText("Upload");
    userEvent.click(uploadButton);
    const cancelButton = getByText("Cancel");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML(dragAndDropText);
  });

  it("Should render confirm deleting mobile", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getAllByRole, getByText } = callRender(renderWithTheme);
    const optionButton = getAllByRole("button")[1];
    userEvent.click(optionButton);
    const clearOption = getByText("Clear bookmarks");
    userEvent.click(clearOption);
    const body = document.getElementsByTagName("body")[0];
    const popover = body.childNodes[1];
    const warning = "Are you sure you  want to clear all  bookmarks?";
    expect(popover).toContainHTML(warning);
    const cancelButton = getByText("No, Keep");
    userEvent.click(cancelButton);
    expect(popover).not.toContainHTML(warning);
  });
});
