"use client";

import { useTimerVoiceInput } from "@/hooks/useTimerVoiceInput";

export default function Home() {
  const {
    speechRecognitionInstance,
    isListening,
    setIsListening,
    isRunning,
    remainingSeconds,
    resetTimer,
    stopTimer,
  } = useTimerVoiceInput();

  const handleClick = async () => {
    if (speechRecognitionInstance.current) {
      if (isListening) {
        speechRecognitionInstance.current.stop();
        setIsListening(false);
        console.log("Stopped listening");
      } else {
        setIsListening(true);
        speechRecognitionInstance.current.start();
        console.log("Ready to receive a timer command.");
      }
    } else {
      console.log("Speech recognition not available");
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
