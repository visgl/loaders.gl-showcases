import { ReactEventHandler } from "react";
import styled from "styled-components";

import { DebugOptionsAction, DebugOptionsActionKind, DebugOptions } from "../../pages/debug-app/debug-app";
import { BoundingVolumeType, ListItemType, SelectionState } from "../../types";
import { BoundingVolumeColoredBy, TileColoredBy } from "../../utils/debug/colors-map";
import { useAppLayout } from "../../utils/hooks/layout";
import { CloseButton } from "../close-button/close-button";
import { Panels, PanelContainer, PanelHeader, Title, PanelHorizontalLine } from "../common"
import { ListItem } from "../layers-panel/list-item/list-item";
import { ToggleSwitch } from "../toogle-switch/toggle-switch";

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
  debugOptions: DebugOptions,
  onChangeOption: React.Dispatch<DebugOptionsAction>,
  onClose: ReactEventHandler
};

export const DebugPanel = ({ debugOptions, onChangeOption, onClose }: DebugPanelProps) => {
  const layout = useAppLayout();

  return (
    <PanelContainer layout={layout}>
      <PanelHeader panel={Panels.Debug}>
        <Title left={16}>Debug Panel</Title>
      </PanelHeader>
      <CloseButtonWrapper>
        <CloseButton id="layers-panel-close-button" onClick={onClose} />
      </CloseButtonWrapper>
      <PanelHorizontalLine top={10} />
      <ToggleOptionsContainer>
        <ItemContainer>
          <Title left={16}>Minimap</Title>
          <ToggleSwitch
            id={'toggle-minimap'}
            checked={debugOptions.minimap}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'minimap' } })}
          />
        </ItemContainer>
        {debugOptions.minimap && (
          <NestedItemContainer>
            <Title left={16}>Use different Viewports</Title>
            <ToggleSwitch
              id={'toggle-minimap-viewport'}
              checked={debugOptions.minimapViewport}
              onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'minimapViewport' } })}
            />
          </NestedItemContainer>
        )}
        <ItemContainer>
          <Title left={16}>Loading Tiles</Title>
          <ToggleSwitch
            id={'toggle-loading-tiles'}
            checked={debugOptions.loadTiles}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'loadTiles' } })}
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16}>Enable picking</Title>
          <ToggleSwitch
            id={'toggle-enable-picking'}
            checked={debugOptions.pickable}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'pickable' } })}
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16}>Wireframe mode</Title>
          <ToggleSwitch
            id={'toggle-enable-wireframe'}
            checked={debugOptions.wireframe}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'wireframe' } })}
          />
        </ItemContainer>
        <ItemContainer>
          <Title left={16}>Texture UVs</Title>
          <ToggleSwitch
            id={'toggle-enable-texture-uvs'}
            checked={debugOptions.showUVDebugTexture}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'showUVDebugTexture' } })}
          />
        </ItemContainer>
        <Title top={8} left={16} bottom={16}>Color</Title>
        <RadioButtonWrapper>
          {
            Object.keys(TileColoredBy).map(value => {
              const selected = debugOptions.tileColorMode === TileColoredBy[value] ? SelectionState.selected : SelectionState.unselected;
              return (
                <ListItem
                  id={value}
                  key={value}
                  title={TileColoredBy[value]}
                  type={ListItemType.Radio}
                  selected={selected}
                  onChange={() => onChangeOption({ type: DebugOptionsActionKind.select, payload: { optionName: 'tileColorMode', value: TileColoredBy[value] } })}
                />
              )
            })
          }
        </RadioButtonWrapper>
        <PanelHorizontalLine top={10} />
        <ItemContainer>
          <Title left={16}>Bounding Volumes</Title>
          <ToggleSwitch
            id={'toggle-enable-bounding-volumes'}
            checked={debugOptions.boundingVolume}
            onChange={() => onChangeOption({ type: DebugOptionsActionKind.toggle, payload: { optionName: 'boundingVolume' } })}
          />
        </ItemContainer>
        {debugOptions.boundingVolume && (
          <>
            <Title top={8} left={16} bottom={16}>Type</Title>
            <RadioButtonWrapper>
              {
                Object.keys(BoundingVolumeType).map(value => {
                  const selected = debugOptions.boundingVolumeType === BoundingVolumeType[value] ? SelectionState.selected : SelectionState.unselected;
                  return (
                    <ListItem
                      id={value}
                      key={value}
                      title={BoundingVolumeType[value]}
                      type={ListItemType.Radio}
                      selected={selected}
                      onChange={() => onChangeOption({ type: DebugOptionsActionKind.select, payload: { optionName: 'boundingVolumeType', value: BoundingVolumeType[value] } })}
                    />
                  )
                })
              }
            </RadioButtonWrapper>
            <Title top={8} left={16} bottom={16}>Color</Title>
            <RadioButtonWrapper>
              {
                Object.keys(BoundingVolumeColoredBy).map(value => {
                  const selected = debugOptions.boundingVolumeColorMode === BoundingVolumeColoredBy[value] ? SelectionState.selected : SelectionState.unselected;
                  return (
                    <ListItem
                      id={value}
                      key={value}
                      title={BoundingVolumeColoredBy[value]}
                      type={ListItemType.Radio}
                      selected={selected}
                      onChange={() => onChangeOption({ type: DebugOptionsActionKind.select, payload: { optionName: 'boundingVolumeColorMode', value: BoundingVolumeColoredBy[value] } })}
                    />
                  )
                })
              }
            </RadioButtonWrapper>
          </>
        )}
      </ToggleOptionsContainer>
    </PanelContainer>
  )
}
