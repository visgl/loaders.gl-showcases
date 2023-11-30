import styled from "styled-components";
import { color_brand_tertiary } from "../../constants/colors";
import { ButtonSize } from "../../types";
import DownloadIcon from "../../../public/icons/download-2.svg";
import EsriIcon from "../../../public/icons/esri.svg"; 

type LoginButtonProps = {
  children?: React.ReactNode;
  buttonSize: ButtonSize;
  grayed?: boolean;
  onClick?: () => void;
};

const LoginImage = styled(DownloadIcon)`
  display: flex;
  position: relative;
  left: 5px;
  height: ${(props) => (props.buttonSize === ButtonSize.Big ? "30px" : "14px")};
  fill: ${color_brand_tertiary};
`;

const EsriImage = styled(EsriIcon)`
  display: flex;
  position: relative;
  left: 5px;
  height: 14px;
  fill: ${({ theme }) => theme.colors.fontColor};
`;

const LoginImageContainer = styled.div<{ buttonSize: number, grayed?: boolean }>`
  display: flex;
  position: relative;
  width: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};
  height: ${(props) => (props.buttonSize === ButtonSize.Big ? "40px" : "24px")};
  // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
  background: ${(props) => (!props.grayed ? 'rgba(96, 93, 236, 0.4)' : 'rgba(128, 128, 128, 0.6)')};
  border-radius: 4px;
  margin-right: 16px;
  align-items: center;
  `;

const ButtonText = styled.div<{ grayed?: boolean }>`
  display: flex;
  position: relative;
  color: ${(props) => (!props.grayed ? color_brand_tertiary : 'rgba(128, 128, 128, 0.6)')};
  align-items: center;
`;

const Button = styled.div<{ grayed?: boolean }>`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 28px;

  &:hover {
    > * {
      &:first-child {
        // Keep rgba format to avoid issue with opacity inheritance and pseudo elements.
        background: ${(props) => (!props.grayed ? 'rgba(96, 93, 236, 0.2)' : 'rgba(128, 128, 128, 0.3)')};
      }
    }
  }

`;

export const LoginButton = ({
  children,
  buttonSize,
  grayed,
  onClick,
}: LoginButtonProps) => {
  return (
    <Button onClick={onClick} grayed={grayed}>
      <LoginImageContainer buttonSize={buttonSize} grayed={grayed}>
        <LoginImage buttonSize={buttonSize}/>
      </LoginImageContainer>
      <ButtonText grayed={grayed}>{children}<EsriImage buttonSize={buttonSize}/></ButtonText>
      
    </Button>
  );
};



