import styled from "styled-components";
import { Sublayer } from "../../types";
import { ActiveSublayer } from "../../utils/active-sublayer";
import { SublayerWidget } from "./sublayer-widget";

const BuildingExplorerSublayers = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const BuildingExplorer = ({
  sublayers,
  onUpdateSublayerVisibility,
}: {
  sublayers: ActiveSublayer[];
  onUpdateSublayerVisibility: (sublayer: Sublayer) => void;
}) => {
  return (
    <BuildingExplorerSublayers>
      {sublayers.map(sublayer => 
        <SublayerWidget 
          sublayer={sublayer} 
          key={sublayer.id} 
          onUpdateSublayerVisibility={onUpdateSublayerVisibility}
        />
      )}
    </BuildingExplorerSublayers>
  );
};
