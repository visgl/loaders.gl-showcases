import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { UploadPanel, dragAndDropText } from "./upload-panel";

const onCancel = jest.fn();
const onConfirmWarning = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <UploadPanel
      onCancel={onCancel}
      onConfirmWarning={onConfirmWarning}
      {...props}
    />
  );
};

describe("UploadPanel", () => {
  it("Should render upload panel", () => {
    const { container, getByText } = callRender(renderWithTheme);
    const fileInteractionContiner = container.firstChild.firstChild;
    expect(container.firstChild).toBeInTheDocument();
    getByText(dragAndDropText);
    getByText("or");
    getByText("browse file");
    expect(fileInteractionContiner.childNodes.length).toBe(3);
  });
});
