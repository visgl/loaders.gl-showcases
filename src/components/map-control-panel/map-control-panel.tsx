import styled, { useTheme } from "styled-components";
import { CollapseDirection, ExpandState, DragMode, LayoutProps } from "../../types";
import { ExpandIcon } from "../expand-icon/expand-icon";

import PlusIcon from "../../../public/icons/plus.svg";
import MinusIcon from "../../../public/icons/minus.svg";
import PanIcon from "../../../public/icons/pan.svg";
import OrbitIcon from "../../../public/icons/orbit.svg";
import CompassIcon from "../../../public/icons/compass.svg";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
} from "../../constants/colors";
import { useExpand } from "../../utils/hooks/use-expand";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/hooks/layout";

const Container = styled.div<LayoutProps & {bottom?: number; right?: number}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.mapControlPanelColor};
  border-radius: 12px;
  padding: 8px;
  gap: 10px;

  right: ${({right}) => getCurrentLayoutProperty({
    desktop: `${(right || 24)}px`,
    tablet: `${(right || 24)}px`,
    mobile: `${(right || 8)}px`,
  })};

  bottom: ${({bottom}) => getCurrentLayoutProperty({
    desktop: `${(bottom || 24)}px`,
    tablet: `${(bottom || 80)}px`,
    mobile: `${(bottom || 80)}px`,
  })};
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
    active ? color_canvas_primary_inverted : theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme, active }) =>
      active ? color_canvas_primary_inverted : theme.colors.buttonDimIconColor};
    background-color: ${({ theme, active = false }) =>
      active ? color_brand_tertiary : theme.colors.buttonDimColor};
  }
`;

type MapControlPanelProps = {
  bearing: number;
  dragMode: DragMode;
  bottom?: number;
  right?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCompassClick: () => void;
  onDragModeToggle: () => void;
};

type CompassProps = {
  degrees: number;
};

const CompassWrapper = styled.div.attrs<CompassProps>(({ degrees }) => ({
  style: {
    transform: `rotate(${-degrees || 0}deg)`,
  },
}))<CompassProps>`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MapControllPanel = ({
  bearing,
  dragMode,
  bottom,
  right,
  onZoomIn,
  onZoomOut,
  onCompassClick,
  onDragModeToggle,
}: MapControlPanelProps) => {
  const [expandState, expand] = useExpand(ExpandState.expanded);

  const theme = useTheme();
  const layout = useAppLayout();

  return (
    <Container id="map-control-panel" layout={layout} bottom={bottom} right={right}>
      <ExpandIcon
        expandState={expandState}
        collapseDirection={CollapseDirection.bottom}
        fillExpanded={theme.colors.mapControlExpanderDimColor}
        fillCollapsed={theme.colors.mapControlExpanderColor}
        onClick={expand}
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
      <Button onClick={onCompassClick}>
        <CompassWrapper degrees={bearing}>
          <CompassIcon />
        </CompassWrapper>
      </Button>
    </Container>
  );
};
