import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function Home() {
 const { data: players, error } = await supabase
  .from("players")
  .select("*");
 const player = players?.[0];
const displayName = player?.job_title || player?.name || "玩家";
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
const validLightItems = [...validItems]
  .filter((item) => item.created_at)
  .sort(
    (a, b) =>
      new Date(a.created_at!).getTime() -
      new Date(b.created_at!).getTime()
  );

const effectiveLightItems: typeof validLightItems = [];
let lastEffectiveAt: number | null = null;

for (const item of validLightItems) {
  const createdAtMs = new Date(item.created_at!).getTime();

  if (
    lastEffectiveAt === null ||
    createdAtMs - lastEffectiveAt >= 60 * 60 * 1000
  ) {
    effectiveLightItems.push(item);
    lastEffectiveAt = createdAtMs;
  }
}

const lightPointCount = effectiveLightItems.length;

const validDateSet = new Set(
  validItems
    .map((item) => item.light_date)
    .filter((date): date is string => !!date)
);
 const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
const { data: allLightPoints } = await supabase
  .from("light_points")
  .select("employee_id, light_text, light_photo, created_at")
  .order("created_at", { ascending: true });

const lightCountByEmployee = new Map<string, number>();
const lastValidAtByEmployee = new Map<string, number>();

for (const item of allLightPoints ?? []) {
  const employeeId = item.employee_id;
  if (!employeeId || !item.created_at) continue;

  const hasText =
    (item.light_text ?? "").trim() !== "" &&
    item.light_text !== "EMPTY";
  const hasPhoto = !!item.light_photo;

  if (!hasText && !hasPhoto) continue;

  const createdAtMs = new Date(item.created_at).getTime();
  const lastValidAt = lastValidAtByEmployee.get(employeeId);

  if (
    lastValidAt !== undefined &&
    createdAtMs - lastValidAt < 60 * 60 * 1000
  ) {
    continue;
  }

  lightCountByEmployee.set(
    employeeId,
    (lightCountByEmployee.get(employeeId) ?? 0) + 1
  );

  lastValidAtByEmployee.set(employeeId, createdAtMs);
}

const rankedPlayers = (players ?? [])
  .map((person) => ({
    ...person,
   lightCount: lightCountByEmployee.get(person.employee_id) ?? 0,
  }))
  .sort((a, b) => b.lightCount - a.lightCount)
  .slice(0, 10);
 const universeLightCount = Array.from(lightCountByEmployee.values()).reduce((sum, count) => sum + count, 0);

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
let maxStreakDays = 0;
let currentStreak = 0;
let previousDate: Date | null = null;

const sortedDates = Array.from(dateSet).sort();

for (const date of sortedDates) {
  const currentDate = new Date(`${date}T00:00:00Z`);

  if (previousDate) {
    const diffDays =
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

    currentStreak = diffDays === 1 ? currentStreak + 1 : 1;
  } else {
    currentStreak = 1;
  }

  maxStreakDays = Math.max(maxStreakDays, currentStreak);
  previousDate = currentDate;
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

const currentPoints = lightPointCount ?? 0;
const currentStageIndex = planetStages.findIndex(
  (stage) => currentPoints >= stage.min
);
const currentStage =
  planetStages[currentStageIndex] ?? planetStages[planetStages.length - 1];
const nextStage =
  currentStageIndex > 0 ? planetStages[currentStageIndex - 1] : null;
const currentPlanet = currentStage.name;
const highestUnlockedPlanet =
  planetStages.find(
    (stage) => (rankedPlayers[0]?.lightCount ?? 0) >= stage.min
  )?.name || "初始隕石";
const upgradeProgress = nextStage
  ? Math.min(
      ((currentPoints - currentStage.min) /
        (nextStage.min - currentStage.min)) *
        100,
      100
    )
  : 100;

const pointsToNextStage = nextStage
  ? Math.max(nextStage.min - currentPoints, 0)
  : 0;const stats = [
  { label: "累積光點", value: lightPointCount?.toString() || "0", icon: "✨" },
{ label: "目前星球", value: currentPlanet, icon: "🌍" },
{ label: "累積點光天數", value: `${dateSet.size} 天`, icon: "🔥" },
{ label: "金豆豆", value: goldBeanCount.toString(), icon: "🟢" },
];
const yearEndRewards = [
  {
    level: "原子大師",
    minBeans: 45,
    minDays: 300,
reward: "任選於台灣舉辦之熱門演唱會門票 2 張（依官方票面價格全額實支實付；黃牛票、加價轉售票及代購溢價不予核銷）",
  },
  {
    level: "習慣定型",
    minBeans: 20,
    minDays: 180,
    reward: "雙人頂級奢華大餐 2 客（NT$ 10,000 元以內實支實付）",
  },
  {
    level: "習慣啟動",
    minBeans: 10,
    minDays: 50,
    reward: "雙人電影票 或 藝文活動門票 2 張（NT$ 2,000 元以內實支實付）",
  },
];
const yearEndReward =
  yearEndRewards.find(
    (item) =>
      goldBeanCount >= item.minBeans ||
      dateSet.size >= item.minDays
  ) ?? null;

const unlockedBenefits = [
  { days: 15, name: "日常充電｜星巴克特大杯咖啡券" },
  { days: 30, name: "絕對人性｜少輪一次晚班" },
  { days: 60, name: "排班自由｜指定特殊日優先畫假券" },
  { days: 90, name: "彈性呼吸｜自由換假券一天" },
].filter((benefit) => (
  benefit.days === 90
    ? dateSet.size >= 90
    : maxStreakDays >= benefit.days
));
return (
  <main className="min-h-screen bg-slate-950 text-slate-100">      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
        <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm text-amber-300">
            每天一點點，宇宙終將被點亮
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
歡迎回來，{displayName}
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
  <h2 className="text-xl font-semibold">🎁 我的福利小確幸</h2>

  {unlockedBenefits.length === 0 ? (
    <p className="mt-4 text-slate-300">
     持續點光，連續 15 天即可解鎖第一個小確幸。
    </p>
  ) : (
    <div className="mt-4 space-y-3">
      {unlockedBenefits.map((benefit) => (
        <div
          key={benefit.days}
          className="rounded-2xl bg-slate-900/70 p-4"
        >
          <p className="font-semibold text-lime-300">
          {benefit.days === 90 ? "累積" : "連續"} {benefit.days} 天解鎖
          </p>
          <p className="mt-1 text-white">{benefit.name}</p>
        </div>
      ))}
    </div>
  )}
</section>
       <section className="mt-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
  <h2 className="text-xl font-semibold">🏆 年終雙賽道</h2>

  {yearEndReward ? (
    <div className="mt-4 rounded-2xl bg-slate-900/70 p-4">
      <p className="font-semibold text-lime-300">
        {yearEndReward.level}
      </p>
      <p className="mt-1 text-white">
        {yearEndReward.reward}
      </p>
      <p className="mt-2 text-sm text-slate-300">
        金豆豆達 {yearEndReward.minBeans} 顆，或累積點光達 {yearEndReward.minDays} 天即可取得；若同時達成多級，只取最高獎勵。
      </p>
    </div>
  ) : (
    <p className="mt-4 text-slate-300">
      年底依金豆豆或累積點光天數擇優判定，目前尚未達第一階段獎勵。
    </p>
  )}
</section>  <section className="mt-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
  <h2 className="text-xl font-semibold">全宇宙光點統計</h2>
  <p className="mt-5 text-sm text-slate-400">🌌 全宇宙累積光點</p>
  <p className="mt-2 text-3xl font-semibold text-white">
    {universeLightCount ?? 0}
  </p>
</section>
<section className="mt-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
  <h2 className="text-xl font-semibold">🚩 高光時刻插旗榜</h2>
  <p className="mt-2 text-sm text-slate-400">
  全宇宙光點 Top 10
</p>

  <div className="mt-4 space-y-2">
    {rankedPlayers.map((person, index) => (
      <div
        key={person.employee_id}
        className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
      >
       <span>
  🚩 {index + 1}. {person.name || "玩家"}｜{person.job_title || "夥伴"}｜{planetStages.find((stage) => person.lightCount >= stage.min)?.name || "初始隕石"}
</span>
        <span className="text-slate-300">{person.lightCount} 光點</span>
      </div>
    ))}
  </div>
</section>

<section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-white">升級進度</h2>
   <span className="text-sm font-semibold text-lime-300">
{Math.round(upgradeProgress)}%</span>
  </div>

  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
  <div
  className="h-full rounded-full bg-lime-400"
style={{ width: `${upgradeProgress}%` }}></div>
  </div>

  <p className="mt-3 text-slate-300">
距離下一顆星還差 {pointsToNextStage} 光點  </p>
</section>
      </div>
    </main>
  );
}