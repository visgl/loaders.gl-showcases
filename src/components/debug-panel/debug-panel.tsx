import styled from "styled-components";

import { DebugOptionGroup, ToggleSwitch, Checkbox } from "../";

import { Color, Font, DropDownStyle } from "../../constants/common";

import {
  TILE_COLOR_MODES,
  BOUNDING_VOLUME_COLOR_MODES,
  BOUNDING_VOLUME_TYPE,
} from "../../constants/map-styles";
import { SelectionState } from "../../types";

const Container = styled.div<{
  renderControlPanel: boolean;
  hasBuildingExplorer: boolean;
}>`
  ${Color}
  ${Font}
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 20;
  top: ${(props) =>
    props.renderControlPanel
      ? props.hasBuildingExplorer
        ? "310px"
        : "250px"
      : "120px"};
  left: 10px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  padding: 10px 15px 5px 15px;
  box-sizing: border-box;
  border-radius: 8px;
  width: 278px;

  height: ${(props) =>
    props.renderControlPanel
      ? props.hasBuildingExplorer
        ? "calc(100% - 310px)"
        : "calc(100% - 270px)"
      : "calc(100% - 120px)"};
  max-height: 540px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.h6`
  padding: 0;
  margin: 0 0 12px 0;
  font-weight: 500;
  line-height: 15px;
  text-transform: uppercase;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const DropDown = styled.select`
  ${Color}
  ${Font}
  ${DropDownStyle}
  width: 167px;
  left: 86px;
  margin: 0;
`;

const Label = styled.label`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-weight: bold;
`;

const Option = styled.h3`
  ${Color}
  ${Font}
  font-weight: 500;
  width: 70px;
  margin: 8px 15px 8px 0;
`;

const DebugTextureContainer = styled.div`
  padding: 5px;
  margin-left: 5px;
  width: 30%;

  &:hover {
    transition: all 1s;
    width: 85%;
  }
`;

const CheckboxOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 246px;
  padding-bottom: 8px;
`;

const CheckboxTitle = styled.span`
  margin-left: 5px;
  cursor: pointer;
`;

/**
 * TODO: Add types to component
 */
export const DebugPanel = ({
  debugOptions,
  debugTextureImage,
  renderControlPanel,
  hasBuildingExplorer,
  onDebugOptionsChange,
}: {
  debugOptions: any;
  debugTextureImage: string;
  renderControlPanel: boolean;
  hasBuildingExplorer: boolean;
  onDebugOptionsChange: (newDebugOptions: any) => void;
}) => {
  const renderBoundingVolumeColor = () => {
    const { boundingVolumeColorMode } = debugOptions;

    return (
      <CheckboxOption>
        <Option>Color</Option>
        <DropDown
          id="volume-color"
          value={boundingVolumeColorMode}
          onChange={(evt) =>
            onDebugOptionsChange({
              boundingVolumeColorMode: parseInt(evt.target.value, 10),
            })
          }
        >
          {Object.keys(BOUNDING_VOLUME_COLOR_MODES).map((key) => {
            return (
              <option key={key} value={BOUNDING_VOLUME_COLOR_MODES[key]}>
                {key}
              </option>
            );
          })}
        </DropDown>
      </CheckboxOption>
    );
  };

  const renderBoundingVolumeTypes = () => {
    const { boundingVolumeType } = debugOptions;

    return (
      <CheckboxOption>
        <Option>Type</Option>
        <DropDown
          id="volume-type"
          value={boundingVolumeType}
          onChange={(evt) =>
            onDebugOptionsChange({ boundingVolumeType: evt.target.value })
          }
        >
          {Object.keys(BOUNDING_VOLUME_TYPE).map((key) => {
            const shape = BOUNDING_VOLUME_TYPE[key];
            return (
              <option key={key} value={shape}>
                {key}
              </option>
            );
          })}
        </DropDown>
      </CheckboxOption>
    );
  };

  const renderBoundingVolume = () => {
    const { boundingVolume } = debugOptions;
    return (
      <DebugOptionGroup>
        <CheckboxOption>
          <Label htmlFor="boundingVolume">Bounding Volumes</Label>
          <ToggleSwitch
            id="boundingVolume"
            checked={boundingVolume}
            onChange={() =>
              onDebugOptionsChange({ boundingVolume: !boundingVolume })
            }
          />
        </CheckboxOption>
        {boundingVolume ? renderBoundingVolumeTypes() : null}
        {boundingVolume ? renderBoundingVolumeColor() : null}
      </DebugOptionGroup>
    );
  };

  const renderDebugTextureImage = () => {
    return (
      <DebugTextureContainer>
        <img src={debugTextureImage} alt="Debug Texture Image" width="100%" />
      </DebugTextureContainer>
    );
  };

  const renderTileOptions = () => {
    const {
      tileColorMode,
      pickable,
      loadTiles,
      showUVDebugTexture,
      wireframe,
    } = debugOptions;

    return (
      <DebugOptionGroup>
        <CheckboxOption>
          <Label>Tiles</Label>
        </CheckboxOption>
        <CheckboxOption>
          <label>
            <Checkbox
              id="loadTiles"
              checked={loadTiles ? SelectionState.selected : SelectionState.unselected}
              onChange={() => onDebugOptionsChange({ loadTiles: !loadTiles })}
            />
            <CheckboxTitle>Load tiles</CheckboxTitle>
          </label>
        </CheckboxOption>
        <CheckboxOption>
          <label>
            <Checkbox
              id="pickable"
              checked={pickable ? SelectionState.selected : SelectionState.unselected}
              onChange={() => onDebugOptionsChange({ pickable: !pickable })}
            ></Checkbox>
            <CheckboxTitle>Picking</CheckboxTitle>
          </label>
        </CheckboxOption>
        <CheckboxOption>
          <label>
            <Checkbox
              id="uvDebugTexture"
              checked={showUVDebugTexture ? SelectionState.selected : SelectionState.unselected}
              onChange={() =>
                onDebugOptionsChange({
                  showUVDebugTexture: !showUVDebugTexture,
                })
              }
            />
            <CheckboxTitle>Texture UVs</CheckboxTitle>
          </label>
        </CheckboxOption>
        {showUVDebugTexture ? renderDebugTextureImage() : null}
        <CheckboxOption>
          <label>
            <Checkbox
              id="wireframe"
              checked={wireframe ? SelectionState.selected : SelectionState.unselected}
              onChange={() => onDebugOptionsChange({ wireframe: !wireframe })}
            />
            <CheckboxTitle>Wireframe</CheckboxTitle>
          </label>
        </CheckboxOption>
        <CheckboxOption>
          <Option>Color</Option>
          <DropDown
            id="color"
            value={tileColorMode}
            onChange={(evt) =>
              onDebugOptionsChange({
                tileColorMode: parseInt(evt.target.value, 10),
              })
            }
          >
            {Object.keys(TILE_COLOR_MODES).map((key) => {
              return (
                <option key={key} value={TILE_COLOR_MODES[key]}>
                  {key}
                </option>
              );
            })}
          </DropDown>
        </CheckboxOption>
      </DebugOptionGroup>
    );
  };

  const renderMiniMap = () => {
    const { minimapViewport } = debugOptions;

    return (
      <CheckboxOption>
        <label>
          <Checkbox
            id="showFrustumCullingMinimapViewport"
            checked={minimapViewport ? SelectionState.selected : SelectionState.unselected}
            onChange={() =>
              onDebugOptionsChange({ minimapViewport: !minimapViewport })
            }
          />
          <CheckboxTitle>Different viewports</CheckboxTitle>
        </label>
      </CheckboxOption>
    );
  };

  const renderFrustumCullingOption = () => {
    const { minimap } = debugOptions;

    return (
      <DebugOptionGroup>
        <CheckboxOption>
          <Label htmlFor="showFrustumCullingMinimap">Minimap</Label>
          <ToggleSwitch
            id="showFrustumCullingMinimap"
            checked={minimap}
            onChange={() => onDebugOptionsChange({ minimap: !minimap })}
          />
        </CheckboxOption>
        {minimap ? renderMiniMap() : null}
      </DebugOptionGroup>
    );
  };

  return (
    <Container
      className="debug-panel"
      renderControlPanel={renderControlPanel}
      hasBuildingExplorer={hasBuildingExplorer}
    >
      <Header>Debug Panel</Header>
      {renderFrustumCullingOption()}
      {renderTileOptions()}
      {renderBoundingVolume()}
    </Container>
  );
};
