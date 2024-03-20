import userEvent from "@testing-library/user-event";
import { useAppLayout } from "../../utils/hooks/layout";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { SliderListItem } from "./slider-list-item";
import { SliderType } from "../../types";
import "@testing-library/jest-dom";
import type { RenderResult } from "@testing-library/react";

jest.mock("../../utils/hooks/layout");

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const onSelectBookmark = jest.fn();
const onDeleteBookmark = jest.fn();

const callRender = (renderFunc, props = {}): RenderResult => {
  return renderFunc(
    <SliderListItem
      id="list-item-test-id"
      selected={false}
      sliderType={SliderType.Bookmarks}
      url={"screenshot"}
      editingMode={false}
      editingSelected={false}
      onSelect={onSelectBookmark}
      onDelete={onDeleteBookmark}
      {...props}
    />
  );
};

describe("BookmarksListItem", () => {
  it("Should render bookmarks list item", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme);
    const listItem = container.firstElementChild;
    expect(listItem).toBeInTheDocument();
    if (listItem) {
      expect(listItem.childNodes.length).toBe(0);
    }
  });

  it("Should select bookmarks list item", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, { selected: true });
    const listItem = container.firstChild;
    expect(listItem).toHaveStyle("border: 2px solid #605DEC");
  });

  it("Should select bookmark for editing", async () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      editingSelected: true,
    });
    const listItem = container.firstChild;
    // TODO item is hovered after initialization
    expect(listItem).toHaveStyle("border: 2px solid #605dec");
  });

  it("Should render mobile content", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    if (listItem) {
      expect(listItem.childNodes.length).toBe(1);
    }
  });

  it("Should render delete confirmation panel", async () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    expect(container.childNodes.length).toBe(1);
    if (listItem?.firstElementChild) {
      await userEvent.click(listItem.firstElementChild);
    }

    expect(container.childNodes.length).toBe(2);
  });

  it("Should close panel", async () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container, getByText } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    if (listItem?.firstElementChild) {
      await userEvent.click(listItem?.firstElementChild);
    }

    expect(container.childNodes.length).toBe(2);
    const cancelButton = getByText("No, Keep");
    await userEvent.click(cancelButton);
    expect(container.childNodes.length).toBe(1);
  });

  it("Should confirm deleting", async () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { container, getByText } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    if (listItem?.firstElementChild) {
      await userEvent.click(listItem.firstElementChild);
    }

    const confrimButton = getByText("Yes, Delete");
    await userEvent.click(confrimButton);
    expect(onDeleteBookmark).toHaveBeenCalled();
  });

  it("Should render desktop content", async () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });
    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    if (listItem) {
      await userEvent.hover(listItem);
      expect(listItem.childNodes.length).toBe(1);
      await userEvent.unhover(listItem);
      expect(listItem.childNodes.length).toBe(0);
    }
  });

  it("Should render desktop content in deleting mode", async () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { container } = callRender(renderWithTheme, {
      editingMode: true,
    });

    const listItem = container.firstElementChild;
    expect(listItem).not.toBeNull();
    if (listItem) {
      await userEvent.hover(listItem);
      if (listItem.firstElementChild) {
        await userEvent.click(listItem.firstElementChild);
        expect(listItem.childNodes.length).toBe(2);
      }

      if (listItem.firstElementChild) {
        await userEvent.click(listItem.firstElementChild);
        expect(onDeleteBookmark).toHaveBeenCalled();
      }

      if (listItem.lastElementChild) {
        await userEvent.click(listItem.lastElementChild);
        expect(listItem.childNodes.length).toBe(1);
      }
    }
  });
});
