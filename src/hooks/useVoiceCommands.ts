import { useCallback } from "react";
import { processVoiceInput } from "@/utils/voiceCommands";
import {
  executeCommand,
  handleComplexCommand,
  TimerActions,
} from "@/utils/timerCommands";

// Custom hook for handling voice commands with timer actions
export const useVoiceCommands = (timerActions: TimerActions) => {
  const handleVoiceInput = useCallback(
    async (transcript: string) => {
      const result = processVoiceInput(transcript);

      if (result.success && result.command) {
        executeCommand(
          result.command.type,
          timerActions,
          result.command.duration
        );
        return;
      }

      // Log error for debugging (could be replaced with user feedback)
      if (!result.success) {
        console.warn("Voice command processing failed:", result.error);
      }

      // Fallback to API for complex cases
      await handleComplexCommand(transcript, timerActions);
    },
    [timerActions]
  );

  return { handleVoiceInput };
};
