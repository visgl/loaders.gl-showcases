import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { CompareButton } from "./compare-button";
import { CompareButtonMode } from "../../../types";
import { fireEvent } from "@testing-library/react";

const onCompareModeToggle = jest.fn();
const onDownloadClick = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <CompareButton
      compareButtonMode={CompareButtonMode.Start}
      downloadStats={false}
      disableButton={true}
      disableDownloadButton={false}
      onCompareModeToggle={onCompareModeToggle}
      onDownloadClick={onDownloadClick}
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

  it("Should click download button", () => {
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
    });
    const downloadButton = container.firstChild.lastChild;
    fireEvent.click(downloadButton);
    expect(onDownloadClick).toHaveBeenCalled();
  });

  it("Should disable download button when comparing is stopped", () => {
    const { container } = callRender(renderWithTheme, {
      downloadStats: true,
      disableDownloadButton: true,
    });
    const downloadButton = container.firstChild.lastChild;
    expect(downloadButton).toBeDisabled();
  });
});
