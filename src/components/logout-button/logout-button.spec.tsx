import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { AcrGisUser } from "./logout-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props) => {
  return renderFunc(
    <AcrGisUser
      onClick={onClickMock}
      {...props} />
  );
};

describe("AcrGisUser", () => {
  it("Should render Logout button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button' });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonIcon = button.nextSibling as Element;
    const buttonHeight = getComputedStyle(buttonIcon).getPropertyValue(
      "height"
    );
    expect(buttonHeight).toEqual('17px');
    userEvent.click(buttonIcon);
    expect(onClickMock).toHaveBeenCalled();
  });

});
