import { render, screen } from "@testing-library/react";
import { AttributesPanel } from "./attributes-panel";
import userEvent from "@testing-library/user-event";

describe("Attributes Panel", () => {
  it("Should render attributes panel", () => {
    const handleClosePanel = jest.fn();
    render(
      <AttributesPanel
        title={"Attributes panel"}
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
    const getColumnheader = (columnheaderName) => screen.getByRole('columnheader', {name: columnheaderName});
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("rowgroup")).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Attributes panel/i);
    expect(screen.getByText("Sanfran_Orig_0992.flt")).toBeInTheDocument();
    expect(getCells("74689")).toBeInTheDocument();
    expect(getCells("Sanfran_Orig_0992.flt")).toBeInTheDocument();
    expect(getColumnheader("NAME")).toBeInTheDocument();
    expect(getColumnheader("OBJECTID")).toBeInTheDocument();
    userEvent.click(button);
    expect(handleClosePanel).toHaveBeenCalledTimes(1);
  });
});
