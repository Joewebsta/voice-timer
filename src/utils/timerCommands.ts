import { CommandType } from "./voiceCommands";

export interface TimerActions {
  startTimer: (duration: number) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

/**
 * Executes timer commands with the provided actions
 */
export const executeCommand = (
  command: CommandType,
  actions: TimerActions,
  duration?: number
): void => {
  switch (command) {
    case "start":
      if (duration && duration > 0) {
        actions.startTimer(duration);
      }
      break;
    case "stop":
      actions.stopTimer();
      break;
    case "pause":
      actions.pauseTimer();
      break;
    case "resume":
      actions.resumeTimer();
      break;
  }
};

/**
 * Handles complex voice commands via API
 */
export const handleComplexCommand = async (
  transcript: string,
  actions: TimerActions
): Promise<void> => {
  try {
    const response = await fetch("/api/timer", {
      method: "POST",
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const responseData = await response.json();
    const { totalSeconds, command } = responseData;

    if (command && ["start", "stop", "pause", "resume"].includes(command)) {
      if (command === "start" && totalSeconds) {
        actions.startTimer(totalSeconds);
      } else {
        executeCommand(command as CommandType, actions);
      }
    }
  } catch (error) {
    console.error("Failed to process complex command:", error);
    // Could add user feedback here (toast notification, etc.)
  }
};
