import styled, { css } from "styled-components";
import { CollapseDirection, ExpandState } from "../../types";
import { SyntheticEvent } from "react";
import ChevronIcon from "../../../public/icons/chevron.svg";

const IconButton = styled.div<{
  expandState: ExpandState;
  collapseDirection: CollapseDirection;
  fillExpanded?: string;
  fillCollapsed?: string;
}>`
  transform: rotate(
    ${({ expandState, collapseDirection }) => {
      if (collapseDirection === CollapseDirection.bottom) {
        return `${expandState === ExpandState.expanded ? "-" : ""}90deg`;
      }
      return `${expandState === ExpandState.expanded ? "" : "-"}90deg`;
    }}
  );
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${({ theme, expandState, fillExpanded, fillCollapsed }) => {
    if (expandState === ExpandState.expanded) {
      if (fillExpanded) {
        return css`
          fill: ${fillExpanded};
        `;
      }
    } else {
      if (fillCollapsed) {
        return css`
          fill: ${fillCollapsed};
        `;
      }
    }
    return css`
      fill: ${theme.colors.fontColor};
    `;
  }}

  &:hover {
    opacity: 0.8;
  }
`;

type ExpandIconProps = {
  /**id of icon*/
  id: string;
  /** expanded/collapsed */
  expandState: ExpandState;
  /** direction expander collapse to */
  collapseDirection?: CollapseDirection;
  /** icon color for expanded state */
  fillExpanded?: string;
  /** icon color for collapsed state */
  fillCollapsed?: string;
  /** click event handler */
  onClick: (e: SyntheticEvent) => void;
};
export const ExpandIcon = ({
  id,
  expandState,
  onClick,
  fillExpanded,
  fillCollapsed,
  collapseDirection = CollapseDirection.top,
}: ExpandIconProps) => {
  return (
    <IconButton
      id={id}
      expandState={expandState}
      collapseDirection={collapseDirection}
      fillExpanded={fillExpanded}
      fillCollapsed={fillCollapsed}
      onClick={onClick}
    >
      <ChevronIcon />
    </IconButton>
  );
};
