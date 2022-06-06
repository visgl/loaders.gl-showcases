import styled, { css } from "styled-components";
import {
  color_ui_primary,
  color_canvas_inverted,
} from "../../constants/colors";

type RadioButtonProps = {
  id: string;
  name?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

type CheckmarkProps = {
  id?: string;
  checked: boolean;
};

const CheckboxContainer = styled.div<CheckmarkProps>`
  height: 24px;
  width: 24px;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Checkmark = styled.span<CheckmarkProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: 1px solid ${color_ui_primary};
  border-radius: 50%;

  &::after {
    content: "";
    top: calc(50% - 6px);
    left: calc(50% - 6px);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    position: absolute;
    display: none;
  }

  ${({ checked }) =>
    checked &&
    css`
      background-color: ${color_ui_primary};
      &::after {
        display: block;
        background-color: ${color_canvas_inverted};
      }
    `}
`;

export const RadioButton = ({
  id,
  name = "radio",
  checked,
  disabled = false,
  onChange,
}: RadioButtonProps) => (
  <CheckboxContainer id={id} checked={checked}>
    <Input
      type="radio"
      checked={checked}
      name={name}
      onChange={onChange}
      disabled={disabled}
    />
    <Checkmark checked={checked} />
  </CheckboxContainer>
);
