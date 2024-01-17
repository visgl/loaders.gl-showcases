import { screen, within } from "@testing-library/react";
import { renderWithThemeProviders } from "../../utils/testing-utils/render-with-theme";
import { ModalDialog } from "./modal-dialog";
import userEvent from "@testing-library/user-event";
import { setupStore } from "../../redux/store";

const onCancel = jest.fn();
const onConfirm = jest.fn();

const callRender = (renderFunc, store = setupStore()) => {
  return renderFunc(
    <ModalDialog
      title={"Test Title"}
      okButtonText={"Log out"}
      cancelButtonText={"Exit"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <></>
    </ModalDialog>,
    store
  );
};

describe("ModalDialog", () => {
  it("Should render dialog", async () => {
    const store = setupStore();
    const { container } = callRender(renderWithThemeProviders, store);
    expect(container).toBeInTheDocument();
    const dialog = screen.getByTestId("modal-dialog-content");
    expect(dialog).toBeInTheDocument();

    const title = within(dialog).getByText("Test Title");
    expect(title).toBeInTheDocument();

    const okButton = within(dialog).getByText("Log out");
    okButton && userEvent.click(okButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    const cancelButton = within(dialog).getByText("Exit");
    cancelButton && userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
