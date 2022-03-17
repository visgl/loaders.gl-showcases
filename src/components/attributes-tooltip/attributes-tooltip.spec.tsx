import { render, screen } from "@testing-library/react";
import { AttributesTooltip } from "./attributes-tooltip"

describe("Attributes Panel", () => {
  it("Should render attributes tooltip with data", () => {
    render(
      <AttributesTooltip
        data={{
            "Children Count": 1,
            "Children Ids": "41233",
            "Distance to camera": "4838.708 m",
            "Tile Id": "41430-main",
            "Type": "mesh",
            "Vertex count": 52964,
        }}
      />
    );
    const getCells = (cellName) => screen.getByRole("cell", {name: cellName});
    const getColumnheader = (columnheaderName) => screen.getByRole('columnheader', {name: columnheaderName});
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    expect(getCells(1)).toBeInTheDocument();
    expect(getCells("41233")).toBeInTheDocument();
    expect(getCells("4838.708 m")).toBeInTheDocument();
    expect(getCells("41430-main")).toBeInTheDocument();
    expect(getCells("mesh")).toBeInTheDocument();
    expect(getCells(52964)).toBeInTheDocument();
    expect(getColumnheader("Children Count")).toBeInTheDocument();
    expect(getColumnheader("Children Ids")).toBeInTheDocument();
    expect(getColumnheader("Distance to camera")).toBeInTheDocument();
    expect(getColumnheader("Tile Id")).toBeInTheDocument();
    expect(getColumnheader("Type")).toBeInTheDocument();
    expect(getColumnheader("Vertex count")).toBeInTheDocument();
  });

  it("Should render attributes tooltip without tooltip values", () => {
    render(
      <AttributesTooltip
        data={{
            "Children Count": "",
            "Children Ids": "",
            "Distance to camera": "",
            "Tile Id": "",
            "Type": "",
            "Vertex count": "",
        }}
      />
    );
    const cells = screen.getAllByRole("cell").map(cell => cell.textContent);
    const cellsValues = Array.from({length: cells.length}, () => "No Data");
    const columheaders = screen
      .getAllByRole("columnheader")
      .map(columnheader => columnheader.textContent);
    
    expect(columheaders).toEqual([
      "Children Count",
      "Children Ids",
      "Distance to camera",
      "Tile Id",
      "Type",
      "Vertex count",
    ]);
    expect(cells).toEqual(cellsValues);
  });

  it("Should render attributes tooltip without data", () => {
    const {container} = render(
      <AttributesTooltip
        data={{}}
      />
    );
    expect(container).toBeEmptyDOMElement()
  });
});
