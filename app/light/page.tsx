"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function LightPage() {
const [text, setText] = useState("");
const [photo, setPhoto] = useState<File | null>(null); 
const [isSubmitting, setIsSubmitting] = useState(false);
const router = useRouter();
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

          <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-600 p-10 text-center">
  📷 新增照片
 <input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
/>
</label>
{photo && <p className="mt-2 text-sm text-green-400">✓ 已選照片：{photo.name}</p>}
{photo && <img src={URL.createObjectURL(photo)} alt="照片預覽" className="mt-3 h-32 w-32 rounded-xl object-cover" />}
{photo && <button type="button" onClick={() => setPhoto(null)}>移除照片</button>} 
          <textarea
            className="mt-6 w-full rounded-xl bg-slate-800 p-4"
            rows={3}
            value={text}
           onChange={(e) => setText(e.target.value.slice(0, 30))}
           maxLength={30}
           placeholder="分享今天的光點（30字內）"
          />

          <button type="button"
         onClick={async () => {
if (isSubmitting) return;
setIsSubmitting(true);
          const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
}).format(new Date());
const { data: todayPoints, error: queryError } = await supabase
  .from("light_points")
  .select("created_at")
  .eq("employee_id", "A001")
  .eq("light_date", today)
  .order("created_at", { ascending: false });

  if (queryError) {
  alert(queryError.message);
 setIsSubmitting(false);
  return;
}
if ((todayPoints?.length ?? 0) >= 5) {
  alert("今天已達 5 個光點上限！");
 setIsSubmitting(false);
  return;
}
 if (todayPoints && todayPoints.length > 0) {
  const lastTime = new Date(todayPoints[0].created_at);
  const now = new Date();

  const diffMinutes =
    (now.getTime() - lastTime.getTime()) / 1000 / 60;

if (diffMinutes < 60) {
  alert("距離上一次點光未滿一小時，本次內容不會保留");
  setText("");
  setPhoto(null);
  return;
}
} 
let photoUrl: string | null = null;

if (photo) {
  const fileExt = photo.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("light-photos")
    .upload(fileName, photo);

  if (uploadError) {
    alert(uploadError.message);
    setIsSubmitting(false);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("light-photos")
    .getPublicUrl(fileName);

  photoUrl = publicUrlData.publicUrl;
}
const { error } = await supabase
.from("light_points")
.insert({
  employee_id: "A001",
  light_date: today,
  light_text: text,
light_photo: photoUrl,
});

  if (error) {
    alert(error.message);
 setIsSubmitting(false);  
    return;
  }
setIsSubmitting(false);
  alert("發布成功");
router.push("/");
router.refresh();
}}
          disabled={text.trim() === "" && !photo}
            className="mt-6 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900"
          >
            發布光點
          </button>

        </section>

      </div>
    </main>
  );
}