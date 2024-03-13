import { loadArcGISModules } from "@deck.gl/arcgis";
import { useState, useEffect, MutableRefObject, useRef } from "react";

export function useArcgis(
  mapContainer: MutableRefObject<null | HTMLDivElement>,
  viewState,
  onViewStateChangeHandler
): unknown | null {
  const [renderer, setRenderer] = useState<unknown>(null);
  const [sceneView, setSceneView] = useState<unknown | null>(null);
  const { longitude, latitude, pitch, bearing, zoom } = viewState.main;
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!sceneView) {
      return;
    }
    // @ts-expect-error no ArcGIS types
    sceneView.goTo(
      {
        zoom: zoom,
        heading: bearing,
        tilt: pitch,
        center: [longitude, latitude],
      },
      { animate: true }
    );
  }, [longitude, latitude, zoom, bearing, pitch, sceneView]);

  useEffect(() => {
    if (mapContainer.current == null) {
      return;
    }
    if (sceneView || isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;
    loadArcGISModules([
      "esri/Map",
      "esri/views/SceneView",
      "esri/views/3d/externalRenderers",
    ]).then(
      ({
        DeckRenderer,
        modules: [ArcGISMap, SceneView, externalRenderers],
      }) => {
        const sceneView = new SceneView({
          container: mapContainer.current,
          map: new ArcGISMap({
            basemap: "dark-gray-vector",
          }),
          environment: {
            atmosphereEnabled: false,
            starsEnabled: false,
          },
          qualityProfile: "high",
          camera: {
            position: { x: longitude, y: latitude, z: 100 },
            heading: bearing,
            tilt: pitch,
          },
          zoom: zoom,
          ui: { components: ["attribution"] },
          viewingMode: "local",
        });
        setSceneView(sceneView);

        sceneView.on("drag", (event) => {
          if (event.action === "update") {
            onViewStateChangeHandler({
              interactionState: { isZooming: false },
              viewState: {
                ...viewState.main,
                longitude: sceneView.center.longitude,
                latitude: sceneView.center.latitude,
                bearing: sceneView.camera.heading,
                pitch: sceneView.camera.tilt,
                zoom: sceneView.zoom,
              },
              viewId: "main",
            });
          }
        });
        sceneView.on("mouse-wheel", () => {
          onViewStateChangeHandler({
            interactionState: { isZooming: false },
            viewState: {
              ...viewState.main,
              longitude: sceneView.center.longitude,
              latitude: sceneView.center.latitude,
              bearing: sceneView.camera.heading,
              pitch: sceneView.camera.tilt,
              zoom: sceneView.zoom,
            },
            viewId: "main",
          });
        });

        const deckRenderer = new DeckRenderer(sceneView, {});
        setRenderer(deckRenderer);
        externalRenderers.add(sceneView, deckRenderer);
      }
    );
  }, [sceneView, mapContainer, bearing, latitude, longitude, zoom]);

  return renderer;
}
export default useArcgis;
