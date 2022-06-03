import styled, { css } from "styled-components";
import { lightGrey } from "../../constants/colors";
import { ListItemType } from "../../utils/enums";
import { Checkbox } from "../checkbox/checkbox";
import { RadioButton } from "../radio-button/radio-button";
import dark from '../../assets/base-map-photos/dark-map.png'

type ListItemProps = {
  id: string;
  title: string;
  type: ListItemType;
  selected: boolean;
  hasOptions: boolean;
  onSelect: (id: string) => void;
  onOptionsClick: (id: string) => void;
};

type OptionsButtonProps = {
  onClick: (id: string) => void;
};

const Container = styled.div`
display: flex;
justify-content: space-between;
width: 100%
padding: 4px 0px 4px 10px;
background: transparent;
cursor: pointer;
margin-bottom: 8px;
border-radius: 8px;
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
  background-color: ${lightGrey};
  border-radius: 50%;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${lightGrey};
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

const MapPhoto = styled.div`
background-image: url(${dark});
width: 40px;
height: 40px;
border-radius: 8px;
`;

export const BaseMapList = ({id, title, hasOptions, onOptionsClick}) => {
  return (
    <Container>
      <ItemContentWrapper>
        <MapPhoto />
        <Title>{title}</Title>
      </ItemContentWrapper>
      {hasOptions && <OptionsButton onClick={() => onOptionsClick(id)} />}
    </Container>
  );
};
