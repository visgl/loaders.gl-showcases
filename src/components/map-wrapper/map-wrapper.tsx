import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  //  selectAnimationState,
  selectTerrainState,
  //  selectUseCase,
  //  selectVehiclesCountValue,
} from "../../redux/slices/layer-props.slice";
// import {
//  selectAllRoutes2d,
//  selectAllRoutes3d,
// } from "../../redux/slices/routes.slice";
// import { GeojsonRouteFeature } from "../../utils/load-routes";
// import {
//  Vehicle,
//  SfVehicle,
//  animateVehicles,
//  createSfVehicles,
//  createAnfieldVehicles,
// } from "../../utils/vehicles-utils";
import {
  appActions,
  selectBaseMapMode,
  selectMapProvider,
} from "../../redux/slices/app.slice";
import { BaseMapMode, UseCaseId } from "../../types";

import { BaseMapProviderId } from "../../constants/base-map-providers";
import Unsupported from "../unsupported/unsupported";
// import { calculateCurrentFps, updateAverageFps } from "../../utils/fps-utils";
// import { mapActions } from "../../redux/slices/map.slice";
// import { anfieldViewState, sfViewState } from "../../constants/view-states";
import Loading from "../loading/loading";

interface DeckglWrapperProps {
  //  vehicles: Vehicle[];
}
const DeckglWrapper = lazy(() => import("../deck-gl-wrapper/deck-gl-wrapper"));
export const createDeckglWith = (
  baseMapProviderId: BaseMapProviderId.mapbox2 | BaseMapProviderId.maplibre
) => {
  return (props: DeckglWrapperProps) => {
    return <DeckglWrapper {...props} baseMapProviderId={baseMapProviderId} />;
  };
};

export interface InterleavedMapProps {
  //  vehicles: Vehicle[];
}
const InterleavedMap = lazy(() => import("../interleaved-map/interleaved-map"));
export const createInterleavedContainerWith = (
  baseMapProviderId: BaseMapProviderId.maplibre | BaseMapProviderId.mapbox2
) => {
  return (props: InterleavedMapProps) => {
    return <InterleavedMap {...props} baseMapProviderId={baseMapProviderId} />;
  };
};
const ArcgisWrapper = lazy(() => import("../arcgis-wrapper/arcgis-wrapper"));

interface GoogleMapsWrapperProps {
  //  vehicles: Vehicle[];
  interleaved?: boolean;
}
const GoogleMapsWrapper = lazy(
  () => import("../google-maps-wrapper/google-maps-wrapper")
);
const createGoogleMapWith = (interleaved: boolean) => {
  return (props: GoogleMapsWrapperProps) => {
    //    return <GoogleMapsWrapper {...props} interleaved={interleaved} />;
    return <GoogleMapsWrapper interleaved={interleaved} />;
  };
};

/* eslint-disable-next-line */
export interface MapWrapperProps {}

export function MapWrapper(props: MapWrapperProps) {
  const dispatch = useAppDispatch();
  // const useCase = useAppSelector(selectUseCase);
  //  const vehiclesCount = useAppSelector(selectVehiclesCountValue);

  //  const animationState = useAppSelector(selectAnimationState);
  //  const animationStateRef = useRef<boolean>(true);
  //  animationStateRef.current = animationState;

  const terrainState = useAppSelector(selectTerrainState);

  //  const routes2d: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes2d);
  //  const routes3d: GeojsonRouteFeature[] = useAppSelector(selectAllRoutes3d);
  //  const routesRef = useRef<GeojsonRouteFeature[]>(routes2d);

  //  const sfVehiclesRef = useRef<SfVehicle[]>([]);
  //  const anfieldVehiclesRef = useRef<Vehicle[]>(createAnfieldVehicles());
  //  const animationStarted = useRef<boolean>(false);
  //  const [animatedVehicles, setAnimatedVehicles] = useState<Vehicle[]>([]);
  //  const animatedVehiclesRef = useRef<Vehicle[]>([]);
  //  animatedVehiclesRef.current = animatedVehicles;

  const baseMapMode = useAppSelector(selectBaseMapMode);
  const mapProvider = useAppSelector(selectMapProvider);

  //  const fpsRef = useRef<{ value: number; count: number }>({
  //    value: 0,
  //    count: 0,
  //  });

  //  const animateLayer = useCallback(() => {
  //    animationStarted.current = true;

  //    const rerenderLayer = (): void => {
  //      const sfAnimatedVehicles = animateVehicles(
  //        sfVehiclesRef.current,
  //        routesRef.current
  //      );
  //      const newAnimatedVehicles = sfAnimatedVehicles.concat(
  //        anfieldVehiclesRef.current
  //      );
  //      setAnimatedVehicles(newAnimatedVehicles);
  //    };

  //    let then = 0;
  //    const animate = (now: number): void => {
  //      const { currentFps, newThen } = calculateCurrentFps(then, now);
  //      then = newThen;
  //      fpsRef.current = updateAverageFps(fpsRef.current, currentFps);

  //      dispatch(appActions.setFps(fpsRef.current.value));
  //      if (animationStateRef.current || !animatedVehiclesRef.current.length) {
  //        rerenderLayer();
  //      }

  //      window.requestAnimationFrame(animate);
  //    };

  //    window.requestAnimationFrame(animate);
  //  }, [dispatch, animationStateRef, animatedVehiclesRef]);

  //  useEffect(() => {
  //    if (!animationStarted.current) {
  //      animateLayer();
  //    }
  //  }, [animateLayer]);

  //  useEffect(() => {
  //    if (terrainState) {
  //      routesRef.current = routes3d;
  //    } else {
  //      routesRef.current = routes2d;
  //    }
  //  }, [routes2d, routes3d, terrainState]);

  //  useEffect(() => {
  //    if (useCase === UseCaseId.SF_TRANSIT) {
  //      sfVehiclesRef.current = createSfVehicles(
  //        vehiclesCount,
  //        terrainState ? routes3d : routes2d
  //      );
  //    } else {
  //      sfVehiclesRef.current = [];
  //    }
  //  }, [
  //    vehiclesCount,
  //    routes2d,
  //    routes3d,
  //    terrainState,
  //    animationState,
  //    useCase,
  //  ]);

  //  useEffect(() => {
  //    if (useCase === UseCaseId.SF_TRANSIT) {
  //      dispatch(mapActions.setMapState(sfViewState));
  //    } else if (useCase === UseCaseId.ANFIELD) {
  //      dispatch(mapActions.setMapState(anfieldViewState));
  //    }
  //  }, [useCase, dispatch]);

  //  useEffect(() => {
  //    dispatch(appActions.resetFps());
  //    fpsRef.current = { value: 60, count: 1 };
  //    setAnimatedVehicles([]);
  //  }, [baseMapMode, mapProvider, terrainState, vehiclesCount, fpsRef, dispatch]);

  const OverlaidComponent = useMemo(() => {
    switch (mapProvider.id) {
      case BaseMapProviderId.maplibre:
        return createDeckglWith(mapProvider.id);
      case BaseMapProviderId.mapbox2:
        return createDeckglWith(mapProvider.id);
      case BaseMapProviderId.googleMaps:
        return createGoogleMapWith(false);
      case BaseMapProviderId.arcgis:
        return Unsupported;
      default:
        return null;
    }
  }, [mapProvider]);

  const InterleavedComponent = useMemo(() => {
    switch (mapProvider.id) {
      case BaseMapProviderId.maplibre:
        return createInterleavedContainerWith(mapProvider.id);
      case BaseMapProviderId.mapbox2:
        return createInterleavedContainerWith(mapProvider.id);
      case BaseMapProviderId.googleMaps:
        return createGoogleMapWith(true);
      case BaseMapProviderId.arcgis:
        return ArcgisWrapper;
      default:
        return null;
    }
  }, [mapProvider]);

  return (
    <>
      {baseMapMode === BaseMapMode.OVERLAID && OverlaidComponent && (
        <Suspense fallback={<Loading />}>
          <OverlaidComponent />
        </Suspense>
      )}
      {baseMapMode === BaseMapMode.INTERLEAVED && InterleavedComponent && (
        <Suspense fallback={<Loading />}>
          <InterleavedComponent />
        </Suspense>
      )}
    </>
  );
}

export default MapWrapper;
