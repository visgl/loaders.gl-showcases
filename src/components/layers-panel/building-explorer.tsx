import styled from "styled-components";
import { ListItemType, Sublayer } from "../../types";
import { useForceUpdate } from "../../utils";
import { ListItem } from "../list-item/list-item";

const BuildingExplorerSublayers = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const GroupContainer = styled.div`
  padding-left: 44px;
`;

export const BuildingExplorer = ({
  sublayers,
  onUpdateSublayerVisibility,
}: {
  sublayers: Sublayer[];
  onUpdateSublayerVisibility: (Sublayer) => void;
}) => {
  const forceUpdate = useForceUpdate();
  const updateChild = (sublayer, isShown) => {
    sublayer.visibility = isShown;
    onUpdateSublayerVisibility(sublayer);
    updateChildren(sublayer.sublayers, isShown);
    forceUpdate();
  };

  const updateChildren = (sublayers, isShown) => {
    if (sublayers) {
      for (const sublayer of sublayers) {
        updateChild(sublayer, isShown);
      }
    }
  };

  const toggleSublayer = (sublayer: Sublayer) => {
    sublayer.visibility = !sublayer.visibility;
    onUpdateSublayerVisibility(sublayer);
    updateChildren(sublayer.sublayers, sublayer.visibility);
    forceUpdate();
  };

  const renderSublayers = (sublayers: Sublayer[]) => {
    return sublayers.map((sublayer: Sublayer) => {
      const childLayers = sublayer.sublayers || [];
      return (
        <GroupContainer>
          <ListItem
            key={sublayer.id}
            id={sublayer.id.toString()}
            title={sublayer.name}
            type={ListItemType.Checkbox}
            selected={Boolean(sublayer.visibility)}
            onChange={() => toggleSublayer(sublayer)}
          />
          {sublayer.expanded ? renderSublayers(childLayers) : null}
        </GroupContainer>
      );
    });
  };

  return (
    <BuildingExplorerSublayers>
      {renderSublayers(sublayers)}
    </BuildingExplorerSublayers>
  );
};
