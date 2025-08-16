"use client";

import { useTimerVoiceInput } from "@/hooks/useTimerVoiceInput";

export default function Home() {
  const { recognitionRef, isListening, setIsListening, timerSeconds } =
    useTimerVoiceInput();

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

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full p-3 rounded-md font-medium transition-colors ${
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Voice Recognition"}
      </button>
      <div>
        <p>{timerSeconds}</p>
      </div>
    </div>
  );
}
