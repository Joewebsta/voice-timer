import { useState } from "react";

function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  const resetTimer = () => {
    setTimerSeconds(null);
    setIsRunning(false);
  };

  const startTimer = (seconds: number) => setTimerSeconds(seconds);

  return {
    timerSeconds,
    isRunning,
    setTimerSeconds,
    startTimer,
    resetTimer,
  };
}

export { useTimer };
