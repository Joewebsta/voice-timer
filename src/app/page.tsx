"use client";

import Silk from "@/app/components/ui/silk";
import TimeCounter from "@/app/components/ui/time-counter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
      className={`h-dvh flex justify-center items-center transition-colors duration-500 ease-in-out ${
        listeningMode === "wake-word" ? "bg-[#E8E8E8]" : "bg-[#4CBEB1]"
      }`}
    >
      <div className="w-full h-full relative">
        {/* Silk background animation */}
        <AnimatePresence>
          {listeningMode === "command" && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Silk
                speed={5}
                scale={0.8}
                color="#4CBEB1"
                noiseIntensity={1}
                rotation={0}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer content positioned absolutely over Silk */}
        <motion.div
          className="absolute inset-0 flex flex-col gap-6 justify-center items-center z-10 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
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
          </motion.div>
          <motion.div
            className="border-4 border-[#002F34] rounded-4xl relative flex flex-col items-center w-full h-9/10 sm:h-[700px] gap-6 max-w-5xl bg-[url(/forest-background.png)] bg-cover bg-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <div className="h-1/2 flex items-center justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
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
                  <motion.div
                    className="flex gap-4 absolute left-1/2 top-full transform -translate-x-1/2 mt-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
                  >
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
                  </motion.div>
                )}
              </motion.div>
            </div>
            <motion.button
              onClick={toggleSpeechRecognition}
              className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-fit p-2 sm:p-3 rounded-full font-medium transition-colors border-2 border-[#4CBEB1] cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            >
              {isListening ? (
                <Mic color="#4CBEB1" />
              ) : (
                <MicOff color="#4CBEB1" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
