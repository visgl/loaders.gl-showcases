import { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef, useMemo } from "react";
// import { Vehicle } from "../../utils/vehicles-utils";
import { useMapbox } from "../../hooks/use-mapbox-hook/use-mapbox-hook";
import { StyledMapContainer } from "../common-styled";
import {
  BaseMapProviderId,
  MAP_PROVIDER_PROPERTIES,
} from "../../constants/base-map-providers";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import {
//  selectAllColors,
//  selectDimensionMode,
//  selectPickableState,
//  selectScale,
//  selectSize,
//  selectSizeMode,
//  selectTerrainState,
// } from "../../redux/slices/layer-props.slice";
// import { getMapboxLayer } from "../../utils/deckgl-layers-utils";
// import { appActions } from "../../redux/slices/app.slice";

// const VEHICLE_LAYER_ID = "transit-model-vehicle-layer";

export interface InterleavedMapInternalProps {
  //  vehicles: Vehicle[];
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2;
}

export const getLabelLayerId = (map: MapboxMap): string | undefined => {
  // Insert the layer beneath any symbol layer.
  let layers = map.getStyle().layers;
  if (layers == null) {
    layers = [];
  }
  const labelLayerId = layers.find(
    (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
  )?.id;
  return labelLayerId;
};

export function InterleavedMap({
  //  vehicles,
  baseMapProviderId,
}: InterleavedMapInternalProps) {
  const dispatch = useAppDispatch();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useMapbox(mapContainer, baseMapProviderId);
  //  const sizeMode = useAppSelector(selectSizeMode);
  //  const size = useAppSelector(selectSize);
  //  const vehicleScale = useAppSelector(selectScale);
  //  const dimensionMode = useAppSelector(selectDimensionMode);
  //  const pickableState = useAppSelector(selectPickableState);
  const terrainState = false;
  // useAppSelector(selectTerrainState);
  // const colors = useAppSelector(selectAllColors);

  const mapProviderProps = useMemo(
    () => MAP_PROVIDER_PROPERTIES[baseMapProviderId],
    [baseMapProviderId]
  );

  useEffect(() => {
    if (!map) {
      return;
    }
    if (terrainState) {
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({
        source: mapProviderProps.terrainProps.id,
        exaggeration: 1,
      });
    } else {
      // @ts-expect-error setTerrain expects properties
      map.setTerrain();
    }
  }, [map, baseMapProviderId, terrainState, mapProviderProps]);

  useEffect(() => {
    //    if (!map) {
    //      return;
    //    }

    //    if (map.getLayer(VEHICLE_LAYER_ID) != null) {
    //      map.removeLayer(VEHICLE_LAYER_ID);
    //    }

    //    let firstLabelLayerId: undefined | string;
    //    if (map instanceof MapboxMap) {
    //      firstLabelLayerId = getLabelLayerId(map);
    //    }
    //    const [commonColor, foregroundColor2d, backgroundColor2d, color3D] = colors;

    //    if (terrainState && baseMapProviderId === BaseMapProviderId.mapbox2) {
    //      for (const vehicle of vehicles) {
    //        const mapboxElevation = map?.queryTerrainElevation({
    //          lng: vehicle.longitude,
    //          lat: vehicle.latitude,
    //        });
    //        if (typeof mapboxElevation === "number") {
    //          vehicle.elevation = mapboxElevation;
    //        }
    //      }
    //    }

    //    const mapboxLayer = getMapboxLayer(
    //      //      vehicles,
    //      sizeMode,
    //      size,
    //      vehicleScale,
    //      dimensionMode,
    //      pickableState,
    //      (pickingInfo) => {
    //        dispatch(appActions.setPickingData(pickingInfo.object));
    //        return true;
    //      },
    //      terrainState,
    //      commonColor,
    //      foregroundColor2d,
    //      backgroundColor2d,
    //      color3D
    //    );

    // @ts-expect-error maplibre and mapbox types are not compatible
    map.addLayer(mapboxLayer, firstLabelLayerId);
  }, [
    //    vehicles,
    map,
    terrainState,
    //    sizeMode,
    //    size,
    //    vehicleScale,
    //    dimensionMode,
    // colors,
    dispatch,
    //    pickableState,
    baseMapProviderId,
  ]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="MapboxContainer"
    />
  );
}

export default InterleavedMap;
