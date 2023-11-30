import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSize } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { LogoutButton } from "./logout-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props) => {
  return renderFunc(
    <LogoutButton
      buttonSize={ButtonSize.Small}
      onClick={onClickMock}
      {...props} />
  );
};

describe("Logout Button", () => {
  it("Should render small Logout button", () => {
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

  it("Should render Big Logout button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button', buttonSize: ButtonSize.Big });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button as Element).getPropertyValue(
      "margin-left"
    );
    expect(buttonHeight).toEqual('57px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

});
