import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTimer } from "@/hooks/useTimer";
import { parseDuration } from "@/utils/utils";

function useTimerVoiceInput() {
  const {
    timerSeconds,
    isRunning,
    resetTimer,
    startTimer,
    cancelTimer,
    setTimerSeconds,
  } = useTimer();

  const handleTranscript = (transcript: string) => {
    const durationData = parseDuration(transcript);
    const totalSeconds =
      durationData.hours * 3600 +
      durationData.minutes * 60 +
      durationData.seconds;

    startTimer(totalSeconds);
  };

  const { recognitionRef, isListening, setIsListening } =
    useSpeechRecognition(handleTranscript);

  return {
    recognitionRef,
    timerSeconds,
    isListening,
    isRunning,
    setIsListening,
    setTimerSeconds,
    resetTimer,
    cancelTimer,
  };
}

export { useTimerVoiceInput };
