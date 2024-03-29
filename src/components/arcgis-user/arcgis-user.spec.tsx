import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { AcrGisUser } from "./arcgis-user";

const onClickMock = jest.fn();

const callRender = (renderFunc, props) => {
  return renderFunc(<AcrGisUser onClick={onClickMock} {...props} />);
};

describe("AcrGisUser", () => {
  it("Should render Logout button", async () => {
    const { container } = callRender(renderWithTheme, {
      children: "Test Button",
    });
    expect(container).toBeInTheDocument();
    const button = screen.getByText("Test Button");
    const buttonIcon = button.nextSibling as Element;
    const buttonHeight =
      getComputedStyle(buttonIcon).getPropertyValue("height");
    expect(buttonHeight).toEqual("17px");
    await userEvent.click(buttonIcon);
    expect(onClickMock).toHaveBeenCalled();
  });
});
