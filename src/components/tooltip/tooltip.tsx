import React, { useState, RefObject, useEffect } from "react";
import styled, { css } from "styled-components";
import TipIcon from "../../../public/icons/tip.svg";
import { Layout, TooltipPosition } from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";

const WrapperContainer = styled.div<{
  isMobile: boolean | undefined;
  centerX: number;
  centerY: number;
  shiftX: number;
  shiftY: number;
}>`
  position: fixed;
  top: ${({ centerY }) => centerY}px;
  left: ${({ centerX }) => centerX}px;
  transform: translate(${({ shiftX }) => shiftX}%, ${({ shiftY }) => shiftY}%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
`;

const TipStyled = styled(TipIcon)<{ angle: number }>`
  fill: ${({ theme }) => theme.colors.mainHiglightColor};
  transform: rotate(${({ angle }) => angle}deg);
`;

const TooltipDiv = styled.div<{
  isMobile: boolean | undefined;
}>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.mainHiglightColor};
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  font-weight: 500;
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  white-space: nowrap;

  ${({ isMobile }) =>
    isMobile &&
    css`
      white-space: normal;
      text-align: center;
      max-width: 250px;
    `}
`;

type TooltipProps = {
  refElement: RefObject<HTMLElement>;
  children: React.ReactNode;
  position: TooltipPosition;
  disabled?: boolean;
  margin?: number;
};

export const Tooltip = ({
  refElement,
  children,
  position,
  disabled = false,
  margin = 12,
}: TooltipProps) => {
  const layout = useAppLayout();
  const isMobileLayout = layout !== Layout.Desktop;
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const showTooltip = isHovering || isMobileLayout;

  const onPointerEnter = () => {
    setIsHovering(true);
  };

  const onPointerLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (refElement.current) {
      refElement.current.onpointerenter = onPointerEnter;
      refElement.current.onpointerleave = onPointerLeave;
    }
  }, [refElement.current]);

  let centerX = 0;
  let centerY = 0;
  let shiftX = 0;
  let shiftY = 0;
  let angle = 0;

  if (refElement.current) {
    const rect = refElement.current.getBoundingClientRect();
    switch (position) {
      case TooltipPosition.OnTop:
        centerX = rect.left + rect.width / 2.0;
        centerY = rect.top - margin;
        shiftX = -50; // 50%
        shiftY = -100; // 100%
        angle = 180; // 180deg
        break;
      case TooltipPosition.OnBottom:
        centerX = rect.left + rect.width / 2.0;
        centerY = rect.top + rect.height + margin;
        shiftX = -50;
        shiftY = 0;
        angle = 0;
        break;
    }
  }

  return showTooltip && !disabled ? (
    <WrapperContainer
      isMobile={isMobileLayout}
      centerX={centerX}
      centerY={centerY}
      shiftX={shiftX}
      shiftY={shiftY}
    >
      {position === TooltipPosition.OnBottom && (
        <TipStyled angle={angle}></TipStyled>
      )}
      <TooltipDiv isMobile={isMobileLayout}>{children}</TooltipDiv>
      {position === TooltipPosition.OnTop && (
        <TipStyled angle={angle}></TipStyled>
      )}
    </WrapperContainer>
  ) : (
    <></>
  );
};
