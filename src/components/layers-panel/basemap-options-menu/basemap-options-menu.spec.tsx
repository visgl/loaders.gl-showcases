import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseMapOptionsMenu } from "./basemap-options-menu";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";

describe("Basemap options menu", () => {
  it("Should render delete option", () => {
    const onDeleteBasemap = jest.fn();

    renderWithTheme(<BaseMapOptionsMenu onDeleteBasemap={onDeleteBasemap} />);

    const deleteMap = screen.getByText("Delete map");
    expect(deleteMap).toBeInTheDocument();
    userEvent.click(deleteMap);
    expect(onDeleteBasemap).toHaveBeenCalled();
  });
});
