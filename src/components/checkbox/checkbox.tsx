import React from "react";
import styled from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import { SelectionState } from "../../types";

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

const Icon = styled.svg`
  fill: none;
  stroke: ${color_canvas_primary_inverted};
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

const StyledCheckbox = styled.div<{ checkedState: SelectionState }>`
  width: 24px;
  height: 24px;
  background: ${({ checkedState }) => {
    switch (checkedState) {
      case SelectionState.selected:
      case SelectionState.partiallySelected:
        return color_brand_tertiary;
      default:
        return "transparent";
    }
  }};
  border: 1px solid ${color_brand_tertiary};
  border-radius: 4px;

  &:hover {
    background: ${({ checkedState }) => {
    switch (checkedState) {
      case SelectionState.selected:
      case SelectionState.partiallySelected:
        return dim_brand_tertinary;
      default:
        return "transparent";
    }
  }}
    border: 1px solid ${dim_brand_tertinary};
  }

  ${Icon} {
    visibility: ${({ checkedState }) => {
    switch (checkedState) {
      case SelectionState.selected:
      case SelectionState.partiallySelected:
        return "visible";
      default:
        return "hidden";
    }
  }};
`;

export const Checkbox = ({ id, onChange, checked: checkedState, ...rest }: CheckboxProps) => {
  const checked = checkedState == SelectionState.selected;

  return (
    <CheckboxContainer>
      <HiddenCheckbox id={id} checked={checked} onChange={onChange} {...rest} />
      <StyledCheckbox id={`${id}-icon`} checkedState={checkedState}>
        {checkedState === SelectionState.selected &&
          (<Icon  viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>)
        }
        {checkedState === SelectionState.partiallySelected &&
          (<Icon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="12" width="12" height="1" />
          </Icon>)
        }
      </StyledCheckbox>
    </CheckboxContainer>
  )
}

