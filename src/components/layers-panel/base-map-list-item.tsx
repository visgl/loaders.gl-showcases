import { ForwardedRef, forwardRef } from "react";
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
  background-image: url(${(props) => props.url});
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

export const BaseMapListItem = forwardRef(
  (props: BaseMapsItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      id,
      title,
      hasOptions,
      iconUrl,
      selected,
      onOptionsClick,
      onMapsSelect,
    } = props;
    const handleClick = () => {
      onMapsSelect(id);
    };
    return (
      <ListItemWrapper
        ref={ref}
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
  }
);
