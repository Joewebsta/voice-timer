function parseDurationFromTranscript(transcript: string) {
  const duration = { hours: 0, minutes: 0, seconds: 0 };

  const numberWordMapping: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    thirteen: "13",
    fourteen: "14",
    fifteen: "15",
    sixteen: "16",
    seventeen: "17",
    eighteen: "18",
    nineteen: "19",
    twenty: "20",
    thirty: "30",
    forty: "40",
    fifty: "50",
    sixty: "60",
  };

  let processedText = transcript.toLowerCase();

  Object.entries(numberWordMapping).forEach(([word, number]) => {
    processedText = processedText.replace(
      new RegExp(`\\b${word}\\b`, "g"),
      number
    );
  });

  const hoursPattern = processedText.match(/(\d+)\s*hours?/);
  const minutesPattern = processedText.match(/(\d+)\s*minutes?/);
  const secondsPattern = processedText.match(/(\d+)\s*seconds?/);

  if (hoursPattern) duration.hours = parseInt(hoursPattern[1]);
  if (minutesPattern) duration.minutes = parseInt(minutesPattern[1]);
  if (secondsPattern) duration.seconds = parseInt(secondsPattern[1]);

  return duration;
}

const findCommandType = (transcript: string): string | null => {
  const COMMAND_ALIASES = {
    start: [
      "start",
      "create",
      "set",
      "begin",
      "launch",
      "initiate",
      "make",
      "new",
    ],
    stop: ["stop", "cancel", "end", "terminate", "quit", "abort", "kill"],
    pause: ["pause", "suspend", "hold", "freeze", "wait"],
    resume: ["resume", "continue", "unpause", "restart", "proceed", "go"],
  };

  const words = transcript.toLowerCase().split(/\s+/);

  for (const [command, aliases] of Object.entries(COMMAND_ALIASES)) {
    if (aliases.some((alias) => words.includes(alias))) {
      return command;
    }
  }

  return null;
};

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export {
  parseDurationFromTranscript as parseDuration,
  findCommandType,
  formatTime,
};
