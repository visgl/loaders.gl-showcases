import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { UploadPanelItem } from "./upload-panel-item";
import userEvent from "@testing-library/user-event";

const onCancel = jest.fn();
const onConfirm = jest.fn();

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

describe("UploadPanelItem", () => {
  it("Should render upload panel item", () => {
    const { container, getByText } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
    getByText("Test item");
    getByText("Test text");
  });

  it("Should cancel or confirm upload", () => {
    const { getByText } = callRender(renderWithTheme);
    const cancelButton = getByText("Cancel");
    const uploadButton = getByText("Upload");
    userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
    userEvent.click(uploadButton);
    expect(onConfirm).toHaveBeenCalled();
  });
});
