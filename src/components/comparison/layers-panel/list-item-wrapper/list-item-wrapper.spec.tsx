/* eslint-disable @typescript-eslint/no-non-null-assertion */

import userEvent from "@testing-library/user-event";
import { ListItemWrapper } from "./list-item-wrapper";
import { ExpandState } from "../../../../types";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";

describe("List Item Wrapper", () => {
  it("Should render list item wrapper", () => {
    const onChange = jest.fn();
    const onOptionsClick = jest.fn();
    const onExpandClick = jest.fn();

    renderWithTheme(
      <ListItemWrapper
        id="test-id"
        selected={true}
        hasOptions={true}
        expandState={ExpandState.expanded}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onChange}
      >
        San Francisco v1.6
      </ListItemWrapper>
    );
    const optionsIcon = document.querySelector("#test-id")!;
    const expandIcon = document.querySelector("#test-id ~ div")!;
    userEvent.click(expandIcon);
    expect(onExpandClick).toHaveBeenCalledTimes(1);
    userEvent.click(optionsIcon);
    expect(onOptionsClick).toHaveBeenCalledTimes(1);
  });
  it("Should render expand with collapesed icon", () => {
    const onChange = jest.fn();
    const onOptionsClick = jest.fn();
    const onExpandClick = jest.fn();

    renderWithTheme(
      <ListItemWrapper
        id="test-id"
        selected={true}
        hasOptions={true}
        expandState={ExpandState.collapsed}
        onOptionsClick={onOptionsClick}
        onExpandClick={onExpandClick}
        onClick={onChange}
      >
        San Francisco v1.6
      </ListItemWrapper>
    );
  });
});
