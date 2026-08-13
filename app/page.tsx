import { supabase } from "@/lib/supabase";
import Link from "next/link";
export default async function Home() {
 const { data: players, error } = await supabase
  .from("players")
  .select("*");
 const player = players?.[0];
 const { count: lightPointCount, error: lightPointError } = await supabase
 .from("light_points")
.select("*", { count: "exact", head: true })
.eq("employee_id", player?.employee_id ?? "");
 const today = new Date().toISOString().split("T")[0];
const { count: universeLightCount } = await supabase
  .from("light_points")
  .select("*", { count: "exact", head: true });
const { count: todayLightCount } = await supabase
 .from("light_points")
 
  .select("*", { count: "exact", head: true })
  .eq("employee_id", player?.employee_id ?? "").eq("light_date", today); 
console.log("players:", players, "error:", error);
 console.log("lightPointCount =", lightPointCount);
console.log("todayLightCount =", todayLightCount);
  const stats = [
    { label: "累積光點", value: lightPointCount?.toString() || "0", icon: "✨" },
    { label: "目前星球", value: "希望星", icon: "🌍" },
    { label: "目前稱號", value: "馬光希望小星星", icon: "🏅" },
    { label: "連續點光天數", value: "1 天", icon: "🔥" },
    { label: "金豆豆", value: "1", icon: "🪙" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
        <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm text-amber-300">
            每天一點點，宇宙終將被點亮
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
           歡迎回來，{player?.name || "玩家"}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
  {(todayLightCount ?? 0) > 0 ? "今天已點亮光點 ✨" : "今天還沒點亮光點"}
</p>
          <Link href="/light" className="inline-block mt-5 rounded-xl bg-amber-400 px-10 py-3 font-semibold text-slate-950"> 
          
         立即點光
          </Link>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
          <h2 className="text-xl font-semibold">我的銀河流量</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">{item.icon} {item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
  <h2 className="text-xl font-semibold">全宇宙光點統計</h2>
  <p className="mt-5 text-sm text-slate-400">🌌 全宇宙累積光點</p>
  <p className="mt-2 text-3xl font-semibold text-white">
    {universeLightCount ?? 0}
  </p>
</section>
       <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-white">升級進度</h2>
   <span className="text-sm font-semibold text-lime-300">
  {Math.min(((lightPointCount ?? 0) / 20) * 100, 100)}%
</span>
  </div>

  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
  <div
  className="h-full rounded-full bg-lime-400"
  style={{ width: `${Math.min(lightPointCount ?? 0, 100)}%` }}
></div>
  </div>

  <p className="mt-3 text-slate-300">
    距離下一顆星還差 {Math.max(20 - (lightPointCount ?? 0), 0)} 光點
  </p>
</section>
      </div>
    </main>
  );
}