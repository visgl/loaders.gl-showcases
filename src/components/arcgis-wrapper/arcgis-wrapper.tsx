import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { useRef } from "react";
import {
  UseMapsWrapper,
  MapsHookProps,
} from "../../hooks/use-maps-hook/use-maps-hook";
import styled from "styled-components";

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

type ArcgisWrapperProps = MapsHookProps;

export const ArcgisWrapper = ({
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
}: ArcgisWrapperProps) => {
  const {
    layers,
    viewState,
    // eslint-disable-next-line
    views,
    // eslint-disable-next-line
    dragMode,
    // eslint-disable-next-line
    showTerrain,
    // eslint-disable-next-line
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

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useArcgis(mapContainer, viewState, onViewStateChangeHandler);
  if (map) {
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.layerFilter = layerFilter;
  }
  return <StyledMapContainer ref={mapContainer} />;
};

export default ArcgisWrapper;
