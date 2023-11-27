import styled from "styled-components";
import { SelectionState, ListItemType } from "../../../types";
import { Checkbox } from "../../checkbox/checkbox";
import { ArcGisListItemWrapper } from "../arcgis-list-item-wrapper/arcgis-list-item-wrapper";
import { RadioButton } from "../../radio-button/radio-button";

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fontColor};
`;

const ItemContent = styled.div`
  margin-left: 16px;
`;

const ItemTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.mainDimColorInverted};
  overflow: hidden; 
  white-space: nowrap;
  max-width: 90%;
  text-overflow: ellipsis;
  font-weight: 400;
  align-items: center;
`;

const ItemContainer = styled.div<{ bottom?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 8px 0;
  margin-bottom: ${({ bottom = 0 }) => `${bottom}px`};
`;

type ArcGisListItemProps = {
  id: string;
  title: string;
  type: ListItemType;
  selected: SelectionState;
  onChangeSelection: (id: string) => void;
};

export const ArcGisListItem = ({
  id,
  title,
  type,
  selected,
  onChangeSelection,
}: ArcGisListItemProps) => {
  const handleClick = () => {
    onChangeSelection(id);
  };

  return (
    <ArcGisListItemWrapper
      id={id}
      selected={selected}
      onClick={handleClick}
    >
      {type === ListItemType.Checkbox && (
        <Checkbox id={id} checked={selected} onChange={() => onChangeSelection(id)} />
      )}
      {type === ListItemType.Radio && (
        <RadioButton id={id} checked={selected === SelectionState.selected} onChange={() => onChangeSelection(id)} />
      )}
      <ItemContent data-testid="list-item-content">
        <ItemContainer key={title}>
          <ItemTitle>{title}</ItemTitle>
        </ItemContainer>
      </ItemContent>
    </ArcGisListItemWrapper>
  );
};
