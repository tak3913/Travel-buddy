import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { requireSupabase } from "../lib/supabase.js";

export default function GuideInboxPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [proposalByInquiry, setProposalByInquiry] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const client = requireSupabase();
      const [{ data: inquiryData, error: inquiryError }, { data: proposalData, error: proposalError }] = await Promise.all([
        client.from("inquiries").select("*").eq("guide_owner_id", currentUser.id).order("created_at", { ascending: false }),
        client.from("trip_proposals").select("id, inquiry_id, status").eq("guide_owner_id", currentUser.id),
      ]);
      if (inquiryError || proposalError) setError(inquiryError?.message || proposalError?.message);
      else { setInquiries(inquiryData || []); setProposalByInquiry(Object.fromEntries((proposalData || []).map((item) => [item.inquiry_id, item]))); }
    }
    load().catch((loadError) => setError(loadError.message));
  }, [currentUser.id]);

  const proposalLabel = { draft: "작성 중", sent: "답변 전송됨", accepted: "예약 확정", declined: "다른 제안 선택", withdrawn: "철회됨" };
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-10"><h1 className="mt-6 font-display text-3xl font-semibold text-brand-ink">가이드 문의함</h1><p className="mt-2 text-sm text-brand-sub">여행객의 요청을 확인하고 일정·가격·조건을 담은 제안서를 보내세요.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<div className="mt-7 space-y-3">{inquiries.map((inquiry) => { const proposal = proposalByInquiry[inquiry.id]; return <section key={inquiry.id} className="rounded-2xl border border-brand-border bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold text-brand-primary">{inquiry.guide_name}</p><h2 className="mt-1 font-semibold text-brand-ink">{inquiry.trip_start} ~ {inquiry.trip_end} · {inquiry.party_size}명</h2><p className="mt-2 text-sm leading-6 text-brand-sub whitespace-pre-wrap">{inquiry.message}</p></div>{proposal && <span className="h-fit rounded-full bg-brand-primaryLight px-2.5 py-1 text-xs font-semibold text-brand-primary">{proposalLabel[proposal.status]}</span>}</div>{proposal?.status === "accepted" ? <button onClick={() => navigate(`/trips/proposals/${proposal.id}/plan`)} className="mt-5 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white">여행 계획표 작성·관리</button> : <button onClick={() => navigate(`/guide-inbox/${inquiry.id}/proposal`)} className="mt-5 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white">{proposal ? "제안서 보기·수정" : "제안서 작성"}</button>}</section>; })}{inquiries.length === 0 && <div className="rounded-2xl border border-dashed border-brand-border p-10 text-center text-sm text-brand-sub">아직 도착한 문의가 없어요.</div>}</div></main>;
}
