import userEvent from "@testing-library/user-event";
import { ListItemWrapper } from "./list-item-wrapper";
import { SelectionState, ExpandState } from "../../../types";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";

describe("List Item Wrapper", () => {
  const onChange = jest.fn();
  const onOptionsClick = jest.fn();
  const onExpandClick = jest.fn();

  it("Should render list item wrapper", async () => {
    renderWithTheme(
      <ListItemWrapper
        id="test-id"
        selected={SelectionState.selected}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onChange}
        optionsContent={<div>{"Hello world"}</div>}
      >
        San Francisco v1.8
      </ListItemWrapper>
    );
    const optionsIcon = document.querySelector("#test-id");
    const expandIcon = document.querySelector("#test-id ~ div");
    expect(expandIcon).not.toBeNull();
    expandIcon && (await userEvent.click(expandIcon));
    expect(onExpandClick).toHaveBeenCalledTimes(1);
    expect(optionsIcon).not.toBeNull();
    optionsIcon && (await userEvent.click(optionsIcon));
    expect(onOptionsClick).toHaveBeenCalledTimes(1);
  });
});
