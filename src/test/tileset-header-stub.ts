import { SceneLayer3D } from "@loaders.gl/i3s";

export const getTilesetJson = (): SceneLayer3D => {
  const i3sProperties: SceneLayer3D = {
    id: 0,
    version: "E74C24B8-42E3-4729-81BA-89A9F273AC1F",
    name: "AllRegions",
    serviceUpdateTimeStamp: {
      lastUpdate: 1592936682000,
    },
    href: "./layers/0",
    layerType: "3DObject",
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
      vcsWkid: 5773,
      latestVcsWkid: 5773,
    },
    heightModelInfo: {
      heightModel: "gravity_related_height",
      vertCRS: "EGM96_Geoid",
      heightUnit: "meter",
    },
    ZFactor: 1,
    alias: "AllRegions",
    description: "AllRegions",
    capabilities: ["View", "Query"],
    cachedDrawingInfo: {
      color: false,
    },
    drawingInfo: {
      scaleSymbols: false,
      renderer: {
        type: "simple",
        symbol: {
          type: "MeshSymbol3D",
          symbolLayers: [
            {
              type: "Fill",
              material: {
                color: [255, 255, 255],
                transparency: 0,
                colorMixMode: "multiply",
              },
            },
          ],
        },
      },
    },
    popupInfo: {
      title: "{NAME}",
      mediaInfos: [],
      fieldInfos: [
        {
          fieldName: "OBJECTID",
          visible: true,
          isEditable: false,
          label: "OBJECTID",
        },
        {
          fieldName: "NAME",
          visible: true,
          isEditable: true,
          label: "NAME",
        },
      ],
      popupElements: [
        {
          fieldInfos: [
            {
              fieldName: "OBJECTID",
              visible: true,
              isEditable: false,
              label: "OBJECTID",
            },
            {
              fieldName: "NAME",
              visible: true,
              isEditable: true,
              label: "NAME",
            },
          ],
          type: "fields",
        },
      ],
      expressionInfos: [],
    },
    disablePopup: false,
    fields: [
      {
        name: "OBJECTID",
        type: "esriFieldTypeOID",
        alias: "OBJECTID",
      },
      {
        name: "NAME",
        type: "esriFieldTypeString",
        alias: "NAME",
      },
    ],
    statisticsInfo: [
      {
        key: "f_1",
        name: "NAME",
        href: "./statistics/f_1/0",
      },
    ],
    attributeStorageInfo: [
      {
        key: "f_0",
        name: "OBJECTID",
        header: [
          {
            property: "count",
            valueType: "UInt32",
          },
        ],
        ordering: ["attributeValues"],
        attributeValues: {
          valueType: "Oid32",
          valuesPerElement: 1,
        },
      },
      {
        key: "f_1",
        name: "NAME",
        header: [
          {
            property: "count",
            valueType: "UInt32",
          },
          {
            property: "attributeValuesByteCount",
            valueType: "UInt32",
          },
        ],
        ordering: ["attributeByteCounts", "attributeValues"],
        attributeByteCounts: {
          valueType: "UInt32",
          valuesPerElement: 1,
        },
        attributeValues: {
          valueType: "String",
          encoding: "UTF-8",
          valuesPerElement: 1,
        },
      },
    ],
    store: {
      id: "6A4AB4FA-0C4F-4F71-885C-9755AC05EF61",
      profile: "meshpyramids",
      resourcePattern: [
        "3dNodeIndexDocument",
        "Attributes",
        "SharedResource",
        "Geometry",
      ],
      rootNode: "./nodes/root",
      extent: [
        -122.51473530281777, 37.70463582140094, -122.35672838423584,
        37.83262838041543,
      ],
      indexCRS: "http://www.opengis.net/def/crs/EPSG/0/4326",
      vertexCRS: "http://www.opengis.net/def/crs/EPSG/0/4326",
      normalReferenceFrame: "earth-centered",
      attributeEncoding: "application/octet-stream; version=1.7",
      lodType: "MeshPyramid",
      lodModel: "node-switching",
      defaultGeometrySchema: {
        geometryType: "triangles",
        header: [
          {
            property: "vertexCount",
            type: "UInt32",
          },
          {
            property: "featureCount",
            type: "UInt32",
          },
        ],
        topology: "PerAttributeArray",
        ordering: ["position", "normal", "uv0", "color", "region"],
        vertexAttributes: {
          position: {
            valueType: "Float32",
            valuesPerElement: 3,
          },
          normal: {
            valueType: "Float32",
            valuesPerElement: 3,
          },
          uv0: {
            valueType: "Float32",
            valuesPerElement: 2,
          },
          color: {
            valueType: "UInt8",
            valuesPerElement: 4,
          },
          region: {
            valuesPerElement: 4,
            valueType: "UInt16",
          },
        },
        featureAttributeOrder: ["id", "faceRange"],
        featureAttributes: {
          id: {
            valueType: "UInt64",
            valuesPerElement: 1,
          },
          faceRange: {
            valueType: "UInt32",
            valuesPerElement: 2,
          },
        },
      },
      textureEncoding: ["image/jpeg", "image/vnd-ms.dds"],
      version: "1.7",
    },
    nodePages: {
      nodesPerPage: 64,
      lodSelectionMetricType: "maxScreenThresholdSQ",
    },
    materialDefinitions: [
      {
        cullFace: "back",
        pbrMetallicRoughness: { metallicFactor: 1, roughnessFactor: 0 },
        alphaMode: "opaque",
      },
      {
        cullFace: "back",
        pbrMetallicRoughness: {
          baseColorTexture: {
            textureSetDefinitionId: 0,
            texCoord: 0,
          },
          metallicFactor: 0,
          roughnessFactor: 0,
        },
        alphaMode: "opaque",
      },
      {
        cullFace: "back",
        pbrMetallicRoughness: {
          baseColorTexture: {
            textureSetDefinitionId: 1,
            texCoord: 0,
          },
          metallicFactor: 0,
          roughnessFactor: 0,
        },
        alphaMode: "opaque",
      },
    ],
    textureSetDefinitions: [
      {
        formats: [
          {
            name: "0",
            format: "jpg",
          },
          {
            name: "0_0_1",
            format: "dds",
          },
        ],
      },
      {
        atlas: true,
        formats: [
          {
            name: "0",
            format: "jpg",
          },
          {
            name: "0_0_1",
            format: "dds",
          },
        ],
      },
    ],
    geometryDefinitions: [
      {
        topology: "triangle",
        geometryBuffers: [
          {
            offset: 8,
            position: {
              type: "Float32",
              component: 3,
              binding: "per-vertex",
            },
            normal: {
              type: "Float32",
              component: 3,
              binding: "per-vertex",
            },
            uv0: {
              type: "Float32",
              component: 2,
              binding: "per-vertex",
            },
            color: {
              type: "UInt8",
              component: 4,
              binding: "per-vertex",
            },
            featureId: {
              type: "UInt64",
              component: 1,
              binding: "per-feature",
            },
            faceRange: {
              type: "UInt32",
              component: 2,
              binding: "per-feature",
            },
          },
          {
            compressedAttributes: {
              encoding: "draco",
              attributes: ["position", "uv0", "color", "feature-index"],
            },
          },
        ],
      },
      {
        topology: "triangle",
        geometryBuffers: [
          {
            offset: 8,
            position: {
              type: "Float32",
              component: 3,
              binding: "per-vertex",
            },
            normal: {
              type: "Float32",
              component: 3,
              binding: "per-vertex",
            },
            uv0: {
              type: "Float32",
              component: 2,
              binding: "per-vertex",
            },
            color: {
              type: "UInt8",
              component: 4,
              binding: "per-vertex",
            },
            uvRegion: {
              type: "UInt16",
              component: 4,
              binding: "per-vertex",
            },
            featureId: {
              type: "UInt64",
              component: 1,
              binding: "per-feature",
            },
            faceRange: {
              type: "UInt32",
              component: 2,
              binding: "per-feature",
            },
          },
          {
            compressedAttributes: {
              encoding: "draco",
              attributes: [
                "position",
                "uv0",
                "color",
                "feature-index",
                "uv-region",
              ],
            },
          },
        ],
      },
    ],
  };
  return i3sProperties;
};

export const getTilesetHeader = () => {
  const syntheticProperties = {
    loader: {
      name: "I3S (Indexed Scene Layers)",
      id: "i3s",
      module: "i3s",
      version: "3.2.0-alpha.4",
      mimeTypes: ["application/octet-stream"],
      extensions: ["bin"],
      options: {
        i3s: {
          loadContent: true,
          token: null,
          isTileset: "auto",
          isTileHeader: "auto",
          tile: null,
          tileset: null,
          useDracoGeometry: true,
          useCompressedTextures: true,
          decodeTextures: true,
          coordinateSystem: 2,
        },
      },
      binary: true,
    },
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
    nodePagesTile: {
      tileset: {
        id: 0,
        version: "E74C24B8-42E3-4729-81BA-89A9F273AC1F",
        name: "AllRegions",
        serviceUpdateTimeStamp: {
          lastUpdate: 1592936682000,
        },
        href: "./layers/0",
        associatedLayerID: 0,
        layerType: "3DObject",
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326,
          vcsWkid: 5773,
          latestVcsWkid: 5773,
        },
        heightModelInfo: {
          heightModel: "gravity_related_height",
          vertCRS: "EGM96_Geoid",
          heightUnit: "meter",
        },
        ZFactor: 1,
        alias: "AllRegions",
        description: "AllRegions",
        capabilities: ["View", "Query"],
        cachedDrawingInfo: {
          color: false,
        },
        drawingInfo: {
          renderer: {
            type: "simple",
            symbol: {
              type: "MeshSymbol3D",
              symbolLayers: [
                {
                  type: "Fill",
                  material: {
                    color: [255, 255, 255],
                    transparency: 0,
                    colorMixMode: "multiply",
                  },
                },
              ],
            },
          },
        },
        popupInfo: {
          title: "{NAME}",
          mediaInfos: [],
          fieldInfos: [
            {
              fieldName: "OBJECTID",
              visible: true,
              isEditable: false,
              label: "OBJECTID",
            },
            {
              fieldName: "NAME",
              visible: true,
              isEditable: true,
              label: "NAME",
            },
          ],
          popupElements: [
            {
              fieldInfos: [
                {
                  fieldName: "OBJECTID",
                  visible: true,
                  isEditable: false,
                  label: "OBJECTID",
                },
                {
                  fieldName: "NAME",
                  visible: true,
                  isEditable: true,
                  label: "NAME",
                },
              ],
              type: "fields",
            },
          ],
          expressionInfos: [],
        },
        disablePopup: false,
        fields: [
          {
            name: "OBJECTID",
            type: "esriFieldTypeOID",
            alias: "OBJECTID",
          },
          {
            name: "NAME",
            type: "esriFieldTypeString",
            alias: "NAME",
          },
        ],
        statisticsInfo: [
          {
            key: "f_1",
            name: "NAME",
            href: "./statistics/f_1/0",
          },
        ],
        attributeStorageInfo: [
          {
            key: "f_0",
            name: "OBJECTID",
            header: [
              {
                property: "count",
                valueType: "UInt32",
              },
            ],
            ordering: ["attributeValues"],
            attributeValues: {
              valueType: "Oid32",
              valuesPerElement: 1,
            },
          },
          {
            key: "f_1",
            name: "NAME",
            header: [
              {
                property: "count",
                valueType: "UInt32",
              },
              {
                property: "attributeValuesByteCount",
                valueType: "UInt32",
              },
            ],
            ordering: ["attributeByteCounts", "attributeValues"],
            attributeByteCounts: {
              valueType: "UInt32",
              valuesPerElement: 1,
            },
            attributeValues: {
              valueType: "String",
              encoding: "UTF-8",
              valuesPerElement: 1,
            },
          },
        ],
        store: {
          id: "6A4AB4FA-0C4F-4F71-885C-9755AC05EF61",
          profile: "meshpyramids",
          resourcePattern: [
            "3dNodeIndexDocument",
            "Attributes",
            "SharedResource",
            "Geometry",
          ],
          rootNode: "./nodes/root",
          extent: [
            -122.51473530281777, 37.70463582140094, -122.35672838423584,
            37.83262838041543,
          ],
          indexCRS: "http://www.opengis.net/def/crs/EPSG/0/4326",
          vertexCRS: "http://www.opengis.net/def/crs/EPSG/0/4326",
          normalReferenceFrame: "earth-centered",
          nidEncoding: "application/vnd.esri.i3s.json+gzip; version=1.7",
          featureEncoding: "application/vnd.esri.i3s.json+gzip; version=1.7",
          geometryEncoding: "application/octet-stream; version=1.7",
          attributeEncoding: "application/octet-stream; version=1.7",
          lodType: "MeshPyramid",
          lodModel: "node-switching",
          defaultGeometrySchema: {
            geometryType: "triangles",
            header: [
              {
                property: "vertexCount",
                type: "UInt32",
              },
              {
                property: "featureCount",
                type: "UInt32",
              },
            ],
            topology: "PerAttributeArray",
            ordering: ["position", "normal", "uv0", "color", "region"],
            vertexAttributes: {
              position: {
                valueType: "Float32",
                valuesPerElement: 3,
              },
              normal: {
                valueType: "Float32",
                valuesPerElement: 3,
              },
              uv0: {
                valueType: "Float32",
                valuesPerElement: 2,
              },
              color: {
                valueType: "UInt8",
                valuesPerElement: 4,
              },
              region: {
                valuesPerElement: 4,
                valueType: "UInt16",
              },
            },
            featureAttributeOrder: ["id", "faceRange"],
            featureAttributes: {
              id: {
                valueType: "UInt64",
                valuesPerElement: 1,
              },
              faceRange: {
                valueType: "UInt32",
                valuesPerElement: 2,
              },
            },
          },
          textureEncoding: ["image/jpeg", "image/vnd-ms.dds"],
          version: "1.7",
        },
        nodePages: {
          nodesPerPage: 64,
          lodSelectionMetricType: "maxScreenThresholdSQ",
        },
        materialDefinitions: [
          {
            cullFace: "back",
          },
          {
            cullFace: "back",
            pbrMetallicRoughness: {
              baseColorTexture: {
                textureSetDefinitionId: 0,
                texCoord: 0,
              },
              metallicFactor: 0,
            },
          },
          {
            cullFace: "back",
            pbrMetallicRoughness: {
              baseColorTexture: {
                textureSetDefinitionId: 1,
                texCoord: 0,
              },
              metallicFactor: 0,
            },
          },
        ],
        textureSetDefinitions: [
          {
            formats: [
              {
                name: "0",
                format: "jpg",
              },
              {
                name: "0_0_1",
                format: "dds",
              },
            ],
          },
          {
            atlas: true,
            formats: [
              {
                name: "0",
                format: "jpg",
              },
              {
                name: "0_0_1",
                format: "dds",
              },
            ],
          },
        ],
        geometryDefinitions: [
          {
            geometryBuffers: [
              {
                offset: 8,
                position: {
                  type: "Float32",
                  component: 3,
                },
                normal: {
                  type: "Float32",
                  component: 3,
                },
                uv0: {
                  type: "Float32",
                  component: 2,
                },
                color: {
                  type: "UInt8",
                  component: 4,
                },
                featureId: {
                  type: "UInt64",
                  component: 1,
                  binding: "per-feature",
                },
                faceRange: {
                  type: "UInt32",
                  component: 2,
                  binding: "per-feature",
                },
              },
              {
                compressedAttributes: {
                  encoding: "draco",
                  attributes: ["position", "uv0", "color", "feature-index"],
                },
              },
            ],
          },
          {
            geometryBuffers: [
              {
                offset: 8,
                position: {
                  type: "Float32",
                  component: 3,
                },
                normal: {
                  type: "Float32",
                  component: 3,
                },
                uv0: {
                  type: "Float32",
                  component: 2,
                },
                color: {
                  type: "UInt8",
                  component: 4,
                },
                uvRegion: {
                  type: "UInt16",
                  component: 4,
                },
                featureId: {
                  type: "UInt64",
                  component: 1,
                  binding: "per-feature",
                },
                faceRange: {
                  type: "UInt32",
                  component: 2,
                  binding: "per-feature",
                },
              },
              {
                compressedAttributes: {
                  encoding: "draco",
                  attributes: [
                    "position",
                    "uv0",
                    "color",
                    "feature-index",
                    "uv-region",
                  ],
                },
              },
            ],
          },
        ],
        loader: {
          name: "I3S (Indexed Scene Layers)",
          id: "i3s",
          module: "i3s",
          version: "3.2.0-alpha.4",
          mimeTypes: ["application/octet-stream"],
          extensions: ["bin"],
          options: {
            i3s: {
              loadContent: true,
              token: null,
              isTileset: "auto",
              isTileHeader: "auto",
              tile: null,
              tileset: null,
              useDracoGeometry: true,
              useCompressedTextures: true,
              decodeTextures: true,
              coordinateSystem: 2,
            },
          },
          binary: true,
        },
        url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      },
      nodePages: [],
      pendingNodePages: [
        {
          status: "Pending",
          promise: {},
        },
      ],
      nodesPerPage: 64,
      options: {
        i3s: {
          loadContent: true,
          token: null,
          isTileset: "auto",
          isTileHeader: "auto",
          tile: null,
          tileset: null,
          useDracoGeometry: true,
          useCompressedTextures: true,
          decodeTextures: true,
          coordinateSystem: 3,
        },
        baseUri:
          "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
        fetch: null,
        nothrow: false,
        log: {
          console: {
            memory: {},
          },
        },
        CDN: "https://unpkg.com/@loaders.gl",
        worker: true,
        maxConcurrency: 3,
        maxMobileConcurrency: 1,
        reuseWorkers: true,
        _nodeWorkers: false,
        _workerType: "",
        limit: 0,
        _limitMB: 0,
        batchSize: "auto",
        batchDebounceMs: 0,
        metadata: false,
        transforms: [],
      },
      lodSelectionMetricType: "maxScreenThresholdSQ",
      textureDefinitionsSelectedFormats: [
        {
          name: "0_0_1",
          format: "dds",
        },
        {
          name: "0_0_1",
          format: "dds",
        },
      ],
      nodesInNodePages: 0,
      textureLoaderOptions: {},
    },
    root: {},
    basePath:
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
    type: "I3S",
  };
  return { ...getTilesetJson(), ...syntheticProperties };
};
