import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../../utils/testing-utils/render-with-theme";
import { AttributeStats } from "./attribute-stats";

import { load } from "@loaders.gl/core";
import { capitalize } from "../../../utils/format/capitalize";

jest.mock("@loaders.gl/core");

jest.mock("../histogram", () => ({
  HistogramChart: jest.fn().mockImplementation(() => <div>HistogramChart</div>),
}));

const loadMock = load as unknown as jest.Mocked<any>;

const stats = {
  totalValuesCount: 1,
  min: 0,
  max: 100,
  count: 4,
  sum: 5,
  avg: 6,
  stddev: 7,
  variance: 8,
  histogram: {
    minimum: 9,
    maximum: 10,
    counts: [11, 12, 13, 14, 15, 16],
  },
  mostFrequentValues: [
    {
      value: 17,
      count: 18,
    },
    {
      value: 19,
      count: 20,
    },
  ],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jest.mock("@loaders.gl/loader-utils", () => ({
  JSONLoader: jest.fn(),
}));

jest.mock("../../toogle-switch/toggle-switch", () => ({
  ToggleSwitch: jest
    .fn()
    .mockImplementation(({ onChange }) => (
      <div onClick={onChange}>ToggleSwitch</div>
    )),
}));

jest.mock("../../loading-spinner/loading-spinner", () => ({
  LoadingSpinner: jest.fn().mockImplementation(() => <div>LoadingSpinner</div>),
}));

describe("AttributeStats", () => {
  const onColorsByAttributeChange = jest.fn();

  beforeAll(() => {
    loadMock
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              resolve({ stats });
            }, 50)
          )
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve, reject) =>
            setTimeout(() => {
              reject(new Error("Test Error"));
            }, 50)
          )
      );
  });

  it("Should render Attribute Stats", async () => {
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"NAME"}
          statisticsInfo={{
            key: "f_0",
            name: "NAME",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-base-path"}
          colorsByAttribute={null}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });

    expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();

    await sleep(100);

    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByTestId("statistics-layers-icon")).toBeInTheDocument();

    for (const statKey in stats) {
      if (statKey !== "histogram" && statKey !== "mostFrequentValues") {
        const statValue = stats[statKey];

        expect(screen.getAllByText(capitalize(statKey))[0]).toBeInTheDocument();
        expect(screen.getByText(statValue)).toBeInTheDocument();
      }
    }

    expect(screen.getByText("Histogram")).toBeInTheDocument();
    expect(screen.getByText("HistogramChart")).toBeInTheDocument();
    expect(screen.getByText("Colorize by Attribute")).toBeInTheDocument();
    expect(screen.getByText("ToggleSwitch")).toBeInTheDocument();
    expect(screen.getByTestId("histogram-split-line")).toBeInTheDocument();

    const histogramIcon = screen.getByText("Histogram").firstElementChild;

    histogramIcon && userEvent.click(histogramIcon);

    expect(
      screen.queryByTestId("histogram-split-line")
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByText("ToggleSwitch"));

    // Try to get already cached data
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"NAME"}
          statisticsInfo={{
            key: "f_0",
            name: "NAME",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-base-path"}
          colorsByAttribute={null}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });

    expect(loadMock).toHaveBeenCalledTimes(1);
  });

  it("Should no render Attribute Stats if loading statistics error", async () => {
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"NAME"}
          statisticsInfo={{
            key: "f_0",
            name: "NAME",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-error-path"}
          colorsByAttribute={null}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });

    expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();

    await sleep(100);

    for (const statKey in stats) {
      if (statKey !== "histogram" && statKey !== "mostFrequentValues") {
        const statValue = stats[statKey];

        expect(screen.queryByText(statKey)).not.toBeInTheDocument();
        expect(screen.queryByText(statValue)).not.toBeInTheDocument();
      }
    }

    expect(screen.queryByText("HistogramChart")).not.toBeInTheDocument();
  });

  it("Should render colorize block", async () => {
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"HEIGHTROOF"}
          statisticsInfo={{
            key: "f_0",
            name: "HEIGHTROOF",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-base-path"}
          colorsByAttribute={{
            attributeName: "HEIGHTROOF",
            minValue: 0,
            maxValue: 100,
            minColor: [0, 0, 0, 0],
            maxColor: [255, 255, 255, 255],
            mode: "replace",
          }}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });
    await sleep(100);
    expect(
      screen.getByTestId("colorsByAttributeFadeContainer")
    ).toBeInTheDocument();
  });

  it("Should render switch 'Colorize By Attribute' on", async () => {
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"HEIGHTROOF"}
          statisticsInfo={{
            key: "f_0",
            name: "HEIGHTROOF",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-base-path"}
          colorsByAttribute={{
            attributeName: "OLD_ATTRIBUTE",
            minValue: 0,
            maxValue: 100,
            minColor: [0, 0, 0, 0],
            maxColor: [255, 255, 255, 255],
            mode: "replace",
          }}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });
    await sleep(100);
    expect(screen.queryByTestId("colorsByAttributeFadeContainer")).toBeNull();

    userEvent.click(screen.getByText("ToggleSwitch"));

    expect(onColorsByAttributeChange).toHaveBeenCalledWith({
      attributeName: "HEIGHTROOF",
      minValue: 0,
      maxValue: 100,
      minColor: [146, 146, 252, 255],
      maxColor: [44, 44, 175, 255],
      mode: "replace",
    });
  });

  it("Should render switch 'Colorize By Attribute' off", async () => {
    act(() => {
      renderWithTheme(
        <AttributeStats
          attributeName={"HEIGHTROOF"}
          statisticsInfo={{
            key: "f_0",
            name: "HEIGHTROOF",
            href: "../testHref",
          }}
          tilesetName={"New York"}
          tilesetBasePath={"https://test-base-path"}
          colorsByAttribute={{
            attributeName: "HEIGHTROOF",
            minValue: 0,
            maxValue: 100,
            minColor: [0, 0, 0, 0],
            maxColor: [255, 255, 255, 255],
            mode: "replace",
          }}
          onColorsByAttributeChange={onColorsByAttributeChange}
        />
      );
    });
    await sleep(100);
    expect(
      screen.getByTestId("colorsByAttributeFadeContainer")
    ).toBeInTheDocument();

    userEvent.click(screen.getByText("ToggleSwitch"));

    expect(onColorsByAttributeChange).toHaveBeenCalledWith(null);
  });
});
