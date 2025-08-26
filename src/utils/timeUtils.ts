export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Converts hours, minutes, and seconds to total seconds
export const timeToSeconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return hours * 3600 + minutes * 60 + seconds;
};
