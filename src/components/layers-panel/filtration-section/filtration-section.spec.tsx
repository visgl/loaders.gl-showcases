import { renderWithThemeProviders } from "../../../utils/testing-utils/render-with-theme";
import userEvent from "@testing-library/user-event";
import { FiltrationSection } from "./filtration-section";
import { setupStore } from "../../../redux/store";
import { getBSLStatisticsSummary } from "../../../redux/slices/bsl-statistics-summary-slice";
import { fetchFile } from "@loaders.gl/core";

jest.mock("@loaders.gl/core");

const callRender = (renderFunc, props = {}, store) => {
  return renderFunc(<FiltrationSection {...props} />, store);
};

describe("FiltrationSection", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollBy = jest.fn();
  it("Should render filtration section", () => {
    const store = setupStore();
    const { getByText, getAllByRole } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    const [leftArrow, rightArrow] = getAllByRole("button");
    expect(leftArrow).toBeDisabled();
    expect(rightArrow).toBeDisabled();
    getByText("NUM_FLOORS");
    getByText("CONSTR_PHASE");
  });

  it("Should select phase", () => {
    const store = setupStore();
    const { getByText, getAllByRole } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    const arrows = getAllByRole("button");
    const leftArrow = arrows[2];
    const rightArrow = arrows[3];
    const secondPhase = getByText("3");
    userEvent.click(secondPhase);
    expect(leftArrow).not.toBeDisabled();
    expect(rightArrow).not.toBeDisabled();
  });

  it("Should select floor", async () => {
    const mockData = {
      statisticsHRef: "testHref",
      summary: [{ fieldName: "BldgLevel", mostFrequentValues: [0, 10, 20] }],
    };
    (fetchFile as unknown as jest.Mock<any>).mockReturnValue(
      new Promise((resolve) => {
        resolve({ text: async () => JSON.stringify(mockData) });
      })
    );
    const store = setupStore();
    await store.dispatch(
      getBSLStatisticsSummary({ statSummaryUrl: "mockUrl" })
    );
    const { container, getByText, getAllByRole } = callRender(
      renderWithThemeProviders,
      undefined,
      store
    );
    const filtrationSection = container.firstChild;
    const [leftArrow, rightArrow] = getAllByRole("button");
    const secondFloor = getByText("10");
    const secondFloorImage =
      filtrationSection.childNodes[1].lastChild.childNodes[1];
    expect(secondFloorImage).not.toHaveStyle("margin: 5px 0");
    userEvent.click(secondFloor);
    expect(secondFloorImage).toHaveStyle("margin: 5px 0");
    expect(leftArrow).not.toBeDisabled();
    expect(rightArrow).not.toBeDisabled();
  });
});
