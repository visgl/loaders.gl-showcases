import { ReactEventHandler } from "react";
import styled from "styled-components";

import {
  BoundingVolumeColoredBy,
  BoundingVolumeType,
  DebugOptions,
  ListItemType,
  SelectionState,
  TileColoredBy,
} from "../../types";
import { useAppLayout } from "../../utils/hooks/layout";
import { CloseButton } from "../close-button/close-button";
import {
  Panels,
  PanelContainer,
  PanelHeader,
  Title,
  PanelHorizontalLine,
} from "../common";
import { ListItem } from "../layers-panel/list-item/list-item";
import { ToggleSwitch } from "../toogle-switch/toggle-switch";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setDebugOptions,
  selectDebugOptions,
} from "../../redux/slices/debug-options-slice";

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: 6px;
  top: 8px;
  width: 44px;
  height: 44px;
  display: flex;
`;

const ToggleOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0px;
  margin-bottom: 8px;
`;

const NestedItemContainer = styled(ItemContainer)`
  margin-left: 16px;
`;

const RadioButtonWrapper = styled.div`
  margin: 0 16px;
`;

type DebugPanelProps = {
  onClose: ReactEventHandler;
};

export const DebugPanel = ({ onClose }: DebugPanelProps) => {
  const layout = useAppLayout();
  const dispatch = useAppDispatch();
  const debugOptions = useAppSelector(selectDebugOptions);

  return (
    <PanelContainer layout={layout}>
      <PanelHeader panel={Panels.Debug}>
        <Title id="debug-panel-title" left={16}>
          Debug Panel
        </Title>
      </PanelHeader>
      <CloseButtonWrapper>
        <CloseButton id="debug-panel-close-button" onClick={onClose} />
      </CloseButtonWrapper>
      <PanelHorizontalLine top={10} />
      <ToggleOptionsContainer>
        <ItemContainer>
          <Title left={16} id={"toggle-minimap-title"}>
            Minimap
          </Title>
          <ToggleSwitch
            id={"toggle-minimap"}
            checked={debugOptions.minimap}
            onChange={() =>
              dispatch(setDebugOptions({ minimap: !debugOptions.minimap }))
            }
          />
        </ItemContainer>
        {debugOptions.minimap && (
          <NestedItemContainer>
            <Title left={16} id={"toggle-different-viewports-title"}>
              Use different Viewports
            </Title>
            <ToggleSwitch
              id={"toggle-minimap-viewport"}
              checked={debugOptions.minimapViewport}
              onChange={() =>
                dispatch(
                  setDebugOptions({
                    minimapViewport: !debugOptions.minimapViewport,
                  })
                )
              }
            />
          </NestedItemContainer>
        )}
        <ItemContainer>
          <Title left={16} id={"toggle-loading-tiles-title"}>
            Loading Tiles
          </Title>
          <ToggleSwitch
            id={"toggle-loading-tiles"}
            checked={debugOptions.loadTiles}
            onChange={() =>
              dispatch(setDebugOptions({ loadTiles: !debugOptions.loadTiles }))
            }
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16} id={"toggle-picking-title"}>
            Enable picking
          </Title>
          <ToggleSwitch
            id={"toggle-enable-picking"}
            checked={debugOptions.pickable}
            onChange={() =>
              dispatch(setDebugOptions({ pickable: !debugOptions.pickable }))
            }
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16} id={"toggle-wireframe-title"}>
            Wireframe mode
          </Title>
          <ToggleSwitch
            id={"toggle-enable-wireframe"}
            checked={debugOptions.wireframe}
            onChange={() =>
              dispatch(setDebugOptions({ wireframe: !debugOptions.wireframe }))
            }
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16} id={"toggle-texture-uv-title"}>
            Texture UVs
          </Title>
          <ToggleSwitch
            id={"toggle-enable-texture-uvs"}
            checked={debugOptions.showUVDebugTexture}
            onChange={() =>
              dispatch(
                setDebugOptions({
                  showUVDebugTexture: !debugOptions.showUVDebugTexture,
                })
              )
            }
          />
        </ItemContainer>
        <Title top={8} left={16} bottom={16} id={"color-section-title"}>
          Color
        </Title>
        <RadioButtonWrapper>
          {Object.keys(TileColoredBy).map((value) => {
            const selected =
              debugOptions.tileColorMode === TileColoredBy[value]
                ? SelectionState.selected
                : SelectionState.unselected;
            return (
              <ListItem
                id={`color-section-radio-button-${value}`}
                key={value}
                title={TileColoredBy[value]}
                type={ListItemType.Radio}
                selected={selected}
                onChange={() =>
                  dispatch(
                    setDebugOptions({ tileColorMode: TileColoredBy[value] })
                  )
                }
              />
            );
          })}
        </RadioButtonWrapper>
        <PanelHorizontalLine top={10} />
        <ItemContainer>
          <Title left={16} id={"bounding-volumes-section-title"}>
            Bounding Volumes
          </Title>
          <ToggleSwitch
            id={"toggle-enable-bounding-volumes"}
            checked={debugOptions.boundingVolume}
            onChange={() =>
              dispatch(
                setDebugOptions({
                  boundingVolume: !debugOptions.boundingVolume,
                })
              )
            }
          />
        </ItemContainer>
        {debugOptions.boundingVolume && (
          <>
            <Title
              top={8}
              left={16}
              bottom={16}
              id={"bounding-volume-type-title"}
            >
              Type
            </Title>
            <RadioButtonWrapper>
              {Object.keys(BoundingVolumeType).map((value) => {
                const selected =
                  debugOptions.boundingVolumeType === BoundingVolumeType[value]
                    ? SelectionState.selected
                    : SelectionState.unselected;
                return (
                  <ListItem
                    id={`bounding-volume-type-button-${value}`}
                    key={value}
                    title={BoundingVolumeType[value]}
                    type={ListItemType.Radio}
                    selected={selected}
                    onChange={() =>
                      dispatch(
                        setDebugOptions({
                          boundingVolumeType: BoundingVolumeType[value],
                        })
                      )
                    }
                  />
                );
              })}
            </RadioButtonWrapper>
            <Title
              top={8}
              left={16}
              bottom={16}
              id={"bounding-volume-color-title"}
            >
              Color
            </Title>
            <RadioButtonWrapper>
              {Object.keys(BoundingVolumeColoredBy).map((value) => {
                const selected =
                  debugOptions.boundingVolumeColorMode ===
                  BoundingVolumeColoredBy[value]
                    ? SelectionState.selected
                    : SelectionState.unselected;
                return (
                  <ListItem
                    id={`bounding-volume-color-button-${value}`}
                    key={value}
                    title={BoundingVolumeColoredBy[value]}
                    type={ListItemType.Radio}
                    selected={selected}
                    onChange={() =>
                      dispatch(
                        setDebugOptions({
                          boundingVolumeColorMode:
                            BoundingVolumeColoredBy[value],
                        })
                      )
                    }
                  />
                );
              })}
            </RadioButtonWrapper>
          </>
        )}
      </ToggleOptionsContainer>
    </PanelContainer>
  );
};
