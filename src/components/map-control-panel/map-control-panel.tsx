import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { CollapseDirection, ExpandState, MapControlMode } from "../../types";
import { ExpandIcon } from "../expand-icon/expand-icon";

import PlusIcon from "../../../public/icons/plus.svg";
import MinusIcon from "../../../public/icons/minus.svg";
import PanIcon from "../../../public/icons/pan.svg";
import OrbitIcon from "../../../public/icons/orbit.svg";
import CompassIcon from "../../../public/icons/compass.svg";
import {
  color_brand_tertiary, color_canvas_primary_inverted,
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
    active ? color_canvas_primary_inverted : theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme, active }) =>
      active ? color_canvas_primary_inverted : theme.colors.buttonDimIconColor};
    background-color: ${({ theme, active = false }) =>
      active ? color_brand_tertiary : theme.colors.buttonDimColor};
  }
`;

type MapControlPanelProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export const MapControllPanel = ({
  onZoomIn,
  onZoomOut,
}: MapControlPanelProps) => {
  const [expandState, setExpandState] = useState<ExpandState>(
    ExpandState.expanded
  );
  const [mapControlMode, setMapControllMode] = useState<MapControlMode>(
    MapControlMode.pan
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

  const toggleMapControlMode = () => {
    setMapControllMode((prev) => {
      if (prev === MapControlMode.pan) {
        return MapControlMode.rotate;
      }
      return MapControlMode.pan;
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
          <Button
            active={mapControlMode === MapControlMode.pan}
            onClick={toggleMapControlMode}
          >
            <PanIcon />
          </Button>
          <Button
            active={mapControlMode === MapControlMode.rotate}
            onClick={toggleMapControlMode}
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
