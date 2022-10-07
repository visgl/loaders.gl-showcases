import { ListItemType } from "../../../../types";
import { BaseMapIcon } from "../base-map-icon/base-map-icon";
import { ListItem } from "../list-item/list-item";

type BaseMapsItemProps = {
  id: string;
  title: string;
  optionsContent?: JSX.Element;
  selected: boolean;
  isOptionsPanelOpen: boolean;
  onMapsSelect: (id) => void;
  onOptionsClick: (id: string) => void;
  onClickOutside?: () => void;
};

export const BaseMapListItem = ({
  id,
  title,
  optionsContent,
  isOptionsPanelOpen,
  selected,
  onOptionsClick,
  onClickOutside,
  onMapsSelect,
}: BaseMapsItemProps) => {
  const handleClick = () => {
    onMapsSelect(id);
  };
  return (
    <ListItem
      id={id}
      title={title}
      icon={<BaseMapIcon baseMapId={id} />}
      selected={selected}
      onClick={handleClick}
      onOptionsClick={onOptionsClick}
      isOptionsPanelOpen={isOptionsPanelOpen}
      optionsContent={optionsContent}
      onClickOutside={onClickOutside}
      listItemType={ListItemType.Icon}
    />
  );
};
