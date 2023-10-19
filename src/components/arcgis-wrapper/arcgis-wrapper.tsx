import { useEffect, useRef } from "react";
// import { Vehicle } from "../../utils/vehicles-utils";
import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { StyledMapContainer } from "../common-styled";
// import { renderVehicleLayer } from "../../utils/deckgl-layers-utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import {
//  selectAllColors,
//  selectDimensionMode,
//  selectPickableState,
//  selectScale,
//  selectSize,
//  selectSizeMode,
// } from "../../redux/slices/layer-props.slice";
// simport { appActions } from "../../redux/slices/app.slice";

/* eslint-disable-next-line */
export interface ArcgisWrapperProps {
  //  vehicles: Vehicle[];
}

export function ArcgisWrapper({}: ArcgisWrapperProps) {
  //  const dispatch = useAppDispatch();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map: unknown | null = useArcgis(mapContainer);
  //  const sizeMode = useAppSelector(selectSizeMode);
  //  const size = useAppSelector(selectSize);
  //  const vehicleScale = useAppSelector(selectScale);
  //  const dimesionMode = useAppSelector(selectDimensionMode);
  //  const pickableState = useAppSelector(selectPickableState);
  //  const colors = useAppSelector(selectAllColors);

  useEffect(() => {
    if (!map) {
      return;
    }

    const layers = [
      //      renderVehicleLayer(
      //        vehicles,
      //        sizeMode,
      //        size,
      //        vehicleScale,
      //        dimesionMode,
      //        pickableState,
      //        (pickingInfo) => {
      //          dispatch(appActions.setPickingData(pickingInfo.object));
      //          return true;
      //        },
      //        false,
      //        ...colors
      //      ),
    ];
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
  }, [
    //    vehicles,
    map,
    //    sizeMode,
    //    size,
    //    vehicleScale,
    //    dimesionMode,
    //    pickableState,
    //    dispatch,
    //    colors,
  ]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="ArcgisContainer"
    />
  );
}

export default ArcgisWrapper;
