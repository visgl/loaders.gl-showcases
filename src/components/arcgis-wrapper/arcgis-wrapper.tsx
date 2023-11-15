import { loadArcGISModules } from "@deck.gl/arcgis";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { INITIAL_EXAMPLE } from "../../constants/i3s-examples";

export const StyledMapContainer = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const INITIAL_VIEW_STATE = {
  longitude: -122.44,
  latitude: 37.78,
  bearing: 0,
};

export const ArcgisWrapper = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [sceneView, setSceneView] = useState<unknown | null>(null);
  const { longitude, latitude, bearing } = {
    longitude: INITIAL_VIEW_STATE.longitude,
    latitude: INITIAL_VIEW_STATE.latitude,
    bearing: INITIAL_VIEW_STATE.bearing,
  };
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
      "esri/layers/SceneLayer",
    ]).then(
      ({
        DeckRenderer,
        modules: [ArcGISMap, SceneView, externalRenderers, SceneLayer],
      }) => {
        const map = new ArcGISMap({
          basemap: "dark-gray-vector",
        });

        const sceneView = new SceneView({
          container: mapContainer.current,
          map: map,
          environment: {
            atmosphereEnabled: false,
            starsEnabled: false,
          },
          qualityProfile: "high",
          camera: {
            position: { x: longitude, y: latitude, z: 100 },
            heading: 10,
            tilt: 71,
          },
          ui: { components: ["attribution"] },
          viewingMode: "local",
        });
        setSceneView(sceneView);
        const sceneLayer = new SceneLayer({
          url: INITIAL_EXAMPLE.url,
          popupEnabled: false,
        });
        map.add(sceneLayer);

        deckRenderer = new DeckRenderer(sceneView, sceneLayer);
        externalRenderers.add(sceneView, deckRenderer);
      }
    );
  }, [sceneView, mapContainer, bearing, latitude, longitude]);

  return <StyledMapContainer ref={mapContainer} />;
};

export default ArcgisWrapper;
