import styled from "styled-components";

type HelpPanelProps = {
  onClose: () => void;
};

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 65px;
  height: calc(100% - 65px);
  width: 100%;
  z-index: 100;
  background: #23243080;
`;

const Container = styled.div`
  position: absolute;
  border-radius: 8px;
  z-index: 101;
  background: ${({ theme }) => theme.colors.mainHelpPanelColor};
  width: 1220px;
  height: 622px;
  left: calc(50% - 610px);
  top: calc(50% - 311px);
`;

export const NonDesktopHelpPanel = ({ onClose }: HelpPanelProps) => {
  return (
    <>
      <Overlay onClick={onClose} />
      <Container>Hello World!!!!</Container>
    </>
  );
};
