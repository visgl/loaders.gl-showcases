import styled from "styled-components";
import { ListItemWrapper } from "../layers-panel/list-item-wrapper";

type BaseMapsItemProps = {
  id: string;
  title: string;
  hasOptions: boolean;
  iconUrl: string;
  onMapClick: ({ selectedMapStyle }) => void;
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
  background-image: url(${(props) => props.url});
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

export const BaseMapListItem = ({
  id,
  title,
  hasOptions,
  iconUrl,
  onOptionsClick,
  onMapClick,
}: BaseMapsItemProps) => {
  return (
    <ListItemWrapper
      id={id}
      hasOptions={hasOptions}
      onMapClick={onMapClick}
      onOptionsClick={onOptionsClick}
    >
      <MapIcon url={iconUrl} />
      <Title>{title}</Title>
    </ListItemWrapper>
  );
};
