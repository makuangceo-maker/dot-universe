"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function LightPage() {
  const [text, setText] = useState("");
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">

        <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">
            點金石
          </h1>

          <p className="mt-3 text-slate-300">
            分享今天的光點
          </p>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-600 p-10 text-center">
            📷 新增照片
          </div>

          <textarea
            className="mt-6 w-full rounded-xl bg-slate-800 p-4"
            rows={3}
            value={text}
           onChange={(e) => setText(e.target.value)} 
            placeholder="分享今天的光點（30字內）"
          />

          <button type="button"
         onClick={async () => {
  const { error } = await supabase.from("light_points").insert({
  employee_id: "A001",
  light_date: new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
}).format(new Date()),
  light_text: text,
});

  if (error) {
    alert(error.message);
    return;
  }

  alert("發布成功");
}}
          disabled={text.trim() === ""}
            className="mt-6 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900"
          >
            發布光點
          </button>

        </section>

      </div>
    </main>
  );
}