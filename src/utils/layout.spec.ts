import { useAppLayout, getCurrentLayoutProperty } from './layout';

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => false)
}));

describe("useAppLayout", () => {
  test("Should detect default layout", () => {
    const layout = useAppLayout();
    expect(layout).toStrictEqual('default');
  });
});

describe("getCurrentLayoutProperty", () => {
  test("Should return default property", () => {
    const property = getCurrentLayoutProperty({
      default: 'margin-left: 333px',
      tablet: 'margin-left: 222px',
      mobile: 'margin-left: 111px',
    })({ layout: 'default' });
    expect(property).toStrictEqual('margin-left: 333px');
  });

  test("Should return property for tablet", () => {
    const property = getCurrentLayoutProperty({
      default: 'margin-left: 333px',
      tablet: 'margin-left: 222px',
      mobile: 'margin-left: 111px',
    })({ layout: 'tablet' });
    expect(property).toStrictEqual('margin-left: 222px');
  });

  test("Should return property for mobile", () => {
    const property = getCurrentLayoutProperty({
      default: 'margin-left: 333px',
      tablet: 'margin-left: 222px',
      mobile: 'margin-left: 111px',
    })({ layout: 'mobile' });
    expect(property).toStrictEqual('margin-left: 111px');
  });

  test("Should return default property if no layout provided", () => {
    const property = getCurrentLayoutProperty({
      default: 'margin-left: 333px',
      tablet: 'margin-left: 222px',
      mobile: 'margin-left: 111px',
    })({});
    expect(property).toStrictEqual('margin-left: 333px');
  });
});
