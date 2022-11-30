import type { ArcGisWebScene } from "@loaders.gl/i3s/src/types";
import { Proj4Projection } from '@math.gl/proj4';
import { WebMercatorViewport } from '@deck.gl/core';

import { Bookmark, LayerExample, LayerViewState } from "../types";
import { getLonLatWithElevationOffset } from "./elevation-utils";
import { flattenLayerIds } from "./layer-utils";

const PSEUDO_MERCATOR_CRS_WKIDS = [102100, 3857];

/**
 * Convert ArcGis Slides to the app internal bookmarks
 * Spec - https://developers.arcgis.com/javascript/latest/api-reference/esri-webscene-Presentation.html
 * @todo Add support for webscene basemaps
 * @param webScene 
 * @param layers 
 * @returns 
 */
export const convertArcGisSlidesToBookmars = (
  webScene: ArcGisWebScene,
  webSceneLayerExamples: LayerExample[],
  layersLeftSide: LayerExample[]
): Bookmark[] => {
  const bookmarks: Bookmark[] = [];
  const addedLayersIds = flattenLayerIds(webSceneLayerExamples);

  try {
    const cameraSlides = webScene?.presentation?.slides || [];

    for (const slide of cameraSlides) {
      const visibleLayersIds = slide?.visibleLayers.map(layer => layer.id) || [];
      const supportedVisibleLayersIds = visibleLayersIds.filter(layerId => addedLayersIds.includes(layerId));
      const mainViewState = convertArcGisCameraPositionToBookmarkViewState(slide?.viewpoint?.camera);

      if (mainViewState) {
        const bookmark: Bookmark = {
          id: slide.id,
          imageUrl: slide?.thumbnail?.url || '',
          viewState: {
            main: mainViewState,
            minimap: {}
          },
          /**
           * Use only left side layers, because webscene bookmarks is only supported for within layer comparison mode.
           */
          layersLeftSide,
          activeLayersIdsLeftSide: supportedVisibleLayersIds,
          layersRightSide: [],
          activeLayersIdsRightSide: [],
        };

        bookmarks.push(bookmark);
      }
    }
  } catch (error) {
    console.error("Can't load bookmarks from webscene: ", error);
  }

  return bookmarks;
}

/**
 * Do conversion from ArcGIS spatial reference coordinates of camera to bookmark view state with WGS84 CRS.
 * It can be any CRS system in ArcGIS, but we support conversion only EPSG:3857 for now.
 * Spec - https://developers.arcgis.com/web-scene-specification/objects/spatialReference
 * @todo Add camera type from loaders.gl when types will be published.
 * @param camera 
 * @returns 
 */
const convertArcGisCameraPositionToBookmarkViewState = (camera: any): LayerViewState | null => {
  const isPseudoMerkatorCRS = PSEUDO_MERCATOR_CRS_WKIDS.includes(camera?.position?.spatialReference?.wkid);

  if (isPseudoMerkatorCRS) {
    const { heading = 0, tilt = 0, position } = camera;

    // WebMercatorViewport donesn't support such camera angles. Just skip bookmark.
    if (tilt > 60) {
      return null;
    }

    const { x, y, z } = position;

    // Convert x,y,z from EPSG:3857 to WGS84 lat lon altitude.
    const projection = new Proj4Projection({ from: 'EPSG:3857' });
    const [longitude, latitude, altitude] = projection.project([x, y, z]);

    const viewport = new WebMercatorViewport({
      longitude,
      latitude,
      altitude,
    });

    // Get changed long lat values based on camera z value.
    const [pLongitude, pLatitude] = getLonLatWithElevationOffset(z, tilt, heading, longitude, latitude, viewport);

    /**
     * Convert altitude to zoomLevel
     * This calculation is not really good. We have aproximate zoom which is not the same as in ArcGIS webscenes.
     * Based on https://github.com/visgl/deck.gl/issues/4194
     */
    const [, , zValue] = viewport.unproject([0, 0, -1]);
    const zoom = Math.log2(zValue / altitude);

    return {
      longitude: pLongitude,
      latitude: pLatitude,
      zoom,
      bearing: heading,
      pitch: tilt
    } as LayerViewState;
  }

  return null;
}
