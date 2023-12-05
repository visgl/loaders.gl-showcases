import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { LogoutButton } from "./logout-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props) => {
  return renderFunc(
    <LogoutButton
      onClick={onClickMock}
      {...props} />
  );
};

describe("Logout Button", () => {
  it("Should render Logout button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button' });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button as Element).getPropertyValue(
      "margin-left"
    );
    expect(buttonHeight).toEqual('41px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

});
