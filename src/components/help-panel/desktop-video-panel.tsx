import { useEffect, useState } from "react";
import styled from "styled-components";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

const PLACEHOLDER_TEXT = "Hover over gesture to see animation";

interface DesktopVideoPanelProps {
  video?: string;
}

interface VisibilityProps {
  visible: boolean;
}

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 312px;
  height: 100%;
  background: transparent;
  position: relative;
`;

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  margin: 0 47px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const VideoPlayer = styled.video<VisibilityProps>`
  object-fit: cover;
  width: 312px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const SpinnerContainer = styled.div<VisibilityProps>`
  position: absolute;
  left: calc(50% - 22px);
  top: calc(50% - 22px);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const DesktopVideoPanel = ({ video }: DesktopVideoPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [video]);

  return (
    <Container>
      <SpinnerContainer visible={!!video && isLoading}>
        <LoadingSpinner />
      </SpinnerContainer>
      {video && (
        <VideoPlayer
          visible={!isLoading}
          data-testid="shortcut-video-player"
          autoPlay
          loop
          src={video}
          onLoadedData={() => { setIsLoading(false); }}
        />
      )}
      {!video && <Placeholder>{PLACEHOLDER_TEXT}</Placeholder>}
    </Container>
  );
};
