// import { act, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { renderWithTheme } from "../../utils/testing-utils/render-with-theme";
// import { AttributeStats } from "./attribute-stats";

// import { load } from "@loaders.gl/core";

// jest.mock("@loaders.gl/core");

// jest.mock("./histogram", () => ({
//   HistogramChart: jest.fn().mockImplementation(() => <div>HistogramChart</div>),
// }));

// const loadMock = load as unknown as jest.Mocked<any>;

// const stats = {
//   totalValuesCount: 1,
//   min: 2,
//   max: 3,
//   count: 4,
//   sum: 5,
//   avg: 6,
//   stddev: 7,
//   variance: 8,
//   histogram: {
//     minimum: 9,
//     maximum: 10,
//     counts: [11, 12, 13, 14, 15, 16],
//   },
//   mostFrequentValues: [
//     {
//       value: 17,
//       count: 18,
//     },
//     {
//       value: 19,
//       count: 20,
//     },
//   ],
// };

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// jest.mock("@loaders.gl/loader-utils", () => ({
//   JSONLoader: jest.fn(),
// }));

// jest.mock("../toogle-switch/toggle-switch", () => ({
//   ToggleSwitch: jest
//     .fn()
//     .mockImplementation(({ onChange }) => (
//       <div onClick={onChange}>ToggleSwitch</div>
//     )),
// }));

// jest.mock("../loading-spinner/loading-spinner", () => ({
//   LoadingSpinner: jest.fn().mockImplementation(() => <div>LoadingSpinner</div>),
// }));

// beforeAll(() => {
//   loadMock
//     .mockImplementationOnce(
//       () =>
//         new Promise((resolve) =>
//           setTimeout(() => {
//             resolve({ stats });
//           }, 300)
//         )
//     )
//     .mockImplementationOnce(
//       () =>
//         new Promise((resolve, reject) =>
//           setTimeout(() => {
//             reject(new Error("Test Error"));
//           }, 300)
//         )
//     );
// });

// describe("AttributeStats", () => {
//   it("Should render Attribute Stats", async () => {
//     const onColorizeByAttributeClick = jest.fn();

//     act(() => {
//       renderWithTheme(
//         <AttributeStats
//           attributeName={"NAME"}
//           statisticsInfo={{
//             key: "f_0",
//             name: "NAME",
//             href: "../testHref",
//           }}
//           tilesetName={"New York"}
//           tilesetBasePath={"https://test-base-path"}
//           onColorizeByAttributeClick={onColorizeByAttributeClick}
//         />
//       );
//     });

//     expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();

//     await sleep(500);

//     expect(screen.getByText("NAME")).toBeInTheDocument();
//     expect(screen.getByTestId("statistics-layers-icon")).toBeInTheDocument();

//     for (const statKey in stats) {
//       if (statKey !== "histogram" && statKey !== "mostFrequentValues") {
//         const statValue = stats[statKey];

//         expect(screen.getByText(statKey)).toBeInTheDocument();
//         expect(screen.getByText(statValue)).toBeInTheDocument();
//       }
//     }

//     expect(screen.getByText("Histogram")).toBeInTheDocument();
//     expect(screen.getByText("HistogramChart")).toBeInTheDocument();
//     expect(screen.getByText("Colorize by Attribute")).toBeInTheDocument();
//     expect(screen.getByText("ToggleSwitch")).toBeInTheDocument();

//     expect(screen.getByTestId("histogram-split-line")).toBeInTheDocument();

//     userEvent.click(screen.getByTestId("histogram-arrow"));

//     expect(screen.queryByTestId("histogram-svg")).not.toBeInTheDocument();
//     expect(
//       screen.queryByTestId("histogram-split-line")
//     ).not.toBeInTheDocument();

//     userEvent.click(screen.getByText("ToggleSwitch"));
//     expect(onColorizeByAttributeClick).toHaveBeenCalled();

//     // Try to get already cached data
//     act(() => {
//       renderWithTheme(
//         <AttributeStats
//           attributeName={"NAME"}
//           statisticsInfo={{
//             key: "f_0",
//             name: "NAME",
//             href: "../testHref",
//           }}
//           tilesetName={"New York"}
//           tilesetBasePath={"https://test-base-path"}
//           onColorizeByAttributeClick={onColorizeByAttributeClick}
//         />
//       );
//     });

//     expect(loadMock).toHaveBeenCalledTimes(1);
//   });

//   it("Should no render Attribute Stats if loading statistics error", async () => {
//     const onColorizeByAttributeClick = jest.fn();

//     act(() => {
//       renderWithTheme(
//         <AttributeStats
//           attributeName={"NAME"}
//           statisticsInfo={{
//             key: "f_0",
//             name: "NAME",
//             href: "../testHref",
//           }}
//           tilesetName={"New York"}
//           tilesetBasePath={"https://test-error-path"}
//           onColorizeByAttributeClick={onColorizeByAttributeClick}
//         />
//       );
//     });

//     expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();

//     await sleep(500);

//     for (const statKey in stats) {
//       if (statKey !== "histogram" && statKey !== "mostFrequentValues") {
//         const statValue = stats[statKey];

//         expect(screen.queryByText(statKey)).not.toBeInTheDocument();
//         expect(screen.queryByText(statValue)).not.toBeInTheDocument();
//       }
//     }

//     expect(screen.queryByText("HistogramChart")).not.toBeInTheDocument();
//   });
// });
