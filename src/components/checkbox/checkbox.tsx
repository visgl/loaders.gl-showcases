import React from "react";
import styled from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import { SelectionState } from "../../types";
import CheckedIcon from "../../../public/icons/checked.svg";
import IndeterminateIcon from "../../../public/icons/indeterminate.svg";

type CheckboxProps = {
  id: string;
  checked: SelectionState;
  onChange: (event: React.ChangeEvent) => void;
};

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  position: relative;
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

const StyledCheckbox = styled.div<{ checkedState: SelectionState }>`
  width: 24px;
  height: 24px;
  background: ${({ checkedState }) => checkedState === SelectionState.unselected ? "transparent" : color_brand_tertiary};
  border: 1px solid ${color_brand_tertiary};
  border-radius: 4px;

  &:hover {
    background: ${({ checkedState }) => checkedState === SelectionState.unselected ? "transparent" : dim_brand_tertinary};
    border: 1px solid ${dim_brand_tertinary};
  }
`;

export const Checkbox = ({ id, onChange, checked: checkedState, ...rest }: CheckboxProps) => {
  const checked = checkedState === SelectionState.selected;

  return (
    <CheckboxContainer>
      <HiddenCheckbox id={id} data-testid={`checkbox-${id}`} checked={checked} onChange={onChange} {...rest} />
      <StyledCheckbox id={`${id}-icon`} checkedState={checkedState}>
        {checkedState === SelectionState.selected && <CheckedIcon data-testid="checkbox-icon" stroke={color_canvas_primary_inverted} />}
        {checkedState === SelectionState.indeterminate && <IndeterminateIcon data-testid="indeterminate-icon" stroke={color_canvas_primary_inverted} />}
      </StyledCheckbox>
    </CheckboxContainer>
  )
}
