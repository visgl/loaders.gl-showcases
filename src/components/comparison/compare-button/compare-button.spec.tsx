import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { CompareButton } from "./compare-button";
import { CompareButtonMode } from "../../../types";

const onCompareModeToggle = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <CompareButton
      compareButtonMode={CompareButtonMode.Start}
      downloadStats={false}
      disableButton={true}
      onCompareModeToggle={onCompareModeToggle}
      {...props}
    />
  );
};

describe("CompareButton", () => {
  it("Should render start comparing", () => {
    const { container, getByText } = callRender(renderWithTheme);
    const buttonContainer = getByText("Start comparing");
    expect(container).toBeInTheDocument();
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer.closest("button")).toBeDisabled();
    expect(container.firstChild.childNodes.length).toBe(1);
  });

  it("Should render comparing", () => {
    const { getByText } = callRender(renderWithTheme, {
      compareButtonMode: CompareButtonMode.Comparing,
      disableButton: false,
    });
    const buttonContainer = getByText("Stop comparing");
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer.closest("button")).not.toBeDisabled();
  });

  it("Should render download button", () => {
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
    });
    expect(container.firstChild.childNodes.length).toBe(2);
  });
});
