import React, { useEffect, useState } from "react";
import { StyledOfflineReadyToast } from "./offlineReadyToastStyle";

export function OfflineReadyToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger fade-in
    const showTimer = requestAnimationFrame(() => setVisible(true));

    // fade out after 3 seconds
    const hideTimer = setTimeout(() => setVisible(false), 3000);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <StyledOfflineReadyToast
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(10px)",
      }}
    >
    Ready to use offline
    </StyledOfflineReadyToast>
  );
}
