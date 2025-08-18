import { useEffect, useRef, useState } from "react";

function useTimer() {
  const timerIntervalId = useRef<null | NodeJS.Timeout>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === null || prevSeconds <= 0) {
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      timerIntervalId.current = intervalId;
    }
  }, [isRunning]);

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsRunning(true);
  };

  const cancelTimer = () => {
    console.log("Cancel timer");
    if (timerIntervalId.current) {
      clearInterval(timerIntervalId.current);
      timerIntervalId.current = null;
      resetTimer();
    }
  };

  const resetTimer = () => {
    setTimerSeconds(null);
    setIsRunning(false);
  };

  return {
    timerSeconds,
    isRunning,
    setTimerSeconds,
    startTimer,
    cancelTimer,
    resetTimer,
  };
}

export { useTimer };
