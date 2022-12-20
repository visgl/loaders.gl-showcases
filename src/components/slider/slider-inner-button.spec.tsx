import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { SliderInnerButton } from "./slider-inner-button";

const onInnerClick = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <SliderInnerButton
      blurButton={false}
      hide={false}
      disabled={false}
      onInnerClick={onInnerClick}
      {...props}
    >
      Test button
    </SliderInnerButton>
  );
};

describe("BookmarkInnerButton", () => {
  it("Should render bookmark inner button", () => {
    const { getByText } = callRender(renderWithTheme);
    const button = getByText("Test button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveStyle("width: 44px");
    expect(button).toHaveStyle("height: 44px");
    expect(button).toHaveStyle("display: flex");
    expect(button).toHaveStyle("opacity: 1");
  });

  it("Should have custom width and height", () => {
    const { getByText } = callRender(renderWithTheme, {
      width: 144,
      height: 144,
    });
    const button = getByText("Test button");
    expect(button).toHaveStyle("width: 144px");
    expect(button).toHaveStyle("height: 144px");
  });

  it("Should have blur the button", () => {
    const { getByText } = callRender(renderWithTheme, {
      blurButton: true,
    });
    const button = getByText("Test button");
    expect(button).toHaveStyle("opacity: 0.4");
  });

  it("Should have hide the button", () => {
    const { getByText } = callRender(renderWithTheme, {
      hide: true,
    });
    const button = getByText("Test button");
    expect(button).toHaveStyle("display: none");
  });
});
