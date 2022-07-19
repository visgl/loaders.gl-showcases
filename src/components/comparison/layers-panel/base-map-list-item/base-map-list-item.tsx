import { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";
import { BaseMapIcon } from "../base-map-icon/base-map-icon";
import { ListItemWrapper } from "../list-item-wrapper/list-item-wrapper";

type BaseMapsItemProps = {
  id: string;
  title: string;
  selected: boolean;
  hasOptions: boolean;
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

export const BaseMapListItem = forwardRef(
  (props: BaseMapsItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { id, title, hasOptions, selected, onOptionsClick, onMapsSelect } =
      props;
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
        <BaseMapIcon baseMapId={id} />
        <Title>{title}</Title>
      </ListItemWrapper>
    );
  }
);
