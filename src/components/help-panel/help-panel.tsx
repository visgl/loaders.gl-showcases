import { useEffect, useMemo, useState } from "react";
import {
  HelpPanelSelectedTab,
  HelpShortcutsData,
  HelpShortcutItem,
  Layout,
} from "../../types";
import { useAppLayout } from "../../utils/layout";
import { DesktopHelpPanel } from "./desktop-help-panel";
// import { NonDesktopHelpPanel } from "./non-desktop-help-panel";

import DesktopMousePan from "../../../public/icons/gestures/mouse/desktop-hold.svg";
import DesktopMouseHold from "../../../public/icons/gestures/mouse/desktop-pan.svg";
import DesktopMouseZoom from "../../../public/icons/gestures/mouse/desktop-zoom.svg";

import DesktopTrackpadPan from "../../../public/icons/gestures/trackpad/desktop-hold.svg";
import DesktopTrackpadHold from "../../../public/icons/gestures/trackpad/desktop-pan.svg";
import DesktopTrackpadZoom from "../../../public/icons/gestures/trackpad/desktop-zoom.svg";

import TouchTrakpadOrbit from "../../../public/icons/gestures/touch/desktop-orbit.svg";
import TouchTrakpadTilt from "../../../public/icons/gestures/touch/desktop-tilt.svg";

// Mouse videos
import mouseOrbitVideo from "../../../public/videos/mouse-orbit.mp4";
import mouseHoldVideo from "../../../public/videos/mouse-hold.mp4";
import mouseZoomVideo from "../../../public/videos/mouse-zoom.mp4";

// Touch and trackpad videos
import touchTiltVideo from "../../../public/videos/touch-tilt.mp4";
import touchHoldVideo from "../../../public/videos/touch-hold.mp4";
import touchOrbitVideo from "../../../public/videos/touch-orbit.mp4";
import touchZoomVideo from "../../../public/videos/touch-zoom.mp4";
import touchPanVideo from "../../../public/videos/touch-pan.mp4";

import { useTheme } from "styled-components";

type HelpPanelProps = {
  onClose: () => void;
};

const getShortcuts = (
  isDesktop: boolean,
  contentColor: string
): HelpShortcutsData => ({
  [HelpPanelSelectedTab.Mouse]: [
    {
      id: "mouse-orbit",
      icon: isDesktop ? <DesktopMousePan /> : null,
      text: "Pan but with Ctrl/Cmd button hold",
      video: mouseOrbitVideo,
    },
    {
      id: "mouse-pan",
      icon: isDesktop ? <DesktopMouseHold /> : null,
      text: "Holding the LMB and moving the Mouse",
      video: mouseHoldVideo,
    },
    {
      id: "mouse-zoom",
      icon: isDesktop ? <DesktopMouseZoom /> : null,
      text: "Mouse wheel: wheel upwards = get closer, wheel downwards = get further",
      video: mouseZoomVideo,
    },
  ],
  [HelpPanelSelectedTab.Trackpad]: [
    {
      id: "trackpad-hold",
      icon: isDesktop ? <DesktopTrackpadPan /> : null,
      text: "Hold left button and move finger around trackpad with Ctrl/Cmd button hold",
      video: touchHoldVideo,
    },
    {
      id: "trackpad-pan",
      icon: isDesktop ? <DesktopTrackpadHold /> : null,
      text: "Hold left button and move finger around trackpad",
      video: touchPanVideo,
    },
    {
      id: "trackpad-zoom",
      icon: isDesktop ? <DesktopTrackpadZoom /> : null,
      text: "Touching the trackpad with two fingers, moving them in or out at the same time. Moving out  - get closer,  Moving in  - get further",
      video: touchZoomVideo,
    },
  ],
  [HelpPanelSelectedTab.Touch]: [
    {
      id: "touch-orbit",
      icon: isDesktop ? <TouchTrakpadOrbit /> : null,
      text: "Moving two fingers clockwise or counterclockwise to rotate the map respectively.",
      video: touchOrbitVideo,
    },
    {
      id: "touch-tilt",
      icon: isDesktop ? <TouchTrakpadTilt /> : null,
      text: "Changing the view angle: Moving two fingers to the desired direction. ",
      video: touchTiltVideo,
    },
    {
      id: "touch-pan",
      icon: isDesktop ? <DesktopTrackpadHold /> : null,
      text: "Holding one finger on the screen and moving it.",
      video: touchPanVideo,
    },
    {
      id: "touch-zoom",
      icon: isDesktop ? <DesktopTrackpadZoom /> : null,
      text: "Touching the trackpad with two fingers, moving them in or out at the same time. Moving out  - get closer,  Moving in  - get further",
      video: touchZoomVideo,
    },
  ],
});

export const HelpPanel = ({ onClose }: HelpPanelProps) => {
  const layout = useAppLayout();
  const theme = useTheme();
  const isDesktop = layout === Layout.Desktop;

  const shortcutsList = useMemo(() => {
    console.log("Update shortcutList");
    return getShortcuts(isDesktop, theme.colors.fontColor);
  }, [isDesktop, theme]);

  const [selectedTab, setSelectedTab] = useState<HelpPanelSelectedTab>(
    HelpPanelSelectedTab.Mouse
  );

  const [shortcuts, setShortcuts] = useState<HelpShortcutItem[]>(
    shortcutsList[HelpPanelSelectedTab.Mouse]
  );

  const [activeShortcutId, setActiveShortcutId] = useState<string>("");

  useEffect(() => {
    setShortcuts(shortcutsList[selectedTab]);
  }, [selectedTab, theme]);

  const onShortcutHover = (shortcutId) => {
    setActiveShortcutId(shortcutId);
  };

  if (isDesktop) {
    return (
      <DesktopHelpPanel
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        onClose={onClose}
        shortcuts={shortcuts}
        activeShortcutId={activeShortcutId}
        onShortcutHover={onShortcutHover}
      />
    );
  } else {
    return null;
    // <NonDesktopHelpPanel
    //   selectedTab={selectedTab}
    //   onTabSelect={setSelectedTab}
    //   onClose={onClose}
    // />
  }
};
