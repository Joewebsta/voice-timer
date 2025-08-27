"use client";

import TimeCounter from "@/app/components/ui/time-counter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Mic, MicOff } from "lucide-react";

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

  const timerActions = {
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  };

  const { handleVoiceInput } = useVoiceCommands(timerActions);

  const { isListening, listeningMode, startListening, stopListening } =
    useSpeechRecognition(handleVoiceInput);

  useDocumentTitle(remainingSeconds);

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      className={`h-dvh flex justify-center items-center p-4 transition-colors duration-500 ease-in-out ${
        listeningMode === "wake-word" ? "bg-[#E8E8E8]" : "bg-[#4CBEB1]"
      }`}
    >
      <div className="w-full h-full flex flex-col gap-6 justify-center items-center">
        <div className="flex items-center justify-center">
          <p
            key={listeningMode}
            className="text-lg font-bold text-[#002F34] animate-fade-in"
          >
            {listeningMode === "wake-word" ? (
              <>Say &quot;Hey Timer&quot;</>
            ) : (
              "What's your command?"
            )}
          </p>
        </div>
        <div className="border-4 border-[#002F34] rounded-4xl  relative flex flex-col items-center w-full h-9/10 sm:h-[700px] gap-6 max-w-5xl bg-[url(/forest-background.png)] bg-cover bg-center">
          <div className="h-1/2 flex items-center justify-center">
            <div className="relative">
              <TimeCounter
                seconds={remainingSeconds ?? 0}
                fontSize={40}
                padding={5}
                gap={10}
                textColor="black"
                fontWeight={900}
                counterStyle={{
                  fontSize: "clamp(24px, 4vw + 16px, 80px)",
                }}
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
          <button
            onClick={toggleSpeechRecognition}
            className={` absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-fit p-2 sm:p-3 rounded-full font-medium transition-colors border-2 border-[#4CBEB1] cursor-pointer`}
          >
            {isListening ? <Mic color="#4CBEB1" /> : <MicOff color="#4CBEB1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
