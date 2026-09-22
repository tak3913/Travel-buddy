import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useGuides } from "../context/GuidesContext.jsx";
import { requireSupabase } from "../lib/supabase.js";
import { pickLang } from "../utils/lang.js";
import { useApp } from "../context/AppContext.jsx";

const inputClass =
  "w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primaryLight";

export default function InquiryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { guides } = useGuides();
  const { currentUser } = useAuth();
  const { lang } = useApp();
  const guide = guides.find((item) => String(item.id) === String(id));
  const [form, setForm] = useState({
    tripStart: "",
    tripEnd: "",
    partySize: "1",
    preferredLanguage: "ko",
    message: "",
    agreed: false,
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!guide) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-brand-sub">가이드를 찾을 수 없어요.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand-primary">홈으로 돌아가기</Link>
      </div>
    );
  }

  const guideName = pickLang(guide.brand, lang);
  const firstPhoto = guide.photos?.[0];
  const guidePhotoUrl = String(firstPhoto || "1015").startsWith("http")
    ? firstPhoto
    : `https://picsum.photos/id/${firstPhoto || 1015}/200/200`;
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.tripEnd < form.tripStart) {
      setError("여행 종료일은 시작일 이후로 선택해주세요.");
      return;
    }
    if (!form.agreed) {
      setError("문의 전달을 위한 개인정보 수집·이용에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await requireSupabase().from("inquiries").insert({
        guide_id: String(guide.id),
        guide_name: guideName,
        guide_owner_id: guide.ownerId || null,
        requester_id: currentUser.id,
        trip_start: form.tripStart,
        trip_end: form.tripEnd,
        party_size: Number(form.partySize),
        preferred_language: form.preferredLanguage,
        message: form.message.trim(),
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message || "문의 전송에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
        <section className="w-full rounded-3xl border border-brand-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primaryLight text-2xl text-brand-primary">✓</div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-brand-ink">문의가 전달되었어요</h1>
          <p className="mt-3 text-sm leading-6 text-brand-sub">
            {guideName}님이 확인 후 답변할 거예요. 답변 기능이 준비되면 내 문의함에서 진행 상황을 확인할 수 있어요.
          </p>
          <button onClick={() => navigate("/")} className="mt-7 w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white hover:bg-brand-primaryDark">
            다른 가이드 둘러보기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bgSoft py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-5 sm:px-6">
        <Link to={`/guide/${guide.id}`} className="inline-flex text-sm text-brand-sub hover:text-brand-primary">← 가이드 소개로 돌아가기</Link>
        <h1 className="mt-5 font-display text-3xl font-semibold text-brand-ink">여행 계획 문의하기</h1>
        <p className="mt-2 text-sm text-brand-sub">여행 계획을 알려주시면 가이드가 더 알맞게 답변할 수 있어요.</p>

        <section className="mt-7 flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-4">
          <img src={guidePhotoUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <div>
            <p className="text-xs font-semibold text-brand-primary">문의할 가이드</p>
            <h2 className="mt-0.5 font-semibold text-brand-ink">{guideName}</h2>
            <p className="mt-0.5 text-xs text-brand-sub">{guide.handle}</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6 rounded-2xl border border-brand-border bg-white p-5 sm:p-7">
          <section>
            <h2 className="text-base font-semibold text-brand-ink">여행 기본 정보</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-brand-ink">여행 시작일
                <input type="date" required min={new Date().toISOString().slice(0, 10)} value={form.tripStart} onChange={(event) => update("tripStart", event.target.value)} className={`${inputClass} mt-1.5`} />
              </label>
              <label className="text-sm font-medium text-brand-ink">여행 종료일
                <input type="date" required min={form.tripStart || new Date().toISOString().slice(0, 10)} value={form.tripEnd} onChange={(event) => update("tripEnd", event.target.value)} className={`${inputClass} mt-1.5`} />
              </label>
              <label className="text-sm font-medium text-brand-ink">여행 인원
                <select value={form.partySize} onChange={(event) => update("partySize", event.target.value)} className={`${inputClass} mt-1.5`}>
                  {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}명{count === 6 ? " 이상" : ""}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-brand-ink">답변 희망 언어
                <select value={form.preferredLanguage} onChange={(event) => update("preferredLanguage", event.target.value)} className={`${inputClass} mt-1.5`}>
                  <option value="ko">한국어</option><option value="en">English</option><option value="ja">日本語</option><option value="zh">中文</option>
                </select>
              </label>
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-brand-ink">가이드에게 전할 내용</label>
            <p className="mt-1 text-xs text-brand-sub">가고 싶은 곳, 관심사, 예산, 궁금한 점을 자유롭게 적어주세요.</p>
            <textarea required rows={7} maxLength={1000} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="예: 친구와 2박 3일로 서울을 방문해요. 성수·한남 쪽의 로컬 맛집과 사진 찍기 좋은 곳을 알고 싶어요." className={`${inputClass} mt-3 resize-y leading-6`} />
            <p className="mt-1 text-right text-xs text-brand-faint">{form.message.length}/1000</p>
          </section>

          <label className="flex items-start gap-2 rounded-xl bg-brand-bgSoft p-3 text-xs leading-5 text-brand-sub">
            <input type="checkbox" required checked={form.agreed} onChange={(event) => update("agreed", event.target.checked)} className="mt-0.5" />
            <span>문의 전달을 위해 입력한 여행 정보가 해당 가이드와 공유되는 것에 동의합니다. (필수)</span>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-brand-primary py-3.5 text-sm font-semibold text-white hover:bg-brand-primaryDark disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "문의 전송 중…" : `${guideName.split(" ")[0]}님에게 문의 보내기`}
          </button>
        </form>
      </div>
    </main>
  );
}
