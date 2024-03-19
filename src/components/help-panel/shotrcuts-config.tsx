import { HelpPanelSelectedTab, type HelpShortcutsData, Layout } from "../../types";

// Desktop gestures images
import DesktopMouseOrbit from "../../../public/icons/gestures/mouse/desktop-orbit.svg";
import DesktopMousePan from "../../../public/icons/gestures/mouse/desktop-pan.svg";
import DesktopMouseZoom from "../../../public/icons/gestures/mouse/desktop-zoom.svg";
import DesktopTrackpadPan from "../../../public/icons/gestures/trackpad/desktop-pan.svg";
import DesktopTrackpadOrbit from "../../../public/icons/gestures/trackpad/desktop-orbit.svg";
import DesktopTrackpadZoom from "../../../public/icons/gestures/trackpad/desktop-zoom.svg";
import DesktopTouchTrakpadOrbit from "../../../public/icons/gestures/touch/desktop-orbit.svg";
import DesktopTouchTrakpadTilt from "../../../public/icons/gestures/touch/desktop-tilt.svg";

// Tablet gestures images
import TabletMouseOrbit from "../../../public/icons/gestures/mouse/tablet-orbit.svg";
import TabletMousePan from "../../../public/icons/gestures/mouse/tablet-pan.svg";
import TabletMouseZoom from "../../../public/icons/gestures/mouse/tablet-zoom.svg";
import TabletTrackpadPan from "../../../public/icons/gestures/trackpad/tablet-pan.svg";
import TabletTrackpadOrbit from "../../../public/icons/gestures/trackpad/tablet-orbit.svg";
import TabletTrackpadZoom from "../../../public/icons/gestures/trackpad/tablet-zoom.svg";
import TabletTouchTrakpadOrbit from "../../../public/icons/gestures/touch/tablet-orbit.svg";
import TabletTouchTrakpadTilt from "../../../public/icons/gestures/touch/tablet-tilt.svg";

// Mobile gestures images
import MobileMouseOrbit from "../../../public/icons/gestures/mouse/mobile-orbit.svg";
import MobileMousePan from "../../../public/icons/gestures/mouse/mobile-pan.svg";
import MobileMouseZoom from "../../../public/icons/gestures/mouse/mobile-zoom.svg";
import MobileTrackpadPan from "../../../public/icons/gestures/trackpad/mobile-pan.svg";
import MobileTrackpadOrbit from "../../../public/icons/gestures/trackpad/mobile-orbit.svg";
import MobileTrackpadZoom from "../../../public/icons/gestures/trackpad/mobile-zoom.svg";
import MobileTouchTrakpadOrbit from "../../../public/icons/gestures/touch/mobile-orbit.svg";
import MobileTouchTrakpadTilt from "../../../public/icons/gestures/touch/mobile-tilt.svg";

// Mouse videos
import mouseOrbitVideo from "../../../public/videos/mouse-orbit.mp4";
import mousePanVideo from "../../../public/videos/mouse-pan.mp4";
// TODO: Replace wideo with new one with better quality.
import mouseZoomVideo from "../../../public/videos/mouse-zoom.mp4";

// Touch and trackpad videos
import touchTiltVideo from "../../../public/videos/touch-tilt.mp4";
import touchOrbitTiltVideo from "../../../public/videos/touch-orbit-tilt.mp4";
import touchOrbitVideo from "../../../public/videos/touch-orbit.mp4";
import touchZoomVideo from "../../../public/videos/touch-zoom.mp4";
import touchPanVideo from "../../../public/videos/touch-pan.mp4";

export const getShortcuts = (
  layout: Layout,
  contentColor: string
): HelpShortcutsData => ({
  [HelpPanelSelectedTab.Mouse]: [
    {
      id: "mouse-orbit",
      icon: {
        [Layout.Desktop]: (
          <DesktopMouseOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletMouseOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileMouseOrbit fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Orbit & Map Tilt",
      text: "Pan but with Ctrl/Cmd button hold",
      video: mouseOrbitVideo,
    },
    {
      id: "mouse-pan",
      icon: {
        [Layout.Desktop]: (
          <DesktopMousePan fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletMousePan fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileMousePan fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Panning",
      text: "Holding the LMB and moving the Mouse",
      video: mousePanVideo,
    },
    {
      id: "mouse-zoom",
      icon: {
        [Layout.Desktop]: (
          <DesktopMouseZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletMouseZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileMouseZoom fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Zoom",
      text: "Mouse wheel: wheel upwards = get closer, wheel downwards = get further",
      video: mouseZoomVideo,
    },
  ],
  [HelpPanelSelectedTab.Trackpad]: [
    {
      id: "trackpad-orbit-tilt",
      icon: {
        [Layout.Desktop]: (
          <DesktopTrackpadOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTrackpadOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTrackpadOrbit fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Orbit & Map Tilt",
      text: "Hold left button and move finger around trackpad with Ctrl/Cmd button hold",
      video: touchOrbitTiltVideo,
    },
    {
      id: "trackpad-pan",
      icon: {
        [Layout.Desktop]: (
          <DesktopTrackpadPan fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTrackpadPan fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTrackpadPan fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Panning",
      text: "Hold left button and move finger around trackpad",
      video: touchPanVideo,
    },
    {
      id: "trackpad-zoom",
      icon: {
        [Layout.Desktop]: (
          <DesktopTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Zoom",
      text: "Touching the trackpad with two fingers, moving them in or out at the same time. Moving out  - get closer,  Moving in  - get further",
      video: touchZoomVideo,
    },
  ],
  [HelpPanelSelectedTab.Touch]: [
    {
      id: "touch-orbit",
      icon: {
        [Layout.Desktop]: (
          <DesktopTouchTrakpadOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTouchTrakpadOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTouchTrakpadOrbit fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Orbit",
      text: "Moving two fingers clockwise or counterclockwise to rotate the map respectively.",
      video: touchOrbitVideo,
    },
    {
      id: "touch-tilt",
      icon: {
        [Layout.Desktop]: (
          <DesktopTouchTrakpadTilt fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTouchTrakpadTilt fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTouchTrakpadTilt fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Map Tilt",
      text: "Changing the view angle: Moving three fingers to the desired direction. ",
      video: touchTiltVideo,
    },
    {
      id: "touch-orbit-tilt",
      icon: {
        [Layout.Desktop]: (
          <DesktopTrackpadPan fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTrackpadOrbit fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTrackpadOrbit fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Panning",
      text: "Holding one finger on the screen and moving it.",
      video: touchOrbitTiltVideo,
    },
    {
      id: "touch-zoom",
      icon: {
        [Layout.Desktop]: (
          <DesktopTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Tablet]: (
          <TabletTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
        [Layout.Mobile]: (
          <MobileTrackpadZoom fill={contentColor} stroke={contentColor} />
        ),
      }[layout],
      title: "Zoom",
      text: "Touching the trackpad with two fingers, moving them in or out at the same time. Moving out  - get closer,  Moving in  - get further",
      video: touchZoomVideo,
    },
  ],
});
