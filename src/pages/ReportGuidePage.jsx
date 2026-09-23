import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useGuides } from "../context/GuidesContext.jsx";
import { requireSupabase } from "../lib/supabase.js";
import { pickLang } from "../utils/lang.js";
import { useApp } from "../context/AppContext.jsx";

const reasons = [
  ["inappropriate", "부적절한 콘텐츠"],
  ["misleading", "허위·과장 정보"],
  ["safety", "안전 관련 우려"],
  ["copyright", "저작권·사칭 문제"],
  ["other", "기타"],
];

export default function ReportGuidePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { guides } = useGuides();
  const { lang } = useApp();
  const guide = guides.find((item) => String(item.id) === String(id));
  const [reason, setReason] = useState("inappropriate");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!guide || !guide.ownerId) {
    return <div className="mx-auto max-w-xl px-6 py-16 text-center text-sm text-brand-sub">이 가이드는 아직 신고 접수를 지원하지 않아요.</div>;
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { error: reportError } = await requireSupabase().from("guide_reports").insert({
        guide_id: guide.id,
        guide_name: pickLang(guide.brand, lang),
        reporter_id: currentUser.id,
        reason,
        details: details.trim() || null,
      });
      if (reportError?.code === "23505") throw new Error("이미 이 가이드를 신고했어요. 관리자가 검토 중입니다.");
      if (reportError) throw reportError;
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "신고 접수에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
      <Link to={`/guide/${guide.id}`} className="text-sm text-brand-sub hover:text-brand-primary">← 가이드 소개로 돌아가기</Link>
      <h1 className="mt-6 font-display text-2xl font-semibold text-brand-ink">가이드 신고하기</h1>
      <p className="mt-2 text-sm leading-6 text-brand-sub">{pickLang(guide.brand, lang)}에 관한 신고를 검토팀에 전달합니다. 허위 신고는 제재될 수 있어요.</p>
      <form onSubmit={submit} className="mt-7 space-y-5 rounded-2xl border border-brand-border bg-white p-6">
        <label className="block text-sm font-medium text-brand-ink">신고 사유
          <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-primary">
            {reasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-brand-ink">상세 내용 <span className="font-normal text-brand-sub">(선택)</span>
          <textarea rows={6} maxLength={1000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="관리자가 확인할 수 있도록 구체적인 내용을 적어주세요." className="mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-primary" />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={submitting} className="w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "접수 중…" : "신고 접수하기"}</button>
      </form>
    </main>
  );
}
