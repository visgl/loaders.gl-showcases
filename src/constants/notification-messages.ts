export const TERRAIN_WITH_SELECTED_BASE_MAP_PROVIDER_IS_NOT_SUPPORTED = (
  baseMapProviderName: string
) => `Terrain with ${baseMapProviderName} map provider is not supported`;
export const TERRAIN_MAPBOX2_HIGHT_TILT_BUG =
  "Terrain with Mapbox 2 in interleaved mode works with known issue. It is shown only with high `pitch` value. Try to tilt the map down";
export const TERRAIN_MAPLIBRE_LOW_PERFORMANCE =
  "Terrain with Maplibre in interleaved mode works with low performance. Try to switch animation off.";
export const TERRAIN_MAPLIBRE_SYNCHRONIZATION_ISSUE =
  "Terrain with Maplibre in overlaid mode works with known synchronization issue. You can see floating vehicles from some view points.";
