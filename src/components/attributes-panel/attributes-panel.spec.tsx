import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { AttributesPanel } from "./attributes-panel";

jest.mock("../close-button/close-button", () => ({
  CloseButton: jest
    .fn()
    .mockImplementation((props) => <div {...props}>CloseButton</div>),
}));

jest.mock("./attributes-stats/attribute-stats", () => ({
  AttributeStats: jest.fn().mockImplementation(() => <div>AttributeStats</div>),
}));

describe("AttributesPanel", () => {
  const handleClosePanel = jest.fn();
  const handleColorsByAttributeChange = jest.fn();

  it("Should render AttributesPanel", () => {
    const attributes = {
      OBJECTID: "12345",
      NAME: "Test Name",
    };

    const { container } = renderWithTheme(
      <AttributesPanel
        title={"Test"}
        tilesetName={"Test Tileset"}
        attributes={attributes}
        tilesetBasePath={""}
        statisticsInfo={null}
        colorsByAttribute={null}
        onClose={handleClosePanel}
        onColorsByAttributeChange={handleColorsByAttributeChange}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.queryByText("Test")).toBeInTheDocument();
    expect(screen.getByText("CloseButton")).toBeInTheDocument();
    userEvent.click(screen.getByText("CloseButton"));
    expect(handleClosePanel).toHaveBeenCalled();

    expect(screen.queryByText("OBJECTID")).toBeInTheDocument();
    expect(screen.queryByText("NAME")).toBeInTheDocument();

    expect(screen.queryByText("12345")).toBeInTheDocument();
    expect(screen.queryByText("Test Name")).toBeInTheDocument();
  });

  it("Should render statistics in attributes panel", () => {
    const attributes = {
      OBJECTID: "12345",
      NAME: "Test Name",
    };

    const statisticsInfo = [{ key: "f_0", name: "NAME", href: "../testPath" }];

    const { container } = renderWithTheme(
      <AttributesPanel
        title={"Test"}
        tilesetName={"Test Tileset"}
        attributes={attributes}
        tilesetBasePath={""}
        statisticsInfo={statisticsInfo}
        colorsByAttribute={null}
        onClose={handleClosePanel}
        onColorsByAttributeChange={handleColorsByAttributeChange}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText("NAME")).toBeInTheDocument();

    userEvent.click(screen.getByText("NAME"));

    expect(
      screen.getByTestId("attributes-panel-back-button")
    ).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("AttributeStats")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("attributes-panel-back-button"));

    expect(
      screen.queryByTestId("attributes-panel-back-button")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
    expect(screen.queryByText("AttributeStats")).not.toBeInTheDocument();
  });
});
