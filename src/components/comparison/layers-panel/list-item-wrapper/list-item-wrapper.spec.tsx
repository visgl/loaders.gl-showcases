import userEvent from "@testing-library/user-event";
import { ListItemWrapper } from "./list-item-wrapper";
import { ExpandState } from "../../../../types";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";

describe("List Item Wrapper", () => {
  const onChange = jest.fn();
  const onOptionsClick = jest.fn();
  const onExpandClick = jest.fn();

  it("Should render list item wrapper", () => {
    renderWithTheme(
      <ListItemWrapper
        id="test-id"
        selected={true}
        hasOptions={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onChange}
        optionsContent={<div>{'Hello world'}</div>}
      >
        San Francisco v1.6
      </ListItemWrapper>
    );
    const optionsIcon = document.querySelector("#test-id");
    const expandIcon = document.querySelector("#test-id ~ div");
    expect(expandIcon).not.toBeNull();
    expandIcon && userEvent.click(expandIcon);
    expect(onExpandClick).toHaveBeenCalledTimes(1);
    expect(optionsIcon).not.toBeNull();
    optionsIcon && userEvent.click(optionsIcon);
    expect(onOptionsClick).toHaveBeenCalledTimes(1);
  });
});
