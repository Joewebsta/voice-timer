// Import parseDuration from utils to avoid circular dependency
import { parseDuration } from "./utils";
import { timeToSeconds } from "./timeUtils";

export const VOICE_COMMANDS = {
  start: [
    "start",
    "set",
    "create",
    "begin",
    "launch",
    "initiate",
    "make",
    "new",
  ],
  stop: ["stop", "cancel", "end", "terminate", "quit", "abort", "kill"],
  pause: ["pause", "hold", "suspend", "freeze", "wait"],
  resume: ["resume", "continue", "unpause", "restart", "proceed", "go"],
} as const;

export type CommandType = keyof typeof VOICE_COMMANDS;

export interface TimerCommand {
  type: CommandType;
  duration?: number;
}

export interface VoiceCommandResult {
  success: boolean;
  command?: TimerCommand;
  error?: string;
}

// Detects voice commands from transcript using keyword matching
export const detectCommand = (transcript: string): CommandType | null => {
  if (!transcript || typeof transcript !== "string") {
    return null;
  }

  const lowerTranscript = transcript.toLowerCase().trim();

  for (const [command, keywords] of Object.entries(VOICE_COMMANDS)) {
    if (keywords.some((keyword) => lowerTranscript.includes(keyword))) {
      return command as CommandType;
    }
  }

  return null;
};

// Parses duration from transcript and returns total seconds
export const parseDurationToSeconds = (transcript: string): number => {
  try {
    const durationData = parseDuration(transcript);
    return timeToSeconds(
      durationData.hours,
      durationData.minutes,
      durationData.seconds
    );
  } catch (error) {
    console.error("Error parsing duration:", error);
    return 0;
  }
};

// Processes voice input and returns command with optional duration
export const processVoiceInput = (transcript: string): VoiceCommandResult => {
  if (!transcript || typeof transcript !== "string") {
    return {
      success: false,
      error: "Invalid transcript provided",
    };
  }

  const command = detectCommand(transcript);

  if (!command) {
    return {
      success: false,
      error: "No valid command detected",
    };
  }

  const result: TimerCommand = { type: command };

  // Only parse duration for start commands
  if (command === "start") {
    const totalSeconds = parseDurationToSeconds(transcript);
    if (totalSeconds > 0) {
      result.duration = totalSeconds;
    } else {
      return {
        success: false,
        error: "Start command requires a valid duration",
      };
    }
  }

  return {
    success: true,
    command: result,
  };
};

// Validates if a command type is valid
export const isValidCommand = (command: string): command is CommandType => {
  return Object.keys(VOICE_COMMANDS).includes(command);
};
