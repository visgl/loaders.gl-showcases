import userEvent from "@testing-library/user-event";
import { CollapseDirection, ExpandState } from "../../types";
import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { ExpandIcon } from "./expand-icon";

describe("ExpandIcon", () => {
  let componentElement;
  let rerenderFunc;
  const onClick = jest.fn();
  beforeEach(() => {
    const { rerender, container } = renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.expanded}
        onClick={onClick}
      />
    );
    rerenderFunc = rerender;
    componentElement = container;
  });

  it("Should render", () => {
    expect(componentElement).toBeInTheDocument();

    const svgElement = componentElement.firstChild;
    expect(svgElement).toBeInTheDocument();
    const fill = getComputedStyle(svgElement).getPropertyValue("fill");
    expect(fill).toBe("#000001");
  });

  it("Should handle click event", () => {
    userEvent.click(componentElement.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Should show collapsed state", () => {
    const svgElement = componentElement.firstChild;
    let transform = getComputedStyle(svgElement).getPropertyValue("transform");
    expect(transform).toBe("rotate( 90deg )");

    renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.collapsed}
        onClick={onClick}
      />,
      rerenderFunc
    );
    transform = getComputedStyle(svgElement).getPropertyValue("transform");
    expect(transform).toBe("rotate( -90deg )");
  });

  it("Should collapse to the bottom", () => {
    renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.expanded}
        collapseDirection={CollapseDirection.bottom}
        onClick={onClick}
      />,
      rerenderFunc
    );
    const svgElement = componentElement.firstChild;
    let transform = getComputedStyle(svgElement).getPropertyValue("transform");
    expect(transform).toBe("rotate( -90deg )");

    renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.collapsed}
        collapseDirection={CollapseDirection.bottom}
        onClick={onClick}
      />,
      rerenderFunc
    );
    transform = getComputedStyle(svgElement).getPropertyValue("transform");
    expect(transform).toBe("rotate( 90deg )");
  });

  it("Should fill svg with custom colors", () => {
    const svgElement = componentElement.firstChild;
    renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.expanded}
        fillExpanded={"#AAAAAA"}
        fillCollapsed={"#555555"}
        onClick={onClick}
      />,
      rerenderFunc
    );
    let fill = getComputedStyle(svgElement).getPropertyValue("fill");
    expect(fill).toBe("#AAAAAA");

    renderWithTheme(
      <ExpandIcon
        id={"test-id"}
        expandState={ExpandState.collapsed}
        fillExpanded={"#AAAAAA"}
        fillCollapsed={"#555555"}
        onClick={onClick}
      />,
      rerenderFunc
    );
    fill = getComputedStyle(svgElement).getPropertyValue("fill");
    expect(fill).toBe("#555555");
  });
});
