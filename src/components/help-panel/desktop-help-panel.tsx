import { DesktopShortcutTabs } from "./desktop-shortcuts-tabs";

import styled from "styled-components";
import { type HelpPanelSelectedTab, type HelpShortcutItem } from "../../types";
import { DesktopShortcutsListPanel } from "./desktop-shortcut-list-panel";
import { CloseButton } from "../close-button/close-button";
import { DesktopVideoPanel } from "./desktop-video-panel";

interface HelpPanelProps {
  shortcuts: HelpShortcutItem[];
  activeShortcutId: string;
  selectedTab: HelpPanelSelectedTab;
  onTabSelect: (tab: HelpPanelSelectedTab) => void;
  onClose: () => void;
  onShortcutHover: (id: string) => void;
}

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 65px;
  height: calc(100% - 65px);
  width: 100%;
  z-index: 100;
  background: ${({ theme }) => theme.colors.mainColor};
  opacity: 0.5;
`;

const Container = styled.div`
  display: flex;
  position: absolute;
  border-radius: 8px;
  z-index: 101;
  background: ${({ theme }) => theme.colors.mainHelpPanelColor};
  width: 1220px;
  height: 622px;
  left: calc(50% - 610px);
  top: calc(50% - 311px);
`;

const SplitLine = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.colors.mainDimColor};
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.mainHelpPanelColor};
`;

export const DesktopHelpPanel = ({
  selectedTab,
  onTabSelect,
  onClose,
  shortcuts,
  activeShortcutId,
  onShortcutHover,
}: HelpPanelProps) => {
  const currentShortcut = shortcuts.find(
    (shortcut) => shortcut.id === activeShortcutId
  );

  const video = currentShortcut?.video;
  return (
    <>
      <Overlay onClick={onClose} />
      <Container>
        <DesktopShortcutTabs
          selectedTab={selectedTab}
          onTabSelect={onTabSelect}
        />
        <DesktopShortcutsListPanel
          activeShortcutId={activeShortcutId}
          shortcuts={shortcuts}
          onHover={onShortcutHover}
        />
        <SplitLine />
        <DesktopVideoPanel video={video} />
        <CloseButtonWrapper>
          <CloseButton onClick={onClose} />
        </CloseButtonWrapper>
      </Container>
    </>
  );
};
