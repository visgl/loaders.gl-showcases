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

const CheckboxContainer = styled.div<CheckmarkProps>`
  height: 25px;
  width: 25px;
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
