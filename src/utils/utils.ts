function parseDuration(transcript: string) {
  const result = { hours: 0, minutes: 0, seconds: 0 };

  const wordMap: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    thirteen: "13",
    fourteen: "14",
    fifteen: "15",
    sixteen: "16",
    seventeen: "17",
    eighteen: "18",
    nineteen: "19",
    twenty: "20",
    thirty: "30",
    forty: "40",
    fifty: "50",
    sixty: "60",
  };

  let text = transcript.toLowerCase();

  Object.entries(wordMap).forEach(([word, num]) => {
    text = text.replace(new RegExp(`\\b${word}\\b`, "g"), num);
  });

  const hourMatch = text.match(/(\d+)\s*hours?/);
  const minuteMatch = text.match(/(\d+)\s*minutes?/);
  const secondMatch = text.match(/(\d+)\s*seconds?/);

  if (hourMatch) result.hours = parseInt(hourMatch[1]);
  if (minuteMatch) result.minutes = parseInt(minuteMatch[1]);
  if (secondMatch) result.seconds = parseInt(secondMatch[1]);

  return result;
}

export { parseDuration };
