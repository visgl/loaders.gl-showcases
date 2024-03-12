import styled from "styled-components";
import { HelpShortcutItem } from "../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { NonDesktopShortcutItem } from "./non-desktop-shortcut-item";

type NonDesktopShortcutsListPanelProps = {
  shortcuts: HelpShortcutItem[];
  onShortcutClick: (id: string) => void;
};

type ContainerProps = {
  $layout: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  height: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "calc(100% - 256px - 144px)",
    mobile: "calc(100% - 201px - 80px)",
  })};
  gap: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "40px",
    mobile: "16px",
  })};
  margin: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "44px 123px 0px 123px",
    mobile: "10px 0 0 0",
  })};
  overflow-y: auto;
`;

export const NonDesktopShortcutsListPanel = ({
  shortcuts,
  onShortcutClick,
}: NonDesktopShortcutsListPanelProps) => {
  const layout = useAppLayout();
  return (
    <Container $layout={layout}>
      {shortcuts.map((shortcut) => (
        <NonDesktopShortcutItem
          key={shortcut.id}
          shortcut={shortcut}
          onShortcutClick={onShortcutClick}
        />
      ))}
    </Container>
  );
};
