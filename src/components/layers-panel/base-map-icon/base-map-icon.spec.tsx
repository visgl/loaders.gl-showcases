import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { BaseMapIcon } from "./base-map-icon";

const validatePresetBaseMap = (id: string) => {
  const { container } = renderWithTheme(<BaseMapIcon baseMapId={id} />) ?? {};
  expect(container).toBeDefined();
  if (!container) {
    return;
  }
  const component = container.firstChild;
  expect(component?.nodeName).toBe("DIV");
  if (component) {
    const background = getComputedStyle(component as Element).getPropertyValue(
      "background"
    );
    expect(background).toBe("rgb(35, 36, 48) url() no-repeat center");
  }
  expect(component?.firstChild).toBeNull();
};

describe("BaseMapIcon", () => {
  it("Should render BaseMapIcons with background", () => {
    const presetBaseMapIds = ["Dark", "Light", "Terrain"];
    for (const baseMapId of presetBaseMapIds) {
      validatePresetBaseMap(baseMapId);
    }
  });

  it("Should render SVG component", () => {
    const { container } =
      renderWithTheme(<BaseMapIcon baseMapId="CustomMap" />) ?? {};
    expect(container).toBeDefined();
    if (!container) {
      return;
    }
    const component = container.firstChild;
    expect(component?.nodeName).toBe("DIV");
    if (component) {
      const background = getComputedStyle(
        component as Element
      ).getPropertyValue("background");
      expect(background).toBe("rgb(35, 36, 48)");
    }

    const svgElement = component?.firstChild;
    expect(svgElement).not.toBeNull();
    expect(svgElement?.nodeName).toBe("svg");
  });
});
