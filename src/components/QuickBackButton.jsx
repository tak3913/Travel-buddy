import { useLocation, useNavigate } from "react-router-dom";

export default function QuickBackButton() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (pathname === "/") return null;
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
  return <button type="button" onClick={goBack} className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-brand-ink shadow-md transition hover:border-brand-primary hover:text-brand-primary sm:left-7 sm:top-6">← <span>이전</span></button>;
}
