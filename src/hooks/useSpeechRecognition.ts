import { useEffect, useRef, useState } from "react";
interface VoiceTranscriptHandler {
  (transcript: string): void;
}

function useSpeechRecognition(onTranscriptReceived: VoiceTranscriptHandler) {
  const speechRecognitionInstance = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;

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

  const startListening = () => {
    if (speechRecognitionInstance.current) {
      setIsListening(true);
      speechRecognitionInstance.current.start();
      console.log("Ready to receive a timer command.");
    } else {
      console.log("Speech recognition not available");
    }
  };

  const stopListening = () => {
    if (speechRecognitionInstance.current) {
      speechRecognitionInstance.current.stop();
      setIsListening(false);
      console.log("Stopped listening");
    }
  };

  return {
    isListening,
    speechRecognitionInstance,
    recognitionError,
    startListening,
    stopListening,
  };
}

export { useSpeechRecognition };
