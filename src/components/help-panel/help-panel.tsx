import { useEffect, useMemo, useState } from "react";
import { HelpPanelSelectedTab, HelpShortcutItem, Layout } from "../../types";
import { useAppLayout } from "../../utils/layout";
import { DesktopHelpPanel } from "./desktop-help-panel";
import { NonDesktopHelpPanel } from "./non-desktop-help-panel";

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
    return getShortcuts(layout, theme.colors.buttonIconColor);
  }, [layout, theme]);

  const initialTab = useMemo(() => {
    return isDesktop ? HelpPanelSelectedTab.Mouse : HelpPanelSelectedTab.Touch;
  }, [layout]);

  const [selectedTab, setSelectedTab] =
    useState<HelpPanelSelectedTab>(initialTab);

  const [shortcuts, setShortcuts] = useState<HelpShortcutItem[]>(
    shortcutsList[initialTab]
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
  }
  return (
    <NonDesktopHelpPanel
      selectedTab={selectedTab}
      onTabSelect={setSelectedTab}
      onClose={onClose}
      shortcuts={shortcuts}
      activeShortcutId={activeShortcutId}
      onShortcutClick={setActiveShortcutId}
    />
  );
};
