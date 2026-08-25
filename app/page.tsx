import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function Home() {
 const { data: players, error } = await supabase
  .from("players")
  .select("*");
 const player = players?.[0];
const { data: validLightPoints, error: lightPointError } = await supabase
  .from("light_points")
.select("light_text, light_photo, light_date, created_at")
  .eq("employee_id", player?.employee_id ?? "");

const validItems = (validLightPoints ?? []).filter((item) => {
  const hasText =
    (item.light_text ?? "").trim() !== "" &&
    item.light_text !== "EMPTY";
  const hasPhoto = !!item.light_photo;

  return hasText || hasPhoto;
});
const latestValidItem = [...validItems]
  .filter((item) => item.created_at)
  .sort(
    (a, b) =>
      new Date(b.created_at!).getTime() -
      new Date(a.created_at!).getTime()
  )[0];

const lastLightAt = latestValidItem?.created_at
  ? new Date(latestValidItem.created_at)
  : null;

const minutesSinceLastLight = lastLightAt
  ? (Date.now() - lastLightAt.getTime()) / 1000 / 60
  : Infinity;

const canLightNow = minutesSinceLastLight >= 60;

const minutesUntilNextLight = canLightNow
  ? 0
  : Math.ceil(60 - minutesSinceLastLight);
const lightPointCount = validItems.length;

const validDateSet = new Set(
  validItems
    .map((item) => item.light_date)
    .filter((date): date is string => !!date)
);
 const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
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
const dateSet = validDateSet;
const weeklyDateCounts = new Map<string, number>();

for (const date of validDateSet) {
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  d.setUTCDate(d.getUTCDate() + diffToMonday);

  const weekStart = d.toISOString().split("T")[0];

  weeklyDateCounts.set(
    weekStart,
    (weeklyDateCounts.get(weekStart) ?? 0) + 1
  );
}

const goldBeanCount = Array.from(weeklyDateCounts.values()).filter(
  (days) => days >= 3
).length;
let streakDays = 0;
let checkDate = today;

while (dateSet.has(checkDate)) {
  streakDays += 1;
  const d = new Date(`${checkDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  checkDate = d.toISOString().split("T")[0];
}
const planetStages = [
  { min: 300, name: "點宇宙至尊" },
  { min: 240, name: "銀河星雲" },
  { min: 180, name: "深邃海王" },
  { min: 120, name: "璀璨晶星" },
  { min: 50, name: "烈焰巨星" },
  { min: 10, name: "萌芽綠星" },
  { min: 0, name: "初始隕石" },
];

const currentPlanet =
  planetStages.find((stage) => lightPointCount >= stage.min)?.name ??
  "初始隕石";
const stats = [
  { label: "累積光點", value: lightPointCount?.toString() || "0", icon: "✨" },
{ label: "目前星球", value: currentPlanet, icon: "🌍" },
{ label: "累積點光天數", value: `${dateSet.size} 天`, icon: "🔥" },
{ label: "金豆豆", value: goldBeanCount.toString(), icon: "🟢" },
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
{canLightNow ? (
  <Link
    href="/light"
    className="inline-block mt-5 rounded-xl bg-amber-400 px-10 py-3 font-semibold text-slate-900"
  >
    立即點光
  </Link>
) : (
  <div className="mt-5">
    <button
      disabled
      className="rounded-xl bg-slate-600 px-10 py-3 font-semibold text-slate-300 cursor-not-allowed"
    >
      尚未滿一小時
    </button>

</div>
)}

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