import React from "react";
import { useState, useCallback } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { I3SLoader } from "@loaders.gl/i3s";
import { MapView, LinearInterpolator } from "@deck.gl/core";

const TILESET_URL = `https://tiles.arcgis.com/tiles/UE5k7ygNe76vVJgy/arcgis/rest/services/SF_cut_3/SceneServer/layers/0`;
const DEFAULT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  transitionDuration: 0,
  longitude: -122.40217135287753,
  latitude: 37.7953686105136,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 18,
};

const VIEW = new MapView({
  id: "main",
  controller: {
    inertia: true,
    dragPan: false,
    dragRotate: false,
    scrollZoom: false,
  },
  farZMultiplier: 2.02,
});

/**
 * TODO: Add types to component
 */
export const Dashboard = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const transitionInterpolator = new LinearInterpolator(["bearing"]);

  const rotateCamera = useCallback(() => {
    setViewState((viewState) => ({
      ...viewState,
      bearing: viewState.bearing + 30,
      transitionDuration: 10000,
      transitionInterpolator,
      onTransitionEnd: rotateCamera,
    }));
  }, []);

  const onTilesetLoad = () => {
    setViewState(INITIAL_VIEW_STATE);
    rotateCamera();
  };

  const tile3DLayer = new Tile3DLayer({
    id: "i3s-dashboard-example",
    data: TILESET_URL,
    loader: I3SLoader,
    onTilesetLoad,
  });

  return (
    <DeckGL
      id={"dashboard-app"}
      controller={false}
      views={[VIEW]}
      layers={[tile3DLayer]}
      initialViewState={viewState}
    >
      <StaticMap mapStyle={DEFAULT_MAP_STYLE} />
    </DeckGL>
  );
};
