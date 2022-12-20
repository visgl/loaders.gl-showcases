import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import userEvent from "@testing-library/user-event";
import { FiltrationSection } from "./filtration-section";

const callRender = (renderFunc, props = {}) => {
  return renderFunc(<FiltrationSection {...props} />);
};

describe("FiltrationSection", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollBy = jest.fn();
  it("Should render filtration section", () => {
    const { getByText, getAllByRole } = callRender(renderWithTheme);
    const [leftArrow, rightArrow] = getAllByRole("button");
    expect(leftArrow).toBeDisabled();
    expect(rightArrow).toBeDisabled();
    getByText("NUM_FLOORS");
    getByText("CONSTR_PHASE");
  });

  it("Should select phase", () => {
    const { getByText, getAllByRole } = callRender(renderWithTheme);
    const arrows = getAllByRole("button");
    const leftArrow = arrows[2];
    const rightArrow = arrows[3];
    const secondPhase = getByText("3");
    userEvent.click(secondPhase);
    expect(leftArrow).not.toBeDisabled();
    expect(rightArrow).not.toBeDisabled();
  });

  it("Should select floor", () => {
    const { container, getByText, getAllByRole } = callRender(renderWithTheme);
    const filtrationSection = container.firstChild;
    const [leftArrow, rightArrow] = getAllByRole("button");
    const secondFloor = getByText("Floor 2");
    const secondFloorImage =
      filtrationSection.childNodes[1].lastChild.childNodes[1];
    expect(secondFloorImage).not.toHaveStyle("margin: 5px 0");
    userEvent.click(secondFloor);
    expect(secondFloorImage).toHaveStyle("margin: 5px 0");
    expect(leftArrow).not.toBeDisabled();
    expect(rightArrow).not.toBeDisabled();
  });
});
