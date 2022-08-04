import styled, { css } from "styled-components";
import {
  color_brand_tertiary,
  color_canvas_primary_inverted,
} from "../../constants/colors";
import { HelpPanelSelectedTab, Layout } from "../../types";

import TrackpadImageMobile from "../../../public/images/trackpadTabMobile.svg";
import MouseImageMobile from "../../../public/images/mouseTabMobile.svg";
import TouchImageMobile from "../../../public/images/touchTabMobile.svg";

import TrackpadImageTablet from "../../../public/images/trackpadTabTablet.svg";
import MouseImageTablet from "../../../public/images/mouseTabTablet.svg";
import TouchImageTablet from "../../../public/images/touchTabTablet.svg";

import { useState } from "react";
import { getCurrentLayoutProperty, useAppLayout } from "../../utils/layout";

type ContainerProps = {
  layout: string;
};

type ShortcutTabsProps = {
  selectedTab: HelpPanelSelectedTab;
  onTabSelect: (tab: HelpPanelSelectedTab) => void;
};

type TabProps = {
  active: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-shrink: 0;
  background: ${color_brand_tertiary};
  width: 100%;
  height: 201px;
  height: ${getCurrentLayoutProperty({
    desktop: "",
    tablet: "256px",
    mobile: "201px",
  })};
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow-x: hidden;
`;

const ShortcutsBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Tab = styled.div<TabProps>`
  position: relative;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
  color: ${color_canvas_primary_inverted};

  &:nth-child(2n) {
    margin: 0 32px;
  }

  ${({ active }) =>
    active &&
    css`
      &:before {
        content: "";
        position: absolute;
        top: 30px;
        left: -10%;
        width: 120%;
        height: 2px;
        background: ${color_canvas_primary_inverted};
      }
    `}
`;

const MobileTabImagesWrapper = styled.div`
  position: relative;
`;

const MobileImageWrapper = styled.div`
  position: absolute;
  bottom: 24px;

  &:nth-child(1) {
    opacity: 0.5;
    left: -8%;
  }

  &:nth-child(2) {
    left: 39%;
  }

  &:nth-child(3) {
    right: -8%;
    opacity: 0.5;
  }
`;

const TabletTabImagesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 31px;
`;

const TabletImageWrapper = styled.div`
  &:nth-child(1) {
    opacity: 0.5;
  }

  &:nth-child(2) {
    margin: 0 76px;
  }

  &:nth-child(3) {
    opacity: 0.5;
  }
`;

export const NonDesktopShortcutTabs = ({
  selectedTab,
  onTabSelect,
}: ShortcutTabsProps) => {
  const layout = useAppLayout();

  const [tabOrder, setTabOrder] = useState([
    HelpPanelSelectedTab.Touch,
    HelpPanelSelectedTab.Mouse,
    HelpPanelSelectedTab.Trackpad,
  ]);

  const shortcutImagesMobile = {
    [HelpPanelSelectedTab.Mouse]: <MouseImageMobile />,
    [HelpPanelSelectedTab.Trackpad]: <TrackpadImageMobile />,
    [HelpPanelSelectedTab.Touch]: <TouchImageMobile />,
  };

  const shortcutImagesTablet = {
    [HelpPanelSelectedTab.Mouse]: <MouseImageTablet />,
    [HelpPanelSelectedTab.Trackpad]: <TrackpadImageTablet />,
    [HelpPanelSelectedTab.Touch]: <TouchImageTablet />,
  };

  const handleSelectTab = (tab: HelpPanelSelectedTab) => {
    const activeTabIndex = 1;
    const activeTab = tabOrder[1];
    const newActiveTabIndex = tabOrder.indexOf(tab);
    const newTabOrder = [...tabOrder];

    newTabOrder[activeTabIndex] = tab;
    newTabOrder[newActiveTabIndex] = activeTab;

    setTabOrder(newTabOrder);
    onTabSelect(tab);
  };

  const renderTab = (
    tab: HelpPanelSelectedTab,
    selectedTab: HelpPanelSelectedTab
  ) => (
    <Tab
      key={`tab-${tab}`}
      active={selectedTab === tab}
      onClick={() => handleSelectTab(tab)}
    >
      {tab}
    </Tab>
  );

  const renderMobileImages = () => (
    <MobileTabImagesWrapper>
      {tabOrder.map((tabData) => (
        <MobileImageWrapper
          onClick={() => handleSelectTab(tabData)}
          key={`image-${tabData}`}
        >
          {shortcutImagesMobile[tabData]}
        </MobileImageWrapper>
      ))}
    </MobileTabImagesWrapper>
  );

  const renderTabletImages = () => (
    <TabletTabImagesWrapper>
      {tabOrder.map((tabData) => (
        <TabletImageWrapper
          onClick={() => handleSelectTab(tabData)}
          key={`image-${tabData}`}
        >
          {shortcutImagesTablet[tabData]}
        </TabletImageWrapper>
      ))}
    </TabletTabImagesWrapper>
  );

  return (
    <Container layout={layout}>
      <ShortcutsBlock>
        {tabOrder.map((tabData) => renderTab(tabData, selectedTab))}
      </ShortcutsBlock>
      {layout === Layout.Mobile && renderMobileImages()}
      {layout === Layout.Tablet && renderTabletImages()}
    </Container>
  );
};
