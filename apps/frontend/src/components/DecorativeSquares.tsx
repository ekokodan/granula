import React from "react";

interface DecorativeSquaresProps {
  className?: string;
  color?: "gold" | "white";
  opacity?: number; // base opacity 0..1
}

// Simple decorative motif: a 3x3 cluster of outlined squares with subtle opacity variation
export const DecorativeSquares: React.FC<DecorativeSquaresProps> = ({
  className = "",
  color = "gold",
  opacity = 0.3,
}) => {
  const base = color === "white" ? "border-white" : "border-brand-gold";
  const squares = Array.from({ length: 9 });
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute grid grid-cols-3 gap-6 ${className}`}
      style={{ opacity }}
    >
      {squares.map((_, i) => (
        <div
          key={i}
          className={`h-16 w-16 rounded-sm border ${base}`}
          style={{ opacity: 0.4 + ((i % 3) * 0.2) }}
        />
      ))}
    </div>
  );
};

export default DecorativeSquares;
