import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { CollapseDirection, ExpandState } from "../../types";
import { ExpandIcon } from "../expand-icon/expand-icon";

import PlusIcon from "../../../public/icons/plus.svg?svgr";
import MinusIcon from "../../../public/icons/minus.svg?svgr";
import PanIcon from "../../../public/icons/pan.svg?svgr";
import OrbitIcon from "../../../public/icons/orbit.svg?svgr";
import CompassIcon from "../../../public/icons/compass.svg?svgr";

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

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.mainColor};
  background-position: center;
  border: none;
  fill: ${({ theme }) => theme.colors.buttonIconColor};

  &:hover {
    fill: ${({ theme }) => theme.colors.buttonDimIconColor};
    background-color: ${({ theme }) => theme.colors.buttonDimColor};
  }
`;

export const MapControllPanel = () => {
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
    <Container>
      <ExpandIcon
        expandState={expandState}
        collapseDirection={CollapseDirection.bottom}
        fillExpanded={theme.colors.mapControlExpanderDimColor}
        fillCollapsed={theme.colors.mapControlExpanderColor}
        onClick={onExpandClickHandler}
      />
      {expandState === ExpandState.expanded && (
        <>
          <Button>
            <PlusIcon />
          </Button>
          <Button>
            <MinusIcon />
          </Button>
          <Button>
            <PanIcon />
          </Button>
          <Button>
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
