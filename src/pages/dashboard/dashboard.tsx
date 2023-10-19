import { useState, useCallback } from "react";
// import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { I3SLoader } from "@loaders.gl/i3s";
import { MapView, LinearInterpolator } from "@deck.gl/core";
import styled from "styled-components";
import { Layout } from "../../utils/enums";
import ViewerImage from "../../../public/images/viewer-image.svg";
import DebugImage from "../../../public/images/debug-image.svg";
import ComparisonImage from "../../../public/images/comparison-image.svg";
import Mac from "../../../public/images/mac.webp";
import Iphone from "../../../public/images/iphone.webp";
import Arrow from "../../../public/icons/arrow-left.svg";
import AppShowcase from "../../../public/images/app-showcase.webp";
import Background from "../../../public/images/tools-background.webp";
import {
  color_canvas_primary_inverted,
  color_brand_secondary,
  color_brand_tertiary,
  hilite_canvas_secondary,
  hilite_canvas_primary,
} from "../../constants/colors";
import { Link } from "react-router-dom";
import {
  getCurrentLayoutProperty,
  useAppLayout,
} from "../../utils/hooks/layout";
import { LayoutProps } from "../../types";
import MapWrapper from "../../components/map-wrapper/map-wrapper";

const TILESET_URL = `https://tiles.arcgis.com/tiles/UE5k7ygNe76vVJgy/arcgis/rest/services/SF_cut_3/SceneServer/layers/0`;
const DEFAULT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  transitionDuration: 0,
  longitude: -122.40217135287753,
  latitude: 37.7953686105136,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 17,
};

const VIEW = new MapView({
  id: "main",
  controller: {
    inertia: true,
    dragPan: false,
    dragRotate: false,
    scrollZoom: false,
  },
  farZMultiplier: 2.02,
});

const DashboardContainer = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  background: url(${Background});
  background-attachment: fixed;
  background-size: cover;

  height: ${getCurrentLayoutProperty({
    desktop: "calc(100vh - 65px)",
    tablet: "calc(100vh - 65px)",
    mobile: "calc(100vh - 58px)",
  })};

  margin-top: ${getCurrentLayoutProperty({
    desktop: "65px",
    tablet: "65px",
    mobile: "58px",
  })};
`;

const DeckWithTitleWrapper = styled.div<LayoutProps>`
  display: flex;
  position: relative;
  width: 100%;

  min-height: ${getCurrentLayoutProperty({
    desktop: "474px",
    tablet: "538px",
    mobile: "275px",
  })};
`;

const Wrapper = styled.div<LayoutProps>`
  position: relative;
  width: 100%;
`;

const ToolsContainer = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  gap: 40px;

  margin: ${getCurrentLayoutProperty({
    desktop: "40px 0 114px 80px",
    tablet: "0 48px 172px 48px",
    mobile: "0 16px 100px 16px",
  })};
`;

const Title = styled.div<LayoutProps>`
  position: absolute;
  font-weight: 700;
  font-style: normal;
  color: ${color_canvas_primary_inverted};
  text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
  z-index: 4;

  top: ${getCurrentLayoutProperty({
    desktop: "229px",
    tablet: "116px",
    mobile: "75px",
  })};

  left: ${getCurrentLayoutProperty({
    desktop: "80px",
    tablet: "48px",
    mobile: "16px",
  })};

  width: ${getCurrentLayoutProperty({
    desktop: "685px",
    tablet: "685px",
    mobile: "345px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "219px",
    tablet: "219px",
    mobile: "135px",
  })};

  font-size: ${getCurrentLayoutProperty({
    desktop: "52px",
    tablet: "52px",
    mobile: "32px",
  })};

  line-height: ${getCurrentLayoutProperty({
    desktop: "73px",
    tablet: "73px",
    mobile: "45px",
  })};
`;

const GreenText = styled.span`
  color: ${color_brand_secondary};
`;

const MacImage = styled.img`
  position: absolute;
  left: 870px;
  top: -200px;
  width: 1041px;
  height: 660px;
  z-index: 3;

  @media (max-width: 1270px) {
    left: calc(100% - 520px);
  }

  @media (max-width: 1160px) {
    left: calc(100% - 320px);
  }
`;

const IphoneImage = styled.img`
  position: absolute;
  top: 0;
  left: 1670px;
  z-index: 4;
  width: 198px;

  @media (max-width: 1670px) {
    left: calc(100% - 184px);
  }

  @media (max-width: 1160px) {
    left: calc(100% - 92px);
  }
`;

const AppShowcaseMobile = styled.img<LayoutProps>`
  position: relative;
  z-index: 3;

  width: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "738px",
    mobile: "343px",
  })};

  height: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "437px",
    mobile: "203px",
  })};

  left: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "calc(50% - 370px)",
    mobile: "calc(50% - 170px)",
  })};

  top: ${getCurrentLayoutProperty({
    desktop: "auto",
    tablet: "-100px",
    mobile: "-50px",
  })};
`;

const ToolsItem = styled.div<LayoutProps>`
  display: flex;
  gap: 30px;

  flex-direction: ${getCurrentLayoutProperty({
    desktop: "row",
    tablet: "row",
    mobile: "column",
  })};

  align-items: ${getCurrentLayoutProperty({
    desktop: "stretch",
    tablet: "center",
    mobile: "center",
  })};

  justify-content: ${getCurrentLayoutProperty({
    desktop: "start",
    tablet: "center",
    mobile: "center",
  })};
`;

const ToolItemDescription = styled.div<LayoutProps>`
  width: ${getCurrentLayoutProperty({
    desktop: "456px",
    tablet: "594px",
    mobile: "343px",
  })};

  font-size: ${getCurrentLayoutProperty({
    desktop: "24px",
    tablet: "24px",
    mobile: "16px",
  })};

  text-align: ${getCurrentLayoutProperty({
    desktop: "start",
    tablet: "start",
    mobile: "center",
  })};
  font-weight: 400;
  font-style: normal;
  line-height: 34px;
  color: ${hilite_canvas_primary};
`;

const ArrowContainer = styled(Link)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${hilite_canvas_secondary};
  border-radius: 100px;
  transform: rotate(180deg);
`;

/**
 * TODO: Add types to component
 */
export const Dashboard = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const transitionInterpolator = new LinearInterpolator(["bearing"]);

  const layout = useAppLayout();

  const rotateCamera = useCallback(() => {
    setViewState((viewState) => ({
      ...viewState,
      bearing: viewState.bearing + 30,
      transitionDuration: 10000,
      transitionInterpolator,
      onTransitionEnd: rotateCamera,
    }));
  }, []);

  const onTilesetLoad = () => {
    setViewState(INITIAL_VIEW_STATE);
    rotateCamera();
  };

  const tile3DLayer = new Tile3DLayer({
    id: "i3s-dashboard-example",
    data: TILESET_URL,
    loader: I3SLoader,
    onTilesetLoad,
  });

  return (
    <DashboardContainer id="dashboard-container" layout={layout}>
      <DeckWithTitleWrapper layout={layout}>
        <Title id="dashboard-title" layout={layout}>
          Explore and Debug I3S Data with one
          <GreenText id="green-text"> Simple and Easy-to-Use Tool</GreenText>
        </Title>
        <DeckGL
          id={"dashboard-app"}
          controller={false}
          views={[VIEW]}
          layers={[tile3DLayer]}
          initialViewState={viewState}
        >
          {/*          <StaticMap mapStyle={DEFAULT_MAP_STYLE} /> */}
          <MapWrapper />
        </DeckGL>
      </DeckWithTitleWrapper>
      <Wrapper id="tools-wrapper" layout={layout}>
        {layout !== Layout.Desktop && (
          <AppShowcaseMobile
            id="app-showcase"
            layout={layout}
            src={AppShowcase}
          />
        )}
        {layout === Layout.Desktop && (
          <>
            <MacImage id="mac-image" src={Mac} />
            <IphoneImage id="iphone-image" src={Iphone} />
          </>
        )}
        <ToolsContainer id="tools-description-container" layout={layout}>
          <ToolsItem id="tools-item-viewer" layout={layout}>
            <ViewerImage />
            <ToolItemDescription layout={layout}>
              Visualize multiple I3S datasets and 3d scenes at once. Gain
              insights into data correctness and performance.
            </ToolItemDescription>
            <ArrowContainer id="viewer-link" to="/viewer">
              <Arrow fill={color_brand_tertiary} />
            </ArrowContainer>
          </ToolsItem>
          <ToolsItem id="tools-item-debug" layout={layout}>
            <DebugImage />
            <ToolItemDescription layout={layout}>
              Validate and explore each tile individually. Catch visualization
              errors and debug data easily, directly in your browser.
            </ToolItemDescription>
            <ArrowContainer id="debug-link" to="/debug">
              <Arrow fill={color_brand_tertiary} />
            </ArrowContainer>
          </ToolsItem>
          <ToolsItem id="tools-item-comparison" layout={layout}>
            <ComparisonImage />
            <ToolItemDescription layout={layout}>
              Compare different, or one dataset before and after data
              conversion. Look for conversion errors and memory anomalies.
            </ToolItemDescription>
            <ArrowContainer id="comparison-link" to="/compare-across-layers">
              <Arrow fill={color_brand_tertiary} />
            </ArrowContainer>
          </ToolsItem>
        </ToolsContainer>
      </Wrapper>
    </DashboardContainer>
  );
};
