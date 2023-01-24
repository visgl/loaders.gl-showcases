import { screen } from "@testing-library/react";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { BuildingExplorer } from "./building-explorer";

// Mocked Component
import { SublayerWidget } from "./sublayer-widget";

jest.mock("./sublayer-widget");

const SublayerWidgetMock = SublayerWidget as unknown as jest.Mocked<any>;

beforeAll(() => {
  SublayerWidgetMock.mockImplementation((props) => (
    <div>{`SublayerWidget Mock-${props.sublayer.id}`}</div>
  ));
});

const onUpdateSublayerVisibilityMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <BuildingExplorer
      sublayers={[]}
      onUpdateSublayerVisibility={onUpdateSublayerVisibilityMock}
      {...props}
    />
  );
};

describe("Building Explorer", () => {
  it("Should render multiple sublayers", () => {
    const { container } = callRender(renderWithTheme, {
      sublayers: [
        {
          id: 0,
          expanded: true,
          name: "first",
          childNodesCount: 0,
          layerType: "group" as "group" | "3DObject" | "Point",
          sublayers: [
            {
              id: 1,
              expanded: false,
              name: "first-nested",
              childNodesCount: 0,
              layerType: "group" as "group" | "3DObject" | "Point",
              sublayers: [],
            },
          ],
        },
        {
          id: 2,
          expanded: false,
          name: "second",
          childNodesCount: 0,
          layerType: "group" as "group" | "3DObject" | "Point",
          sublayers: [],
        },
      ].map(sublayer => new ActiveSublayer(sublayer)),
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("SublayerWidget Mock-0")).toBeInTheDocument();
    expect(screen.queryByTestId("SublayerWidget Mock-1")).toBeNull();
    expect(screen.getByText("SublayerWidget Mock-2")).toBeInTheDocument();
  });
});
