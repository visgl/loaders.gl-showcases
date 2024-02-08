import { createEvent, fireEvent, waitFor } from "@testing-library/react";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { UploadPanel, dragAndDropText } from "./upload-panel";

jest.mock('@hyperjump/json-schema', () => ({
  add: jest.fn(),
  get: jest.fn(),
  validate: jest.fn().mockImplementation(() => Promise.resolve(
    jest.fn().mockImplementation(() => ({
      valid: true
    }))
  ))
}));

const onCancel = jest.fn();
const onBookmarksUploaded = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <UploadPanel
      onCancel={onCancel}
      onBookmarksUploaded={onBookmarksUploaded}
      {...props}
    />
  );
};

describe("UploadPanel", () => {
  // Stub FileReader and simulate onload function call
  // @ts-expect-error - rewrite FileReader Class
  global.FileReader = class {
    constructor() {
      setTimeout(async () => {
        await this.onload({
          target: {
            result: '{"test":true}'
          }
        }); // simulate success
      }, 0);
    }

    onload = (data) => data;

    readAsText = jest.fn();
  }

  it("Should render upload panel", () => {
    const { container, getByText } = callRender(renderWithTheme);
    const fileInteractionContainer = container.firstChild.firstChild;
    expect(container.firstChild).toBeInTheDocument();
    getByText(dragAndDropText);
    getByText("or");
    getByText("browse file");
    expect(fileInteractionContainer.childNodes.length).toBe(4);
  });

  it("Should upload file", async () => {
    const file = new File(["(⌐□_□)"], "test.json", { type: "application/json" });

    callRender(renderWithTheme);

    const label = screen.getByTestId('upload-file-label');

    await waitFor(() =>
      fireEvent.dragEnter(label)
    );

    const overlay = screen.getByTestId('dnd-overlay');

    const fileDropEvent = createEvent.drop(overlay);

    // Stub dataTransfer object for file drop event
    Object.defineProperty(fileDropEvent, 'dataTransfer', {
      value: {
        files: [file]
      },
    });

    await waitFor(() =>
      fireEvent(overlay, fileDropEvent)
    );

    expect(onBookmarksUploaded).toHaveBeenCalled();
  });
});
