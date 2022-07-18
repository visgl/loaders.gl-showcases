import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { CollapseDirection, ExpandState, DragMode } from "../../types";
import { ExpandIcon } from "../expand-icon/expand-icon";

import PlusIcon from "../../../public/icons/plus.svg?svgr";
import MinusIcon from "../../../public/icons/minus.svg?svgr";
import PanIcon from "../../../public/icons/pan.svg?svgr";
import OrbitIcon from "../../../public/icons/orbit.svg?svgr";
import CompassIcon from "../../../public/icons/compass.svg?svgr";
import {
  color_brand_tertiary,
  color_canvas_inverted,
} from "../../constants/colors";

const Container = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.mapControlPanelColor};
  border-radius: 12px;
  padding: 8px;
  gap: 10px;
`;

const Button = styled.button<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-color: ${({ theme, active = false }) =>
    active ? color_brand_tertiary : theme.colors.mainColor};
  background-position: center;
  border: none;
  fill: ${({ theme, active }) =>
    active ? color_canvas_inverted : theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme, active }) =>
      active ? color_canvas_inverted : theme.colors.buttonDimIconColor};
    background-color: ${({ theme, active = false }) =>
      active ? color_brand_tertiary : theme.colors.buttonDimColor};
  }
`;

type MapControlPanelProps = {
  dragMode: DragMode;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDragModeToggle: () => void;
};

export const MapControllPanel = ({
  dragMode,
  onZoomIn,
  onZoomOut,
  onDragModeToggle,
}: MapControlPanelProps) => {
  const [expandState, setExpandState] = useState<ExpandState>(
    ExpandState.expanded
  );

  const theme = useTheme();

  const onExpandClickHandler = () => {
    setExpandState((prev) => {
      if (prev === ExpandState.expanded) {
        return ExpandState.collapsed;
      }
      return ExpandState.expanded;
    });
  };

  return (
    <Container id="map-control-panel">
      <ExpandIcon
        expandState={expandState}
        collapseDirection={CollapseDirection.bottom}
        fillExpanded={theme.colors.mapControlExpanderDimColor}
        fillCollapsed={theme.colors.mapControlExpanderColor}
        onClick={onExpandClickHandler}
      />
      {expandState === ExpandState.expanded && (
        <>
          <Button onClick={onZoomIn}>
            <PlusIcon />
          </Button>
          <Button onClick={onZoomOut}>
            <MinusIcon />
          </Button>
          <Button active={dragMode === DragMode.pan} onClick={onDragModeToggle}>
            <PanIcon />
          </Button>
          <Button
            active={dragMode === DragMode.rotate}
            onClick={onDragModeToggle}
          >
            <OrbitIcon />
          </Button>
        </>
      )}
      <Button>
        <CompassIcon />
      </Button>
    </Container>
  );
};
