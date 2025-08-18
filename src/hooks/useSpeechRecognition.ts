import { useEffect, useRef, useState } from "react";

const SPEECH_CONFIG = {
  grammar: `#JSGF V1.0; grammar timer; public <timer> = (set | start | create) (a | an) timer for <number> <unit> | <number> <unit> timer | timer for <number> <unit>; <number> = one | two | three | four | five | six | seven | eight | nine | ten | eleven | twelve | thirteen | fourteen | fifteen | sixteen | seventeen | eighteen | nineteen | twenty | thirty | forty | fifty | sixty | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 30 | 40 | 50 | 60; <unit> = minute | minutes | second | seconds | hour | hours;`,
  language: "en-US",
  maxAlternatives: 1,
} as const;

interface OnTranscriptCallback {
  (transcript: string): void;
}

function useSpeechRecognition(onTranscript: OnTranscriptCallback) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Browser compatibility
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;

      if (SpeechRecognition && SpeechGrammarList) {
        const recognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(SPEECH_CONFIG.grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = SPEECH_CONFIG.language;
        recognition.interimResults = false;
        recognition.maxAlternatives = SPEECH_CONFIG.maxAlternatives;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          console.log("transcript", transcript);
        };

        recognition.onnomatch = () => {
          console.log("No match!");
        };

        recognition.onspeechend = () => {
          console.log("Speech recognition ended");
          recognition.stop();
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      recognitionRef.current = null;
    };
  }, [onTranscript]);

  return {
    recognitionRef,
    isListening,
    error,
    setIsListening,
  };
}

export { useSpeechRecognition };
