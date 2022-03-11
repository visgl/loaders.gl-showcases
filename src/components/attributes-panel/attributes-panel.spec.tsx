import { render, screen } from "@testing-library/react";
import { AttributesPanel } from "./attributes-panel";
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'


describe("Attributes Panel", () => {
  it("Should render attributes panel", () => {
    const handleClosePanel = jest.fn();
    render(
        <AttributesPanel
          title={"Attributes panel"}
          attributesObject={{}}
          handleClosePanel={handleClosePanel}
        />
      );
      const button = screen.getByRole("button");
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByRole("rowgroup")).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Attributes panel/i);
      userEvent.click(button);
      expect(handleClosePanel).toHaveBeenCalledTimes(1);
    });
  });