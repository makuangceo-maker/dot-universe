export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">24小時光點動態</h1>
          <p className="mt-4 text-slate-300">
            ✨ 光點載入中…
          </p>
        </section>
      </div>
    </main>
  );
}