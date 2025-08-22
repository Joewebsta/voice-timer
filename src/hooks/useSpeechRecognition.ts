import { useEffect, useRef, useState, useCallback } from "react";
interface VoiceTranscriptHandler {
  (transcript: string): void;
}

type ListeningMode = "wake-word" | "command";

function useSpeechRecognition(onTranscriptReceived: VoiceTranscriptHandler) {
  const speechRecognitionInstance = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(true);
  const [recognitionError, setRecognitionError] = useState("");
  const [listeningMode, setListeningMode] =
    useState<ListeningMode>("wake-word");

  const startListening = useCallback(() => {
    if (speechRecognitionInstance.current) {
      setIsListening(true);
      speechRecognitionInstance.current.start();
      console.log("Started continuous listening for wake word");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (speechRecognitionInstance.current) {
      setIsListening(false);
      speechRecognitionInstance.current.stop();
      speechRecognitionInstance.current.abort();
      console.log("Stopped continuous listening");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 1;

        speechRecognitionInstance.current = recognitionInstance;

        setIsListening(true);
        recognitionInstance.start();
        console.log("Started continuous listening for wake word");
      }
    }

    return () => {
      if (speechRecognitionInstance.current) {
        speechRecognitionInstance.current.onresult = null;
        speechRecognitionInstance.current.onend = null;
        speechRecognitionInstance.current.onerror = null;
        speechRecognitionInstance.current.stop();
        speechRecognitionInstance.current.abort();
      }

      speechRecognitionInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = speechRecognitionInstance.current;
    if (!instance) return;

    instance.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];

      if (lastResult.isFinal) {
        const recognizedText = lastResult[0].transcript.toLowerCase();
        console.log("Recognized text:", recognizedText);

        if (listeningMode === "wake-word") {
          if (recognizedText.includes("hey timer")) {
            console.log("Wake word detected - transition to command mode");
            setListeningMode("command");
          }
        } else if (listeningMode === "command") {
          console.log("Command detected - process the command");
          onTranscriptReceived(recognizedText);
          setListeningMode("wake-word");
        }
      }
    };

    instance.onend = () => {
      console.log("Recognition ended");
      if (isListening) {
        setTimeout(() => {
          instance.start();
        }, 100);
      }
    };

    instance.onerror = (event) => {
      setRecognitionError(`Speech recognition error: ${event.error}`);
    };
  }, [isListening, listeningMode, onTranscriptReceived]);

  return {
    isListening,
    listeningMode,
    speechRecognitionInstance,
    recognitionError,
    startListening,
    stopListening,
  };
}

export { useSpeechRecognition };
