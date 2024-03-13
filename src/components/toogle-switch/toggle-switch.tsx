import styled, { css } from "styled-components";
import {
  color_canvas_primary_inverted,
  dim_canvas_tertiary,
} from "../../constants/colors";

const Switch = styled.div`
  position: relative;
  width: 28px;
  height: 18px;
`;

const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`;

const Label = styled.label<{
  title?: string;
  htmlFor?: string;
  disabled: boolean;
}>`
  font-size: 6px;
  width: 28px;
  height: 18px;
  border-radius: 8px;
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;
    `}
  ${Input} {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span<{ disabled: boolean }>`
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.switchDisabledBackground};
  transition: 0.4s;
  border-radius: 8px;
  &::after {
    color: ${color_canvas_primary_inverted};
  }
  &::before {
    position: absolute;
    top: 2px;
    left: 2px;
    content: "";
    width: 13px;
    height: 13px;
    background-color: ${color_canvas_primary_inverted};
    transition: 0.4s;
    border-radius: 8px;
  }
  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        background-color: ${({ theme }) =>
          theme.colors.switchDisabledBackgroundHovered};
      }
    `}

  ${Input}:checked + & {
    background: ${({ theme }) => theme.colors.switchCheckedBackground};
    ${({ disabled }) =>
      !disabled &&
      css`
        &:hover {
          background: ${({ theme }) =>
            theme.colors.switchCheckedBackgroundHovered};
        }
      `}
  }

  ${Input}:checked + &::before {
    -webkit-transform: translateX(11px);
    -ms-transform: translateX(11px);
    transform: translateX(11px);
  }

  ${Input}:disabled + &::before {
    background-color: ${dim_canvas_tertiary};
  }
`;

type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
  name?: string;
  id?: string;
  title?: string;
  disabled?: boolean;
};

export const ToggleSwitch = ({
  checked,
  onChange,
  name = "",
  id = "",
  title = "",
  disabled = false,
}: ToggleSwitchProps) => {
  return (
    <Switch>
      <Label htmlFor={id} title={title} disabled={disabled}>
        <Input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          title={title}
          onChange={onChange}
        />
        <Slider disabled={disabled} />
      </Label>
    </Switch>
  );
};
