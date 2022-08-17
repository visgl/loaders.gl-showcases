import styled from "styled-components";
import { HelpShortcutItem } from "../../types";
import { DesktopShortcutItem } from "./desktop-shortcut-item";

type DesktopShortcutsListPanelProps = {
  activeShortcutId: string;
  shortcuts: HelpShortcutItem[];
  onHover: (id: string) => void;
};

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 635px;
  height: 100%;
  background: transparent;
`;

export const DesktopShortcutsListPanel = ({
  activeShortcutId,
  shortcuts,
  onHover,
}: DesktopShortcutsListPanelProps) => {
  return (
    <Container>
      {shortcuts.map((shortcut) => (
        <DesktopShortcutItem
          key={shortcut.id}
          shortcut={shortcut}
          active={shortcut.id == activeShortcutId}
          onHover={onHover}
        />
      ))}
    </Container>
  );
};
