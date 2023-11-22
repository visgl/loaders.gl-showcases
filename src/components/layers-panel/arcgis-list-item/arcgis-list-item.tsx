import styled from "styled-components";
import { SelectionState } from "../../../types";
import { BaseMapIcon } from "../base-map-icon/base-map-icon";
import { ListItemWrapper } from "../list-item-wrapper/list-item-wrapper";

type ArcgisItemProps = {
  id: string;
  title: string;
  optionsContent?: JSX.Element;
  selected: SelectionState;
//   isOptionsPanelOpen: boolean;
  onMapsSelect: (id) => void;
//   onOptionsClick: (id: string) => void;
  onClickOutside?: () => void;
};

const Title = styled.div`
  margin-left: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const ArcgisListItem = ({
  id,
  title,
  optionsContent,
//   isOptionsPanelOpen,
  selected,
//   onOptionsClick,
  onClickOutside,
  onMapsSelect,
}: ArcgisItemProps) => {
  const handleClick = () => {
    onMapsSelect(id);
  };
  return (
    <ListItemWrapper
      id={id}
      selected={selected}
      onClick={handleClick}
    //   onOptionsClick={onOptionsClick}
    //   isOptionsPanelOpen={isOptionsPanelOpen}
      optionsContent={optionsContent}
      onClickOutside={onClickOutside}
    >
      <BaseMapIcon baseMapId={id} />
      <Title>{title}</Title>
    </ListItemWrapper>
  );
};
