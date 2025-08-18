"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { parseDuration } from "@/utils/utils";

export default function Home() {
  const { remainingSeconds, isRunning, startTimer, stopTimer } = useTimer();

  const handleVoiceInput = (transcript: string) => {
    const parsedDuration = parseDuration(transcript);
    const totalSeconds =
      parsedDuration.hours * 3600 +
      parsedDuration.minutes * 60 +
      parsedDuration.seconds;

    startTimer(totalSeconds);
  };

  const { isListening, startListening, stopListening } =
    useSpeechRecognition(handleVoiceInput);

  const handleClick = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div>
      {isRunning ? null : (
        <button
          onClick={handleClick}
          className={`w-fit p-3 rounded-md font-medium transition-colors ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isListening ? "Stop Listening" : "Start Voice Recognition"}
        </button>
      )}

      {isRunning && (
        <div>
          <button
            onClick={stopTimer}
            className="w-fit border p-3 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button className="w-fit border p-3 rounded-md font-medium transition-colors">
            Pause
          </button>
        </div>
      )}

      <div>
        <p>{remainingSeconds}</p>
      </div>
    </div>
  );
}
