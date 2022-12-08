import { WebMercatorViewport } from "@deck.gl/core";
import { getLonLatWithElevationOffset } from './elevation-utils';

describe("Elevation utils", () => {
  test("Should return the same longitute and latitude if no elevation offset", () => {
    const zmin = 0;
    const pitch = 30;
    const bearing = 70;
    const longitude = -122.43594497742055;
    const latitude = 37.76860441643394;

    const viewport = new WebMercatorViewport({
      longitude,
      latitude,
    });

    const [pLongitude, pLatitude] = getLonLatWithElevationOffset(zmin, pitch, bearing, longitude, latitude, viewport);

    expect(longitude).toEqual(pLongitude);
    expect(latitude).toEqual(pLatitude);
  });


  test("Should add offset to longitude, latitude", () => {
    const zmin = 300;
    const pitch = 30;
    const bearing = 70;
    const longitude = -122.43594497742055;
    const latitude = 37.76860441643394;

    const viewport = new WebMercatorViewport({
      longitude,
      latitude,
    });

    const expectedLongitude = -122.43409329472674;
    const expectedLatitude = 37.769137171585925;

    const [pLongitude, pLatitude] = getLonLatWithElevationOffset(zmin, pitch, bearing, longitude, latitude, viewport);

    expect(pLongitude).toEqual(expectedLongitude);
    expect(pLatitude).toEqual(expectedLatitude);
  });

});
