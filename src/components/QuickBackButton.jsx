import { useNavigate } from "react-router-dom";

export default function QuickBackButton() {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
  return <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-brand-ink shadow-sm transition hover:border-brand-primary hover:text-brand-primary">← <span>이전</span></button>;
}
