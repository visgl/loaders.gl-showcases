import styled from "styled-components";
import { SelectionState, ExpandState, ListItemType } from "../../../types";
import { Checkbox } from "../../checkbox/checkbox";
import { ListItemWrapper } from "../list-item-wrapper/list-item-wrapper";
import { RadioButton } from "../../radio-button/radio-button";
import { color_brand_secondary } from "../../../constants/colors";

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: hidden;
  word-wrap: break-word;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const Subtitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin-top: 2px;
  color: ${color_brand_secondary};
`;

const ItemContent = styled.div`
  min-width: 0;
  margin-left: 16px;
`;

type ListItemProps = {
  id: string;
  title: string;
  subtitle?: string;
  optionsContent?: JSX.Element;
  type: ListItemType;
  selected: SelectionState;
  isOptionsPanelOpen?: boolean;
  expandState?: ExpandState;
  onChange: (id: string) => void;
  onOptionsClick?: (id: string) => void;
  onExpandClick?: () => void;
  onClickOutside?: () => void;
};

export const ListItem = ({
  id,
  title,
  subtitle,
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
        <RadioButton
          id={id}
          checked={selected === SelectionState.selected}
          onChange={() => onChange(id)}
        />
      )}
      <ItemContent data-testid="list-item-content">
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </ItemContent>
    </ListItemWrapper>
  );
};
