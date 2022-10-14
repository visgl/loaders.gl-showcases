import styled, { css } from "styled-components";
import { ExpandState, ListItemType, Sublayer } from "../../../types";
import { useForceUpdate } from "../../../utils";
import { ListItem } from "./list-item/list-item";

const BuildingExplorerSublayers = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const GroupContainer = styled.div<{ needIndentation: boolean }>`
  ${({ needIndentation = false }) =>
    needIndentation &&
    css`
      margin-left: 44px;
    `}
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

  const toggleExpandState = (sublayer) => {
    sublayer.expanded = !sublayer.expanded;
    forceUpdate();
  };

  const renderSublayers = (sublayers: Sublayer[], hasParent = false) => {
    return sublayers.map((sublayer: Sublayer) => {
      const childLayers = sublayer.sublayers || [];
      let expandState;
      if (childLayers.length) {
        expandState = sublayer.expanded
          ? ExpandState.expanded
          : ExpandState.collapsed;
      }
      return (
        <GroupContainer key={sublayer.id} needIndentation={hasParent}>
          <ListItem
            id={sublayer.id.toString()}
            title={sublayer.name}
            type={ListItemType.Checkbox}
            selected={Boolean(sublayer.visibility)}
            expandState={expandState}
            onChange={() => toggleSublayer(sublayer)}
            onExpandClick={() => toggleExpandState(sublayer)}
          />
          {sublayer.expanded ? renderSublayers(childLayers, true) : null}
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
