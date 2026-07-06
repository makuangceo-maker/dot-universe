export default function Home() {
  const stats = [
    { label: "累積光點", value: "3", icon: "✨" },
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
            歡迎回來，玲玲
          </h1>
          <p className="mt-4 text-lg text-slate-300">今天還沒點亮光點</p>
          <button className="mt-5 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300">
            立即點光
          </button>
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
      </div>
    </main>
  );
}