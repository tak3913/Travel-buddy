import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { LANGS } from "../data/i18n.js";
import { GlobeIcon } from "../icons/Icons.jsx";

export default function LangSwitcher() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currentLabel = LANGS.find((l) => l.code === lang)?.label;

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-sub transition-colors hover:border-brand-primary hover:text-brand-primaryDark"
      >
        <GlobeIcon className="text-brand-sub" />
        <span className="hidden sm:inline">{currentLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-32 overflow-hidden rounded-xl border border-brand-border bg-white shadow-dropdown">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm ${
                l.code === lang
                  ? "bg-brand-primaryLight text-brand-primary"
                  : "text-brand-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
