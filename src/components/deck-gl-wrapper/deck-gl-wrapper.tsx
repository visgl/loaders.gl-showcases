import { Map as MaplibreMap } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { MapController } from "@deck.gl/core";
import { View } from "@deck.gl/core";
import { CONTRAST_MAP_STYLES } from "../../constants/map-styles";
import {
  UseMapsWrapper,
  MapsHookProps,
} from "../../hooks/use-maps-hook/use-maps-hook";

type DeckGlI3sProps = MapsHookProps;

export const DeckGlWrapper = ({
  id,
  parentViewState,
  coloredTilesMap,
  pickable,
  layers3d,
  lastLayerSelectedId,
  loadDebugTextureImage,
  featurePicking,
  normalsDebugData,
  normalsTrianglesPercentage,
  normalsLength,
  metadata,
  selectedTilesetBasePath,
  selectedTile,
  selectedIndex,
  autoHighlight,
  loadedTilesets,
  useDracoGeometry,
  useCompressedTextures,
  disableController,
  loadNumber,
  preventTransitions,
  minimapPosition,
  filtersByAttribute,
  onViewStateChange,
  onWebGLInitialized,
  onAfterRender,
  getTooltip,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload,
  onTraversalComplete,
}: DeckGlI3sProps) => {
  const {
    layers,
    viewState,
    views,
    dragMode,
    showTerrain,
    mapStyle,
    layerFilter,
    onViewStateChangeHandler,
  } = UseMapsWrapper({
    id,
    parentViewState,
    coloredTilesMap,
    pickable,
    layers3d,
    lastLayerSelectedId,
    loadDebugTextureImage,
    featurePicking,
    normalsDebugData,
    normalsTrianglesPercentage,
    normalsLength,
    metadata,
    selectedTilesetBasePath,
    selectedTile,
    selectedIndex,
    autoHighlight,
    loadedTilesets,
    useDracoGeometry,
    useCompressedTextures,
    disableController,
    loadNumber,
    preventTransitions,
    minimapPosition,
    filtersByAttribute,
    onViewStateChange,
    onWebGLInitialized,
    onAfterRender,
    getTooltip,
    onClick,
    onTilesetLoad,
    onTileLoad,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTileUnload,
    onTraversalComplete,
  });

  return (
    <DeckGL
      id={id}
      layers={layers}
      viewState={viewState}
      views={views}
      layerFilter={layerFilter}
      onViewStateChange={onViewStateChangeHandler}
      controller={
        disableController
          ? false
          : {
              type: MapController,
              maxPitch: 60,
              inertia: true,
              scrollZoom: { speed: 0.01, smooth: true },
              touchRotate: true,
              dragMode,
            }
      }
      glOptions={{
        preserveDrawingBuffer: true,
      }}
      onWebGLInitialized={onWebGLInitialized}
      onAfterRender={onAfterRender}
      getTooltip={getTooltip}
      onClick={onClick}
    >
      {!showTerrain && (
        <MaplibreMap mapStyle={mapStyle} terrain={undefined}></MaplibreMap>
      )}
      {mapStyle && (
        <View id="minimap">
          <MaplibreMap mapStyle={CONTRAST_MAP_STYLES[mapStyle]}></MaplibreMap>
        </View>
      )}
    </DeckGL>
  );
};
