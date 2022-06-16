export const getTileHeader = () => {
  return {
    id: "41513",
    lodSelection: [
      {
        metricType: "maxScreenThreshold",
        maxError: 145.4688507000269,
      },
      {
        metricType: "maxScreenThresholdSQ",
        maxError: 16619.95703125,
      },
    ],
    obb: {
      center: [-122.4221455608589, 37.77030288270862, 34.55862785037607],
      halfSize: [864.1947631835938, 381.7113342285156, 37.28173828125],
      quaternion: [
        0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
        -0.13200709223747253,
      ],
    },
    contentUrl:
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0/nodes/41513/geometries/1",
    textureUrl:
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0/nodes/41513/textures/0_0_1",
    attributeUrls: [
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0/nodes/41513/attributes/f_0/0",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0/nodes/41513/attributes/f_1/0",
    ],
    materialDefinition: {
      cullFace: "back",
      pbrMetallicRoughness: {
        baseColorTexture: {
          textureSetDefinitionId: 0,
          texCoord: 0,
        },
        metallicFactor: 0,
      },
    },
    textureFormat: "dds",
    textureLoaderOptions: {},
    children: [
      {
        id: "41472",
        obb: {
          center: [-122.4221455608589, 37.77030288270862, 34.55862785037607],
          halfSize: [864.1947631835938, 381.7113342285156, 37.28173828125],
          quaternion: [
            0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
            -0.13200709223747253,
          ],
        },
      },
    ],
    isDracoGeometry: true,
    mbs: [
      -122.4221455608589, 37.77030288270862, 34.55862785037607,
      945.4766445909988,
    ],
    boundingVolume: {
      box: [
        -2706561.244925074, -4261216.687353435, 3885343.335691428,
        864.1947631835938, 381.7113342285156, 37.28173828125,
        0.6413831114768982, 0.6328917145729065, 0.41309797763824463,
        -0.13200709223747253,
      ],
      sphere: [
        -2706561.244925074, -4261216.687353435, 3885343.335691428,
        945.4766445909988,
      ],
    },
    lodMetricType: "maxScreenThreshold",
    lodMetricValue: 145.4688507000269,
    type: "mesh",
    refine: 2,
  };
};
