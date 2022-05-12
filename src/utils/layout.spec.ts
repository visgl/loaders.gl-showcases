import { useAppLayout, getCurrentLayoutProperty } from './layout';

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => false)
}));


describe("useAppLayout", () => {
  test("Should detect desktop or laptop", () => {
    const layout = useAppLayout();
    expect(layout).toStrictEqual({
      isDesktopOrLaptop: true,
      isTablet: false,
      isMobile: false,
    });
  });
});

describe("getCurrentLayoutProperty", () => {
  test("Should return property for desktop or laptop ", () => {
    const property = getCurrentLayoutProperty({
      isDesktopOrLaptop: 'margin-left: 333px',
      isTablet: 'margin-left: 222px',
      isMobile: 'margin-left: 111px',
    })({
      layout: {
        isDesktopOrLaptop: true,
        isTablet: false,
        isMobile: false,
      }
    });
    expect(property).toStrictEqual('margin-left: 333px');
  });

  test("Should return default mobile property by default", () => {
    const property = getCurrentLayoutProperty({
      isDesktopOrLaptop: 'margin-left: 333px',
      isTablet: 'margin-left: 222px',
      isMobile: 'margin-left: 111px',
    })({});
    expect(property).toStrictEqual('margin-left: 111px');
  });

  test("Should use default layout key", () => {
    const property = getCurrentLayoutProperty({
      isDesktopOrLaptop: 'margin-left: 333px',
      isTablet: 'margin-left: 222px',
      isMobile: 'margin-left: 111px',
    })({
      layout: {
        isDesktopOrLaptop: false,
        isTablet: false,
        isMobile: false,
      }
    });
    expect(property).toStrictEqual('margin-left: 111px');
  });
});
