import { Link, useLocation } from "react-router-dom";

export default function QuickHomeButton() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return <Link to="/" className="fixed right-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-brand-ink shadow-md transition hover:border-brand-primary hover:text-brand-primary sm:right-7 sm:top-6">⌂ <span>홈</span></Link>;
}
