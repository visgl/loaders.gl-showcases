import React from "react";
import { useState, useCallback } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { I3SLoader } from "@loaders.gl/i3s";
import { MapView, LinearInterpolator } from "@deck.gl/core";
import styled, { css } from "styled-components";
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
import { LayoutProps } from "../../components/comparison/common";

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
  ${getCurrentLayoutProperty({
    desktop: "overflow: hidden",
    tablet: "overflow: scroll",
    mobile: "overflow: scroll",
  })};

  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: url(${Background});
  background-attachment: fixed;
  background-size: cover;
`;

const Title = styled.div<LayoutProps>`
  position: relative;

  ${getCurrentLayoutProperty({
    desktop: "left: 80px",
    tablet: "left: 48px",
    mobile: "left: 16px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "width: 685px",
    tablet: "width: 685px",
    mobile: "width: 343px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "height: 219px",
    tablet: "height: 219px",
    mobile: "height: 135px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "font-size: 52px",
    tablet: "font-size: 52px",
    mobile: "font-size: 32px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "line-height: 73px",
    tablet: "line-height: 73px",
    mobile: "line-height: 45px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "top: calc(50% - 50px)",
    tablet: "top: calc(50% - 100px)",
    mobile: "top: calc(50% - 60px)",
  })};

  font-weight: 700;
  font-style: normal;
  color: ${color_canvas_primary_inverted};
  text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
  z-index: 4;
`;

const GreenText = styled.span`
  color: ${color_brand_secondary};
`;

const Wrapper = styled.div`
  width: 100%;
  height: 50vh;
`;

const MacImage = styled.img`
  position: absolute;
  width: 1041px;
  height: 615px;
  left: 800px;
  top: calc(50% - 615px / 2 + 130.5px);
  z-index: 3;
`;

const AppShowcaseMobile = styled.img<LayoutProps>`
  position: relative;

  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "width: 738px",
    mobile: "width: 343px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "height: 437px",
    mobile: "height: 203px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "left: calc(50% - 370px)",
    mobile: "left: calc(50% - 170px)",
  })};

  ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "top: -100px",
    mobile: "top: -50px",
  })};

  z-index: 3;
`;

const IphoneImage = styled.img`
  position: absolute;
  z-index: 4;
  width: 201px;
  right: calc(50% - 875px);
  top: calc(50% - 615px / 2 + 330.5px);

  @media (max-width: 1440px) {
    right: -20px;
  }

  @media (max-width: 1250px) {
    right: -120px;
  }
`;

const ToolsContainer = styled.div<{ isDesktop: boolean }>`
  display: flex;
  height: 100%;
  flex-direction: column;

  ${({ isDesktop }) =>
    isDesktop &&
    css`
      margin: 40px 0 40px 80px;
    `}

  ${({ isDesktop }) =>
    !isDesktop &&
    css`
      align-items: center;
    `}

  gap: 40px;
`;

const ToolsItem = styled.div<LayoutProps>`
  display: flex;

  ${getCurrentLayoutProperty({
    desktop: "flex-direction: row",
    tablet: "flex-direction: row",
    mobile: "flex-direction: column",
  })};

  ${getCurrentLayoutProperty({
    desktop: "align-items: stretch",
    tablet: "align-items: center",
    mobile: "align-items: center",
  })};

  ${getCurrentLayoutProperty({
    desktop: "justify-content: start",
    tablet: "justify-content: center",
    mobile: "justify-content: center",
  })};

  gap: 30px;
`;

const ToolItemDescription = styled.div<LayoutProps>`
  ${getCurrentLayoutProperty({
    desktop: "width: 456px",
    tablet: "width: 594px",
    mobile: "width: 343px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "font-size: 24px",
    tablet: "font-size: 24px",
    mobile: "font-size: 16px",
  })};

  ${getCurrentLayoutProperty({
    desktop: "text-align: start",
    tablet: "text-align: start",
    mobile: "text-align: center",
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
      <DeckGL
        id={"dashboard-app"}
        controller={false}
        views={[VIEW]}
        layers={[tile3DLayer]}
        initialViewState={viewState}
        style={{ position: "relative", height: "50%" }}
      >
        <StaticMap mapStyle={DEFAULT_MAP_STYLE} />
        <Title id="dashboard-title" layout={layout}>
          Explore and Debug I3S Data with one
          <GreenText id="green-text"> Simple and Easy-to-Use Tool</GreenText>
        </Title>
      </DeckGL>
      <Wrapper id="tools-wrapper">
        {layout !== Layout.Desktop ? (
          <AppShowcaseMobile
            id="app-showcase"
            layout={layout}
            src={AppShowcase}
          />
        ) : (
          <>
            <MacImage id="mac-image" src={Mac} />
            <IphoneImage id="iphone-image" src={Iphone} />
          </>
        )}
        <ToolsContainer
          id="tools-description-container"
          isDesktop={layout === Layout.Desktop}
        >
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
