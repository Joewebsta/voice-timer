"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { findCommandType, parseDuration } from "@/utils/utils";
import TimeCounter from "@/app/components/ui/time-counter";

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

  useDocumentTitle(remainingSeconds);

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

  const { isListening, listeningMode, startListening, stopListening } =
    useSpeechRecognition(handleVoiceInput);

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="h-dvh flex justify-center items-center p-4 bg-[#4CBEB1]">
      <div className="w-full h-full flex flex-col gap-6 justify-center items-center">
        <div className="border-4 border-[#002F34] rounded-4xl flex flex-col items-center w-full h-9/10 gap-6 max-w-5xl bg-[url(/forest-background.png)] bg-cover bg-center">
          <div className="relative">
            <TimeCounter
              seconds={remainingSeconds ?? 0}
              fontSize={40}
              padding={5}
              gap={10}
              textColor="black"
              fontWeight={900}
            />

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
        {/* <button
          onClick={toggleSpeechRecognition}
          className={`w-fit p-3 rounded-md font-medium transition-colors ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isListening ? "Stop Listening" : "Start Voice Recognition"}
        </button>*/}
        <p className="text-base text-[#002F34]">
          {" "}
          {listeningMode === "wake-word" ? (
            <>
              Say <em className="font-bold">&quot;Hey Timer&quot;</em>
            </>
          ) : (
            "What's your command?"
          )}
        </p>
      </div>
    </div>
  );
}
