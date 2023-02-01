import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { InsertPanel } from "./insert-panel";

const onInsertMock = jest.fn();
const onCancelMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <InsertPanel
      title={"Test Title"}
      onInsert={onInsertMock}
      onCancel={onCancelMock}
      {...props}
    />
  );
};

describe("Insert panel", () => {
  it("Should render insert panel", () => {
    const { container } = callRender(renderWithTheme);

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Token")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Insert")).toBeInTheDocument();
  });

  it("Should show name error and url error if they are not provided", () => {
    const { container } = callRender(renderWithTheme);

    userEvent.click(screen.getByText("Insert"));

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Please enter name")).toBeInTheDocument();
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
  });

  it("Should show only url error if Name field is filled in", () => {
    callRender(renderWithTheme);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;

    fireEvent.change(nameInput, { target: { value: 'test name' } });

    userEvent.click(screen.getByText("Insert"));

    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    expect(screen.queryByText("Please enter name")).toBeNull();
  });

  it("Should show URL error if it is not valid", () => {
    callRender(renderWithTheme);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlInput = document.querySelector("input[name=URL]")!;

    fireEvent.change(nameInput, { target: { value: 'test name' } });
    fireEvent.change(urlInput, { target: { value: 'test url' } });

    userEvent.click(screen.getByText("Insert"));

    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    expect(screen.queryByText("Please enter name")).toBeNull();
  });

  it("Should insert if everything is good", () => {
    callRender(renderWithTheme);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nameInput = document.querySelector("input[name=Name]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlInput = document.querySelector("input[name=URL]")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokenInput = document.querySelector("input[name=Token]")!;

    fireEvent.change(nameInput, { target: { value: 'test name' } });
    fireEvent.change(urlInput, { target: { value: 'http://123.com' } });
    fireEvent.change(tokenInput, { target: { value: 'test token' } });

    userEvent.click(screen.getByText("Insert"));
    expect(onInsertMock).toBeCalled();
  });

  it("Should be able to cancel panel", () => {
    callRender(renderWithTheme);

    userEvent.click(screen.getByText("Cancel"));
    expect(onCancelMock).toBeCalled();
  });
});
