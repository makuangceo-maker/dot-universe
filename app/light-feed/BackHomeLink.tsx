"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BackHomeLink() {
  const [isReturning, setIsReturning] = useState(false);
  const router = useRouter();

  function handleBackHome() {
    if (isReturning) return;
    setIsReturning(true);
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleBackHome}
      disabled={isReturning}
      className="text-sm text-slate-300 disabled:cursor-wait"
    >
      {isReturning ? "← 返回中…" : "← 回首頁"}
    </button>
  );
}