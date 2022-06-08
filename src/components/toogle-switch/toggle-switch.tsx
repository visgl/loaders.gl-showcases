import styled from "styled-components";
import { color_canvas_inverted } from "../../constants/colors";

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
}>`
  font-size: 6px;
  width: 28px;
  height: 18px;
  border-radius: 8px;
  cursor: pointer;
  ${Input} {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 1px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(250, 250, 250, 0.2);
  transition: 0.4s;
  border-radius: 8px;
  &::after {
    color: ${color_canvas_inverted};
  }
  &::before {
    position: absolute;
    top: 2px;
    left: 2px;
    content: "";
    width: 13px;
    height: 13px;
    background-color: ${color_canvas_inverted};
    transition: 0.4s;
    border-radius: 8px;
  }

  ${Input}:checked + & {
    background: #4f52cc;
  }

  ${Input}:checked + &::before {
    -webkit-transform: translateX(11px);
    -ms-transform: translateX(11px);
    transform: translateX(11px);
  }
`;

/**
 * TODO: Add types to component
 */
export const ToggleSwitch = ({
  checked,
  onChange,
  name = "",
  id = "",
  title = "",
}) => {
  return (
    <Switch>
      <Label htmlFor={id} title={title}>
        <Input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          title={title}
          onChange={onChange}
        />
        <Slider />
      </Label>
    </Switch>
  );
};
