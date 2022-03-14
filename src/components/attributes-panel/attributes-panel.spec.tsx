import { cleanup, render } from "@testing-library/react";
import { AttributesPanel } from "./attributes-panel";

afterEach(cleanup);

describe("Attributes Panel", () => {
  test("Should render attributes panel", () => {
    render(
      <AttributesPanel
        title={"Attributes panel"}
        attributesObject={{}}
        handleClosePanel={() => {
          console.log("handleClosePanel");
        }}
      />
    );
  });
});
