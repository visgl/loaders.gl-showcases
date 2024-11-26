import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { ConfirmDeletingPanel } from "./confirm-deleting-panel";
import userEvent from "@testing-library/user-event";

const onCancel = jest.fn();
const onConfirm = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ConfirmDeletingPanel
      title={"Test title"}
      onCancel={onCancel}
      onConfirm={onConfirm}
      {...props}
    />
  );
};

describe("ConfirmDeletingPanel", () => {
  it("Should render confirm deleting panel", () => {
    const { container, getByText } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
    getByText("Test title");
  });

  it("Should cancel or confirm deleting", async () => {
    const { getByText } = callRender(renderWithTheme);
    const cancelButton = getByText("No, Keep");
    const uploadButton = getByText("Yes, Delete");
    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
    await userEvent.click(uploadButton);
    expect(onConfirm).toHaveBeenCalled();
  });
});
