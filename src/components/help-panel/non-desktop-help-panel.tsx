import styled from "styled-components";
import { HelpPanelSelectedTab, HelpShortcutItem } from "../../types";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { CloseButton } from "../close-button/close-button";
import { NonDesktopShortcutsListPanel } from "./non-desktop-shortcuts-list-panel";
import { NonDesktopShortcutTabs } from "./non-desktop-shortcuts-tabs";
import { NonDesktopVideoPanel } from "./non-desktop-video-panel";

type HelpPanelProps = {
  activeShortcutId: string;
  shortcuts: HelpShortcutItem[];
  selectedTab: HelpPanelSelectedTab;
  onTabSelect: (tab: HelpPanelSelectedTab) => void;
  onClose: () => void;
  onShortcutClick: (id: string) => void;
};

type ContainerProps = {
  $layout: string;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  z-index: 101;
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  width: 100%;
  left: 0;
  height: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "calc(100% - 65px)",
    mobile: "calc(100% - 58px)",
  })};
  top: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 6px 13px 16px;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 103;
  background: ${({ theme }) => theme.colors.mainColor};
  opacity: 0.5;
`;

export const NonDesktopHelpPanel = ({
  activeShortcutId,
  shortcuts,
  selectedTab,
  onClose,
  onTabSelect,
  onShortcutClick,
}: HelpPanelProps) => {
  const activeShortcut = shortcuts.find(
    (shortcut) => shortcut.id === activeShortcutId
  );

  const layout = useAppLayout();
  return (
    <>
      <Container $layout={layout}>
        <TitleContainer>
          <Title>Shortcuts</Title>
          <CloseButton onClick={onClose} />
        </TitleContainer>
        <NonDesktopShortcutTabs
          selectedTab={selectedTab}
          onTabSelect={onTabSelect}
        />
        <NonDesktopShortcutsListPanel
          shortcuts={shortcuts}
          onShortcutClick={onShortcutClick}
        />
      </Container>
      {activeShortcut && (
        <>
          <NonDesktopVideoPanel
            shortcut={activeShortcut}
            onCloseVideoPanel={() => onShortcutClick("")}
          />
          <Overlay
            data-testid={"non-desktop-overlay"}
            onClick={() => onShortcutClick("")}
          />
        </>
      )}
    </>
  );
};
