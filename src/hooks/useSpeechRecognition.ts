import { useEffect, useRef, useState } from "react";
interface VoiceTranscriptHandler {
  (transcript: string): void;
}

type ListeningMode = "wake-word" | "command";

function useSpeechRecognition(onTranscriptReceived: VoiceTranscriptHandler) {
  const speechRecognitionInstance = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");
  const [listeningMode, setListeningMode] =
    useState<ListeningMode>("wake-word");

  const isListeningRef = useRef(isListening);
  const listeningModeRef = useRef(listeningMode);

  useEffect(() => {
    listeningModeRef.current = listeningMode;
  }, [listeningMode]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const results = event.results;
          const lastResult = results[results.length - 1];

          if (lastResult.isFinal) {
            const recognizedText = lastResult[0].transcript.toLowerCase();
            console.log("lastResult", recognizedText);

            if (listeningModeRef.current === "wake-word") {
              if (recognizedText.includes("hey timer")) {
                console.log("Wake word detected - transition to command mode");
                setListeningMode("command");
                // Optional: Play feedback sound
              }
            } else if (listeningModeRef.current === "command") {
              console.log("Command detected - process the command");
              console.log("recognizedText", recognizedText);
              onTranscriptReceived(recognizedText);
              setListeningMode("wake-word");
            }
          }
        };

        recognitionInstance.onend = () => {
          console.log("Recognition ended");
          if (isListeningRef.current) {
            setTimeout(() => {
              recognitionInstance.start();
            }, 100);
          }
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
  }, [onTranscriptReceived, listeningMode, isListening]);

  const startListening = () => {
    if (speechRecognitionInstance.current) {
      setIsListening(true);
      speechRecognitionInstance.current.start();
      console.log("Started continuous listening for wake word");
    }
  };

  const stopListening = () => {
    if (speechRecognitionInstance.current) {
      setIsListening(false);
      speechRecognitionInstance.current.stop();
      speechRecognitionInstance.current.abort();
      console.log("Stopped continuous listening");
    }
  };

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
