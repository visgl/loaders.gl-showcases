import { act, screen } from "@testing-library/react";
import { ActiveSublayer } from "../../../utils/active-sublayer";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { BuildingExplorer } from "./building-explorer";

// Mocked Component
import { ListItem } from "./list-item/list-item";

jest.mock("./list-item/list-item");

const ListItemMock = ListItem as unknown as jest.Mocked<any>;

beforeAll(() => {
  ListItemMock.mockImplementation((props) => (
    <div>{`ListItem Mock-${props.id}`}</div>
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
    expect(screen.getByText("ListItem Mock-0")).toBeInTheDocument();
    screen.findAllByText("ListItem Mock-1").then(res => expect(res).toBe([]));
    expect(screen.getByText("ListItem Mock-2")).toBeInTheDocument();
  });

  it("Should be able to toggle sublayer", () => {
    const { container } = callRender(renderWithTheme, {
      sublayers: [
        {
          id: 0,
          expanded: false,
          name: "first",
          childNodesCount: 0,
          layerType: "group" as "group" | "3DObject" | "Point",
          sublayers: [
            {
              id: 1,
              expanded: true,
              name: "first-nested",
              childNodesCount: 0,
              layerType: "group" as "group" | "3DObject" | "Point",
              sublayers: [],
            },
          ],
        },
      ].map(sublayer => new ActiveSublayer(sublayer)),
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("ListItem Mock-0")).toBeInTheDocument();
    expect(
      screen.queryByText("ListItem Mock-1")
    ).not.toBeInTheDocument();

    const { onChange, onExpandClick } = ListItemMock.mock.lastCall[0];

    act(() => {
      onExpandClick();
    });

    act(() => {
      onChange();
    });
    expect(onUpdateSublayerVisibilityMock).toHaveBeenCalled();
  });
});
