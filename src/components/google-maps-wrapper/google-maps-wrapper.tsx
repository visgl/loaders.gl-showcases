import { useState, useEffect, useMemo } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GoogleMapsOverlay as DeckOverlay } from "@deck.gl/google-maps/typed";
import { StyledMapContainer } from "../common-styled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const googleMapsApiToken = ""; //process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const googleMapsMapId = ""; //process.env.REACT_APP_GOOGLE_MAP_VECTOR_ID;

/* eslint-disable-next-line */
interface GoogleMapsWrapperProps {
  interleaved?: boolean;
}

const renderMap = (status: Status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <h3>{status} .</h3>;
};

export function GoogleMapsWrapper({
  interleaved = false,
}: GoogleMapsWrapperProps) {
  const dispatch = useAppDispatch();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { longitude, latitude, zoom, pitch, bearing } = {
    longitude: 10,
    latitude: 20,
    zoom: 10,
    pitch: 1,
    bearing: 1,
  };
  /// const { longitude, latitude, zoom, pitch, bearing } =
  ///  useAppSelector(selectMapState);

  const overlay = useMemo(
    () =>
      new DeckOverlay({
        interleaved,
        layers: [],
      }),
    [interleaved]
  );

  useEffect(() => {
    if (map) {
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(zoom);
      map.setHeading(bearing);
      map.setTilt(pitch);
      overlay.setMap(map);
    }
  }, [map, latitude, longitude, bearing, pitch, zoom, overlay]);

  useEffect(() => {
    if (!mapContainer) {
      return;
    }
    const mapInstance = new google.maps.Map(mapContainer, {
      mapId: googleMapsMapId,
    });
    setMap(mapInstance);
  }, [mapContainer]);

  const setRef = (element: HTMLDivElement) => {
    setMapContainer(element);
  };

  return (
    <Wrapper apiKey={googleMapsApiToken} render={renderMap}>
      <StyledMapContainer ref={setRef} id="map" />
    </Wrapper>
  );
}

export default GoogleMapsWrapper;
