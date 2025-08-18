import { useEffect, useRef, useState } from "react";

function useTimer() {
  const intervalIdRef = useRef<null | NodeJS.Timeout>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          if (prevSeconds === null || prevSeconds <= 0) {
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      intervalIdRef.current = intervalId;
    }
  }, [isRunning]);

  const startTimer = (durationInSeconds: number) => {
    setRemainingSeconds(durationInSeconds);
    setIsRunning(true);
  };

  const stopTimer = () => {
    console.log("Stopping timer");
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      resetTimer();
    }
  };

  const resetTimer = () => {
    setRemainingSeconds(null);
    setIsRunning(false);
  };

  return {
    remainingSeconds,
    isRunning,
    setRemainingSeconds,
    startTimer,
    stopTimer,
    resetTimer,
  };
}

export { useTimer };
