import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSize } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { LoginButton } from "./login-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props) => {
  return renderFunc(
    <LoginButton
      buttonSize={ButtonSize.Small}
      onClick={onClickMock}
      {...props} />
  );
};

describe("Login Button", () => {
  it("Should render small Login button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button' });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "height"
    );
    expect(buttonHeight).toEqual('24px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("Should render Big Login button", () => {
    const { container } = callRender(renderWithTheme, { children: 'Test Button', buttonSize: ButtonSize.Big });
    expect(container).toBeInTheDocument();
    const button = screen.getByText('Test Button');
    const buttonHeight = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "height"
    );
    expect(buttonHeight).toEqual('40px');
    userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("Should render 'normal' (not 'grayed') Login button", () => {
    callRender(renderWithTheme, { children: 'Test Button' });
    const button = screen.getByText('Test Button');
    const background = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "background"
    );
    expect(background).toEqual('rgba(96, 93, 236, 0.4)');
  });

  it("Should render 'grayed' Login button", () => {
    callRender(renderWithTheme, { children: 'Test Button', grayed: true });
    const button = screen.getByText('Test Button');
    const background = getComputedStyle(button.previousSibling as Element).getPropertyValue(
      "background"
    );
    expect(background).toEqual('rgba(128, 128, 128, 0.6)');
  });
});
