import styled, { useTheme } from "styled-components";
import { CloseButton } from "../close-button/close-button";
import { Title } from "../common";
import ArrowLeft from "../../../public/icons/arrow-left.svg";
import { color_brand_tertiary } from "../../constants/colors";
import ChevronIcon from "../../../public/icons/chevron.svg";

const Container = styled.div`
  position: absolute;
  top: 24px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.fontColor};
  background: ${({ theme }) => theme.colors.mainCanvasColor};
  width: 359px;
  max-height: 75%;
  z-index: 16;
  border-radius: 8px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.title ? "space-between" : "flex-end")};
  align-items: center;
  width: 100%;
`;

const BackButton = styled(ArrowLeft)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ContentWrapper = styled.section`
  overflow-y: auto;
  width: 100%;
`;

const ValidateButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  cursor: pointer;
  margin: 16px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.mainAttibuteItemColor};
  border-radius: 8px;
`;

const ValidatorTitle = styled(Title)`
  color: ${color_brand_tertiary};
`;

const ArrowContainer = styled.div`
  transform: rotate(-180deg);
  fill: ${color_brand_tertiary};
`;

type TileDetailsPanelProps = {
  title: string;
  isValidatePanel: boolean;
  handleClosePanel: () => void;
  onBackClick: () => void;
  onValidateClick: () => void;
  children?: React.ReactNode;
};

const VALIDATE_TILE = "Validate Tile";

export const TileDetailsPanel = ({
  title,
  isValidatePanel,
  handleClosePanel,
  onBackClick,
  onValidateClick,
  children,
}: TileDetailsPanelProps) => {
  const theme = useTheme();

  return (
    <Container>
      <HeaderWrapper title={title}>
        {isValidatePanel && (
          <BackButton
            data-testid="attributes-panel-back-button"
            fill={theme.colors.fontColor}
            onClick={onBackClick}
          />
        )}
        {title && (
          <Title left={16} top={12} bottom={12}>
            {title}
          </Title>
        )}
        <CloseButton onClick={handleClosePanel} />
      </HeaderWrapper>
      <ContentWrapper>
      <ValidateButton onClick={onValidateClick}>
        <ValidatorTitle>{VALIDATE_TILE}</ValidatorTitle>
        <ArrowContainer>
          <ChevronIcon />
        </ArrowContainer>
      </ValidateButton>-
        {children}
        </ContentWrapper>
    </Container>
  );
};
