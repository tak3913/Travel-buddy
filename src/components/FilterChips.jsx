import { useApp } from "../context/AppContext.jsx";
import { FILTER_KEYS } from "../data/i18n.js";

export default function FilterChips() {
  const { activeFilters, toggleFilter, t } = useApp();

  return (
    <div className="mx-auto flex max-w-wrap gap-2.5 overflow-x-auto px-5 pb-4 no-scrollbar sm:px-8">
      {FILTER_KEYS.map((key) => {
        const active = activeFilters.includes(key);
        return (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
              active
                ? "border-brand-primary bg-brand-primary text-white shadow-chipActive"
                : "border-brand-border bg-white text-brand-sub hover:border-brand-primary hover:text-brand-primaryDark"
            }`}
          >
            {t.filters[key]}
          </button>
        );
      })}
    </div>
  );
}
