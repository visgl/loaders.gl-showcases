import { HelpPanelSelectedTab, HelpShortcutsData } from "../../types";

import DesktopMouseOrbit from "../../../public/icons/gestures/mouse/desktop-orbit.svg";
import DesktopMousePan from "../../../public/icons/gestures/mouse/desktop-pan.svg";
import DesktopMouseZoom from "../../../public/icons/gestures/mouse/desktop-zoom.svg";

import DesktopTrackpadPan from "../../../public/icons/gestures/trackpad/desktop-pan.svg";
import DesktopTrackpadOrbit from "../../../public/icons/gestures/trackpad/desktop-orbit.svg";
import DesktopTrackpadZoom from "../../../public/icons/gestures/trackpad/desktop-zoom.svg";

import DesktopTouchTrakpadOrbit from "../../../public/icons/gestures/touch/desktop-orbit.svg";
import DesktopTouchTrakpadTilt from "../../../public/icons/gestures/touch/desktop-tilt.svg";

// Mouse videos
import mouseOrbitVideo from "../../../public/videos/mouse-orbit.mp4";
import mousePanVideo from "../../../public/videos/mouse-pan.mp4";
import mouseZoomVideo from "../../../public/videos/mouse-zoom.mp4";

// Touch and trackpad videos
import touchTiltVideo from "../../../public/videos/touch-tilt.mp4";
import touchOrbitTiltVideo from "../../../public/videos/touch-orbit-tilt.mp4";
import touchOrbitVideo from "../../../public/videos/touch-orbit.mp4";
import touchZoomVideo from "../../../public/videos/touch-zoom.mp4";
import touchPanVideo from "../../../public/videos/touch-pan.mp4";

export const getShortcuts = (
  isDesktop: boolean,
  contentColor: string
): HelpShortcutsData => ({
  [HelpPanelSelectedTab.Mouse]: [
    {
      id: "mouse-orbit",
      icon: isDesktop ? <DesktopMouseOrbit /> : null,
      text: "Pan but with Ctrl/Cmd button hold",
      video: mouseOrbitVideo,
    },
    {
      id: "mouse-pan",
      icon: isDesktop ? <DesktopMousePan /> : null,
      text: "Holding the LMB and moving the Mouse",
      video: mousePanVideo,
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
      id: "trackpad-orbit-tilt",
      icon: isDesktop ? <DesktopTrackpadOrbit /> : null,
      text: "Hold left button and move finger around trackpad with Ctrl/Cmd button hold",
      video: touchOrbitTiltVideo,
    },
    {
      id: "trackpad-pan",
      icon: isDesktop ? <DesktopTrackpadPan /> : null,
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
      icon: isDesktop ? <DesktopTouchTrakpadOrbit /> : null,
      text: "Moving two fingers clockwise or counterclockwise to rotate the map respectively.",
      video: touchOrbitVideo,
    },
    {
      id: "touch-tilt",
      icon: isDesktop ? <DesktopTouchTrakpadTilt /> : null,
      text: "Changing the view angle: Moving two fingers to the desired direction. ",
      video: touchTiltVideo,
    },
    {
      id: "touch-orbit-tilt",
      icon: isDesktop ? <DesktopTrackpadOrbit /> : null,
      text: "Holding one finger on the screen and moving it.",
      video: touchOrbitTiltVideo,
    },
    {
      id: "touch-zoom",
      icon: isDesktop ? <DesktopTrackpadZoom /> : null,
      text: "Touching the trackpad with two fingers, moving them in or out at the same time. Moving out  - get closer,  Moving in  - get further",
      video: touchZoomVideo,
    },
  ],
});
