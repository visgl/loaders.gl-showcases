import { useForceUpdate } from "./force-update-hook";

jest.mock('react', () => ({
  useState: () => ['test', jest.fn()]
}));

describe("Force Update", () => {
  test("Should be able to call force update hook", () => {
    const forceUpdate = useForceUpdate();
    expect(forceUpdate).toBeDefined();
  });

});
