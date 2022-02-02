import { useState } from "react";
import styled from "styled-components";
import { EXAMPLES } from "../../constants/i3s-examples";
import { MAP_STYLES } from "../../constants/map-styles";

import { ToggleSwitch } from "../../components";

const Font = `
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top: ${(props) => (props.debugMode ? "120px" : "70px")};
  left: 10px;
  background: #0e111a;
  border-radius: 8px;
  z-index: 15;
  padding 16px;
  width: 245px;
`;

const TilesetDropDown = styled.select`
  ${Font};
  display: flex;
  padding: 4px 16px;
  height: 28px;
  cursor: pointer;
  border-radius: 4px;
  background: #0e111a;
  color: white;
  width: 245px;
  margin-bottom: 8px;

  option {
    color: white;
    background: #0e111a;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }

  &:hover {
    background: #4f52cc;
    color: black;
  }
`;

const BaseMapContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 245px;
  margin-bottom: 8px;
`;

const TerrainContainer = styled(BaseMapContainer)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
`;

const MapName = styled.h3`
  background: #0e111a;
  color: white;
  font-weight: normal;
  font-size: 16px;
  width: 70px;
  margin: 0;
`;

const TerrainName = styled.h3`
  background: #0e111a;
  color: white;
  margin: 0;
  font-weight: normal;
  font-size: 16px;
`;

const DropDown = styled.select`
  ${Font};
  padding: 4px 16px;
  height: 28px;
  cursor: pointer;
  border-radius: 4px;
  background: #0e111a;
  color: white;

  option {
    color: white;
    background: #0e111a;
    padding: 0px 2px 1px;
  }

  &:hover {
    background: #4f52cc;
    color: black;
  }
  width: 167px;
  margin-left: 8px;
`;

const CUSTOM_EXAMPLE = "Custom example";

export const ControlPanel = ({
  name,
  onExampleChange,
  onMapStyleChange,
  selectedMapStyle,
  mapStyles = MAP_STYLES,
  useTerrainLayer,
  toggleTerrain,
  debugMode = false,
}) => {
  const [example, setExample] = useState(name || CUSTOM_EXAMPLE);

  const handleChangeExample = (event) => {
    const selectedExample = event.target.value;
    setExample(selectedExample);
    onExampleChange(EXAMPLES[selectedExample]);
  };

  const renderExampleOptions = () => {
    return Object.keys(EXAMPLES).map((key) => {
      const example = EXAMPLES[key];
      return (
        <option key={key} value={example.name}>
          {example.name}
        </option>
      );
    });
  };

  const renderMapStyleOptions = () => {
    return Object.keys(mapStyles).map((key) => {
      return (
        <option key={key} value={mapStyles[key]}>
          {key}
        </option>
      );
    });
  };

  const renderExamples = () => (
    <TilesetDropDown value={example} onChange={handleChangeExample}>
      {!name && (
        <option key={"custom-example"} value={"custom-example"}>
          {CUSTOM_EXAMPLE}
        </option>
      )}
      {renderExampleOptions()}
    </TilesetDropDown>
  );

  const renderMapStyles = () => {
    return (
      <BaseMapContainer>
        <MapName>Base map</MapName>
        <DropDown
          value={selectedMapStyle}
          onChange={(evt) =>
            onMapStyleChange({ selectedMapStyle: evt.target.value })
          }
        >
          {renderMapStyleOptions()}
        </DropDown>
      </BaseMapContainer>
    );
  };

  const renderTerrainControl = () => {
    return (
      <TerrainContainer>
        <TerrainName>Terrain</TerrainName>
        <ToggleSwitch
          id="terrain-layer-switch"
          checked={useTerrainLayer}
          onChange={toggleTerrain}
        />
      </TerrainContainer>
    );
  };

  return (
    <Container debugMode={debugMode}>
      {renderExamples()}
      {renderMapStyles()}
      {renderTerrainControl()}
    </Container>
  );
};
