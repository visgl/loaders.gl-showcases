import { initStats, sumTilesetsStats } from "./stats";
import { Stats } from "@probe.gl/stats";

const getStatMock = jest
  .fn()
  .mockImplementation(() => ({ addCount: jest.fn() }));
jest.mock("@probe.gl/stats");
// @ts-expect-error Property 'mockImplementation' does not exist on type 'typeof Stats'
Stats.mockImplementation(() => ({
  reset: jest.fn(),
  get: getStatMock,
}));

describe("Stats", () => {
  test("Should init stats", () => {
    const url = "https://test.com";
    const result = initStats(url);
    expect(result).toBeDefined();
  });

  test("Should sum tileset stats", () => {
    const stats = new Stats({ id: "test" });
    const tilesets = [
      {
        stats: [
          {
            get: jest.fn().mockImplementation(() => ({ addCount: jest.fn() })),
          },
        ],
      },
    ];

    // @ts-expect-error Type '{ stats: { get: Mock<any, any>; }[]; }' is missing the following properties from type 'Tileset3D' ...
    sumTilesetsStats(tilesets, stats);
  });

  test("Should keep stat type", () => {
    const stats = new Stats({ id: "test" });
    const tilesets = [
      {
        stats: [
          {
            name: "Memory stat",
            type: "memory",
          },
        ],
      },
    ];

    // @ts-expect-error Type '{ stats: { get: Mock<any, any>; }[]; }' is missing the following properties from type 'Tileset3D' ...
    sumTilesetsStats(tilesets, stats);
    expect(getStatMock).toHaveBeenCalledWith("Memory stat", "memory");
  });
});
