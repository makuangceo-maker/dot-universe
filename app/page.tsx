export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-8 shadow-2xl">
          <p className="mb-3 text-sm text-yellow-300">
            每天一點點，宇宙終將被點亮。
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            歡迎回來，蕭玲玲
          </h1>

          <div className="mt-8 rounded-2xl bg-white/10 p-6">
            <p className="text-lg text-slate-200">今天還沒點亮光點</p>
            <button className="mt-4 rounded-full bg-yellow-400 px-6 py-3 font-bold text-slate-950 hover:bg-yellow-300">
              立即點光
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-6">
            <h2 className="mb-5 text-2xl font-bold">我的銀河流量</h2>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">✨ 累積光點</p>
                <p className="mt-1 text-3xl font-bold">3</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🌍 目前星球</p>
                <p className="mt-1 text-3xl font-bold">希望星</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🏅 目前稱號</p>
                <p className="mt-1 text-2xl font-bold">馬光希望小星星</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🔥 連續點光天數</p>
                <p className="mt-1 text-3xl font-bold">1 天</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🪙 金豆豆</p>
                <p className="mt-1 text-3xl font-bold">1</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white/10 p-6">
              <h2 className="text-2xl font-bold">升級進度</h2>
              <p className="mt-4 text-slate-300">距離下一顆星還差 97 光點</p>

              <div className="mt-5 h-4 rounded-full bg-slate-800">
                <div className="h-4 w-[3%] rounded-full bg-yellow-400" />
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <h2 className="text-2xl font-bold">全宇宙累積光點</h2>
              <p className="mt-4 text-5xl font-bold text-yellow-300">3</p>
            </div>

            <button className="rounded-3xl border border-yellow-300 px-6 py-5 text-xl font-bold text-yellow-300 hover:bg-yellow-300 hover:text-slate-950">
              星球地圖
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}