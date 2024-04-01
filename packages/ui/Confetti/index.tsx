"use client";

import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

type ConfettiProps = {
  colors?: string[];
};

export const Confetti: React.FC<ConfettiProps> = ({
  colors = ["#7b4cfa", "#eee"],
}: {
  colors?: string[];
}) => {
  const { width, height } = useWindowSize();
  return <ReactConfetti width={width} height={height} colors={colors} numberOfPieces={400} recycle={false} />;
};
