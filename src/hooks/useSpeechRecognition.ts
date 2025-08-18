import { useEffect, useRef, useState } from "react";

const TIMER_SPEECH_GRAMMAR_CONFIG = {
  grammar: `#JSGF V1.0; grammar timer; public <timer> = (set | start | create) (a | an) timer for <number> <unit> | <number> <unit> timer | timer for <number> <unit>; <number> = one | two | three | four | five | six | seven | eight | nine | ten | eleven | twelve | thirteen | fourteen | fifteen | sixteen | seventeen | eighteen | nineteen | twenty | thirty | forty | fifty | sixty | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 30 | 40 | 50 | 60; <unit> = minute | minutes | second | seconds | hour | hours;`,
  language: "en-US",
  maxAlternatives: 1,
} as const;

interface VoiceTranscriptHandler {
  (transcript: string): void;
}

function useSpeechRecognition(onTranscriptReceived: VoiceTranscriptHandler) {
  const speechRecognitionInstance = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Browser compatibility
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;

      if (SpeechRecognition && SpeechGrammarList) {
        const recognitionInstance = new SpeechRecognition();
        const grammarList = new SpeechGrammarList();
        grammarList.addFromString(TIMER_SPEECH_GRAMMAR_CONFIG.grammar, 1);
        recognitionInstance.grammars = grammarList;
        recognitionInstance.continuous = false;
        recognitionInstance.lang = TIMER_SPEECH_GRAMMAR_CONFIG.language;
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives =
          TIMER_SPEECH_GRAMMAR_CONFIG.maxAlternatives;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const recognizedText = event.results[0][0].transcript;
          onTranscriptReceived(recognizedText);
          console.log("Recognized text:", recognizedText);
        };

        recognitionInstance.onnomatch = () => {
          console.log("No speech match found");
        };

        recognitionInstance.onspeechend = () => {
          console.log("Speech recognition session ended");
          recognitionInstance.stop();
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          setRecognitionError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        speechRecognitionInstance.current = recognitionInstance;
      }
    }

    return () => {
      if (speechRecognitionInstance.current) {
        speechRecognitionInstance.current.stop();
        speechRecognitionInstance.current.abort();
      }

      speechRecognitionInstance.current = null;
    };
  }, [onTranscriptReceived]);

  return {
    speechRecognitionInstance,
    isListening,
    recognitionError,
    setIsListening,
  };
}

export { useSpeechRecognition };
