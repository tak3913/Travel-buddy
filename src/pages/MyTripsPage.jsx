import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { requireSupabase } from "../lib/supabase.js";

export default function MyTripsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");

  async function load() { const client = requireSupabase(); const [{ data: inquiryData, error: inquiryError }, { data: proposalData, error: proposalError }] = await Promise.all([client.from("inquiries").select("*").eq("requester_id", currentUser.id).order("created_at", { ascending: false }), client.from("trip_proposals").select("*").order("created_at", { ascending: false })]); if (inquiryError || proposalError) setError(inquiryError?.message || proposalError?.message); else { setInquiries(inquiryData || []); setProposals(proposalData || []); } }
  useEffect(() => { load().catch((loadError) => setError(loadError.message)); }, [currentUser.id]);
  async function accept(proposal) { if (!window.confirm("이 가이드 제안을 수락할까요? 결제 기능은 아직 연결되지 않으며, 수락 후 가이드가 여행 계획을 작성합니다.")) return; const { error: acceptError } = await requireSupabase().rpc("accept_trip_proposal", { proposal_id: proposal.id }); if (acceptError) setError(acceptError.message); else { await load(); navigate(`/trips/proposals/${proposal.id}/plan`); } }
  const proposalByInquiry = Object.fromEntries(proposals.map((proposal) => [proposal.inquiry_id, proposal]));
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-10"><h1 className="mt-6 font-display text-3xl font-semibold text-brand-ink">내 여행 문의</h1><p className="mt-2 text-sm text-brand-sub">가이드의 여행 제안을 확인하고 마음에 드는 제안을 수락하세요.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<div className="mt-7 space-y-4">{inquiries.map((inquiry) => { const proposal = proposalByInquiry[inquiry.id]; return <section key={inquiry.id} className="rounded-2xl border border-brand-border bg-white p-5"><p className="text-xs font-semibold text-brand-primary">{inquiry.guide_name}</p><h2 className="mt-1 font-semibold text-brand-ink">{inquiry.trip_start} ~ {inquiry.trip_end} · {inquiry.party_size}명</h2>{!proposal && <p className="mt-4 text-sm text-brand-sub">가이드의 답변을 기다리고 있어요.</p>}{proposal?.status === "sent" && <div className="mt-4 rounded-xl bg-brand-bgSoft p-4"><p className="font-semibold text-brand-ink">{proposal.quoted_price.toLocaleString()} {proposal.currency}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-brand-sub">{proposal.message}</p>{proposal.inclusions && <p className="mt-2 text-sm text-brand-ink">포함 사항: {proposal.inclusions}</p>}<button onClick={() => accept(proposal)} className="mt-4 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white">이 제안 수락하기</button></div>}{proposal?.status === "accepted" && <div className="mt-4 rounded-xl bg-green-50 p-4"><p className="font-semibold text-green-700">예약이 확정되었어요</p><button onClick={() => navigate(`/trips/proposals/${proposal.id}/plan`)} className="mt-3 text-sm font-semibold text-brand-primary">여행 계획 확인하기 →</button></div>}{proposal && !["sent", "accepted"].includes(proposal.status) && <p className="mt-4 text-sm text-brand-sub">제안 상태: {proposal.status}</p>}</section>; })}{inquiries.length === 0 && <div className="rounded-2xl border border-dashed border-brand-border p-10 text-center text-sm text-brand-sub">아직 보낸 여행 문의가 없어요.</div>}</div></main>;
}
