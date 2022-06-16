import { render, screen } from "@testing-library/react";
import { FeatureAttributes } from "./feature-attributes";

describe("Feature Attributes", () => {
  it("Should render attributes with data", () => {
    render(
      <FeatureAttributes
        attributesObject={{
          NAME: "Sanfran_Orig_0992.flt",
          OBJECTID: "74689"
        }}
      />
    );
    const getCells = (cellName) => screen.getByRole("cell", {name: cellName});
    const getColumnheader = (columnheaderName) => screen.getByRole("columnheader", {name: columnheaderName});
    expect(getCells("74689")).toBeInTheDocument();
    expect(getCells("Sanfran_Orig_0992.flt")).toBeInTheDocument();
    expect(getColumnheader("NAME")).toBeInTheDocument();
    expect(getColumnheader("OBJECTID")).toBeInTheDocument();
  });

  it("Should render attributes without data", () => {
    render(
      <FeatureAttributes
        attributesObject={{
          NAME: "",
          OBJECTID: ""
        }}
      />
    );
    const cells = screen.getAllByRole("cell").map(cell => cell.textContent);
    const getColumnheader = (columnheaderName) => screen.getByRole("columnheader", {name: columnheaderName});
    expect(cells).toEqual(["No Data", "No Data"])
    expect(getColumnheader("NAME")).toBeInTheDocument();
    expect(getColumnheader("OBJECTID")).toBeInTheDocument();
  });
});
