import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { Map } from "@esri/react-arcgis";

jest.mock("@esri/react-arcgis", () => {
  return {
    Map: jest.fn().mockImplementation(() => <div></div>),
  };
});

const callRender = (renderFunc) => {
  return renderFunc(<Map />);
};

describe("ArcGis Wrapper", () => {
  it("Should be able to call ArcGis map", async () => {
    callRender(renderWithTheme);

    expect(Map).toBeCalledTimes(1);
  });
});
