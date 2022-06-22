import { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";
import { ExpandState, ListItemType } from "../../types";
import { Checkbox } from "../checkbox/checkbox";
import { ListItemWrapper } from "./list-item-wrapper";
import { RadioButton } from "../radio-button/radio-button";

type ListItemProps = {
  id: string;
  title: string;
  type: ListItemType;
  selected: boolean;
  hasOptions?: boolean;
  expandState?: ExpandState;
  onChange: (id: string) => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
};

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  width: 223px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const ListItem = forwardRef(
  (props: ListItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      id,
      title,
      type,
      selected,
      hasOptions,
      expandState,
      onChange,
      onOptionsClick,
      onExpandClick,
    } = props;

    const handleClick = () => {
      onChange(id);
    };
    return (
      <ListItemWrapper
        ref={ref}
        id={id}
        hasOptions={hasOptions}
        onOptionsClick={onOptionsClick}
        selected={selected}
        onClick={handleClick}
        expandState={expandState}
        onExpandClick={onExpandClick}
      >
        {type === ListItemType.Checkbox ? (
          <Checkbox id={id} checked={selected} onChange={() => onChange(id)} />
        ) : (
          <RadioButton
            id={id}
            checked={selected}
            onChange={() => onChange(id)}
          />
        )}
        <Title>{title}</Title>
      </ListItemWrapper>
    );
  }
);
