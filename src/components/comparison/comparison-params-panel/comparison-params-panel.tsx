import styled from "styled-components";
import { useAppLayout } from "../../../utils/layout";
import { ToggleSwitch } from "../../toogle-switch/toggle-switch";
import {
  Container,
  PanelHeader,
  CloseButton,
  HorizontalLine,
  Panels,
} from "../common";

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
    <Container id={id} layout={layout}>
      <PanelHeader panel={Panels.ComparisonParams}>
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
          onChange={onGeometryChange}
        />
      </ItemContainer>
      <ItemContainer>
        <Title>Compressed textures</Title>
        <ToggleSwitch
          id={`${id}-textures`}
          checked={isCompressedTextures}
          onChange={onTexturesChange}
        />
      </ItemContainer>
    </Container>
  );
};
