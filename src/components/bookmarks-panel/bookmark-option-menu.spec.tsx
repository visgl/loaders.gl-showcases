import { useAppLayout } from "../../utils/hooks/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BookmarkOptionsMenu } from "./bookmark-option-menu";

jest.mock("../../utils/hooks/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onEditBookmarks = jest.fn();
const onClearBookmarks = jest.fn();
const onUploadBookmarks = jest.fn();
const onCollapsed = jest.fn();
const onDownloadBookmarks = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BookmarkOptionsMenu
      showDeleteBookmarksOption={true}
      onEditBookmarks={onEditBookmarks}
      onClearBookmarks={onClearBookmarks}
      onUploadBookmarks={onUploadBookmarks}
      onCollapsed={onCollapsed}
      onDownloadBookmarks={onDownloadBookmarks}
      {...props}
    />
  );
};

describe("BookmarkOptionsMenu", () => {
  it("Should render bookmark options menu", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container, getByText } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
    getByText("Edit Bookmark");
    getByText("Download file");
    getByText("Upload bookmarks");
    getByText("Clear bookmarks");
    expect(container.firstChild.childNodes.length).toBe(5);
  });

  it("Should render collapse panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getByText } = callRender(renderWithTheme);
    expect(getByText("Collapse panel")).toBeInTheDocument();
  });

  it("Should not render clear all bookmarks option", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      showDeleteBookmarksOption: false,
    });
    expect(container.firstChild.childNodes.length).toBe(3);
  });
});
