import styled from "styled-components";
import {
  color_brand_secondary,
  color_brand_tertiary,
  color_canvas_primary_inverted,
  hilite_canvas_secondary,
} from "../../constants/colors";
import { HelpPanelSelectedTab } from "../../types";

import TrackpadImage from "../../../public/images/trackpadTabDesktop.svg";
import MouseImage from "../../../public/images/mouseTabDesktop.svg";
import TouchImage from "../../../public/images/touchTabDesktop.svg";

type ShortcutTabsProps = {
  selectedTab: HelpPanelSelectedTab;
  onTabSelect: (tab: HelpPanelSelectedTab) => void;
};

type TabProps = {
  active: boolean;
};

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  background: ${color_brand_tertiary};
  width: 272px;
  height: 100%;
  flex-direction: column;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  justify-content: space-between;
`;

const ShortcutsBlock = styled.div`
  padding-left: 24px;
`;

const ShortcutsTitle = styled.div`
  position: relative;
  font-style: normal;
  font-weight: 700;
  font-size: 34px;
  line-height: 41px;
  letter-spacing: 0.01em;
  color: ${color_canvas_primary_inverted};
  padding-top: 55px;
`;

const HorizontalLine = styled.div`
  width: 74px;
  height: 4px;
  margin-top: 36px;
  margin-bottom: 25px;
  background: ${hilite_canvas_secondary};
  border-radius: 4px;
`;

const TabImageWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 53px;
`;

const Tab = styled.div<TabProps>`
  margin-top: 18px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0.01em;
  color: ${({ active }) =>
    active ? color_brand_secondary : color_canvas_primary_inverted};
  padding-left: ${({ active }) => (active ? "10px" : 0)};
  cursor: pointer;
`;

export const DesktopShortcutTabs = ({
  selectedTab,
  onTabSelect,
}: ShortcutTabsProps) => {
  const ShortcutImage = {
    [HelpPanelSelectedTab.Mouse]: MouseImage,
    [HelpPanelSelectedTab.Trackpad]: TrackpadImage,
    [HelpPanelSelectedTab.Touch]: TouchImage,
  }[selectedTab];

  return (
    <Container>
      <ShortcutsBlock>
        <ShortcutsTitle>Shortcuts</ShortcutsTitle>
        <HorizontalLine />
        <Tab
          data-testid="tab-mouse"
          active={selectedTab === HelpPanelSelectedTab.Mouse}
          onClick={() => onTabSelect(HelpPanelSelectedTab.Mouse)}
        >
          Mouse
        </Tab>
        <Tab
          data-testid="tab-trackpad"
          active={selectedTab === HelpPanelSelectedTab.Trackpad}
          onClick={() => onTabSelect(HelpPanelSelectedTab.Trackpad)}
        >
          Trackpad
        </Tab>
        <Tab
          data-testid="tab-touch"
          active={selectedTab === HelpPanelSelectedTab.Touch}
          onClick={() => onTabSelect(HelpPanelSelectedTab.Touch)}
        >
          Touch
        </Tab>
      </ShortcutsBlock>
      <TabImageWrapper>
        <ShortcutImage />
      </TabImageWrapper>
    </Container>
  );
};
