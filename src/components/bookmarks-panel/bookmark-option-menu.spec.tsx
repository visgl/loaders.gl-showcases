import { useAppLayout } from "../../utils/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";

jest.mock("../../utils/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onEditBookmark = jest.fn();
const onClearBookmarks = jest.fn();
const onUploadBookmarks = jest.fn();
const onCollapsed = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BookmarkOptionsMenu
      onEditBookmark={onEditBookmark}
      onClearBookmarks={onClearBookmarks}
      onUploadBookmarks={onUploadBookmarks}
      onCollapsed={onCollapsed}
      {...props}
    />
  );
};

describe("BookmarkOptionsMenu", () => {
  it("Should render bookmark options menu", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container, getByText, debug } = callRender(renderWithTheme);
    debug(container.firstChild);
    expect(container.firstChild).toBeInTheDocument();
    getByText("Edit Bookmark");
    getByText("Download file");
    getByText("Upload bookmarks");
    getByText("Clear bookmarks");
  });

  it("Should render collapse panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getByText } = callRender(renderWithTheme);
    expect(getByText("Collapse panel")).toBeInTheDocument();
  });
});
