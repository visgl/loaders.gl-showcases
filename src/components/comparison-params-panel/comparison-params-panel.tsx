import { useState } from "react";
import styled from "styled-components";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";
import { Theme } from "../../types";
import { ToggleSwitch } from "../toogle-switch/toggle-switch";

type ComparisonParamsProps = {
  id: string;
  onClose: () => void;
};

type LayoutProps = {
  layout: string;
};

const Container = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 359px;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  opacity: ${({ theme }) => (theme.name === Theme.Dark ? 0.9 : 1)};
  border-radius: 8px;
  padding-bottom: 26px;
  position: relative;

  max-height: ${getCurrentLayoutProperty({
    desktop: "408px",
    tablet: "408px",
    mobile: "calc(50vh - 110px)",
  })};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  position: relative;
  border-radius: 8px;
  margin-top: 20px;
  gap: 32px;
`;

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const CloseButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  right: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &::after,
  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.fontColor};
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    &::before,
    &::after {
      background-color: ${({ theme }) => theme.colors.mainDimColorInverted};
    }
  }
`;

const HorizontalLine = styled.div`
  margin: 20px 16px 16px 16px;
  border: 1px solid ${({ theme }) => theme.colors.mainHiglightColorInverted};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.mainHiglightColorInverted};
  opacity: 0.12;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0px;
  background: transparent;
  margin-bottom: 8px;
`;

export const ComparisonParamsPanel = ({
  id,
  onClose,
}: ComparisonParamsProps) => {
  const [isCompressedGeometry, setIsCompressedGeometry] =
    useState<boolean>(false);
  const [isCompressedTextures, setIsCompressedTextures] =
    useState<boolean>(false);
  const layout = useAppLayout();

  const handleGeometryChange = () => {
    setIsCompressedGeometry((prevValue) => !prevValue);
  };

  const handleTexturesChange = () => {
    setIsCompressedTextures((prevValue) => !prevValue);
  };

  return (
    <Container id={id} layout={layout}>
      <PanelHeader>
        <Title>Comparison parameters</Title>
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={onClose}
        />
      </PanelHeader>
      <HorizontalLine />
      <ItemContainer>
        <Title> Draco compressed geometry</Title>
        <ToggleSwitch
          id={`${id}-geometry`}
          checked={isCompressedGeometry}
          onChange={handleGeometryChange}
        />
      </ItemContainer>
      <ItemContainer>
        <Title>Compressed textures</Title>
        <ToggleSwitch
          id={`${id}-textures`}
          checked={isCompressedTextures}
          onChange={handleTexturesChange}
        />
      </ItemContainer>
    </Container>
  );
};
