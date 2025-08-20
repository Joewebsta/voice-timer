"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { findCommandType, parseDuration, formatTime } from "@/utils/utils";

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
    const commandType = findCommandType(transcript);

    if (commandType === "start") {
      const parsedDuration = parseDuration(transcript);
      const totalSeconds =
        parsedDuration.hours * 3600 +
        parsedDuration.minutes * 60 +
        parsedDuration.seconds;

      startTimer(totalSeconds);
    }

    if (commandType === "stop") {
      stopTimer();
    }

    if (commandType === "pause") {
      pauseTimer();
    }

    if (commandType === "resume") {
      resumeTimer();
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
    <div className="h-dvh flex justify-center items-center p-4">
      <div className="w-full flex flex-col gap-6 items-center">
        <div className="border rounded-lg flex flex-col justify-center items-center w-full h-[400px] gap-6 max-w-5xl">
          <div className="relative">
            <p className="text-[80px] leading-none">
              {formatTime(remainingSeconds ?? 0)}
            </p>

            {(isRunning || isPaused) && (
              <div className="flex gap-4 absolute left-1/2 top-full transform -translate-x-1/2 mt-10">
                <button
                  onClick={stopTimer}
                  className="border p-3 rounded-md font-medium transition-colors w-[86px]"
                >
                  Cancel
                </button>
                <button
                  onClick={isPaused ? resumeTimer : pauseTimer}
                  className="border p-3 rounded-md font-medium transition-colors w-[86px]"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              </div>
            )}
          </div>
        </div>
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
      </div>
    </div>
  );
}
