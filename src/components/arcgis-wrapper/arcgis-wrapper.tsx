import { Map as ArcGisMap } from "@esri/react-arcgis";
import { loadArcGISModules } from "@deck.gl/arcgis";
import { useEffect, useState } from "react";

function DeckGLLayer(props) {
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    let deckLayer;
    loadArcGISModules().then(({ DeckLayer }) => {
      deckLayer = new DeckLayer({});
      setLayer(deckLayer);
      props.map.add(deckLayer);
    });
    return () => deckLayer && props.map.remove(deckLayer);
  }, []);

  if (layer) {
    // @ts-expect-error @deck.gl/arcgis has no types
    layer.deck.set(props);
  }

  return null;
}

export function ArcgisWrapper() {
  const layers = [];

  return (
    <ArcGisMap
      mapProperties={{ basemap: "dark-gray-vector" }}
      viewProperties={{
        center: [-122.44, 37.75],
        zoom: 12,
      }}
    >
      <DeckGLLayer layers={layers} />
    </ArcGisMap>
  );
}

export default ArcgisWrapper;
