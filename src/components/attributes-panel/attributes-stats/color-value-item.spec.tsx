import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { ColorValueItem } from "./color-value-item";
import { ArrowDirection } from "../../../types";

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ColorValueItem
      arrowDirection={ArrowDirection.left}
      colorValue={2000}
      arrowVisibility={true}
      {...props}
    />
  );
};

describe("ColorValueItem", () => {
  it("Should render with arrow", () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();

    const colorValueContainer = container.firstChild.lastChild;

    expect(colorValueContainer.childNodes.length).toEqual(2);
  });

  it("Should render with left arrow", () => {
    const { container } = callRender(renderWithTheme);
    const colorValueContainer = container.firstChild.lastChild;

    expect(colorValueContainer.firstChild).toHaveStyle("transform: none");
  });

  it("Should render with right arrow", () => {
    const { container } = callRender(renderWithTheme, {
      arrowDirection: ArrowDirection.right,
    });
    const colorValueContainer = container.firstChild.lastChild;

    expect(colorValueContainer.firstChild).toHaveStyle("transform: rotate(-180deg)");
  });

  it("Should render without arrow", () => {
    const { container } = callRender(renderWithTheme, {
      arrowVisibility: false,
    });

    const colorValueContainer = container.firstChild.lastChild;

    expect(colorValueContainer.childNodes.length).toEqual(1);
  });
});
