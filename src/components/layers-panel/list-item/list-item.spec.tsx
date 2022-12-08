import { act, screen } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { ListItem } from "./list-item";

// Mocked Components
import { Checkbox } from "../../checkbox/checkbox";
import { ListItemWrapper } from "../list-item-wrapper/list-item-wrapper";
import { RadioButton } from "../../radio-button/radio-button";
import { SelectionState } from "../../../types";

jest.mock("../../checkbox/checkbox");
jest.mock("../list-item-wrapper/list-item-wrapper");
jest.mock("../../radio-button/radio-button");

const CheckboxMock = Checkbox as unknown as jest.Mocked<any>;
const ListItemWrapperMock = ListItemWrapper as unknown as jest.Mocked<any>;
const RadioButtonMock = RadioButton as unknown as jest.Mocked<any>;

beforeAll(() => {
  CheckboxMock.mockImplementation(() => <div>CheckBox</div>);
  ListItemWrapperMock.mockImplementation(({ children }) => (
    <div>
      ListItemWrapper
      {children}
    </div>
  ));
  RadioButtonMock.mockImplementation(() => <div>RadioButton</div>);
});

const onChangeMock = jest.fn();
const onOptionsClickMock = jest.fn();
const onClickOutsideMock = jest.fn();
const expandClickMock = jest.fn();

const callRender = (renderFunc, props = {}) => {
  return renderFunc(
    <ListItem
      id="test"
      title="Test Title"
      type={0} //RadioButton,
      selected={SelectionState.unselected}
      isOptionsPanelOpen={false}
      onChange={onChangeMock}
      onOptionsClick={onOptionsClickMock}
      onClickOutside={onClickOutsideMock}
      onExpandClick={expandClickMock}
      {...props}
    />
  );
};

describe("List Item", () => {
  it("Should render Title and ListItemWrapper", () => {
    const { container } = callRender(renderWithTheme);

    expect(container).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();

    const contentContainer = screen.getByTestId("list-item-content");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer.children.length).toBe(1);

    expect(screen.getByText("ListItemWrapper")).toBeInTheDocument();
    const { onOptionsClick, onClick, onExpandClick, onClickOutside } =
      ListItemWrapperMock.mock.lastCall[0];

    act(() => {
      onOptionsClick();
    });
    expect(onOptionsClickMock).toHaveBeenCalled();

    act(() => {
      onClick();
    });
    expect(onChangeMock).toHaveBeenCalled();

    act(() => {
      onExpandClick();
    });
    expect(expandClickMock).toHaveBeenCalled();

    act(() => {
      onClickOutside();
    });
    expect(onClickOutsideMock).toHaveBeenCalled();
  });

  it("Should render Subtitle", () => {
    callRender(renderWithTheme, { subtitle: "I3S" });
    const contentContainer = screen.getByTestId("list-item-content");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer.children.length).toBe(2);

    const subtitle = contentContainer.children[1];
    expect(subtitle.innerHTML).toBe('I3S')
  });

  it("Should render Radio List Item", () => {
    const { container } = callRender(renderWithTheme, { type: 0 });
    expect(container).toBeInTheDocument();

    expect(screen.getByText("RadioButton")).toBeInTheDocument();
    const { onChange } = RadioButtonMock.mock.lastCall[0];

    act(() => {
      onChange();
    });

    expect(onChangeMock).toHaveBeenCalledWith("test");
  });

  it("Should render CheckBox List Item", () => {
    const { container } = callRender(renderWithTheme, { type: 1 });
    expect(container).toBeInTheDocument();

    expect(screen.getByText("CheckBox")).toBeInTheDocument();
    const { onChange } = CheckboxMock.mock.lastCall[0];

    act(() => {
      onChange();
    });

    expect(onChangeMock).toHaveBeenCalledWith("test");
  });
});
