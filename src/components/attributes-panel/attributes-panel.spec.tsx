import { render, screen } from "@testing-library/react";
import { AttributesPanel } from "./attributes-panel";
import {TileValidator} from "../tile-validator/tile-validator";
import userEvent from "@testing-library/user-event";

describe("Attributes Panel", () => {
  it("Should render attributes panel with data", () => {
    const handleClosePanel = jest.fn();
    render(
      <AttributesPanel
        title={"Sanfran_Orig_0992.flt"}
        attributesObject={{
          NAME: "Sanfran_Orig_0992.flt",
          OBJECTID: "74689"
        }}
        handleClosePanel={handleClosePanel}
      />
    );
    const button = screen.getByRole("button");
    const heading = screen.getByRole("heading");
    const getCells = (cellName) => screen.getByRole("cell", {name: cellName});
    const getColumnheader = (columnheaderName) => screen.getByRole("columnheader", {name: columnheaderName});
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    expect(heading).toHaveTextContent("Sanfran_Orig_0992.flt");
    expect(getCells("74689")).toBeInTheDocument();
    expect(getCells("Sanfran_Orig_0992.flt")).toBeInTheDocument();
    expect(getColumnheader("NAME")).toBeInTheDocument();
    expect(getColumnheader("OBJECTID")).toBeInTheDocument();
    userEvent.click(button);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
  });

  it("Should render attributes panel with children data", () => {
    const handleClosePanel = jest.fn();
    const {container} = render(
      <AttributesPanel
        title={""}
        attributesObject={{}}
        handleClosePanel={handleClosePanel}>
        {"Some Text"}
      </AttributesPanel>
    );

    expect(container).not.toBeEmptyDOMElement();
  });

  it("Should render attributes panel without data", () => {
    const handleClosePanel = jest.fn();
    render(
      <AttributesPanel
        title={""}
        attributesObject={{
          NAME: "",
          OBJECTID: ""
        }}
        handleClosePanel={handleClosePanel}
      />
    );
    const heading = screen.queryByRole("heading");
    const cells = screen.getAllByRole("cell").map(cell => cell.textContent);
    const getColumnheader = (columnheaderName) => screen.getByRole("columnheader", {name: columnheaderName});
    expect(heading).not.toBeInTheDocument();
    expect(cells).toEqual(["No Data", "No Data"])
    expect(getColumnheader("NAME")).toBeInTheDocument();
    expect(getColumnheader("OBJECTID")).toBeInTheDocument();
  });
});
