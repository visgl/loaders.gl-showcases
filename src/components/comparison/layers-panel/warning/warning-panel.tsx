import styled from "styled-components";
import { getCurrentLayoutProperty, useAppLayout } from "../../../../utils/layout";
import { ActionButton } from "../../../action-button/action-button";
import { LayoutProps } from "../../common";
import WarningIcon from "../../../../../public/icons/warning.svg?svgr";

const Container = styled.div<LayoutProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 300px;
  height: 190px;
  padding: 18px;
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

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
  margin-bottom: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 6px;
`;

const WarningIconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

type ExistedLayerWarningProps = {
  title: string;
  onConfirm: () => void;
};

export const WarningPanel = ({
  title,
  onConfirm,
}: ExistedLayerWarningProps) => {
  const layout = useAppLayout();

  return (
    <Container layout={layout}>
      <Title>
        <WarningIconContainer>
          <WarningIcon />
        </WarningIconContainer>
        {title}
      </Title>
      <ButtonWrapper>
        <ActionButton onClick={onConfirm}>Ok</ActionButton>
      </ButtonWrapper>
    </Container>
  );
};
