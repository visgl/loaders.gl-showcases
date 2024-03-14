import { TileDetailsPanel } from "./tile-details-panel";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { useAppLayout } from "../../utils/hooks/layout";
import {
  isTileGeometryInsideBoundingVolume,
  getChildrenInfo,
} from "../../utils/debug/tile-debug";
import { getGeometryVsTextureMetrics } from "../../utils/debug/validation-utils/attributes-validation/geometry-vs-texture-metrics";
import { isGeometryBoundingVolumeMoreSuitable } from "../../utils/debug/validation-utils/tile-validation/bounding-volume-validation";

jest.mock("../../utils/hooks/layout");
jest.mock("../../utils/debug/tile-debug");
jest.mock(
  "../../utils/debug/validation-utils/attributes-validation/geometry-vs-texture-metrics"
);
jest.mock(
  "../../utils/debug/validation-utils/tile-validation/bounding-volume-validation"
);

jest.mock("./tile-metadata", () => ({
  TileMetadata: () => {
    const TileMetadataMock = "tile-metadata-mock";
    return (
      // @ts-expect-error - mock component
      <TileMetadataMock data-testid="tile-metadata-component" />
    );
  },
}));

jest.mock("./normals", () => ({
  Normals: () => {
    const NormalsMock = "normals-mock";
    return (
      // @ts-expect-error - mock component
      <NormalsMock data-testid="normals-component" />
    );
  },
}));

jest.mock("./validate-tile-panel", () => ({
  ValidateTilePanel: () => {
    const ValidateTilePanelMock = "validate-tiles-panel-mock";
    return (
      // @ts-expect-error - mock component
      <ValidateTilePanelMock data-testid="validate-tiles-component" />
    );
  },
}));

const handleClosePanel = jest.fn();
const activeDebugPanel = jest.fn();
const deactiveDebugPanel = jest.fn();
const onShowNormals = jest.fn();
const onChangeTrianglesPercentage = jest.fn();
const onChangeNormalsLength = jest.fn();

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

const isTileGeometryInsideBoundingVolumeMock =
  isTileGeometryInsideBoundingVolume as unknown as jest.Mocked<any>;
const getChildrenInfoMock = getChildrenInfo as unknown as jest.Mocked<any>;
const getGeometryVsTextureMetricsMock =
  getGeometryVsTextureMetrics as unknown as jest.Mocked<any>;
const isGeometryBoundingVolumeMoreSuitableMock =
  isGeometryBoundingVolumeMoreSuitable as unknown as jest.Mocked<any>;

const TILE = {
  id: "41510-main",
  type: "mesh",
  header: { children: [{ id: "41470" }] },
  distanceToCamera: 8781.02805528071,
  lodMetricType: "maxScreenThreshold",
  lodMetricValue: 493.86721993074445,
  refine: 2,
  screenSpaceError: 227.12218855153932,
  content: { vertexCount: 42759 },
};

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <TileDetailsPanel
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tile={TILE}
      trianglesPercentage={30}
      normalsLength={20}
      onShowNormals={onShowNormals}
      onChangeTrianglesPercentage={onChangeTrianglesPercentage}
      onChangeNormalsLength={onChangeNormalsLength}
      handleClosePanel={handleClosePanel}
      activeDebugPanel={activeDebugPanel}
      deactiveDebugPanel={deactiveDebugPanel}
      {...props}
    >
      {"Some Text"}
    </TileDetailsPanel>
  );
};

beforeAll(() => {
  getChildrenInfoMock.mockReturnValue({
    count: 10,
    ids: "one, two, three",
  });
});

describe("Tile Details Panel", () => {
  it("Should render tile details panel", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText, getByTestId } = callRender(renderWithTheme);
    expect(getByText("Tile Info: 41510-main")).toBeDefined();
    expect(getByText("Validate Tile")).toBeDefined();
    expect(getByTestId("tile-metadata-component")).toBeDefined();
    expect(getByTestId("normals-component")).toBeDefined();
  });

  it("Should be able to validate tile", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isTileGeometryInsideBoundingVolumeMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry inside bounding volume in good way", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isTileGeometryInsideBoundingVolumeMock.mockReturnValue(true);

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isTileGeometryInsideBoundingVolumeMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry inside bounding volume in bad way", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isTileGeometryInsideBoundingVolumeMock.mockReturnValue(false);

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isTileGeometryInsideBoundingVolumeMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry inside bounding volume in string error way", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isTileGeometryInsideBoundingVolumeMock.mockImplementation(() => {
      throw new Error("test error");
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isTileGeometryInsideBoundingVolumeMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry inside bounding volume in error way", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isTileGeometryInsideBoundingVolumeMock.mockImplementation(() => {
      throw new Error("test");
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isTileGeometryInsideBoundingVolumeMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry vs textures in good way if there are positive triangle values", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    getGeometryVsTextureMetricsMock.mockReturnValue({
      triangles: 10,
      geometryNullTriangleCount: 10,
      geometrySmallTriangleCount: 10,
      texCoordNullTriangleCount: 10,
      texCoordSmallTriangleCount: 10,
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(getGeometryVsTextureMetricsMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to validate geometry vs textures in good way if there are empty triangle values", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    getGeometryVsTextureMetricsMock.mockReturnValue({
      triangles: 0,
      geometryNullTriangleCount: 0,
      geometrySmallTriangleCount: 0,
      texCoordNullTriangleCount: 0,
      texCoordSmallTriangleCount: 0,
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(getGeometryVsTextureMetricsMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to compare bounding volume vs geometry bounding volume in good way if geometry bounding volume more sutable", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isGeometryBoundingVolumeMoreSuitableMock.mockReturnValue(true);

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isGeometryBoundingVolumeMoreSuitableMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to compare bounding volume vs geometry bounding volume in bad way for string error", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isGeometryBoundingVolumeMoreSuitableMock.mockImplementation(() => {
      throw new Error("test error");
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isGeometryBoundingVolumeMoreSuitableMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to compare bounding volume vs geometry bounding volume in bad way for not string error", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    isGeometryBoundingVolumeMoreSuitableMock.mockImplementation(() => {
      throw new Error("test error");
    });

    const { getByText } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    expect(isGeometryBoundingVolumeMoreSuitableMock).toHaveBeenCalledWith(TILE);
  });

  it("Should be able to close tile debug panel for desktop", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText } = callRender(renderWithTheme);
    const title = getByText("Tile Info: 41510-main");
    const closeButton = title.nextSibling;
    userEvent.click(closeButton);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
  });

  it("Should be able to close tile debug panel for mobile", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getByText } = callRender(renderWithTheme);
    const title = getByText("Tile Info: 41510-main");
    const closeButton = title.nextSibling;
    userEvent.click(closeButton);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
    expect(activeDebugPanel).toHaveBeenCalledTimes(1);
  });

  it("Should be able to click on back button in validate tile mode", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText, getByTestId, queryByTestId } =
      callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");

    userEvent.click(validateButton);

    const backButton = getByTestId("tile-details-back-button");

    userEvent.click(backButton);

    expect(queryByTestId("tile-details-back-button")).toBeNull();
  });

  it("Should deactivate debug panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    callRender(renderWithTheme);
    expect(deactiveDebugPanel).toHaveBeenCalledTimes(1);
  });
});
