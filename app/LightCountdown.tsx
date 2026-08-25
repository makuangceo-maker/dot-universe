"use client";

import { useEffect, useState } from "react";

export default function LightCountdown({
  lastLightAt,
}: {
  lastLightAt: string;
}) {
  const getMinutesLeft = () => {
    const elapsed =
      (Date.now() - new Date(lastLightAt).getTime()) / 1000 / 60;

    return Math.max(0, Math.ceil(60 - elapsed));
  };

  const [minutesLeft, setMinutesLeft] = useState(getMinutesLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutesLeft(getMinutesLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [lastLightAt]);

  if (minutesLeft <= 0) return null;

  return (
    <p className="mt-2 text-sm text-amber-300">
      還需等待 {minutesLeft} 分鐘才能再次點光
    </p>
  );
}