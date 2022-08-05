import { useEffect, useMemo, useState } from "react";
import { HelpPanelSelectedTab, HelpShortcutItem, Layout } from "../../types";
import { useAppLayout } from "../../utils/layout";
import { DesktopHelpPanel } from "./desktop-help-panel";
// import { NonDesktopHelpPanel } from "./non-desktop-help-panel";

import { useTheme } from "styled-components";
import { getShortcuts } from "./shotrcuts-config";

type HelpPanelProps = {
  onClose: () => void;
};

export const HelpPanel = ({ onClose }: HelpPanelProps) => {
  const layout = useAppLayout();
  const theme = useTheme();
  const isDesktop = layout === Layout.Desktop;

  const shortcutsList = useMemo(() => {
    return getShortcuts(isDesktop, theme.colors.buttonIconColor);
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

  if (isDesktop) {
    return (
      <DesktopHelpPanel
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        onClose={onClose}
        shortcuts={shortcuts}
        activeShortcutId={activeShortcutId}
        onShortcutHover={setActiveShortcutId}
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
