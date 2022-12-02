import { ToggleSwitch } from "../../toogle-switch/toggle-switch";
import {
  PanelContainer,
  PanelHeader,
  PanelHorizontalLine,
  Panels,
  Title,
} from "../../common";
import { CloseButton } from "../../close-button/close-button";
import { useAppLayout } from "../../../utils/hooks/layout";
import styled from "styled-components";

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0px;
  margin-bottom: 8px;
`;

type ComparisonParamsProps = {
  id: string;
  isCompressedGeometry: boolean;
  isCompressedTextures: boolean;
  onGeometryChange: () => void;
  onTexturesChange: () => void;
  onClose: () => void;
};

export const ComparisonParamsPanel = ({
  id,
  isCompressedGeometry,
  isCompressedTextures,
  onGeometryChange,
  onTexturesChange,
  onClose,
}: ComparisonParamsProps) => {
  const layout = useAppLayout();

  return (
    <PanelContainer id={id} layout={layout}>
      <PanelHeader panel={Panels.ComparisonParams}>
        <Title left={16}>Comparison parameters</Title>
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={onClose}
        />
      </PanelHeader>
      <PanelHorizontalLine top={20} />
      <ItemContainer>
        <Title left={16}> Draco compressed geometry</Title>
        <ToggleSwitch
          id={`${id}-geometry`}
          checked={isCompressedGeometry}
          onChange={onGeometryChange}
        />
      </ItemContainer>
      <ItemContainer>
        <Title left={16}>Compressed textures</Title>
        <ToggleSwitch
          id={`${id}-textures`}
          checked={isCompressedTextures}
          onChange={onTexturesChange}
        />
      </ItemContainer>
    </PanelContainer>
  );
};
