import { useEffect, useRef } from "react";
import { useArcgis } from "../../hooks/use-arcgis-hook/use-arcgis-hook";
import { StyledMapContainer } from "../common-styled";

/* eslint-disable-next-line */
export interface ArcgisWrapperProps {}

export function ArcgisWrapper({}: ArcgisWrapperProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map: unknown | null = useArcgis(mapContainer);

  useEffect(() => {
    if (!map) {
      return;
    }

    const layers = [];
    // @ts-expect-error @deck.gl/arcgis has no types
    map.deck.set({ layers });
  }, [map]);

  return (
    <StyledMapContainer
      ref={mapContainer}
      className="map-container"
      data-testid="ArcgisContainer"
    />
  );
}

export default ArcgisWrapper;
