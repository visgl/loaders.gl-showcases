import styled from "styled-components";

const PLACEHOLDER_TEXT = "Hover over gesture to see animation";

type DesktopVideoPanelProps = {
  video?: string;
};

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 312px;
  height: 100%;
  background: transparent;
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

const VideoPlayer = styled.video`
  object-fit: cover;
  width: 312px;
`;

export const DesktopVideoPanel = ({ video }: DesktopVideoPanelProps) => {
  return (
    <Container>
      {video && <VideoPlayer autoPlay src={video} />}
      {!video && <Placeholder>{PLACEHOLDER_TEXT}</Placeholder>}
    </Container>
  );
};
