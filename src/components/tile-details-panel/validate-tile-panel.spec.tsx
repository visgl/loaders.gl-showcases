import { ValidateTilePanel } from "./validate-tile-panel";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";

const validateTileWarnings = [
  {
    key: "geometryNullTriangleCount",
    title: "Geometry degenerate triangles: 777",
  },
];

const validateTileOk = [
  {
    key: "trianglesTotal",
    title: "Triangles total: 456",
  },
];

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ValidateTilePanel
      validatedTileWarnings={validateTileWarnings}
      validatedTileOk={validateTileOk}
      {...props}
    />
  );
};

describe("Validate tile panel", () => {
  it("Should render validate data", () => {
    const { container, getByText } = callRender(renderWithTheme);
    expect(container).toBeInTheDocument();
    getByText("Geometry degenerate triangles: 777");
    getByText("Triangles total: 456");
    expect(container.childNodes.length).toBe(3);
  });

  it("Should render validate warnings only", () => {
    const { container, getByText } = callRender(renderWithTheme, {
      validatedTileOk: [],
    });
    getByText("Geometry degenerate triangles: 777");
    expect(container.childNodes.length).toBe(1);
  });
});
