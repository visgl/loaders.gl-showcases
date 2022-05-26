import { useClickOutside } from "./use-click-outside-hook";

jest.mock('react', () => ({
  useEffect: jest.fn().mockImplementation(f => f()),
}));

describe('Use click outside', () => {
  test("Should not call handler if no current ref", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback();
      });

    const mockedHandler = jest.fn();
    const ref = {
      current: null
    };
    useClickOutside(ref, mockedHandler);

    expect(mockedHandler).toBeCalledTimes(0);
  });

  test("Should not call handler if ref current contain event target", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback(event);
      });

    const mockedHandler = jest.fn();

    const ref = {
      current: {
        contains: jest.fn().mockImplementation(() => true),
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useClickOutside(ref, mockedHandler);
    expect(mockedHandler).toBeCalledTimes(0);
  });

  test("Should call handler", () => {
    document.addEventListener = jest
      .fn()
      .mockImplementation((event, callback) => {
        callback(event);
      })

    const mockedHandler = jest.fn();

    const ref = {
      current: {
        contains: jest.fn().mockImplementation(() => false),
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useClickOutside(ref, mockedHandler);
    expect(mockedHandler).toBeCalledTimes(2);
  });
});
