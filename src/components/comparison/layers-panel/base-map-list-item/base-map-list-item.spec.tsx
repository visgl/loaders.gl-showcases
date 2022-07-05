import { render, screen } from "@testing-library/react";
import { BaseMapListItem } from "./base-map-list-item";

describe("Attributes Panel", () => {
  it("Should render attributes panel", () => {
    const onChange = jest.fn();
    const onOptionsClick = jest.fn();
    render(
      <BaseMapListItem
        id="test-id"
        title="san-francisco"
        selected={false}
        hasOptions={true}
        iconUrl={"Dark"}
        onMapsSelect={onChange}
        onOptionsClick={onOptionsClick}
      />
    );
    expect(screen.getByText("san-francisco")).toBeInTheDocument();
  });
});
