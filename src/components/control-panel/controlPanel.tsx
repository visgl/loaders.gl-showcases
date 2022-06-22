import { useEffect, useState } from "react";
import styled from "styled-components";
import { EXAMPLES, CUSTOM_EXAMPLE_VALUE } from "../../constants/i3s-examples";
import { MAP_STYLES } from "../../constants/map-styles";
import { useSearchParams } from "react-router-dom";

import { ToggleSwitch } from "../../components";
import {
  color_brand_primary,
  color_canvas_inverted,
} from "../../constants/colors";

const Font = `
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

const Container = styled.div<{ debugMode: boolean }>`
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top: ${(props) => (props.debugMode ? "120px" : "70px")};
  left: 10px;
  background: ${color_brand_primary};
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
  background: ${color_brand_primary};
  color: ${color_canvas_inverted};
  width: 245px;
  margin-bottom: 8px;

  option {
    color: ${color_canvas_inverted};
    background: ${color_brand_primary};
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }

  &:hover {
    background: #4f52cc;
    color: ${color_brand_primary};
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
  background: ${color_brand_primary};
  color: ${color_canvas_inverted};
  font-weight: normal;
  font-size: 16px;
  width: 70px;
  margin: 0;
`;

const TerrainName = styled.h3`
  background: ${color_brand_primary};
  color: ${color_canvas_inverted};
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
  background: ${color_brand_primary};
  color: ${color_canvas_inverted};

  option {
    color: ${color_canvas_inverted};
    background: ${color_brand_primary};
    padding: 0px 2px 1px;
  }

  &:hover {
    background: #4f52cc;
    color: ${color_brand_primary};
  }
  width: 167px;
  margin-left: 8px;
`;

const CUSTOM_EXAMPLE = "Custom example";
/**
 * TODO: Add types to component
 */
export const ControlPanel = ({
  onExampleChange,
  onMapStyleChange,
  selectedMapStyle,
  mapStyles = MAP_STYLES,
  useTerrainLayer,
  toggleTerrain,
  debugMode = false,
  tileset,
}) => {
  const { id, name } = tileset;
  const [example, setExample] = useState(id);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (id) {
      setExample(id);
      setSearchParams({ tileset: id });
    }
  }, [id]);

  const handleChangeExample = (event) => {
    const selectedExample = event.target.value;
    setExample(selectedExample);
    onExampleChange(EXAMPLES.find(({ id }) => id === selectedExample));
  };

  const renderExampleOptions = () => {
    return EXAMPLES.map((example) => {
      return (
        <option key={example.id} value={example.id}>
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
    <TilesetDropDown
      id="tilesets"
      value={example}
      onChange={handleChangeExample}
    >
      {name === CUSTOM_EXAMPLE_VALUE && (
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
          id="base-map"
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
    <Container id="control-panel" debugMode={debugMode}>
      {renderExamples()}
      {renderMapStyles()}
      {renderTerrainControl()}
    </Container>
  );
};
