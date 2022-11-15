import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseMapListItem } from "./base-map-list-item";
import { renderWithTheme } from "../../../../utils/testing-utils/render-with-theme";
import { SelectionState } from "../../../../types";

describe("Base Map List Item", () => {
  it("Should render base map list item", () => {
    const onChange = jest.fn();
    const onOptionsClick = jest.fn();

    renderWithTheme(
      <BaseMapListItem
        id="test-id"
        title="san-francisco"
        selected={SelectionState.unselected}
        onMapsSelect={onChange}
        onOptionsClick={onOptionsClick}
        isOptionsPanelOpen={false}
      />
    );
    const component = screen.getByText("san-francisco");
    expect(component).toBeInTheDocument();
    userEvent.click(component);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
