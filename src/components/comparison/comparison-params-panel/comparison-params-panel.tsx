import { useState } from "react";
import styled from "styled-components";
import { useAppLayout } from "../../../utils/layout";
import { ToggleSwitch } from "../../toogle-switch/toggle-switch";
import { Container, PanelHeader, HorizontalLine, Panels } from "../common";
import { CloseButton } from "../../close-button/close-button";

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0px;
  background: transparent;
  margin-bottom: 8px;
`;

type ComparisonParamsProps = {
  id: string;
  onClose: () => void;
};

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
      <PanelHeader panel={Panels.ComparisonParams}>
        <Title>Comparison parameters</Title>
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={onClose}
        />
      </PanelHeader>
      <HorizontalLine top={20}/>
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
