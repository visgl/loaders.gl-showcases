import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { useRef } from "react";
import {
  useMapsWrapper,
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

type ArcGisMapProps = MapsHookProps;

export const ArcgisWrapper = ({
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  onWebGLInitialized,
  // eslint-disable-next-line
  onAfterRender,
  // eslint-disable-next-line
  getTooltip,
  onClick,
  onTilesetLoad,
  onTileLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTileUnload = () => {},
}: ArcGisMapProps) => {
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
