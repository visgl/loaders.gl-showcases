import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectionState } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Checkbox } from "./checkbox";

const handleCheckboxClickMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Checkbox
      id={"test-id"}
      checked={SelectionState.selected}
      onChange={handleCheckboxClickMock}
      {...props}
    />
  );
};

describe("Checkbox", () => {
  it("Should be able to click on checkbox", async () => {
    callRender(renderWithTheme);

    const checkbox = screen.getByTestId("checkbox-test-id");

    userEvent.hover(checkbox);
    userEvent.click(checkbox);
    expect(handleCheckboxClickMock).toHaveBeenCalled();
  });

  it("Should show checked Checkbox", async () => {
    callRender(renderWithTheme);

    const checkedIcon = screen.getByTestId("checkbox-icon");
    expect(checkedIcon).toBeInTheDocument();
  });

  it("Should show indeterminate Checkbox", async () => {
    callRender(renderWithTheme, { checked: SelectionState.indeterminate });

    const indeterminateIcon = screen.getByTestId("indeterminate-icon");
    expect(indeterminateIcon).toBeInTheDocument();
  });

  it("Should show unselected Checkbox", async () => {
    callRender(renderWithTheme, { checked: SelectionState.unselected });

    const indeterminateIcon = screen.queryByText("indeterminate-icon");
    expect(indeterminateIcon).toBeNull();

    const checkedIcon = screen.queryByText("checkbox-icon");
    expect(checkedIcon).toBeNull();
  });
});
