import { useEffect, useRef, useState } from "react";

function useTimer() {
  const intervalIdRef = useRef<null | NodeJS.Timeout>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const isPaused =
    !isRunning && remainingSeconds !== null && remainingSeconds > 0;

  useEffect(() => {
    if (isRunning && remainingSeconds !== null && remainingSeconds > 0) {
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          if (prevSeconds === null || prevSeconds <= 1) {
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
  }, [isRunning, remainingSeconds]);

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
