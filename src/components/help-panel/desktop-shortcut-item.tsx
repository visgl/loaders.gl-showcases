import type { HelpShortcutItem } from "../../types";

import styled from "styled-components";

type ContainerProps = {
  active: boolean;
};

type DesktopShortcutItemProps = {
  shortcut: HelpShortcutItem;
  active: boolean;
  onHover: (id: string) => void;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  border-radius: 12px;
  background: ${({ active, theme }) =>
    active ? theme.colors.mainHiglightColor : "transparent"};
  cursor: pointer;
  width: 571px;
`;

const TextBlock = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  margin-left: 40px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ImageBlock = styled.div`
  flex-shrink: 0;
`;

export const DesktopShortcutItem = ({
  shortcut,
  active,
  onHover,
}: DesktopShortcutItemProps) => {
  return (
    <Container
      data-testid={shortcut.id}
      active={active}
      onMouseOver={() => onHover(shortcut.id)}
    >
      <ImageBlock>{shortcut.icon}</ImageBlock>
      <TextBlock>{shortcut.text}</TextBlock>
    </Container>
  );
};
