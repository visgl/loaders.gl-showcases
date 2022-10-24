import userEvent from "@testing-library/user-event";
import { useAppLayout } from "../../utils/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BookmarksListItem } from "./bookmark-list-item";

jest.mock("../../utils/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onSelectBookmark = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BookmarksListItem
      selected={false}
      url={"screenshot"}
      editingMode={false}
      moveWidth={144}
      onSelectBookmark={onSelectBookmark}
      {...props}
    />
  );
};

describe("BookmarksListItem", () => {
  it("Should render bookmarks list item", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme);
    const listItem = container.firstChild;
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveStyle("transform: translateX(144px)");
    expect(listItem.childNodes.length).toBe(0);
  });

  it("Should select bookmarks list item", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, { selected: true });
    const listItem = container.firstChild;
    expect(listItem).toHaveStyle("border: 2px solid #605DEC");
  });

  it("Should render mobile content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstChild;
    expect(listItem.childNodes.length).toBe(1);
  });

  it("Should render delete confirmation panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstChild;
    expect(container.childNodes.length).toBe(1);
    userEvent.click(listItem.firstChild);
    expect(container.childNodes.length).toBe(2);
  });

  it("Should close panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container, getByText } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstChild;
    userEvent.click(listItem.firstChild);
    expect(container.childNodes.length).toBe(2);
    const cancelButton = getByText("No, Keep");
    userEvent.click(cancelButton);
    expect(container.childNodes.length).toBe(1);
  });

  it("Should confirm deleting", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container, getByText } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const logSpy = jest.spyOn(console, "log");
    const listItem = container.firstChild;
    userEvent.click(listItem.firstChild);
    const confrimButton = getByText("Yes, Delete");
    userEvent.click(confrimButton);
    expect(logSpy).toHaveBeenCalledWith("not implemented");
  });

  it("Should render desktop content", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstChild;
    userEvent.hover(listItem);
    expect(listItem.childNodes.length).toBe(1);
    userEvent.unhover(listItem);
    expect(listItem.childNodes.length).toBe(0);
  });

  it("Should render desktop content in deleting mode", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const logSpy = jest.spyOn(console, "log");

    const listItem = container.firstChild;
    userEvent.hover(listItem);
    userEvent.click(listItem.firstChild);
    expect(listItem.childNodes.length).toBe(2);
    userEvent.click(listItem.firstChild);
    expect(logSpy).toHaveBeenCalledWith("not implemented");
    userEvent.click(listItem.lastChild);
    expect(listItem.childNodes.length).toBe(1);
  });
});