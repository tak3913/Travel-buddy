import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { requireSupabase } from "../lib/supabase.js";

export default function MyGuidesPage() {
  const { currentUser } = useAuth();
  const [guides, setGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    const client = requireSupabase();
    const [{ data: guideData, error: guideError }, { data: requestData, error: requestError }] = await Promise.all([
      client.from("guides").select("id, brand, handle, status, created_at").eq("owner_id", currentUser.id).order("created_at", { ascending: false }),
      client.from("guide_deletion_requests").select("guide_id, status").eq("owner_id", currentUser.id),
    ]);
    if (guideError || requestError) setError(guideError?.message || requestError?.message);
    else { setGuides(guideData); setRequests(requestData); }
  }

  useEffect(() => { load().catch((loadError) => setError(loadError.message)); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function changeVisibility(guide, status) {
    setError("");
    const { error: updateError } = await requireSupabase().from("guides").update({ status }).eq("id", guide.id);
    if (updateError) setError(updateError.message);
    else setGuides((items) => items.map((item) => item.id === guide.id ? { ...item, status } : item));
  }

  async function requestDeletion(guide) {
    const reason = window.prompt("삭제 요청 사유를 입력해주세요. (선택)");
    if (reason === null) return;
    setError("");
    const { error: requestError } = await requireSupabase().from("guide_deletion_requests").insert({
      guide_id: guide.id, guide_name: guide.brand?.ko || guide.handle,
      owner_id: currentUser.id, reason: reason.trim() || null,
    });
    if (requestError?.code === "23505") setError("이미 삭제 검토를 요청한 카드예요.");
    else if (requestError) setError(requestError.message);
    else setRequests((items) => [...items, { guide_id: guide.id, status: "pending" }]);
  }

  const requestByGuide = Object.fromEntries(requests.map((item) => [item.guide_id, item]));
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <Link to="/" className="text-sm text-brand-sub hover:text-brand-primary">← 홈으로</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-semibold text-brand-ink">내 가이드 관리</h1><p className="mt-2 text-sm text-brand-sub">공개 상태를 관리하고 삭제 검토를 요청할 수 있어요.</p></div><Link to="/guides/new" className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white">새 카드 등록</Link></div>
      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="mt-7 space-y-3">
        {guides.map((guide) => {
          const deletionRequest = requestByGuide[guide.id];
          const immutable = guide.status === "hidden" || guide.status === "deleted";
          return <section key={guide.id} className="rounded-2xl border border-brand-border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-brand-ink">{guide.brand?.ko || guide.handle}</h2><p className="mt-1 text-sm text-brand-sub">{guide.handle}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${guide.status === "published" ? "bg-green-50 text-green-700" : "bg-brand-primaryLight text-brand-primary"}`}>{guide.status === "published" ? "공개" : guide.status === "hidden" ? "관리자 숨김" : guide.status === "deleted" ? "삭제됨" : "비공개"}</span></div><div className="mt-5 flex flex-wrap gap-2">{!immutable && <button onClick={() => changeVisibility(guide, guide.status === "published" ? "private" : "published")} className="rounded-lg border border-brand-border px-3 py-2 text-sm font-medium text-brand-ink">{guide.status === "published" ? "비공개 전환" : "공개 전환"}</button>}{!immutable && (deletionRequest ? <span className="rounded-lg bg-brand-bgSoft px-3 py-2 text-sm text-brand-sub">삭제 요청 검토 중</span> : <button onClick={() => requestDeletion(guide)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600">삭제 요청</button>)}</div></section>;
        })}
        {guides.length === 0 && <div className="rounded-2xl border border-dashed border-brand-border p-10 text-center text-sm text-brand-sub">아직 등록한 가이드 카드가 없어요.</div>}
      </div>
    </main>
  );
}
