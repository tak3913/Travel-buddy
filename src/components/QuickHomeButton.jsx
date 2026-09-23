import { Link } from "react-router-dom";

export default function QuickHomeButton() {
  return <Link to="/" className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-brand-ink shadow-sm transition hover:border-brand-primary hover:text-brand-primary">⌂ <span>홈</span></Link>;
}
