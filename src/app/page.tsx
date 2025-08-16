"use client";

import { useEffect, useRef, useState } from "react";

function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const grammar = `
#JSGF V1.0;
grammar timer;
public
<timer> = (set | start | create) (a | an) timer for <number> <unit> | <number> <unit> timer | timer for <number> <unit>;
<number> = one | two | three | four | five | six | seven | eight | nine | ten | eleven | twelve | thirteen | fourteen | fifteen | sixteen | seventeen | eighteen | nineteen | twenty | thirty | forty | fifty | sixty | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 30 | 40 | 50 | 60;
<unit> = minute | minutes | second | seconds | hour | hours;
`;

    // Initialize speech recognition only on client side
    if (typeof window !== "undefined") {
      // Browser compatibility
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;

      if (SpeechRecognition && SpeechGrammarList) {
        const recognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onnomatch = () => {
          console.log("No match!");
        };

        recognition.onspeechend = (event: Event) => {
          recognition.stop();
          setIsListening(false);
          console.log("Speech recognition ended");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          // console.log("event", event);
          const duration = event.results[0][0].transcript;

          console.log("duration", duration);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  return {
    recognitionRef,
    isListening,
    setIsListening,
  };
}

export default function Home() {
  const { recognitionRef, isListening, setIsListening } =
    useSpeechRecognition();

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
    </div>
  );
}
