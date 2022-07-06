import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseMapListItem } from "./base-map-list-item";
import { ThemeProvider } from "styled-components";
import { THEMES } from "../../../../app";

describe("Base Map List Item", () => {
  it("Should render base map list item", () => {
    const onChange = jest.fn();
    const onOptionsClick = jest.fn();

    render(
      <ThemeProvider theme={THEMES[0]}>
        <BaseMapListItem
          id="test-id"
          title="san-francisco"
          selected={false}
          hasOptions={true}
          iconUrl={"Dark"}
          onMapsSelect={onChange}
          onOptionsClick={onOptionsClick}
        />
      </ThemeProvider>
    );
    const component = screen.getByText("san-francisco");
    expect(component).toBeInTheDocument();
    userEvent.click(component);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
