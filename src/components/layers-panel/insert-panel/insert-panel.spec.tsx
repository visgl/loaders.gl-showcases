import { type RenderResult, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithThemeProviders } from "../../../utils/testing-utils/render-with-theme";
import { InsertPanel } from "./insert-panel";
import { setupStore } from "../../../redux/store";
import { BaseMapGroup } from "../../../types";

import "@testing-library/jest-dom";

const onInsertMock = jest.fn();
const onCancelMock = jest.fn();

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "",
  },
});

const callRender = (
  renderFunc,
  props = {},
  store = setupStore()
): RenderResult => {
  return renderFunc(
    <InsertPanel
      title={"Test Title"}
      onInsert={onInsertMock}
      onCancel={onCancelMock}
      {...props}
    />,
    store
  );
};

describe("Insert panel", () => {
  it("Should render insert panel", () => {
    const { container } = callRender(renderWithThemeProviders);

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.queryByText("Basemap Provider")).not.toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Token")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Insert")).toBeInTheDocument();
  });

  it("Should render insert panel for BaseMaps", () => {
    const { container } = callRender(renderWithThemeProviders, {
      groups: [BaseMapGroup.Maplibre],
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Basemap Provider")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Token")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Insert")).toBeInTheDocument();
  });

  it("Should show name error and url error if they are not provided", async () => {
    const { container } = callRender(renderWithThemeProviders);

    await userEvent.click(screen.getByText("Insert"));
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Please enter name")).toBeInTheDocument();
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
  });

  it("Should show only url error if Name field is filled in", async () => {
    callRender(renderWithThemeProviders);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;

    fireEvent.change(nameInput, { target: { value: "test name" } });

    await userEvent.click(screen.getByText("Insert"));
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    expect(screen.queryByText("Please enter name")).toBeNull();
  });

  it("Should show URL error if it is not valid", async () => {
    callRender(renderWithThemeProviders);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlInput = document.querySelector("input[name=URL]")!;

    fireEvent.change(nameInput, { target: { value: "test name" } });
    fireEvent.change(urlInput, { target: { value: "test url" } });

    await userEvent.click(screen.getByText("Insert"));
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    expect(screen.queryByText("Please enter name")).toBeNull();
  });

  it("Should insert if everything is good", async () => {
    callRender(renderWithThemeProviders);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlInput = document.querySelector("input[name=URL]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenInput = document.querySelector("input[name=Token]")!;

    fireEvent.change(nameInput, { target: { value: "test name" } });
    fireEvent.change(urlInput, { target: { value: "http://123.com" } });
    fireEvent.change(tokenInput, { target: { value: "test token" } });

    await userEvent.click(screen.getByText("Insert"));
    expect(onInsertMock).toHaveBeenCalled();
  });

  it("Should be able to cancel panel", async () => {
    callRender(renderWithThemeProviders);

    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancelMock).toHaveBeenCalled();
  });
});
