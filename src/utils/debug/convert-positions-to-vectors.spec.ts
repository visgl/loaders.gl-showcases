import { convertPositionsToVectors } from './convert-positions-to-vectors';

jest.mock('@math.gl/core', () => ({
  Vector3: jest.fn()
    .mockReturnValue({
      set: jest.fn(),
      item: 1
    })
}));

describe("Convert positions to vectors", () => {
  test("Should convert positions to vectors", () => {
    const positions = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const result = convertPositionsToVectors(positions);
    expect(result[0].item).toStrictEqual(1);
    expect(result[1].item).toStrictEqual(1);
    expect(result[2].item).toStrictEqual(1);
  });
});
