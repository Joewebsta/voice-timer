import { useEffect, useRef, useState } from "react";

function useTimer() {
  const intervalIdRef = useRef<null | NodeJS.Timeout>(null);
  const hasLoggedEndRef = useRef(false);
  const timerAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const isPaused =
    !isRunning && remainingSeconds !== null && remainingSeconds > 0;

  useEffect(() => {
    if (!timerAudioRef.current) {
      timerAudioRef.current = new Audio("/audio/correct-answer-tone-2870.wav");
      // timerAudioRef.current = new Audio("/audio/confirmation-tone-2867.wav");
      // timerAudioRef.current = new Audio("/audio/digital-quick-tone-2866.wav");
      // timerAudioRef.current = new Audio(
      //   "/audio/software-interface-remove-2576.wav"
      // );
    }
  }, []);

  useEffect(() => {
    if (isRunning && remainingSeconds !== null && remainingSeconds > 0) {
      hasLoggedEndRef.current = false;
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          if (prevSeconds === null || prevSeconds <= 1) {
            if (
              prevSeconds !== null &&
              prevSeconds > 0 &&
              !hasLoggedEndRef.current
            ) {
              timerAudioRef.current?.play();
              hasLoggedEndRef.current = true;
            }
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      intervalIdRef.current = intervalId;
    } else if (!isRunning && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const startTimer = (durationInSeconds: number) => {
    setRemainingSeconds(durationInSeconds);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(null);
  };

  return {
    isRunning,
    isPaused,
    remainingSeconds,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  };
}

export { useTimer };
