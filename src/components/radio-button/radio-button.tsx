import styled, { css } from "styled-components";
import { primaryViolet, white } from "../../constants/colors";

type RadioButtonProps = {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

type CheckmarkProps = {
  id?: string;
  checked: boolean;
};

const CheckboxContainer = styled.label<CheckmarkProps>`
  display: block;
  position: relative;
  margin-bottom: 12px;
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
  top: -8px;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: transparent;
  border: 1px solid ${primaryViolet};
  border-radius: 50%;

  &::after {
    content: "";
    top: 5.5px;
    left: 5.5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    position: absolute;
    display: none;
  }

  ${({ checked }) =>
    checked &&
    css`
      background-color: ${primaryViolet};
      &::after {
        display: block;
        background-color: ${white};
      }
    `}
`;

export const RadioButton = ({
  id,
  checked,
  disabled = false,
  onChange,
}: RadioButtonProps) => (
  <CheckboxContainer id={id} checked={checked}>
    <Input
      type="radio"
      checked={checked}
      name="radio"
      onChange={onChange}
      disabled={disabled}
    />
    <Checkmark checked={checked} />
  </CheckboxContainer>
);
