import { initStats, sumTilesetsStats } from './stats';
import { Stats } from "@probe.gl/stats";

jest.mock('@probe.gl/stats', () => ({
  Stats: jest.fn().mockImplementation(() => ({ reset: jest.fn(), get: jest.fn().mockImplementation(() => ({ addCount: jest.fn() })) }))
}));

describe("Stats", () => {
  test("Should init stats", () => {
    const url = 'https://test.com';
    const result = initStats(url);
    expect(result).toBeDefined();
  });

  test("Should sum tileset stats", () => {
    const stats = new Stats({ id: 'test' });
    const tilesets = [{
      stats: [{ get: jest.fn().mockImplementation(() => ({ addCount: jest.fn() })) }]
    }];

    sumTilesetsStats(tilesets, stats);
  });

});
