import React, { useEffect } from "react";

const MOUSE_DOWN_EVENT = 'mousedown';
const TOUCH_START_EVENT = 'touchstart';

/**
 * Detect element outside click
 * @param ref 
 * @param handler 
 */
export const useClickOutside = (ref: React.RefObject<HTMLInputElement>, handler: (event: React.ChangeEvent) => void): void => {
  useEffect(
    () => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener(MOUSE_DOWN_EVENT, listener);
      document.addEventListener(TOUCH_START_EVENT, listener);
      return () => {
        document.removeEventListener(MOUSE_DOWN_EVENT, listener);
        document.removeEventListener(TOUCH_START_EVENT, listener);
      };
    },
    [ref, handler]
  );
}
