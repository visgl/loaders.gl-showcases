import { Map as MaplibreMap } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { MapController } from "@deck.gl/core";
import { View } from "@deck.gl/core";
import { CONTRAST_MAP_STYLES } from "../../constants/map-styles";
import {
  useMapsWrapper,
  MapsHookProps,
} from "../../hooks/use-maps-hook/use-maps-hook";

type DeckGlI3sProps = MapsHookProps;

export const DeckGlWrapper = ({
  id,
  parentViewState,
  coloredTilesMap,
  pickable = false,
  layers3d,
  lastLayerSelectedId,
  loadDebugTextureImage = false,
  featurePicking = true,
  normalsDebugData,
  normalsTrianglesPercentage = 100,
  normalsLength = 1,
  metadata,
  selectedTilesetBasePath,
  selectedTile,
  selectedIndex,
  autoHighlight = false,
  loadedTilesets = [],
  useDracoGeometry = true,
  useCompressedTextures = true,
  disableController = false,
  loadNumber = 0,
  preventTransitions = false,
  minimapPosition,
  onViewStateChange,
  onWebGLInitialized,
  onAfterRender,
  getTooltip,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
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
  } = useMapsWrapper({
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
    onViewStateChange,
    onWebGLInitialized,
    onAfterRender,
    getTooltip,
    onClick,
    onTilesetLoad,
    onTileLoad,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTileUnload,
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
