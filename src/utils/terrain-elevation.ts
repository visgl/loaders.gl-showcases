export function getElevationByCentralTile(longitude, latitude, terrainTiles) {
  let centralTile = null;
  for (const tile of Object.values(terrainTiles)) {
    const {
      // @ts-expect-error
      bbox: { east, north, south, west },
    } = tile;
    if (
      longitude > west &&
      longitude < east &&
      latitude > south &&
      latitude < north
    ) {
      // @ts-expect-error
      centralTile = tile;
    }
  }
  if (!centralTile) {
    return null;
  }

  const {
    // @ts-expect-error
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
  // @ts-expect-error
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

function calculateDistance(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
