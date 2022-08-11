import type { HelpShortcutItem } from "../../types";
import styled from "styled-components";
import { CloseButton } from "../close-button/close-button";

type NonDesktopVideoPanelProps = {
  shortcut: HelpShortcutItem;
  onCloseVideoPanel: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 79px;
  left: 0;
  height: calc(100vh - 79px);
  width: 100%;
  background: ${({ theme }) => theme.colors.mainColor};
  z-index: 104;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  position: relative;
`;

const Text = styled.div`
  color: ${({ theme }) => theme.colors.fontColor};
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 0;
`;

const VideoPlayer = styled.video`
  height: calc(100% - 56px);
  object-fit: cover;
`;

export const NonDesktopVideoPanel = ({
  shortcut,
  onCloseVideoPanel,
}: NonDesktopVideoPanelProps) => {
  return (
    <Container>
      <Header>
        <Text>{shortcut.title}</Text>
        <CloseButtonWrapper>
          <CloseButton onClick={onCloseVideoPanel} />
        </CloseButtonWrapper>
      </Header>
      <VideoPlayer
        data-testid="shortcut-non-desktop-video-player"
        autoPlay
        loop
        src={shortcut.video}
      />
    </Container>
  );
};
