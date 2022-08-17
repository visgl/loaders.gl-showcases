import styled from "styled-components";
import { ExpandState, ListItemType } from "../../../types";
import { Checkbox } from "../../checkbox/checkbox";
import { ListItemWrapper } from "./list-item-wrapper/list-item-wrapper";
import { RadioButton } from "../../radio-button/radio-button";

type ListItemProps = {
  id: string;
  title: string;
  optionsContent?: JSX.Element;
  type: ListItemType;
  selected: boolean;
  isOptionsPanelOpen?: boolean;
  expandState?: ExpandState;
  onChange: (id: string) => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
  onClickOutside?: () => void;
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

export const ListItem = ({
  id,
  title,
  optionsContent,
  type,
  selected,
  isOptionsPanelOpen,
  expandState,
  onChange,
  onOptionsClick,
  onClickOutside,
  onExpandClick,
}: ListItemProps) => {
  const handleClick = () => {
    onChange(id);
  };

  return (
    <ListItemWrapper
      id={id}
      onOptionsClick={onOptionsClick}
      selected={selected}
      onClick={handleClick}
      expandState={expandState}
      onExpandClick={onExpandClick}
      isOptionsPanelOpen={isOptionsPanelOpen}
      optionsContent={optionsContent}
      onClickOutside={onClickOutside}
    >
      {type === ListItemType.Checkbox && (
        <Checkbox id={id} checked={selected} onChange={() => onChange(id)} />
      )}
      {type === ListItemType.Radio && (
        <RadioButton id={id} checked={selected} onChange={() => onChange(id)} />
      )}
      <Title>{title}</Title>
    </ListItemWrapper>
  );
};
