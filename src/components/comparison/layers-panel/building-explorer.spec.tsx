import { act, screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { BuildingExplorer } from "./building-explorer";

// Mocked Component
import { ListItem } from "./list-item";

jest.mock("./list-item");

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
          id: "first",
          expanded: true,
          name: "first",
          childNodesCount: 0,
          sublayers: [
            {
              id: "first-nested",
              expanded: false,
              name: "first-nested",
              childNodesCount: 0,
              sublayers: [],
            },
          ],
        },
        {
          id: "second",
          expanded: false,
          name: "second",
          childNodesCount: 0,
          sublayers: [],
        },
      ],
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("ListItem Mock-first")).toBeInTheDocument();
    expect(screen.getByText("ListItem Mock-first-nested")).toBeInTheDocument();
    expect(screen.getByText("ListItem Mock-second")).toBeInTheDocument();
  });

  it("Should be able to toggle sublayer", () => {
    const { container } = callRender(renderWithTheme, {
      sublayers: [
        {
          id: "first",
          expanded: false,
          name: "first",
          childNodesCount: 0,
          sublayers: [
            {
              id: "first-nested",
              expanded: true,
              name: "first-nested",
              childNodesCount: 0,
              sublayers: [],
            },
          ],
        },
      ],
    });

    expect(container).toBeInTheDocument();
    expect(screen.getByText("ListItem Mock-first")).toBeInTheDocument();
    expect(
      screen.queryByText("ListItem Mock-first-nested")
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
