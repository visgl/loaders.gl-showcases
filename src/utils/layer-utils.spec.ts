import type { LayerExample } from '../types';
import { handleSelectAllLeafsInGroup } from './layer-utils';

describe("Layer utils", () => {
  test("Should return one layer if it doesn't have children", () => {

    const example: LayerExample = {
      id: 'test-id',
      name: 'test',
      url: 'https://test.com'
    }

    const result = handleSelectAllLeafsInGroup(example);
    expect(result).toStrictEqual([example]);
  });

  test("Should return leaf layers list if layer has children", () => {
    const example: LayerExample = {
      id: 'test-id',
      name: 'test',
      url: '',
      layers: [
        {
          id: '1-test-id',
          name: '1-test',
          url: 'https://test-1.com',
        },
        {
          id: '2-test-id',
          name: '2-test',
          url: '',
          layers: [
            {
              id: '3-test-id',
              name: '3-test',
              url: 'https://test-3.com',
            },
            {
              id: '4-test-id',
              name: '4-test',
              url: 'https://test-4.com',
            }
          ]
        }
      ]
    };

    const expectedResult = [
      {
        id: '1-test-id',
        name: '1-test',
        url: 'https://test-1.com',
      },
      {
        id: '3-test-id',
        name: '3-test',
        url: 'https://test-3.com',
      },
      {
        id: '4-test-id',
        name: '4-test',
        url: 'https://test-4.com',
      }
    ]

    const result = handleSelectAllLeafsInGroup(example);

    expect(result).toStrictEqual(expectedResult);
  });
});
