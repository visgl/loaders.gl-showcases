import styled from "styled-components";
import { ListItemWrapper } from "./list-item-wrapper";

type BaseMapsItemProps = {
  id: string;
  title: string;
  selected: boolean;
  hasOptions: boolean;
  iconUrl: string;
  onMapsSelect: (id) => void;
  onOptionsClick: (id: string) => void;
};

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const MapIcon = styled.div<{ url: string }>`
  background: url(${(props) => props.url}) no-repeat center #232430;
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

export const BaseMapListItem = ({
  id,
  title,
  hasOptions,
  iconUrl,
  selected,
  onOptionsClick,
  onMapsSelect,
}: BaseMapsItemProps) => {
  const handleClick = () => {
    onMapsSelect(id);
  };
  return (
    <ListItemWrapper
      id={id}
      selected={selected}
      hasOptions={hasOptions}
      onClick={handleClick}
      onOptionsClick={onOptionsClick}
    >
      <MapIcon url={iconUrl} />
      <Title>{title}</Title>
    </ListItemWrapper>
  );
};
