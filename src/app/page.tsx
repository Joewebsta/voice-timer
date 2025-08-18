"use client";

import { useTimerVoiceInput } from "@/hooks/useTimerVoiceInput";
import { useEffect, useRef } from "react";

export default function Home() {
  const timerIntervalId = useRef<null | NodeJS.Timeout>(null);

  const {
    recognitionRef,
    isListening,
    setIsListening,
    setTimerSeconds,
    isRunning,
    timerSeconds,
    resetTimer,
  } = useTimerVoiceInput();

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      timerIntervalId.current = intervalId;
    }
  }, [isRunning, setTimerSeconds]);

  const handleClick = async () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log("Stopped listening");
      } else {
        setIsListening(true);
        recognitionRef.current.start();
        console.log("Ready to receive a timer command.");
      }
    } else {
      console.log("Speech recognition not available");
    }
  };

  const handleCancelTimer = () => {
    console.log("Cancel timer");
    if (timerIntervalId.current) {
      clearInterval(timerIntervalId.current);
      timerIntervalId.current = null;
      resetTimer();
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
            onClick={handleCancelTimer}
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
        <p>{timerSeconds}</p>
      </div>
    </div>
  );
}
