"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { parseDuration } from "@/utils/utils";

export default function Home() {
  const {
    remainingSeconds,
    isRunning,
    isPaused,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  } = useTimer();

  const handleVoiceInput = (transcript: string) => {
    if (
      transcript.includes("start") ||
      transcript.includes("create") ||
      transcript.includes("set")
    ) {
      const parsedDuration = parseDuration(transcript);
      const totalSeconds =
        parsedDuration.hours * 3600 +
        parsedDuration.minutes * 60 +
        parsedDuration.seconds;

      startTimer(totalSeconds);
    }

    if (transcript.includes("cancel") || transcript.includes("stop")) {
      stopTimer();
    }

    if (transcript.includes("pause") || transcript.includes("resume")) {
      if (isPaused) {
        resumeTimer();
      } else {
        pauseTimer();
      }
    }
  };

  const { isListening, startListening, stopListening } =
    useSpeechRecognition(handleVoiceInput);

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div>
      <button
        onClick={toggleSpeechRecognition}
        className={`w-fit p-3 rounded-md font-medium transition-colors ${
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Voice Recognition"}
      </button>

      <div>
        <p>{remainingSeconds}</p>
      </div>

      {(isRunning || isPaused) && (
        <div>
          <button
            onClick={stopTimer}
            className="w-fit border p-3 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isPaused ? resumeTimer : pauseTimer}
            className="w-fit border p-3 rounded-md font-medium transition-colors"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      )}
    </div>
  );
}
