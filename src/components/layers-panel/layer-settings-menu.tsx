import { ReactNode, useCallback, useState } from "react";
import styled from "styled-components";
import { useClickOutside } from "../../utils/hooks/use-click-outside-hook";

const Container = styled.div<{ top: number }>`
  position: absolute;
  width: 202px;
  right: 36px;
  border-radius: 8px;
  top: ${({ top }) => `${top + 10}px`};
  background: ${({ theme }) => theme.colors.mainColor};
  color: ${({ theme }) => theme.colors.fontColor};

  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const LayerSettingsMenu = ({
  forElementNode,
  onCloseHandler,
  children,
}: {
  forElementNode?: HTMLDivElement | null;
  onCloseHandler: () => void;
  children: ReactNode;
}) => {
  const [refNode, setRefNode] = useState<HTMLDivElement | null>(null);
  const settingsButtonNode =
    forElementNode &&
    forElementNode.getElementsByClassName("layer-settings")?.[0];
  useClickOutside([refNode, settingsButtonNode], onCloseHandler);

  const changeRefNode = useCallback((node: HTMLDivElement | null) => {
    setRefNode(node);
  }, []);

  let top = 0;
  if (forElementNode) {
    const { offsetTop } = forElementNode;
    top = offsetTop;
  }

  return (
    <Container ref={changeRefNode} top={top}>
      {children}
    </Container>
  );
};
