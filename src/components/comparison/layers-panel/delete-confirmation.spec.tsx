import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { DeleteConfirmation } from "./delete-confirmation";

const onDeleteHandlerMock = jest.fn();
const onKeepMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <DeleteConfirmation
      onKeepHandler={onKeepMock}
      onDeleteHandler={onDeleteHandlerMock}
      children={null}
      {...props}
    />
  );
};

describe("Delete Conformation", () => {
  it("Should render Conformation Panel", () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    const keepButton = screen.getByText("No, keep");
    expect(keepButton).toBeInTheDocument();
    userEvent.click(keepButton);
    expect(onKeepMock).toHaveBeenCalled();

    const deleteButton = screen.getByText("Yes, delete");
    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);
    expect(onDeleteHandlerMock).toHaveBeenCalled();
  });

  it("Should render children", () => {
    const { container } = callRender(renderWithTheme, {
      children: <div>Child</div>,
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
