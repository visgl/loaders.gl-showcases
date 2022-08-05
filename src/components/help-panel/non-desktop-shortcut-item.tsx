import type { HelpShortcutItem } from "../../types";

import styled from "styled-components";

import PlayIcon from "../../../public/icons/play.svg?svgr";

type NonDesktopShortcutItemProps = {
  shortcut: HelpShortcutItem;
  onShortcutClick: (id: string) => void;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: transparent;
  width: 100%;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const Text = styled(Title)`
  font-weight: 500;
  margin: 0;
`;

const ImageBlock = styled.div`
  flex-shrink: 0;
`;

export const NonDesktopShortcutItem = ({
  shortcut,
  onShortcutClick,
}: NonDesktopShortcutItemProps) => {
  return (
    <Container data-testid={shortcut.id}>
      <ImageBlock>{shortcut.icon}</ImageBlock>
      <TextBlock>
        <Title>{shortcut.title}</Title>
        <Text>{shortcut.text}</Text>
      </TextBlock>
      <PlayIcon
        data-testid={`play-icon-${shortcut.id}`}
        onClick={() => onShortcutClick(shortcut.id)}
      />
    </Container>
  );
};
