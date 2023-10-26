import { Suspense, lazy, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectMapProvider } from "../../redux/slices/app.slice";
import { BaseMapProviderId } from "../../constants/base-map-providers";

interface DeckglWrapperProps {}
// @ts-expect-error Maplibre & Mapbox types are different
const DeckglWrapper = lazy(() => import("../deck-gl-wrapper/deck-gl-wrapper"));
export const createDeckglWith = (
  baseMapProviderId:
    | BaseMapProviderId.maplibre
    | BaseMapProviderId.mapbox2
    | BaseMapProviderId.googleMaps
    | BaseMapProviderId.arcgis
) => {
  return (props: DeckglWrapperProps) => {
    return <DeckglWrapper {...props} baseMapProviderId={baseMapProviderId} />;
  };
};

export interface InterleavedMapProps {}
const ArcgisWrapper = lazy(() => import("../arcgis-wrapper/arcgis-wrapper"));

interface GoogleMapsWrapperProps {
  interleaved?: boolean;
}
const GoogleMapsWrapper = lazy(
  () => import("../google-maps-wrapper/google-maps-wrapper")
);
const createGoogleMapWith = (interleaved: boolean) => {
  return (props: GoogleMapsWrapperProps) => {
    return <GoogleMapsWrapper interleaved={false} />;
  };
};

/* eslint-disable-next-line */
export interface MapWrapperProps {}

export function MapWrapper(props: MapWrapperProps) {
  const mapProvider = useAppSelector(selectMapProvider);
  const OverlaidComponent = useMemo(() => {
    switch (mapProvider.id) {
      case BaseMapProviderId.maplibre:
        return createDeckglWith(mapProvider.id);
      case BaseMapProviderId.mapbox2:
        return createDeckglWith(mapProvider.id);
      case BaseMapProviderId.googleMaps:
        return createGoogleMapWith(false);
      case BaseMapProviderId.arcgis:
        return ArcgisWrapper;
      default:
        return null;
    }
  }, [mapProvider]);
  return (
    <>
      {OverlaidComponent && (
        <Suspense fallback={null}>
          <OverlaidComponent />
        </Suspense>
      )}
    </>
  );
}
export default MapWrapper;
