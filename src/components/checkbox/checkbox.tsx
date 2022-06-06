import styled from "styled-components";
import {
  color_canvas_inverted,
  color_ui_primary,
  dim_ui_primary,
} from "../../constants/colors";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
};

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  position: relative;
`;

const Icon = styled.svg`
  fill: none;
  stroke: ${color_canvas_inverted};
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  background: ${({ checked }) => (checked ? color_ui_primary : "transparent")};
  border: 1px solid ${color_ui_primary};
  border-radius: 4px;

  &:hover {
    background: ${({ checked }) => (checked ? dim_ui_primary : "transparent")};
    border: 1px solid ${dim_ui_primary};
  }

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;

export const Checkbox = ({ id, checked, onChange }: CheckboxProps) => (
  <CheckboxContainer>
    <HiddenCheckbox checked={checked} onChange={onChange} />
    <StyledCheckbox checked={checked}>
      <Icon id={`${id}-icon`} viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);
