import Counter from "./counter";

interface TimeCounterProps {
  seconds: number;
  fontSize?: number;
  padding?: number;
  gap?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function TimeCounter({
  seconds,
  fontSize = 80,
  padding = 5,
  gap = 10,
  textColor = "black",
  fontWeight = 900,
  containerStyle,
  counterStyle,
  digitStyle,
  topGradientStyle,
  bottomGradientStyle,
}: TimeCounterProps) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: gap,
    fontFamily: "var(--font-outfit)",
  };

  const colonStyle: React.CSSProperties = {
    fontSize,
    color: textColor,
    fontWeight,
    lineHeight: 1,
  };

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      {/* Hours */}
      <Counter
        value={hours}
        places={[10, 1]}
        fontSize={fontSize}
        padding={padding}
        gap={gap}
        textColor={textColor}
        fontWeight={fontWeight}
        counterStyle={counterStyle}
        digitStyle={digitStyle}
        topGradientStyle={topGradientStyle}
        bottomGradientStyle={bottomGradientStyle}
      />

      {/* Colon */}
      <span style={colonStyle}>:</span>

      {/* Minutes */}
      <Counter
        value={minutes}
        places={[10, 1]}
        fontSize={fontSize}
        padding={padding}
        gap={gap}
        textColor={textColor}
        fontWeight={fontWeight}
        counterStyle={counterStyle}
        digitStyle={digitStyle}
        topGradientStyle={topGradientStyle}
        bottomGradientStyle={bottomGradientStyle}
      />

      {/* Colon */}
      <span style={colonStyle}>:</span>

      {/* Seconds */}
      <Counter
        value={remainingSeconds}
        places={[10, 1]}
        fontSize={fontSize}
        padding={padding}
        gap={gap}
        textColor={textColor}
        fontWeight={fontWeight}
        counterStyle={counterStyle}
        digitStyle={digitStyle}
        topGradientStyle={topGradientStyle}
        bottomGradientStyle={bottomGradientStyle}
      />
    </div>
  );
}
