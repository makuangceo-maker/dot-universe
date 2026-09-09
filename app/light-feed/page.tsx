import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function LightFeedPage() {
  const since24HoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: lightItems } = await supabase
    .from("light_points")
    .select("employee_id, light_text, light_photo, created_at")
    .gte("created_at", since24HoursAgo)
    .order("created_at", { ascending: false });

  const { data: players } = await supabase
    .from("players")
    .select("employee_id, name, job_title");

  const playerMap = new Map(
    (players ?? []).map((player) => [
      player.employee_id,
      player,
    ])
  );

  const feedItems = await Promise.all(
    (lightItems ?? [])
      .filter((item) => {
        const hasText =
          (item.light_text ?? "").trim() !== "" &&
          item.light_text !== "EMPTY";
        const hasPhoto = !!item.light_photo;

        return hasText || hasPhoto;
      })
      .map(async (item) => {
        let signedPhotoUrl: string | null = null;

        if (item.light_photo) {
          const marker =
            "/storage/v1/object/public/light-photos/";

          const photoPath = item.light_photo.includes(marker)
            ? item.light_photo.split(marker)[1]
            : null;

          if (photoPath) {
            const { data } = await supabaseServer.storage
              .from("light-photos")
              .createSignedUrl(photoPath, 60 * 60);

            signedPhotoUrl = data?.signedUrl ?? null;
          }
        }

        const person = playerMap.get(item.employee_id);

        return {
          ...item,
          signedPhotoUrl,
          displayName:
            person?.name || person?.job_title || "夥伴",
        };
      })
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-slate-300"
          >
            ← 回首頁
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            📷 24小時光點動態
          </h1>

          <p className="mt-2 text-slate-300">
            看看夥伴此刻點亮了什麼
          </p>
        </div>

        {feedItems.length === 0 ? (
          <section className="rounded-[28px] border border-white/10 bg-white/10 p-6">
            <p className="text-lg font-semibold">
              此刻宇宙很安靜 ✨
            </p>
            <p className="mt-2 text-slate-300">
              最近 24 小時還沒有新的光點。
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            {feedItems.map((item, index) => (
              <section
                key={`${item.created_at ?? "light"}-${index}`}
                className="rounded-[28px] border border-white/10 bg-white/10 p-6"
              >
                <p className="mb-3 text-sm text-slate-400">
                  ✨ {item.displayName}
                </p>

                {item.signedPhotoUrl && (
                  <img
                    src={item.signedPhotoUrl}
                    alt="24小時光點動態"
                    className="w-full rounded-2xl object-cover"
                  />
                )}

                {item.light_text &&
                  item.light_text.trim() !== "" &&
                  item.light_text !== "EMPTY" && (
                    <p className="mt-4 text-lg text-slate-100">
                      {item.light_text}
                    </p>
                  )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}