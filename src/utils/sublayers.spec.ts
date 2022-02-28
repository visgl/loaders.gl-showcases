import { buildSublayersTree } from './sublayers';

describe("Sublayers", () => {

  test("Should Build sublayers tree", () => {
    const sublayers = [
      {
        "id": 200,
        "layerType": "group",
        "name": "Full Model",
        "alias": "Full Model",
        "modelName": "FullModel",
        "visibility": false,
        "sublayers": [
          {
            "id": 210,
            "layerType": "group",
            "name": "Piping",
            "alias": "Piping",
            "modelName": "Piping",
            "visibility": false,
            "sublayers": []
          },
          { 
            "id": 220,
            "layerType": "group",
            "name": "Electrical",
            "alias": "Electrical",
            "modelName": "Electrical",
            "visibility": false,
            "sublayers": [
              {
                "id": 31,
                "layerType": "3DObject",
                "name": "TelephoneDevices",
                "alias": "TelephoneDevices",
                "modelName": "TelephoneDevices",
                "discipline": "Electrical",
                "visibility": true
              },
            ]
          },
        ]
      },
      {
        "id": 0,
        "layerType": "3DObject",
        "name": "Overview",
        "alias": "Overview",
        "modelName": "Overview",
        "visibility": true
      }
    ];

    const expectedSublayersTree = {
      id: 200,
      layerType: 'group',
      name: 'Full Model',
      alias: 'Full Model',
      modelName: 'FullModel',
      visibility: false,
      sublayers: [
        {
          id: 220,
          layerType: 'group',
          name: 'Electrical',
          alias: 'Electrical',
          modelName: 'Electrical',
          visibility: false,
          sublayers: [
            {
              alias: "TelephoneDevices",
              childNodesCount: 0,
              discipline: "Electrical",
              expanded: false,
              id: 31,
              layerType: "3DObject",
              modelName: "TelephoneDevices",
              name: "TelephoneDevices",
              sublayers: undefined,
              visibility: true,
            }
          ],
          expanded: false,
          childNodesCount: 1
        }
      ],
      expanded: false,
      childNodesCount: 2
    };

    const result = buildSublayersTree(sublayers);
    expect(result).toStrictEqual(expectedSublayersTree);
  });

});
