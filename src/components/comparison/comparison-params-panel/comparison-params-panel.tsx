import { ToggleSwitch } from "../../toogle-switch/toggle-switch";
import {
  Container,
  PanelHeader,
  HorizontalLine,
  Panels,
  Title,
  ItemContainer,
} from "../common";
import { CloseButton } from "../../close-button/close-button";
import { useAppLayout } from "../../../utils/hooks/layout";

type ComparisonParamsProps = {
  id: string;
  isCompressedGeometry: boolean;
  isCompressedTextures: boolean;
  textureSetDefinitions: string[];
  onGeometryChange: () => void;
  onTexturesChange: () => void;
  onClose: () => void;
};

export const ComparisonParamsPanel = ({
  id,
  isCompressedGeometry,
  isCompressedTextures,
  textureSetDefinitions,
  onGeometryChange,
  onTexturesChange,
  onClose,
}: ComparisonParamsProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id} layout={layout}>
      <PanelHeader panel={Panels.ComparisonParams}>
        <Title left={16}>Comparison parameters</Title>
        <CloseButton
          id="comparison-parms-panel-close-button"
          onClick={onClose}
        />
      </PanelHeader>
      <HorizontalLine top={20} />
      <ItemContainer>
        <Title left={16}> Draco compressed geometry</Title>
        <ToggleSwitch
          id={`${id}-geometry`}
          checked={isCompressedGeometry}
          onChange={onGeometryChange}
        />
      </ItemContainer>
      <ItemContainer>
        <Title left={16}>{`Compressed textures${textureSetDefinitions?.length ? ` (${textureSetDefinitions.join(', ')})` : ''}`}</Title>
        <ToggleSwitch
          id={`${id}-textures`}
          checked={isCompressedTextures}
          onChange={onTexturesChange}
        />
      </ItemContainer>
    </Container>
  );
};
