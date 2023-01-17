import { TileDetailsPanel } from "./tile-details-panel";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { useAppLayout } from "../../utils/hooks/layout";

jest.mock("../../utils/hooks/layout");

const handleClosePanel = jest.fn();
const activeDebugPanel = jest.fn();
const deactiveDebugPanel = jest.fn();
const handleShowNormals = jest.fn();
const handleChangeTrianglesPercentage = jest.fn();
const handleChangeNormalsLength = jest.fn();

const useAppLayoutMock = useAppLayout as unknown as jest.Mocked<any>;

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
      // @ts-ignore
      tile={TILE}
      trianglesPercentage={30}
      normalsLength={20}
      handleShowNormals={handleShowNormals}
      handleChangeTrianglesPercentage={handleChangeTrianglesPercentage}
      handleChangeNormalsLength={handleChangeNormalsLength}
      handleClosePanel={handleClosePanel}
      activeDebugPanel={activeDebugPanel}
      deactiveDebugPanel={deactiveDebugPanel}
      {...props}
    >
      {"Some Text"}
    </TileDetailsPanel>
  );
};

describe("Tile Details Panel", () => {
  it("Should render and close tile details panel", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText, container } = callRender(renderWithTheme);
    getByText("Tile Info: 41510-main");
    expect(container.lastChild.childNodes.length).toBe(2);
  });

  it("Should switch content to validate tile", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText, container } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");
    userEvent.click(validateButton);
    expect(container.firstChild.lastChild.childNodes.length).toBe(0);
  });

  it("Should go back to tile info", () => {
    useAppLayoutMock.mockImplementation(() => "desktop");
    const { getByText, container } = callRender(renderWithTheme);
    const validateButton = getByText("Validate Tile");
    userEvent.click(validateButton);
    expect(container.firstChild.lastChild.childNodes.length).toBe(0);
    const backButton = container.firstChild.firstChild.firstChild;
    userEvent.click(backButton);
    expect(container.lastChild.childNodes.length).toBe(2);
  });

  it("Should activate debug panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    const { getByText } = callRender(renderWithTheme);
    const title = getByText("Tile Info: 41510-main");
    const closeButton = title.nextSibling;
    userEvent.click(closeButton);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
    expect(activeDebugPanel).toHaveBeenCalledTimes(1);
  });

  it("Should deactivate debug panel", () => {
    useAppLayoutMock.mockImplementation(() => "mobile");
    callRender(renderWithTheme);
    expect(deactiveDebugPanel).toHaveBeenCalledTimes(1);
  });
});
