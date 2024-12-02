import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
import { UnsavedBookmarkWarning } from "./unsaved-bookmark-warning";

const onCancel = jest.fn();
const onConfirmWarning = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <UnsavedBookmarkWarning
      onCancel={onCancel}
      onConfirmWarning={onConfirmWarning}
      {...props}
    />
  );
};

describe("UnsavedBookmarkWarning", () => {
  it("Should render unsaved bookmark panel", () => {
    const { container } = callRender(renderWithTheme);
    const fileInteractionContiner = container.firstChild.firstChild;
    expect(container.firstChild).toBeInTheDocument();
    expect(fileInteractionContiner.childNodes.length).toBe(2);
  });
});
