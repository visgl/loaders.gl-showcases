import styled from "styled-components";
import { Checkbox, ToggleSwitch } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

import { useForceUpdate } from "../../utils";

const BuildingExplorerContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: ${(props) =>
    props.debugMode
      ? props.isControlPanelShown
        ? "250px"
        : "120px"
      : "200px"};
  left: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 245px;
  padding: 16px;
  height: ${(props) => (props.isShown ? "calc(100% - 240px)" : "20px")};
  max-height: 450px;
  align-items: space-between;
  background: #0e111a;
  border-radius: 8px;
`;

const ExplorerWraper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const BuildingExplorerSublayers = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CollapseContainer = styled.div`
  margin-right: 5px;
  cursor: pointer;
`;

const CheckboxContainer = styled.div`
  background: #0e111a;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  margin-left: 10px;
`;

const Label = styled.h3`
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: white;
  font-weight: normal;
`;

const CheckboxOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 246px;
  padding-bottom: 8px;
`;

const SublayerName = styled.span`
  margin-left: 5;
  cursor: pointer;
`;

export const BuildingExplorer = ({
  sublayers,
  isShown,
  onUpdateSublayerVisibility,
  onToggleBuildingExplorer,
  isControlPanelShown = false,
  debugMode = false,
}) => {
  const forceUpdate = useForceUpdate();

  const setChild = (sublayer, isShown) => {
    sublayer.visibility = isShown;
    onUpdateSublayerVisibility(sublayer);
    setChildren(sublayer.sublayers, isShown);
    forceUpdate();
  };

  const setChildren = (sublayers, isShown) => {
    if (sublayers) {
      for (const sublayer of sublayers) {
        setChild(sublayer, isShown);
      }
    }
  };

  const toggleSublayer = (sublayer) => {
    sublayer.visibility = !sublayer.visibility;
    onUpdateSublayerVisibility(sublayer);
    setChildren(sublayer.sublayers, sublayer.visibility);
    forceUpdate();
  };

  const toggleGroup = (sublayer) => {
    sublayer.expanded = !sublayer.expanded;
    forceUpdate();
  };

  const renderSublayers = (sublayers) => {
    return sublayers.map((sublayer) => {
      const childLayers = sublayer.sublayers || [];
      let icon = faCircle;
      let size = "xs";

      if (sublayer.sublayers) {
        size = "lg";
        if (sublayer.expanded) {
          icon = faAngleDown;
        } else {
          icon = faAngleRight;
        }
      }
      return (
        <CheckboxContainer key={sublayer.id}>
          <CheckboxOption>
            <CollapseContainer>
              <FontAwesomeIcon
                icon={icon}
                onClick={() => toggleGroup(sublayer)}
                // @ts-expect-error
                size={size}
              />
            </CollapseContainer>
            <label>
              <Checkbox
                id={`CheckBox${sublayer.id}`}
                value={sublayer.visibility}
                checked={sublayer.visibility}
                onChange={() => toggleSublayer(sublayer)}
              />
              <SublayerName>{sublayer.name}</SublayerName>
            </label>
          </CheckboxOption>
          {sublayer.expanded ? renderSublayers(childLayers) : null}
        </CheckboxContainer>
      );
    });
  };

  return (
    <BuildingExplorerContainer
      isShown={isShown}
      isControlPanelShown={isControlPanelShown}
      debugMode={debugMode}
    >
      <ExplorerWraper>
        <Label htmlFor="BuildingExplorerToggle">BuildingExplorer</Label>
        <ToggleSwitch
          id="BuildingExplorerToggle"
          checked={isShown}
          onChange={onToggleBuildingExplorer}
        />
      </ExplorerWraper>
      {isShown ? (
        <BuildingExplorerSublayers>
          {renderSublayers(sublayers)}
        </BuildingExplorerSublayers>
      ) : null}
    </BuildingExplorerContainer>
  );
};
