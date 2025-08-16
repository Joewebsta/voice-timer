import { useEffect, useRef, useState } from "react";

function useTimerVoiceInput() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  useEffect(() => {
    const grammar = `
#JSGF V1.0;
grammar timer;
public
<timer> = (set | start | create) (a | an) timer for <number> <unit> | <number> <unit> timer | timer for <number> <unit>;
<number> = one | two | three | four | five | six | seven | eight | nine | ten | eleven | twelve | thirteen | fourteen | fifteen | sixteen | seventeen | eighteen | nineteen | twenty | thirty | forty | fifty | sixty | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 30 | 40 | 50 | 60;
<unit> = minute | minutes | second | seconds | hour | hours;
`;

    // Initialize speech recognition only on client side
    if (typeof window !== "undefined") {
      // Browser compatibility
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;

      if (SpeechRecognition && SpeechGrammarList) {
        const recognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onnomatch = () => {
          console.log("No match!");
        };

        recognition.onspeechend = () => {
          recognition.stop();
          setIsListening(false);
          console.log("Speech recognition ended");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          console.log("transcript", transcript);

          const durationData = parseDuration(transcript);
          const totalSeconds =
            durationData.hours * 3600 +
            durationData.minutes * 60 +
            durationData.seconds;

          setTimerSeconds(totalSeconds);
          console.log("Total seconds:", totalSeconds);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  return {
    recognitionRef,
    timerSeconds,
    isListening,
    setIsListening,
  };
}

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

export { useTimerVoiceInput };
