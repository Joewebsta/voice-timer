import { useEffect } from "react";
import { formatTime } from "@/utils/timeUtils";

export const useDocumentTitle = (remainingSeconds: number | null) => {
  useEffect(() => {
    if (remainingSeconds !== null && remainingSeconds > 0) {
      const timeString = formatTime(remainingSeconds);
      document.title = `Timer: ${timeString}`;
    } else {
      document.title = "Voice Timer";
    }
  }, [remainingSeconds]);
};
