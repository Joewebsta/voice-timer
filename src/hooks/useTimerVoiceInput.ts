import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { parseDuration } from "@/utils/utils";

function useTimerVoiceInput() {
  const {
    remainingSeconds,
    isRunning,
    resetTimer,
    startTimer,
    stopTimer,
    setRemainingSeconds,
  } = useTimer();

  const handleVoiceInput = (transcript: string) => {
    const parsedDuration = parseDuration(transcript);
    const totalSeconds =
      parsedDuration.hours * 3600 +
      parsedDuration.minutes * 60 +
      parsedDuration.seconds;

    startTimer(totalSeconds);
  };

  const { speechRecognitionInstance, isListening, setIsListening } =
    useSpeechRecognition(handleVoiceInput);

  return {
    speechRecognitionInstance,
    remainingSeconds,
    isListening,
    isRunning,
    setIsListening,
    setRemainingSeconds,
    resetTimer,
    stopTimer,
  };
}

export { useTimerVoiceInput };
