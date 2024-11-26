import type { HelpShortcutItem } from "../../types";
import styled from "styled-components";
import { CloseButton } from "../close-button/close-button";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

interface NonDesktopVideoPanelProps {
  shortcut: HelpShortcutItem;
  onCloseVideoPanel: () => void;
}

interface VisibilityProps {
  visible: boolean;
}

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

const VideoPlayer = styled.video<VisibilityProps>`
  height: calc(100% - 56px);
  object-fit: cover;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const SpinnerContainer = styled.div<VisibilityProps>`
  position: absolute;
  left: calc(50% - 22px);
  top: calc(50% - 22px);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const NonDesktopVideoPanel = ({
  shortcut,
  onCloseVideoPanel,
}: NonDesktopVideoPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [shortcut.video]);

  return (
    <Container>
      <Header>
        <Text>{shortcut.title}</Text>
        <CloseButtonWrapper>
          <CloseButton onClick={onCloseVideoPanel} />
        </CloseButtonWrapper>
      </Header>
      <SpinnerContainer visible={!!shortcut.video && isLoading}>
        <LoadingSpinner />
      </SpinnerContainer>
      <VideoPlayer
        visible={!isLoading}
        data-testid="shortcut-non-desktop-video-player"
        autoPlay
        loop
        src={shortcut.video}
        onLoadedData={() => { setIsLoading(false); }}
      />
    </Container>
  );
};
