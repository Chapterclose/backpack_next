"use client"

import { useEffect, useState } from "react";

export default function CountdownProgressBar({ duration = 100 }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const progressPercent = (timeLeft / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
        <div
          className="bg-blue-500 h-6 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Countdown Text */}
      <p className="text-center mt-2 font-semibold text-lg">{timeLeft} sec left</p>
    </div>
  );
}
