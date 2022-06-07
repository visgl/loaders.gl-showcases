import styled from "styled-components";
import { color_brand_quaternary } from "../../constants/colors";

type BaseMapsItemProps = {
  id: string;
  title: string;
  hasOptions: boolean;
  iconUrl: string;
  onOptionsClick: (id: string) => void;
};

type OptionsButtonProps = {
  onClick: (id: string) => void;
};

const Container = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 20px 10px 10px;
background: transparent;
cursor: pointer;
margin-bottom: 8px;

&:hover {
  background: ${({ theme }) => theme.colors.listItemBackground};
  box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const OptionsButton = styled.div<OptionsButtonProps>`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${color_brand_quaternary};
  border-radius: 50%;
  margin-bottom: 12px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${color_brand_quaternary};
    border-radius: inherit;
  }

  &:before {
    top: 6px;
  }

  &:after {
    top: 12px;
  }
`;

const ItemContentWrapper = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
`;

const MapIcon = styled.div<{ url: string }>`
background-image: url(${(props) => props.url});
width: 40px;
height: 40px;
border-radius: 8px;
`;

export const BaseMapList = ({id, title, hasOptions, iconUrl, onOptionsClick}: BaseMapsItemProps) => {
  return (
    <Container>
      <ItemContentWrapper>
        <MapIcon url={iconUrl}/>
        <Title>{title}</Title>
      </ItemContentWrapper>
      {hasOptions && <OptionsButton onClick={() => onOptionsClick(id)} />}
    </Container>
  );
};
