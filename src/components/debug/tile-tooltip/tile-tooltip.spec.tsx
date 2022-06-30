import { render, screen } from "@testing-library/react";
import { getTile3d } from "../../../test/tile-stub";
import { TileTooltip } from "./tile-tooltip";

jest.mock("../../../constants/map-styles", () => "No data");

describe("Tooltip Panel", () => {
  let tile3d;
  beforeEach(() => {
    tile3d = getTile3d();
  });
  it("Should render tooltip with data", () => {
    render(<TileTooltip tile={tile3d} />);
    const getCells = (cellName) => screen.getByRole("cell", { name: cellName });
    const getColumnheader = (columnheaderName) =>
      screen.getByRole("columnheader", { name: columnheaderName });
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    expect(getCells("41513")).toBeInTheDocument();
    expect(getCells("mesh")).toBeInTheDocument();
    expect(getCells(1)).toBeInTheDocument();
    expect(getCells("41472")).toBeInTheDocument();
    expect(getCells(52964)).toBeInTheDocument();
    expect(getCells("0.000 m")).toBeInTheDocument();
    expect(getColumnheader("Children Count")).toBeInTheDocument();
    expect(getColumnheader("Children Ids")).toBeInTheDocument();
    expect(getColumnheader("Distance to camera")).toBeInTheDocument();
    expect(getColumnheader("Tile Id")).toBeInTheDocument();
    expect(getColumnheader("Type")).toBeInTheDocument();
    expect(getColumnheader("Vertex count")).toBeInTheDocument();
  });

  it("Should render tooltip without tooltip values", () => {
    tile3d.header.children = undefined;
    tile3d.id = undefined;
    tile3d.type = undefined;
    tile3d._distanceToCamera = undefined;
    tile3d.content = undefined;
    render(<TileTooltip tile={tile3d} />);
    const cells = screen.getAllByRole("cell").map((cell) => cell.textContent);
    const cellsValues = Array.from({ length: cells.length }, () => "No Data");
    const columheaders = screen
      .getAllByRole("columnheader")
      .map((columnheader) => columnheader.textContent);

    expect(columheaders).toEqual([
      "Tile Id",
      "Type",
      "Children Count",
      "Children Ids",
      "Vertex count",
      "Distance to camera",
    ]);
    expect(cells).toEqual(cellsValues);
  });
});
