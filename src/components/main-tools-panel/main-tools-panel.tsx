import styled from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
  dim_brand_tertinary,
} from "../../constants/colors";
import GearIcon from "../../../public/icons/gear.svg";
import SettingsIcon from "../../../public/icons/settings.svg";
import MemoryIcon from "../../../public/icons/memory.svg";
import { ActiveButton, Layout } from "../../types";
import { useAppLayout } from "../../utils/layout";

type MainToolsPanelProps = {
  id: string;
  activeButton: ActiveButton;
  showLayerOptions?: boolean;
  showComparisonSettings?: boolean;
  onChange?: (active: ActiveButton) => void;
};

type ContainerProps = {
  id: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.mainCanvasColor};
  border-radius: 12px;
  padding: 2px;
`;

type ButtonProps = {
  active: boolean;
  layout: Layout;
};
const Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 56px;
  height: 60px;
  cursor: pointer;
  fill: ${({ theme, active }) =>
    active
      ? color_canvas_primary_inverted
      : theme.colors.mainToolsPanelIconColor};
  background-color: ${({ active }) =>
    active ? color_brand_tertiary : "transparent"};
  outline: 0;
  border: none;

  &:hover {
    fill: ${({ theme, active }) =>
      active
        ? color_canvas_primary_inverted
        : theme.colors.mainToolsPanelDimIconColor};
    background-color: ${({ active }) =>
      active ? dim_brand_tertinary : "transparent"};
  }
`;

export const MainToolsPanel = ({
  id,
  activeButton,
  showLayerOptions = true,
  showComparisonSettings = true,
  onChange = () => ({}),
}: MainToolsPanelProps) => {
  const layout = useAppLayout();

  return (
    <Container id={id}>
      {showLayerOptions && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.options}
          onClick={() => onChange(ActiveButton.options)}
        >
          <GearIcon />
        </Button>
      )}
      {showComparisonSettings && (
        <Button
          layout={layout}
          active={activeButton === ActiveButton.settings}
          onClick={() => onChange(ActiveButton.settings)}
        >
          <SettingsIcon />
        </Button>
      )}
      <Button
        layout={layout}
        active={activeButton === ActiveButton.memory}
        onClick={() => onChange(ActiveButton.memory)}
      >
        <MemoryIcon />
      </Button>
    </Container>
  );
};
