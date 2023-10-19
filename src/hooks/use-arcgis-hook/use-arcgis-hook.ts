import { loadArcGISModules } from "@deck.gl/arcgis";
import { useState, useEffect, MutableRefObject, useRef } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectMapState } from "../../redux/slices/map.slice";

export function useArcgis(
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  ...args: unknown[]
): unknown | null {
  const [renderer, setRenderer] = useState<unknown>(null);
  const [sceneView, setSceneView] = useState<unknown | null>(null);
  const { longitude, latitude, bearing } = useAppSelector(selectMapState);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!sceneView) {
      return;
    }
    // @ts-expect-error no ArcGIS types
    sceneView.goTo([longitude, latitude], { animate: false });
  }, [longitude, latitude, sceneView]);

  useEffect(() => {
    if (mapContainer.current == null) {
      return;
    }

    if (sceneView || isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;

    let deckRenderer: unknown;
    loadArcGISModules([
      "esri/Map",
      "esri/views/SceneView",
      "esri/views/3d/externalRenderers",
    ]).then(
      ({
        DeckRenderer,
        modules: [ArcGISMap, SceneView, externalRenderers],
      }) => {
        // @ ts-expect-error @deck.gl/arcgis is not typed
        const sceneView = new SceneView({
          container: mapContainer.current,
          // @ ts-expect-error @deck.gl/arcgis is not typed
          map: new ArcGISMap({
            basemap: "dark-gray-vector",
          }),
          environment: {
            atmosphereEnabled: false,
          },
          qualityProfile: "high",
          camera: {
            position: { x: longitude, y: latitude, z: 100 },
            heading: bearing,
            tilt: 0,
          },
          viewingMode: "local",
        });
        setSceneView(sceneView);

        deckRenderer = new DeckRenderer(sceneView, {});
        setRenderer(deckRenderer);
        // @ ts-expect-error cannot import type from ArcGIS API
        externalRenderers.add(sceneView, deckRenderer);
      }
    );
  }, [sceneView, mapContainer, bearing, latitude, longitude]);

  return renderer;
}
