import { type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSize } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { ActionIconButton } from "../action-icon-button/action-icon-button";

const onClickMock = jest.fn();

const callRender = (renderFunc, props = {}): RenderResult => {
  return renderFunc(
    <ActionIconButton
      Icon={() => <></>}
      style="disabled"
      size={ButtonSize.Small}
      onClick={onClickMock}
      {...props}
    />
  );
};

describe("ActionIconButton", () => {
  it("Should render small Plus icon in the button", async () => {
    const { container } = callRender(renderWithTheme, {
      children: "Test Button",
    });
    expect(container).toBeInTheDocument();
    const button = screen.getByText("Test Button");
    const buttonHeight = getComputedStyle(
      button.previousSibling as Element
    ).getPropertyValue("height");
    expect(buttonHeight).toEqual("24px");

    await userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("Should render Big Plus icon in the button", async () => {
    const { container } = callRender(renderWithTheme, {
      children: "Test Button",
      size: ButtonSize.Big,
    });
    expect(container).toBeInTheDocument();
    const button = screen.getByText("Test Button");
    const buttonHeight = getComputedStyle(
      button.previousSibling as Element
    ).getPropertyValue("height");
    expect(buttonHeight).toEqual("40px");
    await userEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });
});
