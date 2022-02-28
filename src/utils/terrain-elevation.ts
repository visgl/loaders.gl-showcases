export function getElevationByCentralTile(longitude: number, latitude: number, terrainTiles): number | null {
  let centralTile = null;
  for (const tile of Object.values(terrainTiles)) {
    const {
      // @ts-expect-error - Property 'bbox' does not exist on type 'unknown'
      bbox: { east, north, south, west },
    } = tile;
    if (
      longitude > west &&
      longitude < east &&
      latitude > south &&
      latitude < north
    ) {
      // @ts-expect-error - Type 'unknown' is not assignable to type 'null'.
      centralTile = tile;
    }
  }
  if (!centralTile) {
    return null;
  }

  const {
    // @ts-expect-error - Type 'never' must have a '[Symbol.iterator]()' method that returns an iterator.
    content: [
      {
        attributes: {
          POSITION: { value },
        },
      },
    ],
  } = centralTile;
  let currentElevation = value[2] || 0;
  let currentDistance = calculateDistance(
    longitude,
    latitude,
    value[0],
    value[1]
  );
  // @ts-expect-error - Property 'length' does not exist on type 'never'
  for (let i = 3; i < value.length; i += 3) {
    const distance = calculateDistance(
      longitude,
      latitude,
      value[i],
      value[i + 1]
    );
    if (distance < currentDistance) {
      currentElevation = value[i + 2];
      currentDistance = distance;
    }
  }
  return currentElevation;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
