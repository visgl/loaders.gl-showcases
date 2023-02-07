import { useClickOutside } from "./use-click-outside-hook";

jest.mock("react", () => ({
  useEffect: jest.fn().mockImplementation((f) => f()),
}));

describe("Use click outside", () => {
  test("Should not call handler if null Node sent", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback();
      });

    const mockedHandler = jest.fn();
    useClickOutside([null], mockedHandler);

    expect(mockedHandler).toBeCalledTimes(0);
  });

  test("Should not call handler if node contain event target", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback(event);
      });

    const mockedHandler = jest.fn();

    const div = document.createElement("div");
    div.contains = jest.fn().mockImplementation(() => true);
    useClickOutside([div], mockedHandler);
    expect(mockedHandler).toBeCalledTimes(0);
  });

  test("Should check 2 Nodes", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback(event);
      });

    const mockedHandler = jest.fn();

    const div1 = document.createElement("div");
    div1.contains = jest.fn().mockImplementation(() => false);

    const div2 = document.createElement("div");
    div2.contains = jest.fn().mockImplementation(() => true);
    useClickOutside([div1, div2], mockedHandler);
    expect(mockedHandler).toBeCalledTimes(0);
  });

  test("Should call handler", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementation((event, callback) => {
        callback(event);
      });

    const mockedHandler = jest.fn();

    const div = document.createElement("div");
    div.contains = jest.fn().mockImplementation(() => false);
    useClickOutside([div], mockedHandler);
    expect(mockedHandler).toBeCalledTimes(2);
  });
});
