import styled, { useTheme } from "styled-components";
import { ActionButton } from "../../../action-button/action-button";
import { LayoutProps } from "../../common";
import WarningIcon from "../../../../../public/icons/warning.svg?svgr";
import { getCurrentLayoutProperty, useAppLayout } from "../../../../utils/hooks/layout";

const Container = styled.div<LayoutProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 300px;
  padding: 32px 16px 25px 18px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainColor};
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
  max-height: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "auto",
    mobile: "calc(50vh - 140px)",
  })};
  overflow-y: auto;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const WarningIconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

type ExistedLayerWarningProps = {
  title: string;
  children?: React.ReactNode;
  onConfirm: () => void;
};

export const WarningPanel = ({
  title,
  children,
  onConfirm,
}: ExistedLayerWarningProps) => {
  const layout = useAppLayout();
  const theme = useTheme();

  return (
    <Container layout={layout}>
      <ContentContainer>
        <TitleWrapper>
          <WarningIconContainer>
            <WarningIcon fill={theme.colors.mainHiglightColorInverted} />
          </WarningIconContainer>
          {title}
        </TitleWrapper>
        {children}
      </ContentContainer>
      <ButtonWrapper>
        <ActionButton onClick={onConfirm}>Ok</ActionButton>
      </ButtonWrapper>
    </Container>
  );
};
