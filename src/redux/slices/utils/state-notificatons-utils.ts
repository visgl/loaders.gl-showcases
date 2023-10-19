import { BaseMapProviderId } from "../../../constants/base-map-providers";
import {
  TERRAIN_MAPBOX2_HIGHT_TILT_BUG,
  TERRAIN_MAPLIBRE_LOW_PERFORMANCE,
  TERRAIN_MAPLIBRE_SYNCHRONIZATION_ISSUE,
  TERRAIN_WITH_SELECTED_BASE_MAP_PROVIDER_IS_NOT_SUPPORTED,
} from "../../../constants/notification-messages";
import { BaseMapMode } from "../../../types";
import { RootState } from "../../store";
import { APP_FEATURE_KEY } from "../app.slice";
import { LAYER_PROPS_FEATURE_KEY } from "../layer-props.slice";
import { Notification } from "../notifications.slice";

export const getNotification = (state: RootState): Notification | null => {
  const { baseMapProvider, baseMapMode } = state[APP_FEATURE_KEY];
  const { terrain } = state[LAYER_PROPS_FEATURE_KEY];

  if (terrain) {
    switch (baseMapProvider.id) {
      case BaseMapProviderId.maplibre:
        if (baseMapMode === BaseMapMode.INTERLEAVED) {
          return {
            severity: "warning",
            message: TERRAIN_MAPLIBRE_LOW_PERFORMANCE,
          };
        } else {
          return {
            severity: "warning",
            message: TERRAIN_MAPLIBRE_SYNCHRONIZATION_ISSUE,
          };
        }
      case BaseMapProviderId.mapbox2:
        if (baseMapMode === BaseMapMode.INTERLEAVED) {
          return {
            severity: "warning",
            message: TERRAIN_MAPBOX2_HIGHT_TILT_BUG,
          };
        } else {
          return null;
        }
      case BaseMapProviderId.arcgis:
        if (baseMapMode === BaseMapMode.OVERLAID) {
          return null;
        }
      // eslint-disable-next-line no-fallthrough
      case BaseMapProviderId.googleMaps:
      default:
        return {
          severity: "info",
          message: TERRAIN_WITH_SELECTED_BASE_MAP_PROVIDER_IS_NOT_SUPPORTED(
            baseMapProvider.name
          ),
        };
    }
  }
  return null;
};
