import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { ColorValueItem } from "./color-value-item";

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ColorValueItem
      deg={90}
      yearCount={2000}
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
    expect(colorValueContainer.firstChild).toHaveStyle(
      "transform: rotate(90deg)"
    );
  });

  it("Should render without arrow", () => {
    const { container } = callRender(renderWithTheme, {
      arrowVisibility: false,
    });

    const colorValueContainer = container.firstChild.lastChild;

    expect(colorValueContainer.childNodes.length).toEqual(1);
  });
});
