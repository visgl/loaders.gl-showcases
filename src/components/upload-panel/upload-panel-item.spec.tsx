import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { UploadPanelItem } from "./upload-panel-item";
import userEvent from "@testing-library/user-event";

const onCancel = jest.fn();
const onConfirm = jest.fn();

describe("UploadPanelItem - Cancel and Confirm buttons", () => {
  const callRender = (renderFunc, props = {}) => {
    return renderFunc(
      <UploadPanelItem
        title="Test item"
        onCancel={onCancel}
        onConfirm={onConfirm}
        {...props}
      >
        Test text
      </UploadPanelItem>
    );
  };

  it("Should render upload panel item", () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("Test item")).toBeInTheDocument();
    expect(screen.queryByText("Test text")).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeInTheDocument();
  });

  it("Should cancel or confirm upload", () => {
    const { getByText } = callRender(renderWithTheme);
    const cancelButton = getByText("Cancel");
    const uploadButton = getByText("Next");
    userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
    userEvent.click(uploadButton);
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe("UploadPanelItem - Cancel only button", () => {
  const callRender = (renderFunc, props = {}) => {
    return renderFunc(
      <UploadPanelItem title="Test item" onCancel={onCancel} {...props}>
        Test text
      </UploadPanelItem>
    );
  };

  it("Should render upload panel item", () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("Test item")).toBeInTheDocument();
    expect(screen.queryByText("Test text")).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("Should cancel or confirm upload", () => {
    const { getByText } = callRender(renderWithTheme);
    const cancelButton = getByText("Cancel");
    userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });
});
