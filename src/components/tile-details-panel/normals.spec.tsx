import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Normals } from "./normals";
import { fireEvent } from "@testing-library/react";

const handleShowNormals = jest.fn();
const handleChangeTrianglesPercentage = jest.fn();
const handleChangeNormalsLength = jest.fn();

const TILE = {
  id: "41510-main",
  type: "mesh",
  header: { children: [{ id: "41470" }] },
  distanceToCamera: 8781.02805528071,
  lodMetricType: "maxScreenThreshold",
  lodMetricValue: 493.86721993074445,
  refine: 2,
  screenSpaceError: 227.12218855153932,
  content: {
    vertexCount: 42759,
    attributes: { normals: { size: 3, type: 5126 } },
  },
};

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <Normals
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tile={TILE}
      trianglesPercentage={30}
      normalsLength={20}
      handleShowNormals={handleShowNormals}
      handleChangeTrianglesPercentage={handleChangeTrianglesPercentage}
      handleChangeNormalsLength={handleChangeNormalsLength}
      {...props}
    />
  );
};

describe("Normals section", () => {
  it("Should render normals section", () => {
    const { container } = callRender(renderWithTheme);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Should render normals section without data", () => {
    const { getByText } = callRender(renderWithTheme, {
      tile: null,
    });
    getByText("The tile has no normals");
  });

  it("Should change triangles percentage and normals length", () => {
    const { getByLabelText, getByRole } = callRender(renderWithTheme);
    fireEvent.click(getByRole("checkbox"));
    fireEvent.change(getByLabelText("Percent of triangles with normals, %"), {
      target: { value: 31 },
    });
    expect(handleChangeTrianglesPercentage).toHaveBeenCalled();
    fireEvent.change(getByLabelText("Normals length, m"), {
      target: { value: 27 },
    });
    expect(handleChangeNormalsLength).toHaveBeenCalled();
  });
});
