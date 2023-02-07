import React, { useEffect } from "react";

const MOUSE_DOWN_EVENT = "mousedown";
const TOUCH_START_EVENT = "touchstart";

/**
 * Detect element outside click
 * @param nodeElement
 * @param handler
 */
export const useClickOutside = (
  nodeElements: (Element | null | undefined)[],
  handler: (event: React.ChangeEvent) => void
): void => {
  useEffect(() => {
    const listener = (event) => {
      for (const nodeElement of nodeElements || []) {
        if (!nodeElement || nodeElement.contains(event.target)) {
          return;
        }
      }

      handler(event);
    };
    document.addEventListener(MOUSE_DOWN_EVENT, listener);
    document.addEventListener(TOUCH_START_EVENT, listener);
    return () => {
      document.removeEventListener(MOUSE_DOWN_EVENT, listener);
      document.removeEventListener(TOUCH_START_EVENT, listener);
    };
  }, [nodeElements, handler]);
};
