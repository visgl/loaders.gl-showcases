import { convertPositionsToVectors } from "./convert-positions-to-vectors";

describe("Convert positions to vectors", () => {
  test("Should convert positions to vectors", () => {
    const positions = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const result = convertPositionsToVectors(positions);
    expect(result[0][0]).toStrictEqual(1);
    expect(result[0][1]).toStrictEqual(2);
    expect(result[0][2]).toStrictEqual(3);
    expect(result[1][0]).toStrictEqual(4);
    expect(result[1][1]).toStrictEqual(5);
    expect(result[1][2]).toStrictEqual(6);
    expect(result[2][0]).toStrictEqual(7);
    expect(result[2][1]).toStrictEqual(8);
    expect(result[2][2]).toStrictEqual(9);
  });
});
