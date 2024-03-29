import { type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { DeleteConfirmation } from "./delete-confirmation";

const onDeleteHandlerMock = jest.fn();
const onKeepMock = jest.fn();

const callRender = (renderFunc, props = {}): RenderResult => {
  return renderFunc(
    <DeleteConfirmation
      onKeepHandler={onKeepMock}
      onDeleteHandler={onDeleteHandlerMock}
      // eslint-disable-next-line react/no-children-prop
      children={null}
      {...props}
    />
  );
};

describe("Delete Conformation", () => {
  it("Should render Conformation Panel", async () => {
    const { container } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();

    const keepButton = screen.getByText("No, keep");
    expect(keepButton).toBeInTheDocument();
    await userEvent.click(keepButton);
    expect(onKeepMock).toHaveBeenCalled();

    const deleteButton = screen.getByText("Yes, delete");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
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
